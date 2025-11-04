'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Download, CheckCircle, Clock, XCircle, AlertCircle, Trash2, LogOut } from 'lucide-react'
import Link from 'next/link'

interface Content {
  id: string
  title: string
  contentType: string
  fileName: string
  filePath: string
  fileSize?: number
  approvalStatus: 'PENDING' | 'APPROVED' | 'CHANGES_REQUIRED' | 'REJECTED'
  coordinatorNotes: string | null
  createdAt: string
  course: {
    courseCode: string
    courseName: string
    programme: {
      programmeCode: string
      section: string | null
    }
  }
}

interface Faculty {
  id: string
  name: string
  facultyId: string
  designation: string
  department: string
}

export default function MyContentPage() {
  const router = useRouter()
  const [faculty, setFaculty] = useState<Faculty | null>(null)
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterType, setFilterType] = useState('ALL')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const facultyData = localStorage.getItem('faculty')
    const facultyId = localStorage.getItem('facultyId')

    console.log('My Content page loaded')
    console.log('Faculty data:', facultyData)
    console.log('Faculty ID:', facultyId)

    if (!facultyData || !facultyId) {
      console.log('No faculty data, redirecting to login')
      router.push('/faculty/login')
      return
    }

    try {
      const parsedFaculty = JSON.parse(facultyData)
      setFaculty(parsedFaculty)
      loadContent(facultyId)
    } catch (err) {
      console.error('Error parsing faculty data:', err)
      router.push('/faculty/login')
    }
  }, [router])

  const loadContent = async (facultyId: string) => {
    try {
      setLoading(true)
      console.log('Loading content for faculty:', facultyId)

      const res = await fetch('/api/faculty/my-submissions', {
        headers: {
          'x-faculty-id': facultyId
        }
      })

      console.log('API response status:', res.status)

      const data = await res.json()

      console.log('Content loaded:', data)

      if (data.success) {
        setContents(data.submissions || [])
      } else {
        console.error('Error loading content:', data.error)
      }
    } catch (error) {
      console.error('Error loading content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return

    const facultyId = localStorage.getItem('facultyId')
    if (!facultyId) {
      alert('Session expired. Please login again.')
      router.push('/faculty/login')
      return
    }

    try {
      const res = await fetch(`/api/faculty/content/${contentId}`, {
        method: 'DELETE',
        headers: {
          'x-faculty-id': facultyId
        }
      })

      const data = await res.json()

      if (data.success) {
        alert('Content deleted successfully')
        loadContent(facultyId)
      } else {
        alert(data.error || 'Failed to delete content')
      }
    } catch (error) {
      console.error('Error deleting content:', error)
      alert('An error occurred while deleting')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('faculty')
    localStorage.removeItem('facultyId')
    router.push('/faculty/login')
  }

  if (!mounted) {
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    )
  }

  if (!faculty) {
    return null
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'CHANGES_REQUIRED':
        return <AlertCircle className="h-5 w-5 text-orange-600" />
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return null
    }
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

  const getContentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'LECTURE_PPT': 'bg-blue-100 text-blue-800',
      'ASSIGNMENT': 'bg-green-100 text-green-800',
      'QUESTION_BANK': 'bg-purple-100 text-purple-800',
      'LAB_MANUAL': 'bg-orange-100 text-orange-800',
      'COURSE_HANDBOOK': 'bg-pink-100 text-pink-800',
      'SYLLABUS': 'bg-pink-100 text-pink-800',
      'NOTES': 'bg-yellow-100 text-yellow-800',
      'REFERENCE_MATERIAL': 'bg-gray-100 text-gray-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const filteredContents = contents.filter(content => {
    if (filterStatus !== 'ALL' && content.approvalStatus !== filterStatus) return false
    if (filterType !== 'ALL' && content.contentType !== filterType) return false
    return true
  })

  const stats = {
    total: contents.length,
    approved: contents.filter(c => c.approvalStatus === 'APPROVED').length,
    pending: contents.filter(c => c.approvalStatus === 'PENDING').length,
    changesRequired: contents.filter(c => c.approvalStatus === 'CHANGES_REQUIRED').length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow mb-8">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <Link href="/faculty/dashboard" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Content</h1>
              <p className="text-gray-600">View and manage all your uploaded teaching materials</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-medium">Total Uploads</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-medium">Approved</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.approved}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-medium">Pending</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-medium">Changes Needed</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{stats.changesRequired}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="CHANGES_REQUIRED">Changes Required</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              >
                <option value="ALL">All Types</option>
                <option value="LECTURE_PPT">Lecture PPT</option>
                <option value="ASSIGNMENT">Assignment</option>
                <option value="QUESTION_BANK">Question Bank</option>
                <option value="LAB_MANUAL">Lab Manual</option>
                <option value="COURSE_HANDBOOK">Course Handbook</option>
                <option value="SYLLABUS">Syllabus</option>
                <option value="NOTES">Notes</option>
                <option value="REFERENCE_MATERIAL">Reference Material</option>
              </select>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-blue-600">{filteredContents.length}</span> of <span className="font-semibold">{contents.length}</span> items
          </p>
        </div>

        {/* Content List */}
        <div className="bg-white rounded-lg shadow-md">
          {filteredContents.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4 text-lg">No content found</p>
              <Link
                href="/faculty/content/upload"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Upload Your First Content
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredContents.map((content) => (
                <div key={content.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{content.title}</h3>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3 flex-wrap">
                        <span className="font-medium">{content.course.courseCode}</span>
                        <span>•</span>
                        <span>{content.course.courseName}</span>
                        <span>•</span>
                        <span>{content.course.programme.programmeCode}</span>
                        {content.course.programme.section && (
                          <>
                            <span>•</span>
                            <span>Section {content.course.programme.section}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{new Date(content.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>

                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className={`px-3 py-1 rounded text-xs font-semibold ${getContentTypeColor(content.contentType)}`}>
                          {content.contentType.replace(/_/g, ' ')}
                        </span>
                        <span className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 ${getStatusColor(content.approvalStatus)}`}>
                          {getStatusIcon(content.approvalStatus)}
                          {content.approvalStatus === 'CHANGES_REQUIRED' ? 'Changes Required' : content.approvalStatus}
                        </span>
                      </div>

                      {content.coordinatorNotes && (
                        <div className="bg-orange-50 border border-orange-200 rounded p-3 text-sm mt-3">
                          <p className="font-semibold text-orange-900 mb-1">📝 Coordinator Feedback:</p>
                          <p className="text-orange-800">{content.coordinatorNotes}</p>
                        </div>
                      )}

                      <div className="text-xs text-gray-500 mt-3">
                        <FileText className="h-3 w-3 inline mr-1" />
                        {content.fileName}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                      {content.approvalStatus === 'PENDING' && (
                        <button
                          onClick={() => handleDelete(content.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
