// 'use client'
// import { useState, useEffect } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle, X } from 'lucide-react'
// import toast, { Toaster } from 'react-hot-toast'

// const CONTENT_TYPES = [
//   { value: 'LECTURE_PPT', label: 'Lecture PPT' },
//   { value: 'ASSIGNMENT', label: 'Assignment' },
//   { value: 'QUESTION_BANK', label: 'Question Bank' },
//   { value: 'LAB_MANUAL', label: 'Lab Manual' },
//   { value: 'COURSE_HANDBOOK', label: 'Course Handbook' },
//   { value: 'SYLLABUS', label: 'Syllabus' },
//   { value: 'NOTES', label: 'Notes' },
//   { value: 'REFERENCE_MATERIAL', label: 'Reference Material' }
// ]

// export default function UploadContentPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const preSelectedCourseId = searchParams.get('courseId')

//   const [faculty, setFaculty] = useState<any>(null)
//   const [courses, setCourses] = useState<any[]>([])
//   const [uploading, setUploading] = useState(false)
//   const [selectedFile, setSelectedFile] = useState<File | null>(null)
//   const [formData, setFormData] = useState({
//     courseId: preSelectedCourseId || '',
//     contentType: '',
//     title: '',
//     description: '',
//     lectureNumber: ''
//   })

//   useEffect(() => {
//     const facultyData = localStorage.getItem('facultyUser')
//     if (!facultyData) {
//       router.push('/faculty/login')
//       return
//     }
//     const parsedFaculty = JSON.parse(facultyData)
//     setFaculty(parsedFaculty)
//     loadCourses(parsedFaculty.id)
//   }, [router])

//   const loadCourses = async (facultyId: string) => {
//     try {
//       const response = await fetch(`/api/faculty/courses?facultyId=${facultyId}`)
//       const data = await response.json()
//       if (data.success) {
//         setCourses(data.courses)
//       }
//     } catch (error) {
//       toast.error('Failed to load courses')
//     }
//   }

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       // Check file size (max 50MB)
//       if (file.size > 50 * 1024 * 1024) {
//         toast.error('File size must be less than 50MB')
//         return
//       }
//       setSelectedFile(file)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (!selectedFile) {
//       toast.error('Please select a file to upload')
//       return
//     }

//     setUploading(true)

//     try {
//       // Create form data
//       const uploadFormData = new FormData()
//       uploadFormData.append('file', selectedFile)
//       uploadFormData.append('facultyId', faculty.id)
//       uploadFormData.append('courseId', formData.courseId)
//       uploadFormData.append('contentType', formData.contentType)
//       uploadFormData.append('title', formData.title)
//       uploadFormData.append('description', formData.description)
//       if (formData.lectureNumber) {
//         uploadFormData.append('lectureNumber', formData.lectureNumber)
//       }

//       const response = await fetch('/api/faculty/upload', {
//         method: 'POST',
//         body: uploadFormData
//       })

//       const data = await response.json()

//       if (data.success) {
//         toast.success('Content uploaded successfully! Awaiting coordinator approval.')
//         // Reset form
//         setFormData({
//           courseId: preSelectedCourseId || '',
//           contentType: '',
//           title: '',
//           description: '',
//           lectureNumber: ''
//         })
//         setSelectedFile(null)
//         // Redirect to my content page
//         setTimeout(() => router.push('/faculty/my-content'), 2000)
//       } else {
//         toast.error(data.error || 'Upload failed')
//       }
//     } catch (error) {
//       console.error('Upload error:', error)
//       toast.error('An error occurred during upload')
//     } finally {
//       setUploading(false)
//     }
//   }

//   const removeFile = () => {
//     setSelectedFile(null)
//   }

//   return (
//     <div>
//       <Toaster position="top-right" />
      
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Teaching Content</h1>
//         <p className="text-gray-600">Upload lecture materials, assignments, and other course content</p>
//       </div>

//       <div className="max-w-3xl">
//         <div className="bg-white rounded-lg shadow-md p-8">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Course Selection */}
//             <div>
//               <label className="block text-sm font-medium text-gray-800 mb-2">
//                 Select Course <span className="text-red-600">*</span>
//               </label>
//               <select
//                 value={formData.courseId}
//                 onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
//                 required
//               >
//                 <option value="">Choose a course...</option>
//                 {courses.map((course) => (
//                   <option key={course.courseId} value={course.courseId}>
//                     {course.courseCode} - {course.courseName} ({course.programme.programmeCode})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Content Type */}
//             <div>
//               <label className="block text-sm font-medium text-gray-800 mb-2">
//                 Content Type <span className="text-red-600">*</span>
//               </label>
//               <select
//                 value={formData.contentType}
//                 onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
//                 required
//               >
//                 <option value="">Select content type...</option>
//                 {CONTENT_TYPES.map((type) => (
//                   <option key={type.value} value={type.value}>
//                     {type.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Title */}
//             <div>
//               <label className="block text-sm font-medium text-gray-800 mb-2">
//                 Title <span className="text-red-600">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={formData.title}
//                 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                 placeholder="e.g., Introduction to Data Structures"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
//                 required
//               />
//             </div>

//             {/* Lecture Number (conditional) */}
//             {formData.contentType === 'LECTURE_PPT' && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-800 mb-2">
//                   Lecture Number (Optional)
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.lectureNumber}
//                   onChange={(e) => setFormData({ ...formData, lectureNumber: e.target.value })}
//                   placeholder="e.g., 1"
//                   min="1"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
//                 />
//               </div>
//             )}

//             {/* Description */}
//             <div>
//               <label className="block text-sm font-medium text-gray-800 mb-2">
//                 Description (Optional)
//               </label>
//               <textarea
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 placeholder="Add a brief description of this content..."
//                 rows={4}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
//               />
//             </div>

//             {/* File Upload */}
//             <div>
//               <label className="block text-sm font-medium text-gray-800 mb-2">
//                 Upload File <span className="text-red-600">*</span>
//               </label>
              
//               {!selectedFile ? (
//                 <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
//                   <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                     <UploadIcon className="h-12 w-12 text-gray-400 mb-4" />
//                     <p className="mb-2 text-sm text-gray-600">
//                       <span className="font-semibold">Click to upload</span> or drag and drop
//                     </p>
//                     <p className="text-xs text-gray-500">PDF, PPTX, DOCX, ZIP (Max 50MB)</p>
//                   </div>
//                   <input
//                     type="file"
//                     onChange={handleFileChange}
//                     className="hidden"
//                     accept=".pdf,.pptx,.ppt,.docx,.doc,.zip"
//                   />
//                 </label>
//               ) : (
//                 <div className="border-2 border-green-300 bg-green-50 rounded-lg p-4">
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-center gap-3 flex-1">
//                       <CheckCircle className="h-10 w-10 text-green-600 flex-shrink-0" />
//                       <div className="flex-1 min-w-0">
//                         <p className="font-medium text-gray-900 truncate">{selectedFile.name}</p>
//                         <p className="text-sm text-gray-600">
//                           {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
//                         </p>
//                       </div>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={removeFile}
//                       className="text-red-600 hover:text-red-800 ml-4"
//                     >
//                       <X className="h-6 w-6" />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Info Alert */}
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
//               <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
//               <div className="text-sm text-blue-900">
//                 <p className="font-semibold mb-1">Note:</p>
//                 <ul className="list-disc list-inside space-y-1">
//                   <li>Your content will be submitted to the course coordinator for review</li>
//                   <li>You'll be notified once it's approved or if changes are requested</li>
//                   <li>Approved content will be visible to students</li>
//                 </ul>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="flex gap-4">
//               <button
//                 type="submit"
//                 disabled={uploading}
//                 className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold flex items-center justify-center gap-2"
//               >
//                 {uploading ? (
//                   <>
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                     Uploading...
//                   </>
//                 ) : (
//                   <>
//                     <UploadIcon className="h-5 w-5" />
//                     Upload Content
//                   </>
//                 )}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => router.push('/faculty/dashboard')}
//                 className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'

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

export default function UploadPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseId = searchParams.get('courseId')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [contentType, setContentType] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    const facultyId = localStorage.getItem('facultyId')
    
    if (!facultyId) {
      router.push('/faculty/login')
      return
    }

    if (!courseId) {
      router.push('/faculty/courses')
      return
    }
  }, [courseId, router])

  if (!courseId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

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
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title || !contentType || !file) {
      setError('Please fill Title, Type, and select a file')
      return
    }

    setUploading(true)

    try {
      const facultyId = localStorage.getItem('facultyId')
      if (!facultyId) {
        router.push('/faculty/login')
        return
      }

      // ✅ Simple database save (no Supabase for now)
      const formDataToSend = new FormData()
      formDataToSend.append('title', title)
      formDataToSend.append('description', description)
      formDataToSend.append('contentType', contentType)
      formDataToSend.append('courseId', courseId)
      formDataToSend.append('file', file)
      formDataToSend.append('fileUrl', `https://placeholder.com/${file.name}`)

      const res = await fetch('/api/faculty/content/upload', {
        method: 'POST',
        headers: {
          'x-faculty-id': facultyId
        },
        body: formDataToSend
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || 'Upload failed')
        setUploading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(`/faculty/courses/${courseId}`)
      }, 1500)
    } catch (err: any) {
      setError(err.message)
      setUploading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-12 text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Success! ✅</h2>
          <p className="text-gray-600">Content uploaded and saved.</p>
          <p className="text-sm text-gray-500 mt-4">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b mb-8">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link href={`/faculty/courses/${courseId}`} className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Upload Content</h1>
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Lecture 5 - Database Design"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              required
            />
          </div>

          {/* Content Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              required
            >
              <option value="">Select type...</option>
              {CONTENT_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              rows={3}
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
                dragActive ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="font-medium text-gray-900 mb-2">Drag file here or click to browse</p>
              <label className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer font-medium">
                Select File
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.zip"
                  required
                />
              </label>

              {file && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-800">✓ {file.name}</p>
                  <p className="text-xs text-green-700">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-6 border-t">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            <Link
              href={`/faculty/courses/${courseId}`}
              className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-medium text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
