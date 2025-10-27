'use client'
import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Upload as UploadIcon, Search } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { createProgramme, getProgrammes, updateProgramme, deleteProgramme, bulkUploadProgrammes } from '@/app/actions/admin'
import BulkUpload from '@/components/admin/BulkUpload'

interface Programme {
  id: string
  session: string
  programmeCode: string
  programmeName: string
  duration: number
  currentSemester: number
  section: string | null
  noOfStudents: number
}

export default function ProgrammesPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [filteredProgrammes, setFilteredProgrammes] = useState<Programme[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    session: '',
    programmeCode: '',
    programmeName: '',
    duration: 4,
    currentSemester: 1,
    section: '',
    noOfStudents: 0
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    loadProgrammes()
  }, [])

  useEffect(() => {
    // Filter programmes based on search term
    if (searchTerm.trim() === '') {
      setFilteredProgrammes(programmes)
    } else {
      const filtered = programmes.filter(prog => 
        prog.session.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prog.programmeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prog.programmeName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProgrammes(filtered)
    }
  }, [searchTerm, programmes])

  const loadProgrammes = async () => {
    const data = await getProgrammes()
    setProgrammes(data)
    setFilteredProgrammes(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const submitData = {
      ...formData,
      section: formData.section || undefined
    }
    
    const result = editingId 
      ? await updateProgramme(editingId, submitData)
      : await createProgramme(submitData)
    
    if (result.success) {
      toast.success(editingId ? 'Programme updated!' : 'Programme created!')
      resetForm()
      loadProgrammes()
    } else {
      toast.error(result.error || 'An error occurred')
    }
    
    setLoading(false)
  }

  const resetForm = () => {
    setFormData({
      session: '',
      programmeCode: '',
      programmeName: '',
      duration: 4,
      currentSemester: 1,
      section: '',
      noOfStudents: 0
    })
    setShowForm(false)
    setEditingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this programme? All related courses will be deleted.')) return
    
    const result = await deleteProgramme(id)
    if (result.success) {
      toast.success('Programme deleted!')
      loadProgrammes()
    } else {
      toast.error(result.error || 'Failed to delete')
    }
  }

  const handleEdit = (programme: Programme) => {
    setFormData({
      session: programme.session,
      programmeCode: programme.programmeCode,
      programmeName: programme.programmeName,
      duration: programme.duration,
      currentSemester: programme.currentSemester,
      section: programme.section || '',
      noOfStudents: programme.noOfStudents
    })
    setEditingId(programme.id)
    setShowForm(true)
  }

  const handleBulkUpload = async (data: any[]) => {
    const result = await bulkUploadProgrammes(data)
    if (result.success) {
      await loadProgrammes() // Reload immediately after upload
    }
    return result
  }

  const handleCloseBulkUpload = () => {
    setShowBulkUpload(false)
    loadProgrammes() // Reload when closing to catch any changes
  }

  return (
    <div>
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Programmes Management</h1>
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
            Add Programme
          </button>
        </div>
      </div>

      {showBulkUpload && (
        <BulkUpload
          type="programmes"
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
            placeholder="Search by session, programme code, or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-600 mt-2">
            Found {filteredProgrammes.length} result{filteredProgrammes.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            {editingId ? 'Edit Programme' : 'Add New Programme'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Session</label>
                <input
                  type="text"
                  placeholder="2024-2025"
                  value={formData.session}
                  onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Programme Code</label>
                <input
                  type="text"
                  placeholder="BTECH-CSE"
                  value={formData.programmeCode}
                  onChange={(e) => setFormData({ ...formData, programmeCode: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Programme Name</label>
              <input
                type="text"
                placeholder="B.Tech Computer Science"
                value={formData.programmeName}
                onChange={(e) => setFormData({ ...formData, programmeName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Duration (Years)</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Current Semester</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={formData.currentSemester}
                  onChange={(e) => setFormData({ ...formData, currentSemester: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Section (Optional)</label>
                <input
                  type="text"
                  placeholder="A"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">No. of Students</label>
                <input
                  type="number"
                  min="0"
                  value={formData.noOfStudents}
                  onChange={(e) => setFormData({ ...formData, noOfStudents: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Session</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Semester</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Section</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Students</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProgrammes.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  {searchTerm ? 'No programmes found matching your search.' : 'No programmes added yet.'}
                </td>
              </tr>
            ) : (
              filteredProgrammes.map((programme) => (
                <tr key={programme.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{programme.programmeCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{programme.programmeName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{programme.session}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{programme.duration} years</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{programme.currentSemester}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{programme.section || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{programme.noOfStudents}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleEdit(programme)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      title="Edit"
                    >
                      <Edit className="h-5 w-5 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(programme.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
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
