import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/admin/sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <div className="flex min-h-screen bg-[#F5F6F1]">
      <Sidebar role={session.role} name={session.name} />
      <main className="flex-1 overflow-auto p-4 pt-18 md:p-8 md:pt-8">{children}</main>
    </div>
  )
}
