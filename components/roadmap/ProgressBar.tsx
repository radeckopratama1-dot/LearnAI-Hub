'use client';

import React from "react";
import { Award, Zap, CheckCircle } from "lucide-react";

interface ProgressBarProps {
  completedCount: number;
  totalCount: number;
}

export function ProgressBar({ completedCount, totalCount }: ProgressBarProps) {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  let tierLabel = "Pemula AI";
  let tierColor = "text-indigo-600 dark:text-indigo-400";
  if (percentage >= 80) {
    tierLabel = "Master AI Engineer 🚀";
    tierColor = "text-emerald-600 dark:text-emerald-400";
  } else if (percentage >= 40) {
    tierLabel = "Praktisi AI Menengah ⚡";
    tierColor = "text-purple-600 dark:text-purple-400";
  }

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 mb-8 border border-slate-200/80 dark:border-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pencapaian Belajar Anda
            </span>
            <span className={`text-xs font-extrabold ${tierColor} flex items-center gap-1`}>
              <Award className="w-3.5 h-3.5" />
              <span>{tierLabel}</span>
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
            {completedCount} dari {totalCount} Topik Selesai
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              {percentage}%
            </span>
            <p className="text-[11px] text-slate-400 font-medium">Selesai</p>
          </div>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full transition-all duration-700 ease-out shadow-sm shadow-indigo-500/50"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
        <span className="flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          <span>{completedCount} Topik Terverifikasi</span>
        </span>
        <span className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>{totalCount - completedCount} Topik Tersisa</span>
        </span>
      </div>
    </div>
  );
}
