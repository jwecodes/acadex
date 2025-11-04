// 'use client'
// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { BookOpen, Upload, CheckCircle, LogOut, AlertCircle } from 'lucide-react'
// import Link from 'next/link'

// interface Faculty {
//   id: string
//   facultyId: string
//   name: string
//   designation: string
//   email: string
//   department: string
//   contactNo: string | null
// }

// interface CourseAssignment {
//   id: string
//   courseId: string
//   role: 'COORDINATOR' | 'CONTRIBUTOR'
//   course: {
//     id: string
//     courseCode: string
//     courseName: string
//     semester: number
//     programme: {
//       programmeCode: string
//       programmeName: string
//       section: string | null
//     }
//   }
// }

// interface Stats {
//   totalCourses: number
//   coordinatorCourses: number
//   contributorCourses: number
//   contentSubmitted: number
//   pendingApproval: number
//   approved: number
// }

// export default function FacultyDashboard() {
//   const router = useRouter()
//   const [faculty, setFaculty] = useState<Faculty | null>(null)
//   const [assignments, setAssignments] = useState<CourseAssignment[]>([])
//   const [stats, setStats] = useState<Stats>({
//     totalCourses: 0,
//     coordinatorCourses: 0,
//     contributorCourses: 0,
//     contentSubmitted: 0,
//     pendingApproval: 0,
//     approved: 0
//   })
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [mounted, setMounted] = useState(false) // ✅ Track if component is mounted

//   useEffect(() => {
//     // Only check on client side
//     setMounted(true)
    
//     const facultyData = localStorage.getItem('faculty')
//     const facultyId = localStorage.getItem('facultyId')

//     console.log('Dashboard loaded')
//     console.log('Faculty data:', facultyData)
//     console.log('Faculty ID:', facultyId)

//     if (!facultyData || !facultyId) {
//       console.log('No faculty data found, redirecting to login')
//       router.push('/faculty/login')
//       return
//     }

//     try {
//       const parsedFaculty = JSON.parse(facultyData)
//       setFaculty(parsedFaculty)
//       loadDashboard(facultyId)
//     } catch (err) {
//       console.error('Error parsing faculty data:', err)
//       localStorage.removeItem('faculty')
//       localStorage.removeItem('facultyId')
//       router.push('/faculty/login')
//     }
//   }, [router])

//   const loadDashboard = async (facultyId: string) => {
//     try {
//       setLoading(true)
//       setError('')

//       console.log('Loading dashboard for faculty:', facultyId)

//       const res = await fetch('/api/faculty/my-courses', {
//         headers: {
//           'x-faculty-id': facultyId
//         }
//       })

//       console.log('API response status:', res.status)

//       const data = await res.json()

//       console.log('API response:', data)

//       if (data.success) {
//         setAssignments(data.assignments)

//         const coordinatorCount = data.assignments.filter(
//           (a: CourseAssignment) => a.role === 'COORDINATOR'
//         ).length
//         const contributorCount = data.assignments.filter(
//           (a: CourseAssignment) => a.role === 'CONTRIBUTOR'
//         ).length

//         setStats({
//           totalCourses: data.assignments.length,
//           coordinatorCourses: coordinatorCount,
//           contributorCourses: contributorCount,
//           contentSubmitted: data.contentSubmitted || 0,
//           pendingApproval: data.pendingApproval || 0,
//           approved: data.approved || 0
//         })
//       } else {
//         setError(data.error || 'Failed to load courses')
//       }
//     } catch (err: any) {
//       console.error('Dashboard error:', err)
//       setError(err.message || 'Error loading dashboard')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleLogout = () => {
//     localStorage.removeItem('faculty')
//     localStorage.removeItem('facultyId')
//     router.push('/faculty/login')
//   }

//   // ✅ Don't render until component is mounted
//   if (!mounted) {
//     return null
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading your dashboard...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!faculty) {
//     return null
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Welcome, {faculty.name}</h1>
//             <p className="text-gray-600 mt-1">{faculty.designation} • {faculty.department}</p>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
//           >
//             <LogOut className="h-5 w-5" />
//             Sign Out
//           </button>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-6 py-8">
//         {error && (
//           <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
//             <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
//             <p className="text-sm text-yellow-800">{error}</p>
//           </div>
//         )}

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
//           <div className="bg-white p-6 rounded-lg shadow">
//             <p className="text-gray-600 text-sm font-medium">Total Courses</p>
//             <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalCourses}</p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow">
//             <p className="text-gray-600 text-sm font-medium">As Coordinator</p>
//             <p className="text-3xl font-bold text-purple-600 mt-2">{stats.coordinatorCourses}</p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow">
//             <p className="text-gray-600 text-sm font-medium">As Contributor</p>
//             <p className="text-3xl font-bold text-blue-600 mt-2">{stats.contributorCourses}</p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow">
//             <p className="text-gray-600 text-sm font-medium">Content Submitted</p>
//             <p className="text-3xl font-bold text-green-600 mt-2">{stats.contentSubmitted}</p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow">
//             <p className="text-gray-600 text-sm font-medium">Pending Approval</p>
//             <p className="text-3xl font-bold text-orange-600 mt-2">{stats.pendingApproval}</p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow">
//             <p className="text-gray-600 text-sm font-medium">Approved</p>
//             <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.approved}</p>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//           <Link
//             href="/faculty/courses"
//             className="bg-blue-600 text-white p-6 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
//           >
//             <BookOpen className="h-8 w-8 mb-2" />
//             <p className="font-semibold">My Courses</p>
//             <p className="text-sm text-blue-100">View assigned courses</p>
//           </Link>
//           <Link
//             href="/faculty/submissions"
//             className="bg-green-600 text-white p-6 rounded-lg shadow hover:bg-green-700 transition cursor-pointer"
//           >
//             <Upload className="h-8 w-8 mb-2" />
//             <p className="font-semibold">My Submissions</p>
//             <p className="text-sm text-green-100">View your uploads</p>
//           </Link>
//           <Link
//             href="/faculty/approvals"
//             className="bg-purple-600 text-white p-6 rounded-lg shadow hover:bg-purple-700 transition cursor-pointer"
//           >
//             <CheckCircle className="h-8 w-8 mb-2" />
//             <p className="font-semibold">Approvals</p>
//             <p className="text-sm text-purple-100">Review submissions</p>
//           </Link>
//         </div>

//         {/* Recent Courses */}
//         <div className="bg-white rounded-lg shadow">
//           <div className="p-6 border-b">
//             <h2 className="text-xl font-semibold text-gray-900">Your Courses</h2>
//           </div>
//           <div className="divide-y">
//             {assignments.length > 0 ? (
//               assignments.map(assignment => (
//                 <div key={assignment.id} className="p-6 hover:bg-gray-50 transition">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h3 className="font-semibold text-gray-900">{assignment.course.courseCode}</h3>
//                       <p className="text-gray-600 text-sm">{assignment.course.courseName}</p>
//                       <p className="text-sm text-gray-500 mt-1">
//                         📚 {assignment.course.programme.programmeCode}
//                         {assignment.course.programme.section && ` - Section ${assignment.course.programme.section}`} •
//                         Semester {assignment.course.semester}
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       {assignment.role === 'COORDINATOR' ? (
//                         <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
//                           📋 Coordinator
//                         </span>
//                       ) : (
//                         <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
//                           📝 Contributor
//                         </span>
//                       )}
//                       <Link
//                         href={`/faculty/courses/${assignment.courseId}`}
//                         className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
//                       >
//                         View
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="p-12 text-center text-gray-600">
//                 <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-3" />
//                 <p>No courses assigned yet</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Upload, FileText, LogOut, Users } from 'lucide-react'

export default function FacultyDashboard() {
  const router = useRouter()
  const [faculty, setFaculty] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    coordinator: 0,
    contributor: 0,
    uploads: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const facultyData = localStorage.getItem('faculty')
    const facultyId = localStorage.getItem('facultyId')

    if (!facultyData || !facultyId) {
      router.push('/faculty/login')
      return
    }

    setFaculty(JSON.parse(facultyData))
    loadDashboard(facultyId)
  }, [router])

  const loadDashboard = async (facultyId: string) => {
    try {
      const res = await fetch('/api/faculty/my-courses', {
        headers: { 'x-faculty-id': facultyId }
      })

      const data = await res.json()

      if (data.success) {
        setCourses(data.assignments || [])
        setStats({
          total: data.assignments?.length || 0,
          coordinator: data.assignments?.filter((c: any) => c.role === 'COORDINATOR').length || 0,
          contributor: data.assignments?.filter((c: any) => c.role === 'CONTRIBUTOR').length || 0,
          uploads: data.contentSubmitted || 0
        })
      }
    } catch (err) {
      console.error('Error loading dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('faculty')
    localStorage.removeItem('facultyId')
    router.push('/faculty/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!faculty) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {faculty.name}</h1>
              <p className="text-gray-600 text-sm mt-1">{faculty.designation} • {faculty.department}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Courses</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.total}</p>
              </div>
              <BookOpen className="h-12 w-12 text-blue-200" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">As Coordinator</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.coordinator}</p>
              </div>
              <Users className="h-12 w-12 text-purple-200" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">As Contributor</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.contributor}</p>
              </div>
              <Users className="h-12 w-12 text-green-200" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Content Uploaded</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{stats.uploads}</p>
              </div>
              <FileText className="h-12 w-12 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/faculty/courses"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <BookOpen className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-2">My Courses</h3>
            <p className="text-blue-100 text-sm">View and manage assigned courses</p>
          </Link>

          <Link
            href="/faculty/upload"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <Upload className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Upload Content</h3>
            <p className="text-green-100 text-sm">Share teaching materials</p>
          </Link>

          <Link
            href="/faculty/my-content"
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <FileText className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-2">My Content</h3>
            <p className="text-purple-100 text-sm">Track your submissions</p>
          </Link>
        </div>

        {/* Recent Courses */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Your Courses</h2>
          </div>
          
          {courses.length > 0 ? (
            <div className="divide-y">
              {courses.map((course: any) => (
                <div key={course.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{course.course.courseCode}</h3>
                      <p className="text-gray-600 mt-1">{course.course.courseName}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span>📚 {course.course.programme.programmeCode}</span>
                        {course.course.programme.section && (
                          <span>• Section {course.course.programme.section}</span>
                        )}
                        <span>• Sem {course.course.semester}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        course.role === 'COORDINATOR'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {course.role === 'COORDINATOR' ? '📋 Coordinator' : '📝 Contributor'}
                      </span>
                      <Link
                        href={`/faculty/courses/${course.courseId}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-600">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium">No courses assigned yet</p>
              <p className="text-sm mt-2">Contact your administrator to get assigned to courses</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
