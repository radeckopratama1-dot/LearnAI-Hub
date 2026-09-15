'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquareCode,
  FileText,
  Map,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkle,
  BookOpen,
  Zap,
} from "lucide-react";
import { clientStore, StoredUser } from "@/lib/mock-store";
import { ROADMAP_TOPICS } from "@/lib/roadmap-data";
import { Button } from "@/components/ui/Button";

export default function DashboardHomePage() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [stats, setStats] = useState({
    totalChats: 3,
    totalDocs: 2,
    roadmapProgress: 47,
    completedTopics: 7,
    totalTopics: 15,
    totalGenerated: 5,
  });

  useEffect(() => {
    const loadedUser = clientStore.getUser();
    setUser(loadedUser);

    const sessions = clientStore.getSessions();
    const docs = clientStore.getDocuments();
    const progress = clientStore.getRoadmapProgress();

    const completed = Object.values(progress).filter((p) => p.status === "completed").length;
    const percentage = Math.round((completed / ROADMAP_TOPICS.length) * 100);

    setStats({
      totalChats: sessions.length,
      totalDocs: docs.length,
      roadmapProgress: percentage,
      completedTopics: completed,
      totalTopics: ROADMAP_TOPICS.length,
      totalGenerated: 6,
    });
  }, []);

  // Find next in-progress or not_started topic
  const nextTopic = ROADMAP_TOPICS.find((t) => t.id === "l2-t3") || ROADMAP_TOPICS[7];

  const recentActivities = [
    {
      id: "act-1",
      icon: MessageSquareCode,
      title: "Chat AI dengan Claude 3.5 Sonnet",
      desc: "Diskusi arsitektur Transformer dan Self-Attention Mechanism.",
      time: "2 jam lalu",
      link: "/chat",
      color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60",
    },
    {
      id: "act-2",
      icon: FileText,
      title: "Tanya Dokumen RAG",
      desc: "Mengekstrak 5 poin kunci dari Panduan_Dasar_AI_untuk_Mahasiswa.pdf.",
      time: "5 jam lalu",
      link: "/documents",
      color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60",
    },
    {
      id: "act-3",
      icon: Map,
      title: "Menyelesaikan Topik Roadmap",
      desc: "Menandai selesai: 'Fine-tuning dan RAG (Retrieval-Augmented Generation)'.",
      time: "1 hari lalu",
      link: "/roadmap",
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60",
    },
    {
      id: "act-4",
      icon: Sparkles,
      title: "Generate Ilustrasi Gambar",
      desc: "Membuat visualisasi robot AI di perpustakaan futuristik menggunakan SDXL.",
      time: "2 hari lalu",
      link: "/generator",
      color: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60",
    },
    {
      id: "act-5",
      icon: MessageSquareCode,
      title: "Compare Mode GPT-4o vs Gemini Pro",
      desc: "Menguji perbandingan query pencarian vektor dan indexing pgvector.",
      time: "3 hari lalu",
      link: "/chat",
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Greeting Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <Sparkle className="w-3.5 h-3.5" />
            <span>AI Learning Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">
            Selamat datang, {user?.name || "Budi Santoso"}! 👋
          </h1>
          <p className="text-sm sm:text-base text-indigo-100 leading-relaxed">
            Lanjutkan perjalanan Anda menguasai teknologi kecerdasan buatan. Chat dengan multi-AI, bedah dokumen kuliah, atau lanjutkan roadmap belajar hari ini.
          </p>

          {/* Quick Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link href="/chat">
              <Button size="sm" variant="glass" className="bg-white text-indigo-900 font-bold hover:bg-slate-100 gap-1.5 shadow-md">
                <MessageSquareCode className="w-4 h-4" />
                <span>Chat Sekarang</span>
              </Button>
            </Link>
            <Link href="/documents">
              <Button size="sm" variant="outline" className="text-white border-white/40 hover:bg-white/10 gap-1.5">
                <FileText className="w-4 h-4" />
                <span>Upload Dokumen</span>
              </Button>
            </Link>
            <Link href="/roadmap">
              <Button size="sm" variant="outline" className="text-white border-white/40 hover:bg-white/10 gap-1.5">
                <Map className="w-4 h-4" />
                <span>Lanjut Belajar</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Chat */}
        <div className="glass-card rounded-2xl p-5 flex items-center justify-between hover:border-indigo-400/80 transition-all">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Sesi Chat
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
              {stats.totalChats} Sesi
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>5 Model AI Aktif</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
            <MessageSquareCode className="w-6 h-6" />
          </div>
        </div>

        {/* Dokumen Diupload */}
        <div className="glass-card rounded-2xl p-5 flex items-center justify-between hover:border-purple-400/80 transition-all">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Dokumen Diupload
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
              {stats.totalDocs} Dokumen
            </div>
            <p className="text-[11px] text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-1 font-semibold">
              <Zap className="w-3 h-3" />
              <span>pgvector Chunked</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-sm">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Progress Roadmap */}
        <div className="glass-card rounded-2xl p-5 flex items-center justify-between hover:border-emerald-400/80 transition-all">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Progress Roadmap
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
              {stats.roadmapProgress}%
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
              <span>{stats.completedTopics}/{stats.totalTopics} Topik Tuntas</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
            <Map className="w-6 h-6" />
          </div>
        </div>

        {/* Konten Dibuat */}
        <div className="glass-card rounded-2xl p-5 flex items-center justify-between hover:border-cyan-400/80 transition-all">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Konten Dibuat
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
              {stats.totalGenerated} Karya
            </div>
            <p className="text-[11px] text-cyan-600 dark:text-cyan-400 flex items-center gap-1 mt-1 font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>Teks • SDXL • Audio</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Activities & Next Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Activities (5 item terakhir) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              <span>Riwayat Aktivitas Terbaru</span>
            </h3>
            <span className="text-xs text-slate-400">5 Item Terakhir</span>
          </div>

          <div className="glass-card rounded-2xl divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden">
            {recentActivities.map((act) => {
              const Icon = act.icon;
              return (
                <Link
                  key={act.id}
                  href={act.link}
                  className="flex items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${act.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                        {act.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                        {act.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {act.desc}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all mt-1" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recommended Next Roadmap Topic */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              <span>Rekomendasi Topik Selanjutnya</span>
            </h3>
          </div>

          <div className="glass-card rounded-2xl p-6 border-indigo-200 dark:border-indigo-900/50 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {nextTopic.levelTitle}
              </span>
              <span className="text-xs text-slate-400">• {nextTopic.estimatedMinutes} Menit</span>
            </div>

            <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
              {nextTopic.title}
            </h4>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {nextTopic.summary}
            </p>

            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Materi yang akan dipelajari:
              </span>
              <ul className="space-y-1">
                {nextTopic.keyPoints.slice(0, 3).map((kp, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span className="truncate">{kp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <Link href="/roadmap">
                <Button size="sm" variant="primary" className="w-full flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20">
                  <span>Pelajari Topik Ini Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
