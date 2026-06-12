import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  getPlanDisplayName,
  getUsagePercentage,
  getRemainingGenerations,
} from "@/lib/utils/limits";
import { formatDate } from "@/lib/utils";
import {
  MessageSquare,
  FileText,
  Search,
  Star,
  RefreshCw,
  Truck,
  HelpCircle,
  ArrowRight,
  Zap,
  Crown,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

const QUICK_ACTIONS = [
  {
    mode: "customer_reply",
    icon: MessageSquare,
    label: "Customer Reply",
    description: "Respond to customer messages",
    color: "from-blue-500 to-cyan-500",
  },
  {
    mode: "product_description",
    icon: FileText,
    label: "Product Description",
    description: "Write compelling copy",
    color: "from-purple-500 to-pink-500",
  },
  {
    mode: "seo_title",
    icon: Search,
    label: "SEO Title",
    description: "Titles that rank & convert",
    color: "from-orange-500 to-amber-500",
  },
  {
    mode: "review_response",
    icon: Star,
    label: "Review Response",
    description: "Handle reviews professionally",
    color: "from-yellow-500 to-orange-500",
  },
  {
    mode: "refund_response",
    icon: RefreshCw,
    label: "Refund Response",
    description: "Handle returns gracefully",
    color: "from-red-500 to-rose-500",
  },
  {
    mode: "late_shipping",
    icon: Truck,
    label: "Late Shipping Apology",
    description: "Turn delays into trust",
    color: "from-indigo-500 to-blue-500",
  },
  {
    mode: "faq_answer",
    icon: HelpCircle,
    label: "FAQ Answer",
    description: "Answer questions fast",
    color: "from-teal-500 to-green-500",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: recentGenerations } = await supabase
    .from("generations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const profileData = profile as any;
  const plan = profileData?.plan || "free";
  const used = profileData?.monthly_generation_count || 0;
  const limit = profileData?.monthly_generation_limit || 10;
  const remaining = getRemainingGenerations(plan, used);
  const percentage = getUsagePercentage(plan, used);
  const displayName = profileData?.full_name || user.email?.split("@")[0] || "there";

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome + stats */}
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-1">
            Welcome back, {displayName}! 👋
          </h1>
          <p className="text-muted-foreground text-sm">
            Ready to write some great replies today?
          </p>
        </div>

        {/* Usage card */}
        <Card className="w-full md:w-80 shrink-0">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                {plan === "pro" ? (
                  <Crown className="h-4 w-4 text-amber-500" />
                ) : (
                  <Zap className="h-4 w-4 text-primary" />
                )}
                <span className="font-semibold text-sm">
                  {getPlanDisplayName(plan)} Plan
                </span>
              </div>
              {plan === "free" && (
                <Link href="/dashboard/settings">
                  <Button size="sm" variant="gradient" className="h-7 text-xs">
                    <TrendingUp className="h-3 w-3" />
                    Upgrade
                  </Button>
                </Link>
              )}
            </div>

            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Monthly usage</span>
              <span className="font-medium">
                {used}/{limit}
              </span>
            </div>
            <Progress
              value={percentage}
              className={
                percentage >= 90 ? "[&>div]:bg-destructive" : undefined
              }
            />
            <p className="text-xs text-muted-foreground mt-2">
              {remaining} generation{remaining !== 1 ? "s" : ""} remaining this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Limit warning */}
      {remaining === 0 && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-sm text-destructive">
              Monthly limit reached
            </p>
            <p className="text-xs text-muted-foreground">
              Upgrade your plan to continue generating replies
            </p>
          </div>
          <Link href="/dashboard/settings">
            <Button variant="gradient" size="sm">
              Upgrade now
            </Button>
          </Link>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(({ mode, icon: Icon, label, description, color }) => (
            <Link
              key={mode}
              href={`/dashboard/generate?mode=${mode}`}
              className="group"
            >
              <Card className="h-full hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer">
                <CardContent className="p-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="font-semibold text-sm mb-1">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* New generation CTA */}
          <Link href="/dashboard/generate" className="group">
            <Card className="h-full border-dashed hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-4 flex flex-col items-center justify-center h-full text-center min-h-[100px]">
                <Zap className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-sm text-primary">Generate Now</p>
                <p className="text-xs text-muted-foreground mt-1">
                  All modes
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent history */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent generations</h2>
          <Link href="/dashboard/history">
            <Button variant="ghost" size="sm" className="gap-1">
              View all
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        {!recentGenerations || recentGenerations.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="font-medium text-muted-foreground mb-2">
                No generations yet
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Start by creating your first professional reply!
              </p>
              <Link href="/dashboard/generate">
                <Button variant="gradient">
                  <Zap className="h-4 w-4" />
                  Generate your first reply
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {(recentGenerations as any[]).map((gen) => {
              const modeLabels: Record<string, string> = {
                customer_reply: "Customer Reply",
                product_description: "Product Description",
                seo_title: "SEO Title",
                review_response: "Review Response",
                refund_response: "Refund Response",
                late_shipping: "Late Shipping",
                faq_answer: "FAQ Answer",
              };
              return (
                <Card key={gen.id} className="hover:border-primary/20 transition-colors">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">
                          {modeLabels[gen.mode] || gen.mode}
                        </span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {gen.platform}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {gen.input_text}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(gen.created_at)}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

