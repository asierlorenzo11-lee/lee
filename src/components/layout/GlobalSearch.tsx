"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, FileText, User, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

type SearchFragment = {
  slug: string;
  title: string;
  headline: string;
  work: { title: string; author: { name: string } };
};
type SearchAuthor = {
  slug: string;
  name: string;
  era: string | null;
  portraitUrl: string | null;
};
type SearchWork = {
  slug: string;
  title: string;
  year: number | null;
  author: { name: string };
};
type Results = { fragments: SearchFragment[]; authors: SearchAuthor[]; works: SearchWork[] };

function initials(name: string) {
  const p = name.split(/\s+/).filter(Boolean);
  return ((p[0]?.[0] ?? "") + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase();
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const router = useRouter();

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Focus input on open, reset on close
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
    } else {
      setQuery("");
      setResults(null);
      clearTimeout(timerRef.current);
    }
  }, [open]);

  const doSearch = useCallback((q: string) => {
    clearTimeout(timerRef.current);
    if (q.trim().length < 2) {
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
        setResults(await res.json());
      } finally {
        setLoading(false);
      }
    }, 280);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    doSearch(v);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      setOpen(false);
      router.push(`/buscar?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const close = () => setOpen(false);
  const hasResults =
    results && (results.fragments.length + results.authors.length + results.works.length) > 0;

  return (
    <>
      {/* ── Trigger button ─────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Buscar en la antología"
        className="mx-auto hidden w-full max-w-sm sm:flex items-center gap-2 rounded-full border border-line bg-paper-soft px-4 py-2 text-sm text-ink-soft hover:border-accent transition-colors"
      >
        <Search size={14} aria-hidden />
        <span className="flex-1 text-left">Buscar…</span>
        <kbd className="hidden lg:inline text-xs font-sans opacity-50">⌘K</kbd>
      </button>

      {/* Mobile search icon */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Buscar"
        className="sm:hidden flex size-11 items-center justify-center text-ink-soft hover:text-ink"
      >
        <Search size={18} />
      </button>

      {/* ── Overlay ────────────────────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="mx-4 mt-16 sm:mx-auto max-w-xl overflow-hidden border-2 border-ink bg-paper shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input row */}
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <Search size={17} className="shrink-0 text-ink-soft" aria-hidden />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Buscar fragmentos, autores, obras…"
                className="flex-1 bg-transparent text-base text-ink placeholder:text-ink-soft focus:outline-none"
                autoComplete="off"
                spellCheck={false}
              />
              {loading && (
                <span className="size-4 rounded-full border-2 border-accent border-t-transparent animate-spin shrink-0" />
              )}
              <button onClick={close} className="shrink-0 flex size-9 items-center justify-center text-ink-soft hover:text-ink">
                <X size={17} />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto divide-y divide-line">
              {!hasResults && !loading && query.trim().length >= 2 && (
                <p className="px-5 py-8 text-center text-sm text-ink-soft">
                  Sin resultados para «{query}»
                </p>
              )}

              {results && results.fragments.length > 0 && (
                <div>
                  <p className="flex items-center gap-2 px-4 pt-3 pb-1.5 text-xs font-semibold uppercase tracking-widest text-ink-soft">
                    <FileText size={12} /> Fragmentos
                  </p>
                  {results.fragments.map((f) => (
                    <Link
                      key={f.slug}
                      href={`/fragmentos/${f.slug}`}
                      onClick={close}
                      className="flex flex-col gap-0.5 px-5 py-2.5 hover:bg-accent hover:text-paper transition-colors"
                    >
                      <span className="text-sm font-medium leading-tight">{f.headline || f.title}</span>
                      <span className="text-xs opacity-60">
                        {f.work.title} · {f.work.author.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {results && results.authors.length > 0 && (
                <div>
                  <p className="flex items-center gap-2 px-4 pt-3 pb-1.5 text-xs font-semibold uppercase tracking-widest text-ink-soft">
                    <User size={12} /> Autores
                  </p>
                  {results.authors.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/autores/${a.slug}`}
                      onClick={close}
                      className="flex items-center gap-3 px-5 py-2.5 hover:bg-accent hover:text-paper transition-colors"
                    >
                      {a.portraitUrl ? (
                        <Image
                          src={a.portraitUrl}
                          alt={a.name}
                          width={28}
                          height={28}
                          className="size-7 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[10px] font-bold text-accent">
                          {initials(a.name)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="block text-sm font-medium leading-tight">{a.name}</span>
                        {a.era && (
                          <span className="block text-xs opacity-60">{a.era}</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {results && results.works.length > 0 && (
                <div>
                  <p className="flex items-center gap-2 px-4 pt-3 pb-1.5 text-xs font-semibold uppercase tracking-widest text-ink-soft">
                    <BookOpen size={12} /> Obras
                  </p>
                  {results.works.map((w) => (
                    <Link
                      key={w.slug}
                      href={`/obras/${w.slug}`}
                      onClick={close}
                      className="flex flex-col gap-0.5 px-5 py-2.5 hover:bg-accent hover:text-paper transition-colors"
                    >
                      <span className="text-sm font-medium italic leading-tight">{w.title}</span>
                      <span className="text-xs opacity-60">
                        {w.author.name}{w.year ? ` · ${w.year}` : ""}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Footer: press Enter to see all results */}
              {hasResults && (
                <div className="px-4 py-2.5 text-xs text-ink-soft">
                  ↵ Intro para ver todos los resultados
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
