'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Upload, FileCheck, Clock, TrendingUp } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

export default function FacultyDashboard() {
  const router = useRouter()
  const [faculty, setFaculty] = useState<any>(null)
  const [stats, setStats] = useState({
    totalCourses: 0,
    uploadedContent: 0,
    pendingApproval: 0,
    approvedContent: 0
  })
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const facultyData = localStorage.getItem('facultyUser')
    if (!facultyData) {
      router.push('/faculty/login')
      return
    }
    setFaculty(JSON.parse(facultyData))
    loadDashboardData(JSON.parse(facultyData).id)
  }, [router])

  const loadDashboardData = async (facultyId: string) => {
    try {
      const response = await fetch(`/api/faculty/dashboard?facultyId=${facultyId}`)
      const data = await response.json()
      
      if (data.success) {
        setStats(data.stats)
        setCourses(data.courses)
      }
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Toaster position="top-right" />
      
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {faculty?.name}!
        </h1>
        <p className="text-gray-600">Here's an overview of your teaching content</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">{stats.totalCourses}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Assigned Courses</h3>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Upload className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">{stats.uploadedContent}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Total Uploads</h3>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">{stats.pendingApproval}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Pending Approval</h3>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileCheck className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">{stats.approvedContent}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Approved Content</h3>
        </div>
      </div>

      {/* My Courses */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
        </div>
        
        {courses.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No courses assigned yet</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{course.courseName}</h3>
                      <p className="text-sm text-gray-600">{course.courseCode}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      course.role === 'COORDINATOR' 
                        ? 'bg-yellow-100 text-yellow-900' 
                        : 'bg-blue-100 text-blue-900'
                    }`}>
                      {course.role}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{course.programme.programmeCode} - Sem {course.semester}</p>
                    <p>{course.session}</p>
                    <p className="text-xs text-gray-500">{course.credits} Credits</p>
                  </div>

                  <button
                    onClick={() => router.push(`/faculty/upload?courseId=${course.courseId}`)}
                    className="w-full mt-4 bg-blue-50 text-blue-700 px-3 py-2 rounded hover:bg-blue-100 text-sm font-medium"
                  >
                    Upload Content
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
