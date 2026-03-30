'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Task } from '@/types'

const DAY_HEADERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

/* Parse "Mar 27" style dates into day numbers for the current month */
function parseDueDay(due: string | null, month: number, year: number): number | null {
  if (!due) return null
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const parts = due.trim().split(' ')
  if (parts.length !== 2) return null
  const m = months.indexOf(parts[0])
  const d = parseInt(parts[1])
  if (m !== month || isNaN(d)) return null
  return d
}

export function CalendarCard({ tasks }: { tasks: Task[] }) {
  const now   = new Date()
  const year  = now.getFullYear()
  const month = now.getMonth()

  const firstDay      = new Date(year, month, 1)
  const daysInMonth   = new Date(year, month + 1, 0).getDate()
  const startOffset   = (firstDay.getDay() + 6) % 7
  const prevMonthDays = new Date(year, month, 0).getDate()
  const monthName     = now.toLocaleString('en-US', { month: 'long', year: 'numeric' })

  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  /* Map day → tasks due that day */
  const tasksByDay: Record<number, Task[]> = {}
  tasks.forEach(t => {
    const d = parseDueDay(t.due_date, month, year)
    if (d) {
      if (!tasksByDay[d]) tasksByDay[d] = []
      tasksByDay[d].push(t)
    }
  })

  const selectedTasks = selectedDay ? (tasksByDay[selectedDay] ?? []) : []

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-[15px] font-medium">{monthName}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-7 gap-0.5">
          {DAY_HEADERS.map((d, i) => (
            <div key={i} className="py-1 text-center font-mono text-[10px] text-muted-foreground">{d}</div>
          ))}

          {/* Prev month filler */}
          {Array.from({ length: startOffset }, (_, i) => (
            <div key={`prev-${i}`} className="flex aspect-square items-center justify-center rounded text-[11px] text-muted-foreground/20">
              {prevMonthDays - startOffset + 1 + i}
            </div>
          ))}

          {/* Current month days */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day      = i + 1
            const isToday  = day === now.getDate()
            const isSelected = day === selectedDay
            const hasTasks = !!tasksByDay[day]?.length
            const doneTasks = tasksByDay[day]?.filter(t => t.done).length ?? 0
            const totalTasks = tasksByDay[day]?.length ?? 0
            const allDone  = hasTasks && doneTasks === totalTasks

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                className={[
                  'relative flex aspect-square items-center justify-center rounded font-mono text-[12px] transition-colors',
                  isToday    ? 'bg-foreground text-background font-semibold' : '',
                  isSelected && !isToday ? 'bg-accent ring-1 ring-border text-foreground' : '',
                  !isToday && !isSelected ? 'text-muted-foreground hover:bg-accent hover:text-foreground' : '',
                ].join(' ')}
              >
                {day}
                {/* Dot indicator for tasks */}
                {hasTasks && (
                  <span className={[
                    'absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full',
                    allDone ? 'bg-emerald-400' : 'bg-blue-400',
                    isToday ? 'bg-background' : '',
                  ].join(' ')} />
                )}
              </button>
            )
          })}
        </div>

        {/* Task list for selected day */}
        {selectedDay && (
          <div className="mt-3 border-t border-border pt-3">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {now.toLocaleString('en-US', { month: 'short' })} {selectedDay}
            </p>
            {selectedTasks.length ? (
              <div className="flex flex-col gap-1.5">
                {selectedTasks.map(t => (
                  <div key={t.id} className="flex items-center gap-2 text-[13px]">
                    <span className={[
                      'h-1.5 w-1.5 flex-shrink-0 rounded-full',
                      t.done ? 'bg-emerald-400' : t.priority === 'high' ? 'bg-red-400' : t.priority === 'med' ? 'bg-orange-400' : 'bg-blue-400',
                    ].join(' ')} />
                    <span className={t.done ? 'text-muted-foreground line-through' : ''}>{t.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-muted-foreground">No tasks due this day.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}