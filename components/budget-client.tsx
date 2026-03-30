'use client'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { updateBudgetSpent } from '@/actions/finance'
import type { BudgetCategory } from '@/types'

export function BudgetClient({ categories }: { categories: BudgetCategory[] }) {
  const [editing, setEditing] = useState<number | null>(null)
  const [editVal, setEditVal] = useState('')
  const [pending, start]      = useTransition()

  const handleEdit = (c: BudgetCategory) => {
    setEditing(c.id)
    setEditVal(String(Number(c.spent)))
  }

  const handleSave = (id: number) => {
    const val = parseFloat(editVal)
    if (isNaN(val) || val < 0) { toast.error('Invalid amount'); return }
    start(async () => {
      const res = await updateBudgetSpent(id, val)
      if (res?.error) toast.error(res.error)
      else toast.success('Updated')
      setEditing(null)
    })
  }

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-[15px] font-medium">Category Breakdown</CardTitle>
        <p className="text-[13px] text-muted-foreground">Click a spent amount to edit it</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 pt-0">
        {categories.map(c => {
          const pct    = Math.round((Number(c.spent) / Number(c.budget_limit)) * 100)
          const cap    = Math.min(pct, 100)
          const isOver = pct > 100

          return (
            <div key={c.id}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-[14px] text-muted-foreground">{c.name}</span>
                <div className="flex items-center gap-2">
                  {/* Editable spent */}
                  {editing === c.id ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] text-muted-foreground">$</span>
                      <input
                        autoFocus
                        value={editVal}
                        onChange={e => setEditVal(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleSave(c.id); if (e.key === 'Escape') setEditing(null) }}
                        className="w-20 rounded border border-border bg-card px-2 py-0.5 font-mono text-[13px] outline-none focus:border-muted-foreground"
                      />
                      <button onClick={() => handleSave(c.id)} disabled={pending}
                        className="rounded bg-foreground px-2 py-0.5 font-mono text-[11px] text-background">
                        save
                      </button>
                      <button onClick={() => setEditing(null)}
                        className="font-mono text-[11px] text-muted-foreground hover:text-foreground">
                        cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(c)}
                      className="group flex items-center gap-1.5 font-mono text-[13px] text-muted-foreground hover:text-foreground"
                      title="Click to edit"
                    >
                      <span className={isOver ? 'text-red-400' : ''}>
                        ${Number(c.spent).toLocaleString()}
                      </span>
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                        className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity">
                        <path d="M11 2l3 3-8 8H3v-3l8-8z"/>
                      </svg>
                    </button>
                  )}
                  <span className="text-[13px] text-muted-foreground/50">
                    / ${Number(c.budget_limit).toLocaleString()}
                  </span>
                  <span className={`w-10 text-right font-mono text-[13px] ${isOver ? 'text-red-400' : 'text-muted-foreground'}`}>
                    {pct}%
                  </span>
                </div>
              </div>
              <div className="h-[4px] overflow-hidden rounded-full bg-accent">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${cap}%`, background: isOver ? '#ef4444' : c.color }} />
              </div>
            </div>
          )
        })}
        {!categories.length && (
          <p className="py-8 text-center font-mono text-sm text-muted-foreground">No budget categories.</p>
        )}
      </CardContent>
    </Card>
  )
}