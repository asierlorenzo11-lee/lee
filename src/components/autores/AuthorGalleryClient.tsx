"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";

export type AuthorCard = {
  slug: string;
  name: string;
  era: string | null;
  portraitUrl: string | null;
  meta: string | null;
};

const AVATAR_COLORS = [
  "#2f4858", "#6b2737", "#5b3a29", "#3e5641",
  "#4a3f5e", "#5c4a2e", "#39506b", "#5e3a4a",
  "#4f5d3a", "#3a4a4a",
];

function colorForName(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function initials(name: string) {
  const p = name.split(/\s+/).filter(Boolean);
  return ((p[0]?.[0] ?? "") + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase();
}

export function AuthorGalleryClient({
  authors,
  eras,
}: {
  authors: AuthorCard[];
  eras: string[];
}) {
  const [activeEra, setActiveEra] = useState<string | null>(null);
  const [displayed, setDisplayed] = useState<AuthorCard[]>(authors);
  const [q, setQ] = useState("");
  const [phase, setPhase] = useState<"in" | "out">("out");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Entrance on mount
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setPhase("in")),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  const changeFilter = useCallback(
    (era: string | null) => {
      if (era === activeEra) return;
      clearTimeout(timerRef.current);
      setPhase("out");
      timerRef.current = setTimeout(() => {
        setActiveEra(era);
        setDisplayed(
          era === null ? authors : authors.filter((a) => a.era === era),
        );
        requestAnimationFrame(() => requestAnimationFrame(() => setPhase("in")));
      }, 260);
    },
    [activeEra, authors],
  );

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const needle = q.trim().toLowerCase();
  const visible = needle
    ? displayed.filter((a) => a.name.toLowerCase().includes(needle))
    : displayed;

  return (
    <div>
      {/* ── Search ─────────────────────────────────────────────────────────── */}
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar por nombre…"
        className="mb-5 w-full max-w-xs border-2 border-ink bg-paper px-3 py-1.5 text-sm text-ink placeholder:text-ink-soft focus:outline-none"
      />

      {/* ── Filter chips ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[null, ...eras].map((era) => {
          const active = activeEra === era;
          return (
            <button
              key={era ?? "__all__"}
              onClick={() => changeFilter(era)}
              style={{ transition: "none" }}
              className={`px-3 py-1.5 text-sm font-medium border-2 border-ink ${
                active
                  ? "bg-ink text-paper"
                  : "bg-paper text-ink hover:bg-ink hover:text-paper"
              }`}
            >
              {era ?? "Todos"}
            </button>
          );
        })}
      </div>

      {/* ── Portrait grid ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {visible.map((author, i) => {
          const delay = i * 32;
          const entering = phase === "in";
          return (
            <Link
              key={author.slug}
              href={`/autores/${author.slug}`}
              className="group flex flex-col items-center gap-3 text-center"
              style={{
                transform: entering ? "translateY(0)" : "translateY(60px)",
                opacity: entering ? 1 : 0,
                transition: entering
                  ? `transform 580ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, opacity 380ms ease ${delay}ms`
                  : "transform 200ms ease 0ms, opacity 160ms ease 0ms",
              }}
            >
              {author.portraitUrl ? (
                <Image
                  src={author.portraitUrl}
                  alt={author.name}
                  width={128}
                  height={128}
                  className="size-28 rounded-full object-cover ring-1 ring-line transition-transform group-hover:scale-105"
                />
              ) : (
                <div
                  aria-hidden
                  className="flex size-28 items-center justify-center rounded-full font-display text-2xl text-paper ring-1 ring-line transition-transform group-hover:scale-105"
                  style={{ backgroundColor: colorForName(author.name) }}
                >
                  {initials(author.name)}
                </div>
              )}
              <div>
                <p className="font-serif text-base italic text-ink group-hover:text-accent">
                  {author.name}
                </p>
                {author.meta && (
                  <p className="mt-0.5 text-xs text-ink-soft">{author.meta}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Count ──────────────────────────────────────────────────────────── */}
      <p
        className="mt-8 text-sm text-ink-soft"
        style={{
          opacity: phase === "in" ? 1 : 0,
          transition: "opacity 300ms ease",
        }}
      >
        {visible.length} autor{visible.length !== 1 ? "es" : ""}
        {needle ? ` que coinciden con «${q.trim()}»` : activeEra ? ` del ${activeEra}` : " en la antología"}
      </p>
    </div>
  );
}
