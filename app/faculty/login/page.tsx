// 'use client'
// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { LogIn, AlertCircle, Mail } from 'lucide-react'

// export default function FacultyLoginPage() {
//   const router = useRouter()
//   const [email, setEmail] = useState('')
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')

//     if (!email.trim()) {
//       setError('Please enter your email')
//       return
//     }

//     setLoading(true)

//     try {
//       console.log('Attempting login with email:', email)

//       // Call API to verify email and get faculty data
//       const res = await fetch('/api/faculty/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email })
//       })

//       console.log('Login API response status:', res.status)

//       const data = await res.json()

//       console.log('Login API response:', data)

//       if (!data.success) {
//         setError(data.error || 'Faculty not found')
//         return
//       }

//       if (!data.faculty) {
//         setError('Invalid response from server')
//         return
//       }

//       // Store faculty data in localStorage
//       console.log('Storing faculty data:', data.faculty)
//       localStorage.setItem('faculty', JSON.stringify(data.faculty))
//       localStorage.setItem('facultyId', data.faculty.id)

//       console.log('Redirecting to dashboard')
//       // Redirect to dashboard
//       router.push('/faculty/dashboard')
//     } catch (err: any) {
//       console.error('Login error:', err)
//       setError(err.message || 'Login failed')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
//         <div className="text-center mb-8">
//           <div className="inline-block p-3 bg-blue-100 rounded-lg mb-4">
//             <LogIn className="h-8 w-8 text-blue-600" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900">Faculty Portal</h1>
//           <p className="text-gray-600 mt-2">Enter your email to access</p>
//         </div>

//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
//             <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
//             <p className="text-sm text-red-800">{error}</p>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
//             <div className="relative">
//               <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="your@university.edu"
//                 className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
//                 required
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition-colors"
//           >
//             {loading ? 'Logging in...' : 'Sign In'}
//           </button>
//         </form>

//         <p className="text-center text-gray-600 mt-6 text-sm">
//           Admin? <a href="/admin/login" className="text-blue-600 hover:text-blue-700 font-semibold">Go to Admin Portal</a>
//         </p>
//       </div>
//     </div>
//   )
// }

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock } from 'lucide-react'

export default function FacultyLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/faculty/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() })
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      localStorage.setItem('faculty', JSON.stringify(data.faculty))
      localStorage.setItem('facultyId', data.faculty.id)
      
      router.push('/faculty/dashboard')
    } catch (err: any) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Faculty Portal</h1>
          <p className="text-gray-600 mt-2">Teaching Content Management System</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@university.edu"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Need help? Contact your administrator
        </p>
      </div>
    </div>
  )
}
