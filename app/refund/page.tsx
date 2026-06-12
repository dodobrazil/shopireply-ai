import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  robots: { index: false },
};

export default function RefundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingNav />
      <main className="flex-1 py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4">
              Last updated: June 2025
            </div>
            <h1 className="text-4xl font-bold mb-4">Refund Policy</h1>
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
              <strong>⚠️ Disclaimer:</strong> This is a template. Review with a legal professional before launch. Refund policies may have legal requirements depending on your jurisdiction.
            </div>
          </div>

          <div className="space-y-8 text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-bold mb-3">Our Commitment</h2>
              <p className="text-muted-foreground">
                We want you to be completely satisfied with ShopiReply AI. If you&apos;re not happy, we&apos;ll do our best to make it right.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">Free Plan</h2>
              <p className="text-muted-foreground">
                The free plan has no charge, so no refunds are applicable.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">Paid Subscriptions</h2>
              <div className="text-muted-foreground space-y-3">
                <p>
                  <strong className="text-foreground">7-day money-back guarantee:</strong> If you&apos;re not satisfied with your subscription within the first 7 days of your first paid month, contact us for a full refund.
                </p>
                <p>
                  <strong className="text-foreground">After 7 days:</strong> We do not offer refunds for partial subscription periods. You may cancel at any time, and your plan will remain active until the end of the billing period.
                </p>
                <p>
                  <strong className="text-foreground">Exceptions:</strong> We may offer refunds in exceptional circumstances (technical issues preventing use, billing errors) at our discretion.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">How to Request a Refund</h2>
              <p className="text-muted-foreground">
                Email us at{" "}
                <a href="mailto:billing@shopireply.com" className="text-primary hover:underline">
                  billing@shopireply.com
                </a>{" "}
                with your account email and reason for the refund request. We aim to respond within 2 business days.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">Cancellation</h2>
              <p className="text-muted-foreground">
                You can cancel your subscription at any time from the Settings → Subscription section. Cancellation takes effect at the end of your current billing period. You will retain access to paid features until then.
              </p>
            </section>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
