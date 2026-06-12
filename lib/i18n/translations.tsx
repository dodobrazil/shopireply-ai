"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type AppLanguage = "en" | "tr";

// ============================================================
// TRANSLATIONS
// ============================================================
export const translations = {
  en: {
    // Navigation
    nav: {
      home: "Home",
      examples: "Examples",
      pricing: "Pricing",
      login: "Log in",
      signup: "Start free",
      dashboard: "Dashboard",
    },
    // Hero
    hero: {
      badge: "AI-powered for e-commerce sellers",
      title: "Turn messy customer messages into professional replies",
      subtitle:
        "Generate customer replies, product descriptions, SEO titles, review responses, and more in 10 seconds. Built for Etsy, Shopify, Trendyol, and Amazon sellers.",
      cta: "Start free — 10 replies/month",
      ctaSecondary: "See examples",
      stats: {
        sellers: "500+ sellers",
        replies: "50,000+ replies generated",
        time: "10 seconds avg",
      },
    },
    // Features
    features: {
      title: "Everything a seller needs",
      subtitle: "7 powerful tools built for online sellers",
    },
    // Modes
    modes: {
      customer_reply: "Customer Reply",
      product_description: "Product Description",
      seo_title: "SEO Title",
      review_response: "Review Response",
      refund_response: "Refund Response",
      late_shipping: "Late Shipping Apology",
      faq_answer: "FAQ Answer",
    },
    // Pricing
    pricing: {
      title: "Simple, transparent pricing",
      subtitle: "Start free. Upgrade when you need more.",
      free: {
        name: "Free",
        price: "$0",
        description: "Perfect for getting started",
        limit: "10 generations/month",
      },
      starter: {
        name: "Starter",
        price: "$9.99",
        priceTRY: "299 TRY",
        description: "For growing sellers",
        limit: "500 generations/month",
      },
      pro: {
        name: "Pro",
        price: "$19.99",
        priceTRY: "599 TRY",
        description: "For serious sellers",
        limit: "2,000 generations/month",
      },
      cta: "Get started",
      ctaFree: "Start free",
      popular: "Most popular",
    },
    // Dashboard
    dashboard: {
      title: "Dashboard",
      welcome: "Welcome back",
      usage: "Monthly Usage",
      remaining: "remaining",
      quickActions: "Quick actions",
      recentHistory: "Recent history",
      noHistory: "No generations yet. Start by creating your first reply!",
      generate: "Generate",
    },
    // Generator
    generator: {
      title: "Generate",
      mode: "Mode",
      platform: "Platform",
      inputText: "Your message or content",
      inputPlaceholder:
        "Paste the customer message or describe your product...",
      tone: "Tone",
      language: "Output language",
      brandVoice: "Brand voice (optional)",
      brandVoicePlaceholder: "e.g. friendly small business, professional luxury brand...",
      generate: "Generate",
      generating: "Generating...",
      results: "Generated options",
      copy: "Copy",
      copied: "Copied!",
      save: "Save",
      saved: "Saved",
      regenerate: "Regenerate",
      makeShorter: "Make shorter",
      makeWarmer: "Make warmer",
      translate: "Translate",
      improveGrammar: "Improve grammar",
      limitReached: "Generation limit reached. Please upgrade your plan.",
    },
    // Auth
    auth: {
      login: "Log in",
      signup: "Create account",
      email: "Email",
      password: "Password",
      fullName: "Full name",
      forgotPassword: "Forgot password?",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      resetPassword: "Reset password",
      resetSent: "Password reset email sent. Check your inbox.",
      googleLogin: "Continue with Google",
    },
    // Common
    common: {
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      search: "Search",
      filter: "Filter",
      loading: "Loading...",
      error: "Something went wrong",
      success: "Success!",
      back: "Back",
      upgrade: "Upgrade plan",
    },
    // FAQ
    faq: {
      title: "Frequently asked questions",
      items: [
        {
          q: "How does ShopiReply AI work?",
          a: "You paste your customer message or product info, choose a mode and tone, and our AI generates 3 professional options in seconds. Copy the one you like best.",
        },
        {
          q: "What platforms does it support?",
          a: "Etsy, Shopify, Trendyol, Amazon Handmade, Instagram, WooCommerce, and more.",
        },
        {
          q: "Can I generate in Turkish?",
          a: "Yes! Select Turkish or bilingual output. Perfect for Turkish sellers selling internationally.",
        },
        {
          q: "What happens when I hit my limit?",
          a: "Your count resets every month. You can upgrade anytime to get more generations.",
        },
        {
          q: "Is my data private?",
          a: "Yes. Your messages and generations are private to your account and never shared.",
        },
      ],
    },
  },
  tr: {
    // Navigation
    nav: {
      home: "Ana Sayfa",
      examples: "Örnekler",
      pricing: "Fiyatlar",
      login: "Giriş yap",
      signup: "Ücretsiz başla",
      dashboard: "Panel",
    },
    // Hero
    hero: {
      badge: "E-ticaret satıcıları için AI destekli araç",
      title: "Karışık müşteri mesajlarını profesyonel yanıtlara dönüştür",
      subtitle:
        "10 saniyede müşteri yanıtları, ürün açıklamaları, SEO başlıkları, yorum yanıtları ve daha fazlasını oluşturun. Etsy, Shopify, Trendyol ve Amazon satıcıları için tasarlandı.",
      cta: "Ücretsiz başla — 10 yanıt/ay",
      ctaSecondary: "Örnekleri gör",
      stats: {
        sellers: "500+ satıcı",
        replies: "50.000+ yanıt oluşturuldu",
        time: "Ort. 10 saniye",
      },
    },
    // Features
    features: {
      title: "Her satıcının ihtiyacı olan araçlar",
      subtitle: "Online satıcılar için 7 güçlü araç",
    },
    // Modes
    modes: {
      customer_reply: "Müşteri Yanıtı",
      product_description: "Ürün Açıklaması",
      seo_title: "SEO Başlığı",
      review_response: "Yorum Yanıtı",
      refund_response: "İade Yanıtı",
      late_shipping: "Geç Kargo Özrü",
      faq_answer: "SSS Yanıtı",
    },
    // Pricing
    pricing: {
      title: "Basit, şeffaf fiyatlandırma",
      subtitle: "Ücretsiz başla. İhtiyacın olduğunda yükselt.",
      free: {
        name: "Ücretsiz",
        price: "0 TRY",
        description: "Başlamak için mükemmel",
        limit: "Ayda 10 üretim",
      },
      starter: {
        name: "Başlangıç",
        price: "299 TRY",
        priceTRY: "$9.99",
        description: "Büyüyen satıcılar için",
        limit: "Ayda 500 üretim",
      },
      pro: {
        name: "Pro",
        price: "599 TRY",
        priceTRY: "$19.99",
        description: "Ciddi satıcılar için",
        limit: "Ayda 2.000 üretim",
      },
      cta: "Başla",
      ctaFree: "Ücretsiz başla",
      popular: "En popüler",
    },
    // Dashboard
    dashboard: {
      title: "Panel",
      welcome: "Tekrar hoş geldiniz",
      usage: "Aylık Kullanım",
      remaining: "kaldı",
      quickActions: "Hızlı işlemler",
      recentHistory: "Son geçmiş",
      noHistory: "Henüz üretim yok. İlk yanıtını oluşturarak başla!",
      generate: "Oluştur",
    },
    // Generator
    generator: {
      title: "Oluştur",
      mode: "Mod",
      platform: "Platform",
      inputText: "Mesajınız veya içeriğiniz",
      inputPlaceholder:
        "Müşteri mesajını yapıştır veya ürününü anlat...",
      tone: "Ton",
      language: "Çıktı dili",
      brandVoice: "Marka sesi (isteğe bağlı)",
      brandVoicePlaceholder: "örn. samimi küçük işletme, profesyonel lüks marka...",
      generate: "Oluştur",
      generating: "Oluşturuluyor...",
      results: "Oluşturulan seçenekler",
      copy: "Kopyala",
      copied: "Kopyalandı!",
      save: "Kaydet",
      saved: "Kaydedildi",
      regenerate: "Yeniden oluştur",
      makeShorter: "Kısalt",
      makeWarmer: "Daha samimi yap",
      translate: "Çevir",
      improveGrammar: "Dilbilgisini düzelt",
      limitReached: "Üretim limitine ulaşıldı. Lütfen planınızı yükseltin.",
    },
    // Auth
    auth: {
      login: "Giriş yap",
      signup: "Hesap oluştur",
      email: "E-posta",
      password: "Şifre",
      fullName: "Ad soyad",
      forgotPassword: "Şifremi unuttum?",
      noAccount: "Hesabınız yok mu?",
      hasAccount: "Zaten hesabınız var mı?",
      resetPassword: "Şifreyi sıfırla",
      resetSent: "Şifre sıfırlama e-postası gönderildi. Gelen kutunuzu kontrol edin.",
      googleLogin: "Google ile devam et",
    },
    // Common
    common: {
      save: "Kaydet",
      cancel: "İptal",
      delete: "Sil",
      search: "Ara",
      filter: "Filtrele",
      loading: "Yükleniyor...",
      error: "Bir şeyler ters gitti",
      success: "Başarılı!",
      back: "Geri",
      upgrade: "Planı yükselt",
    },
    // FAQ
    faq: {
      title: "Sıkça sorulan sorular",
      items: [
        {
          q: "ShopiReply AI nasıl çalışır?",
          a: "Müşteri mesajınızı veya ürün bilginizi yapıştırın, mod ve ton seçin; AI saniyeler içinde 3 profesyonel seçenek üretir. En beğendiğinizi kopyalayın.",
        },
        {
          q: "Hangi platformları destekliyor?",
          a: "Etsy, Shopify, Trendyol, Amazon Handmade, Instagram, WooCommerce ve daha fazlası.",
        },
        {
          q: "Türkçe üretebilir miyim?",
          a: "Evet! Türkçe veya iki dilli çıktı seçin. Uluslararası satış yapan Türk satıcılar için mükemmel.",
        },
        {
          q: "Limite ulaşırsam ne olur?",
          a: "Sayacınız her ay sıfırlanır. Daha fazlası için istediğiniz zaman yükseltebilirsiniz.",
        },
        {
          q: "Verilerim güvende mi?",
          a: "Evet. Mesajlarınız ve üretimleriniz hesabınıza özeldir, asla paylaşılmaz.",
        },
      ],
    },
  },
} as const;

export type Translations = typeof translations.en;

// Context
interface LanguageContextType {
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<AppLanguage>("en");

  return (
    <LanguageContext.Provider
      value={{ lang, setLang, t: translations[lang] as Translations }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
