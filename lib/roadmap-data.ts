import { RoadmapTopic } from "@/types";

export const ROADMAP_TOPICS: RoadmapTopic[] = [
  // LEVEL 1: PEMULA (BEGINNER)
  {
    id: "l1-t1",
    level: 1,
    levelTitle: "Level 1 — Pemula (Beginner)",
    title: "Apa itu Artificial Intelligence?",
    titleEn: "What is Artificial Intelligence?",
    summary: "Memahami esensi kecerdasan buatan, bagaimana mesin meniru cara berpikir dan belajar manusia, serta klasifikasi AI (Narrow vs General AI).",
    summaryEn: "Understanding the essence of artificial intelligence, how machines mimic human thinking, and AI classifications.",
    estimatedMinutes: 20,
    keyPoints: [
      "Definisi AI menurut para pionir komputer (Alan Turing, John McCarthy)",
      "Perbedaan Artificial Narrow Intelligence (ANI), AGI, dan Superintelligence (ASI)",
      "Komponen dasar AI: Data, Algoritma, dan Daya Komputasi (GPU/TPU)",
      "Contoh nyata di kehidupan sehari-hari (rekomendasi YouTube, face unlock, maps)"
    ],
    suggestedPrompt: "Jelaskan konsep dasar Artificial Intelligence (AI) untuk pemula dengan analogi kehidupan sehari-hari dan berikan 3 contoh penerapan nyata."
  },
  {
    id: "l1-t2",
    level: 1,
    levelTitle: "Level 1 — Pemula (Beginner)",
    title: "Sejarah dan Perkembangan AI",
    titleEn: "History and Evolution of AI",
    summary: "Melacak perjalanan AI dari Konferensi Dartmouth 1956, era AI Winter, hingga ledakan revolusi deep learning dan generative AI modern.",
    summaryEn: "Tracing AI's journey from Dartmouth Conference 1956, AI Winters, to the generative revolution.",
    estimatedMinutes: 25,
    keyPoints: [
      "Turing Test (1950) dan Konferensi Dartmouth (1956)",
      "Masa kejayaan awal dan masa suram 'AI Winter' (kurang data & komputasi)",
      "Kebangkitan Deep Learning: Kemenangan AlexNet (2012) di ImageNet",
      "Era Generative AI: Penemuan arsitektur Transformer oleh Google (2017) dan ChatGPT (2022)"
    ],
    suggestedPrompt: "Ceritakan garis waktu singkat sejarah AI dari tahun 1950 sampai munculnya ChatGPT, dan mengapa arsitektur Transformer begitu revolusioner?"
  },
  {
    id: "l1-t3",
    level: 1,
    levelTitle: "Level 1 — Pemula (Beginner)",
    title: "Machine Learning vs Deep Learning vs AI",
    titleEn: "Machine Learning vs Deep Learning vs AI",
    summary: "Membedakan hierarki relasi antara AI (payung besar), Machine Learning (algoritma pembelajaran pola), dan Deep Learning (jaringan saraf tiruan berlapis).",
    summaryEn: "Distinguishing between AI, Machine Learning, and Deep Learning neural networks.",
    estimatedMinutes: 30,
    keyPoints: [
      "Diagram konsentris AI ⊃ Machine Learning ⊃ Deep Learning",
      "Supervised, Unsupervised, dan Reinforcement Learning",
      "Peran Artificial Neural Network (ANN) dan lapisan tersembunyi (hidden layers)",
      "Kapan memilih algoritma tradisional (Random Forest) vs Deep Neural Network"
    ],
    suggestedPrompt: "Jelaskan perbedaan spesifik antara Machine Learning dan Deep Learning menggunakan tabel perbandingan dan studi kasus klasifikasi citra."
  },
  {
    id: "l1-t4",
    level: 1,
    levelTitle: "Level 1 — Pemula (Beginner)",
    title: "Tools AI yang Populer (ChatGPT, Midjourney, dll)",
    titleEn: "Popular AI Tools & Ecosystem",
    summary: "Mengenal ragam ekosistem tools AI produktivitas masa kini untuk teks, visual, audio, coding, dan otomatisasi kerja.",
    summaryEn: "Discover modern AI tools for productivity, visual design, audio, and code development.",
    estimatedMinutes: 25,
    keyPoints: [
      "LLM Chatbots: ChatGPT, Claude, Google Gemini, Perplexity",
      "Generative Art & Image: Midjourney, Stable Diffusion, DALL-E 3",
      "AI Coding Assistants: GitHub Copilot, Cursor, v0",
      "Tips memilih tool yang tepat untuk efisiensi studi dan tugas kuliah"
    ],
    suggestedPrompt: "Rekomendasikan 5 tools AI gratis dan freemium yang paling berguna untuk mahasiswa Indonesia beserta cara penggunaannya yang etis."
  },
  {
    id: "l1-t5",
    level: 1,
    levelTitle: "Level 1 — Pemula (Beginner)",
    title: "Prompt Engineering Dasar",
    titleEn: "Basic Prompt Engineering",
    summary: "Menguasai seni dan teknik menyusun prompt presisi agar AI menghasilkan output yang akurat, terstruktur, dan relevan.",
    summaryEn: "Master the fundamental techniques of structuring effective and accurate AI prompts.",
    estimatedMinutes: 35,
    keyPoints: [
      "Framework RTFC: Role, Task, Format, Constraint",
      "Teknik Zero-shot vs Few-shot Prompting",
      "Chain-of-Thought (CoT) Prompting untuk pemecahan masalah rumit",
      "Hindari halusinasi AI dengan batasan konteks yang jelas"
    ],
    suggestedPrompt: "Berikan panduan praktis Prompt Engineering dengan formula RTFC dan 3 contoh prompt sebelum dan sesudah dioptimalkan."
  },

  // LEVEL 2: MENENGAH (INTERMEDIATE)
  {
    id: "l2-t1",
    level: 2,
    levelTitle: "Level 2 — Menengah (Intermediate)",
    title: "Cara Kerja Large Language Model (LLM)",
    titleEn: "How Large Language Models Work",
    summary: "Membedah mekanisme di balik model bahasa raksasa: tokenisasi, mekanisme self-attention, dan probabilitas prediksi kata berikutnya.",
    summaryEn: "Dissecting how LLMs operate: tokenization, self-attention, and next-token probability.",
    estimatedMinutes: 40,
    keyPoints: [
      "Tokenisasi (Byte-Pair Encoding / BPE) dan embedding vektor kata",
      "Mekanisme Self-Attention: bagaimana model memahami hubungan antar kata dalam kalimat",
      "Tahapan pelatihan: Pre-training (unsupervised) dan Alignment (RLHF / DPO)",
      "Penyebab terjadinya halusinasi dan batas jendela konteks (context window)"
    ],
    suggestedPrompt: "Jelaskan secara teknis namun mudah dipahami bagaimana mekanisme Self-Attention pada Transformer bekerja saat membaca kalimat."
  },
  {
    id: "l2-t2",
    level: 2,
    levelTitle: "Level 2 — Menengah (Intermediate)",
    title: "Fine-tuning dan RAG (Retrieval-Augmented Generation)",
    titleEn: "Fine-tuning vs RAG",
    summary: "Strategi memberikan pengetahuan khusus pada AI: membandingkan pelatihan bobot model (fine-tuning) versus pencarian dokumen dinamis (RAG).",
    summaryEn: "Strategies for domain adaptation: fine-tuning model weights vs dynamic RAG search.",
    estimatedMinutes: 45,
    keyPoints: [
      "Kelebihan & kekurangan RAG vs Fine-tuning (LoRA / QLoRA)",
      "Alur kerja RAG: Document Ingestion → Chunking → Embedding → Vector DB → Retrieval → Synthesis",
      "Strategi chunking dokumen yang efektif (overlap, recursive split)",
      "Metrik evaluasi sistem RAG: precision, recall, dan groundedness"
    ],
    suggestedPrompt: "Kapan perusahaan sebaiknya memilih sistem RAG dibandingkan Fine-Tuning? Berikan analisis biaya, akurasi, dan kemudahan implementasi."
  },
  {
    id: "l2-t3",
    level: 2,
    levelTitle: "Level 2 — Menengah (Intermediate)",
    title: "Computer Vision Dasar",
    titleEn: "Foundations of Computer Vision",
    summary: "Bagaimana komputer 'melihat' dan menginterpretasikan piksel: Convolutional Neural Networks (CNN), deteksi objek, dan segmentasi citra.",
    summaryEn: "How computers interpret visual pixels: CNNs, object detection, and segmentation.",
    estimatedMinutes: 35,
    keyPoints: [
      "Representasi citra digital (RGB matriks dan tensor)",
      "Konsep Convolution, Pooling, dan Feature Maps pada CNN",
      "Klasifikasi Gambar vs Deteksi Objek (YOLO) vs Segmentasi Citra",
      "Penerapan dalam mobil otonom dan pengenalan wajah"
    ],
    suggestedPrompt: "Jelaskan prinsip kerja Convolutional Neural Network (CNN) dalam mendeteksi tepi dan pola pada gambar dengan contoh sederhana."
  },
  {
    id: "l2-t4",
    level: 2,
    levelTitle: "Level 2 — Menengah (Intermediate)",
    title: "Natural Language Processing (NLP)",
    titleEn: "Natural Language Processing",
    summary: "Teknik memproses bahasa alami manusia: analisis sentimen, ekstraksi entitas (NER), semantic search, dan pemodelan topik.",
    summaryEn: "Natural language processing techniques: sentiment analysis, NER, semantic search, and topic modeling.",
    estimatedMinutes: 30,
    keyPoints: [
      "Preprocessing teks: stemming, lemmatization, stop words",
      "Representasi teks: TF-IDF, Word2Vec, hingga Dense Vector Embeddings",
      "Named Entity Recognition (NER) dan Part-of-Speech Tagging",
      "Penerapan NLP dalam chatbot layanan pelanggan dan analisis opini publik"
    ],
    suggestedPrompt: "Apa perbedaan pencarian berbasis kata kunci (keyword search) dengan pencarian semantik (semantic search) dalam NLP?"
  },
  {
    id: "l2-t5",
    level: 2,
    levelTitle: "Level 2 — Menengah (Intermediate)",
    title: "Etika dan Bias dalam AI",
    titleEn: "AI Ethics, Bias and Safety",
    summary: "Tantangan moral kecerdasan buatan: bias data pelatihan, privasi, hak cipta karya cipta, keamanan deepfake, dan regulasi global.",
    summaryEn: "Moral challenges of AI: algorithmic bias, data privacy, copyrights, deepfake safety, and policies.",
    estimatedMinutes: 25,
    keyPoints: [
      "Bagaimana bias manusia meresap ke dalam dataset pelatihan AI",
      "Masalah halusinasi, disinformasi, dan deteksi deepfake",
      "Isu hak cipta intellectual property (IP) pada generative model",
      "Panduan AI Etis UNESCO dan regulasi Uni Eropa (EU AI Act)"
    ],
    suggestedPrompt: "Bahas studi kasus nyata tentang bias algoritma dalam sistem perekrutan kerja atau perbankan dan cara memitigasinya."
  },

  // LEVEL 3: LANJUTAN (ADVANCED)
  {
    id: "l3-t1",
    level: 3,
    levelTitle: "Level 3 — Lanjutan (Advanced)",
    title: "Membangun Aplikasi dengan AI API",
    titleEn: "Building Applications with AI APIs",
    summary: "Mengintegrasikan model AI ke dalam aplikasi web produksi: streaming response, function calling, structured JSON output, dan rate limiting.",
    summaryEn: "Integrating AI models into web apps: streaming, function calling, JSON schemas, and rate limits.",
    estimatedMinutes: 50,
    keyPoints: [
      "Integrasi OpenRouter, OpenAI, dan Anthropic API via SDK & HTTP",
      "Server-Sent Events (SSE) untuk streaming teks token-by-token",
      "Function Calling / Tool Use: mengizinkan AI menjalankan fungsi kode",
      "Structured Output (JSON schema) untuk parsing data yang aman"
    ],
    suggestedPrompt: "Berikan contoh kode TypeScript Next.js App Router untuk streaming response dari AI menggunakan Server-Sent Events (SSE)."
  },
  {
    id: "l3-t2",
    level: 3,
    levelTitle: "Level 3 — Lanjutan (Advanced)",
    title: "Vector Databases dan Embedding",
    titleEn: "Vector Databases & Embeddings",
    summary: "Mengelola jutaan vektor data dengan database vektor modern (Supabase pgvector, Pinecone, Chroma) untuk pencarian kemiripan kosinus kilat.",
    summaryEn: "Managing millions of vectors with modern vector databases for rapid cosine similarity search.",
    estimatedMinutes: 45,
    keyPoints: [
      "Konsep Vector Embeddings dan ruang multidimensi",
      "Perhitungan jarak: Cosine Similarity, Euclidean Distance, Dot Product",
      "Index Algoritma: HNSW (Hierarchical Navigable Small World) dan IVFFlat",
      "Implementasi pgvector di PostgreSQL untuk aplikasi fullstack"
    ],
    suggestedPrompt: "Jelaskan bagaimana algoritma HNSW bekerja dalam vector database untuk mempercepat pencarian Approximate Nearest Neighbor (ANN)."
  },
  {
    id: "l3-t3",
    level: 3,
    levelTitle: "Level 3 — Lanjutan (Advanced)",
    title: "Multi-modal AI",
    titleEn: "Multimodal AI Architecture",
    summary: "Arsitektur model yang mampu memproses dan menghubungkan berbagai modalitas data secara simultan: teks, gambar, audio, dan video.",
    summaryEn: "Architecture of models simultaneously processing text, image, audio, and video modalities.",
    estimatedMinutes: 40,
    keyPoints: [
      "Mekanisme CLIP (Contrastive Language-Image Pretraining)",
      "Vision Language Models (VLM) seperti GPT-4o dan Gemini 1.5",
      "Penggabungan audio tokenization (Speech-to-Speech)",
      "Use case: Analisis dokumen visual (diagram, grafik keuangan, CT scan medis)"
    ],
    suggestedPrompt: "Bagaimana arsitektur multimodal seperti GPT-4o memproses gambar dan teks dalam satu ruang embedding terpadu?"
  },
  {
    id: "l3-t4",
    level: 3,
    levelTitle: "Level 3 — Lanjutan (Advanced)",
    title: "AI Agent dan AutoGPT",
    titleEn: "Autonomous AI Agents",
    summary: "Merancang agen otonom cerdas yang mampu merencanakan langkah (planning), mengingat konteks (memory), dan menggunakan tools untuk mencapai tujuan mandiri.",
    summaryEn: "Designing autonomous agents that plan, remember, and execute tools to achieve complex goals.",
    estimatedMinutes: 55,
    keyPoints: [
      "Arsitektur ReAct (Reason + Act): Siklus Thought, Action, Observation",
      "Memori jangka pendek (chat history) vs memori jangka panjang (vector store)",
      "Multi-Agent Orchestration: CrewAI, AutoGen, LangGraph",
      "Keamanan dan Guardrails agar agen tidak menjalankan aksi berbahaya"
    ],
    suggestedPrompt: "Jelaskan arsitektur pola ReAct (Reasoning and Acting) pada AI Agent dan berikan contoh alur kerja ketika agen diminta merangkum berita terkini."
  },
  {
    id: "l3-t5",
    level: 3,
    levelTitle: "Level 3 — Lanjutan (Advanced)",
    title: "Deploy Model AI ke Production",
    titleEn: "Deploying AI Models to Production",
    summary: "Praktik MLOps dan LLMOps modern: kuantisasi model (GGUF, AWQ), caching, monitoring biaya token, evaluasi performa, dan hosting di cloud/edge.",
    summaryEn: "Modern MLOps and LLMOps practices: quantization, caching, token cost monitoring, and cloud deployment.",
    estimatedMinutes: 45,
    keyPoints: [
      "Kuantisasi model: 4-bit dan 8-bit untuk efisiensi VRAM",
      "Self-hosting open models dengan vLLM, Ollama, dan TensorRT-LLM",
      "Semantic Caching untuk memotong biaya API hingga 70%",
      "Observability & logging dengan Langfuse / Helicone"
    ],
    suggestedPrompt: "Bagaimana cara melakukan estimasi biaya dan optimasi latensi saat meluncurkan aplikasi berbasis LLM ke ribuan pengguna aktif?"
  }
];
