'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Clock, AlertCircle, XCircle, Filter, Search, AlertCircle as AlertIcon } from 'lucide-react'
import Link from 'next/link'

interface PendingContent {
  id: string
  title: string
  contentType: string
  fileName: string
  approvalStatus: 'PENDING' | 'APPROVED' | 'CHANGES_REQUIRED' | 'REJECTED'
  createdAt: string
  faculty: {
    name: string
    designation: string
  }
  course: {
    courseCode: string
    courseName: string
  }
}

export default function ApprovalsPage() {
  const router = useRouter()
  const [contents, setContents] = useState<PendingContent[]>([])
  const [filteredContents, setFilteredContents] = useState<PendingContent[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<'all' | 'PENDING' | 'APPROVED' | 'CHANGES_REQUIRED' | 'REJECTED'>('PENDING')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const facultyId = localStorage.getItem('facultyId')
    if (!facultyId) {
      router.push('/faculty/login')
      return
    }

    loadPendingContent(facultyId)
  }, [router])

  useEffect(() => {
    applyFilters()
  }, [contents, filterStatus, searchTerm])

  const loadPendingContent = async (facultyId: string) => {
    try {
      setLoading(true)
      const res = await fetch('/api/faculty/approvals', {
        headers: { 'x-faculty-id': facultyId }
      })

      const data = await res.json()

      if (data.success) {
        setContents(data.contents || [])
      }
    } catch (error) {
      console.error('Error loading approvals:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let result = contents

    if (filterStatus !== 'all') {
      result = result.filter(c => c.approvalStatus === filterStatus)
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.course.courseCode.toLowerCase().includes(q)
      )
    }

    setFilteredContents(result)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CHANGES_REQUIRED':
        return 'bg-orange-100 text-orange-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="h-5 w-5" />
      case 'PENDING':
        return <Clock className="h-5 w-5" />
      case 'CHANGES_REQUIRED':
        return <AlertCircle className="h-5 w-5" />
      case 'REJECTED':
        return <XCircle className="h-5 w-5" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow mb-8">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link href="/faculty/dashboard" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Content Approvals</h1>
          <p className="text-gray-600 mt-2">Review and approve course content submissions</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm font-medium">Pending</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {contents.filter(c => c.approvalStatus === 'PENDING').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm font-medium">Approved</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {contents.filter(c => c.approvalStatus === 'APPROVED').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm font-medium">Changes Required</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {contents.filter(c => c.approvalStatus === 'CHANGES_REQUIRED').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm font-medium">Rejected</p>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {contents.filter(c => c.approvalStatus === 'REJECTED').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Search
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search content..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="CHANGES_REQUIRED">Changes Required</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div className="flex items-end">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-blue-600">{filteredContents.length}</span> items
              </p>
            </div>
          </div>
        </div>

        {/* Content List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading content...</p>
          </div>
        ) : filteredContents.length > 0 ? (
          <div className="space-y-4">
            {filteredContents.map(content => (
              <div key={content.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{content.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(content.approvalStatus)}`}>
                        {getStatusIcon(content.approvalStatus)}
                        {content.approvalStatus === 'CHANGES_REQUIRED' ? 'Changes Required' : content.approvalStatus}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {content.course.courseCode} • {content.contentType}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Uploaded by {content.faculty.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">File</p>
                    <p className="text-sm font-medium text-gray-900">{content.fileName}</p>
                  </div>
                </div>

                {content.approvalStatus === 'PENDING' && (
                  <div className="flex gap-2 pt-4 border-t">
                    <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium">
                      ✓ Approve
                    </button>
                    <button className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm font-medium">
                      ⚠ Changes
                    </button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium">
                      ✗ Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No content to review</p>
          </div>
        )}
      </main>
    </div>
  )
}
