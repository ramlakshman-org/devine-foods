'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const leadsNav = [
  { href: '/dealer-apps', label: 'Dealer apps' },
  { href: '/enquiries', label: 'Enquiries' },
  { href: '/career', label: 'Career' },
]

const teamNav = [
  { href: '/telecallers', label: 'Telecallers', adminOnly: true },
]

function NavLinks({ role, onClose }: { role: string; onClose?: () => void }) {
  const pathname = usePathname()

  const linkClass = (href: string) => cn(
    'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
    pathname === href
      ? 'bg-white/10 text-white'
      : 'text-white/60 hover:bg-white/5 hover:text-white'
  )

  return (
    <>
      <Link href="/dashboard" onClick={onClose} className={linkClass('/dashboard')}>
        Dashboard
      </Link>
      <p className="px-3 pt-4 pb-1 text-xs font-medium text-white/30 uppercase tracking-wider">Leads</p>
      {leadsNav.map(n => (
        <Link key={n.href} href={n.href} onClick={onClose} className={linkClass(n.href)}>
          {n.label}
        </Link>
      ))}
      <p className="px-3 pt-4 pb-1 text-xs font-medium text-white/30 uppercase tracking-wider">Team</p>
      {teamNav.filter(n => !n.adminOnly || role === 'admin').map(n => (
        <Link key={n.href} href={n.href} onClick={onClose} className={linkClass(n.href)}>
          {n.label}
        </Link>
      ))}
    </>
  )
}

export function Sidebar({ role, name }: { role: string; name: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#1B2B4B] flex items-center justify-between px-4 h-14">
        <p className="font-bold text-[#C9A961] text-lg">Devine</p>
        <button
          onClick={() => setOpen(true)}
          className="text-white/70 hover:text-white p-1"
          aria-label="Open menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>

      {/* ── Mobile drawer backdrop ── */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <div className={cn(
        'md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-[#1B2B4B] text-white flex flex-col transition-transform duration-200',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <p className="font-bold text-[#C9A961] text-lg">Devine</p>
            <p className="text-xs text-white/50 mt-0.5">Admin Panel</p>
          </div>
          <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLinks role={role} onClose={() => setOpen(false)} />
        </nav>
        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-xs text-white/50 truncate mb-2">{name}</p>
          <button onClick={logout} className="text-xs text-white/60 hover:text-white transition-colors">
            Sign out
          </button>
        </div>
      </div>

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-56 bg-[#1B2B4B] text-white flex-col min-h-screen shrink-0">
        <div className="px-6 py-5 border-b border-white/10">
          <p className="font-bold text-[#C9A961] text-lg">Devine</p>
          <p className="text-xs text-white/50 mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLinks role={role} />
        </nav>
        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-xs text-white/50 truncate mb-2">{name}</p>
          <button onClick={logout} className="text-xs text-white/60 hover:text-white transition-colors">
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}
