"use client";
import { useState, useRef } from "react";
import { Play, Pause, Volume2 } from "lucide-react";

export function AudioPlayer({ url }: { url: string }) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  function togglePlay() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
    } else {
      void a.play();
    }
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const a = audioRef.current;
    if (!a || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    a.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  }

  function fmt(s: number) {
    const m = Math.floor(s / 60);
    const ss = String(Math.floor(s % 60)).padStart(2, "0");
    return `${m}:${ss}`;
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={url}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onTimeUpdate={() => {
          const a = audioRef.current;
          if (!a) return;
          setCurrentTime(a.currentTime);
          setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
          setCurrentTime(0);
        }}
      />

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-1.5 text-sm text-ink-soft hover:border-ink hover:text-ink transition-colors"
        >
          <Volume2 size={13} aria-hidden />
          Escuchar
        </button>
      ) : (
        <div className="inline-flex items-center gap-3 rounded-full border border-line bg-paper-soft px-3 py-1.5">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pausar" : "Reproducir"}
            className="size-6 shrink-0 rounded-full bg-ink text-paper flex items-center justify-center hover:bg-accent transition-colors"
          >
            {playing
              ? <Pause size={10} aria-hidden />
              : <Play size={10} className="translate-x-px" aria-hidden />
            }
          </button>

          <div
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            className="relative w-40 sm:w-56 h-[3px] rounded-full bg-line cursor-pointer"
            onClick={seek}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-accent pointer-events-none"
              style={{ width: `${progress}%`, transition: "width 0.25s linear" }}
            />
          </div>

          <span className="shrink-0 text-[11px] text-ink-soft tabular-nums font-mono">
            {fmt(currentTime)}{duration ? ` / ${fmt(duration)}` : ""}
          </span>
        </div>
      )}
    </>
  );
}
