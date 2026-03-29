import { getHabits } from '@/lib/db'
import { HabitRow } from '@/components/habit-row'
import { AddHabitModal } from '@/components/modals/habit-modal'
import { StatCard } from '@/components/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function HabitsPage() {
  const habits = await getHabits()
  const maxStreak = habits.reduce((m, h) => Math.max(m, h.streak ?? 0), 0)
  const weekDone  = habits.reduce((s, h) => s + (h.pattern ?? []).slice(-7).filter(v => v === 1).length, 0)
  const weekPct   = habits.length ? Math.round((weekDone / (habits.length * 7)) * 100) : 0

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold">Habit Tracker</h1>
          <p className="font-mono text-[11.5px] text-muted-foreground">Last 14 days · tap any dot to toggle</p>
        </div>
        <AddHabitModal>
          <Button size="sm">
            <svg viewBox="0 0 12 12" fill="currentColor" className="mr-1.5 h-3 w-3"><path d="M6 1v10M1 6h10"/></svg>
            Add Habit
          </Button>
        </AddHabitModal>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-3">
        <StatCard label="Best Streak"   value={`${maxStreak}d`}       change="↑ Personal best"   trend="up"      dot="orange" />
        <StatCard label="This Week"     value={`${weekPct}%`}          change="↑ vs last week"    trend="up"      dot="green"  />
        <StatCard label="Active Habits" value={habits.length}          change="habits tracked"    trend="neutral" dot="blue"   />
      </div>

      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-[12.5px] font-medium">Daily Habits</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {habits.length
            ? <div className="flex flex-col divide-y divide-border">
                {habits.map(h => <div key={h.id} className="py-1.5"><HabitRow habit={h} /></div>)}
              </div>
            : <p className="py-8 text-center font-mono text-xs text-muted-foreground">No habits yet — add your first one.</p>
          }
        </CardContent>
      </Card>
    </div>
  )
}
