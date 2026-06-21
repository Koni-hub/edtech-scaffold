import { StatCardRowSkeleton } from "@/components/modules/page-skeleton"

export default function AnalyticsLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-1">
        <div className="h-3.5 w-3.5 animate-pulse rounded bg-muted" />
        <div className="h-3 w-12 animate-pulse rounded bg-muted" />
        <div className="h-3 w-3 animate-pulse rounded bg-muted" />
        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
      </div>

      <div>
        <div className="h-8 w-24 animate-pulse rounded bg-muted mb-2" />
        <div className="h-4 w-52 animate-pulse rounded bg-muted" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-5 flex items-center gap-4">
            <div className="size-11 animate-pulse rounded-lg bg-muted" />
            <div className="space-y-2">
              <div className="h-7 w-12 animate-pulse rounded bg-muted" />
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 lg:col-span-2 space-y-4">
          <div className="h-5 w-28 animate-pulse rounded bg-muted" />
          <div className="h-[300px] w-full rounded-lg bg-muted/50 p-4">
            <div className="flex items-end justify-between h-full gap-2">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t animate-pulse bg-muted"
                    style={{ height: `${15 + Math.random() * 55}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="h-5 w-20 animate-pulse rounded bg-muted" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-3 w-full animate-pulse rounded bg-muted" />
            ))}
          </div>
          <div className="pt-2 border-t space-y-2">
            <div className="flex justify-between">
              <div className="h-3 w-24 animate-pulse rounded bg-muted" />
              <div className="h-3 w-10 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-1.5 w-full animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-2 w-full animate-pulse rounded-full bg-muted" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 space-y-3">
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
              <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
              <div className="h-6 w-12 animate-pulse rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

