'use client';

import React from "react";
import { RoadmapTree } from "@/components/roadmap/RoadmapTree";

export default function RoadmapPage() {
  return (
    <div className="py-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Kurikulum Komprehensif
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
            15 Topik Terstruktur
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
          Roadmap Belajar AI untuk Pelajar Indonesia
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Ikuti kurikulum bertahap dari Pemula hingga Mahir. Dapatkan bimbingan materi, checklist progres, dan konsultasi interaktif bersama AI di setiap bab.
        </p>
      </div>

      <RoadmapTree />
    </div>
  );
}
