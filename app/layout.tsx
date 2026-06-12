import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/lib/i18n/translations";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "ShopiReply AI — AI Customer Reply Generator for E-commerce Sellers",
    template: "%s | ShopiReply AI",
  },
  description:
    "Generate professional customer replies, product descriptions, SEO titles, and review responses in 10 seconds. Built for Etsy, Shopify, Trendyol, and Amazon sellers.",
  keywords: [
    "AI customer reply generator",
    "Etsy message reply generator",
    "Shopify customer support AI",
    "product description generator for Etsy",
    "Turkish seller English reply tool",
    "e-commerce customer service AI",
    "Trendyol müşteri yanıtı",
    "online satıcı AI araçları",
  ],
  authors: [{ name: "ShopiReply AI" }],
  creator: "ShopiReply AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://shopireply.com",
    siteName: "ShopiReply AI",
    title: "ShopiReply AI — Professional Replies for E-commerce Sellers",
    description:
      "Turn messy customer messages into professional replies in 10 seconds. AI-powered for Etsy, Shopify, Trendyol sellers.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ShopiReply AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopiReply AI — AI Replies for E-commerce Sellers",
    description:
      "Turn messy customer messages into professional replies in 10 seconds.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <LanguageProvider>
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
