"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { SidePanel } from "@/components/ui/SidePanel";
import { SearchBox } from "./SearchBox";
import { FACETS } from "@/lib/facets";

export function NavMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex items-center rounded-full p-2 text-ink hover:bg-paper-soft ${className ?? ""}`}
        aria-label="Abrir menú de navegación"
      >
        <Menu size={20} aria-hidden />
      </button>
      <SidePanel open={open} onOpenChange={setOpen} title="Menú" side="left">
        <div className="mb-6">
          <SearchBox />
        </div>
        <nav aria-label="Facetas">
          <ul className="space-y-1">
            {FACETS.map((f) => (
              <li key={f.href}>
                <Link
                  href={f.href}
                  onClick={() => setOpen(false)}
                  className="group relative flex items-center gap-3 overflow-hidden rounded-full px-3 py-2.5 transition-colors"
                >
                  <span
                    className={`pointer-events-none absolute left-1/2 top-1/2 aspect-square w-0 -translate-x-1/2 -translate-y-1/2 rounded-full ${f.fillBg} transition-[width] duration-300 ease-out group-hover:w-[200%]`}
                    aria-hidden
                  />
                  <span className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${f.chipBg} transition-colors duration-300 group-hover:bg-white/20`}>
                    <f.icon size={18} className={`${f.chipColor} transition-colors duration-300 group-hover:text-white`} aria-hidden />
                  </span>
                  <span className={`relative font-medium ${f.chipColor} transition-colors duration-300 group-hover:text-white`}>
                    {f.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </SidePanel>
    </>
  );
}
