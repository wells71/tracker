export type Priority = 'high' | 'med' | 'low'
export type TaskStatus = 'inprogress' | 'upcoming' | 'done'

export interface Task {
  id: number
  title: string
  priority: Priority
  due_date: string | null
  done: boolean
  status: TaskStatus
  created_at: string
}

export interface Habit {
  id: number
  name: string
  streak: number
  pattern: number[]
  sort_order: number
}

export interface Note {
  id: number
  title: string
  body: string
  created_at: string
  updated_at: string
}

export interface Goal {
  id: number
  icon_key: string
  name: string
  sub: string
  pct: number
  color: string
  sort_order: number
}

export interface Account {
  id: number
  icon_key: string
  name: string
  type: string
  balance: number
  sort_order: number
}

export interface Transaction {
  id: number
  icon_key: string
  name: string
  category: string
  amount: number
  txn_date: string
  created_at: string
}

export interface BudgetCategory {
  id: number
  name: string
  spent: number
  budget_limit: number
  color: string
  sort_order: number
}

export interface SpendHistory {
  id: number
  label: string
  amount: number
  is_current: boolean
  sort_order: number
}

export interface UserSettings {
  name: string
  initials: string
  plan: string
  workspace: string
}
