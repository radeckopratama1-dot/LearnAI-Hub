'use client';

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  MessageSquareCode,
  FileText,
  Map,
  Sparkle,
  CheckCircle2,
  Users,
  BrainCircuit,
  Zap,
  Star,
  Quote,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/language-context";

export default function LandingPage() {
  const { language } = useLanguage();

  const isId = language === "id";

  const features = [
    {
      icon: MessageSquareCode,
      title: isId ? "Multi-AI Chat & Compare" : "Multi-AI Chat & Compare",
      desc: isId
        ? "Bandingkan 5 model AI terdepan (Claude 3.5, GPT-4o, Gemini Pro, Mistral 7B, Llama 3) secara berdampingan dalam satu layar."
        : "Compare 5 leading AI models side-by-side with dual streaming responses.",
      badge: "5 Model AI",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: FileText,
      title: isId ? "Dokumen RAG Semantik" : "Semantic Document RAG",
      desc: isId
        ? "Upload PDF, DOCX materi kuliah, jurnal, atau skripsi. Dapatkan jawaban instan dengan kutipan nomor halaman yang akurat."
        : "Upload lecture slides or research PDFs. Get instant answers backed by precise citations.",
      badge: "pgvector Ready",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Map,
      title: isId ? "Roadmap Belajar AI Terstruktur" : "Structured AI Roadmap",
      desc: isId
        ? "Kurikulum berjenjang dari Pemula, Menengah, hingga Mahir. Dilengkapi latihan, ringkasan konsep, dan asistensi AI."
        : "Step-by-step curriculum from Beginner to Advanced with interactive AI mentoring.",
      badge: "15 Topik Lengkap",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: Sparkles,
      title: isId ? "Generative Content Studio" : "Generative Content Studio",
      desc: isId
        ? "Hasilkan essay akademis, ilustrasi gambar resolusi tinggi (SDXL), dan audio suara alami berbahasa Indonesia dalam hitungan detik."
        : "Generate academic papers, high-res SDXL visuals, and natural TTS voiceover in seconds.",
      badge: "Teks • Gambar • Audio",
      gradient: "from-cyan-500 to-blue-500",
    },
  ];

  const steps = [
    {
      step: "01",
      title: isId ? "Daftar Akun Gratis" : "Create Free Account",
      desc: isId
        ? "Buat akun mahasiswa Anda hanya dalam 30 detik tanpa memerlukan kartu kredit."
        : "Sign up in 30 seconds with email or Google without credit card requirements.",
    },
    {
      step: "02",
      title: isId ? "Upload Dokumen & Chat AI" : "Upload Docs & Chat AI",
      desc: isId
        ? "Unggah materi belajar Anda atau ajukan pertanyaan ke 5 model AI sekaligus."
        : "Upload your study notes or chat with 5 distinct leading AI models simultaneously.",
    },
    {
      step: "03",
      title: isId ? "Kuasai AI Sesuai Roadmap" : "Master AI with Roadmap",
      desc: isId
        ? "Ikuti panduan belajar bertahap untuk membangun portofolio AI masa depan Anda."
        : "Follow structured curriculum milestones to build your futuristic AI skills.",
    },
  ];

  const testimonials = [
    {
      quote: isId
        ? "Fitur Compare Mode sangat membantu saya memahami perbedaan cara Claude 3.5 dan GPT-4o menjelaskan konsep Deep Learning untuk tugas akhir!"
        : "Compare Mode helped me see how Claude 3.5 and GPT-4o explain deep learning architectures!",
      name: "Rizky Firmansyah",
      role: isId ? "Mahasiswa Teknik Informatika, ITB" : "Computer Science Student, ITB",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
    },
    {
      quote: isId
        ? "Fitur Tanya Dokumen RAG-nya gila banget! Baca jurnal 30 halaman cuma butuh beberapa detik untuk ekstraksi poin penting beserta nomor halamannya."
        : "The RAG document tool is incredible! Summarizing 30-page research papers now takes seconds.",
      name: "Annisa Rahmawati",
      role: isId ? "Mahasiswi Sistem Informasi, UI" : "Information Systems Student, UI",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    },
    {
      quote: isId
        ? "Roadmap belajarnya sangat terstruktur dan bahasa Indonesianya mudah dipahami pemula. Tombol 'Tanya AI' di tiap topik bikin belajar jadi interaktif."
        : "The learning roadmap is very structured and beginner friendly. The AI tutor button makes learning interactive.",
      name: "Dimas Pratama",
      role: isId ? "Pelajar SMA & Penggemar AI, Surabaya" : "High School Tech Enthusiast, Surabaya",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl -z-10 pointer-events-none rounded-full" />

        {/* Announcement pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-200/80 dark:border-indigo-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm mb-6 animate-pulse">
          <Sparkle className="w-3.5 h-3.5 text-indigo-500" />
          <span>LearnAI Hub 2.0 Kini Telah Hadir untuk Pelajar Indonesia</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>

        {/* Big headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl leading-[1.1]">
          Belajar AI Jadi{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Lebih Mudah & Terarah
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          {isId
            ? "Platform all-in-one untuk mahasiswa dan pelajar Indonesia. Chat dengan 5 model AI terdepan, analisis dokumen dengan RAG semantik, ikuti roadmap kurikulum terstruktur, dan ciptakan konten masa depan."
            : "The all-in-one platform for Indonesian learners. Chat with 5 top AI models, analyze documents with semantic RAG, follow structured roadmaps, and generate multimodal content."}
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="lg" variant="primary" className="w-full sm:w-auto gap-2 shadow-lg shadow-indigo-500/25 px-8 font-bold">
              <span>Mulai Gratis Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 px-8 font-bold">
              <span>Lihat Demo Interaktif</span>
            </Button>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Gratis untuk Pelajar</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>5 Model AI Terintegrasi</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Tanpa Perlu Kartu Kredit</span>
          </span>
        </div>

        {/* Interactive Dashboard Mockup Preview */}
        <div className="mt-16 w-full max-w-5xl rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 p-3 sm:p-4 backdrop-blur-2xl shadow-2xl shadow-indigo-500/10">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 sm:p-6 text-left overflow-hidden">
            {/* Mock browser header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-500 font-mono ml-2">learnai-hub.id/chat</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
                Compare Mode Active
              </span>
            </div>

            {/* Split comparison preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">🟣</span>
                  <span className="text-xs font-bold text-purple-400">Claude 3.5 Sonnet (Anthropic)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  &quot;Transformer mengeliminasi batasan sekuensial RNN melalui mekanisme <strong>Self-Attention</strong>, memungkinkan komputasi paralel masif di ribuan core GPU.&quot;
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">🟢</span>
                  <span className="text-xs font-bold text-emerald-400">GPT-4o (OpenAI)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  &quot;Transformer memproses seluruh kalimat secara bersamaan dengan memetakan keterkaitan semantik matriks <strong>Query, Key, Value</strong> tanpa degradasi gradien.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlight Section */}
      <section className="py-20 bg-slate-100/60 dark:bg-slate-950/60 border-y border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Fitur Unggulan
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mt-1">
              Semua yang Anda Butuhkan untuk Menguasai AI
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-3">
              Dirancang khusus untuk mendukung perkuliahan, riset skripsi, dan persiapan karir di industri teknologi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:translate-y-[-4px] transition-all duration-200 hover:shadow-xl hover:border-indigo-500/50 group"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${f.gradient} flex items-center justify-center text-white shadow-lg mb-5 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {f.badge}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                      {f.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <span>Eksplorasi Fitur</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Alur Belajar Sederhana
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Mulai Belajar dalam 3 Langkah
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s, i) => (
            <div key={i} className="glass-card rounded-2xl p-8 relative flex flex-col justify-between">
              <span className="text-4xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-4">
                {s.step}
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-100/60 dark:bg-slate-950/60 border-t border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Kata Mereka
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mt-1">
              Dipercaya oleh Mahasiswa Seluruh Indonesia
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-6 flex flex-col justify-between space-y-4">
                <Quote className="w-8 h-8 text-indigo-400/40" />
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  &quot;{t.quote}&quot;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                      {t.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 p-8 sm:p-14 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black">
              Siap Memulai Langkah Pertama di Dunia AI?
            </h2>
            <p className="text-sm sm:text-base text-indigo-100 leading-relaxed">
              Bergabung sekarang bersama ribuan mahasiswa dan pelajar lainnya. Gratis, tanpa syarat rumit.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" variant="glass" className="bg-white text-indigo-900 font-bold hover:bg-slate-100 px-8">
                  Daftar Akun Sekarang
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="text-white border-white/40 hover:bg-white/10 px-8">
                  Eksplorasi Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold">
              <Sparkle className="w-4 h-4" />
            </div>
            <span className="font-bold text-base bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              LearnAI Hub
            </span>
          </div>

          <p className="text-xs text-slate-400 text-center sm:text-right">
            © {new Date().getFullYear()} LearnAI Hub. Platform Belajar AI untuk Pelajar Indonesia. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
