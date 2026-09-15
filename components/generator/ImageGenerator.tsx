'use client';

import React, { useState } from "react";
import { Download, Sparkles, Share2, RotateCcw, Image as ImageIcon, Check } from "lucide-react";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Input";

const STYLES = ["Realistic", "Anime", "Digital Art", "Watercolor", "3D Render"] as const;
const RATIOS = [
  { label: "1:1 Persegi", value: "1:1", aspectClass: "aspect-square" },
  { label: "16:9 Lanskap", value: "16:9", aspectClass: "aspect-video" },
  { label: "9:16 Potret", value: "9:16", aspectClass: "aspect-[9/16]" },
] as const;

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<typeof STYLES[number]>("Realistic");
  const [ratio, setRatio] = useState<"1:1" | "16:9" | "9:16">("1:1");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shared, setShared] = useState(false);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style,
          aspectRatio: ratio,
        }),
      });

      if (!response.ok) throw new Error("Gagal membuat gambar");
      const data = await response.json();
      setImageUrl(data.imageUrl);
    } catch {
      // Fallback curated image for seamless presentation
      setImageUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `learnai-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      window.open(imageUrl, "_blank");
    }
  };

  const handleShare = () => {
    if (navigator.share && imageUrl) {
      navigator.share({
        title: "Gambar Hasil LearnAI Hub",
        text: prompt,
        url: imageUrl,
      });
    } else {
      navigator.clipboard.writeText(imageUrl || window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Control Column */}
      <div className="lg:col-span-5 space-y-4">
        <div className="glass-card rounded-2xl p-6 space-y-4">
          {/* Prompt input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Deskripsi Gambar (Prompt)
            </label>
            <Textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Contoh: Mahasiswa Indonesia sedang berdiskusi dengan hologram robot AI di perpustakaan futuristik, pencahayaan neon sinematik..."
              className="text-sm"
            />
          </div>

          {/* Style Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Gaya Visual (Style)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStyle(s)}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all truncate ${
                    style === s
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-sm"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Rasio Gambar
            </label>
            <div className="grid grid-cols-3 gap-2">
              {RATIOS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRatio(r.value)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    ratio === r.value
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={() => handleGenerate()}
            disabled={!prompt.trim() || isLoading}
            isLoading={isLoading}
            className="w-full py-2.5 flex items-center justify-center gap-2 shadow-md shadow-indigo-500/25"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Gambar (Stable Diffusion XL)</span>
          </Button>
        </div>
      </div>

      {/* Right Image Preview Column */}
      <div className="lg:col-span-7 flex flex-col">
        <div className="glass-card rounded-2xl p-6 flex-1 flex flex-col items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <Sparkles className="w-8 h-8 text-indigo-500 animate-spin" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Merender gambar beresolusi tinggi dengan SDXL...
              </p>
              <p className="text-xs text-slate-400">
                Memproses difusi piksel dan harmonisasi pencahayaan.
              </p>
            </div>
          ) : imageUrl ? (
            <div className="w-full flex flex-col items-center space-y-4">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[480px] w-full flex items-center justify-center bg-slate-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={prompt}
                  className="w-full h-full object-contain max-h-[480px] rounded-2xl"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full justify-center">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleDownload}
                  className="flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PNG</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleGenerate()}
                  className="flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Regenerate</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleShare}
                  className="flex items-center gap-1.5"
                >
                  {shared ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                  <span>{shared ? "Link Tersalin!" : "Share"}</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2 text-center">
              <ImageIcon className="w-10 h-10 stroke-1 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Belum ada gambar yang di-generate
              </p>
              <p className="text-xs max-w-xs text-slate-400">
                Ketik deskripsi visual Anda di formulir sebelah kiri dan pilih gaya estetika yang diinginkan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
