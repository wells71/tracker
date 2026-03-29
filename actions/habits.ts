'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function toggleHabit(id: number, pattern: number[], dayIndex: number) {
  const supabase  = await createClient()
  const newPattern = [...pattern]
  newPattern[dayIndex] = newPattern[dayIndex] === 1 ? 0 : 1
  let streak = 0
  for (let i = newPattern.length - 1; i >= 0; i--) {
    if (newPattern[i] === 1) streak++; else break
  }
  const { error } = await supabase.from('habits')
    .update({ pattern: newPattern, streak }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/habits')
}

export async function addHabit(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  if (!name?.trim()) return { error: 'Name required' }
  const { error } = await supabase.from('habits')
    .insert({ name: name.trim(), streak: 0, pattern: new Array(14).fill(0), sort_order: 999 })
  if (error) return { error: error.message }
  revalidatePath('/habits')
}

export async function deleteHabit(id: number) {
  const supabase = await createClient()
  const { error } = await supabase.from('habits').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/habits')
}
