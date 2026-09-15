'use client';

import React from "react";
import {
  FileText,
  Calendar,
  Layers,
  MessageSquare,
  FileCheck,
  HelpCircle,
  Trash2,
} from "lucide-react";
import { DocumentItem } from "@/types";
import { formatBytes, formatDate } from "@/lib/utils";
import { Button } from "../ui/Button";

interface DocumentCardProps {
  document: DocumentItem;
  onAsk: (doc: DocumentItem) => void;
  onSummarize: (doc: DocumentItem) => void;
  onQuiz: (doc: DocumentItem) => void;
  onDelete: (id: string) => void;
}

export function DocumentCard({
  document,
  onAsk,
  onSummarize,
  onQuiz,
  onDelete,
}: DocumentCardProps) {
  const isPdf = document.name.toLowerCase().endsWith(".pdf");
  const isDocx = document.name.toLowerCase().endsWith(".docx");

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:border-indigo-300/80 dark:hover:border-indigo-700/80 group">
      <div>
        {/* Header with icon & badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                isPdf
                  ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60"
                  : isDocx
                  ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60"
                  : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60"
              }`}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" title={document.name}>
                {document.name}
              </h3>
              <div className="flex items-center gap-2.5 text-[11px] text-slate-400 mt-1">
                <span>{formatBytes(document.file_size)}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  <span>{document.page_count} Halaman</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onDelete(document.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            title="Hapus Dokumen"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Summary snippet */}
        {document.summary && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
            {document.summary}
          </p>
        )}

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60">
          <Calendar className="w-3 h-3" />
          <span>Diupload {formatDate(document.created_at)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-2">
        <Button
          size="sm"
          variant="primary"
          onClick={() => onAsk(document)}
          className="w-full text-xs font-semibold py-1.5 px-2 flex items-center justify-center gap-1"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Tanya</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onSummarize(document)}
          className="w-full text-xs py-1.5 px-2 flex items-center justify-center gap-1 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50"
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Rangkum</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onQuiz(document)}
          className="w-full text-xs py-1.5 px-2 flex items-center justify-center gap-1 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-950/50"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Quiz</span>
        </Button>
      </div>
    </div>
  );
}
