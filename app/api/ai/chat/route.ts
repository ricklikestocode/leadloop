import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateAssistantReply } from "@/lib/ai";

/**
 * POST /api/ai/chat
 * 
 * Chat with Internal AI assistant
 * 
 * Request body:
 * {
 *   userMessage: string
 *   conversationId?: string (optional context)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    const body = await request.json();
    const { userMessage, conversationId } = body;

    if (!userMessage || typeof userMessage !== "string") {
      return NextResponse.json(
        { error: "userMessage is required and must be a string" },
        { status: 400 }
      );
    }

    let workspaceUser = null;
    let workspace = null;

    if (session?.user?.id) {
      // Fetch workspace context for logged-in users
      workspaceUser = await db.workspaceUser.findFirst({
        where: { userId: session.user.id },
        include: {
          workspace: {
            include: {
              settings: true,
              leads: {
                take: 5,
                orderBy: { updatedAt: "desc" }
              }
            }
          }
        }
      });
      
      if (workspaceUser) {
        workspace = workspaceUser.workspace;
      }
    }

    const settings = workspace?.settings;

    // Call Internal Assistant service
    const result = await generateAssistantReply(userMessage, {
      context: {
        businessName: (settings as any)?.businessName || undefined,
        businessType: settings?.businessType || "Generic Business",
        targetAudience: (settings as any)?.targetAudience || undefined,
        businessTone: settings?.businessTone || "PROFESSIONAL",
        businessDescription: settings?.businessDescription || undefined,
        tonePreference: settings?.tonePreference || undefined,
        pricingInfo: settings?.pricingInfo || undefined,
        servicesInfo: settings?.servicesInfo || undefined,
        conversionGoal: settings?.conversionGoal || "Growth",
        businessAnalysis: settings?.businessAnalysis || undefined,
        workspaceData: workspace ? {
          name: workspace.name,
          plan: workspace.plan,
          stats: {
            messages: workspace.messageCount,
            leads: workspace.leadCount,
            aiCalls: workspace.aiCallCount
          }
        } : {
          name: "Visitor Mode",
          plan: "ANONYMOUS",
          stats: { messages: 0, leads: 0, aiCalls: 0 }
        },
        recentLeads: workspace?.leads.map(l => ({
          name: l.name,
          status: l.status,
          company: l.company
        })) || []
      }
    });

    if (!result.success) {
      return NextResponse.json(
        { 
          error: result.error || "Failed to generate AI response",
          provider: result.provider
        },
        { status: 500 }
      );
    }

    // Increment AI call count if workspace exists
    if (workspace?.id) {
      await db.workspace.update({
        where: { id: workspace.id },
        data: { aiCallCount: { increment: 1 } }
      });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      provider: result.provider,
    });
  } catch (error: any) {
    console.error("[AI Chat API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
