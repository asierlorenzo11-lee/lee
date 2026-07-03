"use client";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback, useDeferredValue } from "react";

export type ShelfBook = {
  id: string;
  slug: string;
  title: string;
  authorName: string;
  era: string;
  bg: string;
  text: string;
  accent: string;
  decoration: string;
  height: number;
  width: number;
};

export type ShelfGroup = {
  era: string;
  books: ShelfBook[];
};

type HoveredBook = {
  book: ShelfBook;
  top: number;
  left: number;
};

// ── Decoraciones en la lomo ───────────────────────────────────────────────────
function SpineDecoration({ type, accent }: { type: string; accent: string }) {
  const c = accent;
  if (type === "plain") return null;

  if (type === "stripes") {
    return (
      <>
        {([0, 1] as const).map((i) => (
          <span key={i} aria-hidden className="pointer-events-none absolute inset-x-0"
                style={{ [i === 0 ? "top" : "bottom"]: 0, height: 18 }}>
            <svg width="100%" height="18" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="6"  x2="100%" y2="6"  stroke={c} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="0" y1="13" x2="100%" y2="13" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </span>
        ))}
      </>
    );
  }

  if (type === "ornament") {
    return (
      <>
        {([0, 1] as const).map((i) => (
          <span key={i} aria-hidden className="pointer-events-none absolute inset-x-0"
                style={{ [i === 0 ? "top" : "bottom"]: 0, height: 26 }}>
            <svg width="100%" height="26" viewBox="0 0 120 26" preserveAspectRatio="none"
                 xmlns="http://www.w3.org/2000/svg">
              <path d="M0,13 Q15,3 30,13 Q45,23 60,13 Q75,3 90,13 Q105,23 120,13"
                    fill="none" stroke={c} strokeWidth="1.6" />
              <circle cx="0"   cy="13" r="2.5" fill={c} />
              <circle cx="120" cy="13" r="2.5" fill={c} />
            </svg>
          </span>
        ))}
      </>
    );
  }

  if (type === "x-cross") {
    return (
      <>
        {([0, 1] as const).map((i) => (
          <span key={i} aria-hidden className="pointer-events-none absolute inset-x-0"
                style={{ [i === 0 ? "top" : "bottom"]: 0, height: 32 }}>
            <svg width="100%" height="32" viewBox="0 0 100 32" preserveAspectRatio="none"
                 xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="94" height="26" fill="none" stroke={c} strokeWidth="1.6" rx="1" />
              <line x1="3"  y1="3"  x2="97" y2="29" stroke={c} strokeWidth="1.3" />
              <line x1="97" y1="3"  x2="3"  y2="29" stroke={c} strokeWidth="1.3" />
              <line x1="3"  y1="3"  x2="50" y2="29" stroke={c} strokeWidth="0.7" opacity="0.5" />
              <line x1="97" y1="3"  x2="50" y2="29" stroke={c} strokeWidth="0.7" opacity="0.5" />
            </svg>
          </span>
        ))}
      </>
    );
  }

  if (type === "band") {
    return (
      <span aria-hidden className="pointer-events-none absolute inset-x-0"
            style={{ top: "43%", height: 12, backgroundColor: c }} />
    );
  }

  if (type === "dashes") {
    return (
      <>
        {(["left", "right"] as const).map((side) => (
          <span key={side} aria-hidden className="pointer-events-none absolute inset-y-0"
                style={{ [side]: 5, width: 2 }}>
            <svg width="2" height="100%" xmlns="http://www.w3.org/2000/svg">
              <line x1="1" y1="0" x2="1" y2="100%" stroke={c} strokeWidth="2" strokeDasharray="5 5" />
            </svg>
          </span>
        ))}
      </>
    );
  }

  if (type === "border") {
    return (
      <span aria-hidden className="pointer-events-none absolute"
            style={{ top: 5, right: 5, bottom: 5, left: 5,
                     border: `1.5px solid ${c}`, borderRadius: 2 }} />
    );
  }

  if (type === "zigzag") {
    return (
      <>
        {([0, 1] as const).map((i) => (
          <span key={i} aria-hidden className="pointer-events-none absolute inset-x-0"
                style={{ [i === 0 ? "top" : "bottom"]: 0, height: 14 }}>
            <svg width="100%" height="14" viewBox="0 0 120 14" preserveAspectRatio="none"
                 xmlns="http://www.w3.org/2000/svg">
              <polyline
                points="0,14 10,0 20,14 30,0 40,14 50,0 60,14 70,0 80,14 90,0 100,14 110,0 120,14"
                fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </span>
        ))}
      </>
    );
  }

  if (type === "dots") {
    return (
      <>
        {([0, 1] as const).map((i) => (
          <span key={i} aria-hidden className="pointer-events-none absolute inset-x-0"
                style={{ [i === 0 ? "top" : "bottom"]: 0, height: 14 }}>
            <svg width="100%" height="14" viewBox="0 0 120 14" preserveAspectRatio="none"
                 xmlns="http://www.w3.org/2000/svg">
              {[8, 22, 36, 50, 64, 78, 92, 106].map((x) => (
                <circle key={x} cx={x} cy="7" r="3.5" fill={c} />
              ))}
            </svg>
          </span>
        ))}
      </>
    );
  }

  if (type === "corner-brackets") {
    return (
      <>
        <span aria-hidden className="pointer-events-none absolute"
              style={{ top: 5, left: 5, right: 5, height: 14,
                       borderTop: `2px solid ${c}`, borderLeft: `2px solid ${c}`, borderRight: `2px solid ${c}` }} />
        <span aria-hidden className="pointer-events-none absolute"
              style={{ bottom: 5, left: 5, right: 5, height: 14,
                       borderBottom: `2px solid ${c}`, borderLeft: `2px solid ${c}`, borderRight: `2px solid ${c}` }} />
      </>
    );
  }

  if (type === "diamond") {
    return (
      <span aria-hidden className="pointer-events-none absolute inset-x-0"
            style={{ top: "50%", transform: "translateY(-50%)", height: 24 }}>
        <svg width="100%" height="24" viewBox="0 0 100 24"
             preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,1 65,12 50,23 35,12" fill="none" stroke={c} strokeWidth="1.8" />
          <polygon points="50,6 60,12 50,18 40,12" fill={c} opacity="0.35" />
        </svg>
      </span>
    );
  }

  return null;
}

function spinePadding(decoration: string): string {
  if (decoration === "x-cross")         return "38px 10px";
  if (decoration === "ornament")        return "30px 10px";
  if (decoration === "stripes")         return "22px 10px";
  if (decoration === "zigzag")          return "18px 10px";
  if (decoration === "dots")            return "18px 10px";
  if (decoration === "corner-brackets") return "22px 10px";
  if (decoration === "dashes")          return "10px 14px";
  if (decoration === "border")          return "14px 16px";
  return "10px 8px";
}

// ── Componente principal ──────────────────────────────────────────────────────
export function BookshelfClient({
  groups,
  eras,
}: {
  groups: ShelfGroup[];
  eras: string[];
}) {
  const allBooks = groups.flatMap((g) => g.books);
  const [activeEra, setActiveEra] = useState<string | null>(null);
  const [displayed, setDisplayed] = useState<ShelfGroup[]>(groups);
  const [q, setQ] = useState("");
  const deferredQ = useDeferredValue(q);
  const [phase, setPhase] = useState<"in" | "out">("out");
  const [hoveredBook, setHoveredBook] = useState<HoveredBook | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const needle = deferredQ.trim().toLowerCase();
  const isPending = q !== deferredQ;
  const visibleGroups: ShelfGroup[] = needle
    ? [{
        era: "",
        books: displayed
          .flatMap((g) => g.books)
          .filter(
            (b) =>
              b.title.toLowerCase().includes(needle) ||
              b.authorName.toLowerCase().includes(needle),
          ),
      }]
    : displayed;

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
          era === null
            ? groups
            : [{ era, books: allBooks.filter((b) => b.era === era) }],
        );
        requestAnimationFrame(() => requestAnimationFrame(() => setPhase("in")));
      }, 280);
    },
    [activeEra, groups, allBooks],
  );

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const totalDisplayed = visibleGroups.reduce((n, g) => n + g.books.length, 0);

  let cumulativeIdx = 0;
  const groupsWithStart = visibleGroups.map((g) => {
    const start = cumulativeIdx;
    cumulativeIdx += g.books.length;
    return { ...g, start };
  });

  const hasFilter = q || activeEra;

  return (
    <div>
      {/* ── Filtros ─────────────────────────────────────────────────────────── */}
      <div className="mt-2 flex flex-wrap items-center gap-3 mb-8">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por título o autor…"
          className="min-w-44 flex-1 rounded-lg border border-line bg-paper py-2 px-3 text-sm text-ink placeholder:text-ink-soft focus:border-accent focus:outline-none"
        />
        <select
          value={activeEra ?? ""}
          onChange={(e) => changeFilter(e.target.value || null)}
          className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink-soft focus:border-accent focus:outline-none"
        >
          <option value="">Época</option>
          {eras.map((era) => (
            <option key={era} value={era}>{era}</option>
          ))}
        </select>
        {hasFilter && (
          <button
            onClick={() => { setQ(""); changeFilter(null); }}
            className="text-sm text-ink-soft hover:text-accent transition-colors"
          >
            ✕ Limpiar
          </button>
        )}
      </div>

      {/* ── Shelves ─────────────────────────────────────────────────────────── */}
      <div
        className="space-y-14"
        style={{ opacity: isPending ? 0.5 : 1, transition: "opacity 150ms ease" }}
      >
        {groupsWithStart.map(({ start, ...group }) => (
          <section key={group.era || "__search__"}>
            {!needle && visibleGroups.length > 1 && (
              <h2 className="font-display text-lg italic mb-3 text-ink-soft">
                {group.era}
              </h2>
            )}

            <div className="overflow-x-auto pb-4">
              <div
                className="relative flex w-fit items-end gap-1.5 shadow-[0_6px_12px_-4px_rgba(0,0,0,0.30)]"
                style={{ minHeight: "300px" }}
              >
                {/* Wooden plank */}
                <div
                  className="absolute bottom-0 left-0 right-0 z-10"
                  style={{
                    height: "12px",
                    background: "linear-gradient(to bottom, #7a5230 0%, #5b3a20 100%)",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.4)",
                  }}
                />

                {group.books.map((book, i) => {
                  const delay = (start + i) * 28;
                  const entering = phase === "in";
                  return (
                    <Link
                      key={book.id}
                      href={`/obras/${book.slug}`}
                      title={`${book.title} — ${book.authorName}`}
                      className="group relative z-0 flex shrink-0 flex-col items-stretch justify-between overflow-hidden shadow-md"
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredBook({
                          book,
                          top: rect.top,
                          left: rect.left + rect.width / 2,
                        });
                      }}
                      onMouseLeave={() => setHoveredBook(null)}
                      style={{
                        backgroundColor: book.bg,
                        color: book.text,
                        writingMode: "vertical-rl",
                        width: `${book.width}px`,
                        height: `${book.height}px`,
                        marginBottom: "12px",
                        padding: spinePadding(book.decoration),
                        transform: entering ? "translateY(0)" : "translateY(100px)",
                        opacity: entering ? 1 : 0,
                        transition: entering
                          ? `transform 600ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, opacity 400ms ease ${delay}ms`
                          : "transform 220ms ease 0ms, opacity 180ms ease 0ms",
                      }}
                    >
                      {/* Decoración del lomo */}
                      <SpineDecoration type={book.decoration} accent={book.accent} />

                      {/* Resalte izquierdo */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 left-0 w-1.5"
                        style={{
                          background:
                            "linear-gradient(to right, rgba(255,255,255,0.20) 0%, transparent 100%)",
                        }}
                      />
                      {/* Sombra derecha */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 right-0 w-1"
                        style={{
                          background:
                            "linear-gradient(to left, rgba(0,0,0,0.15) 0%, transparent 100%)",
                        }}
                      />

                      <span
                        className="relative font-display text-[13px] font-bold leading-snug"
                        style={{
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {book.title}
                      </span>
                      <span
                        className="relative text-[10px] tracking-wider uppercase font-medium"
                        style={{
                          opacity: 0.7,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {book.authorName}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* ── Tooltip al hover ────────────────────────────────────────────────── */}
      {hoveredBook && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            top: hoveredBook.top - 12,
            left: hoveredBook.left,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div
            className="px-3 py-2 shadow-lg text-center"
            style={{
              backgroundColor: hoveredBook.book.bg,
              color: hoveredBook.book.text,
              minWidth: "140px",
              maxWidth: "220px",
              border: "2px solid rgba(0,0,0,0.25)",
            }}
          >
            <p className="font-display text-sm italic font-bold leading-tight">
              {hoveredBook.book.title}
            </p>
            <p className="mt-0.5 text-[11px] tracking-wide uppercase font-medium opacity-75">
              {hoveredBook.book.authorName}
            </p>
          </div>
          <div
            className="mx-auto"
            style={{
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: `8px solid ${hoveredBook.book.bg}`,
            }}
          />
        </div>
      )}

      {/* ── Contador ────────────────────────────────────────────────────────── */}
      <p
        className="mt-6 text-sm text-ink-soft"
        style={{
          opacity: phase === "in" ? 1 : 0,
          transition: "opacity 300ms ease",
        }}
      >
        {totalDisplayed} obra{totalDisplayed !== 1 ? "s" : ""}
        {needle ? ` que coinciden con «${q.trim()}»` : activeEra ? ` del ${activeEra}` : " en la antología"}
      </p>
    </div>
  );
}
