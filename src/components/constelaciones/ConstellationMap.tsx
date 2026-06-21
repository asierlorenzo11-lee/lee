"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";

type Fragment = { slug: string; title: string; author: string };
type Constellation = { slug: string; name: string; fragments: Fragment[] };

interface Props {
  constellations: Constellation[];
}

const AUTHOR_SHORT: Record<string, string> = {
  "Garcilaso de la Vega":           "Garcilaso",
  "Pedro Calderón de la Barca":     "Calderón",
  "San Juan de la Cruz":            "San Juan",
  "Sor Juana Inés de la Cruz":      "Sor Juana",
  "Arcipreste de Hita":             "Arcipreste",
  "Don Juan Manuel":                "D. Juan Manuel",
  "Gonzalo de Berceo":              "Berceo",
  "Fray Luis de León":              "Fray Luis",
  "Fernando de Rojas":              "Rojas",
  "Luis de Góngora":                "Góngora",
  "Luis de Góngora y Argote":       "Góngora",
  "Francisco de Quevedo":           "Quevedo",
  "Francisco Gómez de Quevedo":     "Quevedo",
  "Leandro Fernández de Moratín":   "Moratín",
  "Mariano José de Larra":          "Larra",
  "José de Espronceda":             "Espronceda",
  "Jorge Manrique":                 "Manrique",
  "Miguel de Cervantes":            "Cervantes",
  "Lope de Vega":                   "Lope",
  "José Cadalso":                   "Cadalso",
  "Gustavo Adolfo Bécquer":         "Bécquer",
  "Rosalía de Castro":              "Rosalía",
  "Manuel Machado":                 "Machado",
  "Santa Teresa de Jesús":          "Sta. Teresa",
  "Ana Caro":                       "Ana Caro",
};

function shortName(full: string): string {
  if (AUTHOR_SHORT[full]) return AUTHOR_SHORT[full];
  const particles = new Set(["de", "del", "la", "el", "los", "las", "y"]);
  const words = full.split(" ");
  for (let i = words.length - 1; i >= 0; i--) {
    if (!particles.has(words[i].toLowerCase())) return words[i];
  }
  return full;
}

// SVG canvas size
const W = 2400;
const H = 1400;

interface ConstellationLayout {
  cx: number;
  cy: number;
  stars: { dx: number; dy: number }[];
  edges: [number, number][];
}

const LAYOUTS: Record<string, ConstellationLayout> = {
  amor: {
    cx: 480, cy: 380,
    stars: [
      { dx: 0, dy: 0 }, { dx: 90, dy: -55 }, { dx: 170, dy: 20 },
      { dx: 60, dy: 90 }, { dx: -70, dy: 60 },
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,0],[0,3]],
  },
  "critica-social": {
    cx: 1100, cy: 250,
    stars: [
      { dx: 0, dy: 0 }, { dx: 80, dy: -40 }, { dx: 160, dy: 30 },
      { dx: -80, dy: 50 }, { dx: 40, dy: 90 }, { dx: 200, dy: 80 },
    ],
    edges: [[0,1],[1,2],[0,3],[3,4],[4,5],[2,5],[0,4]],
  },
  "paso-del-tiempo": {
    cx: 1800, cy: 310,
    stars: [
      { dx: 0, dy: 0 }, { dx: -90, dy: -60 }, { dx: 90, dy: -80 },
      { dx: 150, dy: 40 }, { dx: -50, dy: 100 }, { dx: 70, dy: 130 },
      { dx: -150, dy: 50 },
    ],
    edges: [[0,1],[0,2],[2,3],[0,4],[4,6],[4,5],[3,5],[1,6]],
  },
  fe: {
    cx: 420, cy: 900,
    stars: [
      { dx: 0, dy: 0 }, { dx: 70, dy: -80 }, { dx: -70, dy: -70 },
      { dx: 100, dy: 50 }, { dx: -30, dy: 80 }, { dx: 50, dy: 120 },
    ],
    edges: [[0,1],[0,2],[1,3],[0,4],[4,5],[2,4],[3,5]],
  },
  "honor-y-destierro": {
    cx: 1000, cy: 1050,
    stars: [
      { dx: 0, dy: 0 }, { dx: 110, dy: -50 }, { dx: -60, dy: 70 },
    ],
    edges: [[0,1],[1,2],[2,0]],
  },
  "honor-y-valor": {
    cx: 1500, cy: 980,
    stars: [
      { dx: 0, dy: 0 }, { dx: 80, dy: -70 }, { dx: 160, dy: 10 },
      { dx: 50, dy: 100 }, { dx: -60, dy: 60 },
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,0],[0,2]],
  },
  muerte: {
    cx: 2050, cy: 850,
    stars: [
      { dx: 0, dy: 0 }, { dx: -80, dy: -80 }, { dx: 80, dy: -60 },
      { dx: 110, dy: 60 }, { dx: -30, dy: 100 }, { dx: -120, dy: 40 },
    ],
    edges: [[0,1],[0,2],[2,3],[0,3],[0,4],[4,5],[5,1]],
  },
  poder: {
    cx: 1300, cy: 650,
    stars: [
      { dx: 0, dy: 0 }, { dx: 90, dy: -50 }, { dx: -80, dy: -30 },
      { dx: 40, dy: 80 },
    ],
    edges: [[0,1],[0,2],[1,3],[2,3],[0,3]],
  },
};

const LABEL_OFFSETS: Record<string, { dx: number; dy: number }> = {
  amor:               { dx: 80,  dy: 175 },
  "critica-social":   { dx: 60,  dy: 150 },
  "paso-del-tiempo":  { dx: 0,   dy: 195 },
  fe:                 { dx: 40,  dy: 180 },
  "honor-y-destierro":{ dx: 25,  dy: 145 },
  "honor-y-valor":    { dx: 80,  dy: 175 },
  muerte:             { dx: 40,  dy: 175 },
  poder:              { dx: 20,  dy: 155 },
};

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const rand = seededRand(42);
const BG_STARS = Array.from({ length: 240 }, () => ({
  x: rand() * W,
  y: rand() * H,
  r: rand() * 0.9 + 0.3,
  op: rand() * 0.45 + 0.1,
}));

export function ConstellationMap({ constellations }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: W, h: H });
  const [targetVB, setTargetVB] = useState<typeof viewBox | null>(null);
  const [zoomed, setZoomed] = useState<string | null>(null);
  const [hoveredFrag, setHoveredFrag] = useState<string | null>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const animRef = useRef<number | null>(null);
  const vbRef = useRef(viewBox);
  vbRef.current = viewBox;

  const dataBySlug = Object.fromEntries(constellations.map(c => [c.slug, c]));

  const animateToTarget = useCallback(() => {
    if (!targetVB) return;
    const lerp = (a: number, b: number) => a + (b - a) * 0.08;
    const cur = vbRef.current;
    const nx = lerp(cur.x, targetVB.x);
    const ny = lerp(cur.y, targetVB.y);
    const nw = lerp(cur.w, targetVB.w);
    const nh = lerp(cur.h, targetVB.h);
    const close =
      Math.abs(nx - targetVB.x) < 0.5 && Math.abs(ny - targetVB.y) < 0.5 &&
      Math.abs(nw - targetVB.w) < 0.5 && Math.abs(nh - targetVB.h) < 0.5;
    setViewBox(close ? targetVB : { x: nx, y: ny, w: nw, h: nh });
    if (!close) animRef.current = requestAnimationFrame(animateToTarget);
  }, [targetVB]);

  useEffect(() => {
    if (targetVB) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      animRef.current = requestAnimationFrame(animateToTarget);
    }
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [targetVB, animateToTarget]);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setParallax({ x: (px - 0.5) * -40, y: (py - 0.5) * -25 });
  }, []);

  const zoomTo = (slug: string) => {
    const layout = LAYOUTS[slug];
    if (!layout) return;
    setZoomed(slug);
    setTargetVB({ x: layout.cx - 430, y: layout.cy - 265, w: 860, h: 530 });
  };

  const resetZoom = () => {
    setZoomed(null);
    setTargetVB({ x: 0, y: 0, w: W, h: H });
    setHoveredFrag(null);
  };

  return (
    <div className="relative w-full" style={{ height: "100%", minHeight: "500px", background: "#080b14" }}>

      {/* Mobile hint */}
      {!zoomed && (
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 font-mono text-[0.55rem] uppercase tracking-[0.18em] pointer-events-none sm:hidden"
           style={{ color: "rgba(160,180,220,0.45)" }}>
          Toca una constelación
        </p>
      )}

      {/* Back button */}
      {zoomed && (
        <button
          onClick={resetZoom}
          className="absolute top-5 left-5 z-20 flex items-center gap-2 px-4 py-2 rounded font-mono text-xs uppercase tracking-widest"
          style={{ color: "#c8d4f0", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(4px)" }}
        >
          ← volver al cielo
        </button>
      )}

      {/* Constellation name overlay (zoomed) */}
      {zoomed && dataBySlug[zoomed] && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
          <h2
            className="font-display font-black italic tracking-tight"
            style={{ color: "#e8f0ff", fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)", textShadow: "0 0 40px rgba(100,150,255,0.4)" }}
          >
            {dataBySlug[zoomed].name}
          </h2>
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.16em] mt-1" style={{ color: "rgba(160,180,220,0.5)" }}>
            {dataBySlug[zoomed].fragments.length} fragmentos
          </p>
        </div>
      )}

      {/* SVG star map */}
      <svg
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        width="100%"
        height="100%"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setParallax({ x: 0, y: 0 })}
        style={{ display: "block", cursor: zoomed ? "default" : "crosshair" }}
      >
        <defs>
          <radialGradient id="nebula1" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#3040a0" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#3040a0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nebula2" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#6020a0" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#6020a0" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background stars (parallax) */}
        <g transform={`translate(${parallax.x}, ${parallax.y})`}>
          {BG_STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity={s.op} />
          ))}
        </g>

        <ellipse cx={900} cy={500} rx={600} ry={350} fill="url(#nebula1)" />
        <ellipse cx={1700} cy={900} rx={500} ry={300} fill="url(#nebula2)" />

        {/* Constellations */}
        {Object.entries(LAYOUTS).map(([slug, layout]) => {
          const data = dataBySlug[slug];
          const isActive = zoomed === slug;
          const isDimmed = zoomed !== null && !isActive;
          const labelOff = LABEL_OFFSETS[slug] ?? { dx: 0, dy: 130 };

          const starPositions = layout.stars.map(s => ({
            x: layout.cx + s.dx,
            y: layout.cy + s.dy,
          }));

          const fragCount = data?.fragments.length || 1;
          const fragStars = data?.fragments.slice(0, 8).map((f, fi) => {
            const angle = (fi / fragCount) * Math.PI * 2 - Math.PI / 2;
            const radius = 150 + (fi % 3) * 25;
            const x = layout.cx + Math.cos(angle) * radius;
            const y = layout.cy + Math.sin(angle) * radius;
            const isRight = x >= layout.cx;
            return { x, y, fragment: f, isRight };
          }) ?? [];

          return (
            <g key={slug} opacity={isDimmed ? 0.12 : 1} style={{ transition: "opacity 0.5s ease" }}>

              {/* Constellation lines */}
              {layout.edges.map(([a, b], ei) => (
                <line
                  key={ei}
                  x1={starPositions[a].x} y1={starPositions[a].y}
                  x2={starPositions[b].x} y2={starPositions[b].y}
                  stroke={isActive ? "#7090e0" : "#4060b0"}
                  strokeWidth={isActive ? 1.2 : 0.8}
                  strokeOpacity={isActive ? 0.7 : 0.45}
                />
              ))}

              {/* Fragment orbit lines (zoomed only) */}
              {isActive && fragStars.map((fs, fi) => (
                <line
                  key={`fl-${fi}`}
                  x1={layout.cx} y1={layout.cy}
                  x2={fs.x} y2={fs.y}
                  stroke="#5070c0"
                  strokeWidth={0.5}
                  strokeOpacity={0.3}
                  strokeDasharray="3 5"
                />
              ))}

              {/* Fragment stars with side labels (zoomed only) */}
              {isActive && fragStars.map((fs, fi) => {
                const isHovered = hoveredFrag === fs.fragment.slug;
                const labelX = fs.isRight ? fs.x + 16 : fs.x - 16;
                const anchor = fs.isRight ? "start" : "end";
                return (
                  <Link key={`fstar-${fi}`} href={`/fragmentos/${fs.fragment.slug}`}>
                    <g
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => setHoveredFrag(fs.fragment.slug)}
                      onMouseLeave={() => setHoveredFrag(null)}
                    >
                      {/* Halo */}
                      <circle
                        cx={fs.x} cy={fs.y} r={isHovered ? 14 : 10}
                        fill="#1a2550" stroke={isHovered ? "#8099e0" : "#5070c0"}
                        strokeWidth={isHovered ? 1.2 : 0.8}
                        opacity={isHovered ? 0.7 : 0.45}
                        style={{ transition: "r 0.2s, stroke 0.2s, opacity 0.2s" }}
                      />
                      {/* Star dot */}
                      <circle
                        cx={fs.x} cy={fs.y} r={isHovered ? 4 : 3}
                        fill={isHovered ? "#c0d0ff" : "#8099d8"}
                        filter="url(#glow)"
                        style={{ transition: "r 0.2s, fill 0.2s" }}
                      />
                      {/* Author (monospace, small, dim) */}
                      <text
                        x={labelX} y={fs.y - 4}
                        textAnchor={anchor}
                        fontSize={9}
                        fill={isHovered ? "#8899cc" : "#566080"}
                        fontFamily="monospace"
                        letterSpacing="0.06em"
                        style={{ transition: "fill 0.2s" }}
                      >
                        {shortName(fs.fragment.author)}
                      </text>
                      {/* Fragment title (serif italic) */}
                      <text
                        x={labelX} y={fs.y + 11}
                        textAnchor={anchor}
                        fontSize={12}
                        fill={isHovered ? "#e0e8ff" : "#a0b4d8"}
                        fontFamily="Georgia, serif"
                        fontStyle="italic"
                        style={{ transition: "fill 0.2s" }}
                      >
                        {fs.fragment.title}
                      </text>
                    </g>
                  </Link>
                );
              })}

              {/* Main constellation stars */}
              {starPositions.map((sp, si) => (
                <g
                  key={si}
                  style={{ cursor: !zoomed ? "pointer" : "default" }}
                  onClick={!zoomed ? () => zoomTo(slug) : undefined}
                >
                  <circle cx={sp.x} cy={sp.y} r={isActive ? 14 : 12} fill="transparent" />
                  <circle
                    cx={sp.x} cy={sp.y}
                    r={si === 0 ? (isActive ? 5 : 4) : (isActive ? 3.5 : 2.8)}
                    fill={si === 0 ? (isActive ? "#c0d0ff" : "#a0b8f0") : (isActive ? "#8099cc" : "#6080b0")}
                    filter="url(#glow)"
                  />
                </g>
              ))}

              {/* Overview label (not zoomed) */}
              {!zoomed && (
                <g style={{ cursor: "pointer" }} onClick={() => zoomTo(slug)}>
                  <text
                    x={layout.cx + labelOff.dx}
                    y={layout.cy + labelOff.dy}
                    textAnchor="middle"
                    fontSize={18}
                    fill="#c8d8f8"
                    fontFamily="Georgia, serif"
                    fontStyle="italic"
                    letterSpacing="0.04em"
                    filter="url(#glow)"
                    opacity={0.85}
                  >
                    {data?.name ?? slug}
                  </text>
                  <text
                    x={layout.cx + labelOff.dx}
                    y={layout.cy + labelOff.dy + 18}
                    textAnchor="middle"
                    fontSize={10}
                    fill="#6070a0"
                    fontFamily="monospace"
                    letterSpacing="0.12em"
                  >
                    {data ? `${data.fragments.length} fragmentos` : ""}
                  </text>
                  {/* Invisible click rect */}
                  <rect
                    x={layout.cx - 200} y={layout.cy - 200}
                    width={400} height={380}
                    fill="transparent"
                  />
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Hint */}
      {!zoomed && (
        <p
          className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-center pointer-events-none"
          style={{ fontSize: "0.6rem", letterSpacing: "0.18em", color: "rgba(180,200,255,0.3)", textTransform: "uppercase" }}
        >
          haz clic en una constelación para explorarla
        </p>
      )}
    </div>
  );
}
