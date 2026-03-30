import { getDashboardData } from '@/lib/db'
import { StatCard } from '@/components/stat-card'
import { TaskItem } from '@/components/task-item'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AddTaskModal } from '@/components/modals/task-modal'
import { CalendarCard } from '@/components/calendar-card'
import Link from 'next/link'

export default async function DashboardPage() {
  const { tasks, goals, budget, habits, transactions, accounts } = await getDashboardData()

  const pending      = tasks.filter(t => !t.done).length
  const done         = tasks.filter(t => t.done).length
  const totalSavings = accounts.reduce((s, a) => s + Number(a.balance), 0)
  const spend        = transactions.filter(t => Number(t.amount) < 0).reduce((s, t) => s + Math.abs(Number(t.amount)), 0)
  const income       = transactions.filter(t => Number(t.amount) > 0).reduce((s, t) => s + Number(t.amount), 0)
  const savingsRate  = income > 0 ? Math.round(((income - spend) / income) * 100) : 0
  const maxStreak    = habits.reduce((m, h) => Math.max(m, h.streak ?? 0), 0)

  const previewTasks = [
    ...tasks.filter(t => t.status === 'inprogress'),
    ...tasks.filter(t => t.status === 'upcoming'),
  ].slice(0, 5)

  const now = new Date()

  return (
    <div>
      {/* Notice */}
      <div className="mb-5 flex items-start gap-2.5 rounded-md border border-blue-500/20 bg-blue-500/5 px-3.5 py-2.5 text-[14px] text-muted-foreground">
        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
        <span>
          You have <strong className="text-foreground">{pending} task{pending !== 1 ? 's' : ''}</strong> pending
          {goals[0] ? ` and your ${goals[0].name} goal is ${goals[0].pct}% complete` : ''}.
        </span>
      </div>

      {/* Stats — Net Worth replaced with Savings Rate */}
      <div className="mb-5 grid grid-cols-4 gap-3">
        <StatCard label="Total Savings"  value={`$${(totalSavings / 1000).toFixed(1)}k`} change="across all accounts"   trend="up"      dot="blue"   />
        <StatCard label="Tasks Done"     value={`${done}/${done + pending}`}               change={`${pending} remaining`} trend="neutral" dot="white"  />
        <StatCard label="Monthly Spend"  value={`$${spend.toFixed(0)}`}                   change="this month"             trend="down"    dot="red"    />
        <StatCard label="Habit Streak"   value={`${maxStreak}d`}                          change="↑ Personal best!"       trend="up"      dot="orange" />
      </div>

      {/* Tasks + Calendar */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <CardTitle className="text-[15px] font-medium">Today's Tasks</CardTitle>
            <Link href="/tasks" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
              View all →
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col gap-0.5">
              {previewTasks.length
                ? previewTasks.map(t => <TaskItem key={t.id} task={t} />)
                : <p className="py-4 text-center font-mono text-sm text-muted-foreground">All clear.</p>
              }
            </div>
            <AddTaskModal>
              <button className="mt-3 flex w-full items-center gap-2 rounded-md border border-dashed border-border px-2.5 py-2 text-[14px] text-muted-foreground transition-colors hover:border-border/80 hover:bg-accent hover:text-foreground">
                <svg viewBox="0 0 12 12" fill="currentColor" className="h-3 w-3"><path d="M6 1v10M1 6h10"/></svg>
                Add task
              </button>
            </AddTaskModal>
          </CardContent>
        </Card>

        {/* Interactive Calendar */}
        <CalendarCard tasks={tasks} />
      </div>

      {/* Donut + Goals */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <CardTitle className="text-[15px] font-medium">Spending by Category</CardTitle>
            <span className="font-mono text-[13px] text-muted-foreground">
              {now.toLocaleString('en-US', { month: 'long' })}
            </span>
          </CardHeader>
          <CardContent className="pt-0">
            {budget.length ? (
              <div className="flex items-center gap-6">
                <DonutSVG categories={budget} />
                <div className="flex flex-1 flex-col gap-1.5">
                  {budget.map(c => (
                    <div key={c.id} className="flex items-center gap-2">
                      <span className="h-2 w-2 flex-shrink-0 rounded-sm" style={{ background: c.color }} />
                      <span className="flex-1 text-[14px] text-muted-foreground">{c.name}</span>
                      <span className="font-mono text-[14px]">${Number(c.spent).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="py-4 text-center font-mono text-sm text-muted-foreground">No data.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <CardTitle className="text-[15px] font-medium">Goals</CardTitle>
            <Link href="/goals" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
              View all →
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col gap-3">
              {goals.slice(0, 4).map(g => (
                <div key={g.id}>
                  <div className="mb-1.5 flex justify-between">
                    <span className="text-[14px] text-muted-foreground">{g.name}</span>
                    <span className="font-mono text-[13px] text-muted-foreground">{g.pct}%</span>
                  </div>
                  <div className="h-[3px] overflow-hidden rounded-full bg-accent">
                    <div className="h-full rounded-full transition-all" style={{ width: `${g.pct}%`, background: g.color }} />
                  </div>
                </div>
              ))}
              {!goals.length && <p className="py-4 text-center font-mono text-sm text-muted-foreground">No goals yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DonutSVG({ categories }: { categories: Array<{ color: string; spent: number; name: string }> }) {
  const total = categories.reduce((s, c) => s + Number(c.spent), 0) || 1
  let offset = 25
  return (
    <svg viewBox="0 0 36 36" className="h-28 w-28 flex-shrink-0" style={{ transform: 'rotate(-90deg)' }}>
      <circle r="15.9" cx="18" cy="18" fill="none" stroke="hsl(var(--accent))" strokeWidth="3.5" />
      {categories.map((c, i) => {
        const pct  = (Number(c.spent) / total) * 100
        const dash = (pct / 100) * 100
        const el = (
          <circle key={i} r="15.9" cx="18" cy="18" fill="none"
            stroke={c.color} strokeWidth="3.5"
            strokeDasharray={`${dash.toFixed(1)} ${(100 - dash).toFixed(1)}`}
            strokeDashoffset={`-${offset.toFixed(1)}`}
          />
        )
        offset += dash
        return el
      })}
    </svg>
  )
}