"use client";

import type { CSSProperties } from "react";
import {
  ANNOTATION_LAYERS,
  useReadingSettings,
  type AnnotationLayer,
} from "./ReadingSettingsProvider";

/**
 * Estilo de fondo de cada botón cuando su capa está activa, sincronizado
 * exactamente con el color de resaltado que recibe el texto anotado
 * (ver `.gloss-highlight`, `.context-highlight`, `.figure-highlight`,
 * `.intertext-highlight` en globals.css).
 */
const ACTIVE_LAYER_STYLE: Record<AnnotationLayer, CSSProperties> = {
  glosa: { backgroundColor: "var(--color-layer-glosa)" },
  contexto: { backgroundColor: "var(--color-layer-contexto)" },
  figuras: {
    background:
      "linear-gradient(to right, var(--color-figure-tropo) 0% 25%, var(--color-figure-topos) 25% 50%, var(--color-figure-sintaxis) 50% 75%, var(--color-figure-sonoro) 75% 100%)",
  },
  preguntas: { backgroundColor: "var(--color-layer-preguntas)" },
  intertextualidad: { backgroundColor: "var(--color-layer-intertext)" },
};

/** Cuadro lateral "Capas de lectura": activa o desactiva cada nivel de anotación. */
export function ReadingLayersBox() {
  const settings = useReadingSettings();

  return (
    <section className="rounded-lg border border-line bg-paper-soft p-4">
      <h3 className="mb-3 text-xs font-semibold tracking-wide text-ink-soft uppercase">
        Capas de lectura
      </h3>
      <div className="flex flex-wrap gap-2">
        {ANNOTATION_LAYERS.map((layer) => {
          const active = settings.layers[layer.key];
          return (
            <button
              key={layer.key}
              type="button"
              onClick={() => settings.toggleLayer(layer.key)}
              aria-pressed={active}
              title={layer.description}
              style={active ? ACTIVE_LAYER_STYLE[layer.key] : undefined}
              className={`rounded-full px-3 py-1 text-sm text-ink transition-colors ${
                active ? "" : "border border-line bg-paper text-ink-soft hover:text-ink"
              }`}
            >
              {layer.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
