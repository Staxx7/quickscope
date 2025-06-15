'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Building2, ChevronDown } from 'lucide-react'

interface Company {
  id: string
  company_id: string
  company_name: string
  connection_status: string
  workflow_stage: string
  has_financial_data: boolean
  has_ai_analysis: boolean
  transcript_count: number
}

interface GlobalCompanySelectorProps {
  onCompanySelect?: (company: Company) => void
  showWorkflowStage?: boolean
}

function CompanySelectorContent({ 
  onCompanySelect, 
  showWorkflowStage = true 
}: GlobalCompanySelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  // Get company from URL params
  const companyIdFromUrl = searchParams?.get('company_id') || searchParams?.get('companyId')
  const companyNameFromUrl = searchParams?.get('company_name') || searchParams?.get('companyName')

  useEffect(() => {
    fetchConnectedCompanies()
  }, [])

  useEffect(() => {
    // If company is in URL, select it
    if (companyIdFromUrl && companies.length > 0) {
      const company = companies.find(c => c.company_id === companyIdFromUrl)
      if (company) {
        setSelectedCompany(company)
      }
    }
  }, [companyIdFromUrl, companies])

  const fetchConnectedCompanies = async () => {
    try {
      const response = await fetch('/api/admin/connected-companies')
      const data = await response.json()
      
      if (data.success && data.companies) {
        setCompanies(data.companies)
        
        // Auto-select first company if none selected
        if (data.companies.length > 0 && !selectedCompany && !companyIdFromUrl) {
          const firstCompany = data.companies[0]
          setSelectedCompany(firstCompany)
          updateUrlParams(firstCompany)
        }
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUrlParams = (company: Company) => {
    const current = new URL(window.location.href)
    current.searchParams.set('company_id', company.company_id)
    current.searchParams.set('company_name', company.company_name)
    
    // Update URL without navigation
    window.history.pushState({}, '', current.toString())
  }

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company)
    setIsOpen(false)
    updateUrlParams(company)
    
    // Call callback if provided
    if (onCompanySelect) {
      onCompanySelect(company)
    }
  }

  const getWorkflowStageColor = (stage: string) => {
    switch (stage) {
      case 'needs_prospect_info':
        return 'text-red-400'
      case 'needs_transcript':
        return 'text-yellow-400'
      case 'needs_analysis':
        return 'text-blue-400'
      case 'ready_for_report':
        return 'text-green-400'
      default:
        return 'text-gray-400'
    }
  }

  const getWorkflowStageLabel = (stage: string) => {
    switch (stage) {
      case 'needs_prospect_info':
        return 'Needs Contact Info'
      case 'needs_transcript':
        return 'Ready for Transcript'
      case 'needs_analysis':
        return 'Ready for Analysis'
      case 'ready_for_report':
        return 'Ready for Report'
      default:
        return stage.replace(/_/g, ' ')
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-slate-700 rounded-lg w-64"></div>
      </div>
    )
  }

  if (companies.length === 0) {
    return (
      <div className="text-slate-400 text-sm">
        No connected companies found
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full max-w-md px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Building2 className="w-5 h-5 text-slate-400" />
          <div className="text-left">
            <div className="text-sm font-medium text-white">
              {selectedCompany?.company_name || 'Select Company'}
            </div>
            {showWorkflowStage && selectedCompany && (
              <div className={`text-xs ${getWorkflowStageColor(selectedCompany.workflow_stage)}`}>
                {getWorkflowStageLabel(selectedCompany.workflow_stage)}
              </div>
            )}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          {companies.map((company) => (
            <button
              key={company.company_id}
              onClick={() => handleCompanySelect(company)}
              className={`w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors ${
                selectedCompany?.company_id === company.company_id ? 'bg-slate-700' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">
                    {company.company_name}
                  </div>
                  {showWorkflowStage && (
                    <div className={`text-xs ${getWorkflowStageColor(company.workflow_stage)}`}>
                      {getWorkflowStageLabel(company.workflow_stage)}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  {company.connection_status === 'expired' && (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded">
                      Expired
                    </span>
                  )}
                  {company.has_financial_data && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">
                      Financial
                    </span>
                  )}
                  {company.transcript_count > 0 && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                      {company.transcript_count} Call{company.transcript_count > 1 ? 's' : ''}
                    </span>
                  )}
                  {company.has_ai_analysis && (
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
                      AI
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Loading fallback
function CompanySelectorLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-slate-700 rounded-lg w-64"></div>
    </div>
  )
}

export default function GlobalCompanySelector(props: GlobalCompanySelectorProps) {
  return (
    <Suspense fallback={<CompanySelectorLoading />}>
      <CompanySelectorContent {...props} />
    </Suspense>
  )
}