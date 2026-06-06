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
    databaseData?: any;
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
    recentLeads = [],
    databaseData = { leads: [], followUps: [] }
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

  // Build a concise database summary text for the AI
  const leadsSummary = databaseData.leads && databaseData.leads.length > 0
    ? databaseData.leads.map((l: any) => 
        `- Name: ${l.name}, Score: ${l.leadScore || 0}/100, Intent: ${l.intent || "N/A"}, Probability: ${l.conversionProbability || 0}%, Value: $${l.value || 0}, Status: ${l.status}, Next Action: ${l.nextAction || "None"}, Follow Up Date: ${l.followUpDate ? new Date(l.followUpDate).toLocaleDateString() : "None"}`
      ).join("\n")
    : "No active leads found in the system.";

  const tasksSummary = databaseData.followUps && databaseData.followUps.length > 0
    ? databaseData.followUps.map((t: any) => 
        `- Task for Lead: ${t.lead?.name || "Unknown"}, Status: ${t.status}, Due: ${new Date(t.dueDate).toLocaleDateString()}`
      ).join("\n")
    : "No pending tasks/follow-ups found.";

  return `You are the ReplyFlow AI Sales Copilot and Internal Revenue Assistant for ${businessName}. 
Your job is to help the user (the business owner/agent) manage their sales pipeline, answer operational questions, write replies, and find opportunities.

BUSINESS CONTEXT:
${businessDescription}

${intelligenceLayer}

SPECIFIC CONTEXT:
- Business Name: ${businessName}
- Business Type: ${businessType}
- Target Audience: ${targetAudience}
- Growth Goal: ${conversionGoal}
- Workspace Info: ${JSON.stringify(workspaceData)}

REAL-TIME DATABASE STATE (Use this real CRM data to answer the user's questions):
=== LEADS ===
${leadsSummary}

=== PENDING TASKS & FOLLOW-UPS ===
${tasksSummary}

CRITICAL RULES:
1. ALWAYS use the REAL-TIME DATABASE STATE above to answer questions.
2. If the user asks: "Which lead is hottest?" -> Look for leads with highest Lead Score or intent "HOT" and tell them the exact details.
3. If they ask: "Who should I contact today?" -> Look for leads with followUpDate of today, or pending follow-up tasks due today or overdue.
4. If they ask: "Which lead is most likely to convert?" -> Sort leads by conversionProbability and report.
5. If they ask: "Which conversations need attention?" -> Identify leads with status "NEW" or "CONTACTED" that have no follow-up scheduled, or have overdue follow-up tasks.
6. Provide specific, direct, and actionable advice (names, values, exact scores). Do not use placeholders.
7. Be encouraging, precise, and professional.

RESPONSE FORMAT:
You MUST respond in VALID JSON format:
{
  "reply": "Your helpful response to the user formatted in clean markdown",
  "suggested_action": "OPTIONAL_ACTION_ID",
  "data_points": ["Relevant data point/insight 1", "Relevant data point/insight 2"]
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

/**
 * AI Lead Intelligence Engine
 * Performs comprehensive analysis of a lead, generating score, intent, confidence, and conversion probability.
 */
export async function analyzeLeadIntelligence(
  lead: any,
  settings: any,
  notes: any[] = [],
  messages: any[] = []
): Promise<{
  success: boolean;
  leadScore: number;
  intent: "HOT" | "WARM" | "COLD" | "LOST";
  confidenceScore: number;
  conversionProbability: number;
  summary: string;
  nextAction: string;
  suggestedActions: string[];
  followUpMessage?: string;
  shouldCreateTask?: boolean;
  taskTitle?: string;
  taskDueDays?: number;
  shouldCreateReminder?: boolean;
  reminderText?: string;
  provider?: string;
}> {
  const provider = process.env.AI_PROVIDER || "openai";
  const apiKey =
    provider === "groq"
      ? process.env.GROQ_API_KEY
      : provider === "gemini"
      ? process.env.GEMINI_API_KEY
      : process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return getRuleBasedLeadAnalysis(lead, notes, messages);
  }

  const prompt = `
    You are an AI Revenue Optimization Engine. Your job is to analyze a new or existing lead and generate deep sales intelligence.
    
    LEAD DETAILS:
    - Name: ${lead.name}
    - Email: ${lead.email || "N/A"}
    - Phone: ${lead.phone || "N/A"}
    - Company: ${lead.company || "N/A"}
    - Status: ${lead.status || "NEW"}
    - Source: ${lead.source || "MANUAL"}
    - Estimated Deal Value: $${lead.value || 0}
    
    BUSINESS/WORKSPACE SETTINGS:
    - Business Name: ${settings?.businessName || "Our CRM Business"}
    - Business Type: ${settings?.businessType || "B2B SaaS"}
    - Business Description: ${settings?.businessDescription || "A high-performance B2B service."}
    - Tone: ${settings?.businessTone || "PROFESSIONAL"}
    - Pricing Info: ${settings?.pricingInfo || "Contact for custom quote."}
    - Conversion Goal: ${settings?.conversionGoal || "BOOK_CALL"}
    
    NOTES:
    ${notes.map(n => `- ${n.content}`).join("\n") || "No notes available."}
    
    CONVERSATION LOGS:
    ${messages.map(m => `${m.senderType}: ${m.content}`).join("\n") || "No message history."}
    
    You must analyze this lead and output a valid JSON response containing intelligence, intent classification, follow-ups, and reminders.
    
    Format your response EXACTLY as a JSON object with this schema:
    {
      "leadScore": <number between 0 and 100>,
      "intent": "HOT" | "WARM" | "COLD" | "LOST",
      "confidenceScore": <number between 0 and 100>,
      "conversionProbability": <number between 0 and 100>,
      "summary": "<1-2 sentence concise summary of the lead profile and opportunity>",
      "nextAction": "<next action for the sales agent, max 8 words>",
      "suggestedActions": [<array of 3 specific actions, e.g. "Send pricing proposal", "Follow up tomorrow", "Ask for company size">],
      "followUpMessage": "<a highly personalized and contextual draft message to send to the lead>",
      "shouldCreateTask": <true or false, whether a task should be scheduled automatically>,
      "taskTitle": "<specific follow-up task title, e.g., 'Email pricing PDF'>",
      "taskDueDays": <number of days from now to schedule the task, e.g. 1 or 2>,
      "shouldCreateReminder": <true or false, whether a reminder should be created in the dashboard>,
      "reminderText": "<specific alert text, e.g., 'Follow up with Hot Lead within 24 hours'>"
    }
  `;

  try {
    const url = provider === "groq" 
      ? "https://api.groq.com/openai/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions";
    
    const model = provider === "groq"
      ? (process.env.GROQ_MODEL || "llama-3.3-70b-versatile")
      : provider === "gemini"
      ? (process.env.GEMINI_MODEL || "gemini-1.5-flash")
      : (process.env.OPENAI_MODEL || "gpt-4o-mini");

    let content = "";
    if (provider === "gemini") {
      const gRes = await generateGeminiReply(prompt, apiKey, { maxTokens: 800 });
      if (gRes.success && gRes.message) {
        content = gRes.message;
      } else {
        throw new Error(gRes.error || "Gemini reply generation failed");
      }
    } else {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          max_tokens: 800,
          temperature: 0.3,
          response_format: { type: "json_object" }
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      content = data.choices?.[0]?.message?.content?.trim();
    }

    if (!content) throw new Error("Empty response");

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonToParse = jsonMatch ? jsonMatch[0] : content;
    const parsed = JSON.parse(jsonToParse);

    return {
      success: true,
      leadScore: Number(parsed.leadScore) || 50,
      intent: parsed.intent || "WARM",
      confidenceScore: Number(parsed.confidenceScore) || 70,
      conversionProbability: Number(parsed.conversionProbability) || 50,
      summary: parsed.summary || "Lead analysis completed.",
      nextAction: parsed.nextAction || "Contact lead.",
      suggestedActions: parsed.suggestedActions || ["Follow up"],
      followUpMessage: parsed.followUpMessage || "",
      shouldCreateTask: parsed.shouldCreateTask || false,
      taskTitle: parsed.taskTitle || "Follow up with lead",
      taskDueDays: parsed.taskDueDays || 1,
      shouldCreateReminder: parsed.shouldCreateReminder || false,
      reminderText: parsed.reminderText || "Follow up pending",
      provider
    };
  } catch (err) {
    console.error("AI Analysis failed, falling back to rule-based analysis:", err);
    return getRuleBasedLeadAnalysis(lead, notes, messages);
  }
}

function getRuleBasedLeadAnalysis(lead: any, notes: any[], messages: any[]) {
  let score = 30;
  let intent: "HOT" | "WARM" | "COLD" | "LOST" = "COLD";
  let confidence = 65;
  let conversionProb = 25;
  const actions: string[] = ["Verify contact info", "Send introductory email"];

  if (lead.phone) {
    score += 15;
    intent = "WARM";
  }
  if (lead.email) {
    score += 10;
  }
  if (lead.company) {
    score += 10;
  }
  if (lead.value > 1000) {
    score += 15;
    intent = "WARM";
  }
  if (lead.value > 5000) {
    score += 15;
    intent = "HOT";
  }
  if (lead.status === "WON") {
    score = 100;
    intent = "HOT";
    conversionProb = 100;
  } else if (lead.status === "LOST") {
    score = 0;
    intent = "LOST";
    conversionProb = 0;
  }

  score = Math.min(100, Math.max(0, score));
  conversionProb = Math.min(100, Math.max(0, score - 10));

  if (intent === "HOT") {
    actions.push("Schedule discovery call", "Send product pricing sheet");
  } else if (intent === "WARM") {
    actions.push("Follow up via email in 2 days", "Answer questions about services");
  } else {
    actions.push("Re-engage next week");
  }

  const nextAction = intent === "HOT" ? "Schedule discovery call" : "Send introduction";
  const summary = `Lead ${lead.name} from ${lead.source || "MANUAL"}. Target company: ${lead.company || "N/A"}. Value: $${lead.value || 0}. Score: ${score}.`;

  const followUpMessage = `Hi ${lead.name},\n\nThanks for reaching out! I saw that you're interested in our services. I'd love to schedule a quick 10-minute call to see how we can help you with your business goals. Do you have some time tomorrow?`;

  return {
    success: true,
    leadScore: score,
    intent,
    confidenceScore: confidence,
    conversionProbability: conversionProb,
    summary,
    nextAction,
    suggestedActions: actions,
    followUpMessage,
    shouldCreateTask: true,
    taskTitle: intent === "HOT" ? "Urgent: Contact Hot Lead" : "Follow up with lead",
    taskDueDays: intent === "HOT" ? 1 : 3,
    shouldCreateReminder: intent === "HOT",
    reminderText: intent === "HOT" ? `Hot Lead "${lead.name}" not contacted yet!` : `Follow up with ${lead.name}`,
    provider: "rule-based"
  };
}

/**
 * Generate Contextual Follow-Up Message
 * Analyzes lead profile, notes, and messages to draft a reply.
 */
export async function generateContextualFollowUp(
  lead: any,
  settings: any,
  notes: any[] = [],
  messages: any[] = []
): Promise<{
  success: boolean;
  followUpMessage: string;
  reasoning?: string;
  provider?: string;
}> {
  const provider = process.env.AI_PROVIDER || "openai";
  const apiKey =
    provider === "groq"
      ? process.env.GROQ_API_KEY
      : provider === "gemini"
      ? process.env.GEMINI_API_KEY
      : process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const msg = `Hi ${lead.name},\n\nFollowing up on our last conversation. Let me know if you have any questions about our services at ${settings?.businessName || "our business"} or if you'd like to schedule a quick call to discuss details.`;
    return { success: true, followUpMessage: msg, provider: "rule-based" };
  }

  const prompt = `
    You are an AI Sales Copilot. Generate a personalized follow-up message for this lead based on their status, notes, and conversation history.
    
    LEAD DETAILS:
    - Name: ${lead.name}
    - Company: ${lead.company || "N/A"}
    - Status: ${lead.status || "NEW"}
    - Value: $${lead.value || 0}
    
    BUSINESS SETTINGS:
    - Business Name: ${settings?.businessName || "Our CRM Business"}
    - Business Description: ${settings?.businessDescription || ""}
    - Tone Preference: ${settings?.tonePreference || settings?.businessTone || "PROFESSIONAL"}
    - Conversion Goal: ${settings?.conversionGoal || "BOOK_CALL"}
    
    NOTES:
    ${notes.map(n => `- ${n.content}`).join("\n") || "No notes."}
    
    CONVERSATION HISTORY (Last 10 messages):
    ${messages.map(m => `${m.senderType}: ${m.content}`).join("\n") || "No previous messages."}
    
    Respond in JSON format:
    {
      "followUpMessage": "<highly relevant, concise 2-3 sentence follow-up message targeting the goal: ${settings?.conversionGoal}>",
      "reasoning": "<brief explanation of why this message is effective>"
    }
  `;

  try {
    const url = provider === "groq" 
      ? "https://api.groq.com/openai/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions";
    
    const model = provider === "groq" ? "llama-3.3-70b-versatile" : "gpt-4o-mini";

    let content = "";
    if (provider === "gemini") {
      const gRes = await generateGeminiReply(prompt, apiKey, { maxTokens: 500 });
      if (gRes.success && gRes.message) {
        content = gRes.message;
      } else {
        throw new Error(gRes.error || "Gemini reply generation failed");
      }
    } else {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          max_tokens: 500,
          temperature: 0.7,
          response_format: { type: "json_object" }
        }),
      });

      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      content = data.choices?.[0]?.message?.content?.trim();
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonToParse = jsonMatch ? jsonMatch[0] : content;
    const parsed = JSON.parse(jsonToParse);

    return {
      success: true,
      followUpMessage: parsed.followUpMessage,
      reasoning: parsed.reasoning,
      provider
    };
  } catch (err) {
    const msg = `Hi ${lead.name},\n\nFollowing up on our last conversation. Let me know if you have any questions about our services or if you'd like to schedule a quick call to discuss details.`;
    return { success: true, followUpMessage: msg, provider: "rule-based" };
  }
}
