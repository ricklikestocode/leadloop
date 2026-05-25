"use server";

import { db } from "@/lib/db";
import { getSession, getUserWorkspaceId, canAccessWorkspace } from "@/lib/auth-utils";

export async function getDashboardStats() {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const workspaceId = await getUserWorkspaceId(session.user.id as string);
    if (!workspaceId) {
      return {
        success: true,
        stats: {
          totalLeads: 0,
          conversionRate: 0,
          tasksDue: 0,
          pipeline: 0,
        },
      };
    }

    // Get total leads
    const totalLeads = await db.lead.count({
      where: { workspaceId },
    });

    // Get tasks due
    const tasksDue = await db.followUp.count({
      where: {
        lead: { workspaceId },
        status: "PENDING",
        dueDate: { lte: new Date() },
      },
    });

    // Get conversion rate (closed leads / total leads)
    const closedLeads = await db.lead.count({
      where: {
        workspaceId,
        status: { in: ["CLOSED", "WON"] },
      },
    });

    const conversionRate = totalLeads > 0 ? Math.round((closedLeads / totalLeads) * 100) : 0;

    // Calculate pipeline value
    const pipelineData = await db.lead.aggregate({
      where: {
        workspaceId,
        status: { in: ["NEW", "IN_PROGRESS"] },
      },
      _sum: {
        value: true,
      },
    });
    const pipelineValue = pipelineData._sum.value || 0;

    return {
      success: true,
      stats: {
        totalLeads,
        conversionRate,
        tasksDue,
        pipeline: pipelineValue,
      },
    };
  } catch (error: any) {
    console.error("Error getting dashboard stats:", error);
    return { success: false, error: error.message };
  }
}

export async function getUserName() {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { id: session.user.id as string },
      select: { name: true },
    });

    return {
      success: true,
      name: user?.name?.split(" ")[0] || "User",
    };
  } catch (error: any) {
    console.error("Error getting user name:", error);
    return { success: false, error: error.message };
  }
}

export async function getWorkspaceAnalytics(requestedWorkspaceId?: string, dateFrom?: string, dateTo?: string) {
  try {
    const session = await getSession()
    if (!session?.user) throw new Error("Unauthorized")

    let workspaceId = requestedWorkspaceId

    // Always resolve from session if not provided or empty
    if (!workspaceId) {
      const userWorkspace = await db.workspaceUser.findFirst({
        where: { userId: session.user.id as string },
        orderBy: { createdAt: "asc" },
      })
      if (!userWorkspace) {
        // Return empty analytics rather than throwing, for new users
        return {
          success: true,
          analytics: {
            summary: {
              totalLeads: 0, leadsToday: 0, leadsThisWeek: 0, wonLeads: 0, lostLeads: 0,
              revenue: 0, totalConversations: 0, activeConversations: 0,
              messagesCount: 0, aiRepliesCount: 0, followUpsScheduled: 0,
              followupsCompleted: 0, conversionRate: 0, responseTime: 0,
            },
            daily: [],
            dateRange: { from: new Date().toISOString(), to: new Date().toISOString() },
          },
        }
      }
      workspaceId = userWorkspace.workspaceId
    } else {
      // Verify user has access to workspace
      const hasAccess = await db.workspaceUser.findFirst({
        where: {
          workspaceId,
          userId: session.user.id as string,
        },
      })

      if (!hasAccess) throw new Error("Access denied")
    }

    const startDate = dateFrom ? new Date(dateFrom) : new Date(new Date().setDate(new Date().getDate() - 30));
    const endDate = dateTo ? new Date(dateTo) : new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    // Get leads data
    const [
      totalLeads, 
      leadsToday, 
      leadsThisWeek, 
      wonLeads, 
      lostLeads,
      totalRevenue
    ] = await Promise.all([
      db.lead.count({ where: { workspaceId } }),
      db.lead.count({
        where: {
          workspaceId,
          createdAt: { gte: today },
        },
      }),
      db.lead.count({
        where: {
          workspaceId,
          createdAt: { gte: startOfWeek },
        },
      }),
      db.lead.count({
        where: {
          workspaceId,
          status: "WON",
        },
      }),
      db.lead.count({
        where: {
          workspaceId,
          status: "LOST",
        },
      }),
      db.lead.aggregate({
        where: {
          workspaceId,
          status: "WON",
        },
        _sum: {
          value: true,
        },
      }),
    ]);

    // Get conversations data
    const [
      totalConversations, 
      activeConversations,
      messagesData,
      aiRepliesData
    ] = await Promise.all([
      db.conversation.count({ where: { workspaceId } }),
      db.conversation.count({ 
        where: { 
          workspaceId,
          status: "OPEN"
        } 
      }),
      db.conversationMessage.aggregate({
        where: {
          conversation: { workspaceId },
          createdAt: { gte: startDate, lte: endDate },
        },
        _count: true,
      }),
      db.conversationMessage.aggregate({
        where: {
          conversation: { workspaceId },
          senderType: "AI",
          createdAt: { gte: startDate, lte: endDate },
        },
        _count: true,
      }),
    ]);

    // Get follow-ups data
    const [followUpsScheduled, followupsCompleted] = await Promise.all([
      db.followUp.count({
        where: {
          lead: { workspaceId },
          status: "PENDING",
        },
      }),
      db.followUp.count({
        where: {
          lead: { workspaceId },
          status: "COMPLETED",
          completedAt: { gte: startDate, lte: endDate },
        },
      }),
    ]);

    // Calculate response time (average)
    // We'll calculate based on the average delay between a RECEIVED message and the next AI reply
    const lastConversations = await db.conversation.findMany({
      where: { workspaceId },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
      take: 5,
    });

    let totalDiff = 0;
    let count = 0;

    for (const conv of lastConversations) {
      const msgs = conv.messages.reverse();
      for (let i = 0; i < msgs.length - 1; i++) {
        if (msgs[i].status === "RECEIVED" && msgs[i+1].senderType === "AI") {
          const diff = (msgs[i+1].createdAt.getTime() - msgs[i].createdAt.getTime()) / (1000 * 60);
          totalDiff += diff;
          count++;
        }
      }
    }

    const responseTime = count > 0 ? Math.round(totalDiff / count) : 0;

    // Calculate conversion rate
    const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;

    // Get daily breakdown
    const dailyAnalytics = await db.workspaceAnalytics.findMany({
      where: {
        workspaceId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: "asc" },
    });

    return {
      success: true,
      analytics: {
        summary: {
          totalLeads,
          leadsToday,
          leadsThisWeek,
          wonLeads,
          lostLeads,
          revenue: totalRevenue._sum.value || 0,
          totalConversations,
          activeConversations,
          messagesCount: messagesData._count,
          aiRepliesCount: aiRepliesData._count,
          followUpsScheduled,
          followupsCompleted,
          conversionRate: parseFloat(conversionRate.toFixed(2)),
          responseTime,
        },
        daily: dailyAnalytics,
        dateRange: {
          from: startDate.toISOString(),
          to: endDate.toISOString(),
        },
      },
    };
  } catch (error: any) {
    console.error("Error fetching workspace analytics:", error);
    return { success: false, error: error.message };
  }
}

export async function getUserAnalytics(workspaceId: string, userId: string) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const canAccess = await canAccessWorkspace(workspaceId);
    if (!canAccess) throw new Error("Access denied");

    const [leadsOwned, messagesCount, followUpsCompleted] = await Promise.all([
      db.lead.count({
        where: {
          workspaceId,
          // You might want to track lead owner separately
        },
      }),
      db.conversationMessage.count({
        where: {
          conversation: { workspaceId },
        },
      }),
      db.followUp.count({
        where: {
          userId,
          status: "COMPLETED",
        },
      }),
    ]);

    return {
      success: true,
      analytics: {
        leadsOwned,
        messagesCount,
        followUpsCompleted,
      },
    };
  } catch (error: any) {
    console.error("Error fetching user analytics:", error);
    return { success: false, error: error.message };
  }
}

export async function recordDailyAnalytics(workspaceId: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's metrics
    const newLeads = await db.lead.count({
      where: {
        workspaceId,
        createdAt: { gte: today, lt: tomorrow },
      },
    });

    const leadsWon = await db.lead.count({
      where: {
        workspaceId,
        status: "WON",
        updatedAt: { gte: today, lt: tomorrow },
      },
    });

    const followUpsSent = await db.followUp.count({
      where: {
        lead: { workspaceId },
        createdAt: { gte: today, lt: tomorrow },
      },
    });

    const followupsCompleted = await db.followUp.count({
      where: {
        lead: { workspaceId },
        status: "COMPLETED",
        completedAt: { gte: today, lt: tomorrow },
      },
    });

    const totalLeads = await db.lead.count({ where: { workspaceId } });
    const conversionRate = totalLeads > 0 ? (leadsWon / totalLeads) * 100 : 0;

    const analytics = await db.workspaceAnalytics.upsert({
      where: {
        workspaceId_date: {
          workspaceId,
          date: today,
        },
      },
      update: {
        newLeads,
        leadsWon,
        followUpsSent,
        followupsCompleted,
        conversionRate: parseFloat(conversionRate.toFixed(2)),
      },
      create: {
        workspaceId,
        date: today,
        newLeads,
        leadsWon,
        followUpsSent,
        followupsCompleted,
        conversionRate: parseFloat(conversionRate.toFixed(2)),
      },
    });

    return { success: true, analytics };
  } catch (error: any) {
    console.error("Error recording daily analytics:", error);
    return { success: false, error: error.message };
  }
}
