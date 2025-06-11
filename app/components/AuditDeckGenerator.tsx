'use client'

import React, { useState } from 'react'
import { Download, FileText, Presentation, TrendingUp, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react'

interface AuditDeckData {
  companyInfo: {
    name: string
    industry: string
    revenueRange: string
    employees: string
  }
  executiveSummary: {
    overallHealth: number
    keyStrengths: string[]
    criticalIssues: string[]
    opportunities: string[]
  }
  financialHighlights: {
    revenue: { current: number; growth: number }
    profitability: { margin: number; trend: string }
    cashFlow: { current: number; runway: number }
    efficiency: { score: number; areas: string[] }
  }
  recommendations: {
    immediate: { title: string; impact: string; timeline: string }[]
    shortTerm: { title: string; impact: string; timeline: string }[]
    longTerm: { title: string; impact: string; timeline: string }[]
  }
  benchmarks: {
    industry: string
    revenueGrowth: { company: number; industry: number }
    profitMargin: { company: number; industry: number }
    efficiency: { company: number; industry: number }
  }
}

interface AuditDeckGeneratorProps {
  companyId: string
  companyName: string
}

export default function AuditDeckGenerator({ companyId, companyName }: AuditDeckGeneratorProps) {
  const [generating, setGenerating] = useState(false)
  const [deckData, setDeckData] = useState<AuditDeckData | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState('executive')

  const generateAuditDeck = async () => {
    setGenerating(true)
    try {
      const response = await fetch('/api/qbo/generate-audit-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          template: selectedTemplate
        })
      })

      const result = await response.json()
      setDeckData(result.data)
    } catch (error) {
      console.error('Error generating audit deck:', error)
    } finally {
      setGenerating(false)
    }
  }

  const downloadDeck = async (format: 'pdf' | 'pptx') => {
    if (!deckData) return

    try {
      const response = await fetch('/api/qbo/export-audit-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          deckData,
          format
        })
      })

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${companyName}_Financial_Audit.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading deck:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Financial Audit Deck</h2>
            <p className="text-blue-100">Professional presentation for {companyName}</p>
          </div>
          <Presentation className="h-12 w-12 text-blue-200" />
        </div>
      </div>

      <div className="p-6">
        {/* Template Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Presentation Template</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'executive', name: 'Executive Summary', desc: 'High-level overview for C-suite' },
              { id: 'detailed', name: 'Detailed Analysis', desc: 'Comprehensive financial review' },
              { id: 'investor', name: 'Investor Ready', desc: 'Professional investor presentation' }
            ].map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h4 className="font-semibold text-gray-900">{template.name}</h4>
                <p className="text-sm text-gray-600">{template.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="mb-6">
          <button
            onClick={generateAuditDeck}
            disabled={generating}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <FileText className="h-5 w-5" />
            <span>{generating ? 'Generating Deck...' : 'Generate Audit Deck'}</span>
          </button>
        </div>

        {/* Preview */}
        {deckData && (
          <div className="space-y-8">
            {/* Executive Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Executive Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold px-4 py-2 rounded-full inline-block ${getHealthColor(deckData.executiveSummary.overallHealth)}`}>
                    {deckData.executiveSummary.overallHealth}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Overall Health Score</p>
                </div>
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">Key Strengths</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {deckData.executiveSummary.keyStrengths.map((strength, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-700 mb-2">Critical Issues</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {deckData.executiveSummary.criticalIssues.map((issue, index) => (
                      <li key={index} className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">Opportunities</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {deckData.executiveSummary.opportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-blue-500 mr-2" />
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Financial Highlights */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Financial Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(deckData.financialHighlights.revenue.current)}
                  </div>
                  <div className="text-sm text-gray-600">Annual Revenue</div>
                  <div className="text-sm text-green-600 font-semibold">
                    +{(deckData.financialHighlights.revenue.growth * 100).toFixed(1)}% growth
                  </div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {(deckData.financialHighlights.profitability.margin * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Profit Margin</div>
                  <div className="text-sm text-gray-600 capitalize">
                    {deckData.financialHighlights.profitability.trend} trend
                  </div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(deckData.financialHighlights.cashFlow.current)}
                  </div>
                  <div className="text-sm text-gray-600">Cash Flow</div>
                  <div className="text-sm text-gray-600">
                    {deckData.financialHighlights.cashFlow.runway} months runway
                  </div>
                </div>

                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {deckData.financialHighlights.efficiency.score}
                  </div>
                  <div className="text-sm text-gray-600">Efficiency Score</div>
                  <div className="text-xs text-gray-500">
                    {deckData.financialHighlights.efficiency.areas.join(', ')}
                  </div>
                </div>
              </div>
            </div>

            {/* Industry Benchmarks */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Industry Benchmarks</h3>
              <div className="space-y-4">
                {[
                  { 
                    metric: 'Revenue Growth', 
                    company: deckData.benchmarks.revenueGrowth.company * 100, 
                    industry: deckData.benchmarks.revenueGrowth.industry * 100,
                    suffix: '%'
                  },
                  { 
                    metric: 'Profit Margin', 
                    company: deckData.benchmarks.profitMargin.company * 100, 
                    industry: deckData.benchmarks.profitMargin.industry * 100,
                    suffix: '%'
                  },
                  { 
                    metric: 'Operational Efficiency', 
                    company: deckData.benchmarks.efficiency.company, 
                    industry: deckData.benchmarks.efficiency.industry,
                    suffix: '/100'
                  }
                ].map((benchmark, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900">{benchmark.metric}</div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Your Company</div>
                        <div className="font-bold text-blue-600">
                          {benchmark.company.toFixed(1)}{benchmark.suffix}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Industry Average</div>
                        <div className="font-bold text-gray-700">
                          {benchmark.industry.toFixed(1)}{benchmark.suffix}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-semibold ${
                        benchmark.company > benchmark.industry 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {benchmark.company > benchmark.industry ? 'Above' : 'Below'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Download Options */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Download Presentation</h3>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => downloadDeck('pdf')}
                  className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 flex items-center space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => downloadDeck('pptx')}
                  className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 flex items-center space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>Download PowerPoint</span>
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Professional presentation ready for client meetings and investor discussions.
              </p>
            </div>
          </div>
        )}

        {generating && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Generating comprehensive audit deck...</p>
            <p className="text-sm text-gray-500 mt-2">This may take 30-60 seconds</p>
          </div>
        )}
      </div>
    </div>
  );
}