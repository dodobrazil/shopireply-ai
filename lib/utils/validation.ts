import { z } from "zod";

export const generateRequestSchema = z.object({
  mode: z.enum([
    "customer_reply",
    "product_description",
    "seo_title",
    "review_response",
    "refund_response",
    "late_shipping",
    "faq_answer",
  ]),
  platform: z
    .enum(["etsy", "shopify", "trendyol", "amazon", "instagram", "woocommerce", "other"])
    .default("other"),
  inputText: z
    .string()
    .min(10, "Please provide more context (at least 10 characters)")
    .max(3000, "Input text is too long (max 3000 characters)"),
  tone: z
    .enum(["friendly", "professional", "apologetic", "persuasive", "concise"])
    .default("professional"),
  outputLanguage: z.enum(["en", "tr", "bilingual"]).default("en"),
  brandVoice: z.string().max(500).optional(),
});

export type GenerateRequest = z.infer<typeof generateRequestSchema>;

export const profileUpdateSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  brand_voice: z.string().max(500).optional(),
  default_language: z.enum(["en", "tr", "bilingual"]).optional(),
});

export type ProfileUpdateRequest = z.infer<typeof profileUpdateSchema>;

export function validateGenerateRequest(
  data: unknown
): { success: true; data: GenerateRequest } | { success: false; error: string } {
  const result = generateRequestSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const firstError = result.error.errors[0];
  return {
    success: false,
    error: firstError?.message || "Invalid request",
  };
}
