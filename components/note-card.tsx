'use client'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { deleteNote } from '@/actions/notes'
import type { Note } from '@/types'

export function NoteCard({ note, onEdit }: { note: Note; onEdit: (note: Note) => void }) {
  const [pending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteNote(note.id)
      if (res?.error) toast.error(res.error)
      else toast.success('Note deleted')
    })
  }

  return (
    <Card className="group mb-2 cursor-pointer transition-colors hover:border-border/80">
      <CardContent className="relative p-3.5">
        <div className="absolute right-2 top-2 hidden gap-1 group-hover:flex">
          <button onClick={() => onEdit(note)}
            className="rounded border border-border bg-card p-1 text-muted-foreground transition-colors hover:text-foreground">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-2.5 w-2.5">
              <path d="M11 2l3 3-8 8H3v-3l8-8z"/>
            </svg>
          </button>
          <button onClick={handleDelete}
            className="rounded border border-border bg-card p-1 text-muted-foreground transition-colors hover:border-red-500/40 hover:text-red-400">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-2.5 w-2.5">
              <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10"/>
            </svg>
          </button>
        </div>
        <p className="mb-1 text-[15px] font-medium">{note.title}</p>
        <p className="mb-2 line-clamp-2 text-[15px] text-muted-foreground">{note.body}</p>
        <p className="font-mono text-[15px] text-muted-foreground/60">
          {new Date(note.updated_at ?? note.created_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          })}
        </p>
      </CardContent>
    </Card>
  )
}