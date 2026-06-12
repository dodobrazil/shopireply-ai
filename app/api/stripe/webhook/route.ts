import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe } from "@/lib/payments/stripe";
import { createAdminClient } from "@/lib/supabase/server";
import type Stripe from "stripe";

const PLAN_LIMITS: Record<string, number> = {
  starter: 500,
  pro: 2000,
};

function getPlanFromPriceId(priceId: string): string {
  const starterPriceId = process.env.STRIPE_PRICE_STARTER_MONTHLY;
  const proPriceId = process.env.STRIPE_PRICE_PRO_MONTHLY;

  if (priceId === starterPriceId) return "starter";
  if (priceId === proPriceId) return "pro";
  return "free";
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 400 });
  }

  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const customerId = session.customer as string;

        if (!userId) break;

        // Get the subscription to find the plan
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        const priceId = subscription.items.data[0]?.price.id;
        const plan = getPlanFromPriceId(priceId);
        const limit = PLAN_LIMITS[plan] || 10;

        await (supabase as any)
          .from("profiles")
          .update({
            plan,
            monthly_generation_limit: limit,
            billing_customer_id: customerId,
            subscription_status: "active",
            subscription_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
          })
          .eq("id", userId);

        await (supabase as any).from("usage_events").insert({
          user_id: userId,
          event_type: "subscription_updated",
          metadata: { plan, customerId, subscriptionId: subscription.id },
        });

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const priceId = subscription.items.data[0]?.price.id;
        const plan = getPlanFromPriceId(priceId);
        const limit = PLAN_LIMITS[plan] || 10;

        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("billing_customer_id", customerId)
          .single();

        if (profile) {
          await (supabase as any)
            .from("profiles")
            .update({
              plan,
              monthly_generation_limit: limit,
              subscription_status: subscription.status as "active" | "past_due" | "canceled" | "trialing",
              subscription_period_end: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
            })
            .eq("id", (profile as any).id);
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("billing_customer_id", customerId)
          .single();

        if (profile) {
          await (supabase as any)
            .from("profiles")
            .update({
              plan: "free",
              monthly_generation_limit: 10,
              subscription_status: "canceled",
            })
            .eq("id", (profile as any).id);

          await (supabase as any).from("usage_events").insert({
            user_id: (profile as any).id,
            event_type: "subscription_updated",
            metadata: { plan: "free", reason: "subscription_deleted" },
          });
        }

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("billing_customer_id", customerId)
          .single();

        if (profile) {
          await (supabase as any)
            .from("profiles")
            .update({ subscription_status: "past_due" })
            .eq("id", (profile as any).id);
        }

        break;
      }

      default:
        // Ignore unhandled events
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
