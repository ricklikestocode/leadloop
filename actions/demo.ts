"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-utils";
import { handleIncomingWhatsAppMessage } from "@/lib/whatsapp";
import { revalidatePath } from "next/cache";
import { recordDailyAnalytics } from "./analytics";
import { checkStreakMilestone } from "@/lib/retention";

/**
 * ELITE DEMO LEADS - Realistic personas with multi-message sales journeys
 * Each journey demonstrates real sales progression and AI intelligence
 */
const ELITE_DEMO_LEADS = [
  {
    id: "demo-priya",
    name: "Priya Sharma",
    company: "TechVenture Analytics",
    jobTitle: "Head of Sales",
    persona: "SaaS Founder - Small Team",
    dealValue: 5400,
    journey: [
      {
        intent: "WARM",
        message: "Hi! I saw your product demo and I'm impressed. We have 3 salespeople and we lose so many leads in follow-up. How much does this cost?",
        delay: 0,
      },
      {
        intent: "WARM",
        message: "Price seems reasonable. But I want to make sure it integrates with Slack. Do you support that?",
        delay: 2500,
      },
      {
        intent: "HOT",
        message: "Ok great! And it has WhatsApp integration? That's exactly what we need. Can we start using it today?",
        delay: 3000,
      },
    ],
  },
  {
    id: "demo-james",
    name: "James Okafor",
    company: "Growth Digital Agency",
    jobTitle: "Founder",
    persona: "Agency Owner - Services",
    dealValue: 8900,
    journey: [
      {
        intent: "COLD",
        message: "We work with 50+ clients and manage their WhatsApp. How is this different from just hiring an AI assistant?",
        delay: 0,
      },
      {
        intent: "WARM",
        message: "Interesting approach. So it learns each client's tone? That's actually pretty smart. What about scaling to 50 clients?",
        delay: 2500,
      },
      {
        intent: "WARM",
        message: "This looks good. What's the API like? Can we integrate it into our internal tools?",
        delay: 2000,
      },
    ],
  },
  {
    id: "demo-maria",
    name: "Maria Santos",
    company: "Consulting Partners Inc",
    jobTitle: "Operations Manager",
    persona: "B2B Consultant - High-Touch Sales",
    dealValue: 12500,
    journey: [
      {
        intent: "COLD",
        message: "We typically close deals through personal relationships, not automated systems. How would this help us?",
        delay: 0,
      },
      {
        intent: "WARM",
        message: "I see your point about qualifying leads faster. That could save us 20+ hours a week. Can we get a custom demo?",
        delay: 3000,
      },
      {
        intent: "HOT",
        message: "Perfect! Let's do a pilot. Can you send me the pricing for your Pro plan? We want to start next Monday.",
        delay: 2500,
      },
    ],
  },
  {
    id: "demo-rohan",
    name: "Rohan Gupta",
    company: "E-commerce Ventures",
    jobTitle: "Marketing Manager",
    persona: "High-Volume, Price-Sensitive",
    dealValue: 3200,
    journey: [
      {
        intent: "COLD",
        message: "We get 500+ leads a day but most are low quality. Is this expensive? We need to watch our CAC.",
        delay: 0,
      },
      {
        intent: "WARM",
        message: "Ok so you can actually filter out junk leads? That's useful. How accurate is the AI at this?",
        delay: 2000,
      },
      {
        intent: "WARM",
        message: "86% accuracy sounds good. What's the cost per message? We need to understand the economics.",
        delay: 2500,
      },
    ],
  },
  {
    id: "demo-lisa",
    name: "Lisa Chen",
    company: "Premium SaaS Co",
    jobTitle: "VP Sales",
    persona: "Enterprise - Strategic Buyer",
    dealValue: 24000,
    journey: [
      {
        intent: "WARM",
        message: "We've evaluated 5 competitors for this. Yours is interesting but I need to understand your security model and compliance.",
        delay: 0,
      },
      {
        intent: "WARM",
        message: "SOC 2 Type II and GDPR compliant - good. What about custom integration support? Our stack is complex.",
        delay: 3000,
      },
      {
        intent: "HOT",
        message: "This looks like what we need. Let's schedule a call with our security team. Can you work around our timeline?",
        delay: 3500,
      },
    ],
  },
]


/**
 * Get or create the user's workspace for demo
 */
async function getOrCreateUserWorkspace(userId: string): Promise<string> {
  const existing = await db.workspaceUser.findFirst({
    where: { userId },
    include: { workspace: true },
  });

  if (existing) return existing.workspaceId;

  // Create default workspace for user
  const workspace = await db.workspace.create({
    data: { name: "My Workspace", plan: "FREE" },
  });

  await db.workspaceUser.create({
    data: { workspaceId: workspace.id, userId, role: "OWNER" },
  });

  return workspace.id;
}

/**
 * Ensure workspace has demo business settings
 */
async function ensureEliteDemoSettings(workspaceId: string) {
  const existing = await db.workspaceSettings.findUnique({
    where: { workspaceId },
  });

  if (!existing) {
    await db.workspaceSettings.create({
      data: {
        workspaceId,
        whatsappBusinessPhoneId: "DEMO",
        autoReplyEnabled: true,
        businessType: "SaaS / Technology",
        businessDescription:
          "ReplyFlow AI - The AI-powered B2B sales automation platform. We help sales teams, agencies, and founders automatically handle WhatsApp leads, qualify them with AI, and close more deals. Customers report 40% better conversion rates and save 10+ hours per week. Our AI understands business context, handles objections, and adapts to your sales process.",
        businessName: "ReplyFlow AI",
        targetAudience: "B2B SaaS founders, agencies, sales teams, consultants",
        businessTone: "PROFESSIONAL",
        conversionGoal: "BOOK_CALL",
        pricingInfo: "Free: 50 msg/month | Pro: $49/mo unlimited | Enterprise: Custom",
        servicesInfo: "AI WhatsApp replies, lead scoring, follow-up automation, advanced analytics, team collaboration",
      },
    });
  } else if (!existing.businessDescription || existing.businessDescription.includes("professional B2B service business")) {
    // Upgrade to elite demo settings
    await db.workspaceSettings.update({
      where: { workspaceId },
      data: {
        whatsappBusinessPhoneId: "DEMO",
        autoReplyEnabled: true,
        businessDescription:
          "ReplyFlow AI - The AI-powered B2B sales automation platform. We help sales teams, agencies, and founders automatically handle WhatsApp leads, qualify them with AI, and close more deals. Customers report 40% better conversion rates and save 10+ hours per week. Our AI understands business context, handles objections, and adapts to your sales process.",
        businessName: "ReplyFlow AI",
        targetAudience: "B2B SaaS founders, agencies, sales teams, consultants",
      },
    });
  }
}

/**
 * Simulate an incoming WhatsApp lead with optional analytics update
 */
async function simulateSingleMessage(
  workspaceId: string,
  leadData: {
    name: string;
    company?: string;
    phone?: string;
    message: string;
  }
) {
  const phone = leadData.phone || `demo-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const name = leadData.name;
  const message = leadData.message;

  const payload = {
    entry: [
      {
        changes: [
          {
            value: {
              messaging_product: "whatsapp",
              metadata: {
                display_phone_number: "1234567890",
                phone_number_id: "DEMO",
              },
              contacts: [
                {
                  profile: {
                    name,
                  },
                  wa_id: phone,
                },
              ],
              messages: [
                {
                  from: phone,
                  id: `demo-msg-${Date.now()}`,
                  timestamp: Math.floor(Date.now() / 1000).toString(),
                  text: { body: message },
                  type: "text",
                },
              ],
            },
            field: "messages",
          },
        ],
      },
    ],
  };

  const result = await handleIncomingWhatsAppMessage(payload, workspaceId);
  return result;
}

/**
 * Simulate an incoming WhatsApp lead
 */
export async function simulateIncomingLead(
  workspaceId?: string,
  customMessage?: string,
  customPhone?: string,
  customName?: string
) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    let targetWorkspaceId = workspaceId;
    if (!targetWorkspaceId || targetWorkspaceId === "default-workspace" || targetWorkspaceId === "") {
      targetWorkspaceId = await getOrCreateUserWorkspace(session.user.id as string);
    }

    await ensureEliteDemoSettings(targetWorkspaceId);

    // Pick a random demo lead
    const demoLead = ELITE_DEMO_LEADS[Math.floor(Math.random() * ELITE_DEMO_LEADS.length)];
    const firstMessage = demoLead.journey[0];

    const result = await simulateSingleMessage(targetWorkspaceId, {
      name: customName || demoLead.name,
      company: demoLead.company,
      phone: customPhone,
      message: customMessage || firstMessage.message,
    });

    if (result.success) {
      await recordDailyAnalytics(targetWorkspaceId).catch(console.error);
      revalidatePath("/dashboard");
      revalidatePath("/dashboard/chats");
      return { success: true, message: "Lead simulated successfully", workspaceId: targetWorkspaceId };
    } else {
      return { success: false, error: result.error || "Failed to process simulated lead" };
    }
  } catch (error: any) {
    console.error("Error simulating lead:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Run an elite demo sales journey
 * Multi-message conversation showing:
 * - Realistic sales progression
 * - AI handling different intents
 * - Lead scoring progression
 * - Objection handling
 * - Conversion signal
 */
export async function runDemoJourney(workspaceId?: string) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    let targetWorkspaceId = workspaceId;
    if (!targetWorkspaceId || targetWorkspaceId === "default-workspace" || targetWorkspaceId === "") {
      targetWorkspaceId = await getOrCreateUserWorkspace(session.user.id as string);
    }

    await ensureEliteDemoSettings(targetWorkspaceId);

    // Select a random elite demo lead
    const demoLead = ELITE_DEMO_LEADS[Math.floor(Math.random() * ELITE_DEMO_LEADS.length)];
    const demoPhoneId = `demo-elite-${Date.now()}-${demoLead.id}`;

    // Execute the multi-message journey
    for (let i = 0; i < demoLead.journey.length; i++) {
      const journeyStep = demoLead.journey[i];

      // Wait before sending next message (to show natural conversation flow)
      if (i > 0) {
        await new Promise((resolve) => setTimeout(resolve, journeyStep.delay || 1500));
      }

      // Send the message
      await simulateSingleMessage(targetWorkspaceId, {
        name: demoLead.name,
        company: demoLead.company,
        phone: demoPhoneId,
        message: journeyStep.message,
      });
    }

    // Record analytics after all messages
    await recordDailyAnalytics(targetWorkspaceId).catch(console.error);
    // Check for streak milestones and create celebration notifications
    await checkStreakMilestone(targetWorkspaceId, session.user.id as string).catch(console.error);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/chats");

    return {
      success: true,
      message: `Elite demo journey started! Watching ${demoLead.name} from ${demoLead.company}...`,
      leadData: {
        name: demoLead.name,
        company: demoLead.company,
        persona: demoLead.persona,
        dealValue: demoLead.dealValue,
        messageCount: demoLead.journey.length,
      },
      workspaceId: targetWorkspaceId,
    };
  } catch (error: any) {
    console.error("Error running demo journey:", error);
    return { success: false, error: error.message };
  }
}
