import { StatCardRowSkeleton, ListSkeleton } from "@/components/modules/page-skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 space-y-3">
        <div className="h-6 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-80 animate-pulse rounded bg-muted" />
        <div className="flex gap-3 pt-2">
          <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />
          <div className="h-8 w-36 animate-pulse rounded-md bg-muted" />
        </div>
      </div>

      <div>
        <div className="h-8 w-32 animate-pulse rounded bg-muted mb-2" />
        <div className="h-4 w-64 animate-pulse rounded bg-muted" />
      </div>

      <StatCardRowSkeleton />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-5 w-36 animate-pulse rounded bg-muted" />
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          </div>
          <ListSkeleton rows={6} />
        </div>
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-5 space-y-3">
            <div className="h-5 w-28 animate-pulse rounded bg-muted" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-10 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 animate-pulse rounded bg-muted" />
              <div className="h-3 w-12 animate-pulse rounded bg-muted" />
            </div>
            <ListSkeleton rows={3} />
          </div>
        </div>
      </div>
    </div>
  )
}

