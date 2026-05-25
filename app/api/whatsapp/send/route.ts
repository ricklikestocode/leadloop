import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { sendConversationMessageViaWhatsApp } from "@/lib/whatsapp";

/**
 * POST /api/whatsapp/send
 * Send a message via WhatsApp (or store if WhatsApp not enabled)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { conversationId, message, sendViaWhatsApp = true } = body;

    if (!conversationId || !message) {
      return NextResponse.json(
        { error: "Missing conversationId or message" },
        { status: 400 }
      );
    }

    // Verify access to conversation
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: { workspace: true },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const hasAccess = await db.workspaceUser.findFirst({
      where: {
        workspaceId: conversation.workspaceId,
        userId: session.user.id,
      },
    });

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Send message
    const result = await sendConversationMessageViaWhatsApp(
      conversationId,
      message,
      sendViaWhatsApp
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[/api/whatsapp/send] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send message" },
      { status: 500 }
    );
  }
}
