'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function saveNote(formData: FormData) {
  const supabase = await createClient()
  const id    = formData.get('id') as string
  const title = (formData.get('title') as string)?.trim() || 'Untitled'
  const body  = (formData.get('body') as string)?.trim() || ''

  const { error } = id
    ? await supabase.from('notes').update({ title, body, updated_at: new Date().toISOString() }).eq('id', id)
    : await supabase.from('notes').insert({ title, body })

  if (error) return { error: error.message }
  revalidatePath('/notes')
}

export async function deleteNote(id: number) {
  const supabase = await createClient()
  const { error } = await supabase.from('notes').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/notes')
}
