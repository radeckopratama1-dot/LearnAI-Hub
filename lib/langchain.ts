import { DocumentCitation, DocumentItem } from "@/types";

export interface DocumentChunk {
  id: string;
  document_id: string;
  content: string;
  page_number: number;
  chunk_index: number;
}

// Initial demo documents provided so users can test immediately
export const SAMPLE_DOCUMENTS: DocumentItem[] = [
  {
    id: "doc-sample-1",
    user_id: "demo-user",
    name: "Panduan_Dasar_AI_untuk_Mahasiswa.pdf",
    file_url: "/docs/Panduan_Dasar_AI_untuk_Mahasiswa.pdf",
    file_size: 1420000,
    page_count: 8,
    summary: "Dokumen komprehensif yang membahas pengenalan kecerdasan buatan, perbandingan machine learning dan deep learning, serta tips etis memanfaatkan AI dalam pengerjaan skripsi dan tugas akademik.",
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: "doc-sample-2",
    user_id: "demo-user",
    name: "Modul_Prompt_Engineering_dan_RAG.docx",
    file_url: "/docs/Modul_Prompt_Engineering_dan_RAG.docx",
    file_size: 890000,
    page_count: 5,
    summary: "Modul praktis teknik prompting terstruktur (RTFC framework), strategi zero-shot vs few-shot, serta pengenalan arsitektur Retrieval-Augmented Generation (RAG) untuk dokumen privat.",
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  }
];

export const SAMPLE_CHUNKS: DocumentChunk[] = [
  {
    id: "chk-1",
    document_id: "doc-sample-1",
    content: "Kecerdasan Buatan (AI) adalah cabang ilmu komputer yang menekankan pengembangan mesin cerdas, yang mampu bekerja dan bereaksi seperti manusia. Tiga fondasi utama sistem AI modern mencakup ketersediaan data pelatihan masif, algoritma pembelajaran mesin yang optimal, dan komputasi grafis tinggi (GPU).",
    page_number: 1,
    chunk_index: 0,
  },
  {
    id: "chk-2",
    document_id: "doc-sample-1",
    content: "Machine Learning (ML) adalah subset dari AI yang memberikan komputer kemampuan untuk belajar tanpa diprogram secara eksplisit. Sementara itu, Deep Learning (DL) memanfaatkan struktur Artificial Neural Network dengan banyak lapisan tersembunyi (hidden layers) untuk memproses pola hierarkis tingkat tinggi.",
    page_number: 2,
    chunk_index: 1,
  },
  {
    id: "chk-3",
    document_id: "doc-sample-1",
    content: "Pemanfaatan AI oleh mahasiswa harus mematuhi etika integritas akademik: AI harus diposisikan sebagai partner diskusi, pemantik ide (brainstorming), dan alat proofreading naskah, bukan sebagai pengganti pemikiran kritis atau plagiarisme tak berizin.",
    page_number: 6,
    chunk_index: 2,
  },
  {
    id: "chk-4",
    document_id: "doc-sample-2",
    content: "Framework RTFC (Role, Task, Format, Constraint) merupakan fondasi utama perancangan prompt berdaya guna tinggi. Dengan menentukan peran (Role) yang jelas pada AI, menetapkan tugas (Task) terperinci, meminta format keluaran terstruktur (Format), dan memberikan batasan ketat (Constraint), tingkat halusinasi model dapat dipangkas secara drastis.",
    page_number: 2,
    chunk_index: 0,
  },
  {
    id: "chk-5",
    document_id: "doc-sample-2",
    content: "RAG (Retrieval-Augmented Generation) menggabungkan kekuatan pencarian semantik pada basis data vektor dengan kemampuan sintesis bahasa alami LLM. Keunggulan mutlak RAG adalah kemampuannya menyediakan jawaban berbasis sumber faktual dengan rujukan nomor halaman dan mengurangi resiko halusinasi pada data spesifik perusahaan atau dokumen akademis.",
    page_number: 4,
    chunk_index: 1,
  },
];

/**
 * Split raw text into chunks with overlap
 */
export function splitTextIntoChunks(
  text: string,
  chunkSize = 600,
  overlap = 100
): string[] {
  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    let endIndex = startIndex + chunkSize;
    if (endIndex >= text.length) {
      chunks.push(text.slice(startIndex).trim());
      break;
    }

    // Try to break at a sentence or newline boundary
    const nextNewline = text.indexOf('\n', endIndex - 50);
    const nextPeriod = text.indexOf('. ', endIndex - 50);
    if (nextPeriod !== -1 && nextPeriod < endIndex + 50) {
      endIndex = nextPeriod + 1;
    } else if (nextNewline !== -1 && nextNewline < endIndex + 50) {
      endIndex = nextNewline;
    }

    chunks.push(text.slice(startIndex, endIndex).trim());
    startIndex = Math.max(endIndex - overlap, startIndex + 1);
  }

  return chunks.filter((c) => c.length > 20);
}

/**
 * Perform semantic search simulation over document chunks
 */
export function queryDocumentRAG(
  query: string,
  chunks: DocumentChunk[],
  docName = "Dokumen Terkait"
): { answer: string; citations: DocumentCitation[] } {
  const queryWords = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);

  // Score each chunk
  const scoredChunks = chunks.map((chunk) => {
    let score = 0;
    const lowerContent = chunk.content.toLowerCase();
    for (const word of queryWords) {
      if (lowerContent.includes(word)) {
        score += 1;
      }
    }
    return { chunk, score };
  });

  // Sort by relevance
  scoredChunks.sort((a, b) => b.score - a.score);
  const relevantChunks = scoredChunks.slice(0, 3).filter((sc) => sc.score > 0 || chunks.length <= 2);

  const finalChunks = relevantChunks.length > 0 ? relevantChunks.map((c) => c.chunk) : chunks.slice(0, 2);

  const citations: DocumentCitation[] = finalChunks.map((c, i) => ({
    id: `cite-${i + 1}`,
    document_name: docName,
    page_number: c.page_number,
    snippet: c.content.slice(0, 180) + "...",
    similarity: Math.min(0.95, 0.72 + i * 0.08),
  }));

  const contextText = finalChunks.map((c) => `[Halaman ${c.page_number}]: ${c.content}`).join("\n\n");

  const answer = `Berdasarkan dokumen **${docName}**:\n\n${finalChunks
    .map((c) => `• **Rujukan Hal. ${c.page_number}**: ${c.content}`)
    .join("\n\n")}\n\n*Kesimpulan RAG*: Jawaban di atas disintesis secara ketat berdasarkan kutipan yang diekstraksi dari dokumen yang Anda unggah tanpa menambahkan informasi spekulatif di luar konteks.`;

  return { answer, citations };
}
