"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Copy,
  Check,
  RefreshCw,
  Minimize2,
  Heart,
  Languages,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type GenerationMode =
  | "customer_reply"
  | "product_description"
  | "seo_title"
  | "review_response"
  | "refund_response"
  | "late_shipping"
  | "faq_answer";

const MODES: { value: GenerationMode; label: string; emoji: string }[] = [
  { value: "customer_reply", label: "Customer Reply", emoji: "💬" },
  { value: "product_description", label: "Product Description", emoji: "📝" },
  { value: "seo_title", label: "SEO Title", emoji: "🔍" },
  { value: "review_response", label: "Review Response", emoji: "⭐" },
  { value: "refund_response", label: "Refund Response", emoji: "↩️" },
  { value: "late_shipping", label: "Late Shipping Apology", emoji: "📦" },
  { value: "faq_answer", label: "FAQ Answer", emoji: "❓" },
];

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "apologetic", label: "Apologetic" },
  { value: "persuasive", label: "Persuasive" },
  { value: "concise", label: "Concise" },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "tr", label: "Turkish" },
  { value: "bilingual", label: "Bilingual (EN + TR)" },
];

const PLATFORMS = [
  { value: "etsy", label: "Etsy" },
  { value: "shopify", label: "Shopify" },
  { value: "trendyol", label: "Trendyol" },
  { value: "amazon", label: "Amazon" },
  { value: "instagram", label: "Instagram" },
  { value: "woocommerce", label: "WooCommerce" },
  { value: "other", label: "Other" },
];

const MODE_PLACEHOLDERS: Record<GenerationMode, string> = {
  customer_reply: "Paste the customer's message here...\n\nExample: 'where is my order? I ordered 2 weeks ago and still nothing. very disappointed'",
  product_description: "Describe your product...\n\nExample: 'Handmade leather wallet. Brown color. Has 6 card slots and a zippered coin pocket. Made in Turkey.'",
  seo_title: "Describe your product for SEO optimization...\n\nExample: 'Handmade macrame wall hanging, boho decor, 60cm wide'",
  review_response: "Paste the customer review here...\n\nExample: '★★★ - Product looks okay but shipping took 3 weeks. Not happy with the wait.'",
  refund_response: "Describe the refund situation...\n\nExample: 'Customer bought a ring size 7 but received size 8. Wants a refund.'",
  late_shipping: "Describe the shipping situation...\n\nExample: 'Order was placed 10 days ago, supposed to arrive in 5 days. Carrier lost the package and is now reshipping.'",
  faq_answer: "What is the customer asking?\n\nExample: 'Do you offer custom sizes for your handmade bags?'",
};

interface OutputCardProps {
  output: string;
  index: number;
}

function OutputCard({ output, index }: OutputCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // Track copy event
    fetch("/api/analytics/copy", { method: "POST" }).catch(() => {});
  };

  return (
    <div className="output-card group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Option {index + 1}
        </span>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-xs gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </Button>
      </div>
      <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
        {output}
      </p>
      {/* Always visible copy button on mobile */}
      <div className="mt-3 flex gap-2 md:hidden">
        <Button size="sm" variant="outline" className="flex-1 gap-1.5" onClick={handleCopy}>
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default function GeneratePage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [mode, setMode] = useState<GenerationMode>(
    (searchParams.get("mode") as GenerationMode) || "customer_reply"
  );
  const [platform, setPlatform] = useState("etsy");
  const [inputText, setInputText] = useState("");
  const [tone, setTone] = useState("professional");
  const [outputLanguage, setOutputLanguage] = useState("en");
  const [brandVoice, setBrandVoice] = useState("");
  const [showBrandVoice, setShowBrandVoice] = useState(false);

  const [loading, setLoading] = useState(false);
  const [outputs, setOutputs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<{
    used: number;
    limit: number;
    remaining: number;
  } | null>(null);

  const currentMode = MODES.find((m) => m.value === mode);

  const handleGenerate = useCallback(
    async (overrideInput?: string, overrideTone?: string) => {
      const text = overrideInput || inputText;
      if (!text.trim() || text.trim().length < 10) {
        toast({
          title: "Please add more context",
          description: "Enter at least 10 characters to generate.",
          variant: "destructive",
        });
        return;
      }

      setLoading(true);
      setError(null);
      setOutputs([]);

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode,
            platform,
            inputText: text,
            tone: overrideTone || tone,
            outputLanguage,
            brandVoice: brandVoice || undefined,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 429 && data.code === "LIMIT_REACHED") {
            setError("Monthly generation limit reached. Please upgrade your plan.");
            toast({
              title: "Limit reached",
              description: "Upgrade to continue generating.",
              variant: "destructive",
            });
          } else {
            setError(data.error || "Generation failed. Please try again.");
            toast({
              title: "Generation failed",
              description: data.error || "Please try again.",
              variant: "destructive",
            });
          }
          return;
        }

        setOutputs(data.outputs || []);
        setUsage(data.usage);

        toast({
          title: "Generated! ✨",
          description: `${data.outputs?.length || 0} options created.`,
        });
      } catch (err) {
        const error = err as Error;
        setError(error.message || "Network error. Please try again.");
        toast({
          title: "Error",
          description: "Network error. Please check your connection.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [mode, platform, inputText, tone, outputLanguage, brandVoice, toast]
  );

  const handleQuickAction = (action: string) => {
    let suffix = "";
    let newTone = tone;
    
    if (action === "shorter") {
      suffix = "\n\n[Make this response shorter and more concise]";
    } else if (action === "warmer") {
      newTone = "friendly";
      suffix = "\n\n[Make this response warmer and more personal]";
    } else if (action === "translate") {
      const newLang = outputLanguage === "en" ? "tr" : "en";
      setOutputLanguage(newLang);
      suffix = `\n\n[Translate to ${newLang === "tr" ? "Turkish" : "English"}]`;
    } else if (action === "grammar") {
      suffix = "\n\n[Improve the grammar and professional tone]";
    }

    if (suffix) {
      handleGenerate(inputText + suffix, newTone);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Generate</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Fill in the details below and get 3 professional options in seconds
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
        {/* Left: Input form */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-5 space-y-5">
              {/* Mode selector */}
              <div className="space-y-2">
                <Label>Mode</Label>
                <div className="grid grid-cols-2 gap-2">
                  {MODES.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMode(m.value)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left",
                        mode === m.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/60 hover:border-primary/40 hover:bg-accent text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span className="text-base">{m.emoji}</span>
                      <span className="text-xs leading-tight">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform */}
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Input text */}
              <div className="space-y-2">
                <Label>Your message or content</Label>
                <Textarea
                  placeholder={MODE_PLACEHOLDERS[mode]}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[140px] text-sm"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {inputText.length}/3000
                </p>
              </div>

              {/* Tone + Language */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TONES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Output language</Label>
                  <Select value={outputLanguage} onValueChange={setOutputLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((l) => (
                        <SelectItem key={l.value} value={l.value}>
                          {l.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Brand voice (collapsible) */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowBrandVoice(!showBrandVoice)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showBrandVoice ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                  Brand voice (optional)
                </button>
                {showBrandVoice && (
                  <div className="mt-2">
                    <Input
                      placeholder="e.g. 'Friendly small business, casual tone, use emojis sparingly'"
                      value={brandVoice}
                      onChange={(e) => setBrandVoice(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Generate button */}
              <Button
                onClick={() => handleGenerate()}
                disabled={loading || !inputText.trim()}
                variant="gradient"
                size="lg"
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate {currentMode?.emoji}
                  </>
                )}
              </Button>

              {/* Usage info */}
              {usage && (
                <p className="text-xs text-center text-muted-foreground">
                  {usage.used}/{usage.limit} used this month · {usage.remaining} remaining
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Outputs */}
        <div className="space-y-4">
          {/* Quick actions (only when outputs exist) */}
          {outputs.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuickAction("shorter")}
                disabled={loading}
                className="gap-1.5 h-8 text-xs"
              >
                <Minimize2 className="h-3 w-3" />
                Make shorter
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuickAction("warmer")}
                disabled={loading}
                className="gap-1.5 h-8 text-xs"
              >
                <Heart className="h-3 w-3" />
                Make warmer
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuickAction("translate")}
                disabled={loading}
                className="gap-1.5 h-8 text-xs"
              >
                <Languages className="h-3 w-3" />
                Translate
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuickAction("grammar")}
                disabled={loading}
                className="gap-1.5 h-8 text-xs"
              >
                ✏️ Fix grammar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleGenerate()}
                disabled={loading}
                className="gap-1.5 h-8 text-xs"
              >
                <RefreshCw className="h-3 w-3" />
                Regenerate
              </Button>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4">
              <p className="text-sm text-destructive font-medium">{error}</p>
              {error.includes("limit") && (
                <a
                  href="/dashboard/settings"
                  className="text-xs text-primary hover:underline mt-1 block"
                >
                  Upgrade your plan →
                </a>
              )}
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-5">
                    <div className="h-3 bg-muted animate-pulse rounded mb-3 w-24" />
                    <div className="space-y-2">
                      <div className="h-3 bg-muted animate-pulse rounded" />
                      <div className="h-3 bg-muted animate-pulse rounded w-5/6" />
                      <div className="h-3 bg-muted animate-pulse rounded w-4/6" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Output results */}
          {!loading && outputs.length > 0 && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">Generated options</h3>
              </div>
              {outputs.map((output, i) => (
                <OutputCard key={i} output={output} index={i} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && outputs.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center h-64 text-center rounded-2xl border-2 border-dashed border-border/50">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Zap className="h-7 w-7 text-primary" />
              </div>
              <p className="font-medium text-muted-foreground mb-1">
                Your generated options will appear here
              </p>
              <p className="text-sm text-muted-foreground/70">
                Fill in the form and click Generate
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

