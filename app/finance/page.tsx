import { getAccounts, getTransactions, getSpendHistory } from '@/lib/db'
import { StatCard } from '@/components/stat-card'
import { AddTransactionModal } from '@/components/modals/transaction-modal'
import { DeleteTransactionButton } from '@/components/delete-transaction-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function FinancePage() {
  const [accounts, transactions, history] = await Promise.all([
    getAccounts(), getTransactions(), getSpendHistory(),
  ])

  const totalBalance = accounts.reduce((s, a) => s + Number(a.balance), 0)
  const income       = transactions.filter(t => Number(t.amount) > 0).reduce((s, t) => s + Number(t.amount), 0)
  const spend        = transactions.filter(t => Number(t.amount) < 0).reduce((s, t) => s + Math.abs(Number(t.amount)), 0)
  const savingsRate  = income > 0 ? Math.round(((income - spend) / income) * 100) : 0
  const maxBar       = Math.max(...history.map(h => Number(h.amount)), 1)

  const now = new Date()

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold">Finances</h1>
          <p className="font-mono text-[11.5px] text-muted-foreground">Live from database</p>
        </div>
        <AddTransactionModal>
          <Button size="sm">
            <svg viewBox="0 0 12 12" fill="currentColor" className="mr-1.5 h-3 w-3"><path d="M6 1v10M1 6h10"/></svg>
            Add Transaction
          </Button>
        </AddTransactionModal>
      </div>

      <div className="mb-5 grid grid-cols-4 gap-3">
        <StatCard label="Total Balance"  value={`$${totalBalance.toLocaleString()}`} change="↑ across all accounts"                         trend="up"      dot="blue"  />
        <StatCard label="Monthly Income" value={`$${income.toFixed(2)}`}              change="from transactions"                              trend="neutral"             />
        <StatCard label="Monthly Spend"  value={`$${spend.toFixed(2)}`}               change="↑ vs last month"                               trend="down"    dot="red"   />
        <StatCard label="Savings Rate"   value={`${savingsRate}%`}                    change={savingsRate > 30 ? '↑ Above target' : '↓ Below target'} trend={savingsRate > 30 ? 'up' : 'down'} dot="green" />
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3">
        {/* Bar chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <CardTitle className="text-[12.5px] font-medium">Monthly Spend</CardTitle>
            <span className="font-mono text-[11px] text-muted-foreground">Last {history.length} months</span>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex h-20 items-end gap-1.5">
              {history.map(h => {
                const pct = Math.round((Number(h.amount) / maxBar) * 100)
                return (
                  <div key={h.id} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t-sm transition-colors ${h.is_current ? 'bg-foreground' : 'bg-accent hover:bg-muted-foreground/20'}`}
                      style={{ height: `${pct}%`, minHeight: 4 }}
                      title={`$${Number(h.amount).toLocaleString()}`}
                    />
                    <span className="font-mono text-[10px] text-muted-foreground">{h.label}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Accounts */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-[12.5px] font-medium">Accounts</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border pt-0">
            {accounts.map(a => (
              <div key={a.id} className="flex items-center gap-3 py-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card text-muted-foreground">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
                    <path d="M2 6l6-3 6 3M4 7v5M8 7v5M12 7v5M2 12h12M2 7h12"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-medium">{a.name}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{a.type}</p>
                </div>
                <span className="font-mono text-[13px] font-medium text-emerald-400">
                  ${Number(a.balance).toLocaleString()}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <CardTitle className="text-[12.5px] font-medium">Transactions</CardTitle>
          <span className="font-mono text-[11px] text-muted-foreground">
            {now.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
          </span>
        </CardHeader>
        <CardContent className="divide-y divide-border pt-0">
          {transactions.length
            ? transactions.map(t => {
                const amt     = Number(t.amount)
                const isIncome = amt >= 0
                return (
                  <div key={t.id} className="flex items-center gap-3 py-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card text-muted-foreground">
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
                        <path d="M2 2h2l2 8h6l1.5-5H5"/><circle cx="7" cy="13" r="1"/><circle cx="11" cy="13" r="1"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-medium">{t.name}</p>
                      <p className="font-mono text-[11px] text-muted-foreground">{t.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className={`font-mono text-[13px] font-medium ${isIncome ? 'text-emerald-400' : ''}`}>
                          {isIncome ? '+' : ''}${Math.abs(amt).toFixed(2)}
                        </p>
                        <p className="font-mono text-[11px] text-muted-foreground">{t.txn_date}</p>
                      </div>
                      <DeleteTransactionButton id={t.id} />
                    </div>
                  </div>
                )
              })
            : <p className="py-8 text-center font-mono text-xs text-muted-foreground">No transactions yet.</p>
          }
        </CardContent>
      </Card>
    </div>
  )
}
