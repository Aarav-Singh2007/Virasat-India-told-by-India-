import { NextRequest, NextResponse } from "next/server";
import { EdgeTTS } from "edge-tts-universal";

export const runtime = "nodejs";

// In-memory cache for synthesized audio to ensure instant response on repeated visits
const audioCache = new Map<string, Buffer>();
const MAX_CACHE_SIZE = 150;

// Authentic Indian Male Narrator Voice
// 'en-IN-PrabhatNeural' is Microsoft's premier Indian English male voice:
// rich, resonant, articulate, cinematic, and authoritative.
const DEFAULT_MALE_VOICE = "en-IN-PrabhatNeural";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text");
  const voice = searchParams.get("voice") || DEFAULT_MALE_VOICE;

  if (!text) {
    return new NextResponse("Missing text query parameter", { status: 400 });
  }

  // Strip emojis and normalize formatting for speech clarity
  const clean = text
    .replace(/[🏰🏛️🎨🗺️⚔️👑🌶️📜🐪✨🟢⏳🎟️🔒🔥•🌾]/g, "")
    .replace(/[^\w\s.,!?'"—–-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) {
    return new NextResponse("Empty text after cleaning", { status: 400 });
  }

  const cacheKey = `${voice}:::${clean}`;
  const cached = audioCache.get(cacheKey);
  if (cached) {
    return new NextResponse(new Uint8Array(cached), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  }

  try {
    const tts = new EdgeTTS(clean, voice);
    const result = await tts.synthesize();
    const arrayBuffer = await result.audio.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (audioCache.size >= MAX_CACHE_SIZE) {
      const firstKey = audioCache.keys().next().value;
      if (firstKey) audioCache.delete(firstKey);
    }
    audioCache.set(cacheKey, buffer);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (err: any) {
    console.error("Male TTS generation error:", err);
    return new NextResponse(
      JSON.stringify({ error: "Failed to generate neural male speech", details: err?.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

