'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquareCode,
  FileText,
  Map,
  Sparkles,
  Settings,
  Sparkle,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { useLanguage } from "@/lib/language-context";
import { clientStore, StoredUser } from "@/lib/mock-store";

const navItems = [
  { href: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { href: "/chat", labelKey: "nav.chat", icon: MessageSquareCode, badge: "5 AI" },
  { href: "/documents", labelKey: "nav.documents", icon: FileText, badge: "RAG" },
  { href: "/roadmap", labelKey: "nav.roadmap", icon: Map, badge: "15 Topik" },
  { href: "/generator", labelKey: "nav.generator", icon: Sparkles, badge: "Studio" },
  { href: "/settings", labelKey: "nav.settings", icon: Settings },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();
  const [user, setUser] = React.useState<StoredUser | null>(null);

  React.useEffect(() => {
    setUser(clientStore.getUser());
  }, []);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl h-screen sticky top-0 z-30 select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-100 dark:border-slate-800/80">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-black text-xl">
          <Sparkle className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
            LearnAI Hub
          </span>
          <span className="text-[10px] text-slate-400 font-medium -mt-1 tracking-wider uppercase">
            AI Learning Platform
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Menu Utama
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-900/80"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                  )}
                />
                <span>{t(item.labelKey)}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom User Profile & Controls */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3">
        {/* Language & Theme switch */}
        <div className="flex items-center justify-between px-2">
          <button
            onClick={() => setLanguage(language === "id" ? "en" : "id")}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-1 rounded-btn hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Ganti Bahasa / Switch Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language.toUpperCase()}</span>
          </button>
          <ThemeToggle />
        </div>

        {/* User Card */}
        <Link
          href="/settings"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors group"
        >
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-indigo-100 dark:bg-slate-800 ring-2 ring-indigo-500/30">
            {user?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar_url}
                alt={user?.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-xs text-indigo-600 dark:text-indigo-400">
                BS
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {user?.name || "Budi Santoso"}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {user?.role || "Mahasiswa"}
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
