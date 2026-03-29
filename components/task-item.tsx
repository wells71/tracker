'use client'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { toggleTask, deleteTask } from '@/actions/tasks'
import type { Task } from '@/types'

const priorityStyles = {
  high: 'border-red-500/30 text-red-400 bg-red-500/10',
  med:  'border-orange-500/30 text-orange-400 bg-orange-500/10',
  low:  'border-blue-500/30 text-blue-400 bg-blue-500/10',
}

export function TaskItem({ task, showDelete = false }: { task: Task; showDelete?: boolean }) {
  const [pending, startTransition] = useTransition()

  const handleToggle = () => {
    startTransition(async () => {
      const res = await toggleTask(task.id, task.done)
      if (res?.error) toast.error(res.error)
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteTask(task.id)
      if (res?.error) toast.error(res.error)
      else toast.success('Task deleted')
    })
  }

  return (
    <div className={cn('flex items-center gap-2.5 rounded-md px-2.5 py-2 transition-colors hover:bg-accent', pending && 'opacity-50')}>
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={cn(
          'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors',
          task.done ? 'border-foreground bg-foreground' : 'border-border hover:border-muted-foreground'
        )}
      >
        {task.done && (
          <svg viewBox="0 0 8 6" fill="none" stroke="black" strokeWidth="1.5" className="h-2 w-2">
            <path d="M1 3l2 2 4-4"/>
          </svg>
        )}
      </button>

      <span className={cn('flex-1 text-[15px]', task.done && 'text-muted-foreground line-through')}>
        {task.title}
      </span>

      <div className="flex items-center gap-1.5">
        <span className={cn('rounded-full border px-1.5 py-px font-mono text-[10.5px]', priorityStyles[task.priority])}>
          {task.priority}
        </span>
        {task.due_date && (
          <span className="font-mono text-[15px] text-muted-foreground">{task.due_date}</span>
        )}
        {showDelete && (
          <button onClick={handleDelete}
            className="ml-1 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100 [.task-item:hover_&]:opacity-100">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-3">
              <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}