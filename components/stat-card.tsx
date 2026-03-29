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
      <CardContent className="p-5">
        <div className="mb-3 flex items-center gap-2">
          {dot && <span className={cn('h-2 w-2 rounded-full flex-shrink-0', dotColors[dot])} />}
          <span className="font-mono text-[13px] uppercase tracking-[0.05em] text-muted-foreground">
            {label}
          </span>
        </div>
        <p className="mb-2 font-mono text-3xl font-semibold tracking-tight leading-none">
          {value}
        </p>
        <p className={cn('font-mono text-[13px]', trendColors[trend])}>{change}</p>
      </CardContent>
    </Card>
  )
}