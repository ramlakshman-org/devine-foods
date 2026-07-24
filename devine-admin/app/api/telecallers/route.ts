import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'

export async function GET(req: NextRequest) {
  if (req.headers.get('x-user-role') !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  await connectDB()
  const telecallers = await User.find({ role: 'telecaller' }).select('-passwordHash').lean()
  return NextResponse.json(telecallers)
}

export async function POST(req: NextRequest) {
  if (req.headers.get('x-user-role') !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { name, username, password } = await req.json()
  if (!name || !username || !password) {
    return NextResponse.json({ error: 'name, username, password required' }, { status: 400 })
  }

  await connectDB()

  const exists = await User.findOne({ username: username.toLowerCase() })
  if (exists) return NextResponse.json({ error: 'Username already taken' }, { status: 409 })

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, username: username.toLowerCase(), passwordHash, role: 'telecaller' })

  return NextResponse.json({ ok: true, id: user._id, name: user.name, username: user.username }, { status: 201 })
}
