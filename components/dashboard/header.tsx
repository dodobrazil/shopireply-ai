"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/database";
import type { User } from "@supabase/supabase-js";
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Sparkles,
  History,
  Settings,
  Zap,
  ChevronDown,
  User as UserIcon,
} from "lucide-react";

interface DashboardHeaderProps {
  user: User;
  profile: Profile | null;
}

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/generate", icon: Sparkles, label: "Generate" },
  { href: "/dashboard/history", icon: History, label: "History" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const displayName =
    profile?.full_name || user.email?.split("@")[0] || "User";

  return (
    <header className="h-16 border-b border-border/40 bg-background/95 backdrop-blur flex items-center px-4 md:px-6 gap-4">
      {/* Mobile logo */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2 font-bold md:hidden"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-brand">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="gradient-text text-sm">ShopiReply AI</span>
      </Link>

      <div className="flex-1" />

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-accent transition-colors text-sm"
        >
          <div className="h-7 w-7 rounded-full bg-gradient-brand flex items-center justify-center">
            <UserIcon className="h-4 w-4 text-white" />
          </div>
          <span className="hidden sm:block font-medium">{displayName}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>

        {userMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setUserMenuOpen(false)}
            />
            <div className="absolute right-0 top-full mt-1 z-20 w-48 rounded-xl border border-border/50 bg-background shadow-xl py-1">
              <div className="px-3 py-2 border-b border-border/40">
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
                onClick={() => setUserMenuOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden p-2 rounded-lg hover:bg-accent"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur pt-16">
          <div className="container px-4 py-6 space-y-2">
            {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
              const isActive =
                href === "/dashboard"
                  ? pathname === href
                  : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              );
            })}
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive gap-3"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              Sign out
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
