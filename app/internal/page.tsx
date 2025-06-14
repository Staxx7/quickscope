'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Brain, BarChart3, Users, FileText, Settings, Activity } from 'lucide-react'

export default function InternalPortalPage() {
  const [connectedCompanies, setConnectedCompanies] = useState(0)
  const [activeAnalyses, setActiveAnalyses] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // Get connected companies count
      const { count: companiesCount } = await supabase
        .from('qbo_tokens')
        .select('*', { count: 'exact', head: true })
        .gt('expires_at', new Date().toISOString())

      // Get active analyses count
      const { count: analysesCount } = await supabase
        .from('ai_analyses')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

      setConnectedCompanies(companiesCount || 0)
      setActiveAnalyses(analysesCount || 0)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickLinks = [
    {
      title: 'Admin Dashboard',
      description: 'View all connected accounts and manage prospects',
      href: '/admin/dashboard',
      icon: BarChart3,
      color: 'from-blue-600 to-blue-700'
    },
    {
      title: 'User Management',
      description: 'Configure user types and permissions',
      href: '/admin/user-management',
      icon: Users,
      color: 'from-purple-600 to-purple-700'
    },
    {
      title: 'Financial Analysis',
      description: 'Run advanced financial analysis tools',
      href: '/admin/advanced-analysis',
      icon: Brain,
      color: 'from-emerald-600 to-emerald-700'
    },
    {
      title: 'Report Generation',
      description: 'Generate AI-powered audit reports',
      href: '/admin/dashboard/report-generation',
      icon: FileText,
      color: 'from-amber-600 to-amber-700'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              QuickScope Internal Portal
            </h1>
            <p className="text-xl text-slate-300">
              Team access to administrative tools and dashboards
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Companies</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {loading ? '...' : connectedCompanies}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Recent Analyses</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {loading ? '...' : activeAnalyses}
                  </p>
                </div>
                <Brain className="w-8 h-8 text-purple-400" />
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">System Status</p>
                  <p className="text-xl font-bold text-green-400 mt-1">
                    Operational
                  </p>
                </div>
                <Settings className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="group bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-all duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${link.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {link.title}
                      </h3>
                      <p className="text-slate-400">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>

          {/* Debug Tools */}
          <div className="mt-12 p-6 bg-slate-800/30 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Debug Tools</h3>
            <div className="flex flex-wrap gap-4">
              <a
                href="/api/debug/connections"
                target="_blank"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Check Connections
              </a>
              <a
                href="/api/debug/oauth"
                target="_blank"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                OAuth Credentials
              </a>
              <a
                href="/api/companies"
                target="_blank"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Companies API
              </a>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 text-center text-slate-500 text-sm">
            <p>This page is for internal team use only.</p>
            <p>Bookmark this URL: <code className="bg-slate-800 px-2 py-1 rounded">https://quickscope.info/internal</code></p>
          </div>
        </div>
      </div>
    </div>
  )
}