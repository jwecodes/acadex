'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Upload, Users, Crown, FileText, Calendar } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

interface Course {
  id: string
  courseId: string
  role: 'COORDINATOR' | 'CONTRIBUTOR'
  courseCode: string
  courseName: string
  session: string
  semester: number
  credits: number
  l: number
  t: number
  p: number
  s: number
  totalHours: number
  courseType: string
  category: string
  roomNo: string | null
  programme: {
    programmeCode: string
    programmeName: string
    section: string | null
  }
  contentCount: number
  approvedCount: number
  pendingCount: number
}

export default function MyCoursesPage() {
  const router = useRouter()
  const [faculty, setFaculty] = useState<any>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const facultyData = localStorage.getItem('facultyUser')
    if (!facultyData) {
      router.push('/faculty/login')
      return
    }
    const parsedFaculty = JSON.parse(facultyData)
    setFaculty(parsedFaculty)
    loadCourses(parsedFaculty.id)
  }, [router])

  const loadCourses = async (facultyId: string) => {
    try {
      const response = await fetch(`/api/faculty/courses-detailed?facultyId=${facultyId}`)
      const data = await response.json()
      
      if (data.success) {
        setCourses(data.courses)
      }
    } catch (error) {
      toast.error('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const coordinatorCourses = courses.filter(c => c.role === 'COORDINATOR')
  const contributorCourses = courses.filter(c => c.role === 'CONTRIBUTOR')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Toaster position="top-right" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
        <p className="text-gray-600">View all your assigned courses for this academic session</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">{courses.length}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Total Courses</h3>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Crown className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">{coordinatorCourses.length}</span>
          </div>
          <h3 className="text-gray-600 font-medium">As Coordinator</h3>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">{contributorCourses.length}</span>
          </div>
          <h3 className="text-gray-600 font-medium">As Contributor</h3>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Courses Assigned</h3>
          <p className="text-gray-600">You don't have any courses assigned yet. Contact your administrator.</p>
        </div>
      ) : (
        <>
          {/* Coordinator Courses */}
          {coordinatorCourses.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="h-6 w-6 text-yellow-600" />
                <h2 className="text-2xl font-bold text-gray-900">Coordinator Courses</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {coordinatorCourses.map((course) => (
                  <CourseCard key={course.id} course={course} router={router} />
                ))}
              </div>
            </div>
          )}

          {/* Contributor Courses */}
          {contributorCourses.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Contributor Courses</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {contributorCourses.map((course) => (
                  <CourseCard key={course.id} course={course} router={router} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function CourseCard({ course, router }: { course: Course; router: any }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className={`p-4 ${
        course.role === 'COORDINATOR' ? 'bg-yellow-50 border-b-2 border-yellow-300' : 'bg-green-50 border-b-2 border-green-300'
      }`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg">{course.courseName}</h3>
            <p className="text-sm text-gray-600">{course.courseCode}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
            course.role === 'COORDINATOR' ? 'bg-yellow-100 text-yellow-900' : 'bg-green-100 text-green-900'
          }`}>
            {course.role === 'COORDINATOR' && <Crown className="h-3 w-3" />}
            {course.role}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Programme Info */}
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600">Programme</p>
              <p className="font-semibold text-gray-900">{course.programme.programmeCode}</p>
              {course.programme.section && (
                <p className="text-xs text-gray-600">Section {course.programme.section}</p>
              )}
            </div>
            <div>
              <p className="text-gray-600">Session</p>
              <p className="font-semibold text-gray-900">{course.session}</p>
            </div>
            <div>
              <p className="text-gray-600">Semester</p>
              <p className="font-semibold text-gray-900">{course.semester}</p>
            </div>
            <div>
              <p className="text-gray-600">Credits</p>
              <p className="font-semibold text-gray-900">{course.credits}</p>
            </div>
          </div>
        </div>

        {/* Course Details */}
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div>
            <p className="text-gray-600">L-T-P-S</p>
            <p className="font-medium text-gray-900">{course.l}-{course.t}-{course.p}-{course.s}</p>
          </div>
          <div>
            <p className="text-gray-600">Total Hours</p>
            <p className="font-medium text-gray-900">{course.totalHours}/week</p>
          </div>
          <div>
            <p className="text-gray-600">Type</p>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${
              course.courseType === 'THEORY' ? 'bg-blue-100 text-blue-800' :
              course.courseType === 'LAB' ? 'bg-green-100 text-green-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {course.courseType}
            </span>
          </div>
          <div>
            <p className="text-gray-600">Category</p>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${
              course.category === 'MANDATORY' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {course.category}
            </span>
          </div>
        </div>

        {course.roomNo && (
          <div className="text-sm mb-4">
            <p className="text-gray-600">Room Number</p>
            <p className="font-medium text-gray-900">{course.roomNo}</p>
          </div>
        )}

        {/* Content Stats */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-600 mb-2">Uploaded Content</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{course.contentCount}</p>
              <p className="text-xs text-gray-600">Total</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">{course.approvedCount}</p>
              <p className="text-xs text-gray-600">Approved</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-yellow-600">{course.pendingCount}</p>
              <p className="text-xs text-gray-600">Pending</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={() => router.push(`/faculty/upload?courseId=${course.courseId}`)}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload Content
        </button>
      </div>
    </div>
  )
}
