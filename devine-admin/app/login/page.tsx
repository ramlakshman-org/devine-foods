'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      setLoading(false)

      if (!res.ok) {
        let errMsg = `Server error (${res.status})`
        try {
          const data = await res.json()
          errMsg = data.error || errMsg
        } catch {
          // If response is not JSON (e.g. standard 500 error page from server)
          const text = await res.text().catch(() => '')
          if (text) {
            errMsg += `: ${text.slice(0, 100)}`
          }
        }
        setError(errMsg)
        return
      }

      await res.json()
      window.location.href = '/leads'
    } catch (err: unknown) {
      setLoading(false)
      const message = err instanceof Error ? err.message : String(err)
      setError(`Network or client error: ${message}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F6F1]">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#1B2B4B]">Devine Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>
        <form onSubmit={handleLogin} className="bg-white rounded-lg border border-gray-200 p-8 space-y-4 shadow-sm">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Username</label>
            <Input value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Password</label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full bg-[#1B2B4B] hover:bg-[#1B2B4B]/90" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}
