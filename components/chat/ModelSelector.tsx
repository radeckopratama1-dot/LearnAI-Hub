'use client';

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Sparkles } from "lucide-react";
import { AVAILABLE_MODELS, getModelById } from "@/lib/openrouter";
import { AIModelId } from "@/types";
import { cn } from "@/lib/utils";

interface ModelSelectorProps {
  selectedModel: AIModelId | string;
  onSelectModel: (modelId: AIModelId) => void;
  className?: string;
  size?: "sm" | "md";
}

export function ModelSelector({
  selectedModel,
  onSelectModel,
  className,
  size = "md",
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentModel = getModelById(selectedModel);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative inline-block text-left", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-3 py-1.5 font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500",
          size === "sm" ? "text-xs py-1 px-2.5" : "text-sm"
        )}
      >
        <span className="text-base">{currentModel.icon}</span>
        <span className="font-semibold">{currentModel.name}</span>
        <span className="text-xs text-slate-400 font-normal hidden sm:inline">
          ({currentModel.provider})
        </span>
        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Pilih Model AI</span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          </div>

          <div className="space-y-1">
            {AVAILABLE_MODELS.map((model) => {
              const isSelected = model.id === selectedModel;
              return (
                <button
                  key={model.id}
                  onClick={() => {
                    onSelectModel(model.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors",
                    isSelected
                      ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 border border-indigo-200/60 dark:border-indigo-800/60"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300"
                  )}
                >
                  <span className="text-xl mt-0.5">{model.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {model.name}
                      </span>
                      {model.isPopular && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full">
                          POPULER
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{model.provider}</span>
                      <span>•</span>
                      <span>{model.contextLength}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {model.description}
                    </p>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
