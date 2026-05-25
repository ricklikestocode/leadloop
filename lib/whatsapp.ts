/**
 * WhatsApp Service - Send and manage WhatsApp messages
 */

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { generateAIReply, formatConversationHistory } from "@/lib/ai";

interface WhatsAppMessage {
  phoneNumberId: string;
  recipientPhone: string;
  messageText: string;
  accessToken: string;
}

interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send a message via WhatsApp Cloud API
 */
export async function sendWhatsAppMessage(
  options: WhatsAppMessage
): Promise<WhatsAppResponse> {
  try {
    const { phoneNumberId, recipientPhone, messageText, accessToken } = options;

    if (!phoneNumberId || !recipientPhone || !messageText || !accessToken) {
      console.error("[WhatsApp Service] Missing parameters:", { phoneNumberId, recipientPhone, hasToken: !!accessToken });
      return {
        success: false,
        error: "Missing required parameters",
      };
    }

    // Clean recipient phone number (remove +, spaces, etc.)
    const cleanPhone = recipientPhone.replace(/\D/g, "");

    // --- DEMO MODE BYPASS ---
    if (phoneNumberId === "DEMO") {
      console.log(`[WhatsApp Service] [DEMO MODE] Simulating message to ${cleanPhone}`);
      return {
        success: true,
        messageId: `demo-${Date.now()}`,
      };
    }

    // Send via WhatsApp API
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: cleanPhone,
          type: "text",
          text: {
            body: messageText,
          },
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("[WhatsApp Service] API Error:", result);
      return {
        success: false,
        error: result?.error?.message || "Failed to send message",
      };
    }

    const messageId = result?.messages?.[0]?.id;

    if (!messageId) {
      return {
        success: false,
        error: "No message ID returned",
      };
    }

    return {
      success: true,
      messageId,
    };
  } catch (error: any) {
    console.error("[WhatsApp Service] Error:", error);
    return {
      success: false,
      error: error.message || "Failed to send WhatsApp message",
    };
  }
}

/**
 * Handle incoming WhatsApp message from Webhook
 */
export async function handleIncomingWhatsAppMessage(payload: any, overrideWorkspaceId?: string) {
  try {
    const entry = payload.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];
    const metadata = value?.metadata;

    if (!message || !metadata) {
      return { success: false, error: "Not a message payload" };
    }

    const from = message.from; // User's phone number
    const messageText = message.text?.body;
    const phoneNumberId = metadata.phone_number_id; // Your Business Phone ID
    const waMessageId = message.id;

    if (!messageText) {
      return { success: true, message: "Non-text message received, skipping" };
    }

    // --- PHASE 2 & 3: LOOP PREVENTION & FILTERING ---
    
    // 1. Ignore if message is too short or just an emoji
    const isLowValue = (text: string) => {
      const words = text.trim().split(/\s+/);
      if (words.length < 2) return true;
      
      const lowValueWords = ["ok", "thanks", "thx", "cool", "fine", "yep", "nope"];
      if (lowValueWords.includes(text.toLowerCase().trim())) return true;
      
      // Emoji check (simple regex)
      const emojiRegex = /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u;
      if (emojiRegex.test(text.trim())) return true;
      
      return false;
    };

    if (isLowValue(messageText)) {
      console.log(`[WhatsApp Webhook] Low value message received: "${messageText}", skipping AI reply.`);
      // We still store the message but mark it as handled/no-reply-needed if we want
    }

    // 1. Find the workspace linked to this phone_number_id
    let settings = null;

    if (overrideWorkspaceId) {
      settings = await db.workspaceSettings.findUnique({
        where: { workspaceId: overrideWorkspaceId },
        include: { workspace: true },
      });
    } else {
      settings = await db.workspaceSettings.findFirst({
        where: {
          whatsappBusinessPhoneId: phoneNumberId,
        },
        include: {
          workspace: true,
        },
      });

      // Fallback to global ENV if no specific workspace setting matches the phone ID
      if (!settings && phoneNumberId === process.env.WHATSAPP_PHONE_ID) {
        console.log(`[WhatsApp Webhook] No workspace settings found for ${phoneNumberId}, but it matches global WHATSAPP_PHONE_ID. Finding default workspace.`);
        const firstWorkspace = await db.workspace.findFirst();
        if (firstWorkspace) {
          settings = await db.workspaceSettings.findUnique({
            where: { workspaceId: firstWorkspace.id },
            include: { workspace: true }
          }) as any;
        }
      }
    }

    if (!settings) {
      console.error(`[WhatsApp Webhook] No workspace found for Phone ID: ${phoneNumberId}`);
      return { success: false, error: "Workspace not found for this phone ID" };
    }

    const workspaceId = settings.workspaceId;

    // 2. Find or create lead based on phone number
    let lead = await db.lead.findFirst({
      where: {
        phone: from,
        workspaceId: workspaceId,
      },
    });

    if (!lead) {
      const contactName = value.contacts?.[0]?.profile?.name || "WhatsApp User";
      lead = await db.lead.create({
        data: {
          name: contactName,
          phone: from,
          workspaceId: workspaceId,
          source: "WHATSAPP",
          status: "NEW",
        },
      });
    }

    // 3. Find or create conversation
    let conversation = await db.conversation.findFirst({
      where: {
        leadId: lead.id,
        workspaceId: workspaceId,
        whatsappPhoneId: phoneNumberId,
      },
    });

    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          workspaceId: workspaceId,
          leadId: lead.id,
          whatsappPhoneId: phoneNumberId,
          whatsappConversationId: from,
          messageSource: "WHATSAPP",
          title: `WhatsApp Chat with ${lead.name}`,
          status: "OPEN",
        },
      });
    }

    // 4. Check for duplicate message (WhatsApp sometimes retries webhooks)
    const existingMessage = await db.conversationMessage.findFirst({
      where: {
        whatsappMessageId: waMessageId,
      },
    });

    if (existingMessage) {
      return { success: true, message: "Duplicate message, ignored" };
    }

    // 5. Save incoming message
    await db.conversationMessage.create({
      data: {
        conversationId: conversation.id,
        content: messageText,
        senderType: "USER",
        messageSource: "WHATSAPP",
        whatsappMessageId: waMessageId,
        status: "RECEIVED",
      },
    });

    // Update conversation
    await db.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessageAt: new Date(),
        messageCount: { increment: 1 },
      },
    });

    // --- PHASE 1 & 5: AI PROCESSING & RATE LIMITING ---
    const shouldGenerateReply = !isLowValue(messageText);
    
    if (shouldGenerateReply) {
      // 1. Rate Limiting Check (Phase 5)
      const tenSecondsAgo = new Date(Date.now() - 10 * 1000);
      const recentReply = await db.conversationMessage.findFirst({
        where: {
          conversationId: conversation.id,
          senderType: "AI",
          createdAt: { gte: tenSecondsAgo },
        },
      });

      if (recentReply) {
        console.log(`[WhatsApp Webhook] Rate limit hit for ${from}. Last reply was less than 10s ago.`);
        return { success: true, message: "Rate limit hit, skipping AI reply" };
      }

      console.log(`[WhatsApp Webhook] Generating AI reply for ${from}`);

      // Get last few messages for context
      const history = await db.conversationMessage.findMany({
        where: { 
          conversationId: conversation.id,
          status: { not: "SUGGESTED" } // Don't feed suggested replies back to AI as "sent" history
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      const formattedHistory = formatConversationHistory(
        history.reverse().map(m => ({
          content: m.content,
          senderType: m.senderType as any,
        }))
      );

      const aiResponse = await generateAIReply(messageText, {
        conversationHistory: formattedHistory,
        context: {
          leadName: lead.name,
          leadCompany: lead.company || undefined,
          leadStatus: lead.status,
          businessName: (settings as any).businessName || undefined,
          businessType: settings.businessType || undefined,
          targetAudience: (settings as any).targetAudience || undefined,
          businessTone: settings.businessTone,
          businessDescription: settings.businessDescription || undefined,
          businessAnalysis: settings.businessAnalysis || undefined,
          pricingInfo: settings.pricingInfo || undefined,
          servicesInfo: settings.servicesInfo || undefined,
          conversionGoal: settings.conversionGoal,
        }
      });

      if (aiResponse.success && aiResponse.message) {
        // Update conversation intent
        if (aiResponse.intent) {
          await db.conversation.update({
            where: { id: conversation.id },
            data: { intent: aiResponse.intent },
          });
        }

        const isAutoReplyEnabled = settings.autoReplyEnabled;
        
        if (isAutoReplyEnabled) {
          // --- AUTO-SEND MODE ---
          const accessToken = settings.whatsappAccessToken || process.env.WHATSAPP_ACCESS_TOKEN || "";
          
          const sent = await sendWhatsAppMessage({
            phoneNumberId: phoneNumberId,
            recipientPhone: from,
            messageText: aiResponse.message,
            accessToken: accessToken,
          });

          if (sent.success) {
            await db.conversationMessage.create({
              data: {
                conversationId: conversation.id,
                content: aiResponse.message,
                senderType: "AI",
                messageSource: "WHATSAPP",
                whatsappMessageId: sent.messageId,
                status: "SENT",
                detectedIntent: aiResponse.intent,
                reasoning: aiResponse.reasoning,
              },
            });
          } else {
            // Log failure
            await db.conversationMessage.create({
              data: {
                conversationId: conversation.id,
                content: aiResponse.message,
                senderType: "AI",
                messageSource: "WHATSAPP",
                status: "FAILED",
                detectedIntent: aiResponse.intent,
                reasoning: aiResponse.reasoning,
              },
            });
            console.error(`[WhatsApp Webhook] Failed to send auto-reply: ${sent.error}`);
          }
        } else {
          // --- MANUAL APPROVAL MODE (Phase 6 Suggestion) ---
          await db.conversationMessage.create({
            data: {
              conversationId: conversation.id,
              content: aiResponse.message,
              senderType: "AI",
              messageSource: "WHATSAPP",
              status: "SUGGESTED",
              detectedIntent: aiResponse.intent,
              reasoning: aiResponse.reasoning,
            },
          });
          console.log(`[WhatsApp Webhook] Auto-reply disabled. Stored suggestion for manual approval.`);
        }

        // Update conversation metadata
        await db.conversation.update({
          where: { id: conversation.id },
          data: {
            lastMessageAt: new Date(),
            messageCount: { increment: 1 },
          },
        });
      }
    }

    revalidatePath("/dashboard/chats");
    revalidatePath("/dashboard/conversations");
    return { success: true };
  } catch (error: any) {
    console.error("[WhatsApp Webhook] Error processing message:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Store conversation message and optionally send via WhatsApp
 */
export async function sendConversationMessageViaWhatsApp(
  conversationId: string,
  messageText: string,
  sendViaWhatsApp: boolean = true
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Fetch conversation
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        workspace: {
          include: { settings: true },
        },
        lead: true,
      },
    });

    if (!conversation) {
      return { success: false, error: "Conversation not found" };
    }

    // Store message in database
    const dbMessage = await db.conversationMessage.create({
      data: {
        conversationId,
        content: messageText,
        senderType: "USER",
        messageSource: sendViaWhatsApp ? "WHATSAPP" : "MANUAL",
      },
    });

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

    // Send via WhatsApp if enabled
    if (
      sendViaWhatsApp &&
      conversation.whatsappPhoneId &&
      conversation.whatsappConversationId &&
      conversation.workspace.settings?.whatsappAccessToken
    ) {
      const whatsAppResponse = await sendWhatsAppMessage({
        phoneNumberId: conversation.whatsappPhoneId,
        recipientPhone: conversation.whatsappConversationId,
        messageText,
        accessToken: conversation.workspace.settings.whatsappAccessToken,
      });

      if (whatsAppResponse.success) {
        // Update message with WhatsApp ID
        await db.conversationMessage.update({
          where: { id: dbMessage.id },
          data: {
            whatsappMessageId: whatsAppResponse.messageId,
          },
        });

        return {
          success: true,
          messageId: whatsAppResponse.messageId,
        };
      }
    }

    return {
      success: true,
      messageId: dbMessage.id,
    };
  } catch (error: any) {
    console.error("[WhatsApp Service] Error sending message:", error);
    return {
      success: false,
      error: error.message || "Failed to send message",
    };
  }
}

/**
 * Configure WhatsApp webhook for a workspace
 */
export async function configureWhatsAppWebhook(
  workspaceId: string,
  phoneNumberId: string,
  businessAccountId: string,
  accessToken: string,
  webhookToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Update or create workspace settings
    await db.workspaceSettings.upsert({
      where: { workspaceId },
      update: {
        whatsappBusinessPhoneId: phoneNumberId,
        whatsappBusinessAccountId: businessAccountId,
        whatsappAccessToken: accessToken,
        whatsappWebhookToken: webhookToken,
      },
      create: {
        workspaceId,
        whatsappBusinessPhoneId: phoneNumberId,
        whatsappBusinessAccountId: businessAccountId,
        whatsappAccessToken: accessToken,
        whatsappWebhookToken: webhookToken,
        autoReplyEnabled: false,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("[WhatsApp Service] Error configuring webhook:", error);
    return {
      success: false,
      error: error.message || "Failed to configure webhook",
    };
  }
}

/**
 * Enable/disable auto-reply for a workspace
 */
export async function setAutoReplySettings(
  workspaceId: string,
  enabled: boolean,
  defaultText?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.workspaceSettings.upsert({
      where: { workspaceId },
      update: {
        autoReplyEnabled: enabled,
        defaultAutoReplyText: defaultText,
      },
      create: {
        workspaceId,
        autoReplyEnabled: enabled,
        defaultAutoReplyText: defaultText,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("[WhatsApp Service] Error setting auto-reply:", error);
    return {
      success: false,
      error: error.message || "Failed to set auto-reply",
    };
  }
}

