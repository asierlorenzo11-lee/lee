"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

export type AnnotationLayer =
  | "glosa"
  | "contexto"
  | "figuras"
  | "preguntas"
  | "intertextualidad";

export const ANNOTATION_LAYERS: {
  key: AnnotationLayer;
  label: string;
  description: string;
}[] = [
  {
    key: "glosa",
    label: "Significado",
    description: "Definiciones de palabras y expresiones poco usuales.",
  },
  {
    key: "contexto",
    label: "Contexto",
    description: "Notas sobre el contexto histórico del pasaje.",
  },
  {
    key: "figuras",
    label: "Estilo",
    description: "Resalta tropos, tópicos, sintaxis y recursos sonoros.",
  },
  {
    key: "preguntas",
    label: "Debate",
    description: "Preguntas literales, interpretativas y valorativas.",
  },
  {
    key: "intertextualidad",
    label: "Conexiones culturales",
    description: "Enlaces a otros fragmentos y fuentes externas.",
  },
];

const DEFAULT_LAYERS: Record<AnnotationLayer, boolean> = {
  glosa: true,
  contexto: true,
  figuras: false,
  preguntas: true,
  intertextualidad: true,
};

export type TextSize = 0 | 1 | 2;
export type Contrast = "normal" | "alto";
export type ReadingFont = "serif" | "dyslexic";

interface ReadingSettingsState {
  layers: Record<AnnotationLayer, boolean>;
  textSize: TextSize;
  contrast: Contrast;
  readingFont: ReadingFont;
}

interface ReadingSettingsContextValue extends ReadingSettingsState {
  toggleLayer: (layer: AnnotationLayer) => void;
  setTextSize: (size: TextSize) => void;
  toggleContrast: () => void;
  toggleReadingFont: () => void;
}

const STORAGE_KEY = "lee:reading-settings";

const defaultState: ReadingSettingsState = {
  layers: DEFAULT_LAYERS,
  textSize: 0,
  contrast: "normal",
  readingFont: "serif",
};

// Almacén externo respaldado por localStorage: useSyncExternalStore se
// encarga de que la primera renderización en cliente coincida con la del
// servidor (defaultState) y de re-renderizar con el valor persistido en
// cuanto la hidratación termina, sin disparar setState dentro de un efecto.
const listeners = new Set<() => void>();
let snapshot: ReadingSettingsState | undefined;

function readStoredState(): ReadingSettingsState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<ReadingSettingsState>;
    return {
      ...defaultState,
      ...parsed,
      layers: { ...defaultState.layers, ...parsed.layers },
    };
  } catch {
    return defaultState;
  }
}

function getSnapshot(): ReadingSettingsState {
  snapshot ??= readStoredState();
  return snapshot;
}

function getServerSnapshot(): ReadingSettingsState {
  return defaultState;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setSettings(updater: (current: ReadingSettingsState) => ReadingSettingsState) {
  const next = updater(getSnapshot());
  snapshot = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage no disponible
  }
  listeners.forEach((listener) => listener());
}

const ReadingSettingsContext = createContext<
  ReadingSettingsContextValue | undefined
>(undefined);

export function ReadingSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-text-size", String(state.textSize));
    root.setAttribute("data-contrast", state.contrast);
    root.setAttribute("data-reading-font", state.readingFont);
  }, [state.textSize, state.contrast, state.readingFont]);

  const toggleLayer = useCallback((layer: AnnotationLayer) => {
    setSettings((current) => ({
      ...current,
      layers: { ...current.layers, [layer]: !current.layers[layer] },
    }));
  }, []);

  const setTextSize = useCallback((size: TextSize) => {
    setSettings((current) => ({ ...current, textSize: size }));
  }, []);

  const toggleContrast = useCallback(() => {
    setSettings((current) => ({
      ...current,
      contrast: current.contrast === "normal" ? "alto" : "normal",
    }));
  }, []);

  const toggleReadingFont = useCallback(() => {
    setSettings((current) => ({
      ...current,
      readingFont: current.readingFont === "serif" ? "dyslexic" : "serif",
    }));
  }, []);

  return (
    <ReadingSettingsContext.Provider
      value={{
        ...state,
        toggleLayer,
        setTextSize,
        toggleContrast,
        toggleReadingFont,
      }}
    >
      {children}
    </ReadingSettingsContext.Provider>
  );
}

export function useReadingSettings() {
  const ctx = useContext(ReadingSettingsContext);
  if (!ctx) {
    throw new Error(
      "useReadingSettings debe usarse dentro de ReadingSettingsProvider",
    );
  }
  return ctx;
}
