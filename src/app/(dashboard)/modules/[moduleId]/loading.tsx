import { BreadcrumbSkeleton } from "@/components/shared/page-skeleton"

export default function ModuleDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <BreadcrumbSkeleton />
        <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 animate-pulse rounded-lg bg-muted" />
            <div className="space-y-2">
              <div className="h-6 w-48 animate-pulse rounded bg-muted" />
              <div className="flex items-center gap-2">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-4 flex gap-2">
          <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
          <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div className="flex gap-4 border-b pb-2">
          <div className="h-8 w-20 animate-pulse rounded bg-muted" />
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
          <div className="h-8 w-28 animate-pulse rounded bg-muted" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 w-full animate-pulse rounded bg-muted" style={{ width: `${80 - i * 10}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
