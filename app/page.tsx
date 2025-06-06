'use client'
import Button from '../components/Button'

export default function Page() {
  const handleLogin = () => {
    window.location.href = '/api/auth/login'
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-6">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to Ledgr!</h1>
      <Button label="Connect to QuickBooks" onClick={handleLogin} />
    </div>
  )
}
