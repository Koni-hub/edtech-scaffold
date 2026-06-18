export default function SettingsLoading() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <div className="h-8 w-24 animate-pulse rounded bg-muted mb-2" />
        <div className="h-4 w-48 animate-pulse rounded bg-muted" />
      </div>

      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card">
          <div className="p-6 space-y-4">
            <div className="space-y-1.5">
              <div className="h-5 w-24 animate-pulse rounded bg-muted" />
              <div className="h-3 w-48 animate-pulse rounded bg-muted" />
            </div>
            <div className="space-y-3">
              {i === 0 && (
                <>
                  <div className="space-y-1.5">
                    <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                    <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                      <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                      <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
                    </div>
                  </div>
                </>
              )}
              {i === 1 && (
                <div className="space-y-1.5">
                  <div className="h-3 w-28 animate-pulse rounded bg-muted" />
                  <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
                </div>
              )}
              {i === 2 && (
                <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
              )}
              {i === 3 && (
                <div className="h-9 w-44 animate-pulse rounded-md bg-muted" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
