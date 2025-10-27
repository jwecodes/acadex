'use client'
import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Upload as UploadIcon, Search } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { createCourse, getCourses, updateCourse, deleteCourse, getProgrammes, bulkUploadCourses } from '@/app/actions/admin'
import BulkUpload from '@/components/admin/BulkUpload'

interface Programme {
  id: string
  programmeName: string
  programmeCode: string
  session: string
  currentSemester: number
  section: string | null
}

interface Course {
  id: string
  session: string
  semester: number
  courseCode: string
  courseName: string
  l: number
  t: number
  p: number
  s: number
  credits: number
  totalHours: number
  courseType: string
  roomNo: string | null
  attendance: boolean
  category: string
  programme: Programme
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    session: '',
    programmeId: '',
    semester: 1,
    courseCode: '',
    courseName: '',
    l: 3,
    t: 1,
    p: 0,
    s: 0,
    credits: 4,
    totalHours: 4,
    courseType: 'THEORY' as 'THEORY' | 'PRACTICAL' | 'LAB',
    roomNo: '',
    attendance: true,
    category: 'MANDATORY' as 'MANDATORY' | 'ELECTIVE'
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    // Filter courses based on search term
    if (searchTerm.trim() === '') {
      setFilteredCourses(courses)
    } else {
      const filtered = courses.filter(course => 
        course.session.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.programme.programmeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.programme.programmeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCourses(filtered)
    }
  }, [searchTerm, courses])

  const loadData = async () => {
    const [coursesData, programmesData] = await Promise.all([
      getCourses(),
      getProgrammes()
    ])
    setCourses(coursesData)
    setFilteredCourses(coursesData)
    setProgrammes(programmesData)
  }

  // Auto-fill session and semester when programme is selected
  const handleProgrammeChange = (programmeId: string) => {
    const selectedProgramme = programmes.find(p => p.id === programmeId)
    if (selectedProgramme) {
      setFormData({
        ...formData,
        programmeId,
        session: selectedProgramme.session,
        semester: selectedProgramme.currentSemester
      })
    } else {
      setFormData({
        ...formData,
        programmeId,
        session: '',
        semester: 1
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const submitData = {
      ...formData,
      roomNo: formData.roomNo || undefined
    }
    
    const result = editingId 
      ? await updateCourse(editingId, submitData)
      : await createCourse(submitData)
    
    if (result.success) {
      toast.success(editingId ? 'Course updated!' : 'Course created!')
      resetForm()
      await loadData()
    } else {
      toast.error(result.error || 'An error occurred')
    }
    
    setLoading(false)
  }

  const resetForm = () => {
    setFormData({
      session: '',
      programmeId: '',
      semester: 1,
      courseCode: '',
      courseName: '',
      l: 3,
      t: 1,
      p: 0,
      s: 0,
      credits: 4,
      totalHours: 4,
      courseType: 'THEORY',
      roomNo: '',
      attendance: true,
      category: 'MANDATORY'
    })
    setShowForm(false)
    setEditingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course?')) return
    
    const result = await deleteCourse(id)
    if (result.success) {
      toast.success('Course deleted!')
      loadData()
    } else {
      toast.error(result.error || 'Failed to delete')
    }
  }

  const handleEdit = (course: Course) => {
    setFormData({
      session: course.session,
      programmeId: course.programme.id,
      semester: course.semester,
      courseCode: course.courseCode,
      courseName: course.courseName,
      l: course.l,
      t: course.t,
      p: course.p,
      s: course.s,
      credits: course.credits,
      totalHours: course.totalHours,
      courseType: course.courseType as any,
      roomNo: course.roomNo || '',
      attendance: course.attendance,
      category: course.category as any
    })
    setEditingId(course.id)
    setShowForm(true)
  }

  const handleBulkUpload = async (data: any[]) => {
    const result = await bulkUploadCourses(data)
    if (result.success) {
      await loadData()
    }
    return result
  }

  const handleCloseBulkUpload = () => {
    setShowBulkUpload(false)
    loadData()
  }

  return (
    <div>
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Courses Management</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowBulkUpload(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
          >
            <UploadIcon className="h-5 w-5" />
            Bulk Upload
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Add Course
          </button>
        </div>
      </div>

      {showBulkUpload && (
        <BulkUpload
          type="courses"
          onUpload={handleBulkUpload}
          onClose={handleCloseBulkUpload}
        />
      )}

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by session, programme code/name, course code, or course name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-700 mt-2">
            Found {filteredCourses.length} result{filteredCourses.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            {editingId ? 'Edit Course' : 'Add New Course'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Programme</label>
                <select
                  value={formData.programmeId}
                  onChange={(e) => handleProgrammeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                >
                  <option value="">Select Programme</option>
                  {programmes.map((prog) => (
                    <option key={prog.id} value={prog.id}>
                      {prog.programmeCode} - {prog.programmeName} {prog.section ? `(Sec ${prog.section})` : ''} [{prog.session}]
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">
                  Session <span className="text-green-600 text-xs">(Auto-filled)</span>
                </label>
                <input
                  type="text"
                  placeholder="2024-2025"
                  value={formData.session}
                  onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-gray-50"
                  required
                  readOnly={!!formData.programmeId}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">
                  Semester <span className="text-green-600 text-xs">(Auto-filled)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-gray-50"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Course Code</label>
                <input
                  type="text"
                  placeholder="CS101"
                  value={formData.courseCode}
                  onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Course Name</label>
                <input
                  type="text"
                  placeholder="Data Structures"
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>
            </div>

            {/* L-T-P-S Credits */}
            <div className="border border-gray-300 p-4 rounded-lg bg-gray-50">
              <h3 className="font-semibold mb-3 text-gray-900">L-T-P-S Credits System</h3>
              <div className="grid grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">L (Lecture)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.l}
                    onChange={(e) => setFormData({ ...formData, l: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">T (Tutorial)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.t}
                    onChange={(e) => setFormData({ ...formData, t: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">P (Practical)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.p}
                    onChange={(e) => setFormData({ ...formData, p: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">S (Self-Study)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.s}
                    onChange={(e) => setFormData({ ...formData, s: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">Credits</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Total Hours/Week</label>
                <input
                  type="number"
                  min="0"
                  value={formData.totalHours}
                  onChange={(e) => setFormData({ ...formData, totalHours: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Course Type</label>
                <select
                  value={formData.courseType}
                  onChange={(e) => setFormData({ ...formData, courseType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="THEORY">Theory</option>
                  <option value="PRACTICAL">Practical</option>
                  <option value="LAB">Lab</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="MANDATORY">Mandatory</option>
                  <option value="ELECTIVE">Elective</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Room No.</label>
                <input
                  type="text"
                  placeholder="A-101"
                  value={formData.roomNo}
                  onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="attendance"
                checked={formData.attendance}
                onChange={(e) => setFormData({ ...formData, attendance: e.target.checked })}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor="attendance" className="text-sm font-medium text-gray-800">
                Attendance Required
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
              >
                {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Programme</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Session</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Sem</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">L-T-P-S</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Credits</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-800 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-8 text-center text-gray-600 text-base">
                  {searchTerm ? 'No courses found matching your search.' : 'No courses added yet.'}
                </td>
              </tr>
            ) : (
              filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{course.courseCode}</td>
                  <td className="px-6 py-4 text-gray-900">{course.courseName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{course.programme.programmeCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{course.session}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{course.semester}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{course.l}-{course.t}-{course.p}-{course.s}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{course.credits}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      course.courseType === 'THEORY' ? 'bg-blue-100 text-blue-900' :
                      course.courseType === 'LAB' ? 'bg-green-100 text-green-900' :
                      'bg-purple-100 text-purple-900'
                    }`}>
                      {course.courseType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      course.category === 'MANDATORY' ? 'bg-red-100 text-red-900' : 'bg-yellow-100 text-yellow-900'
                    }`}>
                      {course.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button onClick={() => handleEdit(course)} className="text-blue-700 hover:text-blue-900 mr-4" title="Edit">
                      <Edit className="h-5 w-5 inline" />
                    </button>
                    <button onClick={() => handleDelete(course.id)} className="text-red-700 hover:text-red-900" title="Delete">
                      <Trash2 className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
