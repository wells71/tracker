'use server'
import { revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function toggleHabit(id: number, pattern: number[], dayIndex: number) {
  const supabase   = await createClient()
  const newPattern = [...pattern]
  newPattern[dayIndex] = newPattern[dayIndex] === 1 ? 0 : 1
  let streak = 0
  for (let i = newPattern.length - 1; i >= 0; i--) {
    if (newPattern[i] === 1) streak++; else break
  }
  const { error } = await supabase.from('habits').update({ pattern: newPattern, streak }).eq('id', id)
  if (error) return { error: error.message }
  revalidateTag('habits')
}

export async function addHabit(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  if (!name?.trim()) return { error: 'Name required' }
  const { error } = await supabase.from('habits')
    .insert({ name: name.trim(), streak: 0, pattern: new Array(14).fill(0), sort_order: 999 })
  if (error) return { error: error.message }
  revalidateTag('habits')
}

export async function deleteHabit(id: number) {
  const supabase = await createClient()
  const { error } = await supabase.from('habits').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidateTag('habits')
}

/* ── AUTO-ADVANCE ──────────────────────────────────────────
   Call this on habits page load. Shifts the pattern forward
   by the number of days since last_advanced, filling missed
   days with 0s. Stores last_advanced date in user_settings.
   ──────────────────────────────────────────────────────── */
export async function autoAdvanceHabits() {
  const supabase = await createClient()

  /* Get last advanced date */
  const { data: setting } = await supabase
    .from('user_settings').select('value').eq('key', 'habits_last_advanced').single()

  const lastDate = setting?.value ? new Date(setting.value) : null
  const today    = new Date()
  today.setHours(0,0,0,0)

  if (lastDate) {
    lastDate.setHours(0,0,0,0)
    if (lastDate.getTime() === today.getTime()) return /* Already advanced today */
  }

  const daysDiff = lastDate
    ? Math.floor((today.getTime() - lastDate.getTime()) / 86400000)
    : 0

  if (daysDiff > 0) {
    const { data: habits } = await supabase.from('habits').select('id, pattern, streak')
    if (habits) {
      for (const h of habits) {
        const pattern: number[] = h.pattern ?? []
        /* Shift left by daysDiff, fill new days with 0 */
        const shifted = [...pattern.slice(daysDiff), ...new Array(Math.min(daysDiff, pattern.length)).fill(0)]
        let streak = 0
        for (let i = shifted.length - 1; i >= 0; i--) {
          if (shifted[i] === 1) streak++; else break
        }
        await supabase.from('habits').update({ pattern: shifted, streak }).eq('id', h.id)
      }
    }
  }

  /* Save today as last advanced */
  await supabase.from('user_settings')
    .upsert({ key: 'habits_last_advanced', value: today.toISOString() }, { onConflict: 'key' })

  revalidateTag('habits')
}