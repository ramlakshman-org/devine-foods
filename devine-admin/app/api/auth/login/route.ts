import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { signToken, COOKIE_NAME } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
    }

    await connectDB()
    const user = await User.findOne({ username: username.toLowerCase(), isActive: true })

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = signToken({ id: user._id.toString(), role: user.role, name: user.name })

    const res = NextResponse.json({ ok: true, role: user.role, name: user.name })
    res.cookies.set(COOKIE_NAME, token, { httpOnly: true, path: '/', maxAge: 7 * 24 * 60 * 60, sameSite: 'lax' })
    return res
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    console.error('Login error:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
