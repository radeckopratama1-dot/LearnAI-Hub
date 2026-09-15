'use client';

import React, { useState } from "react";
import { Sparkles, FileText, Image as ImageIcon, Volume2 } from "lucide-react";
import { TextGenerator } from "@/components/generator/TextGenerator";
import { ImageGenerator } from "@/components/generator/ImageGenerator";
import { AudioGenerator } from "@/components/generator/AudioGenerator";

export default function GeneratorPage() {
  const [activeTab, setActiveTab] = useState<"text" | "image" | "audio">("text");

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            Multimodal AI Studio
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold">
            All-in-One Generator
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
          AI Content Generator Studio
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Hasilkan teks akademis, ilustrasi gambar beresolusi tinggi (SDXL), dan audio suara manusia alami.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 w-full sm:w-max">
        <button
          onClick={() => setActiveTab("text")}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "text"
              ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-md shadow-slate-900/5"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Text Generator</span>
        </button>

        <button
          onClick={() => setActiveTab("image")}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "image"
              ? "bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-md shadow-slate-900/5"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Image Generator (SDXL)</span>
        </button>

        <button
          onClick={() => setActiveTab("audio")}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "audio"
              ? "bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-md shadow-slate-900/5"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>Audio Generator (TTS)</span>
        </button>
      </div>

      {/* Active Tab Viewport */}
      <div>
        {activeTab === "text" && <TextGenerator />}
        {activeTab === "image" && <ImageGenerator />}
        {activeTab === "audio" && <AudioGenerator />}
      </div>
    </div>
  );
}
