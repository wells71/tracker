import { createClient } from './supabase/server'
import type {
  Task, Habit, Note, Goal, Account,
  Transaction, BudgetCategory, SpendHistory, UserSettings
} from '@/types'

async function db() { return createClient() }

/* ── SETTINGS ── */
export async function getSettings(): Promise<UserSettings> {
  const supabase = await db()
  const { data } = await supabase.from('user_settings').select('key, value')
  const map = Object.fromEntries((data ?? []).map((r: any) => [r.key, r.value]))
  return {
    name:      map.name      ?? 'Your Name',
    initials:  map.initials  ?? 'YN',
    plan:      map.plan      ?? 'Personal',
    workspace: map.workspace ?? 'Tracker',
  }
}

/* ── TASKS ── */
export async function getTasks(): Promise<Task[]> {
  const supabase = await db()
  const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false })
  return (data ?? []) as Task[]
}

/* ── HABITS ── */
export async function getHabits(): Promise<Habit[]> {
  const supabase = await db()
  const { data } = await supabase.from('habits').select('*').order('sort_order')
  return (data ?? []) as Habit[]
}

/* ── NOTES ── */
export async function getNotes(): Promise<Note[]> {
  const supabase = await db()
  const { data } = await supabase.from('notes').select('*').order('updated_at', { ascending: false })
  return (data ?? []) as Note[]
}

/* ── GOALS ── */
export async function getGoals(): Promise<Goal[]> {
  const supabase = await db()
  const { data } = await supabase.from('goals').select('*').order('sort_order')
  return (data ?? []) as Goal[]
}

/* ── FINANCE ── */
export async function getAccounts(): Promise<Account[]> {
  const supabase = await db()
  const { data } = await supabase.from('accounts').select('*').order('sort_order')
  return (data ?? []) as Account[]
}

export async function getTransactions(): Promise<Transaction[]> {
  const supabase = await db()
  const { data } = await supabase.from('transactions').select('*').order('created_at', { ascending: false })
  return (data ?? []) as Transaction[]
}

export async function getSpendHistory(): Promise<SpendHistory[]> {
  const supabase = await db()
  const { data } = await supabase.from('spend_history').select('*').order('sort_order')
  return (data ?? []) as SpendHistory[]
}

/* ── BUDGET ── */
export async function getBudgetCategories(): Promise<BudgetCategory[]> {
  const supabase = await db()
  const { data } = await supabase.from('budget_categories').select('*').order('sort_order')
  return (data ?? []) as BudgetCategory[]
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
