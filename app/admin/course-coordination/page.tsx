'use client'
import { useState, useEffect } from 'react'
import { Crown, Users, Search, ChevronDown, ChevronRight, FileText, Eye, X, Download, Calendar } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { getCourses, getCourseAllocations, setCoordinator, getTeachingContentByFaculty } from '@/app/actions/admin'

interface Course {
  id: string
  courseCode: string
  courseName: string
  session: string
  semester: number
  credits: number
  programme: {
    id: string
    programmeCode: string
    programmeName: string
    section: string | null
  }
}

interface Allocation {
  id: string
  courseId: string
  role: 'COORDINATOR' | 'CONTRIBUTOR'
  faculty: {
    id: string
    facultyId: string
    name: string
    designation: string
    email: string
    department: string | null
  }
}

interface GroupedCourse {
  courseName: string
  courseCode: string
  courses: Course[]
  allAllocations: (Allocation & { course: Course })[]
}

interface TeachingContent {
  id: string
  title: string
  contentType: string
  fileName: string
  filePath: string
  approvalStatus: string
  createdAt: string
  lectureNumber: number | null
  course: {
    courseCode: string
    courseName: string
    programme: {
      programmeCode: string
    }
  }
}

export default function CourseCoordinationPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [groupedCourses, setGroupedCourses] = useState<GroupedCourse[]>([])
  const [allAllocations, setAllAllocations] = useState<(Allocation & { course: Course })[]>([])
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showContentModal, setShowContentModal] = useState(false)
  const [selectedFacultyContent, setSelectedFacultyContent] = useState<{
    faculty: Allocation['faculty']
    content: TeachingContent[]
  } | null>(null)
  const [loadingContent, setLoadingContent] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const coursesData = await getCourses()
    setCourses(coursesData)

    // Load all allocations
    const allocationsPromises = coursesData.map(async (course: Course) => {
      const allocs = await getCourseAllocations(course.id)
      return allocs.map((alloc: Allocation) => ({ ...alloc, course }))
    })
    
    const allAllocsData = (await Promise.all(allocationsPromises)).flat()
    setAllAllocations(allAllocsData)

    // Group courses by course name (similar courses)
    const grouped = groupCoursesByName(coursesData, allAllocsData)
    setGroupedCourses(grouped)
    setLoading(false)
  }

  const groupCoursesByName = (coursesData: Course[], allocsData: (Allocation & { course: Course })[]) => {
    const groups = new Map<string, GroupedCourse>()

    coursesData.forEach((course: Course) => {
      const key = `${course.courseName}-${course.courseCode}`
      
      if (!groups.has(key)) {
        groups.set(key, {
          courseName: course.courseName,
          courseCode: course.courseCode,
          courses: [],
          allAllocations: []
        })
      }

      const group = groups.get(key)!
      group.courses.push(course)
      
      // Add allocations for this course
      const courseAllocs = allocsData.filter((alloc: Allocation & { course: Course }) => alloc.courseId === course.id)
      group.allAllocations.push(...courseAllocs)
    })

    return Array.from(groups.values()).sort((a, b) => 
      a.courseName.localeCompare(b.courseName)
    )
  }

  const toggleGroup = (courseName: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(courseName)) {
      newExpanded.delete(courseName)
    } else {
      newExpanded.add(courseName)
    }
    setExpandedGroups(newExpanded)
  }

  const handleSetCoordinator = async (courseId: string, allocationId: string, courseName: string) => {
    if (!confirm(`Set this faculty as coordinator for ${courseName}?`)) return
    
    const result = await setCoordinator(courseId, allocationId)
    if (result.success) {
      toast.success('Coordinator updated successfully!')
      loadData()
    } else {
      toast.error(result.error || 'Failed to set coordinator')
    }
  }

  const handleViewContent = async (faculty: Allocation['faculty']) => {
    setLoadingContent(true)
    setShowContentModal(true)
    
    const content = await getTeachingContentByFaculty(faculty.id)
    setSelectedFacultyContent({ faculty, content })
    setLoadingContent(false)
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

  const getApprovalStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'CHANGES_REQUIRED': 'bg-orange-100 text-orange-800',
      'REJECTED': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const filteredGroups = groupedCourses.filter(group =>
    searchTerm === '' ||
    group.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Course Coordination</h1>
        <p className="text-gray-600 mt-1">Manage coordinators for similar courses across different programmes and sections</p>
      </div>

      {/* Content Modal */}
      {showContentModal && selectedFacultyContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Uploaded Content</h2>
                <p className="text-gray-600 mt-1">
                  {selectedFacultyContent.faculty.name} ({selectedFacultyContent.faculty.facultyId})
                </p>
              </div>
              <button onClick={() => setShowContentModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            {loadingContent ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading content...</p>
              </div>
            ) : selectedFacultyContent.content.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No content uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedFacultyContent.content.map((content) => (
                  <div key={content.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{content.title}</h4>
                        <p className="text-sm text-gray-600">
                          {content.course.courseCode} - {content.course.courseName}
                        </p>
                        <p className="text-xs text-gray-500">{content.course.programme.programmeCode}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getContentTypeColor(content.contentType)}`}>
                          {content.contentType.replace(/_/g, ' ')}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getApprovalStatusColor(content.approvalStatus)}`}>
                          {content.approvalStatus}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>{content.fileName}</span>
                      </div>
                      {content.lectureNumber && (
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          Lecture {content.lectureNumber}
                        </span>
                      )}
                      <div className="flex items-center gap-1 ml-auto">
                        <Calendar className="h-4 w-4" />
                        <span className="text-xs">
                          {new Date(content.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => window.open(content.filePath, '_blank')}
                      className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded hover:bg-blue-100 text-sm font-medium flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-700 mt-2">
            Found {filteredGroups.length} course group{filteredGroups.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Grouped Courses */}
      <div className="space-y-4">
        {filteredGroups.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Courses Found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'No courses match your search.' : 'No courses available in the system.'}
            </p>
          </div>
        ) : (
          filteredGroups.map((group) => {
            const isExpanded = expandedGroups.has(group.courseName)
            const coordinator = group.allAllocations.find(a => a.role === 'COORDINATOR')
            const totalFaculty = new Set(group.allAllocations.map(a => a.faculty.id)).size

            return (
              <div key={group.courseName} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Group Header */}
                <div
                  className="p-4 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleGroup(group.courseName)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-gray-600">
                        {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{group.courseName}</h3>
                        <p className="text-sm text-gray-600">{group.courseCode}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{group.courses.length}</p>
                        <p className="text-xs text-gray-600">Sections</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{totalFaculty}</p>
                        <p className="text-xs text-gray-600">Faculty</p>
                      </div>
                      {coordinator ? (
                        <div className="bg-yellow-100 px-3 py-2 rounded-lg flex items-center gap-2">
                          <Crown className="h-4 w-4 text-yellow-700" />
                          <div className="text-left">
                            <p className="text-xs text-yellow-700 font-semibold">Coordinator</p>
                            <p className="text-sm text-yellow-900 font-bold">{coordinator.faculty.name}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-red-100 px-3 py-2 rounded-lg">
                          <p className="text-xs text-red-700 font-semibold">No Coordinator</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="p-6">
                    {/* Course Sections */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Course Sections ({group.courses.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {group.courses.map(course => (
                          <div key={course.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-medium text-gray-900">{course.programme.programmeCode}</p>
                                {course.programme.section && (
                                  <p className="text-xs text-gray-600">Section {course.programme.section}</p>
                                )}
                              </div>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Sem {course.semester}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">{course.session}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* All Faculty Assigned */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Assigned Faculty ({totalFaculty})
                      </h4>
                      
                      {group.allAllocations.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">No faculty assigned to any section yet</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* Group allocations by faculty */}
                          {Array.from(new Set(group.allAllocations.map(a => a.faculty.id))).map(facultyId => {
                            const facultyAllocs = group.allAllocations.filter(a => a.faculty.id === facultyId)
                            const firstAlloc = facultyAllocs[0]
                            const isCoordinator = facultyAllocs.some(a => a.role === 'COORDINATOR')

                            return (
                              <div
                                key={facultyId}
                                className={`border rounded-lg p-4 ${
                                  isCoordinator ? 'bg-yellow-50 border-yellow-300' : 'bg-white border-gray-200'
                                }`}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h5 className="font-semibold text-gray-900">{firstAlloc.faculty.name}</h5>
                                      {isCoordinator && <Crown className="h-4 w-4 text-yellow-600" />}
                                    </div>
                                    <p className="text-xs text-gray-600">{firstAlloc.faculty.designation}</p>
                                    <p className="text-xs text-gray-600">{firstAlloc.faculty.email}</p>
                                  </div>
                                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                    isCoordinator 
                                      ? 'bg-yellow-200 text-yellow-900' 
                                      : 'bg-gray-200 text-gray-800'
                                  }`}>
                                    {isCoordinator ? 'COORDINATOR' : 'CONTRIBUTOR'}
                                  </span>
                                </div>

                                <div className="mb-3">
                                  <p className="text-xs text-gray-600 mb-1">Teaching sections:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {facultyAllocs.map(alloc => (
                                      <span key={alloc.id} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                        {alloc.course.programme.programmeCode}
                                        {alloc.course.programme.section ? ` (${alloc.course.programme.section})` : ''}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  {!isCoordinator && (
                                    <button
                                      onClick={() => handleSetCoordinator(
                                        facultyAllocs[0].courseId,
                                        facultyAllocs[0].id,
                                        group.courseName
                                      )}
                                      className="flex-1 bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg hover:bg-yellow-200 font-medium text-sm flex items-center justify-center gap-2"
                                    >
                                      <Crown className="h-4 w-4" />
                                      Make Coordinator
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleViewContent(firstAlloc.faculty)}
                                    className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 font-medium text-sm flex items-center justify-center gap-2"
                                  >
                                    <Eye className="h-4 w-4" />
                                    View Content
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
