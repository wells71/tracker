export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Page header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="mb-2 h-5 w-24 rounded bg-accent" />
          <div className="h-3 w-40 rounded bg-accent" />
        </div>
        <div className="h-9 w-28 rounded-md bg-accent" />
      </div>

      {/* Stat row */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-5">
            <div className="mb-3 h-3 w-20 rounded bg-accent" />
            <div className="mb-2 h-8 w-24 rounded bg-accent" />
            <div className="h-3 w-16 rounded bg-accent" />
          </div>
        ))}
      </div>

      {/* Main card */}
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <div className="h-4 w-32 rounded bg-accent" />
        </div>
        <div className="p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="mb-3 flex items-center gap-3">
              <div className="h-4 w-4 rounded bg-accent" />
              <div className="h-4 flex-1 rounded bg-accent" />
              <div className="h-4 w-16 rounded bg-accent" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}