"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-utils";
import { createConversationSchema, assignConversationSchema } from "@/lib/validation";
import { logActivity } from "./activity";
import { ACTION_TYPES } from "@/lib/constants";
import { trackUsage } from "./automation";

/**
 * Get user's conversations from their first/default workspace
 * Helper function for pages that don't have workspaceId context
 */
export async function getUserConversations(filters?: any) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    // Get user's first workspace (order by ID since no createdAt field)
    const workspace = await db.workspaceUser.findFirst({
      where: {
        userId: session.user.id as string,
      },
      include: {
        workspace: true,
      },
    });

    if (!workspace) throw new Error("No workspace found");

    // Get conversations from this workspace
    const conversations = await db.conversation.findMany({
      where: {
        workspaceId: workspace.workspaceId,
        status: filters?.status || "OPEN",
      },
      include: {
        lead: true,
        assignedTo: true,
      },
      orderBy: {
        lastMessageAt: "desc",
      },
      take: filters?.limit || 50,
    });

    return { success: true, conversations, workspaceId: workspace.workspaceId };
  } catch (error: any) {
    console.error("Error fetching user conversations:", error);
    return { success: false, error: error.message };
  }
}

export async function createConversation(workspaceId: string, input: any) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    // Verify user has access to workspace
    const hasAccess = await db.workspaceUser.findFirst({
      where: {
        workspaceId,
        userId: session.user.id as string,
      },
    });

    if (!hasAccess) throw new Error("Access denied");

    const validatedData = createConversationSchema.parse(input);

    const conversation = await db.conversation.create({
      data: {
        workspaceId,
        leadId: validatedData.leadId,
        title: validatedData.title,
        description: validatedData.description,
        assignedToUserId: validatedData.assignedToUserId,
      },
      include: {
        lead: true,
        assignedTo: true,
      },
    });

    await logActivity({
      workspaceId,
      leadId: validatedData.leadId,
      userId: session.user.id as string,
      actionType: ACTION_TYPES.CONVERSATION_CREATED,
      description: conversation.lead 
        ? `Conversation created for lead ${conversation.lead.name}`
        : `Conversation created`,
    });

    return { success: true, conversation };
  } catch (error: any) {
    console.error("Error creating conversation:", error);
    return { success: false, error: error.message };
  }
}

export async function assignConversation(conversationId: string, input: any) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: { workspace: true, lead: true },
    });

    if (!conversation) throw new Error("Conversation not found");

    // Verify user has access to workspace
    const hasAccess = await db.workspaceUser.findFirst({
      where: {
        workspaceId: conversation.workspaceId,
        userId: session.user.id as string,
      },
    });

    if (!hasAccess) throw new Error("Access denied");

    const validatedData = assignConversationSchema.parse(input);

    const updated = await db.conversation.update({
      where: { id: conversationId },
      data: {
        assignedToUserId: validatedData.assignedToUserId,
      },
      include: {
        lead: true,
        assignedTo: true,
      },
    });

    await logActivity({
      workspaceId: conversation.workspaceId,
      leadId: conversation.leadId || undefined,
      userId: session.user.id as string,
      actionType: ACTION_TYPES.CONVERSATION_ASSIGNED,
      description: `Conversation assigned to ${updated.assignedTo?.name || "unassigned"}`,
    });

    return { success: true, conversation: updated };
  } catch (error: any) {
    console.error("Error assigning conversation:", error);
    return { success: false, error: error.message };
  }
}

export async function sendMessage(conversationId: string, content: string) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: { workspace: true },
    });

    if (!conversation) throw new Error("Conversation not found");

    // Verify user has access to workspace
    const hasAccess = await db.workspaceUser.findFirst({
      where: {
        workspaceId: conversation.workspaceId,
        userId: session.user.id as string,
      },
    });

    if (!hasAccess) throw new Error("Access denied");

    const message = await db.conversationMessage.create({
      data: {
        conversationId,
        content,
        senderType: "USER",
        status: "SENT",
      },
    });

    // --- WHATSAPP INTEGRATION ---
    // If this is a WhatsApp conversation, send the message via WhatsApp API
    if (conversation.whatsappPhoneId && conversation.whatsappConversationId) {
      const { sendWhatsAppMessage } = await import("@/lib/whatsapp");
      const settings = await db.workspaceSettings.findUnique({
        where: { workspaceId: conversation.workspaceId },
      });

      if (settings?.whatsappAccessToken) {
        const result = await sendWhatsAppMessage({
          phoneNumberId: conversation.whatsappPhoneId,
          recipientPhone: conversation.whatsappConversationId,
          messageText: content,
          accessToken: settings.whatsappAccessToken,
        });

        if (result.success) {
          await db.conversationMessage.update({
            where: { id: message.id },
            data: { whatsappMessageId: result.messageId },
          });
        } else {
          console.error("Failed to send WhatsApp message:", result.error);
          await db.conversationMessage.update({
            where: { id: message.id },
            data: { status: "FAILED" },
          });
        }
      }
    }

    // Track usage
    await trackUsage(conversation.workspaceId, 'message');

    // Update conversation metadata
    await db.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        messageCount: {
          increment: 1,
        },
      },
    });

    return { success: true, message };
  } catch (error: any) {
    console.error("Error sending message:", error);
    return { success: false, error: error.message };
  }
}

export async function getConversation(conversationId: string) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        workspace: true,
        lead: true,
        assignedTo: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) throw new Error("Conversation not found");

    // Verify user has access to workspace
    const hasAccess = await db.workspaceUser.findFirst({
      where: {
        workspaceId: conversation.workspaceId,
        userId: session.user.id as string,
      },
    });

    if (!hasAccess) throw new Error("Access denied");

    return { success: true, conversation };
  } catch (error: any) {
    console.error("Error getting conversation:", error);
    return { success: false, error: error.message };
  }
}

export async function getConversations(workspaceId: string, filters?: any) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    // Verify user has access to workspace
    const hasAccess = await db.workspaceUser.findFirst({
      where: {
        workspaceId,
        userId: session.user.id as string,
      },
    });

    if (!hasAccess) throw new Error("Access denied");

    const conversations = await db.conversation.findMany({
      where: {
        workspaceId,
        status: filters?.status || "OPEN",
      },
      include: {
        lead: true,
        assignedTo: true,
      },
      orderBy: {
        lastMessageAt: "desc",
      },
      take: filters?.limit || 50,
    });

    return { success: true, conversations };
  } catch (error: any) {
    console.error("Error fetching conversations:", error);
    return { success: false, error: error.message };
  }
}

export async function getConversationMessages(conversationId: string) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: { workspace: true },
    });

    if (!conversation) throw new Error("Conversation not found");

    // Verify user has access to workspace
    const hasAccess = await db.workspaceUser.findFirst({
      where: {
        workspaceId: conversation.workspaceId,
        userId: session.user.id as string,
      },
    });

    if (!hasAccess) throw new Error("Access denied");

    const messages = await db.conversationMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });

    return { success: true, messages };
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    return { success: false, error: error.message };
  }
}

export async function saveAIReply(
  conversationId: string,
  replyContent: string,
  autoSend: boolean = false
) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: { workspace: true },
    });

    if (!conversation) throw new Error("Conversation not found");

    // Verify user has access to workspace
    const hasAccess = await db.workspaceUser.findFirst({
      where: {
        workspaceId: conversation.workspaceId,
        userId: session.user.id as string,
      },
    });

    if (!hasAccess) throw new Error("Access denied");

    const workspace = await db.workspace.findUnique({
      where: { id: conversation.workspaceId },
      select: { plan: true, aiCallCount: true },
    });

    if (workspace && workspace.plan === "FREE" && workspace.aiCallCount >= 50) {
      throw new Error("AI call limit reached for FREE plan. Please upgrade to Pro.");
    }

    const message = await db.conversationMessage.create({
      data: {
        conversationId,
        content: replyContent,
        senderType: "AI",
        status: autoSend ? "SENT" : "SUGGESTED",
      },
    });

    // --- WHATSAPP INTEGRATION ---
    if (autoSend && conversation.whatsappPhoneId && conversation.whatsappConversationId) {
      const { sendWhatsAppMessage } = await import("@/lib/whatsapp");
      const settings = await db.workspaceSettings.findUnique({
        where: { workspaceId: conversation.workspaceId },
      });

      if (settings?.whatsappAccessToken) {
        const result = await sendWhatsAppMessage({
          phoneNumberId: conversation.whatsappPhoneId,
          recipientPhone: conversation.whatsappConversationId,
          messageText: replyContent,
          accessToken: settings.whatsappAccessToken,
        });

        if (result.success) {
          await db.conversationMessage.update({
            where: { id: message.id },
            data: { whatsappMessageId: result.messageId },
          });
        } else {
          await db.conversationMessage.update({
            where: { id: message.id },
            data: { status: "FAILED" },
          });
        }
      }
    }

    // Track usage
    await trackUsage(conversation.workspaceId, 'message');
    await trackUsage(conversation.workspaceId, 'ai');

    // Update conversation metadata
    await db.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        messageCount: {
          increment: 1,
        },
      },
    });

    return { success: true, message };
  } catch (error: any) {
    console.error("Error saving AI reply:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get the latest suggested reply for a conversation
 */
export async function getSuggestedReply(conversationId: string) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const suggestion = await db.conversationMessage.findFirst({
      where: {
        conversationId,
        senderType: "AI",
        status: "SUGGESTED",
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, suggestion };
  } catch (error: any) {
    console.error("Error fetching suggested reply:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Discard a suggested reply
 */
export async function discardSuggestedReply(messageId: string) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    await db.conversationMessage.delete({
      where: { id: messageId, status: "SUGGESTED" },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error discarding suggestion:", error);
    return { success: false, error: error.message };
  }
}
/**
 * Mark a conversation as converted
 */
export async function markAsConverted(conversationId: string, value: number = 0) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: { lead: true },
    });

    if (!conversation) throw new Error("Conversation not found");

    const updated = await db.conversation.update({
      where: { id: conversationId },
      data: {
        conversionStatus: "CONVERTED",
        status: "CLOSED",
      },
    });

    if (conversation.leadId) {
      await db.lead.update({
        where: { id: conversation.leadId },
        data: {
          status: "WON",
          value: { increment: value },
        },
      });
    }

    await logActivity({
      workspaceId: conversation.workspaceId,
      leadId: conversation.leadId || undefined,
      userId: session.user.id,
      actionType: ACTION_TYPES.LEAD_WON,
      description: `Lead ${conversation.lead?.name || ""} marked as converted!`,
    });

    return { success: true, conversation: updated };
  } catch (error: any) {
    console.error("Error marking as converted:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Update conversation intent manually
 */
export async function updateConversationIntent(conversationId: string, intent: string) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    await db.conversation.update({
      where: { id: conversationId },
      data: { intent },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error updating intent:", error);
    return { success: false, error: error.message };
  }
}
