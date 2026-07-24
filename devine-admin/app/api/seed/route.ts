import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 })
  }

  await connectDB()

  const existing = await User.findOne({ username: 'admin' })
  if (existing) return NextResponse.json({ message: 'Admin already exists' })

  const passwordHash = await bcrypt.hash('admin123', 10)
  await User.create({ name: 'Admin', username: 'admin', passwordHash, role: 'admin' })

  return NextResponse.json({ ok: true, message: 'Admin created: admin / admin123' })
}
