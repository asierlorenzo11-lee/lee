"use client";

import * as Switch from "@radix-ui/react-switch";
import { useReadingSettings } from "./ReadingSettingsProvider";

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <li className="flex items-start justify-between gap-4 py-3">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-ink-soft">{description}</p>
      </div>
      <Switch.Root
        checked={checked}
        onCheckedChange={onChange}
        className="relative h-6 w-11 shrink-0 rounded-full bg-line transition-colors data-[state=checked]:bg-accent"
      >
        <Switch.Thumb className="block size-5 translate-x-0.5 rounded-full bg-paper shadow transition-transform duration-150 data-[state=checked]:translate-x-[22px]" />
      </Switch.Root>
    </li>
  );
}

const TEXT_SIZE_LABELS: { value: 0 | 1 | 2; label: string }[] = [
  { value: 0, label: "A" },
  { value: 1, label: "A" },
  { value: 2, label: "A" },
];
const TEXT_SIZE_CLASSES = ["text-sm", "text-base", "text-lg"];

/** Cuadro lateral "Ajustes de lectura": tamaño de texto, contraste y tipografía. */
export function AccessibilityBox() {
  const settings = useReadingSettings();

  return (
    <section className="rounded-lg border border-line bg-paper-soft p-4">
      <h3 className="mb-3 text-xs font-semibold tracking-wide text-ink-soft uppercase">
        Ajustes de lectura
      </h3>

      <div className="mb-2">
        <p className="mb-2 text-sm font-medium">Tamaño del texto</p>
        <div className="flex gap-2">
          {TEXT_SIZE_LABELS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => settings.setTextSize(value)}
              aria-pressed={settings.textSize === value}
              className={`${TEXT_SIZE_CLASSES[value]} rounded border px-3 py-1.5 font-sans transition-colors ${
                settings.textSize === value
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line text-ink-soft hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ul className="divide-y divide-line">
        <ToggleRow
          label="Alto contraste"
          description="Aumenta el contraste de colores en toda la interfaz."
          checked={settings.contrast === "alto"}
          onChange={settings.toggleContrast}
        />
        <ToggleRow
          label="Tipografía para dislexia"
          description="Sustituye la tipografía del texto literario por OpenDyslexic."
          checked={settings.readingFont === "dyslexic"}
          onChange={settings.toggleReadingFont}
        />
      </ul>
    </section>
  );
}
