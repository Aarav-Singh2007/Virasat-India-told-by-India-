import { NextRequest, NextResponse } from "next/server";

// Edge TTS / Google TTS proxy handler for high fidelity audio narration
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text");

  if (!text) {
    return new NextResponse("Missing text query parameter", { status: 400 });
  }

  // Sanitize text
  const clean = text
    .slice(0, 300)
    .replace(/[^\w\s.,!?'"-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  try {
    // Google Translate TTS endpoint provides crisp human-recorded multi-lingual voice
    // lang=en-IN (Indian English) with natural tone and pronunciation
    const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      clean
    )}&tl=en-IN&client=tw-ob`;

    const res = await fetch(googleTtsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://translate.google.com/",
      },
    });

    if (!res.ok) {
      return new NextResponse("Failed to fetch audio stream", { status: res.status });
    }

    const audioBuffer = await res.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (err: any) {
    console.error("TTS generation error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
