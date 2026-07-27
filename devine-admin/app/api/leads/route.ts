import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Lead } from '@/lib/models/Lead'

export async function GET(req: NextRequest) {
  await connectDB()

  const role = req.headers.get('x-user-role')
  const userId = req.headers.get('x-user-id')

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const search = searchParams.get('search')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: any = {}

  if (role === 'telecaller') filter.assignedTo = userId

  const source = searchParams.get('source')
  if (source) filter.source = source
  if (status) filter.status = status
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { city: { $regex: search, $options: 'i' } },
    ]
  }
  if (from || to) {
    filter.createdAt = {}
    if (from) filter.createdAt.$gte = new Date(from)
    if (to) filter.createdAt.$lte = new Date(to + 'T23:59:59')
  }

  const leads = await Lead.find(filter)
    .populate('assignedTo', 'name username')
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json(leads)
}
