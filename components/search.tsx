'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import type { Task, Note, Goal } from '@/types'

interface SearchProps {
  tasks: Task[]
  notes: Note[]
  goals: Goal[]
}

type Hit = {
  type: 'task' | 'note' | 'goal'
  id: number
  title: string
  sub: string
  href: string
  done?: boolean
}

export function Search({ tasks, notes, goals }: SearchProps) {
  const [open, setOpen]   = useState(false)
  const [query, setQuery] = useState('')
  const router            = useRouter()

  /* Open on "/" keypress globally */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT','TEXTAREA','SELECT'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault()
        setOpen(true)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const hits: Hit[] = query.trim().length < 1 ? [] : [
    ...tasks
      .filter(t => t.title.toLowerCase().includes(query.toLowerCase()))
      .map(t => ({ type: 'task' as const, id: t.id, title: t.title, sub: `${t.priority} · ${t.due_date ?? ''}`, href: '/tasks', done: t.done })),
    ...notes
      .filter(n => n.title.toLowerCase().includes(query.toLowerCase()) || n.body.toLowerCase().includes(query.toLowerCase()))
      .map(n => ({ type: 'note' as const, id: n.id, title: n.title, sub: n.body.slice(0, 60), href: '/notes' })),
    ...goals
      .filter(g => g.name.toLowerCase().includes(query.toLowerCase()))
      .map(g => ({ type: 'goal' as const, id: g.id, title: g.name, sub: g.sub, href: '/goals' })),
  ]

  const handleSelect = (hit: Hit) => {
    setOpen(false)
    setQuery('')
    router.push(hit.href)
  }

  const typeIcon = {
    task: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5"><path d="M2 4h12M2 8h8M2 12h10"/></svg>,
    note: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5"><rect x="2" y="2" width="12" height="12" rx="1.5"/><path d="M5 6h6M5 9h4"/></svg>,
    goal: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5"><path d="M3 8l3 3 7-6"/></svg>,
  }

  return (
    <>
      {/* Topbar trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-mono text-[13px] text-muted-foreground transition-colors hover:border-muted-foreground/30"
      >
        <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
          <circle cx="5.5" cy="5.5" r="4"/><path d="M9 9l2.5 2.5"/>
        </svg>
        Search…
        <kbd className="ml-1 rounded border border-border px-1.5 py-px font-mono text-[11px] text-muted-foreground">/</kbd>
      </button>

      <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) setQuery('') }}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-lg">
          <DialogTitle className="sr-only">Search</DialogTitle>
          {/* Input */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 flex-shrink-0 text-muted-foreground">
              <circle cx="5.5" cy="5.5" r="4"/><path d="M9 9l2.5 2.5"/>
            </svg>
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search tasks, notes, goals…"
              className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                  <path d="M3 3l10 10M13 3L3 13"/>
                </svg>
              </button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-[360px] overflow-y-auto">
            {query.trim().length === 0 ? (
              <p className="py-8 text-center font-mono text-sm text-muted-foreground">Type to search…</p>
            ) : hits.length === 0 ? (
              <p className="py-8 text-center font-mono text-sm text-muted-foreground">No results for "{query}"</p>
            ) : (
              <div className="py-2">
                {hits.map(hit => (
                  <button
                    key={`${hit.type}-${hit.id}`}
                    onClick={() => handleSelect(hit)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent"
                  >
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground">
                      {typeIcon[hit.type]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-[14px] font-medium ${hit.done ? 'text-muted-foreground line-through' : ''}`}>
                        {highlight(hit.title, query)}
                      </p>
                      <p className="truncate font-mono text-[12px] text-muted-foreground">{hit.sub}</p>
                    </div>
                    <span className="flex-shrink-0 font-mono text-[11px] uppercase tracking-wider text-muted-foreground/50">
                      {hit.type}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer hint */}
          <div className="border-t border-border px-4 py-2 flex items-center gap-3">
            <span className="font-mono text-[11px] text-muted-foreground">↵ to navigate</span>
            <span className="font-mono text-[11px] text-muted-foreground">esc to close</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function highlight(text: string, query: string) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded-sm bg-blue-500/20 text-blue-400">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}