"use client";
import { useReadingSettings } from "@/components/reading-settings/ReadingSettingsProvider";

export function FragmentReaderLayout({
  text,
  aside,
}: {
  text: React.ReactNode;
  aside: React.ReactNode;
}) {
  const { layers } = useReadingSettings();
  const anyActive = Object.values(layers).some(Boolean);

  if (anyActive) {
    return (
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_272px] lg:gap-16 lg:items-start">
        <div>{text}</div>
        <aside className="mt-10 lg:mt-0 flex flex-col gap-5 lg:sticky lg:top-8">
          {aside}
        </aside>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[600px]">
      {text}
    </div>
  );
}
