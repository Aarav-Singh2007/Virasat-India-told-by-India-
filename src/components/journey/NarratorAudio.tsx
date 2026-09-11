"use client";

import { useRef, useCallback, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// NarratorAudio — Single Unified High-Fidelity Indian Male Voice Engine
// • Uses ONLY the new high-definition neural voice (en-IN-PrabhatNeural)
// • The old robotic browser speech synthesis has been completely removed
// • Guarantees that no secondary or old background voice can ever play
// ─────────────────────────────────────────────────────────────────────────────

export interface NarratorControls {
  speak: (text: string, onEnd?: () => void) => void;
  stop: () => void;
}

export function useNarrator(): NarratorControls {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const onEndCallbackRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();

      // Ensure any legacy browser speech synthesis is permanently silenced
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
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
    onEndCallbackRef.current = undefined;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = "";
    }

    // Force cancel any browser speech synthesis to ensure zero background voice
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      stop();

      // Clean emojis and special symbols
      const cleanText = text
        .replace(/[🏰🏛️🎨🗺️⚔️👑🌶️📜🐪✨🟢⏳🎟️🔒🔥•🌾]/g, "")
        .replace(/\s+/g, " ")
        .trim();

      if (!cleanText) {
        if (onEnd) onEnd();
        return;
      }

      onEndCallbackRef.current = onEnd;

      if (!audioRef.current) {
        if (onEnd) onEnd();
        return;
      }

      const audio = audioRef.current;
      const streamUrl = `/api/narrator?text=${encodeURIComponent(cleanText)}&voice=en-IN-PrabhatNeural`;

      audio.src = streamUrl;
      audio.playbackRate = 1.0;

      audio.onended = () => {
        if (onEndCallbackRef.current) {
          const cb = onEndCallbackRef.current;
          onEndCallbackRef.current = undefined;
          cb();
        }
      };

      audio.onerror = () => {
        console.warn("Audio stream error for:", cleanText.slice(0, 30));
        if (onEndCallbackRef.current) {
          const cb = onEndCallbackRef.current;
          onEndCallbackRef.current = undefined;
          cb();
        }
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err: any) => {
          // If aborted by stop() or another speak(), ignore safely
          if (err?.name === "AbortError") {
            return;
          }
          console.warn("Audio play prevented:", err);
          // Do NOT fall back to old speech synthesis - keep only the new voice!
        });
      }
    },
    [stop]
  );

  return { speak, stop };
}
