'use client'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { resetTable } from '@/actions/settings'

export function ResetTableButton({ table, label }: { table: string; label: string }) {
  const [pending, start] = useTransition()

  const handleClick = () => {
    if (!confirm(`${label}? This cannot be undone.`)) return
    start(async () => {
      const res = await resetTable(table)
      if (res?.error) toast.error(res.error)
      else toast.success(`${label} complete`)
    })
  }

  return (
    <button onClick={handleClick} disabled={pending}
      className="flex w-full items-center justify-between rounded-md border border-red-500/20 bg-red-500/5
                 px-3 py-2 text-[12px] text-red-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10
                 disabled:opacity-50">
      {pending ? 'Resetting…' : label}
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-3 opacity-60">
        <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10"/>
      </svg>
    </button>
  )
}
