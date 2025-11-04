'use client'
import { useState } from 'react'
import { Upload, Download, X } from 'lucide-react'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'


interface BulkUploadProps {
  type: 'programmes' | 'courses' | 'faculty'
  onUpload: (data: any[]) => Promise<{ success: boolean; count?: number; error?: string }>
  onClose: () => void
}


export default function BulkUpload({ type, onUpload, onClose }: BulkUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewData, setPreviewData] = useState<any[]>([])


  const getTemplate = () => {
    let template: any[] = []
    let fileName = ''


    if (type === 'programmes') {
      template = [
        {
          'Session': '2024-2025',
          'Programme Code': 'BTECH-CSE',
          'Programme Name': 'B.Tech Computer Science',
          'Duration': 4,
          'Current Semester': 1,
          'Section': 'A',
          'No of Students': 60
        },
        {
          'Session': '2024-2025',
          'Programme Code': 'BTECH-ECE',
          'Programme Name': 'B.Tech Electronics',
          'Duration': 4,
          'Current Semester': 1,
          'Section': 'A',
          'No of Students': 55
        }
      ]
      fileName = 'programmes_template.xlsx'
    } else if (type === 'courses') {
      // ✅ UPDATED: Changed to match actual course fields with Section
      template = [
        {
          'Session': '2024-2025',
          'Programme Code': 'BTECH-CSE',
          'Section': 'A',
          'Course Code': 'CS101',
          'Course Name': 'Data Structures',
          'Semester': 3,
          'L': 3,
          'T': 1,
          'P': 0,
          'S': 0,
          'Credits': 4,
          'Total Hours': 4,
          'Course Type': 'CORE',
          'Delivery Mode': 'THEORY',
          'Category': 'MANDATORY',
          'Room No': 'A-101',
          'Attendance': 'Yes'
        },
        {
          'Session': '2024-2025',
          'Programme Code': 'BTECH-CSE',
          'Section': 'A',
          'Course Code': 'CS102',
          'Course Name': 'Web Development',
          'Semester': 4,
          'L': 2,
          'T': 1,
          'P': 2,
          'S': 0,
          'Credits': 4,
          'Total Hours': 5,
          'Course Type': 'OPEN_ELECTIVE',
          'Delivery Mode': 'BOTH',
          'Category': 'ELECTIVE',
          'Room No': 'B-205',
          'Attendance': 'Yes'
        },
        {
          'Session': '2024-2025',
          'Programme Code': 'BTECH-CSE',
          'Section': 'B',
          'Course Code': 'CS103',
          'Course Name': 'Database Lab',
          'Semester': 3,
          'L': 0,
          'T': 0,
          'P': 3,
          'S': 0,
          'Credits': 2,
          'Total Hours': 3,
          'Course Type': 'CORE',
          'Delivery Mode': 'PRACTICAL',
          'Category': 'MANDATORY',
          'Room No': 'LAB-01',
          'Attendance': 'Yes'
        }
      ]
      fileName = 'courses_template.xlsx'
    } else if (type === 'faculty') {
      // ✅ FIXED: Added Course Code, Programme Code, and Section columns
      template = [
        {
          'Faculty ID': 'FAC001',
          'Name': 'Dr. John Doe',
          'Designation': 'Professor',
          'Email': 'john.doe@university.edu',
          'Contact No': '+91-9876543210',
          'Department': 'Computer Science',
          'Course Code': 'CS101',
          'Programme Code': 'BTECH-CSE',
          'Section': 'A'
        },
        {
          'Faculty ID': 'FAC001',
          'Name': 'Dr. John Doe',
          'Designation': 'Professor',
          'Email': 'john.doe@university.edu',
          'Contact No': '+91-9876543210',
          'Department': 'Computer Science',
          'Course Code': 'CS102',
          'Programme Code': 'BTECH-CSE',
          'Section': 'B'
        },
        {
          'Faculty ID': 'FAC002',
          'Name': 'Dr. Jane Smith',
          'Designation': 'Assistant Professor',
          'Email': 'jane.smith@university.edu',
          'Contact No': '+91-9876543211',
          'Department': 'Computer Science',
          'Course Code': 'IT201',
          'Programme Code': 'BTECH-IT',
          'Section': 'A'
        }
      ]
      fileName = 'faculty_template.xlsx'
    }


    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Template')


    // Download
    XLSX.writeFile(wb, fileName)
    toast.success('Template downloaded!')
  }


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return


    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)


        if (jsonData.length === 0) {
          toast.error('Excel file is empty')
          return
        }


        // Convert to plain objects to avoid Server Action serialization issues
        const plainData = JSON.parse(JSON.stringify(jsonData))
        setPreviewData(plainData)
        toast.success(`${plainData.length} rows loaded. Review and click Upload.`)
      } catch (error) {
        console.error('File parsing error:', error)
        toast.error('Failed to read file. Please use the template format.')
      }
    }
    reader.readAsArrayBuffer(file)
  }


  const handleUpload = async () => {
    if (previewData.length === 0) {
      toast.error('No data to upload')
      return
    }


    setUploading(true)
    try {
      // Ensure data is plain objects before sending to server action
      const plainData = JSON.parse(JSON.stringify(previewData))
      const result = await onUpload(plainData)
      
      if (result.success) {
        toast.success(`Successfully uploaded ${result.count} records!`)
        setPreviewData([])
        onClose()
      } else {
        toast.error(result.error || 'Upload failed')
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Bulk Upload {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>


        <div className="space-y-4">
          {/* Download Template */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-blue-900">Step 1: Download Template</h3>
            <p className="text-sm text-gray-600 mb-3">
              Download the Excel template with sample data. Replace the sample data with your actual data.
            </p>
            <button
              onClick={getTemplate}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Download className="h-5 w-5" />
              Download Template
            </button>
          </div>


          {/* Upload File */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-green-900">Step 2: Upload Filled Template</h3>
            <p className="text-sm text-gray-600 mb-3">
              Select the Excel file you filled with data. Make sure column names match the template.
            </p>
            <label className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 cursor-pointer inline-flex">
              <Upload className="h-5 w-5" />
              Choose File
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>


          {/* Preview Data */}
          {previewData.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-yellow-900">Step 3: Preview & Upload</h3>
              <p className="text-sm text-gray-600 mb-3">
                {previewData.length} rows loaded. Review the data below and click Upload to save to database.
              </p>
              
              <div className="max-h-60 overflow-auto mb-4 bg-white rounded border">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      {Object.keys(previewData[0]).map((key) => (
                        <th key={key} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(0, 10).map((row, idx) => (
                      <tr key={idx} className="border-b">
                        {Object.values(row).map((val: any, i) => (
                          <td key={i} className="px-3 py-2 whitespace-nowrap">
                            {val?.toString() || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {previewData.length > 10 && (
                  <div className="text-center py-2 text-sm text-gray-500 bg-gray-50">
                    ... and {previewData.length - 10} more rows
                  </div>
                )}
              </div>


              <button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 font-semibold"
              >
                {uploading ? 'Uploading...' : `Upload ${previewData.length} Records`}
              </button>
            </div>
          )}


          {/* Instructions */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-gray-900">Important Notes:</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Do not change column names in the template</li>
              <li>Fill all required fields</li>
              {type === 'programmes' && <li>Session format should be YYYY-YYYY (e.g., 2024-2025)</li>}
              {type === 'courses' && (
                <>
                  <li>Make sure Programme Code exists before uploading courses</li>
                  <li>Section must match an existing section for the programme</li>
                  <li>Course codes must be unique within a programme & section</li>
                </>
              )}
              {type === 'faculty' && <li>Same Faculty ID with different courses should be on separate rows</li>}
              <li>Duplicate entries will be skipped automatically</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
