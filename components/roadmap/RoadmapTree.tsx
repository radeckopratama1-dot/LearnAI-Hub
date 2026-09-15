'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  CheckCircle2,
  MessageSquare,
  BookOpen,
  ArrowRight,
  GraduationCap,
  Layers,
  Cpu,
} from "lucide-react";
import confetti from "canvas-confetti";
import { RoadmapTopic, RoadmapStatus } from "@/types";
import { ROADMAP_TOPICS } from "@/lib/roadmap-data";
import { clientStore } from "@/lib/mock-store";
import { ProgressBar } from "./ProgressBar";
import { TopicCard } from "./TopicCard";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

export function RoadmapTree() {
  const router = useRouter();
  const [progressMap, setProgressMap] = useState<Record<string, { status: RoadmapStatus }>>({});
  const [selectedTopic, setSelectedTopic] = useState<RoadmapTopic | null>(null);

  useEffect(() => {
    const loaded = clientStore.getRoadmapProgress();
    setProgressMap(loaded);
  }, []);

  const getStatus = (topicId: string): RoadmapStatus => {
    return progressMap[topicId]?.status || "not_started";
  };

  const handleUpdateStatus = (topicId: string, newStatus: RoadmapStatus) => {
    clientStore.setRoadmapStatus(topicId, newStatus);
    setProgressMap((prev) => ({
      ...prev,
      [topicId]: { status: newStatus },
    }));

    if (newStatus === "completed") {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // confetti fallback
      }
    }
  };

  const handleAskAI = (topic: RoadmapTopic) => {
    const promptParam = encodeURIComponent(topic.suggestedPrompt);
    router.push(`/chat?prompt=${promptParam}`);
  };

  // Group topics by level
  const level1Topics = ROADMAP_TOPICS.filter((t) => t.level === 1);
  const level2Topics = ROADMAP_TOPICS.filter((t) => t.level === 2);
  const level3Topics = ROADMAP_TOPICS.filter((t) => t.level === 3);

  const completedCount = Object.values(progressMap).filter(
    (p) => p.status === "completed"
  ).length;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
      {/* Overall Progress Bar */}
      <ProgressBar
        completedCount={completedCount}
        totalCount={ROADMAP_TOPICS.length}
      />

      {/* Levels Container */}
      <div className="space-y-12">
        {/* LEVEL 1: PEMULA */}
        <section className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-black text-lg">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Level 1 • Fondasi
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
                  Beginner
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                Pemula (Beginner) — Konsep & Esensi AI
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {level1Topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                status={getStatus(topic.id)}
                onClick={() => setSelectedTopic(topic)}
              />
            ))}
          </div>
        </section>

        {/* LEVEL 2: MENENGAH */}
        <section className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-black text-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Level 2 • Arsitektur
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold">
                  Intermediate
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                Menengah (Intermediate) — LLM, RAG & NLP
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {level2Topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                status={getStatus(topic.id)}
                onClick={() => setSelectedTopic(topic)}
              />
            ))}
          </div>
        </section>

        {/* LEVEL 3: LANJUTAN */}
        <section className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center font-black text-lg">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Level 3 • Full-Stack AI
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold">
                  Advanced
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                Lanjutan (Advanced) — AI Agents & Production
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {level3Topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                status={getStatus(topic.id)}
                onClick={() => setSelectedTopic(topic)}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Topic Detail Modal */}
      {selectedTopic && (
        <Modal
          isOpen={!!selectedTopic}
          onClose={() => setSelectedTopic(null)}
          title={selectedTopic.title}
          description={selectedTopic.levelTitle}
          maxWidth="xl"
        >
          <div className="space-y-6">
            {/* Summary */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {selectedTopic.summary}
              </p>
            </div>

            {/* Key learning points */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span>Poin-Poin Kunci Materi:</span>
              </h4>
              <ul className="space-y-2">
                {selectedTopic.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggested Prompt Preview */}
            <div className="p-4 rounded-xl border border-indigo-200/80 dark:border-indigo-800/80 bg-indigo-50/50 dark:bg-indigo-950/30 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Prompt Eksplorasi Cerdas:</span>
              </div>
              <p className="text-xs italic text-slate-600 dark:text-slate-400">
                &quot;{selectedTopic.suggestedPrompt}&quot;
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="primary"
                onClick={() => handleAskAI(selectedTopic)}
                className="w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Tanya AI tentang topik ini</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {getStatus(selectedTopic.id) === "completed" ? (
                  <Button
                    variant="outline"
                    onClick={() => handleUpdateStatus(selectedTopic.id, "in_progress")}
                    className="w-full sm:w-auto text-xs"
                  >
                    Batal Selesai
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      handleUpdateStatus(selectedTopic.id, "completed");
                      setSelectedTopic(null);
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Tandai Selesai</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
