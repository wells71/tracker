'use client'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { toggleHabit, deleteHabit } from '@/actions/habits'
import type { Habit } from '@/types'

const DAY_LABELS = ['M','T','W','T','F','S','S','M','T','W','T','F','S','T']

export function HabitRow({ habit }: { habit: Habit }) {
  const [pending, startTransition] = useTransition()

  const handleDot = (i: number) => {
    startTransition(async () => {
      const res = await toggleHabit(habit.id, habit.pattern, i)
      if (res?.error) toast.error(res.error)
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteHabit(habit.id)
      if (res?.error) toast.error(res.error)
      else toast.success('Habit deleted')
    })
  }

  return (
    <div className={cn('flex items-center gap-3 py-1', pending && 'opacity-50')}>
      <span className="w-28 flex-shrink-0 text-[14px] text-muted-foreground truncate">
        {habit.name}
      </span>
      <div className="flex flex-1 gap-0.5">
        {habit.pattern.map((v, i) => (
          <button
            key={i}
            onClick={() => handleDot(i)}
            title={DAY_LABELS[i]}
            className={cn(
              'flex h-[22px] w-[22px] items-center justify-center rounded text-[9px] font-mono transition-all border',
              v === 1
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : i < habit.pattern.length - 1
                  ? 'bg-red-500/8 border-red-500/20 text-muted-foreground/40'
                  : 'border-border bg-card text-muted-foreground/40'
            )}
          >
            {DAY_LABELS[i]}
          </button>
        ))}
      </div>
      <span className="w-8 flex-shrink-0 text-right font-mono text-[15px] text-orange-400">
        {habit.streak}
      </span>
      <button onClick={handleDelete}
        className="text-muted-foreground/40 transition-colors hover:text-red-400">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-3">
          <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10"/>
        </svg>
      </button>
    </div>
  )
}