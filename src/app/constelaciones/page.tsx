import type { Metadata } from "next";
import { getConstellationsForMap } from "@/lib/queries";
import { ConstellationMap } from "@/components/constelaciones/ConstellationMap";
import { SectionHeader } from "@/components/layout/SectionHeader";

export const metadata: Metadata = {
  title: "Constelaciones",
  description: "Constelaciones temáticas que agrupan fragmentos de distintas obras y épocas en torno a un motivo literario común.",
};

export default async function ConstelacionesPage() {
  const constellations = await getConstellationsForMap();
  return (
    <div className="section-constelaciones flex flex-col" style={{ minHeight: "calc(100dvh - 97px)" }}>
      <div className="mx-auto w-full max-w-5xl px-6 pt-10">
        <SectionHeader
          href="/constelaciones"
          description="Hilos temáticos que atraviesan obras, autores y épocas distintas."
        />
      </div>
      <div className="flex-1">
        <ConstellationMap constellations={constellations} />
      </div>
    </div>
  );
}
