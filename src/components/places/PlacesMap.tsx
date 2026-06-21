"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Link from "next/link";
import type { getAllPlaces } from "@/lib/queries";

const placeIcon = L.divIcon({
  className: "place-marker",
  iconSize: [14, 14],
});

export function PlacesMap({ places }: { places: Awaited<ReturnType<typeof getAllPlaces>> }) {
  return (
    <MapContainer
      center={[40, -4]}
      zoom={6}
      scrollWheelZoom={false}
      className="h-[420px] w-full rounded-lg border border-line"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {places.map((place) => (
        <Marker key={place.id} position={[place.lat, place.lng]} icon={placeIcon}>
          <Popup>
            <p className="font-display text-base font-bold italic">{place.name}</p>
            {place.description && <p className="mt-1 text-sm">{place.description}</p>}
            {place.fragments.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm">
                {place.fragments.map((fragment) => (
                  <li key={fragment.id}>
                    <Link href={`/fragmentos/${fragment.slug}`} className="text-accent hover:underline">
                      {fragment.headline}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
