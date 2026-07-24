'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

function generatePassword() {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

interface TelecallerType {
  _id: string
  name: string
  username: string
  isActive: boolean
  createdAt: string
}

export default function TelecallersPage() {
  const [telecallers, setTelecallers] = useState<TelecallerType[]>([])
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState(generatePassword())
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function fetchTelecallers() {
    const res = await fetch('/api/telecallers')
    const data = await res.json()
    setTelecallers(data)
  }

  useEffect(() => { fetchTelecallers() }, [])

  async function addTelecaller() {
    if (!name || !username || !password) { setError('All fields required'); return }
    setLoading(true)
    const res = await fetch('/api/telecallers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, username, password }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error); return }
    setOpen(false)
    setName(''); setUsername(''); setPassword(generatePassword()); setError('')
    fetchTelecallers()
  }

  async function deactivate(id: string) {
    if (!confirm('Deactivate this telecaller? Their leads will become unassigned.')) return
    await fetch(`/api/telecallers/${id}`, { method: 'DELETE' })
    fetchTelecallers()
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#1B2B4B]">Telecallers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your calling team</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="bg-[#1B2B4B] hover:bg-[#1B2B4B]/90 text-sm">Add Telecaller</Button>} />
          <DialogContent className="w-[calc(100vw-2rem)] max-w-md mx-auto">
            <DialogHeader><DialogTitle>Add Telecaller</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Full Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ravi Kumar" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Username</label>
                <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="ravi.kumar" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Password</label>
                <div className="flex gap-2">
                  <Input value={password} onChange={e => setPassword(e.target.value)} />
                  <Button variant="outline" onClick={() => setPassword(generatePassword())} className="shrink-0">New</Button>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={addTelecaller} disabled={loading} className="bg-[#1B2B4B] hover:bg-[#1B2B4B]/90">
                  {loading ? 'Adding…' : 'Add'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Username</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {telecallers.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-gray-400">No telecallers yet</TableCell></TableRow>
              ) : telecallers.map((t, i) => (
                <TableRow key={t._id}>
                  <TableCell className="text-gray-400 text-sm">{i + 1}</TableCell>
                  <TableCell className="font-medium whitespace-nowrap">{t.name}</TableCell>
                  <TableCell className="hidden sm:table-cell text-gray-500">{t.username}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {t.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-gray-400 whitespace-nowrap">
                    {new Date(t.createdAt).toLocaleDateString('en-IN')}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="h-7 text-xs text-red-500 hover:text-red-600" onClick={() => deactivate(t._id)}>
                      Deactivate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
