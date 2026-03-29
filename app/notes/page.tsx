'use client'
import { useState } from 'react'
import { NoteCard } from '@/components/note-card'
import { NoteModal } from '@/components/modals/note-modal'
import { Button } from '@/components/ui/button'
import { getNotes } from '@/lib/db'
import type { Note } from '@/types'

export default async function NotesPage() {
  const notes = await getNotes()
  return <NotesClient notes={notes} />
}

function NotesClient({ notes }: { notes: Note[] }) {
  const [editNote, setEditNote] = useState<Note | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  const cols: Note[][] = [[], [], []]
  notes.forEach((n, i) => cols[i % 3].push(n))

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold">Notes</h1>
          <p className="font-mono text-[11.5px] text-muted-foreground">{notes.length} notes</p>
        </div>
        <NoteModal>
          <Button size="sm">
            <svg viewBox="0 0 12 12" fill="currentColor" className="mr-1.5 h-3 w-3"><path d="M6 1v10M1 6h10"/></svg>
            New Note
          </Button>
        </NoteModal>
      </div>

      <NoteModal
        note={editNote}
        open={editOpen}
        onOpenChange={o => { setEditOpen(o); if (!o) setEditNote(null) }}
      />

      {notes.length ? (
        <div className="grid grid-cols-3 items-start gap-3">
          {cols.map((col, ci) => (
            <div key={ci} className="flex flex-col">
              {col.map(n => (
                <NoteCard key={n.id} note={n} onEdit={n => { setEditNote(n); setEditOpen(true) }} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p className="py-16 text-center font-mono text-xs text-muted-foreground">No notes yet — create your first one.</p>
      )}
    </div>
  )
}
