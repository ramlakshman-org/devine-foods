import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Lead } from '@/lib/models/Lead'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { status } = await req.json()

  const valid = ['new', 'contacted', 'interested', 'follow_up', 'negotiating', 'converted', 'lost']
  if (!valid.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  await connectDB()
  const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true })
  if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ ok: true, status: lead.status })
}
