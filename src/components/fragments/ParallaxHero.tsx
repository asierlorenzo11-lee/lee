"use client";
import { useEffect, useRef, type ReactNode } from "react";

export function ParallaxHero({
  imageUrl,
  imageAlt,
  children,
}: {
  imageUrl: string;
  imageAlt: string;
  children: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    function update() {
      const container = containerRef.current;
      const img = imgRef.current;
      if (!container || !img) return;

      const containerTop = container.getBoundingClientRect().top + window.scrollY;
      const offset = (window.scrollY - containerTop) * 0.3;
      img.style.transform = `translateY(${offset}px)`;
    }

    function onScroll() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-hidden" style={{ minHeight: "70vh" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={imageUrl}
        alt={imageAlt}
        className="era-card-img pointer-events-none select-none"
        style={{ willChange: "transform" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
