import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20 text-center">
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent mb-4">
        página no encontrada
      </p>
      <h1
        className="font-display font-black text-ink leading-[0.9] tracking-tight mb-8"
        style={{ fontSize: "clamp(4rem, 12vw, 8rem)", letterSpacing: "-0.03em" }}
      >
        404
      </h1>
      <p className="font-serif italic text-ink-soft text-lg mb-10">
        Esta página no existe en la antología.
      </p>
      <Link
        href="/"
        className="inline-block border-2 border-ink px-6 py-2.5 text-sm font-medium text-ink hover:bg-ink hover:text-paper transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
