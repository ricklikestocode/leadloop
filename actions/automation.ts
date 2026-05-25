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
