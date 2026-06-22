function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="aspect-[4/3] w-full rounded-lg bg-paper-soft" />
      <div className="h-6 w-3/4 rounded bg-paper-soft" />
      <div className="space-y-1.5">
        <div className="h-3.5 w-full rounded bg-paper-soft" />
        <div className="h-3.5 w-5/6 rounded bg-paper-soft" />
        <div className="h-3.5 w-4/6 rounded bg-paper-soft" />
      </div>
      <div className="h-3 w-2/5 rounded bg-paper-soft" />
    </div>
  );
}

export default function FragmentosLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Header skeleton */}
      <div className="border-b-2 border-accent pb-8 mb-10 animate-pulse">
        <div className="h-3 w-32 rounded bg-paper-soft mb-3" />
        <div className="h-20 w-64 rounded bg-paper-soft" />
      </div>

      {/* Filters skeleton */}
      <div className="flex flex-wrap gap-2 mb-8 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 w-24 rounded bg-paper-soft" />
        ))}
      </div>

      {/* Count skeleton */}
      <div className="mt-6 h-4 w-32 rounded bg-paper-soft animate-pulse mb-4" />

      {/* Cards grid */}
      <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
