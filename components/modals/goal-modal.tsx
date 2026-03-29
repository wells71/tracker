'use client'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { saveGoal } from '@/actions/goals'
import type { Goal } from '@/types'

interface Props {
  children?: React.ReactNode
  goal?: Goal | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function GoalModal({ children, goal, open: controlledOpen, onOpenChange }: Props) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [iconKey, setIconKey] = useState(goal?.icon_key ?? 'target')
  const [color, setColor]     = useState(goal?.color    ?? 'var(--blue)')
  const [pending, start]      = useTransition()

  const isOpen    = controlledOpen ?? internalOpen
  const setIsOpen = onOpenChange   ?? setInternalOpen

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    if (goal?.id) fd.set('id', String(goal.id))
    fd.set('icon_key', iconKey)
    fd.set('color', color)
    start(async () => {
      const res = await saveGoal(fd)
      if (res?.error) { toast.error(res.error); return }
      toast.success(goal ? 'Goal updated' : 'Goal added')
      setIsOpen(false)
    })
  }

  return (
    <>
      {children && <span onClick={() => setIsOpen(true)}>{children}</span>}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{goal ? 'Edit Goal' : 'New Goal'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <Label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Goal Name</Label>
              <Input name="name" placeholder="e.g. Emergency Fund" defaultValue={goal?.name} autoFocus />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Description</Label>
              <Input name="sub" placeholder="e.g. $4,000 / $10,000 · Due Dec 2026" defaultValue={goal?.sub} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Progress (%)</Label>
              <Input name="pct" type="number" min={0} max={100} placeholder="0" defaultValue={goal?.pct ?? 0} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Icon</Label>
                <Select value={iconKey} onValueChange={setIconKey}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['target','wallet','travel','laptop','chart','run','bolt'].map(k => (
                      <SelectItem key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Colour</Label>
                <Select value={color} onValueChange={setColor}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[
                      { label: 'Blue',   value: 'var(--blue)'   },
                      { label: 'Green',  value: 'var(--green)'  },
                      { label: 'Orange', value: 'var(--orange)' },
                      { label: 'Purple', value: 'var(--purple)' },
                      { label: 'Red',    value: 'var(--red)'    },
                    ].map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save Goal'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
