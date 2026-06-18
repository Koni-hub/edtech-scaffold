export default function QuizDetailLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8">
      <div className="flex items-center justify-between">
        <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
              <div className="size-6 shrink-0 animate-pulse rounded-full bg-muted" />
              <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
        <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  )
}
