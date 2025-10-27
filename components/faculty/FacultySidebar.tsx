'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Upload, 
  FileText, 
  BookOpen, 
  LogOut,
  Menu,
  X
} from 'lucide-react'

export default function FacultySidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [faculty, setFaculty] = useState<any>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const facultyData = localStorage.getItem('facultyUser')
    if (facultyData) {
      setFaculty(JSON.parse(facultyData))
    } else {
      router.push('/faculty/login')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('facultyUser')
    router.push('/faculty/login')
  }

  const navItems = [
    { href: '/faculty/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/faculty/upload', icon: Upload, label: 'Upload Content' },
    { href: '/faculty/my-content', icon: FileText, label: 'My Content' },
    { href: '/faculty/courses', icon: BookOpen, label: 'My Courses' },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">Faculty Portal</h1>
                <p className="text-xs text-gray-500">TCMS</p>
              </div>
            </div>
            
            {faculty && (
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="font-semibold text-gray-900 text-sm">{faculty.name}</p>
                <p className="text-xs text-gray-600">{faculty.designation}</p>
                <p className="text-xs text-blue-600 mt-1">{faculty.facultyId}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
