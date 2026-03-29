'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addTransaction(formData: FormData) {
  const supabase  = await createClient()
  const name      = (formData.get('name') as string)?.trim()
  const category  = (formData.get('category') as string)?.trim() || 'Other'
  const rawAmount = parseFloat(formData.get('amount') as string)
  const type      = formData.get('type') as string
  const icon_key  = (formData.get('icon_key') as string) || 'wallet'
  const txn_date  = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  if (!name || isNaN(rawAmount)) return { error: 'Name and amount required' }
  const amount = type === 'expense' ? -Math.abs(rawAmount) : Math.abs(rawAmount)

  const { error } = await supabase.from('transactions')
    .insert({ icon_key, name, category, amount, txn_date })
  if (error) return { error: error.message }
  revalidatePath('/finance')
  revalidatePath('/')
}

export async function deleteTransaction(id: number) {
  const supabase = await createClient()
  const { error } = await supabase.from('transactions').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/finance')
  revalidatePath('/')
}
