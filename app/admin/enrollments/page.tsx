'use client'
import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

export default function EnrollmentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [studentsRes, coursesRes, enrollmentsRes] = await Promise.all([
      fetch('/api/admin/students'),
      fetch('/api/admin/courses'),
      fetch('/api/admin/enrollments')
    ])

    const studentsData = await studentsRes.json()
    const coursesData = await coursesRes.json()
    const enrollmentsData = await enrollmentsRes.json()

    if (studentsData.success) setStudents(studentsData.students)
    if (coursesData.success) setCourses(coursesData.courses)
    if (enrollmentsData.success) setEnrollments(enrollmentsData.enrollments)
  }

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Student enrolled successfully!')
        setShowForm(false)
        setFormData({ studentId: '', courseId: '' })
        loadData()
      } else {
        toast.error(data.error || 'Enrollment failed')
      }
    } catch (error) {
      toast.error('Failed to enroll student')
    } finally {
      setLoading(false)
    }
  }

  const handleBulkEnroll = async () => {
    if (!confirm('Auto-enroll all students in their programme courses?')) return

    try {
      const response = await fetch('/api/admin/enrollments/bulk', {
        method: 'POST'
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Enrolled ${data.count} students!`)
        loadData()
      } else {
        toast.error(data.error || 'Bulk enrollment failed')
      }
    } catch (error) {
      toast.error('Failed to bulk enroll')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this enrollment?')) return

    try {
      const response = await fetch(`/api/admin/enrollments/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Enrollment removed!')
        loadData()
      } else {
        toast.error(data.error || 'Failed to remove')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const selectedStudent = students.find(s => s.id === formData.studentId)
  const filteredCourses = selectedStudent
    ? courses.filter(c => c.programmeId === selectedStudent.programmeId && c.semester === selectedStudent.currentSemester)
    : courses

  return (
    <div>
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Enrollments</h1>
          <p className="text-gray-600 mt-1">Manage student course enrollments</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleBulkEnroll}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
          >
            Auto-Enroll All Students
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Enroll Student
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Total Enrollments</p>
          <p className="text-3xl font-bold text-blue-600">{enrollments.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Enrolled Students</p>
          <p className="text-3xl font-bold text-green-600">
            {new Set(enrollments.map(e => e.studentId)).size}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Active Courses</p>
          <p className="text-3xl font-bold text-purple-600">
            {new Set(enrollments.map(e => e.courseId)).size}
          </p>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Enroll Student in Course</h2>
          <form onSubmit={handleEnroll} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Select Student</label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value, courseId: '' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  required
                >
                  <option value="">Choose Student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.studentId} - {student.name} (Sem {student.currentSemester})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Select Course</label>
                <select
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  required
                  disabled={!formData.studentId}
                >
                  <option value="">Choose Course</option>
                  {filteredCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.courseCode} - {course.courseName}
                    </option>
                  ))}
                </select>
                {formData.studentId && filteredCourses.length === 0 && (
                  <p className="text-xs text-red-600 mt-1">No courses available for this student's programme/semester</p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Enrolling...' : 'Enroll'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setFormData({ studentId: '', courseId: '' })
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Enrollments Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase">Course</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase">Semester</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase">Enrolled Date</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-800 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {enrollments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-600">
                  No enrollments yet. Use "Auto-Enroll All Students" to get started.
                </td>
              </tr>
            ) : (
              enrollments.map((enrollment: any) => (
                <tr key={enrollment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">
                    {enrollment.student.studentId} - {enrollment.student.name}
                  </td>
                  <td className="px-6 py-4 text-gray-800">
                    {enrollment.course.courseCode} - {enrollment.course.courseName}
                  </td>
                  <td className="px-6 py-4 text-gray-800">{enrollment.course.semester}</td>
                  <td className="px-6 py-4 text-gray-800">
                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(enrollment.id)}
                      className="text-red-700 hover:text-red-900"
                    >
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
