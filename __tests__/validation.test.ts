import { validateGenerateRequest } from "../lib/utils/validation";

describe("validateGenerateRequest", () => {
  const validRequest = {
    mode: "customer_reply",
    platform: "etsy",
    inputText: "Where is my order? I need it urgently.",
    tone: "professional",
    outputLanguage: "en",
  };

  it("validates a valid request", () => {
    const result = validateGenerateRequest(validRequest);
    expect(result.success).toBe(true);
  });

  it("rejects missing mode", () => {
    const result = validateGenerateRequest({ ...validRequest, mode: undefined });
    expect(result.success).toBe(false);
  });

  it("rejects invalid mode", () => {
    const result = validateGenerateRequest({ ...validRequest, mode: "invalid_mode" });
    expect(result.success).toBe(false);
  });

  it("rejects short input text", () => {
    const result = validateGenerateRequest({ ...validRequest, inputText: "short" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("10 characters");
    }
  });

  it("rejects too long input text", () => {
    const result = validateGenerateRequest({
      ...validRequest,
      inputText: "a".repeat(3001),
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid tone", () => {
    const result = validateGenerateRequest({ ...validRequest, tone: "angry" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid output language", () => {
    const result = validateGenerateRequest({ ...validRequest, outputLanguage: "fr" });
    expect(result.success).toBe(false);
  });

  it("accepts all valid modes", () => {
    const modes = [
      "customer_reply",
      "product_description",
      "seo_title",
      "review_response",
      "refund_response",
      "late_shipping",
      "faq_answer",
    ];
    for (const mode of modes) {
      const result = validateGenerateRequest({ ...validRequest, mode });
      expect(result.success).toBe(true);
    }
  });

  it("accepts all valid platforms", () => {
    const platforms = ["etsy", "shopify", "trendyol", "amazon", "instagram", "woocommerce", "other"];
    for (const platform of platforms) {
      const result = validateGenerateRequest({ ...validRequest, platform });
      expect(result.success).toBe(true);
    }
  });

  it("accepts optional brand voice", () => {
    const result = validateGenerateRequest({
      ...validRequest,
      brandVoice: "Friendly small shop",
    });
    expect(result.success).toBe(true);
  });

  it("rejects brand voice over 500 chars", () => {
    const result = validateGenerateRequest({
      ...validRequest,
      brandVoice: "a".repeat(501),
    });
    expect(result.success).toBe(false);
  });
});
