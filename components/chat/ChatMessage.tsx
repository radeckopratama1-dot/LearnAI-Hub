'use client';

import React, { useState } from "react";
import { Copy, Check, User, Bot, Sparkles, BookOpen } from "lucide-react";
import { ChatMessage as ChatMessageType, DocumentCitation } from "@/types";
import { getModelById } from "@/lib/openrouter";
import { formatDate, cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType;
  onSelectCitation?: (citation: DocumentCitation) => void;
}

export function ChatMessage({ message, onSelectCitation }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";
  const modelInfo = message.model ? getModelById(message.model) : null;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple clean markdown parser for code blocks, bold, italics, lists, and headers
  const renderFormattedContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const lines = part.slice(3, -3).trim().split("\n");
        const language = lines[0].trim() || "plaintext";
        const code = lines.slice(language ? 1 : 0).join("\n");

        return (
          <div key={index} className="my-3 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 text-slate-100 font-mono text-xs">
            <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900 border-b border-slate-800 text-slate-400">
              <span className="uppercase text-[10px] font-bold">{language}</span>
              <button
                onClick={() => navigator.clipboard.writeText(code)}
                className="hover:text-white flex items-center gap-1 text-[11px] transition-colors"
                title="Salin Kode"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin</span>
              </button>
            </div>
            <pre className="p-4 overflow-x-auto leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Process paragraphs and line breaks
      return (
        <div key={index} className="space-y-2 whitespace-pre-wrap leading-relaxed">
          {part.split("\n\n").map((para, pIdx) => {
            // Render basic markdown formatting
            return (
              <p key={pIdx} className="text-sm">
                {para}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div
      className={cn(
        "flex gap-3.5 p-4 sm:p-5 transition-colors group",
        isUser
          ? "bg-transparent justify-end"
          : "bg-white/60 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800/60"
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/20 mt-0.5">
          {modelInfo ? <span className="text-sm">{modelInfo.icon}</span> : <Bot className="w-4 h-4" />}
        </div>
      )}

      <div className={cn("flex flex-col space-y-2 max-w-2xl sm:max-w-3xl", isUser ? "items-end" : "items-start")}>
        {/* Header with name and model badge */}
        <div className="flex items-center gap-2">
          {isUser ? (
            <>
              <span className="text-xs text-slate-400">{formatDate(message.created_at)}</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Anda</span>
            </>
          ) : (
            <>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                LearnAI Assistant
              </span>
              {modelInfo && (
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1",
                    modelInfo.badgeColor
                  )}
                >
                  <span>{modelInfo.icon}</span>
                  <span>{modelInfo.name}</span>
                </span>
              )}
              <span className="text-xs text-slate-400">{formatDate(message.created_at)}</span>
            </>
          )}
        </div>

        {/* Message Bubble Content */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm shadow-sm transition-all",
            isUser
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none shadow-indigo-500/20"
              : "glass-card text-slate-800 dark:text-slate-200 rounded-tl-none border-slate-200/80 dark:border-slate-800/80"
          )}
        >
          {message.isStreaming && message.content === "" ? (
            <div className="flex items-center gap-1.5 py-1 text-slate-400">
              <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" />
              <span className="text-xs italic">Mengetik respons cerdas...</span>
            </div>
          ) : (
            renderFormattedContent(message.content)
          )}
        </div>

        {/* Citations if from RAG Document */}
        {message.citations && message.citations.length > 0 && (
          <div className="mt-2 p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 w-full space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Sumber Rujukan Dokumen ({message.citations.length}):</span>
            </div>
            <div className="space-y-1">
              {message.citations.map((cite) => (
                <button
                  key={cite.id}
                  onClick={() => onSelectCitation && onSelectCitation(cite)}
                  className="w-full text-left p-1.5 rounded-lg text-xs bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 border border-indigo-100 dark:border-indigo-900 transition-colors flex items-center justify-between group/cite"
                >
                  <span className="truncate flex-1">
                    📄 <strong>{cite.document_name}</strong> (Hal. {cite.page_number}): &quot;{cite.snippet}&quot;
                  </span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 shrink-0 ml-2 font-semibold">
                    {Math.round((cite.similarity || 0.85) * 100)}% relevan
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Actions */}
        {!isUser && message.content && (
          <div className="flex items-center gap-2 pt-1 text-slate-400 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-medium">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Jawaban</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0 mt-0.5 font-bold text-xs">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
