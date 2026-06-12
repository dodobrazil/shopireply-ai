// ============================================================
// MANUAL PAYMENT PROVIDER
// For Turkey-compatible payment providers (iyzico, PayTR, etc.)
// This is a clean placeholder interface — replace with real
// iyzico/PayTR SDK calls when you have credentials.
// ============================================================

export const MANUAL_PLANS = {
  starter: {
    name: "Starter",
    priceTRY: 299,
    priceUSD: 9.99,
    limit: 500,
    description: "500 üretim/ay",
  },
  pro: {
    name: "Pro",
    priceTRY: 599,
    priceUSD: 19.99,
    limit: 2000,
    description: "2,000 üretim/ay",
  },
};

export interface ManualPaymentRequest {
  planName: string;
  priceTRY: number;
  userEmail: string;
  userId: string;
}

export interface ManualPaymentResult {
  success: boolean;
  message: string;
  contactEmail?: string;
  whatsapp?: string;
  paymentLink?: string;
}

/**
 * Initiates a manual payment flow.
 * In a real implementation, this would:
 * 1. Create a payment request in iyzico/PayTR
 * 2. Return a payment URL
 * 3. Handle webhook callback to upgrade the user
 *
 * For now, this returns contact information for the manual flow.
 */
export async function initiateManualPayment(
  request: ManualPaymentRequest
): Promise<ManualPaymentResult> {
  const contactEmail = process.env.MANUAL_PAYMENT_CONTACT_EMAIL || "billing@shopireply.com";
  const whatsapp = process.env.MANUAL_PAYMENT_WHATSAPP || "";

  // TODO: Replace this block with real iyzico/PayTR API call:
  // const iyzico = new IyzicoClient({ apiKey: process.env.IYZICO_API_KEY, secretKey: process.env.IYZICO_SECRET_KEY });
  // const paymentPage = await iyzico.createPaymentPageRequest({ ... });
  // return { success: true, paymentLink: paymentPage.paymentPageUrl };

  // For now, return manual contact flow
  return {
    success: true,
    message: `Abonelik başlatmak için lütfen bizimle iletişime geçin. ${request.planName} planı için aylık ${request.priceTRY} TRY ödemesi yapılacaktır.`,
    contactEmail,
    whatsapp,
    paymentLink: undefined, // Will be set when real payment provider is integrated
  };
}

/**
 * Verify a manual payment (called after admin confirms payment)
 * In production with iyzico/PayTR, this would be called from the webhook handler.
 */
export async function verifyManualPayment(
  paymentReference: string
): Promise<{ verified: boolean; userId?: string; plan?: string }> {
  // TODO: Implement real payment verification with iyzico/PayTR
  // const result = await iyzicoClient.retrievePayment({ paymentId: paymentReference });
  // return { verified: result.status === 'success', userId: result.metadata.userId, plan: result.metadata.plan };

  console.log(`Payment verification requested for: ${paymentReference}`);
  return { verified: false };
}
