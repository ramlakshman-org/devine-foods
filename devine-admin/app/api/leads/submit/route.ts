import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Lead } from '@/lib/models/Lead'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function POST(req: NextRequest) {
  const { name, phone, email, city, businessName, businessType, products, role, source, message } = await req.json()

  if (!name || !phone) {
    return NextResponse.json({ error: 'Name and phone are required' }, { status: 400, headers: CORS })
  }

  await connectDB()
  const lead = await Lead.create({ name, phone, email, city, businessName, businessType, products, role, source, message, status: 'new' })

  return NextResponse.json({ ok: true, id: lead._id }, { status: 201, headers: CORS })
}
