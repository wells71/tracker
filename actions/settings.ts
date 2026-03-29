'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function saveSettings(formData: FormData) {
  const supabase = await createClient()
  const fields: Record<string, string> = {
    name:      (formData.get('name')      as string)?.trim(),
    initials:  (formData.get('initials')  as string)?.trim().toUpperCase().slice(0, 2),
    workspace: (formData.get('workspace') as string)?.trim(),
    plan:      (formData.get('plan')      as string)?.trim(),
  }
  const updates = Object.entries(fields)
    .filter(([, v]) => !!v)
    .map(([key, value]) =>
      supabase.from('user_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    )
  await Promise.all(updates)
  revalidatePath('/', 'layout')
}

export async function resetTable(table: string) {
  const allowed = ['tasks', 'notes', 'goals', 'habits', 'transactions']
  if (!allowed.includes(table)) return { error: 'Invalid table' }
  const supabase = await createClient()
  const { error } = await supabase.from(table).delete().neq('id', 0)
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
}
