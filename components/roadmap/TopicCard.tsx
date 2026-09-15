'use client';

import React from "react";
import { CheckCircle2, Clock, PlayCircle, Circle, ChevronRight } from "lucide-react";
import { RoadmapTopic, RoadmapStatus } from "@/types";

interface TopicCardProps {
  topic: RoadmapTopic;
  status: RoadmapStatus;
  onClick: () => void;
}

export function TopicCard({ topic, status, onClick }: TopicCardProps) {
  const isCompleted = status === "completed";
  const isInProgress = status === "in_progress";

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl p-5 border transition-all duration-200 cursor-pointer text-left flex flex-col justify-between group ${
        isCompleted
          ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300/70 dark:border-emerald-800/70 hover:border-emerald-400"
          : isInProgress
          ? "bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-300/80 dark:border-indigo-700/80 hover:border-indigo-500 shadow-md shadow-indigo-500/10"
          : "bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md"
      }`}
    >
      <div>
        {/* Status indicator badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
              isCompleted
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                : isInProgress
                ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 animate-pulse"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700"
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Selesai</span>
              </>
            ) : isInProgress ? (
              <>
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Sedang Belajar</span>
              </>
            ) : (
              <>
                <Circle className="w-3.5 h-3.5" />
                <span>Belum Mulai</span>
              </>
            )}
          </span>

          <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
            <Clock className="w-3 h-3" />
            <span>{topic.estimatedMinutes} menit</span>
          </span>
        </div>

        {/* Title & Summary */}
        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
          {topic.title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {topic.summary}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xs font-semibold text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        <span>Buka Materi</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  );
}
