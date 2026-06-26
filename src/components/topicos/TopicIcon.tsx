const ICONS: Record<string, React.ReactNode> = {
  "amor-cortes": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/>
    </svg>
  ),
  "beatus-ille": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="9" r="5"/>
      <line x1="12" y1="14" x2="12" y2="22"/>
      <line x1="9" y1="20" x2="15" y2="20"/>
    </svg>
  ),
  "carpe-diem": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="2" x2="12" y2="5.5"/>
      <line x1="12" y1="18.5" x2="12" y2="22"/>
      <line x1="2" y1="12" x2="5.5" y2="12"/>
      <line x1="18.5" y1="12" x2="22" y2="12"/>
      <line x1="5.3" y1="5.3" x2="7.8" y2="7.8"/>
      <line x1="16.2" y1="16.2" x2="18.7" y2="18.7"/>
      <line x1="18.7" y1="5.3" x2="16.2" y2="7.8"/>
      <line x1="7.8" y1="16.2" x2="5.3" y2="18.7"/>
    </svg>
  ),
  "contemptus-mundi": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9"/>
      <path d="M4.9 4.9 L19.1 19.1"/>
    </svg>
  ),
  "desengano": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  "locus-amoenus": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 20 L7 13 L11 17 L15 9 L21 20"/>
      <circle cx="6.5" cy="9" r="2"/>
      <line x1="6.5" y1="7" x2="6.5" y2="5"/>
    </svg>
  ),
  "mistica": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2c-2 4.5-4 7.5-4 11a4 4 0 0 0 8 0c0-3.5-2-6.5-4-11Z"/>
      <path d="M12 22v-4"/>
    </svg>
  ),
  "tempus-fugit": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="5" y1="22" x2="19" y2="22"/>
      <line x1="5" y1="2" x2="19" y2="2"/>
      <path d="M5 2C5 2 9 6 12 11C15 6 19 2 19 2"/>
      <path d="M5 22C5 22 9 18 12 13C15 18 19 22 19 22"/>
    </svg>
  ),
  "ubi-sunt": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/>
      <circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none"/>
    </svg>
  ),
  "fortuna-mutabilis": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="8"/>
      <line x1="12" y1="4" x2="12" y2="20"/>
      <line x1="4" y1="12" x2="20" y2="12"/>
      <line x1="6.3" y1="6.3" x2="17.7" y2="17.7"/>
      <line x1="17.7" y1="6.3" x2="6.3" y2="17.7"/>
    </svg>
  ),
  "theatrum-mundi": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <ellipse cx="12" cy="13" rx="7" ry="8"/>
      <path d="M8.5 10.5c1-1 2-1 3 0"/>
      <path d="M12.5 10.5c1-1 2-1 3 0"/>
      <path d="M8 17c2-2 6-2 8 0"/>
    </svg>
  ),
  "omnia-vincit-amor": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 21s-8-5-8-11a4 4 0 0 1 8-1.5 4 4 0 0 1 8 1.5c0 6-8 11-8 11Z"/>
    </svg>
  ),
};

export function TopicIcon({ slug, className = "h-6 w-6" }: { slug: string; className?: string }) {
  const icon = ICONS[slug];
  if (!icon) return null;
  return <span className={`inline-flex shrink-0 ${className}`}>{icon}</span>;
}
