'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Download, Eye, CheckCircle, Clock, XCircle, AlertCircle, Trash2 } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

interface Content {
  id: string
  title: string
  contentType: string
  fileName: string
  filePath: string
  fileSize: number
  approvalStatus: string
  coordinatorNotes: string | null
  lectureNumber: number | null
  createdAt: string
  course: {
    courseCode: string
    courseName: string
    programme: {
      programmeCode: string
    }
  }
}

export default function MyContentPage() {
  const router = useRouter()
  const [faculty, setFaculty] = useState<any>(null)
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterType, setFilterType] = useState('ALL')

  useEffect(() => {
    const facultyData = localStorage.getItem('facultyUser')
    if (!facultyData) {
      router.push('/faculty/login')
      return
    }
    const parsedFaculty = JSON.parse(facultyData)
    setFaculty(parsedFaculty)
    loadContent(parsedFaculty.id)
  }, [router])

  const loadContent = async (facultyId: string) => {
    try {
      const response = await fetch(`/api/faculty/content?facultyId=${facultyId}`)
      const data = await response.json()
      
      if (data.success) {
        setContents(data.contents)
      }
    } catch (error) {
      toast.error('Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return

    try {
      const response = await fetch(`/api/faculty/content/${contentId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Content deleted successfully')
        loadContent(faculty.id)
      } else {
        toast.error(data.error || 'Failed to delete content')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
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
      'SYLLABUS': 'bg-pink-100 text-pink-800',
      'NOTES': 'bg-yellow-100 text-yellow-800',
      'COURSE_HANDBOOK': 'bg-indigo-100 text-indigo-800',
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

  return (
    <div>
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Content</h1>
          <p className="text-gray-600">View and manage all your uploaded teaching materials</p>
        </div>
        <button
          onClick={() => router.push('/faculty/upload')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          Upload New Content
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Total Uploads</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Approved</p>
          <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Changes Needed</p>
          <p className="text-3xl font-bold text-orange-600">{stats.changesRequired}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="ALL">All Types</option>
              <option value="LECTURE_PPT">Lecture PPT</option>
              <option value="ASSIGNMENT">Assignment</option>
              <option value="QUESTION_BANK">Question Bank</option>
              <option value="LAB_MANUAL">Lab Manual</option>
              <option value="SYLLABUS">Syllabus</option>
              <option value="NOTES">Notes</option>
            </select>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Showing {filteredContents.length} of {contents.length} items
        </p>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-lg shadow-md">
        {filteredContents.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No content found</p>
            <button
              onClick={() => router.push('/faculty/upload')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Upload Your First Content
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredContents.map((content) => (
              <div key={content.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{content.title}</h3>
                      {content.lectureNumber && (
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          Lecture {content.lectureNumber}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                      <span>{content.course.courseCode} - {content.course.courseName}</span>
                      <span>•</span>
                      <span>{content.course.programme.programmeCode}</span>
                      <span>•</span>
                      <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getContentTypeColor(content.contentType)}`}>
                        {content.contentType.replace(/_/g, ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${getStatusColor(content.approvalStatus)}`}>
                        {getStatusIcon(content.approvalStatus)}
                        {content.approvalStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    {content.coordinatorNotes && (
                      <div className="bg-orange-50 border border-orange-200 rounded p-3 text-sm">
                        <p className="font-semibold text-orange-900 mb-1">Coordinator Notes:</p>
                        <p className="text-orange-800">{content.coordinatorNotes}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <a
                      href={content.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Download"
                    >
                      <Download className="h-5 w-5" />
                    </a>
                    {content.approvalStatus === 'PENDING' && (
                      <button
                        onClick={() => handleDelete(content.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <FileText className="h-3 w-3 inline mr-1" />
                  {content.fileName} • {(content.fileSize / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
