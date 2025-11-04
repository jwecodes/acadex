// 'use client'
// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { BookOpen, Filter, Search, AlertCircle } from 'lucide-react'
// import Link from 'next/link'

// interface CourseAssignment {
//   id: string
//   courseId: string
//   role: 'COORDINATOR' | 'CONTRIBUTOR'
//   course: {
//     id: string
//     courseCode: string
//     courseName: string
//     semester: number
//     credits: number
//     l: number
//     t: number
//     p: number
//     s: number
//     programme: {
//       programmeCode: string
//       programmeName: string
//       section: string | null
//     }
//   }
// }

// export default function MyCoursesPage() {
//   const router = useRouter()
//   const [assignments, setAssignments] = useState<CourseAssignment[]>([])
//   const [filteredAssignments, setFilteredAssignments] = useState<CourseAssignment[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [filterRole, setFilterRole] = useState<'all' | 'COORDINATOR' | 'CONTRIBUTOR'>('all')
//   const [searchTerm, setSearchTerm] = useState('')

//   useEffect(() => {
//     const facultyId = localStorage.getItem('facultyId')
//     if (!facultyId) {
//       router.push('/faculty/login')
//       return
//     }

//     loadCourses(facultyId)
//   }, [router])

//   useEffect(() => {
//     applyFilters()
//   }, [assignments, filterRole, searchTerm])

//   const loadCourses = async (facultyId: string) => {
//     try {
//       setLoading(true)
//       setError('')

//       const res = await fetch('/api/faculty/my-courses', {
//         headers: { 'x-faculty-id': facultyId }
//       })

//       const data = await res.json()

//       if (data.success) {
//         setAssignments(data.assignments)
//       } else {
//         setError(data.error || 'Failed to load courses')
//       }
//     } catch (err: any) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const applyFilters = () => {
//     let result = assignments

//     if (filterRole !== 'all') {
//       result = result.filter(a => a.role === filterRole)
//     }

//     if (searchTerm.trim()) {
//       const q = searchTerm.toLowerCase()
//       result = result.filter(a =>
//         a.course.courseCode.toLowerCase().includes(q) ||
//         a.course.courseName.toLowerCase().includes(q)
//       )
//     }

//     setFilteredAssignments(result)
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow mb-8">
//         <div className="max-w-7xl mx-auto px-6 py-6">
//           <Link href="/faculty/dashboard" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
//             ← Back to Dashboard
//           </Link>
//           <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
//           <p className="text-gray-600 mt-2">View and manage your assigned courses</p>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-6 pb-8">
//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow p-6 mb-8">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//             <Filter className="h-5 w-5" />
//             Filter & Search
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Search by course code or name..."
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
//               <select
//                 value={filterRole}
//                 onChange={(e) => setFilterRole(e.target.value as any)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
//               >
//                 <option value="all">All Roles</option>
//                 <option value="COORDINATOR">Coordinator Only</option>
//                 <option value="CONTRIBUTOR">Contributor Only</option>
//               </select>
//             </div>
//           </div>

//           <p className="text-sm text-gray-600 mt-4">
//             Showing <span className="font-semibold text-blue-600">{filteredAssignments.length}</span> of{' '}
//             <span className="font-semibold">{assignments.length}</span> courses
//           </p>
//         </div>

//         {error && (
//           <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
//             <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
//             <p className="text-sm text-yellow-800">{error}</p>
//           </div>
//         )}

//         {/* Courses Grid */}
//         {loading ? (
//           <div className="text-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading courses...</p>
//           </div>
//         ) : filteredAssignments.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredAssignments.map(assignment => (
//               <Link
//                 key={assignment.id}
//                 href={`/faculty/courses/${assignment.courseId}`}
//                 className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
//               >
//                 <div
//                   className={`p-6 ${
//                     assignment.role === 'COORDINATOR'
//                       ? 'bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-600'
//                       : 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600'
//                   }`}
//                 >
//                   <div className="flex items-center justify-between mb-3">
//                     <BookOpen
//                       className={`h-6 w-6 ${assignment.role === 'COORDINATOR' ? 'text-purple-600' : 'text-blue-600'}`}
//                     />
//                     {assignment.role === 'COORDINATOR' ? (
//                       <span className="px-2 py-1 bg-purple-200 text-purple-800 rounded text-xs font-semibold">
//                         📋 Coordinator
//                       </span>
//                     ) : (
//                       <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-semibold">
//                         📝 Contributor
//                       </span>
//                     )}
//                   </div>

//                   <h3 className="text-lg font-bold text-gray-900 mb-1">{assignment.course.courseCode}</h3>
//                   <p className="text-sm text-gray-700 mb-3">{assignment.course.courseName}</p>

//                   <div className="space-y-1 text-sm text-gray-600">
//                     <p>
//                       📚 {assignment.course.programme.programmeCode}
//                       {assignment.course.programme.section && ` - ${assignment.course.programme.section}`}
//                     </p>
//                     <p>📊 Sem {assignment.course.semester} | Credits: {assignment.course.credits}</p>
//                     <p>🎓 L:{assignment.course.l} T:{assignment.course.t} P:{assignment.course.p} S:{assignment.course.s}</p>
//                   </div>

//                   <button className={`w-full mt-4 py-2 rounded text-sm font-medium transition ${
//                     assignment.role === 'COORDINATOR'
//                       ? 'bg-purple-600 text-white hover:bg-purple-700'
//                       : 'bg-blue-600 text-white hover:bg-blue-700'
//                   }`}>
//                     View Details →
//                   </button>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow p-12 text-center">
//             <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
//             <p className="text-gray-600 font-medium">No courses found</p>
//           </div>
//         )}
//       </main>
//     </div>
//   )
// }

'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Search, Filter } from 'lucide-react'

export default function CoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<any[]>([])
  const [filteredCourses, setFilteredCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    const facultyId = localStorage.getItem('facultyId')
    if (!facultyId) {
      router.push('/faculty/login')
      return
    }

    loadCourses(facultyId)
  }, [router])

  useEffect(() => {
    applyFilters()
  }, [courses, searchTerm, roleFilter])

  const loadCourses = async (facultyId: string) => {
    try {
      const res = await fetch('/api/faculty/my-courses', {
        headers: { 'x-faculty-id': facultyId }
      })

      const data = await res.json()

      if (data.success) {
        setCourses(data.assignments || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let result = courses

    if (roleFilter !== 'all') {
      result = result.filter(c => c.role === roleFilter)
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      result = result.filter(c =>
        c.course.courseCode.toLowerCase().includes(q) ||
        c.course.courseName.toLowerCase().includes(q)
      )
    }

    setFilteredCourses(result)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b mb-8">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link href="/faculty/dashboard" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-2">View and manage your assigned courses</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by course code or name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">All Roles</option>
                <option value="COORDINATOR">Coordinator Only</option>
                <option value="CONTRIBUTOR">Contributor Only</option>
              </select>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            Showing <span className="font-semibold text-blue-600">{filteredCourses.length}</span> of{' '}
            <span className="font-semibold">{courses.length}</span> courses
          </p>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course: any) => (
              <Link
                key={course.id}
                href={`/faculty/courses/${course.courseId}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className={`p-6 ${
                  course.role === 'COORDINATOR'
                    ? 'border-l-4 border-purple-600 bg-gradient-to-r from-purple-50 to-white'
                    : 'border-l-4 border-blue-600 bg-gradient-to-r from-blue-50 to-white'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <BookOpen className={`h-6 w-6 ${
                      course.role === 'COORDINATOR' ? 'text-purple-600' : 'text-blue-600'
                    }`} />
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      course.role === 'COORDINATOR'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {course.role === 'COORDINATOR' ? 'Coordinator' : 'Contributor'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1">{course.course.courseCode}</h3>
                  <p className="text-sm text-gray-600 mb-4">{course.course.courseName}</p>

                  <div className="space-y-1 text-sm text-gray-600">
                    <p>📚 {course.course.programme.programmeCode}</p>
                    <p>📊 Semester {course.course.semester} | Credits: {course.course.credits}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-600">No courses found</p>
          </div>
        )}
      </main>
    </div>
  )
}
