// app/admin/debug/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function DebugPage() {
  const [checks, setChecks] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    runDiagnostics()
  }, [])

  const runDiagnostics = async () => {
    const results: any = {}

    // Check environment variables
    results.env = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      qboClientId: !!process.env.QBO_CLIENT_ID,
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT || '3000'
    }

    // Check API endpoints
    try {
      const prospectRes = await fetch('/api/admin/prospects')
      results.api = {
        prospects: prospectRes.ok,
        status: prospectRes.status
      }
    } catch (e) {
      results.api = { prospects: false, error: e instanceof Error ? e.message : String(e) }
    }

    // Check Supabase connection
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      )
      
      const { error } = await supabase.from('prospects').select('count').single()
      results.database = {
        connected: !error,
        error: error?.message
      }
    } catch (e) {
      results.database = { connected: false, error: e instanceof Error ? e.message : String(e) }
    }

    setChecks(results)
    setLoading(false)
  }

  const StatusIcon = ({ success }: { success: boolean }) => {
    return success ? 
      <CheckCircle className="text-green-500" size={20} /> : 
      <XCircle className="text-red-500" size={20} />
  }

  if (loading) {
    return <div className="p-8">Running diagnostics...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">System Diagnostics</h1>

        {/* Environment Variables */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Supabase URL</span>
              <StatusIcon success={checks.env?.supabaseUrl} />
            </div>
            <div className="flex items-center justify-between">
              <span>Supabase Anon Key</span>
              <StatusIcon success={checks.env?.supabaseAnonKey} />
            </div>
            <div className="flex items-center justify-between">
              <span>QuickBooks Client ID</span>
              <StatusIcon success={checks.env?.qboClientId} />
            </div>
            <div className="flex items-center justify-between">
              <span>Environment</span>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                {checks.env?.nodeEnv}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Port</span>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                {checks.env?.port}
              </span>
            </div>
          </div>
        </div>

        {/* API Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Endpoints</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>/api/admin/prospects</span>
              <div className="flex items-center gap-2">
                <StatusIcon success={checks.api?.prospects} />
                {checks.api?.status && (
                  <span className="text-sm text-gray-500">
                    Status: {checks.api.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Database Connection */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Database Connection</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Supabase Connected</span>
              <StatusIcon success={checks.database?.connected} />
            </div>
            {checks.database?.error && (
              <div className="mt-2 p-3 bg-red-50 text-red-700 rounded">
                Error: {checks.database.error}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Refresh Diagnostics
            </button>
            <button
              onClick={() => {
                localStorage.clear()
                alert('Local storage cleared!')
              }}
              className="w-full py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Clear Local Storage
            </button>
            <button
              onClick={async () => {
                const res = await fetch('/api/admin/prospects')
                const data = await res.json()
                console.log('Prospects:', data)
                alert('Check console for prospects data')
              }}
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Test Prospects API
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
