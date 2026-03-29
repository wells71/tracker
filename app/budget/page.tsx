import { getBudgetCategories } from '@/lib/db'
import { StatCard } from '@/components/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function BudgetPage() {
  const categories = await getBudgetCategories()
  const spent  = categories.reduce((s, c) => s + Number(c.spent),        0)
  const limit  = categories.reduce((s, c) => s + Number(c.budget_limit), 0)
  const over   = categories.filter(c => Number(c.spent) > Number(c.budget_limit)).length

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-sm font-semibold">Budget</h1>
        <p className="font-mono text-[11.5px] text-muted-foreground">
          ${spent.toLocaleString()} of ${limit.toLocaleString()} used
          {over > 0 ? ` · ${over} over limit` : ''}
        </p>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-3">
        <StatCard label="Total Spent" value={`$${spent.toLocaleString()}`}               change={`of $${limit.toLocaleString()} budget`} trend="down"                          dot="red"   />
        <StatCard label="Remaining"   value={`$${Math.max(0, limit - spent).toLocaleString()}`} change="left this month"                trend="up"                            dot="green" />
        <StatCard label="Over Limit"  value={over}                                        change={over ? 'categories over limit' : 'All on track'} trend={over ? 'down' : 'up'} dot={over ? 'red' : 'green'} />
      </div>

      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-[12.5px] font-medium">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pt-0">
          {categories.map((c, i) => {
            const pct  = Math.round((Number(c.spent) / Number(c.budget_limit)) * 100)
            const cap  = Math.min(pct, 100)
            const isOver = pct > 100
            return (
              <div key={c.id} className={i === categories.length - 1 ? '' : ''}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[12.5px] text-muted-foreground">
                    {c.name}
                    <span className="ml-2 font-mono text-[11px] text-muted-foreground/60">
                      ${Number(c.spent).toLocaleString()} / ${Number(c.budget_limit).toLocaleString()}
                    </span>
                  </span>
                  <span className={`font-mono text-[11.5px] ${isOver ? 'text-red-400' : 'text-muted-foreground'}`}>
                    {pct}%
                  </span>
                </div>
                <div className="h-[3px] overflow-hidden rounded-full bg-accent">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${cap}%`, background: isOver ? 'var(--destructive, #ef4444)' : c.color }}
                  />
                </div>
              </div>
            )
          })}
          {!categories.length && (
            <p className="py-8 text-center font-mono text-xs text-muted-foreground">No budget data.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
