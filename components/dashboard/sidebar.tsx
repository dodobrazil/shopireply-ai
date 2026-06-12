"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getPlanDisplayName, getUsagePercentage, getRemainingGenerations } from "@/lib/utils/limits";
import type { Profile } from "@/types/database";
import { Progress } from "@/components/ui/progress";
import {
  LayoutDashboard,
  Sparkles,
  History,
  Settings,
  Zap,
  Crown,
  Shield,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/generate", icon: Sparkles, label: "Generate" },
  { href: "/dashboard/history", icon: History, label: "History" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

interface DashboardSidebarProps {
  profile: Profile | null;
}

export function DashboardSidebar({ profile }: DashboardSidebarProps) {
  const pathname = usePathname();
  const plan = profile?.plan || "free";
  const used = profile?.monthly_generation_count || 0;
  const limit = profile?.monthly_generation_limit || 10;
  const remaining = getRemainingGenerations(plan, used);
  const percentage = getUsagePercentage(plan, used);

  return (
    <aside className="hidden md:flex flex-col w-60 bg-background border-r border-border/40 min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 h-16 border-b border-border/40 font-bold text-lg">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-brand">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="gradient-text">ShopiReply AI</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === "/dashboard" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}

        {/* Admin link (if admin — shown conditionally via CSS would need server check, skip for simplicity) */}
      </nav>

      {/* Usage panel */}
      <div className="px-4 py-4 border-t border-border/40 space-y-3">
        {/* Plan badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {plan === "pro" ? (
              <Crown className="h-3.5 w-3.5 text-amber-500" />
            ) : plan === "starter" ? (
              <Shield className="h-3.5 w-3.5 text-blue-500" />
            ) : (
              <Zap className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span className="text-xs font-semibold">
              {getPlanDisplayName(plan)} Plan
            </span>
          </div>
          {plan === "free" && (
            <Link
              href="/dashboard/settings"
              className="text-xs text-primary font-medium hover:underline"
            >
              Upgrade
            </Link>
          )}
        </div>

        {/* Usage bar */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>
              {used}/{limit} used
            </span>
            <span>{remaining} left</span>
          </div>
          <Progress
            value={percentage}
            className={cn("h-1.5", percentage >= 90 && "[&>div]:bg-destructive")}
          />
        </div>
      </div>
    </aside>
  );
}
