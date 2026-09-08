"use client";

import { useRef, useCallback, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// NarratorAudio — High-Fidelity Streaming Voice Engine
// 1. First attempts high-quality natural streaming audio via /api/narrator (natural human tone & accent)
// 2. Seamlessly falls back to local neural voices if offline or stream interrupted
// ─────────────────────────────────────────────────────────────────────────────

export interface NarratorControls {
  speak: (text: string, onEnd?: () => void) => void;
  stop: () => void;
}

export function useNarrator(): NarratorControls {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Instantiate background audio object for playback
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Browser speech synthesis fallback
  const speakWithSynthesis = useCallback((cleanedText: string, onEnd?: () => void) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utteranceRef.current = utterance;

    const voices = window.speechSynthesis.getVoices();
    const bestVoice =
      voices.find((v) => v.lang === "en-IN" || v.name.toLowerCase().includes("india")) ||
      voices.find((v) => v.name.toLowerCase().includes("google") && v.lang.startsWith("en")) ||
      voices.find((v) => v.name.toLowerCase().includes("natural") && v.lang.startsWith("en")) ||
      voices.find((v) => v.lang.startsWith("en")) ||
      voices[0];

    if (bestVoice) utterance.voice = bestVoice;
    utterance.rate = 0.94;
    utterance.pitch = 1.0;

    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      stop();

      // Clean emojis and special symbols
      const cleanText = text
        .replace(/[🏰🏛️🎨🗺️⚔️👑🌶️📜🐪✨🟢⏳🎟️🔒🔥•]/g, "")
        .replace(/\s+/g, " ")
        .trim();

      if (!cleanText) {
        if (onEnd) onEnd();
        return;
      }

      // Try High-Fidelity Natural Streaming Voice via /api/narrator
      if (audioRef.current) {
        // Break into sentences if text is too long (first 250 chars)
        const sampleText = cleanText.length > 250 ? cleanText.slice(0, 240) + "..." : cleanText;
        const streamUrl = `/api/narrator?text=${encodeURIComponent(sampleText)}`;

        audioRef.current.src = streamUrl;
        audioRef.current.playbackRate = 1.02;

        audioRef.current.onended = () => {
          if (onEnd) onEnd();
        };

        audioRef.current.onerror = () => {
          console.warn("High-fidelity audio stream fallback to speech synthesis");
          speakWithSynthesis(cleanText, onEnd);
        };

        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay blocked by browser policy without user gesture -> fallback to speech synth
            speakWithSynthesis(cleanText, onEnd);
          });
        }
      } else {
        speakWithSynthesis(cleanText, onEnd);
      }
    },
    [stop, speakWithSynthesis]
  );

  return { speak, stop };
}
