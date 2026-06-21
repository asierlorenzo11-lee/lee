export const ITINERARY_IDENTITY: Record<string, { color: string; bg: string }> = {
  "nombrar-el-amor":     { color: "#9e2a47", bg: "#fdf0f3" },
  "nombrar-el-valor":    { color: "#8b5a12", bg: "#fdf5e8" },
  "nombrar-la-muerte":   { color: "#2d3d6e", bg: "#eef0f8" },
  "nombrar-el-tiempo":   { color: "#485a6a", bg: "#f0f3f5" },
  "nombrar-la-fe":       { color: "#7a5c0a", bg: "#fdf8e8" },
  "nombrar-el-poder":    { color: "#54227a", bg: "#f5f0fa" },
  "nombrar-la-ausencia": { color: "#1e5c6a", bg: "#edf5f7" },
};

const ICONS: Record<string, React.ReactNode> = {
  /* Dos círculos que se solapan — la unión de dos */
  "nombrar-el-amor": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" aria-hidden>
      <circle cx="9.5" cy="12" r="5.5"/>
      <circle cx="14.5" cy="12" r="5.5"/>
    </svg>
  ),

  /* Flecha ascendente que atraviesa una línea horizontal — superar el obstáculo */
  "nombrar-el-valor": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="3" y1="14" x2="21" y2="14"/>
      <line x1="12" y1="21" x2="12" y2="3"/>
      <polyline points="7 8 12 3 17 8"/>
    </svg>
  ),

  /* Luna menguante — el final, el ocaso */
  "nombrar-la-muerte": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" aria-hidden>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>
    </svg>
  ),

  /* Espiral — el tiempo que se enrolla sobre sí mismo */
  "nombrar-el-tiempo": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" aria-hidden>
      <path d="M12 12
        m 0 -8 a 8 8 0 1 1 -7.5 5.3
        a 5.5 5.5 0 1 0 5 -4.6
        a 3 3 0 1 1 -2.8 1.9"/>
    </svg>
  ),

  /* Asterisco de ocho rayos — la luz que irradia desde el centro */
  "nombrar-la-fe": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" aria-hidden>
      <line x1="12" y1="3"    x2="12" y2="9"/>
      <line x1="12" y1="15"   x2="12" y2="21"/>
      <line x1="3"  y1="12"   x2="9"  y2="12"/>
      <line x1="15" y1="12"   x2="21" y2="12"/>
      <line x1="5.6" y1="5.6" x2="9.8" y2="9.8"/>
      <line x1="14.2" y1="14.2" x2="18.4" y2="18.4"/>
      <line x1="18.4" y1="5.6"  x2="14.2" y2="9.8"/>
      <line x1="9.8"  y1="14.2" x2="5.6"  y2="18.4"/>
    </svg>
  ),

  /* Corona de tres puntas — el poder y su jerarquía */
  "nombrar-el-poder": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 18h18"/>
      <path d="M3 18V9.5l4.5 5L12 4l4.5 10.5 4.5-5V18"/>
    </svg>
  ),

  /* Círculo trazado con línea discontinua — el contorno de lo que ya no está */
  "nombrar-la-ausencia": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="8" strokeDasharray="3.5 2.5"/>
    </svg>
  ),
};

export function ItinerarioIcon({
  slug,
  className = "h-10 w-10",
}: {
  slug: string;
  className?: string;
}) {
  const icon = ICONS[slug];
  if (!icon) return null;
  const id = ITINERARY_IDENTITY[slug];
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl ${className}`}
      style={{ color: id?.color, background: id?.bg }}
    >
      {icon}
    </span>
  );
}
