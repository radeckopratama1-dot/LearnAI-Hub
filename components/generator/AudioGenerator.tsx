'use client';

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, Download, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Input";

const VOICES = [
  { id: "Wanita Indonesia", lang: "id-ID", gender: "female" },
  { id: "Pria Indonesia", lang: "id-ID", gender: "male" },
  { id: "Female English", lang: "en-US", gender: "female" },
  { id: "Male English", lang: "en-US", gender: "male" },
] as const;

const SPEEDS = [
  { label: "Lambat (0.75x)", rate: 0.75 },
  { label: "Normal (1.0x)", rate: 1.0 },
  { label: "Cepat (1.25x)", rate: 1.25 },
] as const;

export function AudioGenerator() {
  const [text, setText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState<typeof VOICES[number]["id"]>("Wanita Indonesia");
  const [selectedSpeed, setSelectedSpeed] = useState<typeof SPEEDS[number]["label"]>("Normal (1.0x)");
  const [isLoading, setIsLoading] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elevenLabsAudioUrl, setElevenLabsAudioUrl] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const charCount = text.length;
  const MAX_CHARS = 500;

  // Cleanup synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    setIsPlaying(false);

    try {
      const response = await fetch("/api/generate/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voice: selectedVoice,
          speed: selectedSpeed,
        }),
      });

      const data = await response.json();
      if (data.audioUrl) {
        setElevenLabsAudioUrl(data.audioUrl);
      } else {
        setElevenLabsAudioUrl(null);
      }

      setHasAudio(true);
    } catch {
      // Fallback to browser synthesis
      setHasAudio(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePlay = () => {
    if (elevenLabsAudioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    // Web Speech API Native Synthesis
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Browser Anda tidak mendukung Web Speech API.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const voiceMeta = VOICES.find((v) => v.id === selectedVoice);
    if (voiceMeta) {
      utterance.lang = voiceMeta.lang;
    }

    const speedMeta = SPEEDS.find((s) => s.label === selectedSpeed);
    if (speedMeta) {
      utterance.rate = speedMeta.rate;
    }

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleDownload = () => {
    if (elevenLabsAudioUrl) {
      const a = document.createElement("a");
      a.href = elevenLabsAudioUrl;
      a.download = `audio-learnai-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert("Audio hasil sintesis Web Speech API diputar langsung via peramban. Masukkan ELEVENLABS_API_KEY di .env.local untuk mengunduh berkas audio MP3 studio.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Input Column */}
      <div className="lg:col-span-6 space-y-4">
        <div className="glass-card rounded-2xl p-6 space-y-4">
          {/* Text Input with char limit */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Teks Suara (Maksimal 500 Karakter)
              </label>
              <span
                className={`text-xs font-mono font-semibold ${
                  charCount > MAX_CHARS ? "text-rose-500" : "text-slate-400"
                }`}
              >
                {charCount}/{MAX_CHARS}
              </span>
            </div>
            <Textarea
              rows={5}
              maxLength={MAX_CHARS}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ketik kalimat atau materi kuliah yang ingin diubah menjadi suara manusia alami..."
              className="text-sm"
            />
          </div>

          {/* Voice selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Pilihan Suara (Voice)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {VOICES.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVoice(v.id)}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-left flex items-center justify-between ${
                    selectedVoice === v.id
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-sm"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span>{v.id}</span>
                  <span className="text-[10px] opacity-80 uppercase">{v.lang}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Speed selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Kecepatan Bicara
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SPEEDS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setSelectedSpeed(s.label)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all truncate ${
                    selectedSpeed === s.label
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={() => handleGenerate()}
            disabled={!text.trim() || charCount > MAX_CHARS || isLoading}
            isLoading={isLoading}
            className="w-full py-2.5 flex items-center justify-center gap-2 shadow-md shadow-indigo-500/25"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Audio Suara</span>
          </Button>
        </div>
      </div>

      {/* Right Audio Player Column */}
      <div className="lg:col-span-6 flex flex-col">
        <div className="glass-card rounded-2xl p-6 flex-1 flex flex-col items-center justify-center">
          {hasAudio ? (
            <div className="w-full max-w-md flex flex-col items-center space-y-6 py-6 animate-in zoom-in-95">
              {/* Audio visualizer simulation */}
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
                <Volume2 className={`w-10 h-10 ${isPlaying ? "animate-pulse" : ""}`} />
              </div>

              {/* Waveform graphic */}
              <div className="flex items-center gap-1 h-12 w-full justify-center px-4">
                {Array.from({ length: 24 }).map((_, i) => {
                  const heights = [20, 45, 80, 60, 30, 90, 75, 40, 100, 50, 70, 35, 85, 65, 45, 95, 30, 60, 80, 40, 70, 55, 30, 20];
                  const h = heights[i % heights.length];
                  return (
                    <div
                      key={i}
                      className={`w-1.5 rounded-full transition-all duration-300 ${
                        isPlaying
                          ? "bg-gradient-to-t from-indigo-500 to-cyan-400 animate-pulse"
                          : "bg-slate-200 dark:bg-slate-800"
                      }`}
                      style={{
                        height: isPlaying ? `${Math.max(15, h)}%` : "20%",
                        animationDelay: `${i * 0.05}s`,
                      }}
                    />
                  );
                })}
              </div>

              {/* Info text */}
              <div className="text-center">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {selectedVoice} • {selectedSpeed}
                </h4>
                <p className="text-xs text-slate-400 mt-1 italic line-clamp-2 max-w-sm">
                  &quot;{text}&quot;
                </p>
              </div>

              {/* Player Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTogglePlay}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all"
                  aria-label={isPlaying ? "Jeda" : "Putar"}
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download MP3</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleGenerate()}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Regenerate</span>
                </Button>
              </div>

              {elevenLabsAudioUrl && (
                <audio
                  ref={audioRef}
                  src={elevenLabsAudioUrl}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2 text-center">
              <Volume2 className="w-10 h-10 stroke-1 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Belum ada audio yang dibuat
              </p>
              <p className="text-xs max-w-xs text-slate-400">
                Masukkan teks, pilih karakter suara dan kecepatan, lalu tekan <strong>Generate Audio Suara</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
