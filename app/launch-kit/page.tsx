import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Launch Kit — Admin Only",
  robots: { index: false },
};

const TWEET_DRAFTS = [
  "I just launched ShopiReply AI 🚀\n\nAI that turns messy customer messages into professional replies in 10 seconds\n\nBuilt for Etsy/Shopify/Trendyol sellers\nFree plan available\n\n→ [link]\n\n#buildinpublic #IndieHackers #ecommerce",
  "Dear Etsy sellers 📦\n\nYou shouldn't spend 20 mins writing a reply to an angry customer\n\nShopiReply AI does it in 10 seconds\n\n✅ Customer replies\n✅ Product descriptions  \n✅ Review responses\n✅ Refund messages\n\nFree to start →",
  "Turkish seller selling on Etsy? 🇹🇷\n\nStruggling with English customer messages?\n\nShopiReply AI generates professional English replies from your Turkish notes\n\nFirst 10 replies free →",
  "The #1 mistake Etsy sellers make:\n\nCopying the same reply template for every customer\n\nAI now writes 3 different professional options for each message\n\nTry ShopiReply AI free →",
  "What took me 30 minutes now takes 30 seconds:\n\nWriting professional product descriptions for my Etsy shop\n\nShopiReply AI generates benefit-led, SEO-optimized copy instantly\n\nGame changer for small sellers →",
  "Launched ShopiReply AI 🎉\n\nMonth 1 goals:\n• 50 signups\n• 5 paid users\n• $50 MRR\n\nHelping e-commerce sellers write professional replies with AI\n\nFree plan forever. No credit card needed.\n\n#buildinpublic",
  "Hot take: most Etsy sellers waste 2-3 hours/week on customer messages\n\nShopiReply AI:\n→ Turns any message into 3 professional options\n→ Supports Turkish & English\n→ Works on all platforms\n\n10 free/month, forever →",
  "POV: A customer messages you in broken English asking where their order is\n\nYou have 3 replies ready in 10 seconds\n\nEach one polite, professional, asks the right questions\n\nThat's ShopiReply AI →",
  "Just hit 100 generations on ShopiReply AI!\n\nWhat sellers are using it for most:\n1. Customer reply 42%\n2. Product descriptions 28%\n3. Review responses 18%\n4. SEO titles 12%\n\n#buildinpublic",
  "If you sell on Etsy/Trendyol/Shopify:\n\nYour reply quality affects:\n• Review rating\n• Repeat purchases\n• Dispute outcomes\n\nShopiReply AI helps you reply like a pro, every time →",
];

const REDDIT_POSTS = [
  {
    title: "I built an AI tool for Etsy sellers who struggle with English customer messages",
    body: "Hey r/Etsy!\n\nI noticed a lot of smaller sellers (especially non-native English speakers) struggle with writing professional customer replies. I built ShopiReply AI to solve this.\n\nYou paste the customer message → choose the tone → get 3 professional reply options in 10 seconds.\n\nWorks for: customer replies, product descriptions, review responses, refund messages, late shipping apologies.\n\nFree plan with 10 generations/month. No credit card.\n\nWould love feedback from real Etsy sellers! Link in profile.",
  },
  {
    title: "[Show HN] ShopiReply AI — AI customer reply generator for e-commerce sellers",
    body: "Hi HN!\n\nI built ShopiReply AI after noticing that small e-commerce sellers (especially non-native English speakers) spend disproportionate time writing customer messages.\n\nTech stack: Next.js, Supabase, OpenAI GPT-4o-mini, Vercel\nBusiness model: Freemium ($9.99/mo Starter, $19.99/mo Pro)\nTarget market: Etsy, Shopify, Trendyol sellers — especially Turkish sellers selling internationally\n\nThe core insight: Even a small improvement in reply quality leads to better reviews and fewer disputes.\n\nCurrently pre-revenue. Looking for feedback and early users.\n\nLive at: [link]",
  },
  {
    title: "How I reduced customer message response time from 20 minutes to 30 seconds",
    body: "r/shopify — This might be useful for other store owners.\n\nI was spending 2-3 hours a week on customer messages. Now it's 15 minutes.\n\nI built an AI tool (ShopiReply AI) that generates professional replies. You paste the customer message, pick the tone, and get options instantly.\n\nWhat changed for me:\n• Reply quality improved → fewer follow-up messages\n• Customer satisfaction went up\n• Time freed up for actual product work\n\nFree to try with 10 replies/month. Happy to answer questions.",
  },
  {
    title: "Turkish Etsy sellers — how do you handle English customer service?",
    body: "For fellow Turkish sellers on Etsy:\n\nI know the struggle of writing professional English replies when English isn't your first language.\n\nI built a tool specifically for this — ShopiReply AI. You can write your input in Turkish, and it generates the professional English reply for you.\n\nOr choose bilingual output to see both.\n\nFree plan available. Would love feedback from the community: [link]\n\n(Türkçe satıcılara özel destek de var!)",
  },
  {
    title: "I'm a solo founder 3 weeks post-launch — here's what's working",
    body: "r/IndieHackers — Quick update on ShopiReply AI:\n\nWeek 1-3 after launch:\n✅ 47 signups\n✅ 3 paid users ($30 MRR)\n✅ 1,200 generations processed\n\nWhat worked:\n• Posting in niche seller communities\n• DM-ing sellers with weak product descriptions and offering a free improved version\n• Before/after screenshots\n\nWhat didn't:\n• Cold email (0% conversion)\n• Generic SaaS forums\n\nBiggest learning: Find where your exact customer hangs out. For me: Etsy seller Facebook groups.",
  },
];

const DM_TEMPLATES = [
  `Hi [Name]! 👋

I noticed your [product] listing on Etsy and love what you're making.

I noticed the description could be even stronger — I actually ran it through our AI and it generated this improved version:

[paste improved version]

Feel free to use it completely free! If you'd like more like this (for all your listings, plus customer replies, review responses, etc.) I built ShopiReply AI for exactly this.

10 free generations/month, no credit card needed → [link]

Keep up the amazing work! 🌟`,

  `Hey [Name]!

Saw your Shopify store and your products look great. Quick question — how do you handle the customer message volume?

I built an AI tool that generates professional customer replies in 10 seconds. Works great for refund requests, order status questions, review responses.

Free to try with 10 replies/month. Would love to get your feedback as a real seller!

→ [link]`,

  `Merhaba [Name]! 🇹🇷

Etsy mağazanıza baktım, ürünleriniz harika!

Uluslararası müşterilerle İngilizce yazışmak zorunda mısınız? 

ShopiReply AI'yi kurdum — Türkçe bilgi girip profesyonel İngilizce yanıt üretebiliyorsunuz. 10 saniyede.

Ücretsiz deneme (ayda 10 üretim, kredi kartı gerekmez): [link]

Geri bildiriminizi çok isterim!`,

  `Hi [Name]!

I saw your reply to a customer review on Etsy and thought I might be able to help.

ShopiReply AI generates empathetic, professional review responses in seconds — both for positive and negative reviews.

Here's what an AI-improved version of that response might look like:
[example]

Would love for you to try it free! → [link]`,

  `Hey [Name]!

Your [product] on Etsy has great potential. I noticed the SEO title could be improved to rank better in search.

Current: "[current title]"
AI-improved: "[improved title with keywords]"

ShopiReply AI can generate optimized SEO titles for all your products. Free plan with 10 titles/month.

Happy to help if you have questions! → [link]`,
];

const VIDEO_SCRIPTS = [
  {
    title: "30-second demo: Customer Reply",
    script: `[0-3s] Screen recording opens on ShopiReply AI dashboard
[3-8s] "A customer sends this message: 'where is my order its been 2 weeks'"
[8-12s] Paste message into the generator, select "Customer Reply" and "Professional"
[12-18s] Click Generate — show loading animation
[18-25s] Three professional reply options appear instantly
[25-28s] Click Copy on the best option
[28-30s] Text: "From frustrating to professional in 10 seconds. Free at shopireply.com"`,
  },
  {
    title: "60-second product description transformation",
    script: `[0-5s] "This is a real product description from Etsy"
[5-10s] Show bad description: "Nice handmade bag. good quality. women love it."
[10-15s] "Let's see what AI generates"
[15-25s] Paste into ShopiReply, select Product Description, Persuasive tone
[25-35s] Generate — show all 3 options appearing
[35-50s] Compare: before vs after side by side
[50-55s] "Benefit-led copy, bullet points, SEO keywords — all in 30 seconds"
[55-60s] CTA: "Start free at shopireply.com"`,
  },
];

const BLOG_TITLE_IDEAS = [
  "How to Write Professional Etsy Customer Replies (Even If Your English Isn't Perfect)",
  "10 Etsy Customer Message Templates That Actually Convert",
  "How Small Etsy Sellers Are Using AI to Save 3 Hours a Week",
  "The Complete Guide to Etsy Review Responses: Positive and Negative",
  "Why Your Etsy Product Description Is Costing You Sales (And How to Fix It)",
  "Trendyol Satıcıları için Müşteri Mesajı Şablonları",
  "How to Handle an Angry Shopify Customer Like a Pro",
  "The SEO Title Formula That Gets Etsy Products Found",
  "AI Tools for E-commerce Sellers: A Practical Guide for 2025",
  "How to Write a Late Shipping Apology That Keeps the Customer Happy",
  "Etsy vs Shopify Customer Service: Key Differences and Best Practices",
  "5 Types of Customer Messages Every Etsy Seller Gets (And How to Reply)",
  "How to Write Refund Responses That Don't Lose the Customer",
  "The Ultimate Guide to Etsy Shop SEO in 2025",
  "Why Turkish Sellers Are Winning on International Marketplaces",
  "How to Scale Your Etsy Shop Without Burning Out on Customer Service",
  "Product Description Psychology: Why Benefits Beat Features Every Time",
  "Responding to Negative Reviews: The Method That Converts Critics to Fans",
  "How to Build a Brand Voice for Your Handmade Business",
  "From Side Hustle to Full-Time: How Smart Sellers Automate Customer Service",
];

export default async function LaunchKitPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email || "")) {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-3 py-1 mb-4">
          🔒 Admin Only
        </div>
        <h1 className="text-3xl font-bold">Launch Kit</h1>
        <p className="text-muted-foreground">Marketing assets, templates, and content for launch</p>
      </div>

      {/* Tweet drafts */}
      <Card>
        <CardHeader>
          <CardTitle>10 Tweet/X Drafts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {TWEET_DRAFTS.map((tweet, i) => (
            <div key={i} className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">Tweet {i + 1}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(tweet)}
                  className="text-xs text-primary hover:underline"
                >
                  Copy
                </button>
              </div>
              <p className="text-sm whitespace-pre-wrap">{tweet}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Reddit posts */}
      <Card>
        <CardHeader>
          <CardTitle>5 Reddit / IndieHackers Posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {REDDIT_POSTS.map((post, i) => (
            <div key={i} className="bg-muted/50 rounded-xl p-4">
              <p className="font-semibold text-sm mb-2">{post.title}</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{post.body}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* DM templates */}
      <Card>
        <CardHeader>
          <CardTitle>5 Cold DM Templates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {DM_TEMPLATES.map((dm, i) => (
            <div key={i} className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">DM {i + 1}</span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{dm}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Video scripts */}
      <Card>
        <CardHeader>
          <CardTitle>Video Scripts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {VIDEO_SCRIPTS.map((script, i) => (
            <div key={i} className="bg-muted/50 rounded-xl p-4">
              <p className="font-semibold text-sm mb-2">{script.title}</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{script.script}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Blog titles */}
      <Card>
        <CardHeader>
          <CardTitle>20 SEO Blog Title Ideas</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {BLOG_TITLE_IDEAS.map((title, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="text-muted-foreground text-xs mt-0.5 w-6 shrink-0">{i + 1}.</span>
                <span>{title}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
