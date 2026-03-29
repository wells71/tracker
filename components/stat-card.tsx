import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  change: string
  trend: 'up' | 'down' | 'neutral'
  dot?: 'blue' | 'green' | 'red' | 'orange' | 'white' | 'purple'
}

const dotColors = {
  blue:   'bg-blue-400',
  green:  'bg-emerald-400',
  red:    'bg-red-400',
  orange: 'bg-orange-400',
  white:  'bg-muted-foreground',
  purple: 'bg-purple-400',
}

const trendColors = {
  up:      'text-emerald-400',
  down:    'text-red-400',
  neutral: 'text-muted-foreground',
}

export function StatCard({ label, value, change, trend, dot }: StatCardProps) {
  return (
    <Card className="transition-colors hover:border-border/80">
      <CardContent className="p-4">
        <div className="mb-2.5 flex items-center gap-1.5">
          {dot && <span className={cn('h-1.5 w-1.5 rounded-full flex-shrink-0', dotColors[dot])} />}
          <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-muted-foreground">
            {label}
          </span>
        </div>
        <p className="mb-1.5 font-mono text-2xl font-semibold tracking-tight leading-none">
          {value}
        </p>
        <p className={cn('font-mono text-[11.5px]', trendColors[trend])}>{change}</p>
      </CardContent>
    </Card>
  )
}
