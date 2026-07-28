'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-amber-100 text-amber-800',
  contacted: 'bg-blue-100 text-blue-800',
  interested: 'bg-green-100 text-green-800',
  follow_up: 'bg-orange-100 text-orange-800',
  negotiating: 'bg-purple-100 text-purple-800',
  converted: 'bg-emerald-100 text-emerald-800',
  lost: 'bg-gray-100 text-gray-600',
  replied: 'bg-blue-100 text-blue-800',
  resolved: 'bg-emerald-100 text-emerald-800',
  shortlisted: 'bg-purple-100 text-purple-800',
  interviewed: 'bg-blue-100 text-blue-800',
  hired: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-gray-100 text-gray-600',
}

type Stats = {
  dealer: { total: number; new: number; interested: number; converted: number }
  enquiries: { total: number; new: number; replied: number; resolved: number }
  career: { total: number; new: number; shortlisted: number; hired: number }
  productDemand: { product: string; count: number }[]
  recentDealer: any[]
  recentEnquiries: any[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400">Loading dashboard…</p>
      </div>
    )
  }

  const maxDemand = stats?.productDemand?.[0]?.count ?? 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#1B2B4B]">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of all leads and product demand</p>
      </div>

      {/* ── Stat rows ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Dealer apps */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#1B2B4B]">Dealer applications</p>
            <Link href="/dealer-apps" className="text-xs text-blue-500 hover:underline">View all →</Link>
          </div>
          <p className="text-3xl font-bold text-[#1B2B4B]">{stats?.dealer.total ?? 0}</p>
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-100">
            {[['New', stats?.dealer.new], ['Interested', stats?.dealer.interested], ['Converted', stats?.dealer.converted]].map(([label, val]) => (
              <div key={label as string}>
                <p className="text-lg font-bold text-[#1B2B4B]">{val ?? 0}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Enquiries */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#1B2B4B]">Enquiries</p>
            <Link href="/enquiries" className="text-xs text-blue-500 hover:underline">View all →</Link>
          </div>
          <p className="text-3xl font-bold text-[#1B2B4B]">{stats?.enquiries.total ?? 0}</p>
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-100">
            {[['New', stats?.enquiries.new], ['Replied', stats?.enquiries.replied], ['Resolved', stats?.enquiries.resolved]].map(([label, val]) => (
              <div key={label as string}>
                <p className="text-lg font-bold text-[#1B2B4B]">{val ?? 0}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Career */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#1B2B4B]">Career applications</p>
            <Link href="/career" className="text-xs text-blue-500 hover:underline">View all →</Link>
          </div>
          <p className="text-3xl font-bold text-[#1B2B4B]">{stats?.career.total ?? 0}</p>
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-100">
            {[['New', stats?.career.new], ['Shortlisted', stats?.career.shortlisted], ['Hired', stats?.career.hired]].map(([label, val]) => (
              <div key={label as string}>
                <p className="text-lg font-bold text-[#1B2B4B]">{val ?? 0}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Product demand + Recent enquiries ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Product demand */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm font-medium text-[#1B2B4B] mb-4">Product demand</p>
          {stats?.productDemand && stats.productDemand.length > 0 ? (
            <div className="space-y-3">
              {stats.productDemand.map(({ product, count }) => (
                <div key={product}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{product}</span>
                    <span className="text-gray-400 font-medium">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C9A961] rounded-full"
                      style={{ width: `${Math.round((count / maxDemand) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No product data yet — submissions from dealer apps will appear here.</p>
          )}
        </div>

        {/* Recent enquiries */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-[#1B2B4B]">Recent enquiries</p>
            <Link href="/enquiries" className="text-xs text-blue-500 hover:underline">View all →</Link>
          </div>
          {stats?.recentEnquiries && stats.recentEnquiries.length > 0 ? (
            <div className="space-y-3">
              {stats.recentEnquiries.map(lead => (
                <div key={lead._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{lead.name}</p>
                    <p className="text-xs text-gray-400">{lead.phone} · {lead.city ?? '—'}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[lead.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No enquiries yet.</p>
          )}
        </div>
      </div>

      {/* ── Recent dealer apps ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-[#1B2B4B]">Recent dealer applications</p>
          <Link href="/dealer-apps" className="text-xs text-blue-500 hover:underline">View all →</Link>
        </div>
        {stats?.recentDealer && stats.recentDealer.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100">
                  <th className="text-left pb-2 font-medium">Business</th>
                  <th className="text-left pb-2 font-medium">Name</th>
                  <th className="text-left pb-2 font-medium hidden sm:table-cell">City</th>
                  <th className="text-left pb-2 font-medium hidden md:table-cell">Products wanted</th>
                  <th className="text-left pb-2 font-medium">Status</th>
                  <th className="text-left pb-2 font-medium hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentDealer.map(lead => (
                  <tr key={lead._id} className="border-b border-gray-50 last:border-0">
                    <td className="py-2.5 font-medium text-gray-800 whitespace-nowrap">{lead.businessName ?? <span className="text-gray-300">—</span>}</td>
                    <td className="py-2.5 text-gray-600 whitespace-nowrap">{lead.name}</td>
                    <td className="py-2.5 text-gray-500 hidden sm:table-cell">{lead.city ?? '—'}</td>
                    <td className="py-2.5 hidden md:table-cell">
                      {lead.products
                        ? lead.products.split(', ').map((p: string) => (
                            <span key={p} className="inline-block bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded mr-1">{p}</span>
                          ))
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[lead.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-gray-400 text-xs hidden sm:table-cell whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-400">No dealer applications yet.</p>
        )}
      </div>
    </div>
  )
}
