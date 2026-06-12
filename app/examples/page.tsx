import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Examples — Before & After AI-Generated Replies",
  description:
    "See real before and after examples of AI-generated customer replies, product descriptions, review responses, and more for Etsy, Shopify, and Trendyol sellers.",
};

const EXAMPLES = [
  {
    title: "Angry Customer — Order Not Received",
    mode: "Customer Reply",
    platform: "Etsy",
    before:
      "where is my order its been 2 week i need it urgently please help me or i will open a dispute",
    after: `Hi there! 😊

I completely understand how frustrating this must be, and I sincerely apologize for the delay. Let me look into this right away.

Could you please send me your order number? I want to check the exact status with the carrier and give you a proper update within the next hour.

Your order is very important to me, and I'll make sure this gets resolved for you today. Thank you so much for your patience!

Warm regards,
[Your Shop Name]`,
    tags: ["Customer Reply", "Etsy", "Professional"],
  },
  {
    title: "Refund Request — Wrong Item Received",
    mode: "Refund Response",
    platform: "Shopify",
    before: "I received the wrong item. I ordered the blue one but got red. I want a refund.",
    after: `Hello,

Oh no, I'm so sorry about this mix-up — receiving the wrong item is completely unacceptable and I take full responsibility for this error.

Here's what I'll do right away:
1. I'll send you the correct blue item via express shipping at no extra cost
2. You're welcome to keep the red item as our apology, or return it for a full refund — completely your choice

Could you please share a quick photo of the received item? This helps me update my records and prevent this from happening again.

Once again, I'm deeply sorry for the inconvenience. I'll get this sorted for you immediately!

Best,
[Shop Name]`,
    tags: ["Refund Response", "Shopify", "Apologetic"],
  },
  {
    title: "Bad English Product Description → Professional Copy",
    mode: "Product Description",
    platform: "Etsy",
    before:
      "Hand made bracelet. nice color. good quality material. women like it. can be gift.",
    after: `✨ Handcrafted Boho Beaded Bracelet — A Gift She'll Treasure

Add a touch of artisan charm to any outfit with this beautiful handmade bracelet, lovingly crafted with premium natural stone beads.

**Why you'll love it:**
• 🌿 Made from genuine natural stones — each piece is uniquely yours
• 📏 Adjustable cord fits wrist sizes 14–20cm
• 🎁 Arrives in a kraft gift box — ready to give
• ✋ 100% handmade by an independent artisan
• 🌍 Ships worldwide with tracked shipping

**Perfect for:** Birthday gifts, wedding favors, Mother's Day, self-gifting

Each bracelet is made with care and intention. No two are exactly alike — that's the beauty of handmade! 💜`,
    tags: ["Product Description", "Etsy", "SEO"],
  },
  {
    title: "Negative Review Response",
    mode: "Review Response",
    platform: "Amazon",
    before:
      "[2-star review] 'The quality is not as expected, the stitching was loose and it broke after 3 uses. Very disappointed for the price.'",
    after: `Dear Customer,

We're genuinely sorry to hear about your experience with our product. A broken stitching after just 3 uses is absolutely not the standard we hold ourselves to, and your disappointment is completely understandable.

We'd love the chance to make this right. Please send us a direct message with your order details, and we'll immediately arrange:
• A full replacement with priority shipping, or
• A complete refund — whichever you prefer

Your feedback has also been shared with our quality team so we can prevent this issue for future customers. Thank you for taking the time to let us know — it genuinely helps us improve.

We hope to restore your trust in our products. 💙`,
    tags: ["Review Response", "Amazon", "Empathetic"],
  },
  {
    title: "Etsy SEO Title Improvement",
    mode: "SEO Title",
    platform: "Etsy",
    before: "macrame wall hanging big",
    after: `Option 1: Macrame Wall Hanging Large | Boho Wall Decor | Handmade Woven Tapestry | Living Room Art | Housewarming Gift

Option 2: Large Boho Macrame Wall Hanging | Handwoven Home Decor | Woven Wall Art | Bohemian Bedroom Decor | Modern Farmhouse

Option 3: XL Macrame Wall Hanging Handmade | Boho Decor for Living Room | Natural Cotton Woven Art | 60cm Tapestry Wall Art`,
    tags: ["SEO Title", "Etsy", "Keywords"],
  },
];

export default function ExamplesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingNav />
      <main className="flex-1 py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 mb-4">
              ✨ Real examples
            </div>
            <h1 className="text-4xl font-bold mb-4">See the transformation</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Real before-and-after examples from ShopiReply AI. Each output is generated fresh — yours will be customized to your specific situation.
            </p>
          </div>

          <div className="space-y-8">
            {EXAMPLES.map((example, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-4 bg-muted/30">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-lg flex-1">{example.title}</h2>
                    <div className="flex gap-2">
                      {example.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs rounded-full bg-background border border-border/60 px-2 py-0.5 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/50">
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="h-2 w-2 rounded-full bg-red-400 inline-block" />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Before — Original message
                        </span>
                      </div>
                      <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-900 leading-relaxed font-mono">
                        {example.before}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="h-2 w-2 rounded-full bg-green-400 inline-block" />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          After — AI Generated
                        </span>
                      </div>
                      <div className="rounded-xl bg-green-50 border border-green-100 p-4 text-sm text-green-900 leading-relaxed whitespace-pre-wrap">
                        {example.after}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16 py-12 rounded-2xl bg-gradient-to-br from-brand-50 to-blue-50 border border-brand-100">
            <h2 className="text-2xl font-bold mb-3">
              Ready to generate your own?
            </h2>
            <p className="text-muted-foreground mb-6">
              Start free with 10 generations/month. No credit card required.
            </p>
            <Link href="/signup">
              <Button variant="gradient" size="lg">
                Start generating for free →
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
