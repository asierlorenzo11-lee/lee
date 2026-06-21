"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "lee:read-fragments";

const listeners = new Set<() => void>();

function readStoredSlugs(): Set<string> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

let snapshot: Set<string> | undefined;

function getSnapshot(): Set<string> {
  snapshot ??= readStoredSlugs();
  return snapshot;
}

const EMPTY_SET = new Set<string>();

function getServerSnapshot(): Set<string> {
  return EMPTY_SET;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useReadFragments() {
  const readSlugs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isRead = useCallback((slug: string) => readSlugs.has(slug), [readSlugs]);

  const toggleRead = useCallback((slug: string) => {
    const next = new Set(getSnapshot());
    if (next.has(slug)) {
      next.delete(slug);
    } else {
      next.add(slug);
    }
    snapshot = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {
      // localStorage no disponible
    }
    listeners.forEach((listener) => listener());
  }, []);

  return { readSlugs, isRead, toggleRead };
}
