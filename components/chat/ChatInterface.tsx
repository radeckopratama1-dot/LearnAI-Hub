'use client';

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Plus,
  Trash2,
  Edit2,
  SplitSquareVertical,
  MessageSquare,
  Sparkles,
  Bot,
  Search,
} from "lucide-react";
import { ChatMessage as ChatMessageType, ChatSession, AIModelId } from "@/types";
import { clientStore } from "@/lib/mock-store";
import { ModelSelector } from "./ModelSelector";
import { ChatMessage } from "./ChatMessage";
import { CompareMode } from "./CompareMode";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Input";
import { getModelById } from "@/lib/openrouter";

interface ChatInterfaceProps {
  initialSessionId?: string;
  initialPrompt?: string;
}

export function ChatInterface({ initialSessionId, initialPrompt }: ChatInterfaceProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputPrompt, setInputPrompt] = useState(initialPrompt || "");
  const [selectedModel, setSelectedModel] = useState<AIModelId>("anthropic/claude-3.5-sonnet");
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load initial sessions
  useEffect(() => {
    const loadedSessions = clientStore.getSessions();
    setSessions(loadedSessions);
    const targetSessionId = initialSessionId || loadedSessions[0]?.id || "sess-1";
    setActiveSessionId(targetSessionId);
  }, [initialSessionId]);

  // Load messages whenever activeSessionId changes
  useEffect(() => {
    if (!activeSessionId) return;
    const loadedMessages = clientStore.getMessages(activeSessionId);
    setMessages(loadedMessages);

    const currentSession = sessions.find((s) => s.id === activeSessionId);
    if (currentSession && currentSession.model) {
      setSelectedModel(currentSession.model as AIModelId);
    }
  }, [activeSessionId, sessions]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send initial prompt if provided (e.g. from Roadmap deep link)
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() !== "") {
      setInputPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const handleCreateSession = () => {
    const newSession: ChatSession = {
      id: `sess-${Date.now()}`,
      user_id: "usr_mhs_indonesia",
      title: "Chat Baru",
      model: selectedModel,
      created_at: new Date().toISOString(),
      messages_count: 0,
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    clientStore.saveSessions(updated);
    setActiveSessionId(newSession.id);
    setMessages([]);
  };

  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    clientStore.saveSessions(updated);
    if (activeSessionId === id && updated.length > 0) {
      setActiveSessionId(updated[0].id);
    }
  };

  const handleSaveEditTitle = (id: string) => {
    if (!editTitle.trim()) return;
    const updated = sessions.map((s) => (s.id === id ? { ...s, title: editTitle } : s));
    setSessions(updated);
    clientStore.saveSessions(updated);
    setEditingSessionId(null);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;

    const userText = inputPrompt.trim();
    setInputPrompt("");

    let currentSessionId = activeSessionId;
    if (!currentSessionId) {
      const newSession: ChatSession = {
        id: `sess-${Date.now()}`,
        user_id: "usr_mhs_indonesia",
        title: userText.slice(0, 32),
        model: selectedModel,
        created_at: new Date().toISOString(),
        messages_count: 1,
      };
      setSessions([newSession, ...sessions]);
      clientStore.saveSessions([newSession, ...sessions]);
      setActiveSessionId(newSession.id);
      currentSessionId = newSession.id;
    }

    const userMsg: ChatMessageType = {
      id: `msg-${Date.now()}`,
      session_id: currentSessionId,
      role: "user",
      content: userText,
      created_at: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    clientStore.saveMessage(currentSessionId, userMsg);

    // Update session title if first message
    if (messages.length === 0) {
      const updated = sessions.map((s) =>
        s.id === currentSessionId ? { ...s, title: userText.slice(0, 30) } : s
      );
      setSessions(updated);
      clientStore.saveSessions(updated);
    }

    // Prepare assistant message
    const assistantMsgId = `msg-ai-${Date.now()}`;
    const initialAssistantMsg: ChatMessageType = {
      id: assistantMsgId,
      session_id: currentSessionId,
      role: "assistant",
      content: "",
      model: selectedModel,
      created_at: new Date().toISOString(),
      isStreaming: true,
    };

    setMessages([...newMessages, initialAssistantMsg]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          model: selectedModel,
        }),
      });

      if (!response.body) {
        throw new Error("Respons streaming tidak tersedia.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedContent = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6).trim();
            if (dataStr === "[DONE]") {
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              const delta = parsed.choices?.[0]?.delta?.content || "";
              streamedContent += delta;

              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId
                    ? { ...m, content: streamedContent, isStreaming: true }
                    : m
                )
              );
            } catch {
              // ignore parse errors
            }
          }
        }
      }

      const finalizedAssistantMsg: ChatMessageType = {
        id: assistantMsgId,
        session_id: currentSessionId,
        role: "assistant",
        content: streamedContent,
        model: selectedModel,
        created_at: new Date().toISOString(),
        isStreaming: false,
      };

      setMessages((prev) =>
        prev.map((m) => (m.id === assistantMsgId ? finalizedAssistantMsg : m))
      );
      clientStore.saveMessage(currentSessionId, finalizedAssistantMsg);
    } catch (err: unknown) {
      console.error(err);
      const errorMsg: ChatMessageType = {
        id: assistantMsgId,
        session_id: currentSessionId,
        role: "assistant",
        content: "Maaf, terjadi kesalahan saat menghubungi model AI. Pastikan koneksi internet stabil atau cek API Key di halaman Pengaturan.",
        model: selectedModel,
        created_at: new Date().toISOString(),
        isStreaming: false,
      };
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantMsgId ? errorMsg : m))
      );
      clientStore.saveMessage(currentSessionId, errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const starterPrompts = [
    {
      title: "Jelaskan Konsep Overfitting",
      desc: "Apa penyebab model overfit dan cara pencegahannya?",
    },
    {
      title: "Framework Prompt RTFC",
      desc: "Bagaimana cara merancang prompt presisi untuk tugas kuliah?",
    },
    {
      title: "Perbedaan RAG vs Fine-Tuning",
      desc: "Kapan harus memilih RAG dibanding fine-tuning LLM?",
    },
    {
      title: "Ide Judul Skripsi AI 2025",
      desc: "Rekomendasi topik penelitian NLP & Computer Vision terbaru",
    },
  ];

  if (isCompareMode) {
    return <CompareMode onClose={() => setIsCompareMode(false)} />;
  }

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  return (
    <div className="flex h-full w-full bg-slate-50/50 dark:bg-slate-950/50 overflow-hidden">
      {/* Sessions Left Sidebar */}
      <div className="hidden lg:flex flex-col w-72 border-r border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        {/* New Chat Button */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80">
          <Button
            onClick={handleCreateSession}
            variant="primary"
            className="w-full flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Chat Baru</span>
          </Button>

          {/* Search box */}
          <div className="relative mt-3">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari sesi chat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-btn text-xs bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredSessions.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              Belum ada riwayat percakapan.
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const sessionModel = getModelById(session.model);
              return (
                <div
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`group relative flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs transition-all ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 border border-indigo-200/80 dark:border-indigo-800/80 font-semibold"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="text-sm shrink-0">{sessionModel.icon}</span>
                    {editingSessionId === session.id ? (
                      <input
                        type="text"
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => handleSaveEditTitle(session.id)}
                        onKeyDown={(e) => e.key === "Enter" && handleSaveEditTitle(session.id)}
                        className="bg-white dark:bg-slate-800 text-xs px-1.5 py-0.5 rounded border border-indigo-500 w-full"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="truncate">{session.title}</span>
                    )}
                  </div>

                  {/* Actions on hover */}
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSessionId(session.id);
                        setEditTitle(session.title);
                      }}
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      title="Ubah Nama"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteSession(e, session.id)}
                      className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600"
                      title="Hapus Sesi"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
          <div className="flex items-center gap-2 sm:gap-3">
            <ModelSelector
              selectedModel={selectedModel}
              onSelectModel={(id) => {
                setSelectedModel(id);
                if (activeSessionId) {
                  const updated = sessions.map((s) =>
                    s.id === activeSessionId ? { ...s, model: id } : s
                  );
                  setSessions(updated);
                  clientStore.saveSessions(updated);
                }
              }}
            />
            {activeSession && (
              <span className="text-xs text-slate-400 hidden sm:inline truncate max-w-xs">
                {activeSession.title}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Compare Mode Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCompareMode(true)}
              className="gap-1.5 border-indigo-200 dark:border-indigo-900/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300"
            >
              <SplitSquareVertical className="w-4 h-4 text-indigo-500" />
              <span className="font-semibold text-xs hidden sm:inline">Bandingkan 2 AI</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-500 text-white font-bold">
                NEW
              </span>
            </Button>
          </div>
        </div>

        {/* Chat Messages Stream */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25 mb-4 animate-bounce">
                <Sparkles className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Mulai Belajar dengan Multi-AI
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-8 leading-relaxed">
                Tanyakan materi kuliah, konsep machine learning, struktur kode Python, atau analisis studi kasus kepada model AI pilihan Anda.
              </p>

              {/* Starter Prompt Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
                {starterPrompts.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputPrompt(item.desc);
                      textareaRef.current?.focus();
                    }}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all text-left group"
                  >
                    <div className="font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-between">
                      <span>{item.title}</span>
                      <MessageSquare className="w-3 h-3 opacity-50" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="divide-y divide-transparent">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Input Field */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-end gap-2">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ketik pertanyaan atau konsep AI yang ingin Anda pelajari... (Enter untuk kirim, Shift+Enter untuk baris baru)"
                className="resize-none min-h-[50px] max-h-36 pr-10 py-3 text-sm rounded-2xl bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 shadow-sm"
              />
            </div>
            <Button
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              isLoading={isLoading}
              className="h-[50px] w-[50px] rounded-2xl p-0 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/25"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-[11px] text-center text-slate-400 mt-2">
            LearnAI Hub didukung oleh OpenRouter AI Gateway. Jawaban dihasilkan secara real-time.
          </p>
        </div>
      </div>
    </div>
  );
}
