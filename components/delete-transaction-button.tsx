'use client'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { deleteTransaction } from '@/actions/finance'

export function DeleteTransactionButton({ id }: { id: number }) {
  const [pending, start] = useTransition()
  const handleDelete = () => {
    if (!confirm('Delete this transaction?')) return
    start(async () => {
      const res = await deleteTransaction(id)
      if (res?.error) toast.error(res.error)
      else toast.success('Transaction deleted')
    })
  }
  return (
    <button onClick={handleDelete} disabled={pending}
      className="rounded border border-border p-1 text-muted-foreground/40 transition-colors hover:border-red-500/40 hover:text-red-400">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-3">
        <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10"/>
      </svg>
    </button>
  )
}
