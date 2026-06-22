"use client";
import { useReadingSettings } from "./ReadingSettingsProvider";

export function ReadingFontToggle() {
  const { readingFont, toggleReadingFont } = useReadingSettings();
  const active = readingFont === "dyslexic";

  return (
    <button
      type="button"
      onClick={toggleReadingFont}
      aria-pressed={active}
      title="Tipografía OpenDyslexic para dislexia"
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-accent bg-accent-soft text-accent"
          : "border-line text-ink-soft hover:text-ink"
      }`}
    >
      <span className="font-mono text-xs">Aa</span>
      Dislexia
    </button>
  );
}
