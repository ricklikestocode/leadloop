"use server";

import { db } from "@/lib/db";
import { getSession, getUserWorkspaceId } from "@/lib/auth-utils";
import { generateAIReply } from "@/lib/ai";


/**
 * Checks for conversations where the last message was from the user 
 * and no reply has been sent for X hours.
 * Upgraded to use HIGH-CONVERSION SALES ENGINE.
 */
export async function triggerStaleFollowUps(hours: number = 24) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const workspaceId = await getUserWorkspaceId(session.user.id as string);
    if (!workspaceId) throw new Error("No workspace found");

    const settings = await db.workspaceSettings.findUnique({
      where: { workspaceId },
    });

    const staleTime = new Date();
    staleTime.setHours(staleTime.getHours() - hours);

    const staleConversations = await db.conversation.findMany({
      where: {
        workspaceId,
        status: "OPEN",
        lastMessageAt: { lte: staleTime },
      },
      include: {
        lead: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    const results = [];

    for (const conv of staleConversations) {
      // Don't follow up if the last message was from AI/System
      const lastMessage = conv.messages[0];
      if (lastMessage?.senderType !== "USER") continue;

      // Generate AI follow-up using Sales Engine
      const aiResponse = await generateAIReply("User has been inactive. Generate a strategic follow-up.", {
        conversationHistory: conv.messages.reverse().map(m => ({
          role: m.senderType === "USER" ? "user" : "assistant",
          content: m.content,
        })),
        context: {
          leadName: conv.lead?.name || undefined,
          leadCompany: conv.lead?.company || undefined,
          leadStatus: conv.lead?.status || undefined,
          businessType: settings?.businessType || undefined,
          businessTone: settings?.businessTone || "PROFESSIONAL",
          businessDescription: settings?.businessDescription || undefined,
          businessAnalysis: settings?.businessAnalysis || undefined,
          tonePreference: settings?.tonePreference || undefined,
          pricingInfo: settings?.pricingInfo || undefined,
          servicesInfo: settings?.servicesInfo || undefined,
          conversionGoal: settings?.conversionGoal || "BOOK_CALL",
        }
      });

      if (aiResponse.success && aiResponse.message) {
        const isAutoReplyEnabled = settings?.autoReplyEnabled;
        
        if (isAutoReplyEnabled && conv.whatsappPhoneId && conv.whatsappConversationId) {
          // Send immediately via WhatsApp
          const { sendWhatsAppMessage } = await import("@/lib/whatsapp");
          const sent = await sendWhatsAppMessage({
            phoneNumberId: conv.whatsappPhoneId,
            recipientPhone: conv.whatsappConversationId,
            messageText: aiResponse.message,
            accessToken: settings?.whatsappAccessToken || "",
          });

          if (sent.success) {
            await db.conversationMessage.create({
              data: {
                conversationId: conv.id,
                content: aiResponse.message,
                senderType: "AI",
                messageSource: "WHATSAPP",
                whatsappMessageId: sent.messageId,
                status: "SENT",
                detectedIntent: aiResponse.intent,
              },
            });
            
            await db.conversation.update({
              where: { id: conv.id },
              data: { lastFollowUpAt: new Date(), lastMessageAt: new Date() },
            });
          }
        } else {
          // Create a suggested message
          await db.conversationMessage.create({
            data: {
              conversationId: conv.id,
              content: aiResponse.message,
              senderType: "AI",
              status: "SUGGESTED",
              detectedIntent: aiResponse.intent,
            },
          });
        }

        results.push({
          conversationId: conv.id,
          suggestedMessage: aiResponse.message,
          intent: aiResponse.intent,
        });
      }
    }

    return { success: true, triggered: results.length, details: results };
  } catch (error: any) {
    console.error("Error triggering automation:", error);
    return { success: false, error: error.message };
  }
}

/**
 * usage tracking helper
 */
export async function trackUsage(workspaceId: string, type: 'message' | 'ai' | 'lead') {
  try {
    const updateData: any = {};
    if (type === 'message') updateData.messageCount = { increment: 1 };
    if (type === 'ai') updateData.aiCallCount = { increment: 1 };
    if (type === 'lead') updateData.leadCount = { increment: 1 };

    await db.workspace.update({
      where: { id: workspaceId },
      data: updateData,
    });
    
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

/**
 * Runs the complete internal automation engine workflow for a lead.
 * Workflow: Analyzes -> Scores -> Classifies -> Tasks -> Suggested Actions -> Reminders -> Progress.
 */
export async function runLeadAutomation(leadId: string) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const workspaceId = await getUserWorkspaceId(session.user.id as string);
    if (!workspaceId) throw new Error("No workspace found");

    // Fetch lead, notes, and messages
    const lead = await db.lead.findUnique({
      where: { id: leadId },
      include: {
        leadNotes: { orderBy: { createdAt: "desc" } },
        conversations: {
          include: {
            messages: { orderBy: { createdAt: "asc" } }
          }
        }
      }
    });

    if (!lead || lead.workspaceId !== workspaceId) {
      throw new Error("Lead not found or unauthorized");
    }

    // Get workspace settings
    const settings = await db.workspaceSettings.findUnique({
      where: { workspaceId }
    });

    // Gather conversation messages
    const messages = lead.conversations.flatMap(c => c.messages);

    // Call AI Lead Intelligence analyzer
    const { analyzeLeadIntelligence } = await import("@/lib/ai");
    const analysis = await analyzeLeadIntelligence(lead, settings, lead.leadNotes, messages);

    if (!analysis.success) {
      throw new Error("Lead analysis failed");
    }

    // Save back to Lead database
    const updatedLead = await db.lead.update({
      where: { id: leadId },
      data: {
        leadScore: analysis.leadScore,
        intent: analysis.intent,
        confidenceScore: analysis.confidenceScore,
        conversionProbability: analysis.conversionProbability,
        summary: analysis.summary,
        aiSummary: analysis.summary,
        nextAction: analysis.nextAction,
        suggestedActions: JSON.stringify(analysis.suggestedActions),
        automationRun: true
      }
    });

    // Create follow-up task if recommended
    let createdTask = null;
    if (analysis.shouldCreateTask && analysis.taskTitle) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (analysis.taskDueDays || 1));
      
      createdTask = await db.followUp.create({
        data: {
          dueDate,
          status: "PENDING",
          leadId,
          userId: session.user.id as string
        }
      });

      // Update lead follow-up date
      await db.lead.update({
        where: { id: leadId },
        data: { followUpDate: dueDate }
      });
    }

    // Create reminder/notification if recommended or if lead is HOT
    let createdReminder = null;
    if (analysis.shouldCreateReminder || analysis.intent === "HOT") {
      const reminderText = analysis.reminderText || `Hot Lead "${lead.name}" requires contact!`;
      createdReminder = await db.notification.create({
        data: {
          workspaceId,
          userId: session.user.id as string,
          type: "REMINDER",
          title: `CRM Reminder: ${lead.name}`,
          message: reminderText,
          actionUrl: `/dashboard/leads?id=${leadId}`,
          read: false
        }
      });
    }

    // Track AI Call Usage
    await trackUsage(workspaceId, 'ai');

    // Create Activity Log
    await db.activityLog.create({
      data: {
        workspaceId,
        leadId,
        userId: session.user.id as string,
        actionType: "AUTOMATION_RUN",
        description: `Lead Automation completed for "${lead.name}". Score: ${analysis.leadScore}, Intent: ${analysis.intent}.`
      }
    });

    return {
      success: true,
      lead: updatedLead,
      task: createdTask,
      reminder: createdReminder,
      analysis
    };

  } catch (error: any) {
    console.error("Error running lead automation:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate contextual follow-up message for the UI
 */
export async function generateLeadFollowUpMessage(leadId: string) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const workspaceId = await getUserWorkspaceId(session.user.id as string);
    if (!workspaceId) throw new Error("No workspace found");

    const lead = await db.lead.findUnique({
      where: { id: leadId },
      include: {
        leadNotes: { orderBy: { createdAt: "desc" } },
        conversations: {
          include: {
            messages: { orderBy: { createdAt: "asc" } }
          }
        }
      }
    });

    if (!lead || lead.workspaceId !== workspaceId) {
      throw new Error("Lead not found");
    }

    const settings = await db.workspaceSettings.findUnique({
      where: { workspaceId }
    });

    const messages = lead.conversations.flatMap(c => c.messages);

    const { generateContextualFollowUp } = await import("@/lib/ai");
    const result = await generateContextualFollowUp(lead, settings, lead.leadNotes, messages);

    if (!result.success) throw new Error("Follow-up generation failed");

    // Ensure lead has a conversation to hold the suggested message
    let conversation: any = lead.conversations[0];
    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          leadId,
          workspaceId,
          title: `Chat with ${lead.name}`,
          status: "OPEN",
          messageSource: "MANUAL"
        }
      });
    }

    // Save to database as a SUGGESTED conversation message
    const suggestedMsg = await db.conversationMessage.create({
      data: {
        conversationId: conversation.id,
        content: result.followUpMessage,
        senderType: "AI",
        status: "SUGGESTED",
        detectedIntent: lead.intent || "WARM"
      }
    });

    // Also update lead's nextAction or notes
    await db.leadNote.create({
      data: {
        leadId,
        content: `[AI Generated Follow-up]: "${result.followUpMessage}"`,
        userId: session.user.id as string
      }
    });

    // Track AI usage
    await trackUsage(workspaceId, 'ai');

    return {
      success: true,
      followUpMessage: result.followUpMessage,
      reasoning: result.reasoning,
      messageId: suggestedMsg.id
    };

  } catch (error: any) {
    console.error("Error generating lead follow-up:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch stats and lists for the Automation Center Dashboard
 */
export async function getAutomationStats() {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const workspaceId = await getUserWorkspaceId(session.user.id as string);
    if (!workspaceId) throw new Error("No workspace found");

    const [
      leadsAnalyzed,
      followUpsGenerated,
      tasksCreated,
      remindersPending,
      automationRuns,
      workspace
    ] = await Promise.all([
      db.lead.count({
        where: { workspaceId, automationRun: true }
      }),
      db.conversationMessage.count({
        where: {
          conversation: { workspaceId },
          status: "SUGGESTED"
        }
      }),
      db.followUp.count({
        where: {
          lead: { workspaceId }
        }
      }),
      db.notification.count({
        where: {
          workspaceId,
          read: false,
          type: "REMINDER"
        }
      }),
      db.activityLog.count({
        where: {
          workspaceId,
          actionType: "AUTOMATION_RUN"
        }
      }),
      db.workspace.findUnique({
        where: { id: workspaceId },
        select: { aiCallCount: true }
      })
    ]);

    // Fetch recent automation activities
    const recentActivities = await db.activityLog.findMany({
      where: {
        workspaceId,
        actionType: "AUTOMATION_RUN"
      },
      orderBy: { createdAt: "desc" },
      take: 6
    });

    // Fetch leads needing attention (HOT but no follow up scheduled)
    const hotLeadsNeedingAttention = await db.lead.findMany({
      where: {
        workspaceId,
        intent: "HOT",
        followUps: {
          none: { status: "PENDING" }
        }
      },
      select: {
        id: true,
        name: true,
        leadScore: true,
        value: true
      },
      take: 5
    });

    return {
      success: true,
      stats: {
        leadsAnalyzed,
        followUpsGenerated,
        tasksCreated,
        remindersPending,
        automationRuns,
        aiActionsCompleted: workspace?.aiCallCount || 0
      },
      recentActivities,
      hotLeadsNeedingAttention
    };
  } catch (error: any) {
    console.error("Error getting automation stats:", error);
    return { success: false, error: error.message };
  }
}
