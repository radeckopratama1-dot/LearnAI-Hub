import { queryDocumentRAG } from "@/lib/langchain";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ status: "active", endpoint: "/api/documents/query" });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, documentName, chunks } = body;

    if (!query) {
      return NextResponse.json({ error: "Pertanyaan (query) wajib diisi" }, { status: 400 });
    }

    const { answer, citations } = queryDocumentRAG(
      query,
      chunks || [],
      documentName || "Dokumen Anda"
    );

    return NextResponse.json({ answer, citations });
  } catch (error: unknown) {
    console.error("Document Query Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Gagal menjawab dari dokumen";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
