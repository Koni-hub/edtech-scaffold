export default function ModulesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-24 animate-pulse rounded bg-muted mb-2" />
          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="size-10 animate-pulse rounded-lg bg-muted" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
              <div className="h-5 w-12 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}
