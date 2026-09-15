import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ status: "active", endpoint: "/api/roadmap/progress" });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topicId, status } = body;

    if (!topicId || !status) {
      return NextResponse.json(
        { error: "topicId dan status diperlukan" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      topicId,
      status,
      updated_at: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Roadmap API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Gagal memperbarui progress roadmap";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
