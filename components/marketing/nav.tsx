"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/translations";
import { Zap, Menu, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function MarketingNav() {
  const { t, lang, setLang } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="gradient-text">ShopiReply AI</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/examples" className="hover:text-foreground transition-colors">
            {t.nav.examples}
          </Link>
          <Link href="/#pricing" className="hover:text-foreground transition-colors">
            {t.nav.pricing}
          </Link>
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === "en" ? "tr" : "en")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-accent"
          >
            <Globe className="h-4 w-4" />
            <span className="font-medium">{lang === "en" ? "TR" : "EN"}</span>
          </button>

          <Link href="/login">
            <Button variant="ghost" size="sm">
              {t.nav.login}
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="gradient" size="sm">
              {t.nav.signup}
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-accent"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden border-t border-border/40 bg-background/95 backdrop-blur transition-all duration-200",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <div className="container mx-auto px-4 py-4 space-y-3">
          <Link
            href="/examples"
            className="block text-sm font-medium text-muted-foreground hover:text-foreground py-2"
            onClick={() => setMobileOpen(false)}
          >
            {t.nav.examples}
          </Link>
          <Link
            href="/#pricing"
            className="block text-sm font-medium text-muted-foreground hover:text-foreground py-2"
            onClick={() => setMobileOpen(false)}
          >
            {t.nav.pricing}
          </Link>
          <div className="flex gap-3 pt-2">
            <Link href="/login" className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                {t.nav.login}
              </Button>
            </Link>
            <Link href="/signup" className="flex-1">
              <Button variant="gradient" size="sm" className="w-full">
                {t.nav.signup}
              </Button>
            </Link>
          </div>
          <button
            onClick={() => {
              setLang(lang === "en" ? "tr" : "en");
              setMobileOpen(false);
            }}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Globe className="h-4 w-4" />
            Switch to {lang === "en" ? "Türkçe" : "English"}
          </button>
        </div>
      </div>
    </header>
  );
}
