'use client'

import { useEffect, useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { NoteDialog } from '@/components/admin/note-dialog'

const STATUS_LABELS: Record<string, string> = {
  new: 'New', shortlisted: 'Shortlisted', interviewed: 'Interviewed', hired: 'Hired', rejected: 'Rejected',
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-amber-100 text-amber-800',
  shortlisted: 'bg-purple-100 text-purple-800',
  interviewed: 'bg-blue-100 text-blue-800',
  hired: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-gray-100 text-gray-600',
}

export default function CareerPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [loading, setLoading] = useState(true)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ source: 'career-form' })
    if (search) params.set('search', search)
    if (status !== 'all') params.set('status', status)
    const res = await fetch(`/api/leads?${params}`)
    const data = await res.json()
    setLeads(data)
    setLoading(false)
  }, [search, status])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  async function updateStatus(id: string, newStatus: string) {
    await fetch(`/api/leads/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    fetchLeads()
  }

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    shortlisted: leads.filter(l => l.status === 'shortlisted').length,
    hired: leads.filter(l => l.status === 'hired').length,
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#1B2B4B]">Career applications</h1>
        <p className="text-sm text-gray-500 mt-1">Submitted from the careers page</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[['Total', stats.total], ['New', stats.new], ['Shortlisted', stats.shortlisted], ['Hired', stats.hired]].map(([label, val]) => (
          <div key={label} className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
            <p className="text-xl md:text-2xl font-bold text-[#1B2B4B]">{val}</p>
            <p className="text-xs md:text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Search name or phone…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={status} onValueChange={v => v && setStatus(v)}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {Object.entries(STATUS_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={fetchLeads} className="w-full sm:w-auto">Refresh</Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role applied for</TableHead>
                <TableHead className="hidden lg:table-cell">Note / cover</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={8} className="text-center py-12 text-gray-400">Loading…</TableCell></TableRow>
              ) : leads.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-12 text-gray-400">No career applications yet</TableCell></TableRow>
              ) : leads.map((lead, i) => (
                <TableRow key={lead._id}>
                  <TableCell className="text-gray-400 text-sm">{i + 1}</TableCell>
                  <TableCell className="font-medium whitespace-nowrap">{lead.name}</TableCell>
                  <TableCell className="whitespace-nowrap">{lead.phone}</TableCell>
                  <TableCell className="font-medium text-[#1B2B4B] capitalize">
                    {lead.role ?? <span className="text-gray-300 font-normal">—</span>}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-gray-500 max-w-[220px] truncate">
                    {lead.message ?? <span className="text-gray-300">—</span>}
                  </TableCell>
                  <TableCell>
                    <Select value={lead.status} onValueChange={v => v && updateStatus(lead._id, v)}>
                      <SelectTrigger className="w-32 h-7 text-xs border-0 p-0 shadow-none">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {STATUS_LABELS[lead.status] ?? lead.status}
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUS_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-gray-400 whitespace-nowrap">
                    {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                  </TableCell>
                  <TableCell>
                    <NoteDialog leadId={lead._id} onSaved={fetchLeads} />
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
