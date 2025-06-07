'use client'

import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, DollarSign, Percent, Calculator } from 'lucide-react'

interface FinancialAnalysisProps {
  companyId: string
  companyName: string
}

interface AnalysisData {
  profitLoss: any
  balanceSheet: any
  cashFlow: any
  analysis: {
    metrics: {
      revenue: number
      expenses: number
      netIncome: number
      profitMargin: number
      currentRatio: number
      debtToEquity: number
    }
    insights: Array<{
      type: 'success' | 'warning' | 'danger'
      title: string
      description: string
      recommendation: string
    }>
    score: number
  }
}

export default function AdvancedFinancialAnalysis({ companyId, companyName }: FinancialAnalysisProps) {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchAnalysis = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/qbo/financial-analysis?companyId=${companyId}`)
      if (!response.ok) throw new Error('Failed to fetch analysis')
      
      const data = await response.json()
      setAnalysisData(data)
    } catch (error) {
      setError('Failed to load financial analysis')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-green-500" size={20} />
      case 'warning': return <AlertTriangle className="text-yellow-500" size={20} />
      case 'danger': return <AlertTriangle className="text-red-500" size={20} />
      default: return null
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchAnalysis}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry Analysis
          </button>
        </div>
      </div>
    )
  }

  if (!analysisData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <Calculator className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Financial Analysis</h3>
          <p className="text-gray-600 mb-4">Generate comprehensive financial insights for {companyName}</p>
          <button 
            onClick={fetchAnalysis}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate Analysis
          </button>
        </div>
      </div>
    )
  }

  const { metrics, insights, score } = analysisData.analysis

  // Prepare chart data
  const profitabilityData = [
    { name: 'Revenue', value: metrics.revenue, color: '#3b82f6' },
    { name: 'Expenses', value: metrics.expenses, color: '#ef4444' },
    { name: 'Net Income', value: metrics.netIncome, color: metrics.netIncome > 0 ? '#10b981' : '#ef4444' }
  ]

  const ratiosData = [
    { name: 'Profit Margin', value: metrics.profitMargin, target: 15, unit: '%' },
    { name: 'Current Ratio', value: metrics.currentRatio, target: 2, unit: 'x' },
    { name: 'Debt-to-Equity', value: metrics.debtToEquity, target: 1, unit: 'x' }
  ]

  return (
    <div className="space-y-6">
      {/* Financial Health Score */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Financial Health Score</h3>
          <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
            {score}/100
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {score >= 80 ? 'Excellent financial health' : 
           score >= 60 ? 'Good financial health with room for improvement' : 
           'Financial health needs attention'}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <DollarSign className="text-green-500 mr-2" size={20} />
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-xl font-semibold">${metrics.revenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Percent className="text-blue-500 mr-2" size={20} />
            <div>
              <p className="text-sm text-gray-600">Profit Margin</p>
              <p className="text-xl font-semibold">{metrics.profitMargin.toFixed(1)}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Calculator className="text-purple-500 mr-2" size={20} />
            <div>
              <p className="text-sm text-gray-600">Current Ratio</p>
              <p className="text-xl font-semibold">{metrics.currentRatio.toFixed(2)}x</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profitability Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold mb-4">Profitability Overview</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={profitabilityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ratios Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold mb-4">Key Ratios vs. Targets</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratiosData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                `${value.toFixed(2)}${ratiosData.find(d => d.name === name)?.unit || ''}`, 
                'Current'
              ]} />
              <Bar dataKey="value" fill="#10b981" />
              <Bar dataKey="target" fill="#94a3b8" opacity={0.5} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold mb-4">Key Insights & Recommendations</h4>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
              <div className="mr-3 mt-0.5">
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-gray-800">{insight.title}</h5>
                <p className="text-gray-600 text-sm mb-2">{insight.description}</p>
                <p className="text-blue-600 text-sm font-medium">
                  💡 {insight.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
