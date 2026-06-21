"use client";
import {
  ANNOTATION_LAYERS,
  useReadingSettings,
  type AnnotationLayer,
} from "./ReadingSettingsProvider";

const LAYER_COLOR: Record<AnnotationLayer, string> = {
  contexto:         "var(--color-layer-contexto)",
  figuras:          "var(--color-figure-tropo)",
  glosa:            "var(--color-layer-glosa)",
  intertextualidad: "var(--color-layer-intertext)",
  preguntas:        "var(--color-layer-preguntas)",
};

const SHORT_LABEL: Partial<Record<AnnotationLayer, string>> = {
  intertextualidad: "Conexiones",
};

export function ReadingLayersToolbar() {
  const { layers, toggleLayer } = useReadingSettings();

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Capas de lectura">
      {ANNOTATION_LAYERS.map(({ key, label }) => {
        const active = layers[key];
        const color = LAYER_COLOR[key];
        const displayLabel = SHORT_LABEL[key] ?? label;

        return (
          <button
            key={key}
            type="button"
            onClick={() => toggleLayer(key)}
            aria-pressed={active}
            title={active ? `Desactivar ${displayLabel}` : `Activar ${displayLabel}`}
            style={
              active
                ? { backgroundColor: color, borderColor: color }
                : { borderColor: color }
            }
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium text-ink"
          >
            {!active && (
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
                aria-hidden
              />
            )}
            {displayLabel}
          </button>
        );
      })}
    </div>
  );
}
