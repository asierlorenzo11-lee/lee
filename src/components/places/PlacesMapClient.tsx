"use client";

import dynamic from "next/dynamic";
import type { getAllPlaces } from "@/lib/queries";

const PlacesMap = dynamic(() => import("./PlacesMap").then((mod) => mod.PlacesMap), {
  ssr: false,
});

export function PlacesMapClient({ places }: { places: Awaited<ReturnType<typeof getAllPlaces>> }) {
  return <PlacesMap places={places} />;
}
