'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Prospect {
  id: string
  company_name: string
  email: string
  user_type: string
  qb_company_id: string | null
  created_at: string
}

export default function UserManagementPage() {
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadProspects()
  }, [])

  const loadProspects = async () => {
    try {
      const { data, error } = await supabase
        .from('prospects')
        .select('id, company_name, email, user_type, qb_company_id, created_at')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProspects(data || [])
    } catch (error) {
      console.error('Error loading prospects:', error)
      setMessage('Failed to load prospects')
    } finally {
      setLoading(false)
    }
  }

  const updateUserType = async (prospectId: string, newUserType: string) => {
    try {
      const { error } = await supabase
        .from('prospects')
        .update({ user_type: newUserType })
        .eq('id', prospectId)

      if (error) throw error

      setMessage('User type updated successfully')
      loadProspects() // Reload the list
    } catch (error) {
      console.error('Error updating user type:', error)
      setMessage('Failed to update user type')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white">Loading users...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-slate-400">Manage user types for connected QuickBooks accounts</p>
        </div>

        {message && (
          <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
            {message}
          </div>
        )}

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 text-slate-300">Company</th>
                  <th className="text-left p-4 text-slate-300">Email</th>
                  <th className="text-left p-4 text-slate-300">QB Connected</th>
                  <th className="text-left p-4 text-slate-300">User Type</th>
                  <th className="text-left p-4 text-slate-300">Created</th>
                  <th className="text-left p-4 text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {prospects.map((prospect) => (
                  <tr key={prospect.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                    <td className="p-4 text-white">{prospect.company_name}</td>
                    <td className="p-4 text-slate-300">{prospect.email}</td>
                    <td className="p-4">
                      {prospect.qb_company_id ? (
                        <span className="text-green-400">✓ Connected</span>
                      ) : (
                        <span className="text-slate-500">Not connected</span>
                      )}
                    </td>
                    <td className="p-4">
                      <select
                        value={prospect.user_type}
                        onChange={(e) => updateUserType(prospect.id, e.target.value)}
                        className="bg-slate-700 text-white px-3 py-1 rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                      >
                        <option value="prospect">Prospect</option>
                        <option value="internal">Internal Team</option>
                        <option value="paid_user">Paid User</option>
                      </select>
                    </td>
                    <td className="p-4 text-slate-400 text-sm">
                      {new Date(prospect.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          const userType = prospects.find(p => p.id === prospect.id)?.user_type
                          if (userType === 'internal' || userType === 'paid_user') {
                            window.open('/admin/dashboard', '_blank')
                          } else {
                            window.open('/success?company=' + prospect.qb_company_id, '_blank')
                          }
                        }}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        View Experience →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-sm text-slate-400">
          <p>• <strong>Prospect:</strong> External sales leads who see the success page after connecting</p>
          <p>• <strong>Internal Team:</strong> Your team members who go directly to the admin dashboard</p>
          <p>• <strong>Paid User:</strong> Subscription customers who access the full dashboard</p>
        </div>
      </div>
    </div>
  )
}