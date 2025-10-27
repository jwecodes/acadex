'use client'
import { useEffect, useState } from 'react'
import { getFacultyStats } from '@/app/actions/faculty'
import { BookOpen, FileText, Clock, CheckCircle } from 'lucide-react'

// Temporary faculty ID - will be replaced with actual session data
const FACULTY_ID = 'temp-faculty-id'

export default function FacultyDashboard() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalContent: 0,
    pendingApproval: 0,
    approvedContent: 0
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    // For demo, we'll use the first faculty from database
    // In production, this will come from auth session
    const data = await getFacultyStats(FACULTY_ID)
    setStats(data)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Faculty Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">My Courses</p>
              <p className="text-3xl font-bold mt-1">{stats.totalCourses}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Content</p>
              <p className="text-3xl font-bold mt-1">{stats.totalContent}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Approval</p>
              <p className="text-3xl font-bold mt-1">{stats.pendingApproval}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Approved Content</p>
              <p className="text-3xl font-bold mt-1">{stats.approvedContent}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
        </div>
        <div className="p-6 grid grid-cols-3 gap-4">
          <a href="/faculty/upload-content" className="p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition">
            <h3 className="font-semibold text-indigo-700">Upload Content</h3>
            <p className="text-sm text-gray-600 mt-1">Add new teaching materials</p>
          </a>
          <a href="/faculty/my-courses" className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
            <h3 className="font-semibold text-blue-700">View My Courses</h3>
            <p className="text-sm text-gray-600 mt-1">See all assigned courses</p>
          </a>
          <a href="/faculty/my-content" className="p-4 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition">
            <h3 className="font-semibold text-green-700">My Content</h3>
            <p className="text-sm text-gray-600 mt-1">Manage uploaded materials</p>
          </a>
        </div>
      </div>
    </div>
  )
}
