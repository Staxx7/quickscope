'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, Database, BarChart3, FileText, ArrowRight } from 'lucide-react'
import CompanyInputForm from '../../../components/CompanyInputForm'
import SalesPipelineManager from '../../../components/SalesPipelineManager'

interface SelectedCompany {
  name: string
  email: string
  company: string
}

export default function AdminMainDashboard() {
  const [selectedCompany, setSelectedCompany] = useState<SelectedCompany | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Advanced tools array
  const advancedTools = [
    { 
      name: 'Deep Financial Analysis', 
      href: '/admin/dashboard/deep-analysis', 
      icon: Zap,
      description: 'Comprehensive AI-powered financial intelligence platform'
    },
    { 
      name: 'Data Extraction', 
      href: '/admin/dashboard/data-extraction', 
      icon: Database,
      description: 'Advanced QuickBooks data mining and extraction'
    },
    { 
      name: 'Advanced Analysis', 
      href: '/admin/dashboard/advanced-analysis', 
      icon: BarChart3,
      description: 'Deep financial analysis with risk assessment and insights'
    },
    { 
      name: 'Report Generation', 
      href: '/admin/dashboard/report-generation', 
      icon: FileText,
      description: 'AI-powered professional audit decks and reports'
    }
  ]

  useEffect(() => {
    // Check authentication
    const authStatus = localStorage.getItem('adminAuth')
    if (authStatus !== 'true') {
      router.push('/admin/dashboard')
      return
    }
    setIsAuthenticated(true)
  }, [router])

  const handleCompanySubmit = async (data: SelectedCompany) => {
    console.log('Company submitted:', data)
    setSelectedCompany(data)
    // Here you would typically redirect to QuickBooks OAuth
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    router.push('/admin/dashboard')
  }

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with logout */}
      <header className="bg-white shadow border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
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
            <button
              onClick={handleLogout}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Financial Analysis Dashboard</h2>
            <p className="text-gray-600 mt-2">Manage your prospects and QuickBooks integrations</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Prospect</h3>
              <CompanyInputForm onSubmit={handleCompanySubmit} />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sales Pipeline</h3>
              <SalesPipelineManager />
            </div>
          </div>

          {/* Advanced Tools Section */}
          <div className="mt-12">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Advanced Financial Tools</h3>
              <p className="text-gray-600 mt-2">Professional-grade financial analysis and reporting</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {advancedTools.map((tool) => (
                <div
                  key={tool.name}
                  onClick={() => router.push(tool.href)}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-blue-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <tool.icon className="w-8 h-8 text-blue-600" />
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{tool.name}</h4>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                </div>
              ))}
            </div>
          </div>

          {selectedCompany && (
            <div className="mt-8 p-6 bg-white rounded-lg shadow">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Recently Added</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{selectedCompany.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{selectedCompany.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Company</p>
                  <p className="font-medium">{selectedCompany.company}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
