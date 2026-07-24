'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Telecaller {
  _id: string
  name: string
}

export function AssignDialog({ leadId, onSaved }: { leadId: string; onSaved: () => void }) {
  const [open, setOpen] = useState(false)
  const [telecallers, setTelecallers] = useState<Telecaller[]>([])
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      fetch('/api/telecallers').then(r => r.json()).then(setTelecallers).catch(() => {})
    }
  }, [open])

  async function assign() {
    setLoading(true)
    await fetch(`/api/leads/${leadId}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telecallerId: selected || null }),
    })
    setLoading(false)
    setOpen(false)
    onSaved()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="h-7 text-xs">Assign</Button>} />
      <DialogContent className="w-[calc(100vw-2rem)] max-w-md mx-auto">
        <DialogHeader><DialogTitle>Assign Telecaller</DialogTitle></DialogHeader>
        <Select value={selected} onValueChange={(v) => v && setSelected(v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select telecaller" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Unassigned</SelectItem>
            {telecallers.map(t => <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={assign} disabled={loading} className="bg-[#1B2B4B] hover:bg-[#1B2B4B]/90">
            {loading ? 'Saving…' : 'Assign'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
