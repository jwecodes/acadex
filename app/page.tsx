import Link from 'next/link'
import { GraduationCap, BookOpen, Users, Shield, Upload, Download, CheckCircle, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header/Navigation */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TCMS
                </h1>
                <p className="text-xs text-gray-600">Teaching Content Management System</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Features
              </a>
              <a href="#portals" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Portals
              </a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                About
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Streamline Your
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Teaching Content
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            A comprehensive platform for managing academic content, facilitating seamless collaboration 
            between faculty, coordinators, and students.
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="#portals" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Get Started
            </a>
            <a 
              href="#features" 
              className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all border-2 border-gray-200"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
            <div className="text-gray-600">Digital</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-gray-600">Access</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-pink-600 mb-2">Secure</div>
            <div className="text-gray-600">Storage</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">Easy</div>
            <div className="text-gray-600">Management</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h3>
            <p className="text-xl text-gray-600">Everything you need to manage academic content efficiently</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Upload className="h-7 w-7 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Easy Upload</h4>
              <p className="text-gray-700">
                Faculty can easily upload lecture materials, assignments, and resources with a simple interface.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Content Approval</h4>
              <p className="text-gray-700">
                Coordinators can review and approve content before it becomes available to students.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-8 rounded-2xl hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-pink-600 rounded-xl flex items-center justify-center mb-4">
                <Download className="h-7 w-7 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Student Access</h4>
              <p className="text-gray-700">
                Students can browse and download all approved course materials anytime, anywhere.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Secure Storage</h4>
              <p className="text-gray-700">
                All files are securely stored in the cloud with proper access control and backup.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-2xl hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Role Management</h4>
              <p className="text-gray-700">
                Different portals for admin, faculty, and students with appropriate permissions.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-orange-600 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Analytics</h4>
              <p className="text-gray-700">
                Track uploads, downloads, and content status with comprehensive analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section id="portals" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Portal</h3>
            <p className="text-xl text-gray-600">Access the system based on your role</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Admin Portal */}
            <Link href="/admin/dashboard">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer group">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Shield className="h-8 w-8" />
                  </div>
                  <h4 className="text-2xl font-bold mb-2">Admin Portal</h4>
                  <p className="text-blue-100">Manage the entire system</p>
                </div>
                <div className="p-8">
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      Manage programmes & courses
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      Add faculty & students
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      Review content approvals
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      View analytics & reports
                    </li>
                  </ul>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                    Access Admin Portal →
                  </button>
                </div>
              </div>
            </Link>

            {/* Faculty Portal */}
            <Link href="/faculty/login">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer group">
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-8 text-white">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <h4 className="text-2xl font-bold mb-2">Faculty Portal</h4>
                  <p className="text-purple-100">Upload & manage content</p>
                </div>
                <div className="p-8">
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                      Upload teaching materials
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                      View assigned courses
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                      Track approval status
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                      Manage course content
                    </li>
                  </ul>
                  <button className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                    Access Faculty Portal →
                  </button>
                </div>
              </div>
            </Link>

            {/* Student Portal */}
            <Link href="/student/login">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer group">
                <div className="bg-gradient-to-br from-pink-600 to-pink-700 p-8 text-white">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <GraduationCap className="h-8 w-8" />
                  </div>
                  <h4 className="text-2xl font-bold mb-2">Student Portal</h4>
                  <p className="text-pink-100">Access course materials</p>
                </div>
                <div className="p-8">
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="h-5 w-5 text-pink-600" />
                      View enrolled courses
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="h-5 w-5 text-pink-600" />
                      Download course materials
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="h-5 w-5 text-pink-600" />
                      Access lecture notes
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="h-5 w-5 text-pink-600" />
                      Get assignments & resources
                    </li>
                  </ul>
                  <button className="w-full bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transition-colors">
                    Access Student Portal →
                  </button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">TCMS</span>
              </div>
              <p className="text-gray-400">
                Teaching Content Management System - Streamlining academic content delivery.
              </p>
            </div>
            <div>
              <h5 className="font-bold text-white mb-4">Quick Links</h5>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#portals" className="hover:text-white transition-colors">Portals</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white mb-4">Contact</h5>
              <p className="text-gray-400">
                For support and inquiries, please contact your system administrator.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 Teaching Content Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
