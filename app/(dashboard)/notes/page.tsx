import { getNotes } from '@/lib/db'
import { NotesClient } from '@/components/notes-client'

export default async function NotesPage() {
  const notes = await getNotes()
  return <NotesClient notes={notes} />
}