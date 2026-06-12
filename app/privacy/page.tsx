import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingNav />
      <main className="flex-1 py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4">
              Last updated: June 2025
            </div>
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
              <strong>⚠️ Disclaimer:</strong> This is a template document. Review and customize with a qualified legal professional, especially if you process data from EU residents (GDPR) or Turkish citizens (KVKK).
            </div>
          </div>

          <div className="space-y-8 text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-bold mb-3">1. Information We Collect</h2>
              <div className="text-muted-foreground space-y-2">
                <p><strong className="text-foreground">Account Information:</strong> Email address and name when you sign up.</p>
                <p><strong className="text-foreground">Usage Data:</strong> Text you input for generation, generated outputs, and usage statistics.</p>
                <p><strong className="text-foreground">Payment Information:</strong> Processed securely by Stripe or our payment provider. We do not store credit card numbers.</p>
                <p><strong className="text-foreground">Technical Data:</strong> IP address, browser type, and usage logs for service improvement.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>To provide and improve the Service</li>
                <li>To send transactional emails (account confirmation, billing)</li>
                <li>To process payments and manage subscriptions</li>
                <li>To analyze usage patterns and improve AI quality</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">3. Data Sharing</h2>
              <p className="text-muted-foreground mb-2">We do not sell your personal data. We share data only with:</p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li><strong className="text-foreground">Supabase:</strong> Database and authentication provider</li>
                <li><strong className="text-foreground">OpenAI / AI Provider:</strong> Text generation (input processed to generate outputs)</li>
                <li><strong className="text-foreground">Stripe:</strong> Payment processing</li>
                <li><strong className="text-foreground">Vercel:</strong> Hosting provider</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">4. AI Data Processing</h2>
              <p className="text-muted-foreground">
                Text you enter for generation is sent to our AI provider (OpenAI or compatible). This text may be processed according to their privacy policy. We recommend not including sensitive personal information in your generation inputs.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">5. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your account data while your account is active. Generated outputs are stored and accessible in your History. You may delete your history at any time. You may delete your account from Settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">6. Your Rights</h2>
              <p className="text-muted-foreground mb-2">You have the right to:</p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Delete your account and data</li>
                <li>Export your generation history</li>
                <li>Opt out of non-essential communications</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                For Turkish citizens: This service complies with KVKK (Kişisel Verilerin Korunması Kanunu) requirements. Contact us for data subject requests.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">7. Cookies</h2>
              <p className="text-muted-foreground">
                We use essential cookies for authentication and session management. We do not use tracking or advertising cookies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">8. Contact</h2>
              <p className="text-muted-foreground">
                For privacy-related questions, contact us at{" "}
                <a href="mailto:privacy@shopireply.com" className="text-primary hover:underline">
                  privacy@shopireply.com
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
