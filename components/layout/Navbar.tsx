'use client';

import React from "react";
import Link from "next/link";
import { Sparkle, Globe, ArrowRight, Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useLanguage } from "@/lib/language-context";
import { Button } from "../ui/Button";

export function Navbar({ onOpenMobileNav }: { onOpenMobileNav?: () => void }) {
  const { t, language, setLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/75 dark:bg-slate-950/75 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          {onOpenMobileNav && (
            <button
              onClick={onOpenMobileNav}
              className="md:hidden p-2 rounded-btn text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-black group-hover:scale-105 transition-transform">
              <Sparkle className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
                LearnAI Hub
              </span>
            </div>
          </Link>
        </div>

        {/* Center / Right Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link href="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {t("nav.dashboard")}
          </Link>
          <Link href="/chat" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {t("nav.chat")}
          </Link>
          <Link href="/documents" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {t("nav.documents")}
          </Link>
          <Link href="/roadmap" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {t("nav.roadmap")}
          </Link>
          <Link href="/generator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {t("nav.generator")}
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Language Switch */}
          <button
            onClick={() => setLanguage(language === "id" ? "en" : "id")}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-2.5 py-1.5 rounded-btn hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language.toUpperCase()}</span>
          </button>

          <ThemeToggle />

          <Link href="/dashboard" className="hidden sm:inline-block">
            <Button size="sm" variant="primary" className="shadow-sm">
              <span>{t("nav.dashboard")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
