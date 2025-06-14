'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface QBOToken {
  company_id: string
  company_name: string
  created_at: string
  expires_at: string
}

export default function ConnectedAccountsPage() {
  const [tokens, setTokens] = useState<QBOToken[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTokens()
  }, [])

  const loadTokens = async () => {
    try {
      const { data, error } = await supabase
        .from('qbo_tokens')
        .select('company_id, company_name, created_at, expires_at')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTokens(data || [])
    } catch (error) {
      console.error('Error loading tokens:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
          <h1 className="text-3xl font-bold text-white mb-4">Connected Accounts</h1>
          <p className="text-gray-300 mb-8">Manage your QuickBooks integrations and account connections.</p>
          
          {tokens.length === 0 ? (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
              <p className="text-blue-300">No QuickBooks accounts connected yet.</p>
              <a
                href="/connect"
                className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Connect QuickBooks
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {tokens.map((token) => (
                <div key={token.company_id} className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">QB</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {token.company_name || 'QuickBooks Company'}
                        </h3>
                        <p className="text-sm text-slate-400 font-mono">{token.company_id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Connected</p>
                        <p className="text-sm text-slate-300">{formatDate(token.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Expires</p>
                        <p className="text-sm text-slate-300">{formatDate(token.expires_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        new Date(token.expires_at) > new Date()
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {new Date(token.expires_at) > new Date() ? 'Active' : 'Expired'}
                      </span>
                      <a
                        href="/disconnect"
                        className="px-4 py-2 text-sm text-red-400 hover:text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-all"
                      >
                        Disconnect
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}