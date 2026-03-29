'use client'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addHabit } from '@/actions/habits'

export function AddHabitModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen]  = useState(false)
  const [pending, start] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    start(async () => {
      const res = await addHabit(new FormData(e.currentTarget))
      if (res?.error) { toast.error(res.error); return }
      toast.success('Habit added')
      setOpen(false)
    })
  }

  return (
    <>
      <span onClick={() => setOpen(true)}>{children}</span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Add Habit</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name" className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Habit Name</Label>
              <Input id="name" name="name" placeholder="e.g. Morning Run" autoFocus />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={pending}>{pending ? 'Adding…' : 'Add Habit'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
