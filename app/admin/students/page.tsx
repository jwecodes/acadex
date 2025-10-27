'use client'
import { useState, useEffect } from 'react'
import { Plus, Trash2, Upload as UploadIcon, Download } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import * as XLSX from 'xlsx'

interface Student {
  id: string
  studentId: string
  name: string
  email: string
  contactNo: string | null
  currentSemester: number
  section: string | null
  programme: {
    programmeCode: string
    programmeName: string
    section: string | null
    session: string
  }
}

interface Programme {
  id: string
  programmeCode: string
  programmeName: string
  section: string | null
  session: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    contactNo: '',
    programmeId: '',
    currentSemester: 1,
    section: ''
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [studentsRes, programmesRes] = await Promise.all([
      fetch('/api/admin/students'),
      fetch('/api/admin/programmes')
    ])
    
    const studentsData = await studentsRes.json()
    const programmesData = await programmesRes.json()
    
    if (studentsData.success) setStudents(studentsData.students)
    if (programmesData.success) setProgrammes(programmesData.programmes)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/students', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { id: editingId, ...formData } : formData)
      })

      const data = await response.json()

      if (data.success) {
        toast.success(editingId ? 'Student updated!' : 'Student created!')
        resetForm()
        loadData()
      } else {
        toast.error(data.error || 'An error occurred')
      }
    } catch (error) {
      toast.error('Failed to save student')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      studentId: '',
      name: '',
      email: '',
      contactNo: '',
      programmeId: '',
      currentSemester: 1,
      section: ''
    })
    setShowForm(false)
    setEditingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this student?')) return

    try {
      const response = await fetch(`/api/admin/students/${id}`, { method: 'DELETE' })
      const data = await response.json()

      if (data.success) {
        toast.success('Student deleted!')
        loadData()
      } else {
        toast.error(data.error || 'Failed to delete')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  // Bulk Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      const response = await fetch('/api/admin/students/bulk-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students: jsonData })
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Successfully uploaded ${result.count} students!`)
        loadData()
      } else {
        toast.error(result.error || 'Upload failed')
      }
    } catch (error) {
      toast.error('Failed to process file')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  // Download Template
  const downloadTemplate = () => {
    const template = [
      {
        'Student ID': '2024001',
        'Name': 'John Doe',
        'Email': 'john.doe@university.edu',
        'Contact No': '+91-9876543210',
        'Programme Code': 'BTECH-CSE',
        'Current Semester': 1,
        'Section': 'A'
      }
    ]

    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Students')
    XLSX.writeFile(wb, 'students_template.xlsx')
    toast.success('Template downloaded!')
  }

  return (
    <div>
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students Management</h1>
          <p className="text-gray-600 mt-1">Manage student records and enrollments</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={downloadTemplate}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
          >
            <Download className="h-5 w-5" />
            Download Template
          </button>
          <label className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 cursor-pointer">
            <UploadIcon className="h-5 w-5" />
            {uploading ? 'Uploading...' : 'Bulk Upload'}
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Add Student
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Total Students</p>
          <p className="text-3xl font-bold text-blue-600">{students.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Active Programmes</p>
          <p className="text-3xl font-bold text-green-600">{programmes.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">This Session</p>
          <p className="text-3xl font-bold text-purple-600">
            {students.filter((s) => s.programme?.session === '2024-2025').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">First Year</p>
          <p className="text-3xl font-bold text-orange-600">
            {students.filter((s) => s.currentSemester <= 2).length}
          </p>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            {editingId ? 'Edit Student' : 'Add New Student'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Student ID</label>
                <input
                  type="text"
                  placeholder="2024001"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
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
                  placeholder="student@university.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
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
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Programme</label>
                <select
                  value={formData.programmeId}
                  onChange={(e) => setFormData({ ...formData, programmeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                >
                  <option value="">Select Programme</option>
                  {programmes.map((prog) => (
                    <option key={prog.id} value={prog.id}>
                      {prog.programmeCode} - {prog.programmeName}
                      {prog.section ? ` (Section ${prog.section})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Current Semester</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={formData.currentSemester}
                  onChange={(e) => setFormData({ ...formData, currentSemester: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Section</label>
                <input
                  type="text"
                  placeholder="A"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
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
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Student ID</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Programme</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Semester</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Section</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-800 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-600 text-base">
                  No students added yet.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{student.studentId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    {student.programme.programmeCode}
                    {student.programme.section ? ` (${student.programme.section})` : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{student.currentSemester}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{student.section || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button onClick={() => handleDelete(student.id)} className="text-red-700 hover:text-red-900">
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
