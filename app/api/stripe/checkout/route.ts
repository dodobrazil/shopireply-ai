import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createStripeCheckoutSession,
  isStripeConfigured,
  STRIPE_PLANS,
} from "@/lib/payments/stripe";
import {
  initiateManualPayment,
  MANUAL_PLANS,
} from "@/lib/payments/manual";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, paymentMethod = "stripe" } = await request.json();

    if (!["starter", "pro"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("billing_customer_id")
      .eq("id", user.id)
      .single();

    const profileData = profile as any;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Track checkout started
    await (supabase as any).from("usage_events").insert({
      user_id: user.id,
      event_type: "checkout_started",
      metadata: { plan, paymentMethod },
    });

    // Stripe checkout (international)
    if (paymentMethod === "stripe" && isStripeConfigured()) {
      const stripePlan = STRIPE_PLANS[plan as "starter" | "pro"];

      if (!stripePlan.priceId) {
        return NextResponse.json(
          { error: "Stripe price ID not configured for this plan" },
          { status: 500 }
        );
      }

      const { url, error } = await createStripeCheckoutSession({
        customerId: profileData?.billing_customer_id || undefined,
        priceId: stripePlan.priceId,
        userId: user.id,
        userEmail: user.email!,
        successUrl: `${appUrl}/dashboard?subscription=success`,
        cancelUrl: `${appUrl}/dashboard/settings?subscription=canceled`,
      });

      if (error || !url) {
        return NextResponse.json(
          { error: error || "Failed to create checkout session" },
          { status: 500 }
        );
      }

      return NextResponse.json({ url });
    }

    // Manual payment (Turkey / iyzico / PayTR)
    const manualPlan = MANUAL_PLANS[plan as "starter" | "pro"];
    const result = await initiateManualPayment({
      planName: manualPlan.name,
      priceTRY: manualPlan.priceTRY,
      userEmail: user.email!,
      userId: user.id,
    });

    return NextResponse.json({
      manual: true,
      message: result.message,
      contactEmail: result.contactEmail,
      whatsapp: result.whatsapp,
      paymentLink: result.paymentLink,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Checkout failed. Please try again." },
      { status: 500 }
    );
  }
}
