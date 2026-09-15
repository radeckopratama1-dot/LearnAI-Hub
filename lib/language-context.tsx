'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'id' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  id: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.chat': 'Chat AI',
    'nav.documents': 'Dokumen RAG',
    'nav.roadmap': 'Roadmap Belajar',
    'nav.generator': 'Content Studio',
    'nav.settings': 'Pengaturan',
    'nav.login': 'Masuk',
    'nav.register': 'Daftar Gratis',
    'nav.logout': 'Keluar',

    // Dashboard Home
    'dash.welcome': 'Selamat datang,',
    'dash.subtitle': 'Platform belajar kecerdasan buatan terlengkap untuk pelajar Indonesia.',
    'dash.totalChats': 'Total Sesi Chat',
    'dash.docsUploaded': 'Dokumen Diupload',
    'dash.roadmapProgress': 'Progress Roadmap',
    'dash.contentGenerated': 'Konten Dibuat',
    'dash.chatNow': 'Chat Sekarang',
    'dash.uploadDoc': 'Upload Dokumen',
    'dash.continueLearning': 'Lanjut Belajar',
    'dash.recentActivity': 'Riwayat Aktivitas Terbaru',
    'dash.nextRoadmap': 'Rekomendasi Topik Selanjutnya',

    // Chat
    'chat.newChat': 'Chat Baru',
    'chat.search': 'Cari percakapan...',
    'chat.selectModel': 'Pilih Model AI',
    'chat.compareMode': 'Bandingkan 2 AI',
    'chat.placeholder': 'Ketik pesan atau tanyakan konsep AI...',
    'chat.disclaimer': 'Model AI dapat membuat kesalahan. Selalu verifikasi informasi penting.',

    // Documents
    'doc.title': 'Dokumen & Riset RAG',
    'doc.subtitle': 'Upload materi kuliah, PDF, atau jurnal untuk dianalisis dan ditanya secara interaktif.',
    'doc.dropzone': 'Seret dan lepas file PDF, DOCX, TXT di sini',
    'doc.dropzoneHint': 'Atau klik untuk memilih file (Maksimal 10MB)',
    'doc.ask': 'Tanya Dokumen',
    'doc.summarize': 'Rangkum',
    'doc.quiz': 'Buat Quiz',
    'doc.delete': 'Hapus',

    // Roadmap
    'roadmap.title': 'Roadmap Belajar AI',
    'roadmap.subtitle': 'Kurikulum terstruktur dari tingkat Pemula, Menengah, hingga Mahir untuk karir AI.',
    'roadmap.completed': 'topik selesai',
    'roadmap.markDone': 'Tandai Selesai',
    'roadmap.inProgress': 'Sedang Dipelajari',
    'roadmap.askAi': 'Tanya AI tentang topik ini',

    // Generator
    'gen.title': 'AI Content Generator Studio',
    'gen.subtitle': 'Generate teks akademis, visual ilustrasi, dan audio suara manusia dalam hitungan detik.',
    'gen.tabText': 'Text Generator',
    'gen.tabImage': 'Image Generator',
    'gen.tabAudio': 'Audio Generator',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.chat': 'AI Chat',
    'nav.documents': 'RAG Documents',
    'nav.roadmap': 'Learning Roadmap',
    'nav.generator': 'Content Studio',
    'nav.settings': 'Settings',
    'nav.login': 'Log In',
    'nav.register': 'Sign Up Free',
    'nav.logout': 'Sign Out',

    // Dashboard Home
    'dash.welcome': 'Welcome back,',
    'dash.subtitle': 'The all-in-one AI learning platform for modern students.',
    'dash.totalChats': 'Total Chat Sessions',
    'dash.docsUploaded': 'Uploaded Documents',
    'dash.roadmapProgress': 'Roadmap Progress',
    'dash.contentGenerated': 'Content Created',
    'dash.chatNow': 'Start Chatting',
    'dash.uploadDoc': 'Upload Document',
    'dash.continueLearning': 'Continue Learning',
    'dash.recentActivity': 'Recent Activity Log',
    'dash.nextRoadmap': 'Recommended Next Topic',

    // Chat
    'chat.newChat': 'New Chat',
    'chat.search': 'Search chats...',
    'chat.selectModel': 'Select AI Model',
    'chat.compareMode': 'Compare 2 AIs',
    'chat.placeholder': 'Type your message or ask an AI question...',
    'chat.disclaimer': 'AI models can make mistakes. Always verify critical insights.',

    // Documents
    'doc.title': 'Documents & RAG Research',
    'doc.subtitle': 'Upload lecture slides, PDFs, or research papers for instant semantic Q&A.',
    'doc.dropzone': 'Drag and drop PDF, DOCX, TXT files here',
    'doc.dropzoneHint': 'Or click to browse files (Maximum 10MB)',
    'doc.ask': 'Ask Document',
    'doc.summarize': 'Summarize',
    'doc.quiz': 'Generate Quiz',
    'doc.delete': 'Delete',

    // Roadmap
    'roadmap.title': 'AI Learning Roadmap',
    'roadmap.subtitle': 'Structured curriculum from Beginner, Intermediate, to Advanced for AI mastery.',
    'roadmap.completed': 'topics completed',
    'roadmap.markDone': 'Mark as Completed',
    'roadmap.inProgress': 'In Progress',
    'roadmap.askAi': 'Ask AI about this topic',

    // Generator
    'gen.title': 'AI Content Generator Studio',
    'gen.subtitle': 'Generate academic texts, visual illustrations, and human speech in seconds.',
    'gen.tabText': 'Text Generator',
    'gen.tabImage': 'Image Generator',
    'gen.tabAudio': 'Audio Generator',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'id',
  setLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('id');

  useEffect(() => {
    const saved = localStorage.getItem('learnai_language') as Language | null;
    if (saved === 'id' || saved === 'en') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('learnai_language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['id']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
