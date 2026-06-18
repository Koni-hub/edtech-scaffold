export default function UploadLoading() {
  return (
    <div className="mx-auto max-w-lg space-y-8 py-8">
      <div>
        <div className="h-8 w-36 animate-pulse rounded bg-muted mb-2" />
        <div className="h-4 w-48 animate-pulse rounded bg-muted" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border-2 border-dashed p-6 text-center space-y-3">
          <div className="mx-auto size-10 animate-pulse rounded bg-muted" />
          <div className="h-4 w-24 mx-auto animate-pulse rounded bg-muted" />
          <div className="h-3 w-16 mx-auto animate-pulse rounded bg-muted" />
        </div>
        <div className="rounded-xl border-2 border-dashed p-6 text-center space-y-3">
          <div className="mx-auto size-10 animate-pulse rounded bg-muted" />
          <div className="h-4 w-28 mx-auto animate-pulse rounded bg-muted" />
          <div className="h-3 w-20 mx-auto animate-pulse rounded bg-muted" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
      </div>

      <div className="h-px w-full bg-muted" />

      <div className="rounded-xl border bg-card p-4 space-y-3">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
        <div className="h-8 w-full animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  )
}
