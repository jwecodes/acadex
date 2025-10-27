'use client'
import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Upload as UploadIcon, BookOpen, X } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { createFaculty, getFaculty, updateFaculty, deleteFaculty, bulkUploadFaculty, getCourses, allocateFaculty, getCourseAllocations, removeAllocation } from '@/app/actions/admin'
import BulkUpload from '@/components/admin/BulkUpload'

interface Faculty {
  id: string
  facultyId: string
  name: string
  designation: string
  email: string
  contactNo: string
  department: string | null
  session: string
}

interface Course {
  id: string
  courseCode: string
  courseName: string
  session: string
  semester: number
  programme: {
    programmeCode: string
    programmeName: string
  }
}

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [selectedFacultyForCourses, setSelectedFacultyForCourses] = useState<Faculty | null>(null)
  const [facultyCourses, setFacultyCourses] = useState<any[]>([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    facultyId: '',
    name: '',
    designation: '',
    email: '',
    contactNo: '',
    department: '',
    session: ''
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [facultyData, coursesData] = await Promise.all([
      getFaculty(),
      getCourses()
    ])
    setFaculty(facultyData)
    setCourses(coursesData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const result = editingId 
      ? await updateFaculty(editingId, formData)
      : await createFaculty(formData)
    
    if (result.success) {
      toast.success(editingId ? 'Faculty updated!' : 'Faculty created!')
      resetForm()
      await loadData()
    } else {
      toast.error(result.error || 'An error occurred')
    }
    
    setLoading(false)
  }

  const resetForm = () => {
    setFormData({
      facultyId: '',
      name: '',
      designation: '',
      email: '',
      contactNo: '',
      department: '',
      session: ''
    })
    setShowForm(false)
    setEditingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this faculty member? All course allocations will also be removed.')) return
    
    const result = await deleteFaculty(id)
    if (result.success) {
      toast.success('Faculty deleted!')
      loadData()
    } else {
      toast.error(result.error || 'Failed to delete')
    }
  }

  const handleEdit = (fac: Faculty) => {
    setFormData({
      facultyId: fac.facultyId,
      name: fac.name,
      designation: fac.designation,
      email: fac.email,
      contactNo: fac.contactNo,
      department: fac.department || '',
      session: fac.session
    })
    setEditingId(fac.id)
    setShowForm(true)
  }

  const handleManageCourses = async (fac: Faculty) => {
    setSelectedFacultyForCourses(fac)
    setShowCourseModal(true)
    // Load faculty's courses
    const allAllocations = await Promise.all(
      courses.map(course => getCourseAllocations(course.id))
    )
    const facCourses = allAllocations.flat().filter(alloc => alloc.facultyId === fac.id)
    setFacultyCourses(facCourses)
  }

  const handleAllocateCourse = async () => {
    if (!selectedCourse || !selectedFacultyForCourses) {
      toast.error('Please select a course')
      return
    }

    const result = await allocateFaculty(selectedCourse, selectedFacultyForCourses.id, 'CONTRIBUTOR')
    if (result.success) {
      toast.success('Course allocated successfully')
      setSelectedCourse('')
      handleManageCourses(selectedFacultyForCourses)
    } else {
      toast.error(result.error || 'Failed to allocate course')
    }
  }

  const handleRemoveCourse = async (allocationId: string) => {
    if (!confirm('Remove this course allocation?')) return
    
    const result = await removeAllocation(allocationId)
    if (result.success) {
      toast.success('Course allocation removed')
      if (selectedFacultyForCourses) {
        handleManageCourses(selectedFacultyForCourses)
      }
    } else {
      toast.error(result.error || 'Failed to remove')
    }
  }

  const handleBulkUpload = async (data: any[]) => {
    const result = await bulkUploadFaculty(data)
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
        <h1 className="text-3xl font-bold text-gray-900">Faculty Management</h1>
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
            Add Faculty
          </button>
        </div>
      </div>

      {showBulkUpload && (
        <BulkUpload
          type="faculty"
          onUpload={handleBulkUpload}
          onClose={handleCloseBulkUpload}
        />
      )}

      {/* Course Allocation Modal */}
      {showCourseModal && selectedFacultyForCourses && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Manage Courses</h2>
                <p className="text-gray-600 mt-1">{selectedFacultyForCourses.name} ({selectedFacultyForCourses.facultyId})</p>
              </div>
              <button onClick={() => setShowCourseModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3">Allocate New Course</h3>
              <div className="flex gap-3">
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="">Select Course...</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.courseCode} - {course.courseName} (Sem {course.semester}) [{course.session}]
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAllocateCourse}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap font-medium"
                >
                  Allocate
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Allocated Courses ({facultyCourses.length})</h3>
              {facultyCourses.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p>No courses allocated yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {facultyCourses.map((allocation) => {
                    const course = courses.find(c => c.id === allocation.courseId)
                    if (!course) return null
                    return (
                      <div key={allocation.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{course.courseCode} - {course.courseName}</div>
                          <div className="text-sm text-gray-600">
                            {course.programme.programmeCode} • Semester {course.semester} • {course.session}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            allocation.role === 'COORDINATOR' ? 'bg-yellow-100 text-yellow-900' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {allocation.role}
                          </span>
                          <button
                            onClick={() => handleRemoveCourse(allocation.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            {editingId ? 'Edit Faculty' : 'Add New Faculty'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Faculty ID</label>
                <input
                  type="text"
                  placeholder="FAC001"
                  value={formData.facultyId}
                  onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                  disabled={!!editingId}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Full Name</label>
                <input
                  type="text"
                  placeholder="Dr. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Email</label>
                <input
                  type="email"
                  placeholder="john.doe@university.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                  disabled={!!editingId}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Contact Number</label>
                <input
                  type="tel"
                  placeholder="+91-9876543210"
                  value={formData.contactNo}
                  onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Designation</label>
                <select
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                >
                  <option value="">Select Designation</option>
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Lecturer">Lecturer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Department</label>
                <input
                  type="text"
                  placeholder="Computer Science"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Session (Joining Year)</label>
              <input
                type="text"
                placeholder="2024-2025"
                value={formData.session}
                onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
              >
                {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={resetForm} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium">
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
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Designation</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-800 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {faculty.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-600 text-base">
                  No faculty members added yet.
                </td>
              </tr>
            ) : (
              faculty.map((fac) => (
                <tr key={fac.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{fac.facultyId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{fac.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{fac.designation}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{fac.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{fac.contactNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{fac.department || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleManageCourses(fac)}
                        className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 flex items-center gap-1.5 font-medium text-sm transition-colors"
                        title="Allocate Courses"
                      >
                        <BookOpen className="h-4 w-4" />
                        Courses
                      </button>
                      <button 
                        onClick={() => handleEdit(fac)} 
                        className="text-blue-700 hover:text-blue-900 p-1.5" 
                        title="Edit Faculty"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(fac.id)} 
                        className="text-red-700 hover:text-red-900 p-1.5" 
                        title="Delete Faculty"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
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
