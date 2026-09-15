'use client';

import React, { useState, useEffect } from "react";
import {
  User,
  Key,
  Globe,
  Palette,
  Save,
  CheckCircle,
  ShieldCheck,
  RotateCcw,
  Sparkle,
} from "lucide-react";
import { clientStore, StoredUser, DEFAULT_USER } from "@/lib/mock-store";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  const [user, setUser] = useState<StoredUser>(DEFAULT_USER);
  const [openrouterKey, setOpenrouterKey] = useState("");
  const [replicateKey, setReplicateKey] = useState("");
  const [elevenlabsKey, setElevenlabsKey] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setUser(clientStore.getUser());
    const savedOr = localStorage.getItem("learnai_custom_openrouter_key") || "";
    const savedRep = localStorage.getItem("learnai_custom_replicate_key") || "";
    const savedEl = localStorage.getItem("learnai_custom_elevenlabs_key") || "";
    setOpenrouterKey(savedOr);
    setReplicateKey(savedRep);
    setElevenlabsKey(savedEl);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    clientStore.setUser(user);
    if (openrouterKey) localStorage.setItem("learnai_custom_openrouter_key", openrouterKey);
    if (replicateKey) localStorage.setItem("learnai_custom_replicate_key", replicateKey);
    if (elevenlabsKey) localStorage.setItem("learnai_custom_elevenlabs_key", elevenlabsKey);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetData = () => {
    if (confirm("Reset data demonstrasi (sesi chat dan riwayat) ke kondisi awal?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Preferensi & Integrasi
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
          Pengaturan Akun & API Keys
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Kelola profil pengguna, konfigurasi kunci API eksternal (OpenRouter, Replicate, ElevenLabs), dan preferensi antarmuka.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Pengaturan dan API Keys Anda berhasil disimpan secara aman di browser!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800">
            <User className="w-4 h-4 text-indigo-500" />
            <span>Profil Pengguna</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Nama Lengkap
              </label>
              <Input
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                placeholder="Nama Anda"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Mahasiswa
              </label>
              <Input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="nama@kampus.ac.id"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Peran / Institusi Pendidikan
              </label>
              <Input
                value={user.role}
                onChange={(e) => setUser({ ...user, role: e.target.value })}
                placeholder="Contoh: Mahasiswa Teknik Informatika - Universitas Indonesia"
              />
            </div>
          </div>
        </div>

        {/* API Keys Configuration */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-100">
              <Key className="w-4 h-4 text-purple-500" />
              <span>Konfigurasi Kunci API (Koneksi Produksi)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold">
              Tersimpan Lokal
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Anda dapat memasukkan API Key pribadi untuk langsung menggunakan endpoint cloud tanpa batasan kuota demo simulator.
          </p>

          <div className="space-y-4">
            {/* OpenRouter */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  OpenRouter API Key (Claude 3.5, GPT-4o, Gemini, Mistral, Llama)
                </label>
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Dapatkan Key ↗
                </a>
              </div>
              <Input
                type="password"
                value={openrouterKey}
                onChange={(e) => setOpenrouterKey(e.target.value)}
                placeholder="sk-or-v1-..."
              />
            </div>

            {/* Replicate */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Replicate API Token (Stable Diffusion XL)
                </label>
                <a
                  href="https://replicate.com/account/api-tokens"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Dapatkan Token ↗
                </a>
              </div>
              <Input
                type="password"
                value={replicateKey}
                onChange={(e) => setReplicateKey(e.target.value)}
                placeholder="r8_..."
              />
            </div>

            {/* ElevenLabs */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  ElevenLabs API Key (Text-to-Speech Studio)
                </label>
                <a
                  href="https://elevenlabs.io"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  Dapatkan Key ↗
                </a>
              </div>
              <Input
                type="password"
                value={elevenlabsKey}
                onChange={(e) => setElevenlabsKey(e.target.value)}
                placeholder="xi-..."
              />
            </div>
          </div>
        </div>

        {/* Interface Preferences */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Palette className="w-4 h-4 text-cyan-500" />
            <span>Preferensi Tampilan & Bahasa</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Language */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Bahasa Antarmuka (Language)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage("id")}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    language === "id"
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  Bahasa Indonesia (ID)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    language === "en"
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  English (EN)
                </button>
              </div>
            </div>

            {/* Theme */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Tema Warna
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["light", "dark", "system"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    className={`py-2 text-xs font-bold rounded-xl border capitalize transition-all ${
                      theme === t
                        ? "bg-purple-600 text-white border-purple-600"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {t === "light" ? "Terang" : t === "dark" ? "Gelap" : "Sistem"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetData}
            className="text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/40 gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data Demo</span>
          </Button>

          <Button
            type="submit"
            variant="primary"
            className="w-full sm:w-auto px-8 gap-2 shadow-md shadow-indigo-500/25"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Pengaturan</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
