import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ status: "active", endpoint: "/api/generate/audio" });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, voice, speed } = body;

    if (!text || typeof text !== "string" || text.trim() === "") {
      return NextResponse.json({ error: "Teks wajib diisi" }, { status: 400 });
    }

    if (text.length > 500) {
      return NextResponse.json(
        { error: "Maksimal panjang teks adalah 500 karakter" },
        { status: 400 }
      );
    }

    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;

    const elevenLabsVoiceMap: Record<string, string> = {
      "Pria Indonesia": "ErXwobaYiN019PkySvjV",
      "Wanita Indonesia": "21m00Tcm4TlvDq8ikWAM",
      "Male English": "VR6AewLTigWG4xSOukaG",
      "Female English": "EXAVITQu4vr4xnSDxMaL",
    };

    if (
      elevenLabsApiKey &&
      elevenLabsApiKey.trim() !== "" &&
      !elevenLabsApiKey.includes("your_elevenlabs_key")
    ) {
      const voiceId = elevenLabsVoiceMap[voice] || "21m00Tcm4TlvDq8ikWAM";
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": elevenLabsApiKey,
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        }
      );

      if (response.ok) {
        const audioBuffer = await response.arrayBuffer();
        const base64Audio = Buffer.from(audioBuffer).toString("base64");
        return NextResponse.json({
          success: true,
          audioUrl: `data:audio/mpeg;base64,${base64Audio}`,
          provider: "ElevenLabs Multilingual v2",
          voice,
          speed,
        });
      }
    }

    return NextResponse.json({
      success: true,
      audioUrl: null,
      useWebSpeechFallback: true,
      provider: "Web Speech API Engine (Native Browser)",
      voice,
      speed,
      text,
    });
  } catch (error: unknown) {
    console.error("Audio Gen Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Gagal generate audio";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
