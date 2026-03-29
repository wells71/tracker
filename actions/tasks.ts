'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addTask(formData: FormData) {
  const supabase = await createClient()
  const title    = formData.get('title') as string
  const priority = formData.get('priority') as string
  const raw      = formData.get('due_date') as string
  if (!title?.trim()) return { error: 'Title required' }

  const due_date = raw
    ? new Date(raw + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'TBD'

  const { error } = await supabase.from('tasks')
    .insert({ title: title.trim(), priority, due_date, done: false, status: 'inprogress' })
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
}

export async function toggleTask(id: number, done: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from('tasks')
    .update({ done: !done, status: !done ? 'done' : 'inprogress' })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
}

export async function deleteTask(id: number) {
  const supabase = await createClient()
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
}
