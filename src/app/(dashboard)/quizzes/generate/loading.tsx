export default function QuizGenerateLoading() {
  return (
    <div className="mx-auto max-w-lg space-y-8 py-8">
      <div>
        <div className="h-8 w-36 animate-pulse rounded bg-muted mb-2" />
        <div className="h-4 w-56 animate-pulse rounded bg-muted" />
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-6">
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-28 animate-pulse rounded bg-muted" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  )
}
