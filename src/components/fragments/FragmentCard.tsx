import Image from "next/image";
import Link from "next/link";
import { excerpt } from "@/lib/text";
import type { FragmentCardData } from "@/lib/queries";

export function FragmentCard({ fragment }: { fragment: FragmentCardData }) {
  return (
    <article className="flex flex-col gap-3">
      {fragment.artworkImageUrl && (
        <Link
          href={`/fragmentos/${fragment.slug}`}
          className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg bg-paper-soft active:opacity-80 transition-opacity"
        >
          <Image
            src={fragment.artworkImageUrl}
            alt={fragment.artworkTitle ?? ""}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105 group-active:scale-[0.98]"
          />
        </Link>
      )}
      <Link
        href={`/fragmentos/${fragment.slug}`}
        className="font-display text-xl leading-snug italic text-ink hover:text-accent active:text-accent"
      >
        {fragment.headline}
      </Link>
      <p className="text-sm leading-relaxed text-ink-soft">{excerpt(fragment.text, 160)}</p>
      <p className="text-xs text-ink-soft">
        {fragment.title} — <em>{fragment.work.title}</em>, {fragment.work.author.name}
      </p>
    </article>
  );
}
