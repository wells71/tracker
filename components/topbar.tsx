import { getTasks, getNotes, getGoals } from '@/lib/db'
import { Search } from '@/components/search'
import { ThemeToggle } from '@/components/theme-toggle'

export async function Topbar() {
  const [tasks, notes, goals] = await Promise.all([getTasks(), getNotes(), getGoals()])

  return (
    <header className="sticky top-0 z-40 flex h-[56px] flex-shrink-0 items-center gap-3 border-b border-border bg-background px-6">
      <div className="flex-1" />
      <Search tasks={tasks} notes={notes} goals={goals} />
      <ThemeToggle />
    </header>
  )
}