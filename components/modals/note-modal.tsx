'use client'
import { useState, useTransition, useEffect } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { saveNote } from '@/actions/notes'
import type { Note } from '@/types'

interface Props {
  children?: React.ReactNode
  note?: Note | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function NoteModal({ children, note, open: controlledOpen, onOpenChange }: Props) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [pending, start] = useTransition()

  const isOpen   = controlledOpen ?? internalOpen
  const setIsOpen = onOpenChange ?? setInternalOpen

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    if (note?.id) fd.set('id', String(note.id))
    start(async () => {
      const res = await saveNote(fd)
      if (res?.error) { toast.error(res.error); return }
      toast.success(note ? 'Note updated' : 'Note saved')
      setIsOpen(false)
    })
  }

  return (
    <>
      {children && <span onClick={() => setIsOpen(true)}>{children}</span>}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{note ? 'Edit Note' : 'New Note'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title" className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Title</Label>
              <Input id="title" name="title" placeholder="Note title" defaultValue={note?.title} autoFocus />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="body" className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Content</Label>
              <Textarea id="body" name="body" placeholder="Write anything…" rows={6} defaultValue={note?.body} />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save Note'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
