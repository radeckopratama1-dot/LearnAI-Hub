'use client';

import { ChatMessage, ChatSession, DocumentItem, RoadmapProgress } from "@/types";
import { SAMPLE_DOCUMENTS } from "./langchain";
import { ROADMAP_TOPICS } from "./roadmap-data";

const STORAGE_KEYS = {
  USER: 'learnai_user',
  SESSIONS: 'learnai_sessions',
  MESSAGES: 'learnai_messages',
  DOCUMENTS: 'learnai_documents',
  ROADMAP: 'learnai_roadmap',
  LANGUAGE: 'learnai_language',
};

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: string;
}

export const DEFAULT_USER: StoredUser = {
  id: "usr_mhs_indonesia",
  name: "Budi Santoso",
  email: "budi.santoso@mahasiswa.ac.id",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  role: "Mahasiswa Informatika",
};

export const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: "sess-1",
    user_id: DEFAULT_USER.id,
    title: "Pemahaman Algoritma Transformer",
    model: "anthropic/claude-3.5-sonnet",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    messages_count: 4,
  },
  {
    id: "sess-2",
    user_id: DEFAULT_USER.id,
    title: "Rekomendasi Judul Skripsi AI & NLP",
    model: "openai/gpt-4o",
    created_at: new Date(Date.now() - 3600000 * 26).toISOString(),
    messages_count: 6,
  },
  {
    id: "sess-3",
    user_id: DEFAULT_USER.id,
    title: "Optimasi Query Vector pgvector",
    model: "google/gemini-pro-1.5",
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    messages_count: 2,
  },
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  "sess-1": [
    {
      id: "msg-1",
      session_id: "sess-1",
      role: "user",
      content: "Bisa jelaskan kenapa arsitektur Transformer lebih unggul dibandingkan RNN dan LSTM saat memproses kalimat panjang?",
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: "msg-2",
      session_id: "sess-1",
      role: "assistant",
      model: "anthropic/claude-3.5-sonnet",
      content: `Tentu! Ada 3 alasan fundamental mengapa arsitektur **Transformer** merevolusi pemrosesan bahasa alami (NLP) melampaui RNN dan LSTM:\n\n### 1. Komputasi Paralel (Tidak Berurutan)\n* **RNN/LSTM**: Memproses kata demi kata secara sekuensial ($h_t = f(h_{t-1}, x_t)$). Kata ke-100 harus menunggu kata ke-99 selesai diproses. Hal ini membuat pelatihan tidak bisa dioptimalkan secara penuh di ribuan core GPU.\n* **Transformer**: Memproses seluruh kalimat sekaligus secara simultan menggunakan *Positional Encoding* dan *Self-Attention*, mempercepat waktu training ribuan kali lipat.\n\n### 2. Mekanisme Self-Attention Menghapus 'Vanishing Gradient'\nPada kalimat panjang (misal 500 token), RNN cenderung 'melupakan' konteks kata di awal akibat redaman gradien saat backpropagation. Transformer menghitung bobot keterkaitan antar setiap pasang kata secara langsung:\n\n$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$\n\n### 3. Pemahaman Konteks Dua Arah (Bidirectional)\nTransformer memungkinkan model mengamati konteks kata sebelum dan sesudahnya secara bersamaan tanpa degradasi memori.`,
      created_at: new Date(Date.now() - 3600000 * 4.9).toISOString(),
    },
  ],
};

export const INITIAL_ROADMAP_PROGRESS: Record<string, RoadmapProgress> = {
  "l1-t1": { topic_id: "l1-t1", status: "completed", updated_at: new Date().toISOString() },
  "l1-t2": { topic_id: "l1-t2", status: "completed", updated_at: new Date().toISOString() },
  "l1-t3": { topic_id: "l1-t3", status: "completed", updated_at: new Date().toISOString() },
  "l1-t4": { topic_id: "l1-t4", status: "completed", updated_at: new Date().toISOString() },
  "l1-t5": { topic_id: "l1-t5", status: "completed", updated_at: new Date().toISOString() },
  "l2-t1": { topic_id: "l2-t1", status: "completed", updated_at: new Date().toISOString() },
  "l2-t2": { topic_id: "l2-t2", status: "completed", updated_at: new Date().toISOString() },
  "l2-t3": { topic_id: "l2-t3", status: "in_progress", updated_at: new Date().toISOString() },
};

// Client-side storage helpers
export const clientStore = {
  getUser(): StoredUser {
    if (typeof window === 'undefined') return DEFAULT_USER;
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
      return DEFAULT_USER;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_USER;
    }
  },
  setUser(user: StoredUser) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  getSessions(): ChatSession[] {
    if (typeof window === 'undefined') return INITIAL_SESSIONS;
    const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(INITIAL_SESSIONS));
      return INITIAL_SESSIONS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_SESSIONS;
    }
  },
  saveSessions(sessions: ChatSession[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  },
  getMessages(sessionId: string): ChatMessage[] {
    if (typeof window === 'undefined') return INITIAL_MESSAGES[sessionId] || [];
    const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
      return INITIAL_MESSAGES[sessionId] || [];
    }
    try {
      const parsed = JSON.parse(stored);
      return parsed[sessionId] || [];
    } catch {
      return [];
    }
  },
  saveMessage(sessionId: string, message: ChatMessage) {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const messagesBySession = stored ? JSON.parse(stored) : { ...INITIAL_MESSAGES };
    if (!messagesBySession[sessionId]) {
      messagesBySession[sessionId] = [];
    }
    // Update or append
    const existingIndex = messagesBySession[sessionId].findIndex((m: ChatMessage) => m.id === message.id);
    if (existingIndex >= 0) {
      messagesBySession[sessionId][existingIndex] = message;
    } else {
      messagesBySession[sessionId].push(message);
    }
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messagesBySession));
  },
  getDocuments(): DocumentItem[] {
    if (typeof window === 'undefined') return SAMPLE_DOCUMENTS;
    const stored = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(SAMPLE_DOCUMENTS));
      return SAMPLE_DOCUMENTS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return SAMPLE_DOCUMENTS;
    }
  },
  saveDocuments(docs: DocumentItem[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
  },
  getRoadmapProgress(): Record<string, RoadmapProgress> {
    if (typeof window === 'undefined') return INITIAL_ROADMAP_PROGRESS;
    const stored = localStorage.getItem(STORAGE_KEYS.ROADMAP);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(INITIAL_ROADMAP_PROGRESS));
      return INITIAL_ROADMAP_PROGRESS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_ROADMAP_PROGRESS;
    }
  },
  setRoadmapStatus(topicId: string, status: 'not_started' | 'in_progress' | 'completed') {
    if (typeof window === 'undefined') return;
    const progress = this.getRoadmapProgress();
    progress[topicId] = {
      topic_id: topicId,
      status,
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(progress));
  },
};
