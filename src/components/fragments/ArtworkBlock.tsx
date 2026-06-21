import Image from "next/image";
import type { FragmentDetail } from "@/lib/queries";

export function ArtworkBlock({ fragment }: { fragment: FragmentDetail }) {
  if (!fragment.artworkImageUrl) return null;

  return (
    <figure className="rounded-lg border border-line bg-paper-soft p-4">
      <p className="mb-3 text-xs font-semibold tracking-wide text-ink-soft uppercase">
        Cuadro recomendado
      </p>
      <Image
        src={fragment.artworkImageUrl}
        alt={fragment.artworkTitle ?? ""}
        width={800}
        height={500}
        className="h-auto w-full rounded"
      />
      <figcaption className="mt-2 text-sm text-ink-soft">
        {fragment.artworkTitle && <span className="italic">{fragment.artworkTitle}</span>}
        {fragment.artworkAuthor && `, ${fragment.artworkAuthor}`}
        {fragment.artworkCaption && <span className="mt-1 block">{fragment.artworkCaption}</span>}
      </figcaption>
    </figure>
  );
}
