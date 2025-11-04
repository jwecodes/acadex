// 'use client'
// import { useState, useEffect } from 'react'
// import { useRouter, useParams } from 'next/navigation'
// import { Upload, CheckCircle, Clock, AlertCircle, Users, FileText, ChevronDown, ChevronUp, Download } from 'lucide-react'
// import Link from 'next/link'

// interface CourseDetail {
//   id: string
//   courseCode: string
//   courseName: string
//   courseType: string
//   deliveryMode: string
//   category: string
//   semester: number
//   credits: number
//   l: number
//   t: number
//   p: number
//   s: number
//   programme: {
//     programmeCode: string
//     programmeName: string
//     section: string | null
//   }
// }

// interface TeachingContent {
//   id: string
//   title: string
//   contentType: string
//   fileName: string
//   approvalStatus: 'PENDING' | 'APPROVED' | 'CHANGES_REQUIRED' | 'REJECTED'
//   createdAt: string
//   coordinatorNotes?: string
//   faculty: {
//     name: string
//     designation: string
//   }
// }

// interface TeamMember {
//   id: string
//   name: string
//   designation: string
//   role: 'COORDINATOR' | 'CONTRIBUTOR'
// }

// export default function CourseDetailPage() {
//   const router = useRouter()
//   const params = useParams()
//   const courseId = params.courseId as string

//   const [course, setCourse] = useState<CourseDetail | null>(null)
//   const [contents, setContents] = useState<TeachingContent[]>([])
//   const [team, setTeam] = useState<TeamMember[]>([])
//   const [loading, setLoading] = useState(true)
//   const [isCoordinator, setIsCoordinator] = useState(false)
//   const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'team'>('overview')
//   const [expandedContent, setExpandedContent] = useState<string | null>(null)

//   useEffect(() => {
//     const facultyId = localStorage.getItem('facultyId')
//     if (!facultyId) {
//       router.push('/faculty/login')
//       return
//     }

//     loadCourseDetail(facultyId)
//   }, [courseId, router])

//   const loadCourseDetail = async (facultyId: string) => {
//     try {
//       setLoading(true)
//       const res = await fetch(`/api/faculty/courses/${courseId}`, {
//         headers: { 'x-faculty-id': facultyId }
//       })

//       const data = await res.json()

//       if (data.success) {
//         setCourse(data.course)
//         setContents(data.contents || [])
//         setTeam(data.team || [])
//         setIsCoordinator(data.isCoordinator || false)
//       }
//     } catch (error) {
//       console.error('Error loading course:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading course...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!course) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center">
//           <p className="text-gray-600">Course not found</p>
//         </div>
//       </div>
//     )
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'APPROVED':
//         return 'bg-green-100 text-green-800'
//       case 'PENDING':
//         return 'bg-yellow-100 text-yellow-800'
//       case 'CHANGES_REQUIRED':
//         return 'bg-orange-100 text-orange-800'
//       case 'REJECTED':
//         return 'bg-red-100 text-red-800'
//       default:
//         return 'bg-gray-100 text-gray-800'
//     }
//   }

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'APPROVED':
//         return <CheckCircle className="h-4 w-4" />
//       case 'PENDING':
//         return <Clock className="h-4 w-4" />
//       case 'CHANGES_REQUIRED':
//         return <AlertCircle className="h-4 w-4" />
//       case 'REJECTED':
//         return <AlertCircle className="h-4 w-4" />
//       default:
//         return null
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow mb-8">
//         <div className="max-w-7xl mx-auto px-6 py-6">
//           <Link href="/faculty/courses" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
//             ← Back to Courses
//           </Link>
//           <h1 className="text-3xl font-bold text-gray-900">{course.courseCode}</h1>
//           <p className="text-gray-600 mt-2">{course.courseName}</p>
//           {isCoordinator && (
//             <div className="mt-3 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold w-fit">
//               📋 You are the Coordinator
//             </div>
//           )}
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-6 pb-8">
//         {/* Course Info */}
//         <div className="bg-white rounded-lg shadow p-6 mb-8">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div>
//               <p className="text-gray-600 text-sm">Programme</p>
//               <p className="font-semibold text-gray-900">{course.programme.programmeCode}</p>
//             </div>
//             <div>
//               <p className="text-gray-600 text-sm">Section</p>
//               <p className="font-semibold text-gray-900">{course.programme.section || 'N/A'}</p>
//             </div>
//             <div>
//               <p className="text-gray-600 text-sm">Semester</p>
//               <p className="font-semibold text-gray-900">{course.semester}</p>
//             </div>
//             <div>
//               <p className="text-gray-600 text-sm">Credits</p>
//               <p className="font-semibold text-gray-900">{course.credits}</p>
//             </div>
//             <div>
//               <p className="text-gray-600 text-sm">L-T-P-S</p>
//               <p className="font-semibold text-gray-900">{course.l}-{course.t}-{course.p}-{course.s}</p>
//             </div>
//             <div>
//               <p className="text-gray-600 text-sm">Type</p>
//               <p className="font-semibold text-gray-900">{course.courseType}</p>
//             </div>
//             <div>
//               <p className="text-gray-600 text-sm">Delivery Mode</p>
//               <p className="font-semibold text-gray-900">{course.deliveryMode}</p>
//             </div>
//             <div>
//               <p className="text-gray-600 text-sm">Category</p>
//               <p className="font-semibold text-gray-900">{course.category}</p>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="bg-white rounded-lg shadow mb-8">
//           <div className="border-b flex">
//             <button
//               onClick={() => setActiveTab('overview')}
//               className={`px-6 py-4 font-medium ${
//                 activeTab === 'overview'
//                   ? 'border-b-2 border-blue-600 text-blue-600'
//                   : 'text-gray-600 hover:text-gray-900'
//               }`}
//             >
//               Overview
//             </button>
//             <button
//               onClick={() => setActiveTab('content')}
//               className={`px-6 py-4 font-medium ${
//                 activeTab === 'content'
//                   ? 'border-b-2 border-blue-600 text-blue-600'
//                   : 'text-gray-600 hover:text-gray-900'
//               }`}
//             >
//               Content {contents.length > 0 && `(${contents.length})`}
//             </button>
//             <button
//               onClick={() => setActiveTab('team')}
//               className={`px-6 py-4 font-medium ${
//                 activeTab === 'team'
//                   ? 'border-b-2 border-blue-600 text-blue-600'
//                   : 'text-gray-600 hover:text-gray-900'
//               }`}
//             >
//               Team {team.length > 0 && `(${team.length})`}
//             </button>
//           </div>

//           <div className="p-6">
//             {/* Overview Tab */}
//             {activeTab === 'overview' && (
//               <div className="space-y-6">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
//                   <div className="flex gap-3 flex-wrap">
//                     <Link
//                       href={`/faculty/content/upload?courseId=${course.id}`}
//                       className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
//                     >
//                       <Upload className="h-5 w-5" />
//                       Upload Content
//                     </Link>
//                     {isCoordinator && (
//                       <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium">
//                         <CheckCircle className="h-5 w-5" />
//                         Review Content
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Content Tab */}
//             {activeTab === 'content' && (
//               <div className="space-y-4">
//                 {contents.length > 0 ? (
//                   contents.map(content => (
//                     <div key={content.id} className="border rounded-lg p-4">
//                       <div className="flex items-start justify-between cursor-pointer" onClick={() => setExpandedContent(expandedContent === content.id ? null : content.id)}>
//                         <div className="flex-1">
//                           <h4 className="font-semibold text-gray-900">{content.title}</h4>
//                           <p className="text-sm text-gray-600 mt-1">
//                             {content.contentType} • {content.fileName}
//                           </p>
//                           <p className="text-xs text-gray-500 mt-2">
//                             Uploaded by {content.faculty.name}
//                           </p>
//                         </div>

//                         <div className="flex items-center gap-2">
//                           <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(content.approvalStatus)}`}>
//                             {getStatusIcon(content.approvalStatus)}
//                             {content.approvalStatus === 'CHANGES_REQUIRED' ? 'Changes' : content.approvalStatus}
//                           </span>
//                           {expandedContent === content.id ? (
//                             <ChevronUp className="h-5 w-5 text-gray-500" />
//                           ) : (
//                             <ChevronDown className="h-5 w-5 text-gray-500" />
//                           )}
//                         </div>
//                       </div>

//                       {expandedContent === content.id && (
//                         <div className="mt-4 pt-4 border-t space-y-3">
//                           <div className="flex gap-2">
//                             <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm font-medium flex items-center gap-1">
//                               <Download className="h-4 w-4" />
//                               Download
//                             </button>
//                             {isCoordinator && content.approvalStatus === 'PENDING' && (
//                               <>
//                                 <button className="px-3 py-1 text-green-600 hover:bg-green-50 rounded text-sm font-medium">
//                                   ✓ Approve
//                                 </button>
//                                 <button className="px-3 py-1 text-orange-600 hover:bg-orange-50 rounded text-sm font-medium">
//                                   ⚠ Changes
//                                 </button>
//                                 <button className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm font-medium">
//                                   ✗ Reject
//                                 </button>
//                               </>
//                             )}
//                           </div>

//                           {content.coordinatorNotes && (
//                             <div className="p-2 bg-orange-50 rounded text-sm text-orange-900 border border-orange-200">
//                               📝 <strong>Coordinator Notes:</strong> {content.coordinatorNotes}
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-center py-8 text-gray-600">
//                     <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
//                     <p>No content uploaded yet</p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Team Tab */}
//             {activeTab === 'team' && (
//               <div className="space-y-3">
//                 {team.length > 0 ? (
//                   team.map(member => (
//                     <div key={member.id} className="border rounded-lg p-4 flex items-center justify-between">
//                       <div>
//                         <h4 className="font-semibold text-gray-900">{member.name}</h4>
//                         <p className="text-sm text-gray-600">{member.designation}</p>
//                       </div>
//                       {member.role === 'COORDINATOR' ? (
//                         <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
//                           📋 Coordinator
//                         </span>
//                       ) : (
//                         <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
//                           📝 Contributor
//                         </span>
//                       )}
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-center py-8 text-gray-600">
//                     <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
//                     <p>No team members</p>
//                   </div>
//                 )}
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
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Upload, Download, Users } from 'lucide-react'

export default function CourseDetail() {
  const router = useRouter()
  const params = useParams()
  const courseId = params?.courseId as string

  const [course, setCourse] = useState<any>(null)
  const [team, setTeam] = useState<any[]>([])
  const [contents, setContents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedContent, setExpandedContent] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const facultyId = localStorage.getItem('facultyId')
    
    console.log('Course Detail page loaded')
    console.log('Course ID from params:', courseId)
    console.log('Faculty ID:', facultyId)

    if (!facultyId) {
      router.push('/faculty/login')
      return
    }

    if (!courseId) {
      console.log('No course ID, going to courses page')
      router.push('/faculty/courses')
      return
    }

    loadCourse(facultyId)
  }, [courseId, router])

  const loadCourse = async (facultyId: string) => {
    try {
      console.log('Loading course:', courseId)

      const res = await fetch(`/api/faculty/courses/${courseId}`, {
        headers: { 'x-faculty-id': facultyId }
      })

      const data = await res.json()

      if (data.success) {
        setCourse(data.course)
        setTeam(data.team || [])
        setContents(data.contents || [])
        console.log('Course loaded successfully')
      } else {
        console.error('Error loading course:', data.error)
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Course not found</p>
          <Link href="/faculty/courses" className="text-blue-600 hover:text-blue-700">
            ← Back to Courses
          </Link>
        </div>
      </div>
    )
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

  const handleUploadClick = () => {
    console.log('Upload button clicked')
    console.log('Navigating to /faculty/upload?courseId=' + courseId)
    
    // Method 1: Using Link (best)
    const url = `/faculty/upload?courseId=${courseId}`
    console.log('Final URL:', url)
    router.push(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b mb-8">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link href="/faculty/courses" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Courses
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{course.courseCode}</h1>
          <p className="text-gray-600 mt-2">{course.courseName}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-8">
        {/* Course Details */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Programme</p>
              <p className="font-semibold text-gray-900 mt-1">{course.programme.programmeCode}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Semester</p>
              <p className="font-semibold text-gray-900 mt-1">{course.semester}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Credits</p>
              <p className="font-semibold text-gray-900 mt-1">{course.credits}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">L-T-P-S</p>
              <p className="font-semibold text-gray-900 mt-1">
                {course.l}-{course.t}-{course.p}-{course.s}
              </p>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Course Team ({team.length})
          </h2>
          {team.length > 0 ? (
            <div className="space-y-3">
              {team.map((member: any) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.designation}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      member.role === 'COORDINATOR'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {member.role === 'COORDINATOR' ? '📋 Coordinator' : '📝 Contributor'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No team members assigned</p>
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Teaching Content ({contents.length})</h2>
            
            {/* ✅ CORRECT UPLOAD BUTTON */}
            <button
              onClick={handleUploadClick}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              <Upload className="h-4 w-4" />
              Upload
            </button>
          </div>

          {contents.length > 0 ? (
            <div className="space-y-3">
              {contents.map((content: any) => (
                <div
                  key={content.id}
                  className="border rounded-lg overflow-hidden hover:bg-gray-50 transition-colors"
                >
                  <div
                    onClick={() =>
                      setExpandedContent(
                        expandedContent === content.id ? null : content.id
                      )
                    }
                    className="p-4 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{content.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {content.contentType.replace(/_/g, ' ')} • {content.fileName}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          content.approvalStatus
                        )}`}
                      >
                        {content.approvalStatus === 'CHANGES_REQUIRED'
                          ? 'Changes Required'
                          : content.approvalStatus}
                      </span>
                      {expandedContent === content.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {expandedContent === content.id && (
                    <div className="p-4 bg-gray-50 border-t space-y-3">
                      <div className="text-sm">
                        <p className="text-gray-600">
                          📅 Uploaded:{' '}
                          {new Date(content.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600">
                          📄 Size:{' '}
                          {(content.fileSize / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>

                      {content.coordinatorNotes && (
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                          <p className="text-xs font-semibold text-orange-900 mb-1">
                            📝 Coordinator Feedback:
                          </p>
                          <p className="text-sm text-orange-800">
                            {content.coordinatorNotes}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {content.filePath && (
                          <a
                            href={content.filePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-600">
              <p className="mb-4">No content uploaded yet</p>
              <button
                onClick={handleUploadClick}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Upload Your First Content
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
