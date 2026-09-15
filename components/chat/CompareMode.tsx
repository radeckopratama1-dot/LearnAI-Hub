'use client';

import React, { useState } from "react";
import { Send, Sparkles, SplitSquareVertical, RotateCcw, Copy, Check } from "lucide-react";
import { AIModelId } from "@/types";
import { ModelSelector } from "./ModelSelector";
import { getModelById } from "@/lib/openrouter";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Input";

interface CompareResult {
  content: string;
  isStreaming: boolean;
  modelId: string;
}

export function CompareMode({ onClose }: { onClose?: () => void }) {
  const [leftModel, setLeftModel] = useState<AIModelId>("anthropic/claude-3.5-sonnet");
  const [rightModel, setRightModel] = useState<AIModelId>("openai/gpt-4o");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [leftResult, setLeftResult] = useState<CompareResult>({
    content: "Pilih model dan ajukan pertanyaan untuk melihat perbandingan jawaban Claude 3.5 Sonnet di sini.",
    isStreaming: false,
    modelId: leftModel,
  });

  const [rightResult, setRightResult] = useState<CompareResult>({
    content: "Pilih model dan ajukan pertanyaan untuk melihat perbandingan jawaban GPT-4o di sini.",
    isStreaming: false,
    modelId: rightModel,
  });

  const [leftCopied, setLeftCopied] = useState(false);
  const [rightCopied, setRightCopied] = useState(false);

  const leftMeta = getModelById(leftModel);
  const rightMeta = getModelById(rightModel);

  const handleCopy = (side: "left" | "right") => {
    if (side === "left") {
      navigator.clipboard.writeText(leftResult.content);
      setLeftCopied(true);
      setTimeout(() => setLeftCopied(false), 2000);
    } else {
      navigator.clipboard.writeText(rightResult.content);
      setRightCopied(true);
      setTimeout(() => setRightCopied(false), 2000);
    }
  };

  const streamFromModel = async (
    modelId: string,
    userPrompt: string,
    updateFn: (chunk: string, done: boolean) => void
  ) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userPrompt }],
          model: modelId,
        }),
      });

      if (!res.body) {
        throw new Error("No response body");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6).trim();
            if (dataStr === "[DONE]") {
              updateFn(fullText, true);
              return;
            }
            try {
              const parsed = JSON.parse(dataStr);
              const delta = parsed.choices?.[0]?.delta?.content || "";
              fullText += delta;
              updateFn(fullText, false);
            } catch {
              // stream line parsing
            }
          }
        }
      }
      updateFn(fullText, true);
    } catch {
      updateFn(`Terjadi kendala memanggil model ${modelId}. Respons simulasi fallback disajikan untuk demonstrasi.`, true);
    }
  };

  const handleCompare = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const currentPrompt = prompt;
    setIsLoading(true);
    setLeftResult({ content: "", isStreaming: true, modelId: leftModel });
    setRightResult({ content: "", isStreaming: true, modelId: rightModel });

    // Stream both in parallel
    await Promise.all([
      streamFromModel(leftModel, currentPrompt, (content, done) => {
        setLeftResult({
          content,
          isStreaming: !done,
          modelId: leftModel,
        });
      }),
      streamFromModel(rightModel, currentPrompt, (content, done) => {
        setRightResult({
          content,
          isStreaming: !done,
          modelId: rightModel,
        });
      }),
    ]);

    setIsLoading(false);
  };

  const suggestions = [
    "Jelaskan konsep Backpropagation dalam Neural Network dengan analogi simpel",
    "Bandingkan kelebihan RAG vs Fine-Tuning untuk dokumen privat",
    "Tuliskan fungsi Python untuk binary search beserta analisis kompleksitas O(log N)",
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/50">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
            <SplitSquareVertical className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Compare Mode (Bandingkan 2 AI)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-extrabold uppercase">
                Dual Stream
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Satu pertanyaan diuji secara langsung ke dua model AI pilihan Anda.
            </p>
          </div>
        </div>

        {onClose && (
          <Button variant="outline" size="sm" onClick={onClose}>
            Tutup Mode Bandingkan
          </Button>
        )}
      </div>

      {/* Split Comparison Columns */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-6 overflow-y-auto">
        {/* Left Model Column */}
        <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Model 1:</span>
              <ModelSelector
                size="sm"
                selectedModel={leftModel}
                onSelectModel={(id) => setLeftModel(id)}
              />
            </div>
            {leftResult.content && !leftResult.isStreaming && (
              <button
                onClick={() => handleCopy("left")}
                className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
              >
                {leftCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{leftCopied ? "Tersalin" : "Salin"}</span>
              </button>
            )}
          </div>
          <div className="flex-1 p-5 overflow-y-auto font-sans text-sm leading-relaxed whitespace-pre-wrap">
            {leftResult.isStreaming && !leftResult.content && (
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 animate-pulse text-sm">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>{leftMeta.name} sedang memproses jawaban...</span>
              </div>
            )}
            {leftResult.content}
          </div>
        </div>

        {/* Right Model Column */}
        <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Model 2:</span>
              <ModelSelector
                size="sm"
                selectedModel={rightModel}
                onSelectModel={(id) => setRightModel(id)}
              />
            </div>
            {rightResult.content && !rightResult.isStreaming && (
              <button
                onClick={() => handleCopy("right")}
                className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
              >
                {rightCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{rightCopied ? "Tersalin" : "Salin"}</span>
              </button>
            )}
          </div>
          <div className="flex-1 p-5 overflow-y-auto font-sans text-sm leading-relaxed whitespace-pre-wrap">
            {rightResult.isStreaming && !rightResult.content && (
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 animate-pulse text-sm">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>{rightMeta.name} sedang memproses jawaban...</span>
              </div>
            )}
            {rightResult.content}
          </div>
        </div>
      </div>

      {/* Input Prompt Section */}
      <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
        {/* Suggestion tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2.5 mb-2 no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">
            Coba prompt:
          </span>
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setPrompt(s)}
              className="text-xs shrink-0 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {s.slice(0, 45)}...
            </button>
          ))}
        </div>

        <form onSubmit={handleCompare} className="flex gap-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleCompare();
              }
            }}
            placeholder="Tulis pertanyaan perbandingan untuk diuji ke dua model sekaligus... (Enter untuk kirim)"
            className="resize-none min-h-[50px] max-h-32 text-sm"
          />
          <div className="flex flex-col gap-1.5 shrink-0">
            <Button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              isLoading={isLoading}
              className="h-[50px] px-5"
            >
              <Send className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPrompt("")}
              title="Reset Prompt"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
