import { getGoals } from '@/lib/db'
import { GoalsClient } from '@/components/goals-client'

export default async function GoalsPage() {
  const goals = await getGoals()
  return <GoalsClient goals={goals} />
}