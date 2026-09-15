import { generateImageWithReplicate } from "@/lib/replicate";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ status: "active", endpoint: "/api/generate/image" });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, style, aspectRatio } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return NextResponse.json({ error: "Deskripsi prompt gambar wajib diisi" }, { status: 400 });
    }

    const result = await generateImageWithReplicate({
      prompt: prompt.trim(),
      style: style || "Realistic",
      aspectRatio: aspectRatio || "1:1",
    });

    return NextResponse.json({
      success: true,
      imageUrl: result.imageUrl,
      model: result.model,
      prompt,
      style,
      aspectRatio,
      createdAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Image Gen Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Gagal generate gambar";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
