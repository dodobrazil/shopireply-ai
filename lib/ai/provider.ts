import OpenAI from "openai";

export type GenerationMode =
  | "customer_reply"
  | "product_description"
  | "seo_title"
  | "review_response"
  | "refund_response"
  | "late_shipping"
  | "faq_answer";

export type Tone =
  | "friendly"
  | "professional"
  | "apologetic"
  | "persuasive"
  | "concise";

export type OutputLanguage = "en" | "tr" | "bilingual";

export type Platform =
  | "etsy"
  | "shopify"
  | "trendyol"
  | "amazon"
  | "instagram"
  | "woocommerce"
  | "other";

export interface GenerateOptions {
  mode: GenerationMode;
  platform: Platform;
  inputText: string;
  tone: Tone;
  outputLanguage: OutputLanguage;
  brandVoice?: string;
}

export interface GenerateResult {
  outputs: string[];
  tokensUsed?: number;
}

// Create OpenAI-compatible client from env vars
function createAIClient(): OpenAI {
  const apiKey = process.env.AI_API_KEY;
  const baseURL = process.env.AI_BASE_URL || "https://api.openai.com/v1";

  if (!apiKey) {
    throw new Error(
      "AI_API_KEY environment variable is not set. Please configure your AI provider."
    );
  }

  return new OpenAI({
    apiKey,
    baseURL,
  });
}

const MODEL = process.env.AI_MODEL || "gpt-4o-mini";

export async function generateWithAI(
  options: GenerateOptions
): Promise<GenerateResult> {
  const client = createAIClient();
  const { systemPrompt, userPrompt } = buildPrompt(options);

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 2000,
  });

  const content = response.choices[0]?.message?.content || "";
  const outputs = parseOutputs(content);

  return {
    outputs,
    tokensUsed: response.usage?.total_tokens,
  };
}

function parseOutputs(content: string): string[] {
  // Try to parse numbered outputs (Option 1:, Option 2:, Option 3:, or 1., 2., 3.)
  const patterns = [
    /(?:Option\s*\d+:|Version\s*\d+:|\*\*Option\s*\d+\*\*:|\*\*Version\s*\d+\*\*:)\s*([\s\S]*?)(?=(?:Option\s*\d+:|Version\s*\d+:|\*\*Option\s*\d+\*\*:|\*\*Version\s*\d+\*\*:|$))/gi,
    /(?:^\d+\.\s+)([\s\S]*?)(?=(?:^\d+\.\s+)|$)/gm,
  ];

  for (const pattern of patterns) {
    const matches = [...content.matchAll(pattern)];
    if (matches.length >= 2) {
      return matches.slice(0, 3).map((m) => m[1].trim()).filter(Boolean);
    }
  }

  // If parsing fails, split by double newlines and take up to 3
  const sections = content
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  if (sections.length >= 2) {
    return sections.slice(0, 3);
  }

  // Return as single output if no structure found
  return [content.trim()];
}

function buildPrompt(options: GenerateOptions): {
  systemPrompt: string;
  userPrompt: string;
} {
  const { mode, platform, inputText, tone, outputLanguage, brandVoice } = options;

  const languageInstruction = {
    en: "Write all outputs in English only.",
    tr: "Tüm çıktıları yalnızca Türkçe yaz.",
    bilingual:
      "Write each output first in English, then provide a Turkish translation below it.",
  }[outputLanguage];

  const toneInstruction = {
    friendly:
      "Use a warm, friendly, and approachable tone—like a message from a real person.",
    professional:
      "Use a polished, professional tone appropriate for business communication.",
    apologetic:
      "Use an empathetic, apologetic tone that acknowledges the customer's frustration.",
    persuasive:
      "Use a confident, persuasive tone that highlights value and builds trust.",
    concise:
      "Keep it very concise and to the point—no fluff, just the essentials.",
  }[tone];

  const platformContext = {
    etsy: "Etsy marketplace (handmade, vintage, craft products)",
    shopify: "Shopify online store",
    trendyol: "Trendyol Turkish e-commerce marketplace",
    amazon: "Amazon Handmade",
    instagram: "Instagram shopping / DM support",
    woocommerce: "WooCommerce online store",
    other: "online store",
  }[platform];

  const brandVoiceInstruction = brandVoice
    ? `\n\nBrand voice: "${brandVoice}". Incorporate this brand personality naturally.`
    : "";

  const baseSystem = `You are an expert e-commerce customer communication specialist and copywriter. You help small online sellers write professional, human, and effective messages and product copy.

Platform context: ${platformContext}
Tone: ${toneInstruction}
Language: ${languageInstruction}${brandVoiceInstruction}

CRITICAL RULES:
- Always generate exactly 3 different options/variants
- Label them as "Option 1:", "Option 2:", "Option 3:"
- Each option should be meaningfully different (vary structure, wording, emphasis)
- Never make up facts or promise things the seller hasn't approved
- Sound human and genuine, never robotic or templated
- Do not use generic phrases like "I hope this message finds you well"`;

  const modePrompts: Record<GenerationMode, string> = {
    customer_reply: `${baseSystem}

You are helping a seller respond to customer messages. Your replies should:
- Be polite, specific, and human
- Address the customer's concern directly
- Ask for order details (order number, email) if not provided
- Avoid corporate jargon and robotic phrases
- End with a helpful closing`,

    product_description: `${baseSystem}

You are writing compelling product descriptions. Each description should:
- Start with a benefit-led hook
- Include 3-5 bullet points highlighting key features and benefits
- Naturally incorporate relevant SEO keywords
- Include a clear call to action
- Avoid fake claims or exaggerated promises
- Be optimized for the ${platformContext} platform`,

    seo_title: `${baseSystem}

You are creating SEO-optimized product titles. Each title should:
- Be under 80 characters for platform compatibility
- Include the main product keyword near the start
- Include 1-2 secondary keywords naturally
- Be compelling to click
- Follow ${platformContext} best practices
- NOT be keyword stuffed—must read naturally`,

    review_response: `${baseSystem}

You are responding to customer reviews. Follow these rules:
- POSITIVE REVIEWS: Be warm, short (2-3 sentences), grateful, and personalized to what they said
- NEGATIVE REVIEWS: Be empathetic, acknowledge the issue, offer a solution, non-defensive, invite them to contact you
- Never argue or be defensive
- Always thank the reviewer
- For negative reviews, offer to make it right`,

    refund_response: `${baseSystem}

You are helping a seller respond to refund or return requests. Your response should:
- Acknowledge the customer's request warmly
- Explain the process clearly and simply
- Set realistic expectations on timing
- Be apologetic if there's an issue with the product
- Make the customer feel valued despite the return`,

    late_shipping: `${baseSystem}

You are writing a late shipping apology message. Your message should:
- Acknowledge and apologize for the delay sincerely
- Provide any tracking information if available (use placeholder [TRACKING_NUMBER] if not given)
- Explain the reason briefly (if known) without making excuses
- Reassure the customer the package is on its way
- Offer compensation if appropriate (discount on next order, etc.)
- End on a positive, reassuring note`,

    faq_answer: `${baseSystem}

You are creating FAQ answers for a seller's shop. Each answer should:
- Be clear, concise, and complete
- Anticipate follow-up questions
- Be friendly and reassuring
- Include specific details when provided
- Be formatted for easy reading`,
  };

  return {
    systemPrompt: modePrompts[mode],
    userPrompt: `Here is the customer message / product information / context:\n\n${inputText}\n\nPlease generate 3 high-quality ${mode.replace("_", " ")} options.`,
  };
}
