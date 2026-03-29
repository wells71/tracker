'use client'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { addTransaction } from '@/actions/finance'

export function AddTransactionModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen]    = useState(false)
  const [type, setType]    = useState('expense')
  const [icon, setIcon]    = useState('wallet')
  const [pending, start]   = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set('type', type)
    fd.set('icon_key', icon)
    start(async () => {
      const res = await addTransaction(fd)
      if (res?.error) { toast.error(res.error); return }
      toast.success('Transaction added')
      setOpen(false)
    })
  }

  return (
    <>
      <span onClick={() => setOpen(true)}>{children}</span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Add Transaction</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <Label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Name</Label>
              <Input name="name" placeholder="e.g. Carrefour" autoFocus />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Amount</Label>
                <Input name="amount" type="number" min={0} step="0.01" placeholder="0.00" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Category</Label>
                <Input name="category" placeholder="e.g. Groceries" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Icon</Label>
                <Select value={icon} onValueChange={setIcon}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['shopping','food','transport','subscription','income','bank','wallet'].map(k => (
                      <SelectItem key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={pending}>{pending ? 'Adding…' : 'Add Transaction'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
