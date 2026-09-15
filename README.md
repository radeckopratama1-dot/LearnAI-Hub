# 🚀 LearnAI Hub — Platform Belajar AI Mahasiswa & Pelajar Indonesia

<div align="center">

![LearnAI Hub Banner](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80)

**Platform edukasi kecerdasan buatan (AI) all-in-one terintegrasi: Multi-AI Chat, Analisis Dokumen RAG (pgvector), Roadmap Belajar Terstruktur, dan Content Studio Generatif.**

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20pgvector-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
[![OpenRouter](https://img.shields.io/badge/AI_Gateway-OpenRouter-6366F1?style=flat)](https://openrouter.ai/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## 🌟 Fitur Utama

### 1. 💬 Multi-AI Chat & Compare Mode
- **5 Model AI Flagship**: Claude 3.5 Sonnet (Anthropic), GPT-4o (OpenAI), Gemini Pro (Google), Mistral 7B (Mistral AI), dan Llama 3 (Meta).
- **Streaming Response**: Huruf dan token muncul secara real-time via Server-Sent Events (SSE).
- **Dual-Model Compare Mode**: Ajukan 1 pertanyaan dan saksikan 2 model berbeda merespons secara paralel berdampingan.
- **Markdown & Code Highlighting**: Syntax highlighting otomatis dengan tombol salin cepat.

### 2. 📄 Dokumen + AI (RAG Semantik)
- **Upload Mandiri**: Mendukung PDF, DOCX, dan TXT hingga 10MB dengan progress bar animasi.
- **LangChain + pgvector**: Dokumen otomatis di-chunking dan di-embed ke basis data vektor.
- **Kutipan Sumber Faktual**: Jawaban AI disertai rujukan nomor halaman dan kutipan asli dari teks dokumen.
- **Pintasan Cerdas**: Rangkum dokumen dalam 1 klik, ekstraksi 5 poin penting, atau buat 10 soal kuis pilihan ganda.

### 3. 🗺️ Roadmap Belajar AI Terstruktur
- **3 Tingkatan Lengkap**:
  - **Level 1 — Pemula (Beginner)**: Fondasi AI, Sejarah, ML vs DL, AI Tools, Prompt Engineering RTFC.
  - **Level 2 — Menengah (Intermediate)**: Mekanisme LLM & Self-Attention, RAG vs Fine-Tuning, Computer Vision, NLP, Etika & Bias AI.
  - **Level 3 — Lanjutan (Advanced)**: Membangun Aplikasi dengan AI API, Vector Databases & pgvector, Multimodal AI, Autonomous Agents (ReAct), dan Produksi MLOps/LLMOps.
- **Pelacakan Kemajuan**: Checklist status (*Belum Mulai*, *Sedang Belajar*, *Selesai*) dengan progress bar dinamis dan efek selebrasi konfeti.
- **Tutor Interaktif**: Tombol *"Tanya AI tentang topik ini"* langsung membuka chat dengan instruksi kontekstual mendalam.

### 4. 🎨 AI Content Generator Studio
- **Text Generator**: Buat rangkuman, essay akademik, makalah ilmiah, caption medsos, email formal, atau skrip kode dalam bahasa Indonesia maupun Inggris.
- **Image Generator (SDXL)**: Hasilkan gambar visual resolusi tinggi dengan berbagai gaya (*Realistic, Anime, Digital Art, Watercolor, 3D Render*) dan rasio fleksibel (*1:1, 16:9, 9:16*).
- **Audio Generator (TTS)**: Ubah teks menjadi suara manusia alami (*Pria/Wanita Indonesia & English*) dengan kontrol kecepatan bicara dan integrasi ElevenLabs / Web Speech API.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript (Strict)
- **Styling**: Tailwind CSS, CSS Custom Tokens (Glassmorphism & Gradients)
- **Animasi & Interaksi**: Framer Motion, Canvas Confetti
- **Ikon**: Lucide React
- **Tema & Bahasa**: `next-themes` (Dark/Light mode) & Bilingual Context (ID / EN)
- **Basis Data & Vektor**: Supabase (PostgreSQL + pgvector extension)
- **AI Gateway**: OpenRouter API
- **Model Gambar**: Replicate API (Stable Diffusion XL)
- **Model Suara**: ElevenLabs Multilingual v2 / Web Speech API

---

## 📋 Struktur Direktori

```text
learnai-hub/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── chat/page.tsx
│   │   ├── chat/[sessionId]/page.tsx
│   │   ├── documents/page.tsx
│   │   ├── roadmap/page.tsx
│   │   ├── generator/page.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── chat/route.ts
│   │   ├── documents/upload/route.ts
│   │   ├── documents/query/route.ts
│   │   ├── generate/image/route.ts
│   │   ├── generate/audio/route.ts
│   │   └── roadmap/progress/route.ts
│   ├── layout.tsx
│   └── page.tsx (Landing Page)
├── components/
│   ├── ui/ (Button, Input, Card, Badge, Modal, dll)
│   ├── layout/ (Sidebar, Navbar, MobileNav, ThemeToggle)
│   ├── chat/ (ChatInterface, ChatMessage, ModelSelector, CompareMode)
│   ├── documents/ (DocumentUploader, DocumentCard, DocumentChat)
│   ├── roadmap/ (RoadmapTree, TopicCard, ProgressBar)
│   └── generator/ (TextGenerator, ImageGenerator, AudioGenerator)
├── lib/
│   ├── supabase.ts
│   ├── openrouter.ts
│   ├── langchain.ts
│   ├── replicate.ts
│   ├── roadmap-data.ts
│   ├── mock-store.ts
│   └── utils.ts
├── supabase/
│   └── schema.sql (DDL Lengkap + pgvector + RLS)
├── types/
│   └── index.ts
├── .env.local
├── next.config.mjs
└── vercel.json
```

---

## ⚙️ Panduan Instalasi & Menjalankan Lokal

### 1. Clone & Masuk ke Direktori
```bash
git clone https://github.com/username/learnai-hub.git
cd learnai-hub
```

### 2. Pasang Dependencies
```bash
npm install
```

### 3. Konfigurasi Environment Variables (`.env.local`)
Buat file `.env.local` pada direktori root dan masukkan kunci API yang relevan:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenRouter AI Gateway (Claude 3.5, GPT-4o, Gemini, Mistral, Llama 3)
OPENROUTER_API_KEY=your_openrouter_api_key

# Replicate API (Stable Diffusion XL)
REPLICATE_API_TOKEN=your_replicate_token

# ElevenLabs API (Text-to-Speech)
ELEVENLABS_API_KEY=your_elevenlabs_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Catatan Offline/Sandbox**: LearnAI Hub dilengkapi dengan *resilient fallback simulator*. Jika API Key belum diisi, seluruh antarmuka tetap dapat diuji coba dengan respons interaktif cerdas tanpa *error crash*.

### 4. Setup Database Supabase
Buka **SQL Editor** pada dashboard proyek Supabase Anda dan jalankan isi dari:
```bash
supabase/schema.sql
```
Skrip ini akan otomatis membuat tabel `profiles`, `chat_sessions`, `chat_messages`, `documents`, `document_chunks`, `roadmap_progress`, `generated_content`, fungsi kemiripan kosinus `match_document_chunks`, serta RLS policies.

### 5. Jalankan Development Server
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

---

## 🚀 Panduan Deployment ke Vercel

1. Push repositori ini ke GitHub / GitLab / Bitbucket.
2. Buka [Vercel Dashboard](https://vercel.com) dan klik **"New Project"**.
3. Import repositori LearnAI Hub.
4. Pada bagian **Environment Variables**, tambahkan semua variabel yang ada di `.env.local`.
5. Klik **"Deploy"**. Vercel akan otomatis mendeteksi framework Next.js 14 dan konfigurasi `vercel.json`.

---

## 🛡️ Lisensi & Kontribusi

Dikembangkan dengan dedikasi untuk memajukan talenta AI Indonesia. Bebas digunakan untuk keperluan edukasi dan riset akademik.
