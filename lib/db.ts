import { createClient } from './supabase/server'
import { unstable_cache } from 'next/cache'
import type {
  Task, Habit, Note, Goal, Account,
  Transaction, BudgetCategory, SpendHistory, UserSettings
} from '@/types'

/* ── CACHE HELPER ──────────────────────────────────────────
   The Supabase client (which calls cookies()) must be created
   OUTSIDE the cache boundary. We pass the query as a plain
   async function that receives the already-created client.
   ──────────────────────────────────────────────────────── */
function cache<T>(
  fetcher: () => Promise<T>,
  keys: string[],
  tags: string[]
) {
  return unstable_cache(fetcher, keys, { revalidate: 30, tags })()
}

/* ── SETTINGS ── */
export async function getSettings(): Promise<UserSettings> {
  const supabase = await createClient()
  return cache(async () => {
    const { data } = await supabase.from('user_settings').select('key, value')
    const map = Object.fromEntries((data ?? []).map((r: any) => [r.key, r.value]))
    return {
      name:      map.name      ?? 'Your Name',
      initials:  map.initials  ?? 'YN',
      plan:      map.plan      ?? 'Personal',
      workspace: map.workspace ?? 'Tracker',
    }
  }, ['settings'], ['settings'])
}

/* ── TASKS ── */
export async function getTasks(): Promise<Task[]> {
  const supabase = await createClient()
  return cache(async () => {
    const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false })
    return (data ?? []) as Task[]
  }, ['tasks'], ['tasks'])
}

/* ── HABITS ── */
export async function getHabits(): Promise<Habit[]> {
  const supabase = await createClient()
  return cache(async () => {
    const { data } = await supabase.from('habits').select('*').order('sort_order')
    return (data ?? []) as Habit[]
  }, ['habits'], ['habits'])
}

/* ── NOTES ── */
export async function getNotes(): Promise<Note[]> {
  const supabase = await createClient()
  return cache(async () => {
    const { data } = await supabase.from('notes').select('*').order('updated_at', { ascending: false })
    return (data ?? []) as Note[]
  }, ['notes'], ['notes'])
}

/* ── GOALS ── */
export async function getGoals(): Promise<Goal[]> {
  const supabase = await createClient()
  return cache(async () => {
    const { data } = await supabase.from('goals').select('*').order('sort_order')
    return (data ?? []) as Goal[]
  }, ['goals'], ['goals'])
}

/* ── ACCOUNTS ── */
export async function getAccounts(): Promise<Account[]> {
  const supabase = await createClient()
  return cache(async () => {
    const { data } = await supabase.from('accounts').select('*').order('sort_order')
    return (data ?? []) as Account[]
  }, ['accounts'], ['accounts'])
}

/* ── TRANSACTIONS ── */
export async function getTransactions(): Promise<Transaction[]> {
  const supabase = await createClient()
  return cache(async () => {
    const { data } = await supabase.from('transactions').select('*').order('created_at', { ascending: false })
    return (data ?? []) as Transaction[]
  }, ['transactions'], ['transactions'])
}

/* ── SPEND HISTORY ── */
export async function getSpendHistory(): Promise<SpendHistory[]> {
  const supabase = await createClient()
  return cache(async () => {
    const { data } = await supabase.from('spend_history').select('*').order('sort_order')
    return (data ?? []) as SpendHistory[]
  }, ['spend_history'], ['spend_history'])
}

/* ── BUDGET ── */
export async function getBudgetCategories(): Promise<BudgetCategory[]> {
  const supabase = await createClient()
  return cache(async () => {
    const { data } = await supabase.from('budget_categories').select('*').order('sort_order')
    return (data ?? []) as BudgetCategory[]
  }, ['budget'], ['budget'])
}

/* ── DASHBOARD (parallel fetch) ── */
export async function getDashboardData() {
  const [settings, tasks, goals, budget, habits, transactions, accounts] = await Promise.all([
    getSettings(),
    getTasks(),
    getGoals(),
    getBudgetCategories(),
    getHabits(),
    getTransactions(),
    getAccounts(),
  ])
  return { settings, tasks, goals, budget, habits, transactions, accounts }
}