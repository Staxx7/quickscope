'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (password === 'staxx2024') {
      localStorage.setItem('adminAuth', 'true')
      router.push('/admin/dashboard/main') // Updated redirect path
    } else {
      setError('Invalid password')
    }
    setIsLoading(false)
  }

  // ... rest of your existing login page code stays the same
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Enhanced Quickscope Branding */}
<div className="text-center mb-8">
  <div className="flex items-center justify-center mb-4">
    <div className="flex items-center space-x-4">
      {/* STAXX Logo Icon - Same as landing page */}
      <div className="w-10 h-10 flex flex-col justify-center space-y-0.5">
        <div className="h-1.5 bg-black rounded-sm"></div>
        <div className="h-1.5 bg-black rounded-sm w-3/4"></div>
        <div className="h-1.5 bg-black rounded-sm w-1/2"></div>
      </div>
      <div className="text-black flex flex-col items-start">
        <span className="text-2xl font-bold tracking-wider leading-none">QUICKSCOPE</span>
        <div className="text-sm text-gray-600 mt-1">by STAXX</div>
      </div>
    </div>
  </div>
  <h1 className="text-2xl font-bold text-black mb-2">Admin Dashboard</h1>
  <p className="text-gray-600">Enter password to continue</p>
</div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-black placeholder-gray-400 bg-white"
              placeholder="Enter admin password"
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            {isLoading ? 'Logging in...' : 'Access Dashboard'}
          </button>
        </form>

        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>🔒 Authorized personnel only</p>
        </div>
      </div>
    </div>
  )
}
