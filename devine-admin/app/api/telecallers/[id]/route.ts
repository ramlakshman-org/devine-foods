import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { Lead } from '@/lib/models/Lead'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (req.headers.get('x-user-role') !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  await connectDB()

  await Lead.updateMany({ assignedTo: id }, { $set: { assignedTo: null } })
  await User.findByIdAndUpdate(id, { isActive: false })

  return NextResponse.json({ ok: true })
}
