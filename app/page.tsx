import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";
import { LandingPage } from "@/components/marketing/landing-page";

export const metadata: Metadata = {
  title: "ShopiReply AI — AI Customer Reply Generator for E-commerce Sellers",
  description:
    "Generate professional customer replies, product descriptions, SEO titles, and review responses in 10 seconds. Built for Etsy, Shopify, Trendyol, Amazon, and Instagram sellers.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingNav />
      <main className="flex-1">
        <LandingPage />
      </main>
      <MarketingFooter />
    </div>
  );
}
