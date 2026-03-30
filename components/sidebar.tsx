'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { UserSettings } from '@/types'

const nav = [
  { label: 'Overview', items: [{ href: '/', label: 'Dashboard', icon: GridIcon }] },
  { label: 'Personal', items: [
    { href: '/tasks',  label: 'Tasks',   icon: ListIcon  },
    { href: '/habits', label: 'Habits',  icon: ClockIcon },
    { href: '/goals',  label: 'Goals',   icon: CheckIcon },
    { href: '/notes',  label: 'Notes',   icon: FileIcon  },
  ]},
  { label: 'Finance', items: [
    { href: '/finance', label: 'Finances', icon: TrendIcon  },
    { href: '/budget',  label: 'Budget',   icon: CircleIcon },
  ]},
  { label: 'System', items: [{ href: '/settings', label: 'Settings', icon: CogIcon }] },
]

export function Sidebar({ settings }: { settings: UserSettings }) {
  const path = usePathname()
  const [open, setOpen] = useState(false)

  const NavContent = () => (
    <>
      <div className="flex h-[56px] flex-shrink-0 items-center gap-3 border-b border-border px-5">
        <div className="h-5 w-5 flex-shrink-0 bg-foreground" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }} />
        <span className="text-base font-semibold tracking-tight">{settings.workspace}</span>
        {/* Mobile close */}
        <button onClick={() => setOpen(false)} className="ml-auto text-muted-foreground md:hidden hover:text-foreground">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
            <path d="M3 3l10 10M13 3L3 13"/>
          </svg>
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {nav.map(group => (
          <div key={group.label}>
            <p className="px-4 pb-1 pt-4 font-mono text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              {group.label}
            </p>
            {group.items.map(item => {
              const active = item.href === '/' ? path === '/' : path.startsWith(item.href)
              return (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                  className={cn(
                    'mx-2 mb-0.5 flex items-center gap-2.5 rounded-md px-3 py-2 text-[14px] transition-colors',
                    active ? 'bg-accent font-medium text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <item.icon className={cn('h-4 w-4 flex-shrink-0', active ? 'opacity-100' : 'opacity-60')} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>
      <div className="flex-shrink-0 border-t border-border p-3">
        <Link href="/settings" onClick={() => setOpen(false)}
          className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-accent">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 font-mono text-[12px] font-semibold text-white">
            {settings.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-medium">{settings.name}</p>
            <p className="font-mono text-[12px] text-muted-foreground">{settings.plan}</p>
          </div>
        </Link>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile hamburger — shown in topbar area */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground md:hidden"
      >
        <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
          <path d="M2 4h14M2 9h14M2 14h14"/>
        </svg>
      </button>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar — fixed on desktop, slide-in on mobile */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col border-r border-border bg-card transition-transform duration-200',
        'md:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        <NavContent />
      </aside>
    </>
  )
}

function GridIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>
}
function ListIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4h12M2 8h8M2 12h10"/></svg>
}
function ClockIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 2"/></svg>
}
function CheckIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8l3 3 7-6"/></svg>
}
function FileIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="12" height="12" rx="1.5"/><path d="M5 6h6M5 9h4"/></svg>
}
function TrendIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 11V8a2 2 0 014 0v3M10 11V5a2 2 0 014 0v6M1 11h14"/></svg>
}
function CircleIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 5v6M5.5 6.5A1.5 1.5 0 018 5a1.5 1.5 0 010 3 1.5 1.5 0 010 3 1.5 1.5 0 01-2.5-1.5"/></svg>
}
function CogIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="2.5"/><path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.2 3.2l1.1 1.1M11.7 11.7l1.1 1.1M3.2 12.8l1.1-1.1M11.7 4.3l1.1-1.1"/></svg>
}