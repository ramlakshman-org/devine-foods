import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Lead } from '@/lib/models/Lead'

export async function GET() {
  await connectDB()

  const [dealerLeads, enquiryLeads, careerLeads] = await Promise.all([
    Lead.find({ $or: [{ source: 'dealer-form' }, { source: { $exists: false } }, { source: null }] }).lean(),
    Lead.find({ source: 'contact-form' }).lean(),
    Lead.find({ source: 'career-form' }).lean(),
  ])

  const productCounts: Record<string, number> = {}
  dealerLeads.forEach(lead => {
    if (lead.products) {
      lead.products.split(', ').forEach((p: string) => {
        const name = p.trim()
        if (name) productCounts[name] = (productCounts[name] || 0) + 1
      })
    }
  })
  const productDemand = Object.entries(productCounts)
    .map(([product, count]) => ({ product, count }))
    .sort((a, b) => b.count - a.count)

  return NextResponse.json({
    dealer: {
      total: dealerLeads.length,
      new: dealerLeads.filter(l => l.status === 'new').length,
      interested: dealerLeads.filter(l => l.status === 'interested').length,
      converted: dealerLeads.filter(l => l.status === 'converted').length,
    },
    enquiries: {
      total: enquiryLeads.length,
      new: enquiryLeads.filter(l => l.status === 'new').length,
      replied: enquiryLeads.filter(l => l.status === 'replied').length,
      resolved: enquiryLeads.filter(l => l.status === 'resolved').length,
    },
    career: {
      total: careerLeads.length,
      new: careerLeads.filter(l => l.status === 'new').length,
      shortlisted: careerLeads.filter(l => l.status === 'shortlisted').length,
      hired: careerLeads.filter(l => l.status === 'hired').length,
    },
    productDemand,
    recentDealer: dealerLeads
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5),
    recentEnquiries: enquiryLeads
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5),
  })
}
