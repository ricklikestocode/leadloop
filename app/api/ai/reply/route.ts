import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import {
  generateAIReply,
  formatConversationHistory,
  validateAIConfig,
} from "@/lib/ai";

/**
 * POST /api/ai/reply
 * 
 * Generate an AI-powered reply with transparency features
 * Returns: reply, reasoning, confidence score, intent classification
 * 
 * Request body:
 * {
 *   conversationId: string;
 *   userMessage: string;
 *   tone?: "professional" | "friendly" | "formal";
 * }
 */

function detectIntentAndAnalyze(message: string): {
  intent: "HOT" | "WARM" | "COLD" | "DEAD";
  confidence: number;
  hasObjection: boolean;
  objectionType?: string;
  reasoning: string;
} {
  const lowerMessage = message.toLowerCase();
  
  // HOT indicators: ready to buy, urgency, commitment language
  const hotKeywords = ["buy", "purchase", "now", "asap", "today", "ready", "let's go", "start", "immediately", "sign up", "how much", "invoice", "payment"];
  const hotScore = hotKeywords.filter(k => lowerMessage.includes(k)).length;
  
  // WARM indicators: interested but questioning, considering
  const warmKeywords = ["interested", "tell me", "how does", "how it works", "pricing", "plan", "features", "benefits", "difference", "trial", "demo"];
  const warmScore = warmKeywords.filter(k => lowerMessage.includes(k)).length;
  
  // COLD indicators: skeptical, comparing, hesitant
  const coldKeywords = ["just looking", "not sure", "maybe", "compare", "similar", "expensive", "complicated", "need to think"];
  const coldScore = coldKeywords.filter(k => lowerMessage.includes(k)).length;
  
  // DEAD indicators: rejection, disinterest
  const deadKeywords = ["stop", "no", "not interested", "remove", "unsubscribe", "spam", "delete", "block"];
  const deadScore = deadKeywords.filter(k => lowerMessage.includes(k)).length;
  
  // Objection detection
  const objectionPatterns = [
    { keywords: ["expensive", "cost", "price", "afford"], type: "PRICE" },
    { keywords: ["busy", "no time", "later", "postpone"], type: "TIMING" },
    { keywords: ["decide", "need approval", "boss", "ceo", "team"], type: "AUTHORITY" },
    { keywords: ["already", "have", "use", "current"], type: "CURRENT_SOLUTION" },
    { keywords: ["competitor", "other", "alternative"], type: "COMPETITION" },
  ];
  
  let hasObjection = false;
  let objectionType = undefined;
  
  for (const objPattern of objectionPatterns) {
    if (objPattern.keywords.some(k => lowerMessage.includes(k))) {
      hasObjection = true;
      objectionType = objPattern.type;
      break;
    }
  }
  
  // Determine intent
  let intent: "HOT" | "WARM" | "COLD" | "DEAD" = "COLD";
  let confidence = 0;
  let reasoning = "";
  
  if (deadScore > 0) {
    intent = "DEAD";
    confidence = Math.min(100, deadScore * 25);
    reasoning = `Message contains rejection language (${deadScore} signals). User explicitly disinterested.`;
  } else if (hotScore >= 2) {
    intent = "HOT";
    confidence = Math.min(100, 75 + (hotScore * 8));
    reasoning = `Strong buying signals detected (${hotScore} indicators). User is ready to move forward.`;
  } else if (hotScore === 1) {
    intent = "WARM";
    confidence = 65;
    reasoning = `Light buying signal detected. Needs more nurturing.`;
  } else if (warmScore >= 2) {
    intent = "WARM";
    confidence = Math.min(100, 60 + (warmScore * 5));
    reasoning = `Clear interest signals present (${warmScore} questions). User actively evaluating.`;
  } else if (coldScore > 0) {
    intent = "COLD";
    confidence = Math.min(100, 40 + (coldScore * 10));
    reasoning = `Skeptical tone detected (${coldScore} signals). User needs trust-building.`;
  } else {
    intent = "COLD";
    confidence = 30;
    reasoning = "No clear buying signals. Standard cold inquiry.";
  }
  
  // Adjust confidence if objection present
  if (hasObjection && intent !== "DEAD") {
    confidence = Math.max(confidence - 10, 10);
    reasoning += ` Objection detected: ${objectionType}.`;
  }
  
  return {
    intent,
    confidence: Math.round(confidence),
    hasObjection,
    objectionType,
    reasoning
  };
}

export async function POST(request: NextRequest) {
  try {
    // Validate session
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Validate AI config
    const config = validateAIConfig();
    if (!config.valid) {
      return NextResponse.json(
        { error: config.error },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { conversationId, userMessage, tone = "professional" } = body;

    if (!conversationId || !userMessage) {
      return NextResponse.json(
        { error: "Missing conversationId or userMessage" },
        { status: 400 }
      );
    }

    // Fetch conversation and verify access
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        workspace: true,
        lead: true,
        messages: {
          orderBy: { createdAt: "asc" },
          take: 50,
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Verify user has access to workspace
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

    // Fetch workspace settings for business context
    const settings = await db.workspaceSettings.findUnique({
      where: { workspaceId: conversation.workspaceId },
    });

    // Format conversation history for AI
    const conversationHistory = formatConversationHistory(
      conversation.messages.map((msg) => ({
        content: msg.content,
        senderType: msg.senderType as "USER" | "SYSTEM" | "AI",
      })),
      5
    );

    // Analyze message intent
    const intentAnalysis = detectIntentAndAnalyze(userMessage);

    // Generate AI reply
    const aiResponse = await generateAIReply(userMessage, {
      conversationHistory,
      context: {
        leadName: conversation.lead?.name,
        leadCompany: conversation.lead?.company || undefined,
        leadEmail: conversation.lead?.email || undefined,
        leadStatus: conversation.lead?.status || undefined,
        businessType: settings?.businessType || undefined,
        businessTone: settings?.businessTone || "PROFESSIONAL",
        businessDescription: settings?.businessDescription || undefined,
        tonePreference: settings?.tonePreference || undefined,
        pricingInfo: settings?.pricingInfo || undefined,
        servicesInfo: settings?.servicesInfo || undefined,
        conversionGoal: settings?.conversionGoal || "BOOK_CALL",
      },
      maxTokens: 500,
    });

    if (!aiResponse.success) {
      return NextResponse.json(
        { error: aiResponse.error },
        { status: 500 }
      );
    }

    // Generate strategic response based on intent
    let strategySuggestion = "";
    switch (intentAnalysis.intent) {
      case "HOT":
        strategySuggestion = "User is ready to buy. Focus on removing final objections and next steps.";
        break;
      case "WARM":
        strategySuggestion = "User is interested. Provide social proof, testimonials, or case studies.";
        break;
      case "COLD":
        if (intentAnalysis.hasObjection) {
          strategySuggestion = `Handle ${intentAnalysis.objectionType} objection with evidence-based response.`;
        } else {
          strategySuggestion = "Educate about value proposition and differentiation.";
        }
        break;
      case "DEAD":
        strategySuggestion = "Respect user preference. Don't push further.";
        break;
    }

    // Return enhanced response with transparency
    return NextResponse.json({
      success: true,
      reply: aiResponse.message,
      provider: aiResponse.provider,
      
      // NEW: Transparency Features
      analysis: {
        intent: intentAnalysis.intent,
        confidence: intentAnalysis.confidence,
        reasoning: intentAnalysis.reasoning,
        hasObjection: intentAnalysis.hasObjection,
        objectionType: intentAnalysis.objectionType,
      },
      strategy: strategySuggestion,
      estimatedConversionProbability: Math.max(10, intentAnalysis.confidence - 20),
    });
  } catch (error: any) {
    console.error("[/api/ai/reply] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate reply" },
      { status: 500 }
    );
  }
}
