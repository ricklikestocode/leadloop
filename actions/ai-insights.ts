"use server";

import { db } from "@/lib/db";
import { getSession, getUserWorkspaceId } from "@/lib/auth-utils";
import { generateAIReply } from "@/lib/ai";

export async function generateBusinessInsights() {
  try {
    const session = await getSession();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const workspaceId = await getUserWorkspaceId(session.user.id as string);
    if (!workspaceId) throw new Error("No workspace found");

    // Fetch data for analysis
    const [leads, conversations, recentMessages] = await Promise.all([
      db.lead.findMany({
        where: { workspaceId },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          status: true,
          source: true,
          value: true,
          createdAt: true,
        },
      }),
      db.conversation.findMany({
        where: { workspaceId },
        orderBy: { updatedAt: "desc" },
        take: 10,
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 3,
          },
        },
      }),
      db.conversationMessage.count({
        where: { conversation: { workspaceId } },
      }),
    ]);

    const leadStats = {
      total: leads.length,
      statuses: leads.reduce((acc: any, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      }, {}),
      totalValue: leads.reduce((sum, lead) => sum + (lead.value || 0), 0),
    };

    const prompt = `
      Analyze the following SaaS business data and provide 3-4 concise, actionable business insights.
      
      LEAD DATA:
      - Total Recent Leads: ${leadStats.total}
      - Status Breakdown: ${JSON.stringify(leadStats.statuses)}
      - Potential Pipeline Value: $${leadStats.totalValue}
      
      CONVERSATION DATA:
      - Active Conversations: ${conversations.length}
      - Total Messages: ${recentMessages}
      
      Format your response as a JSON array of strings. Each string should be a direct, professional insight.
      Example: ["You are losing 40% of leads after the first reply.", "Follow-ups increase conversion by 15% for leads from MANUAL sources."]
    `;

    const aiResponse = await generateAIReply(prompt, {
      context: {
        businessTone: "PROFESSIONAL",
      },
      maxTokens: 500,
    });

    if (aiResponse.success && aiResponse.message) {
      // Try to parse the JSON array from the response
      try {
        const cleanedMessage = aiResponse.message.replace(/```json|```/g, "").trim();
        const insights = JSON.parse(cleanedMessage);
        
        // Cache the insights in the workspace
        await db.workspace.update({
          where: { id: workspaceId },
          data: { aiInsights: JSON.stringify(insights) },
        });

        return { success: true, insights };
      } catch (parseError) {
        // If parsing fails, just return the raw message split by lines or as a single item
        const insights = [aiResponse.message];
        return { success: true, insights };
      }
    }

    return { success: false, error: aiResponse.error || "Failed to generate insights" };
  } catch (error: any) {
    console.error("Error generating business insights:", error);
    return { success: false, error: error.message };
  }
}

export async function getCachedInsights() {
  try {
    const session = await getSession();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const workspaceId = await getUserWorkspaceId(session.user.id);
    if (!workspaceId) throw new Error("No workspace found");

    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
      select: { aiInsights: true },
    });

    if (workspace?.aiInsights) {
      return { success: true, insights: JSON.parse(workspace.aiInsights) };
    }

    return { success: true, insights: [] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function generateLeadIntelligence(leadId: string) {
  try {
    const { runLeadAutomation } = await import("./automation");
    const result = await runLeadAutomation(leadId);
    
    if (result.success && result.lead) {
      return { 
        success: true, 
        data: {
          summary: result.lead.summary,
          nextAction: result.lead.nextAction,
          score: result.lead.leadScore,
          intent: result.lead.intent,
          confidenceScore: result.lead.confidenceScore,
          conversionProbability: result.lead.conversionProbability,
          suggestedActions: result.lead.suggestedActions,
          automationRun: result.lead.automationRun
        } 
      };
    }
    return { success: false, error: result.error || "Failed to analyze lead" };
  } catch (error: any) {
    console.error("Error generating lead intelligence:", error);
    return { success: false, error: error.message };
  }
}
