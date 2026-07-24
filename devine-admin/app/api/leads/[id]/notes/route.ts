import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Lead } from '@/lib/models/Lead'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const userId = req.headers.get('x-user-id')!
  const { text } = await req.json()

  if (!text?.trim()) return NextResponse.json({ error: 'Note text required' }, { status: 400 })

  await connectDB()
  const lead = await Lead.findByIdAndUpdate(
    id,
    { $push: { notes: { text, addedBy: userId, addedAt: new Date() } } },
    { new: true }
  ).populate('notes.addedBy', 'name')

  if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ ok: true, notes: lead.notes })
}
