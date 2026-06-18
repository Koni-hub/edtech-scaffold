export default function QuizResultsLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 py-8">
      <div className="flex items-center justify-between">
        <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
      </div>

      <div className="rounded-xl border bg-card p-8 text-center space-y-4">
        <div className="mx-auto size-24 animate-pulse rounded-full bg-muted" />
        <div className="h-6 w-32 mx-auto animate-pulse rounded bg-muted" />
        <div className="h-4 w-48 mx-auto animate-pulse rounded bg-muted" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 space-y-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            <div className="flex gap-2">
              <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
