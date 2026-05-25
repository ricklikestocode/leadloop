/**
 * AI Service - Real AI Integration
 * Supports OpenAI, Groq, and Gemini APIs
 * Falls back gracefully if no API key is configured
 */

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface AIReplyOptions {
  conversationHistory?: Message[];
  context?: {
    leadName?: string;
    leadCompany?: string;
    leadEmail?: string;
    leadStatus?: string;
    businessName?: string;
    businessType?: string;
    targetAudience?: string;
    businessTone?: string;
    businessDescription?: string;
    tonePreference?: string;
    pricingInfo?: string;
    servicesInfo?: string;
    conversionGoal?: string;
    businessAnalysis?: any;
    workspaceData?: any;
    recentLeads?: any[];
  };
  maxTokens?: number;
}

interface AIResponse {
  success: boolean;
  message?: string;
  intent?: "HOT" | "WARM" | "COLD" | "DEAD";
  reasoning?: string;
  suggestedAction?: string;
  error?: string;
  provider?: string;
}

/**
 * Generate AI reply using OpenAI or Groq
 */
export async function generateAIReply(
  userMessage: string,
  options: AIReplyOptions = {}
): Promise<AIResponse> {
  const provider = process.env.AI_PROVIDER || "openai";
  const apiKey =
    provider === "groq"
      ? process.env.GROQ_API_KEY
      : provider === "gemini"
      ? process.env.GEMINI_API_KEY
      : process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const keyName = provider === "groq" ? "GROQ_API_KEY" : provider === "gemini" ? "GEMINI_API_KEY" : "OPENAI_API_KEY";
    return {
      success: false,
      error: `No API key found for ${provider}. Please set ${keyName} in your environment variables.`,
    };
  }

  // PART 9: If no business data, use professional default context (no hard block)
  if (!options.context?.businessDescription) {
    options = {
      ...options,
      context: {
        ...options.context,
        businessDescription: "A professional B2B service business. We provide high-quality solutions to help our clients grow.",
        businessName: options.context?.businessName || "Our Business",
        businessTone: options.context?.businessTone || "PROFESSIONAL",
        conversionGoal: options.context?.conversionGoal || "BOOK_CALL",
      }
    };
  }

  try {
    if (provider === "groq") {
      return await generateGroqReply(userMessage, apiKey, options);
    } else if (provider === "gemini") {
      return await generateGeminiReply(userMessage, apiKey, options);
    } else {
      return await generateOpenAIReply(userMessage, apiKey, options);
    }
  } catch (error: any) {
    console.error(`[AI Service] ${provider} error:`, error);
    return {
      success: false,
      error: error.message || "Failed to generate AI reply",
    };
  }
}

/**
 * Generate AI reply for the Internal Assistant
 */
export async function generateAssistantReply(
  userMessage: string,
  options: AIReplyOptions = {}
): Promise<AIResponse> {
  const provider = process.env.AI_PROVIDER || "openai";
  const apiKey =
    provider === "groq"
      ? process.env.GROQ_API_KEY
      : provider === "gemini"
      ? process.env.GEMINI_API_KEY
      : process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: `No API key found for ${provider}.`,
    };
  }

  const {
    conversationHistory = [],
    context = {},
    maxTokens = 800,
  } = options;

  const systemMessage = getAssistantSystemPrompt(context);

  const messages: Message[] = [
    { role: "system", content: systemMessage },
    ...conversationHistory,
    { role: "user", content: userMessage },
  ];

  try {
    const url = provider === "groq" 
      ? "https://api.groq.com/openai/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions";
    
    const model = provider === "groq"
      ? (process.env.GROQ_MODEL || "llama-3.3-70b-versatile")
      : provider === "gemini"
      ? (process.env.GEMINI_MODEL || "gemini-1.5-flash")
      : (process.env.OPENAI_MODEL || "gpt-4o-mini");

    if (provider === "gemini") {
      return await generateGeminiReply(userMessage, apiKey, { ...options, maxTokens });
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        max_tokens: maxTokens,
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || response.statusText || "Unknown error";
      throw new Error(`${provider.toUpperCase()} API error: ${errorMessage}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) throw new Error("Empty response from AI");

    let parsed;
    try {
      // Robust JSON extraction in case AI adds preamble even with json_object mode
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonToParse = jsonMatch ? jsonMatch[0] : content;
      parsed = JSON.parse(jsonToParse);
    } catch (e) {
      console.error("[AI Service] JSON Parse Error. Raw content:", content);
      throw new Error("AI response was not in valid JSON format");
    }

    return {
      success: true,
      message: parsed.reply || parsed.message || content,
      suggestedAction: parsed.suggested_action,
      provider,
    };
  } catch (error: any) {
    console.error(`[Assistant AI] error:`, error);
    return {
      success: false,
      error: error.message || "Failed to generate assistant reply",
    };
  }
}

/**
 * Get System Prompt for Sales Engine
 * Upgraded with Business Intelligence Layer
 */
function getSalesSystemPrompt(context: AIReplyOptions["context"] = {}) {
  const {
    leadName = "the user",
    _leadCompany = "their company",
    leadStatus = "New",
    businessName = "This Business",
    businessType = "Business",
    targetAudience = "Customers",
    businessTone = "PROFESSIONAL",
    businessDescription = "",
    businessAnalysis = null,
    tonePreference = "",
    pricingInfo = "Contact for details",
    servicesInfo = "Various services",
    conversionGoal = "BOOK_CALL"
  } = context as any;

  let intelligenceLayer = "";
  if (businessAnalysis) {
    try {
      const analysis = typeof businessAnalysis === 'string' ? JSON.parse(businessAnalysis) : businessAnalysis;
      intelligenceLayer = `
DEEP BUSINESS INTELLIGENCE:
- Key Value Prop: ${analysis.key_value_proposition}
- Products/Services: ${analysis.products_services?.join(", ")}
- Target Audience: ${analysis.target_audience}
- Pricing Range: ${analysis.pricing_range}
- Sales Strategy: ${analysis.sales_strategy}
- Common Questions: ${analysis.common_customer_questions?.join("; ")}
- Known Objections & Handling: ${analysis.objections?.join("; ")}
`;
    } catch (e) {
      console.error("Error parsing business analysis in prompt", e);
    }
  }

  return `You are a Senior Sales Engineer for ${businessName} (${businessType}). 
You work for this business and your goal is to transform every conversation into a HIGH-CONVERSION sales event.

BUSINESS CONTEXT:
${businessDescription}

${intelligenceLayer}

SPECIFIC CONTEXT:
- Target Audience: ${targetAudience}
- Tone: ${businessTone}
- Tone Preference: ${tonePreference}
- Services: ${servicesInfo}
- Pricing: ${pricingInfo}
- Conversion Goal: ${conversionGoal}

LEAD CONTEXT:
- Name: ${leadName}
- Current Status: ${leadStatus}

BEHAVIOR RULES:
1. NEVER invent services not in description.
2. STAY within pricing range if mentioned.
3. MATCH tone preference perfectly.
4. RESPOND as if you work for that business.
5. BE CONCISE (1-3 lines max).
6. BE HUMAN, not robotic.
7. DETECT INTENT and push for the Conversion Goal: ${conversionGoal}.

INTENT STRATEGY:
- HOT: Ready to buy. Push for immediate action (${conversionGoal}).
- WARM: Interested but needs info. Provide info + ask closing question.
- COLD: Skeptical. Build trust, handle objections.
- DEAD: Spam. Minimal polite reply.

RESPONSE FORMAT:
You MUST respond in VALID JSON format:
{
  "intent": "HOT" | "WARM" | "COLD" | "DEAD",
  "reply": "Your persuasive sales-focused response",
  "suggested_action": "BOOK_CALL" | "SEND_PRICING" | "OFFER_DISCOUNT" | "CLOSE_DEAL" | "NONE",
  "reasoning": "Brief explanation"
}`;
}

/**
 * Business Analysis Engine
 * Analyzes raw description into structured intelligence
 */
export async function analyzeBusinessStructure(description: string): Promise<any> {
  const provider = process.env.AI_PROVIDER || "openai";
  const apiKey = provider === "groq" ? process.env.GROQ_API_KEY : provider === "gemini" ? process.env.GEMINI_API_KEY : process.env.OPENAI_API_KEY;

  if (!apiKey) throw new Error("AI API Key not configured");

  const systemPrompt = `You are a Business Intelligence Analyst. 
Analyze the provided business description and return a STRUCTURED JSON representing their business model.

Expected JSON Format:
{
  "business_type": "string",
  "products_services": ["string"],
  "target_audience": "string",
  "pricing_range": "string",
  "tone": "string",
  "key_value_proposition": "string",
  "common_customer_questions": ["string"],
  "objections": ["string"],
  "sales_strategy": "string"
}`;

  try {
    const url = provider === "groq" 
      ? "https://api.groq.com/openai/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions";
    
    const model = provider === "groq" ? "llama-3.3-70b-versatile" : "gpt-4o-mini";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this business: ${description}` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    return JSON.parse(content);
  } catch (error) {
    console.error("Analysis failed", error);
    return null;
  }
}

/**
 * Get System Prompt for Internal Assistant
 */
function getAssistantSystemPrompt(context: AIReplyOptions["context"] = {}) {
  const {
    businessName = "This Business",
    businessType = "Business",
    targetAudience = "Customers",
    businessDescription = "",
    businessAnalysis = null,
    conversionGoal = "Growth",
    workspaceData = {},
    recentLeads = []
  } = context as any;

  let intelligenceLayer = "";
  if (businessAnalysis) {
    try {
      const analysis = typeof businessAnalysis === 'string' ? JSON.parse(businessAnalysis) : businessAnalysis;
      intelligenceLayer = `
DEEP BUSINESS INTELLIGENCE:
- Key Value Prop: ${analysis.key_value_proposition}
- Products/Services: ${analysis.products_services?.join(", ")}
- Target Audience: ${analysis.target_audience}
- Pricing Range: ${analysis.pricing_range}
- Sales Strategy: ${analysis.sales_strategy}
- Common Questions: ${analysis.common_customer_questions?.join("; ")}
- Known Objections & Handling: ${analysis.objections?.join("; ")}
`;
    } catch (e) {
      console.error("Error parsing business analysis in assistant prompt", e);
    }
  }

  return `You are the ReplyFlow AI Internal Assistant for ${businessName}. 
Your job is to help the user (the business owner/agent) manage their sales pipeline, write better replies, and grow their business.

BUSINESS CONTEXT:
${businessDescription}

${intelligenceLayer}

SPECIFIC CONTEXT:
- Business Name: ${businessName}
- Business Type: ${businessType}
- Target Audience: ${targetAudience}
- Growth Goal: ${conversionGoal}
- Active Leads: ${recentLeads.length}
- Workspace Info: ${JSON.stringify(workspaceData)}

TONE:
- Professional, supportive, data-driven, and highly encouraging.
- You are a partner in their success.

RESPONSE FORMAT:
You MUST respond in VALID JSON format:
{
  "reply": "Your helpful response to the user",
  "suggested_action": "OPTIONAL_ACTION_ID",
  "data_points": ["Relevant insight 1", "Relevant insight 2"]
}

Keep responses concise and actionable.`;
}

/**
 * Generate reply using OpenAI API
 */
async function generateOpenAIReply(
  userMessage: string,
  apiKey: string,
  options: AIReplyOptions
): Promise<AIResponse> {
  const {
    conversationHistory = [],
    context = {},
    maxTokens = 500,
  } = options;

  const systemMessage = getSalesSystemPrompt(context);

  const messages: Message[] = [
    { role: "system", content: systemMessage },
    ...conversationHistory,
    { role: "user", content: userMessage },
  ];

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        max_tokens: maxTokens,
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || response.statusText || "OpenAI API error";
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("No content in OpenAI response");
    }

    const parsed = JSON.parse(content);

    return {
      success: true,
      message: parsed.reply,
      intent: parsed.intent,
      reasoning: parsed.reasoning,
      suggestedAction: parsed.suggested_action,
      provider: "openai",
    };
  } catch (error: any) {
    throw error;
  }
}

/**
 * Generate reply using Groq API
 */
async function generateGroqReply(
  userMessage: string,
  apiKey: string,
  options: AIReplyOptions
): Promise<AIResponse> {
  const {
    conversationHistory = [],
    context = {},
    maxTokens = 500,
  } = options;

  const systemMessage = getSalesSystemPrompt(context);

  const messages: Message[] = [
    { role: "system", content: systemMessage },
    ...conversationHistory,
    { role: "user", content: userMessage },
  ];

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
          messages: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          max_tokens: maxTokens,
          temperature: 0.7,
          response_format: { type: "json_object" }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || response.statusText || "Groq API error";
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("No content in Groq response");
    }

    const parsed = JSON.parse(content);

    return {
      success: true,
      message: parsed.reply,
      intent: parsed.intent,
      reasoning: parsed.reasoning,
      suggestedAction: parsed.suggested_action,
      provider: "groq",
    };
  } catch (error: any) {
    throw error;
  }
}

/**
 * Format conversation history for AI consumption
 * Takes last N messages and formats them properly
 */
export function formatConversationHistory(
  messages: Array<{
    content: string;
    senderType: "USER" | "SYSTEM" | "AI";
  }>,
  limit: number = 5
): Message[] {
  const recent = messages.slice(-limit);

  return recent.map((msg) => ({
    role: msg.senderType === "USER" ? "user" : ("assistant" as const),
    content: msg.content,
  }));
}

/**
 * Validate API configuration
 */
export function validateAIConfig(): {
  valid: boolean;
  provider: string;
  error?: string;
} {
  const provider = process.env.AI_PROVIDER || "openai";
  const apiKey =
    provider === "groq"
      ? process.env.GROQ_API_KEY
      : provider === "gemini"
      ? process.env.GEMINI_API_KEY
      : process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const keyName = provider === "groq" ? "GROQ_API_KEY" : provider === "gemini" ? "GEMINI_API_KEY" : "OPENAI_API_KEY";
    return {
      valid: false,
      provider,
      error: `No API key found for ${provider}. Please set ${keyName} in your environment variables.`,
    };
  }

  return { valid: true, provider };
}

/**
 * Generate reply using Google Gemini API
 */
async function generateGeminiReply(
  userMessage: string,
  apiKey: string,
  options: AIReplyOptions
): Promise<AIResponse> {
  const {
    conversationHistory = [],
    context = {},
    maxTokens = 500,
  } = options;

  const systemPrompt = getSalesSystemPrompt(context);
  
  // Format history for Gemini
  const contents = [
    {
      role: "user",
      parts: [{ text: `SYSTEM INSTRUCTION: ${systemPrompt}` }]
    },
    ...conversationHistory.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    })),
    {
      role: "user",
      parts: [{ text: userMessage }]
    }
  ];

  try {
    const modelName = "gemini-1.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.7
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || response.statusText || "Gemini API error";
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!content) {
      throw new Error("No content in Gemini response");
    }

    let parsed;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonToParse = jsonMatch ? jsonMatch[0] : content;
      parsed = JSON.parse(jsonToParse);
    } catch (e) {
      console.warn("[Gemini Service] Could not parse JSON, using raw content:", content);
      parsed = { reply: content };
    }

    return {
      success: true,
      message: parsed.reply || parsed.message || content,
      intent: parsed.intent,
      reasoning: parsed.reasoning,
      suggestedAction: parsed.suggested_action,
      provider: "gemini",
    };
  } catch (error: any) {
    throw error;
  }
}

/**
 * Refine Business Intelligence from Conversations
 */
export async function refineBusinessAnalysis(
  currentAnalysis: any,
  conversations: string[]
): Promise<any> {
  const provider = process.env.AI_PROVIDER || "openai";
  const apiKey = provider === "groq" ? process.env.GROQ_API_KEY : provider === "gemini" ? process.env.GEMINI_API_KEY : process.env.OPENAI_API_KEY;

  if (!apiKey) throw new Error("AI API Key not configured");

  const systemPrompt = `You are a Sales Strategist. 
Review the current business intelligence and the recent conversation history.
Update the common questions, objections, and sales strategy based on real user interactions.

Current Intelligence:
${JSON.stringify(currentAnalysis)}

Return the FULL updated JSON in the same format.`;

  try {
    const url = provider === "groq" 
      ? "https://api.groq.com/openai/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions";
    
    const model = provider === "groq" ? "llama-3.3-70b-versatile" : "gpt-4o-mini";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Recent Conversations:\n${conversations.join("\n---\n")}` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    return JSON.parse(content);
  } catch (error) {
    console.error("Refinement failed", error);
    return null;
  }
}
