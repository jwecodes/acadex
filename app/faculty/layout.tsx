'use client'
import { usePathname } from 'next/navigation'
import FacultySidebar from '@/components/faculty/FacultySidebar'

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/faculty/login'

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <FacultySidebar />
      <main className="lg:ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
