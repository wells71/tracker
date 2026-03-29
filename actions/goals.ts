'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function saveGoal(formData: FormData) {
  const supabase = await createClient()
  const id    = formData.get('id') as string
  const fields = {
    icon_key: (formData.get('icon_key') as string) || 'target',
    name:     (formData.get('name')     as string)?.trim(),
    sub:      (formData.get('sub')      as string)?.trim() || '',
    pct:      Math.min(100, Math.max(0, parseInt(formData.get('pct') as string) || 0)),
    color:    (formData.get('color')    as string) || 'var(--blue)',
  }
  if (!fields.name) return { error: 'Name required' }

  const { error } = id
    ? await supabase.from('goals').update(fields).eq('id', id)
    : await supabase.from('goals').insert({ ...fields, sort_order: 999 })

  if (error) return { error: error.message }
  revalidatePath('/goals')
  revalidatePath('/')
}

export async function deleteGoal(id: number) {
  const supabase = await createClient()
  const { error } = await supabase.from('goals').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/goals')
  revalidatePath('/')
}
