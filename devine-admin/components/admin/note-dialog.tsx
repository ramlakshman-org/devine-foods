'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function NoteDialog({ leadId, onSaved }: { leadId: string; onSaved: () => void }) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  async function save() {
    if (!text.trim()) return
    setLoading(true)
    await fetch(`/api/leads/${leadId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    setLoading(false)
    setText('')
    setOpen(false)
    onSaved()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="h-7 text-xs">Note</Button>} />
      <DialogContent className="w-[calc(100vw-2rem)] max-w-md mx-auto">
        <DialogHeader><DialogTitle>Add Note</DialogTitle></DialogHeader>
        <textarea
          className="w-full border border-gray-200 rounded-md p-3 text-sm resize-none h-28 focus:outline-none focus:border-[#1B2B4B]"
          placeholder="Call outcome, follow-up details…"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={save} disabled={loading} className="bg-[#1B2B4B] hover:bg-[#1B2B4B]/90">
            {loading ? 'Saving…' : 'Save Note'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
