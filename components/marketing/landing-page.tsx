"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n/translations";
import {
  MessageSquare,
  FileText,
  Search,
  Star,
  RefreshCw,
  Truck,
  HelpCircle,
  ArrowRight,
  CheckCircle,
  Zap,
  Globe,
  ShoppingBag,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MODE_ICONS = {
  customer_reply: MessageSquare,
  product_description: FileText,
  seo_title: Search,
  review_response: Star,
  refund_response: RefreshCw,
  late_shipping: Truck,
  faq_answer: HelpCircle,
};

const MODE_DESCRIPTIONS = {
  en: {
    customer_reply: "Turn vague or confusing customer messages into clear, helpful replies",
    product_description: "Create benefit-led descriptions with SEO keywords built in",
    seo_title: "Titles that rank and get clicks on Etsy, Amazon, and more",
    review_response: "Grateful for positives. Empathetic for negatives.",
    refund_response: "Handle returns with grace and keep the customer happy",
    late_shipping: "Turn shipping delays into trust-building moments",
    faq_answer: "Answer common questions before customers even ask",
  },
  tr: {
    customer_reply: "Müşteri mesajlarını net ve yardımcı yanıtlara dönüştür",
    product_description: "SEO anahtar kelimeli, fayda odaklı açıklamalar oluştur",
    seo_title: "Etsy, Amazon ve daha fazlasında sıralanan başlıklar",
    review_response: "Olumlu için minnettarlık. Olumsuz için empati.",
    refund_response: "İadeleri zarafetle yönet ve müşteriyi memnun et",
    late_shipping: "Kargo gecikmelerini güven inşa eden anlara dönüştür",
    faq_answer: "Müşteriler sormadan önce yaygın soruları yanıtla",
  },
};

const BEFORE_AFTER = [
  {
    mode: "customer_reply",
    before: "where is my order its been 2 week i need it urgently please help",
    after:
      "Hi! I completely understand your concern — let me look into this right away. Could you share your order number so I can check the exact shipping status? I'll get back to you within 1 hour. Thank you for your patience! 🙏",
  },
  {
    mode: "product_description",
    before: "Hand made bracelet. nice color. good quality material. women like it.",
    after:
      "✨ Handcrafted with Love — Boho Beaded Bracelet\n\nMeet your new favorite accessory — beautifully handmade and uniquely yours.\n\n• Made with premium natural stone beads\n• Adjustable fit for all wrist sizes\n• Each piece is one-of-a-kind\n• Perfect gift for her — arrives in a gift-ready box\n\nEthically crafted, endlessly wearable. Add a touch of boho charm to any outfit.",
  },
  {
    mode: "review_response",
    before: "[Negative review: 'Product broke after 2 days. Very disappointed.']",
    after:
      "We're truly sorry to hear this happened — this is absolutely not the experience we want you to have. Please send us a message with your order number and we'll arrange a replacement or full refund immediately. Your satisfaction means everything to us, and we'd love the chance to make this right. 💙",
  },
];

const PLATFORMS = [
  { name: "Etsy", emoji: "🛍️" },
  { name: "Shopify", emoji: "🏪" },
  { name: "Trendyol", emoji: "🛒" },
  { name: "Amazon", emoji: "📦" },
  { name: "Instagram", emoji: "📸" },
  { name: "WooCommerce", emoji: "🌐" },
];

export function LandingPage() {
  const { t, lang } = useLanguage();
  const modeDescriptions = MODE_DESCRIPTIONS[lang];

  return (
    <>
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden hero-pattern py-20 md:py-32">
        {/* Decorative blobs */}
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />

        <div className="container mx-auto max-w-6xl px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 mb-6 animate-fade-in">
              <Zap className="h-3.5 w-3.5" />
              {t.hero.badge}
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight animate-fade-in">
              {lang === "en" ? (
                <>
                  Turn messy customer messages into{" "}
                  <span className="gradient-text">professional replies</span>
                </>
              ) : (
                <>
                  Karışık müşteri mesajlarını{" "}
                  <span className="gradient-text">profesyonel yanıtlara</span> dönüştür
                </>
              )}
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in">
              {t.hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in">
              <Link href="/signup">
                <Button variant="gradient" size="xl" className="group">
                  <Zap className="h-5 w-5" />
                  {t.hero.cta}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/examples">
                <Button variant="outline" size="xl">
                  {t.hero.ctaSecondary}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground animate-fade-in">
              {Object.values(t.hero.stats).map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-foreground">{stat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform pills */}
          <div className="mt-16 flex flex-wrap justify-center gap-3">
            {PLATFORMS.map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm font-medium shadow-sm"
              >
                <span>{p.emoji}</span>
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== BEFORE / AFTER ========== */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {lang === "en" ? "See the difference" : "Farkı görün"}
            </h2>
            <p className="text-muted-foreground text-lg">
              {lang === "en"
                ? "Real examples of what ShopiReply AI can do"
                : "ShopiReply AI'nin yapabileceklerinin gerçek örnekleri"}
            </p>
          </div>

          <div className="space-y-6">
            {BEFORE_AFTER.map((item, i) => {
              const Icon = MODE_ICONS[item.mode as keyof typeof MODE_ICONS];
              const modeName = t.modes[item.mode as keyof typeof t.modes];
              return (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-0">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Icon className="h-4 w-4 text-primary" />
                      {modeName}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-red-400 inline-block" />
                          {lang === "en" ? "Before" : "Önce"}
                        </div>
                        <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-900 font-mono leading-relaxed whitespace-pre-wrap">
                          {item.before}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-green-400 inline-block" />
                          {lang === "en" ? "After (AI Generated)" : "Sonra (AI Üretimi)"}
                        </div>
                        <div className="rounded-xl bg-green-50 border border-green-100 p-4 text-sm text-green-900 leading-relaxed whitespace-pre-wrap">
                          {item.after}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/examples">
              <Button variant="outline" size="lg">
                {lang === "en" ? "See all examples" : "Tüm örnekleri gör"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section id="features" className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.features.title}</h2>
            <p className="text-muted-foreground text-lg">{t.features.subtitle}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {(Object.entries(t.modes) as [keyof typeof MODE_ICONS, string][]).map(
              ([mode, name]) => {
                const Icon = MODE_ICONS[mode];
                const desc = modeDescriptions[mode];
                return (
                  <Card
                    key={mode}
                    className="group hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer"
                  >
                    <CardContent className="p-5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm mb-1.5">{name}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                    </CardContent>
                  </Card>
                );
              }
            )}
            {/* Extra feature cards */}
            <Card className="group hover:border-primary/30 hover:shadow-md transition-all duration-200">
              <CardContent className="p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 mb-4">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1.5">
                  {lang === "en" ? "Turkish & English" : "Türkçe & İngilizce"}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {lang === "en"
                    ? "Generate in Turkish, English, or bilingual — perfect for international sellers"
                    : "Türkçe, İngilizce veya iki dilli üret"}
                </p>
              </CardContent>
            </Card>
            <Card className="group hover:border-primary/30 hover:shadow-md transition-all duration-200">
              <CardContent className="p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-600 mb-4">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1.5">
                  {lang === "en" ? "6 Platforms" : "6 Platform"}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {lang === "en"
                    ? "Optimized for Etsy, Shopify, Trendyol, Amazon, Instagram, WooCommerce"
                    : "Etsy, Shopify, Trendyol, Amazon, Instagram, WooCommerce için optimize edildi"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ========== PRICING ========== */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.pricing.title}</h2>
            <p className="text-muted-foreground text-lg">{t.pricing.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-lg">{t.pricing.free.name}</CardTitle>
                <div className="text-3xl font-extrabold mt-2">{t.pricing.free.price}</div>
                <CardDescription>{t.pricing.free.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {[t.pricing.free.limit, "All 7 generators", "All platforms"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block">
                  <Button variant="outline" className="w-full">
                    {t.pricing.ctaFree}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Starter */}
            <Card className="relative border-primary/40 shadow-lg shadow-primary/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-gradient-brand px-4 py-1 text-xs font-semibold text-white shadow">
                  {t.pricing.popular}
                </span>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{t.pricing.starter.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-extrabold">{t.pricing.starter.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">/mo</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {lang === "en" ? `or ${t.pricing.starter.priceTRY}/ay` : `veya ${t.pricing.starter.priceTRY}/month`}
                </div>
                <CardDescription>{t.pricing.starter.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {[
                    t.pricing.starter.limit,
                    "All 7 generators",
                    "All platforms",
                    "Brand voice",
                    "History & search",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block">
                  <Button variant="gradient" className="w-full">
                    {t.pricing.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-lg">{t.pricing.pro.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-extrabold">{t.pricing.pro.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">/mo</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {lang === "en" ? `or ${t.pricing.pro.priceTRY}/ay` : `veya ${t.pricing.pro.priceTRY}/month`}
                </div>
                <CardDescription>{t.pricing.pro.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {[
                    t.pricing.pro.limit,
                    "All 7 generators",
                    "All platforms",
                    "Brand voice",
                    "History & search",
                    "Priority support",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block">
                  <Button variant="outline" className="w-full">
                    {t.pricing.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            {lang === "en"
              ? "🇹🇷 Turkish users: We support iyzico / PayTR for local payment. Contact us."
              : "🇹🇷 Türk kullanıcılar: İyzico / PayTR ile yerel ödeme destekliyoruz. Bize ulaşın."}
          </p>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section className="py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t.faq.title}</h2>
          <div className="space-y-4">
            {t.faq.items.map((item, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-sm mb-2">{item.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="py-20 bg-gradient-brand text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {lang === "en"
              ? "Ready to write better replies?"
              : "Daha iyi yanıtlar yazmaya hazır mısın?"}
          </h2>
          <p className="text-white/80 text-lg mb-8">
            {lang === "en"
              ? "Join 500+ sellers. Start free, no credit card required."
              : "500+ satıcıya katıl. Kredi kartı gerekmeden ücretsiz başla."}
          </p>
          <Link href="/signup">
            <Button
              size="xl"
              className="bg-white text-primary hover:bg-white/90 font-semibold"
            >
              <Zap className="h-5 w-5" />
              {t.hero.cta}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
