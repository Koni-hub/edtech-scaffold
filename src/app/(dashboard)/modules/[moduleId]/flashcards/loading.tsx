export default function FlashcardsLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8">
      <div className="flex items-center gap-1">
        <div className="h-3.5 w-3.5 animate-pulse rounded bg-muted" />
        <div className="h-3 w-12 animate-pulse rounded bg-muted" />
        <div className="h-3 w-3 animate-pulse rounded bg-muted" />
        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
      </div>

      <div className="flex items-center justify-between">
        <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
          <div className="h-8 w-28 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-12 animate-pulse rounded bg-muted" />
        </div>
      </div>

      <div className="rounded-xl border bg-card min-h-[300px] flex items-center justify-center">
        <div className="text-center space-y-3 p-8">
          <div className="h-3 w-16 mx-auto animate-pulse rounded bg-muted" />
          <div className="h-5 w-64 mx-auto animate-pulse rounded bg-muted" />
          <div className="h-3 w-24 mx-auto animate-pulse rounded bg-muted mt-6" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
        <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
        <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  )
}
