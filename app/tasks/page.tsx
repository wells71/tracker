import { getTasks } from '@/lib/db'
import { TaskItem } from '@/components/task-item'
import { AddTaskModal } from '@/components/modals/task-modal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function TasksPage() {
  const tasks = await getTasks()
  const ip    = tasks.filter(t => t.status === 'inprogress')
  const up    = tasks.filter(t => t.status === 'upcoming')
  const done  = tasks.filter(t => t.status === 'done')

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold">Tasks</h1>
          <p className="font-mono text-[11.5px] text-muted-foreground">
            {ip.length + up.length} remaining · {done.length} completed
          </p>
        </div>
        <AddTaskModal>
          <Button size="sm">
            <svg viewBox="0 0 12 12" fill="currentColor" className="mr-1.5 h-3 w-3"><path d="M6 1v10M1 6h10"/></svg>
            Add Task
          </Button>
        </AddTaskModal>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <CardTitle className="text-[12.5px] font-medium">In Progress</CardTitle>
            <span className="rounded-full border border-border bg-card px-2 py-px font-mono text-[11px] text-muted-foreground">
              {ip.length}
            </span>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col gap-0.5">
              {ip.length
                ? ip.map(t => <TaskItem key={t.id} task={t} showDelete />)
                : <p className="py-6 text-center font-mono text-xs text-muted-foreground">Nothing here yet</p>
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <CardTitle className="text-[12.5px] font-medium">Upcoming</CardTitle>
            <span className="rounded-full border border-border bg-card px-2 py-px font-mono text-[11px] text-muted-foreground">
              {up.length}
            </span>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col gap-0.5">
              {up.length
                ? up.map(t => <TaskItem key={t.id} task={t} showDelete />)
                : <p className="py-6 text-center font-mono text-xs text-muted-foreground">Nothing here yet</p>
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-[12.5px] font-medium">Completed</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col gap-0.5">
            {done.length
              ? done.map(t => <TaskItem key={t.id} task={t} showDelete />)
              : <p className="py-6 text-center font-mono text-xs text-muted-foreground">Nothing completed yet</p>
            }
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
