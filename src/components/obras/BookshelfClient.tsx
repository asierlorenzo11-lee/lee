"use client";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";

export type ShelfBook = {
  id: string;
  slug: string;
  title: string;
  authorName: string;
  era: string;
  bg: string;
  text: string;
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
  const [phase, setPhase] = useState<"in" | "out">("out");
  const [hoveredBook, setHoveredBook] = useState<HoveredBook | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const needle = q.trim().toLowerCase();
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
  let bookIdx = 0;

  return (
    <div>
      {/* ── Search ─────────────────────────────────────────────────────────── */}
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar por título o autor…"
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
              {era ?? "TODAS"}
            </button>
          );
        })}
      </div>

      {/* ── Shelves ────────────────────────────────────────────────────────── */}
      <div className="space-y-14">
        {visibleGroups.map((group) => (
          <section key={group.era || "__search__"}>
            {!needle && visibleGroups.length > 1 && (
              <h2 className="font-display text-lg italic mb-3 text-ink-soft">
                {group.era}
              </h2>
            )}

            {/* Shelf wrapper with overflow + plank */}
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

                {group.books.map((book) => {
                  const delay = bookIdx++ * 28;
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
                        padding: "10px 8px",
                        transform: entering ? "translateY(0)" : "translateY(100px)",
                        opacity: entering ? 1 : 0,
                        transition: entering
                          ? `transform 600ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, opacity 400ms ease ${delay}ms`
                          : "transform 220ms ease 0ms, opacity 180ms ease 0ms",
                      }}
                    >
                      {/* Subtle highlight on spine edge */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 left-0 w-1.5"
                        style={{
                          background:
                            "linear-gradient(to right, rgba(255,255,255,0.22) 0%, transparent 100%)",
                        }}
                      />
                      {/* Subtle shadow on right spine edge */}
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

      {/* ── Hover tooltip (fixed, outside overflow containers) ─────────────── */}
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
          {/* Arrow pointing down */}
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

      {/* ── Count ──────────────────────────────────────────────────────────── */}
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
