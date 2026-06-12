import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  robots: { index: false },
};

export default function TermsPage() {
  const lastUpdated = "June 2025";
  const appName = "ShopiReply AI";
  const contactEmail = "legal@shopireply.com";

  return (
    <div className="min-h-screen flex flex-col">
      <MarketingNav />
      <main className="flex-1 py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4">
              Last updated: {lastUpdated}
            </div>
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
              <strong>⚠️ Disclaimer:</strong> This is a template document. Review and customize these terms with a qualified legal professional before launching your product.
            </div>
          </div>

          <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-bold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using {appName} (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">2. Description of Service</h2>
              <p className="text-muted-foreground">
                {appName} provides AI-powered text generation tools to help e-commerce sellers create customer replies, product descriptions, SEO titles, and other business communications. The Service uses artificial intelligence to generate text suggestions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">3. User Accounts</h2>
              <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                <li>You must provide accurate information when creating an account.</li>
                <li>You are responsible for maintaining the security of your account credentials.</li>
                <li>You must notify us immediately of any unauthorized use of your account.</li>
                <li>One person may not maintain more than one free account.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">4. Acceptable Use</h2>
              <p className="text-muted-foreground mb-2">You agree not to use the Service to:</p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                <li>Generate spam, misleading content, or fraudulent communications.</li>
                <li>Violate any applicable laws or regulations.</li>
                <li>Infringe on intellectual property rights of others.</li>
                <li>Generate content that is harmful, offensive, or discriminatory.</li>
                <li>Attempt to reverse-engineer or bypass service limitations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">5. AI-Generated Content</h2>
              <p className="text-muted-foreground">
                You are responsible for reviewing and approving all AI-generated content before use. {appName} does not guarantee the accuracy, completeness, or suitability of any generated content. AI outputs may contain errors and should not be used without human review.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">6. Subscription and Payment</h2>
              <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                <li>Free plan includes 10 generations per month. Paid plans include higher limits as described on the pricing page.</li>
                <li>Subscriptions are billed monthly. You may cancel at any time.</li>
                <li>No refunds are provided for partial months, except as required by law or our Refund Policy.</li>
                <li>We reserve the right to change pricing with 30 days notice.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">7. Intellectual Property</h2>
              <p className="text-muted-foreground">
                You retain ownership of the text you input into the Service. You own the AI-generated outputs produced for you. {appName} retains all rights to the Service, its code, design, and systems.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">8. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                {appName} is provided &quot;as is&quot; without warranties of any kind. We are not liable for any damages arising from your use of the Service, including lost profits, data loss, or business interruption.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">9. Termination</h2>
              <p className="text-muted-foreground">
                We reserve the right to terminate or suspend your account for violations of these Terms. You may delete your account at any time from the settings page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">10. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">11. Contact</h2>
              <p className="text-muted-foreground">
                Questions about these Terms? Contact us at{" "}
                <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">
                  {contactEmail}
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
