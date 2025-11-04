'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const CONTENT_TYPES = [
  { value: 'LECTURE_PPT', label: '📊 Lecture PPT' },
  { value: 'ASSIGNMENT', label: '📝 Assignment' },
  { value: 'QUESTION_BANK', label: '❓ Question Bank' },
  { value: 'LAB_MANUAL', label: '🔬 Lab Manual' },
  { value: 'COURSE_HANDBOOK', label: '📖 Course Handbook' },
  { value: 'SYLLABUS', label: '📑 Syllabus' },
  { value: 'NOTES', label: '✍️ Notes' },
  { value: 'REFERENCE_MATERIAL', label: '📚 Reference Material' }
]

export default function ContentUploadPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseId = searchParams.get('courseId')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentType: '',
    file: null as File | null
  })
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    const facultyId = localStorage.getItem('facultyId')
    if (!facultyId || !courseId) {
      router.push('/faculty/courses')
    }
  }, [courseId, router])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files?.[0]) {
      setFormData({ ...formData, file: e.dataTransfer.files[0] })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.title || !formData.contentType || !formData.file || !courseId) {
      setError('Please fill all required fields')
      return
    }

    setUploading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('contentType', formData.contentType)
      formDataToSend.append('courseId', courseId)
      formDataToSend.append('file', formData.file)

      const facultyId = localStorage.getItem('facultyId')

      const res = await fetch('/api/faculty/content/upload', {
        method: 'POST',
        headers: { 'x-faculty-id': facultyId || '' },
        body: formDataToSend
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push(`/faculty/courses/${courseId}`)
        }, 2000)
      } else {
        const data = await res.json()
        setError(data.error || 'Upload failed')
      }
    } catch (err: any) {
      setError(err.message || 'Error uploading content')
    } finally {
      setUploading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Successful!</h2>
          <p className="text-gray-600 mb-6">Your content has been uploaded and is pending approval from the coordinator.</p>
          <p className="text-sm text-gray-500">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow mb-8">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link href={`/faculty/courses/${courseId}`} className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Course
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Upload Content</h1>
          <p className="text-gray-600 mt-2">Share teaching materials for your course</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Introduction to Database Design - Lecture 5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
          </div>

          {/* Content Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content Type *</label>
            <select
              value={formData.contentType}
              onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              required
            >
              <option value="">Select a type...</option>
              {CONTENT_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe this content (optional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              rows={4}
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">File *</label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="font-medium text-gray-900 mb-1">Drag and drop your file here</p>
              <p className="text-sm text-gray-600 mb-4">or</p>
              <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer font-medium">
                Browse Files
                <input
                  type="file"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                  className="hidden"
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.zip"
                  required
                />
              </label>

              {formData.file && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-800">
                    ✓ {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-2">Accepted formats: PDF, PPT, DOC, XLS, ZIP (Max 50MB)</p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-6 border-t">
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
            >
              {uploading ? 'Uploading...' : 'Upload Content'}
            </button>
            <Link href={`/faculty/courses/${courseId}`} className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-medium">
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
