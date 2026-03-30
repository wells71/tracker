export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Notice bar */}
      <div className="mb-5 h-10 rounded-md bg-accent" />

      {/* Stat cards */}
      <div className="mb-5 grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-5">
            <div className="mb-3 h-3 w-24 rounded bg-accent" />
            <div className="mb-2 h-8 w-32 rounded bg-accent" />
            <div className="h-3 w-20 rounded bg-accent" />
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        <div className="col-span-2 rounded-lg border border-border bg-card p-5">
          <div className="mb-4 h-4 w-28 rounded bg-accent" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="mb-2 h-9 rounded-md bg-accent" />
          ))}
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="mb-4 h-4 w-24 rounded bg-accent" />
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="aspect-square rounded bg-accent" />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-5">
            <div className="mb-4 h-4 w-32 rounded bg-accent" />
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="mb-3 h-5 rounded bg-accent" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}