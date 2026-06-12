"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getPlanDisplayName, PLAN_LIMITS } from "@/lib/utils/limits";
import type { Profile } from "@/types/database";
import {
  User,
  CreditCard,
  Globe,
  Loader2,
  Crown,
  Shield,
  Zap,
  ExternalLink,
  MessageSquare,
  Check,
} from "lucide-react";

// Note: isStripeConfigured is only available server-side normally
// We'll check via API or pass as prop. For simplicity, check env on client:
const STRIPE_ENABLED = !!(
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function SettingsPage() {
  const { toast } = useToast();
  const supabase = createClient();

  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [brandVoice, setBrandVoice] = useState("");
  const [defaultLanguage, setDefaultLanguage] = useState<"en" | "tr" | "bilingual">("en");

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const profileData = data as any;
    if (profileData) {
      setProfile(profileData);
      setFullName(profileData.full_name || "");
      setBrandVoice(profileData.brand_voice || "");
      setDefaultLanguage(profileData.default_language || "en");
    }
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    const { error } = await (supabase as any)
      .from("profiles")
      .update({
        full_name: fullName,
        brand_voice: brandVoice,
        default_language: defaultLanguage,
      })
      .eq("id", (profile as any)!.id);

    if (error) {
      toast({ title: "Failed to save", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Settings saved! ✅" });
    }
    setSaving(false);
  };

  const handleCheckout = async (plan: string) => {
    setCheckoutLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          paymentMethod: STRIPE_ENABLED ? "stripe" : "manual",
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.manual) {
        toast({
          title: "Payment request sent",
          description: data.message,
        });
        // Show contact info
        if (data.contactEmail) {
          window.open(`mailto:${data.contactEmail}?subject=Subscription: ${plan}`, "_blank");
        }
      } else {
        toast({
          title: "Checkout failed",
          description: data.error || "Please try again",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({ title: "Network error", variant: "destructive" });
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleManageBilling = async () => {
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      toast({ title: "Failed to open billing portal", variant: "destructive" });
    }
  };

  const plan = profile?.plan || "free";
  const planLabel = getPlanDisplayName(plan);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your profile, preferences, and subscription
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={profile?.email || ""}
              disabled
              className="bg-muted/50 cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed after signup
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Brand voice + language */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-4 w-4" />
            Generation Preferences
          </CardTitle>
          <CardDescription>
            These defaults will be used for all new generations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brandVoice">Brand voice</Label>
            <Textarea
              id="brandVoice"
              value={brandVoice}
              onChange={(e) => setBrandVoice(e.target.value)}
              placeholder="Describe your brand's personality... e.g. 'Friendly small handmade shop, casual tone, use emojis occasionally, always sign off with shop name'"
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="defaultLanguage">Default output language</Label>
            <Select
              value={defaultLanguage}
              onValueChange={(v) => setDefaultLanguage(v as typeof defaultLanguage)}
            >
              <SelectTrigger id="defaultLanguage">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="tr">Turkish</SelectItem>
                <SelectItem value="bilingual">Bilingual (EN + TR)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSaveProfile} disabled={saving} variant="gradient">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save preferences"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="h-4 w-4" />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current plan */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border/50">
            <div className="flex items-center gap-3">
              {plan === "pro" ? (
                <Crown className="h-5 w-5 text-amber-500" />
              ) : plan === "starter" ? (
                <Shield className="h-5 w-5 text-blue-500" />
              ) : (
                <Zap className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-semibold">{planLabel} Plan</p>
                <p className="text-xs text-muted-foreground">
                  {(PLAN_LIMITS as any)[plan]} generations/month ·{" "}
                  {profile?.monthly_generation_count || 0} used
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">
                {plan === "free"
                  ? "Free"
                  : plan === "starter"
                  ? "$9.99/mo"
                  : "$19.99/mo"}
              </p>
              {profile?.subscription_status === "active" && (
                <p className="text-xs text-green-600">Active</p>
              )}
            </div>
          </div>

          {/* Upgrade options (for free) */}
          {plan === "free" && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Upgrade your plan</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {/* Starter */}
                <div className="border border-border/60 rounded-xl p-4 space-y-3">
                  <div>
                    <p className="font-semibold">Starter</p>
                    <p className="text-sm text-muted-foreground">
                      $9.99/mo or 299 TRY/mo
                    </p>
                    <p className="text-xs text-muted-foreground">
                      500 generations/month
                    </p>
                  </div>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {["All 7 generators", "Brand voice", "History"].map((f) => (
                      <li key={f} className="flex items-center gap-1.5">
                        <Check className="h-3 w-3 text-green-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant="gradient"
                    size="sm"
                    onClick={() => handleCheckout("starter")}
                    disabled={!!checkoutLoading}
                  >
                    {checkoutLoading === "starter" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : STRIPE_ENABLED ? (
                      "Subscribe"
                    ) : (
                      "Contact to subscribe"
                    )}
                  </Button>
                </div>

                {/* Pro */}
                <div className="border-2 border-primary/40 rounded-xl p-4 space-y-3 relative">
                  <div className="absolute -top-2.5 left-3">
                    <span className="text-xs bg-gradient-brand text-white px-2 py-0.5 rounded-full font-medium">
                      Most popular
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">Pro</p>
                    <p className="text-sm text-muted-foreground">
                      $19.99/mo or 599 TRY/mo
                    </p>
                    <p className="text-xs text-muted-foreground">
                      2,000 generations/month
                    </p>
                  </div>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {["All 7 generators", "Brand voice", "History", "Priority support"].map(
                      (f) => (
                        <li key={f} className="flex items-center gap-1.5">
                          <Check className="h-3 w-3 text-green-500" />
                          {f}
                        </li>
                      )
                    )}
                  </ul>
                  <Button
                    className="w-full"
                    variant="gradient"
                    size="sm"
                    onClick={() => handleCheckout("pro")}
                    disabled={!!checkoutLoading}
                  >
                    {checkoutLoading === "pro" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : STRIPE_ENABLED ? (
                      "Subscribe"
                    ) : (
                      "Contact to subscribe"
                    )}
                  </Button>
                </div>
              </div>

              {!STRIPE_ENABLED && (
                <p className="text-xs text-muted-foreground text-center">
                  🇹🇷 Turkish payment (iyzico/PayTR) available. Contact us to subscribe.
                </p>
              )}
            </div>
          )}

          {/* Manage billing (for paid) */}
          {plan !== "free" && STRIPE_ENABLED && profile?.billing_customer_id && (
            <Button variant="outline" onClick={handleManageBilling} className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Manage billing
            </Button>
          )}

          {plan !== "free" && !STRIPE_ENABLED && (
            <p className="text-sm text-muted-foreground">
              To manage your subscription, please contact us at{" "}
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_APP_NAME || "billing@shopireply.com"}`}
                className="text-primary hover:underline"
              >
                billing@shopireply.com
              </a>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
