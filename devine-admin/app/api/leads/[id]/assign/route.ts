import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Lead } from '@/lib/models/Lead'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const role = req.headers.get('x-user-role')
  if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const { telecallerId } = await req.json()

  await connectDB()
  const lead = await Lead.findByIdAndUpdate(id, { assignedTo: telecallerId || null }, { new: true })
    .populate('assignedTo', 'name username')
  if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ ok: true, assignedTo: lead.assignedTo })
}
