'use client'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { addTask } from '@/actions/tasks'

export function AddTaskModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen]       = useState(false)
  const [priority, setPriority] = useState('med')
  const [pending, start]      = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set('priority', priority)
    start(async () => {
      const res = await addTask(fd)
      if (res?.error) { toast.error(res.error); return }
      toast.success('Task added')
      setOpen(false)
    })
  }

  return (
    <>
      <span onClick={() => setOpen(true)}>{children}</span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title" className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Title</Label>
              <Input id="title" name="title" placeholder="What needs to be done?" autoFocus />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="med">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="due_date" className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Due Date</Label>
              <Input id="due_date" name="due_date" type="date"
                defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={pending}>{pending ? 'Adding…' : 'Add Task'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
