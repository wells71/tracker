'use client'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { GoalModal } from '@/components/modals/goal-modal'
import { deleteGoal } from '@/actions/goals'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Goal } from '@/types'

export function GoalsClient({ goals }: { goals: Goal[] }) {
  const [editGoal, setEditGoal] = useState<Goal | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [pending, start]        = useTransition()

  const handleDelete = (id: number) => {
    if (!confirm('Delete this goal? This cannot be undone.')) return
    start(async () => {
      const res = await deleteGoal(id)
      if (res?.error) toast.error(res.error)
      else toast.success('Goal deleted')
    })
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold">Goals</h1>
          <p className="font-mono text-[15px] text-muted-foreground">{goals.length} active goals</p>
        </div>
        <GoalModal>
          <Button size="sm">
            <svg viewBox="0 0 12 12" fill="currentColor" className="mr-1.5 h-3 w-3"><path d="M6 1v10M1 6h10"/></svg>
            Add Goal
          </Button>
        </GoalModal>
      </div>

      <GoalModal
        goal={editGoal}
        open={editOpen}
        onOpenChange={o => { setEditOpen(o); if (!o) setEditGoal(null) }}
      />

      <Card>
        <CardContent className="divide-y divide-border p-0">
          {goals.length ? (
            goals.map(g => (
              <div key={g.id} className="flex items-center gap-4 px-4 py-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                    <circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="3"/>
                    <circle cx="8" cy="8" r="0.5" fill="currentColor"/>
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium">{g.name}</p>
                  <p className="font-mono text-[15px] text-muted-foreground">{g.sub}</p>
                  <div className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-accent">
                    <div className="h-full rounded-full transition-all" style={{ width: `${g.pct}%`, background: g.color }} />
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="font-mono text-[15px] font-semibold">{g.pct}%</p>
                  <div className="mt-1.5 flex justify-end gap-1">
                    <button
                      onClick={() => { setEditGoal(g); setEditOpen(true) }}
                      className="rounded border border-border p-1 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-2.5 w-2.5">
                        <path d="M11 2l3 3-8 8H3v-3l8-8z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(g.id)}
                      disabled={pending}
                      className="rounded border border-border p-1 text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
                    >
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-2.5 w-2.5">
                        <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="py-12 text-center font-mono text-sm text-muted-foreground">
              No goals yet — add your first one.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}