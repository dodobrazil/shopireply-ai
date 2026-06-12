import type Stripe from "stripe";

// ============================================================
// STRIPE PAYMENT PROVIDER
// Only active when STRIPE_SECRET_KEY is configured
// ============================================================

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }

  if (!stripeInstance) {
    // Dynamic import to avoid issues when Stripe key is absent
    const StripeLib = require("stripe");
    stripeInstance = new StripeLib(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-12-18.acacia",
    });
  }

  return stripeInstance;
}

export function isStripeConfigured(): boolean {
  return !!(
    process.env.STRIPE_SECRET_KEY &&
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );
}

export const STRIPE_PLANS = {
  starter: {
    priceId: process.env.STRIPE_PRICE_STARTER_MONTHLY || "",
    name: "Starter",
    price: 9.99,
    currency: "usd",
    limit: 500,
  },
  pro: {
    priceId: process.env.STRIPE_PRICE_PRO_MONTHLY || "",
    name: "Pro",
    price: 19.99,
    currency: "usd",
    limit: 2000,
  },
};

export async function createStripeCheckoutSession({
  customerId,
  priceId,
  userId,
  userEmail,
  successUrl,
  cancelUrl,
}: {
  customerId?: string;
  priceId: string;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ url: string | null; error?: string }> {
  const stripe = getStripe();
  if (!stripe) {
    return { url: null, error: "Stripe is not configured" };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer: customerId || undefined,
      customer_email: customerId ? undefined : userEmail,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
      },
      subscription_data: {
        metadata: {
          userId,
        },
      },
    });

    return { url: session.url };
  } catch (err) {
    const error = err as Error;
    return { url: null, error: error.message };
  }
}

export async function createStripeBillingPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}): Promise<{ url: string | null; error?: string }> {
  const stripe = getStripe();
  if (!stripe) {
    return { url: null, error: "Stripe is not configured" };
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return { url: session.url };
  } catch (err) {
    const error = err as Error;
    return { url: null, error: error.message };
  }
}
