'use client';

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  FileText,
  BookOpen,
  ArrowLeft,
  Lightbulb,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { DocumentItem, ChatMessage as ChatMessageType, DocumentCitation } from "@/types";
import { SAMPLE_CHUNKS } from "@/lib/langchain";
import { ChatMessage } from "../chat/ChatMessage";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Input";
import { formatBytes } from "@/lib/utils";

interface DocumentChatProps {
  document: DocumentItem;
  onBack: () => void;
  initialQuery?: string;
}

export function DocumentChat({ document, onBack, initialQuery }: DocumentChatProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [query, setQuery] = useState(initialQuery || "");
  const [isLoading, setIsLoading] = useState(false);
  const [activeCitation, setActiveCitation] = useState<DocumentCitation | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message from the document assistant
  useEffect(() => {
    const welcomeMsg: ChatMessageType = {
      id: "rag-welcome",
      session_id: `doc-${document.id}`,
      role: "assistant",
      content: `Halo! Saya asisten khusus untuk dokumen **${document.name}**.\n\nSaya telah mengindeks seluruh isi dokumen (${document.page_count} halaman) ke dalam basis data vektor. Saya hanya akan menjawab secara ketat dan faktual berdasarkan teks dokumen ini.\n\nSilakan pilih salah satu tombol pintasan di bawah atau ketik pertanyaan spesifik Anda!`,
      created_at: new Date().toISOString(),
    };
    setMessages([welcomeMsg]);

    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [document]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const userMsg: ChatMessageType = {
      id: `msg-${Date.now()}`,
      session_id: `doc-${document.id}`,
      role: "user",
      content: userText,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setIsLoading(true);

    const assistantMsgId = `msg-rag-${Date.now()}`;
    const initialAssistantMsg: ChatMessageType = {
      id: assistantMsgId,
      session_id: `doc-${document.id}`,
      role: "assistant",
      content: "",
      created_at: new Date().toISOString(),
      isStreaming: true,
    };
    setMessages((prev) => [...prev, initialAssistantMsg]);

    try {
      // Find matching chunks
      const relevantChunks = SAMPLE_CHUNKS.filter(
        (c) => c.document_id === document.id || document.id.startsWith("doc-")
      );

      const response = await fetch("/api/documents/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userText,
          documentName: document.name,
          chunks: relevantChunks.length > 0 ? relevantChunks : SAMPLE_CHUNKS,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil jawaban RAG");
      }

      const data = await response.json();

      // Simulate slight streaming delay for natural UX
      const fullAnswer = data.answer;
      const citations = data.citations;

      let currentStream = "";
      const words = fullAnswer.split(" ");

      for (let i = 0; i < words.length; i++) {
        currentStream += (i === 0 ? "" : " ") + words[i];
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, content: currentStream, isStreaming: true, citations }
              : m
          )
        );
        if (i % 3 === 0) {
          await new Promise((r) => setTimeout(r, 20));
        }
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? { ...m, content: fullAnswer, isStreaming: false, citations }
            : m
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                content: "Maaf, terjadi kendala saat memproses pencarian semantik pada dokumen.",
                isStreaming: false,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const shortcuts = [
    {
      label: "Rangkum dokumen ini",
      icon: Lightbulb,
      action: () => handleSend("Tolong berikan rangkuman komprehensif dari isi dokumen ini beserta poin pentingnya."),
    },
    {
      label: "Buat 5 poin penting",
      icon: CheckCircle,
      action: () => handleSend("Ekstraksi 5 poin kunci paling esensial dari dokumen ini yang wajib dipahami."),
    },
    {
      label: "Buat 10 soal quiz",
      icon: HelpCircle,
      action: () => handleSend("Buatkan 10 soal kuis pilihan ganda lengkap dengan kunci jawaban dan pembahasannya berdasarkan isi dokumen ini."),
    },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/50">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="truncate max-w-sm sm:max-w-md">{document.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold uppercase">
                RAG Active
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              {document.page_count} Halaman • {formatBytes(document.file_size)} • Terindeks pgvector
            </p>
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onSelectCitation={(cite) => setActiveCitation(cite)}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Citation Detail Modal */}
      {activeCitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="glass-card max-w-lg w-full rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 font-bold text-sm text-indigo-600 dark:text-indigo-400">
                <BookOpen className="w-4 h-4" />
                <span>Kutipan Asli Dokumen</span>
              </div>
              <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-semibold">
                Halaman {activeCitation.page_number}
              </span>
            </div>
            <p className="text-sm italic leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              &quot;{activeCitation.snippet}&quot;
            </p>
            <div className="flex justify-end">
              <Button size="sm" variant="outline" onClick={() => setActiveCitation(null)}>
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Area with Shortcuts & Input */}
      <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Shortcuts Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Pintasan AI:
            </span>
            {shortcuts.map((sc, i) => {
              const Icon = sc.icon;
              return (
                <button
                  key={i}
                  disabled={isLoading}
                  onClick={sc.action}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50/80 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 transition-all disabled:opacity-50"
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sc.label}</span>
                </button>
              );
            })}
          </div>

          {/* Prompt Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(query);
            }}
            className="flex items-end gap-2"
          >
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(query);
                }
              }}
              placeholder={`Tanyakan apa saja seputar isi dokumen "${document.name}"...`}
              className="resize-none min-h-[48px] max-h-32 text-sm rounded-2xl"
            />
            <Button
              type="submit"
              disabled={!query.trim() || isLoading}
              isLoading={isLoading}
              className="h-[48px] px-5 rounded-2xl shadow-sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
