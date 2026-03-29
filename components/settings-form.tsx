'use client'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { saveSettings } from '@/actions/settings'
import type { UserSettings } from '@/types'

export function SettingsForm({ settings }: { settings: UserSettings }) {
  const [pending, start] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    start(async () => {
      await saveSettings(new FormData(e.currentTarget))
      toast.success('Settings saved')
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {[
        { id: 'name',      label: 'Display Name',   defaultValue: settings.name,      placeholder: 'Your Name'  },
        { id: 'initials',  label: 'Initials',        defaultValue: settings.initials,  placeholder: 'YN', maxLength: 2 },
        { id: 'workspace', label: 'Workspace Name',  defaultValue: settings.workspace, placeholder: 'Tracker'    },
        { id: 'plan',      label: 'Plan Label',      defaultValue: settings.plan,      placeholder: 'Personal'   },
      ].map(f => (
        <div key={f.id} className="flex flex-col gap-1.5">
          <Label htmlFor={f.id} className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {f.label}
          </Label>
          <Input id={f.id} name={f.id} defaultValue={f.defaultValue}
            placeholder={f.placeholder} maxLength={f.maxLength} />
        </div>
      ))}
      <Button type="submit" disabled={pending} className="mt-1 self-start">
        {pending ? 'Saving…' : 'Save Changes'}
      </Button>
    </form>
  )
}
