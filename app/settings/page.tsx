import { getSettings } from '@/lib/db'
import { SettingsForm } from '@/components/settings-form'
import { ResetTableButton } from '@/components/reset-table-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default async function SettingsPage() {
  const settings = await getSettings()
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-sm font-semibold">Settings</h1>
        <p className="font-mono text-[11.5px] text-muted-foreground">Profile &amp; data management</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-[12.5px] font-medium">Profile</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <SettingsForm settings={settings} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-[12.5px] font-medium">Data Management</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="mb-4 text-[12.5px] leading-relaxed text-muted-foreground">
              Permanently delete records from the database. This cannot be undone.
            </p>
            <div className="flex flex-col gap-2">
              {[
                { table: 'tasks',        label: 'Reset all tasks'        },
                { table: 'notes',        label: 'Reset all notes'        },
                { table: 'goals',        label: 'Reset all goals'        },
                { table: 'habits',       label: 'Reset all habits'       },
                { table: 'transactions', label: 'Reset all transactions' },
              ].map(({ table, label }) => (
                <ResetTableButton key={table} table={table} label={label} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
