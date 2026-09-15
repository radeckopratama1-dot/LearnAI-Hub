'use client';

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Menu, Globe, Sparkle } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer */}
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Header Bar */}
        <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center gap-1.5">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                <Sparkle className="w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold text-sm bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                LearnAI Hub
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === "id" ? "en" : "id")}
              className="text-xs font-bold text-slate-600 dark:text-slate-300 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Globe className="w-3.5 h-3.5 inline mr-1" />
              {language.toUpperCase()}
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
