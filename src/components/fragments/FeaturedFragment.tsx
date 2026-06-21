import Image from "next/image";
import Link from "next/link";
import { excerpt } from "@/lib/text";
import { MetaBadges } from "./MetaBadges";
import type { FragmentCardData } from "@/lib/queries";

/** Héroe a sangre completa para el fragmento destacado de la portada. */
export function FeaturedFragment({ fragment }: { fragment: FragmentCardData }) {
  if (!fragment.artworkImageUrl) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12">
        <Link href={`/fragmentos/${fragment.slug}`} className="group block">
          <p className="mb-3 text-sm tracking-wide text-ink-soft uppercase">
            Fragmento destacado
          </p>
          <h2 className="font-display text-3xl font-bold italic leading-tight text-ink group-hover:text-accent sm:text-5xl">
            {fragment.headline}
          </h2>
          <p className="mt-4 leading-relaxed text-ink-soft">{excerpt(fragment.text, 220)}</p>
          <p className="mt-2 text-sm text-ink-soft">
            {fragment.title} — <em>{fragment.work.title}</em>, {fragment.work.author.name}
          </p>
          <div className="mt-4">
            <MetaBadges fragment={fragment} variant="default" disableLinks />
          </div>
        </Link>
      </section>
    );
  }

  return (
    <section className="relative">
      <Link href={`/fragmentos/${fragment.slug}`} className="group block active:opacity-90 transition-opacity">
        <div className="relative isolate flex min-h-[60vh] items-end overflow-hidden sm:min-h-[70vh]">
          <Image
            src={fragment.artworkImageUrl}
            alt={fragment.artworkTitle ?? ""}
            fill
            priority
            sizes="100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-10 sm:py-16">
            <p className="mb-3 text-sm tracking-widest text-white/80 uppercase">
              Fragmento destacado
            </p>
            <h2 className="font-display text-3xl font-bold italic leading-tight text-white sm:text-5xl">
              {fragment.headline}
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-white/90">
              {excerpt(fragment.text, 220)}
            </p>
            <p className="mt-2 text-sm text-white/80">
              {fragment.title} — <em>{fragment.work.title}</em>, {fragment.work.author.name}
            </p>
            <div className="mt-5">
              <MetaBadges fragment={fragment} variant="onDark" disableLinks />
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
