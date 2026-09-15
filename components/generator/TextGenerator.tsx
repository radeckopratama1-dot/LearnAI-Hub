'use client';

import React, { useState } from "react";
import { Copy, Download, RotateCcw, Sparkles, Check, FileText } from "lucide-react";
import { AIModelId } from "@/types";
import { ModelSelector } from "../chat/ModelSelector";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Input";

const CONTENT_TYPES = [
  "Rangkuman Materi Kuliah",
  "Essay Akademik",
  "Makalah / Paper Ilmiah",
  "Postingan Media Sosial (LinkedIn/Twitter)",
  "Email Formal / Surat Pengantar",
  "Kode Program / Skrip Algoritma",
];

export function TextGenerator() {
  const [contentType, setContentType] = useState(CONTENT_TYPES[0]);
  const [instructions, setInstructions] = useState("");
  const [model, setModel] = useState<AIModelId>("anthropic/claude-3.5-sonnet");
  const [length, setLength] = useState<"Pendek" | "Sedang" | "Panjang">("Sedang");
  const [language, setLanguage] = useState<"Indonesia" | "English">("Indonesia");
  const [resultText, setResultText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!instructions.trim() || isLoading) return;

    setIsLoading(true);
    setResultText("");

    const systemPrompt = `Anda adalah asisten generator konten ahli di LearnAI Hub. Buatlah konten bertipe "${contentType}" dengan panjang "${length}" dalam bahasa "${language}". Ikuti instruksi user dengan cermat, rapi, terstruktur, dan gunakan standar penulisan berkualitas tinggi.`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: instructions },
          ],
          model,
        }),
      });

      if (!response.body) throw new Error("No stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamed = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6).trim();
            if (dataStr === "[DONE]") break;
            try {
              const parsed = JSON.parse(dataStr);
              const delta = parsed.choices?.[0]?.delta?.content || "";
              streamed += delta;
              setResultText(streamed);
            } catch {
              // ignore parse errors
            }
          }
        }
      }
    } catch {
      setResultText("Gagal menghasilkan teks. Silakan coba kembali.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([resultText], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `${contentType.toLowerCase().replace(/[^a-z0-9]/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Control Column */}
      <div className="lg:col-span-5 space-y-4">
        <div className="glass-card rounded-2xl p-6 space-y-4">
          {/* Content Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Jenis Konten
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full rounded-btn border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
            >
              {CONTENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* AI Model */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Model AI
            </label>
            <ModelSelector
              className="w-full"
              selectedModel={model}
              onSelectModel={(id) => setModel(id)}
            />
          </div>

          {/* Output Length */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Panjang Output
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["Pendek", "Sedang", "Panjang"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLength(l)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    length === l
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Bahasa
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["Indonesia", "English"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    language === lang
                      ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* User Instructions / Prompt */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Topik & Instruksi Khusus
            </label>
            <Textarea
              rows={4}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Contoh: Rangkuman materi supervised learning untuk persiapan ujian akhir, sertakan 3 algoritma utama dan contoh soal."
              className="text-sm"
            />
          </div>

          <Button
            onClick={() => handleGenerate()}
            disabled={!instructions.trim() || isLoading}
            isLoading={isLoading}
            className="w-full py-2.5 flex items-center justify-center gap-2 shadow-md shadow-indigo-500/25"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Teks Cerdas</span>
          </Button>
        </div>
      </div>

      {/* Right Result Column */}
      <div className="lg:col-span-7 flex flex-col">
        <div className="glass-card rounded-2xl p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Hasil Pembuatan Teks
              </span>
            </div>

            {resultText && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 px-2 py-1 rounded-btn hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Tersalin!" : "Salin"}</span>
                </button>
                <button
                  onClick={handleDownloadTxt}
                  className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 px-2 py-1 rounded-btn hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .TXT</span>
                </button>
                <button
                  onClick={() => handleGenerate()}
                  disabled={isLoading}
                  className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 px-2 py-1 rounded-btn hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Regenerate</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 min-h-[350px] overflow-y-auto rounded-xl p-4 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80 font-sans text-sm leading-relaxed whitespace-pre-wrap">
            {isLoading && !resultText && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 py-12">
                <Sparkles className="w-6 h-6 text-indigo-500 animate-spin" />
                <span className="text-xs font-medium">Menyusun draf teks berkualitas tinggi...</span>
              </div>
            )}
            {!isLoading && !resultText && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 py-12 text-center">
                <FileText className="w-8 h-8 stroke-1 text-slate-300 dark:text-slate-700" />
                <p className="text-xs max-w-xs">
                  Pilih jenis konten, atur preferensi, lalu klik tombol <strong>Generate Teks Cerdas</strong> untuk mulai.
                </p>
              </div>
            )}
            {resultText}
          </div>
        </div>
      </div>
    </div>
  );
}
