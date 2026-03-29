'use client'
import { usePathname } from 'next/navigation'

const titles: Record<string, string> = {
  '/':         'Dashboard',
  '/tasks':    'Tasks',
  '/habits':   'Habits',
  '/goals':    'Goals',
  '/notes':    'Notes',
  '/finance':  'Finances',
  '/budget':   'Budget',
  '/settings': 'Settings',
}

export function Topbar() {
  const path  = usePathname()
  const title = titles[path] ?? 'Dashboard'

  return (
    <header className="sticky top-0 z-40 flex h-[52px] items-center gap-3 border-b border-border bg-background px-6">
      <span className="text-sm font-medium">{title}</span>
      <div className="flex-1" />
      <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5
                      font-mono text-xs text-muted-foreground cursor-pointer hover:border-border/80">
        <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-3">
          <circle cx="5.5" cy="5.5" r="4"/><path d="M9 9l2.5 2.5"/>
        </svg>
        Search…
        <kbd className="ml-2 rounded border border-border px-1 py-px font-mono text-[10px] text-muted-foreground">
          /
        </kbd>
      </div>
    </header>
  )
}
