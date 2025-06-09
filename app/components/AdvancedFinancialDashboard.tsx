'use client'

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, AlertTriangle, CheckCircle } from 'lucide-react';

interface FinancialMetrics {
  revenue: {
    current: number
    previous: number
    trend: 'up' | 'down' | 'stable'
    monthlyGrowth: number
  }
  expenses: {
    current: number
    previous: number
    categories: { name: string; amount: number; percentage: number }[]
  }
  profitMargin: {
    gross: number
    net: number
    operating: number
  }
  cashFlow: {
    operating: number
    investing: number
    financing: number
  }
  ratios: {
    currentRatio: number
    quickRatio: number
    debtToEquity: number
    returnOnAssets: number
  }
  healthScore: {
    overall: number
    factors: { name: string; score: number; impact: string }[]
  }
}

interface AdvancedFinancialDashboardProps {
  companyId: string
  data?: FinancialMetrics
}

export default function AdvancedFinancialDashboard({ companyId, data }: AdvancedFinancialDashboardProps) {
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(data || null)
  const [loading, setLoading] = useState(!data)
  const [selectedPeriod, setSelectedPeriod] = useState('current_year')

  useEffect(() => {
    if (!data) {
      fetchFinancialMetrics()
    }
  }, [companyId, selectedPeriod])

  const fetchFinancialMetrics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/qbo/financial-analysis?companyId=${companyId}&period=${selectedPeriod}`)
      const result = await response.json()
      setMetrics(result.data)
    } catch (error) {
      console.error('Error fetching financial metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial Data Unavailable</h3>
        <p className="text-gray-600">Unable to retrieve financial metrics for this company.</p>
        <button
          onClick={fetchFinancialMetrics}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Period Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Financial Analysis Dashboard</h2>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white"
          >
            <option value="current_year">Current Year</option>
            <option value="last_12_months">Last 12 Months</option>
            <option value="quarter">Current Quarter</option>
            <option value="month">Current Month</option>
          </select>
        </div>

        {/* Financial Health Score */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial Health Score</h3>
              <div className={`text-3xl font-bold px-4 py-2 rounded-full inline-block ${getHealthScoreColor(metrics.healthScore.overall)}`}>
                {metrics.healthScore.overall}/100
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                {metrics.healthScore.overall >= 80 ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                )}
              </div>
              <p className="text-sm text-gray-600">
                {metrics.healthScore.overall >= 80 ? 'Excellent' : 
                 metrics.healthScore.overall >= 60 ? 'Good' : 'Needs Attention'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {formatCurrency(metrics.revenue.current)}
          </div>
          <div className="flex items-center">
            {metrics.revenue.trend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm ${metrics.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(metrics.revenue.monthlyGrowth)} vs previous period
            </span>
          </div>
        </div>

        {/* Profit Margin Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Net Profit Margin</h3>
            <PieChart className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {formatPercentage(metrics.profitMargin.net)}
          </div>
          <div className="text-sm text-gray-600">
            Gross: {formatPercentage(metrics.profitMargin.gross)} | 
            Operating: {formatPercentage(metrics.profitMargin.operating)}
          </div>
        </div>

        {/* Current Ratio Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Current Ratio</h3>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {metrics.ratios.currentRatio.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">
            {metrics.ratios.currentRatio >= 2 ? 'Excellent liquidity' : 
             metrics.ratios.currentRatio >= 1 ? 'Good liquidity' : 'Liquidity concern'}
          </div>
        </div>

        {/* Cash Flow Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Operating Cash Flow</h3>
            <DollarSign className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {formatCurrency(metrics.cashFlow.operating)}
          </div>
          <div className="text-sm text-gray-600">
            {metrics.cashFlow.operating > 0 ? 'Positive cash flow' : 'Negative cash flow'}
          </div>
        </div>
      </div>

      {/* Detailed Analysis Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
          <div className="space-y-3">
            {metrics.expenses.categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded mr-3"
                    style={{ backgroundColor: `hsl(${index * 60}, 70%, 60%)` }}
                  ></div>
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{formatCurrency(category.amount)}</div>
                  <div className="text-xs text-gray-500">{formatPercentage(category.percentage)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Score Factors */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Score Factors</h3>
          <div className="space-y-3">
            {metrics.healthScore.factors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium">{factor.name}</div>
                  <div className="text-xs text-gray-500">{factor.impact}</div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-semibold ${getHealthScoreColor(factor.score)}`}>
                  {factor.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
```

## 2. Create Transcript Analysis Component

```typescript
// app/components/TranscriptAnalysis.tsx
'use client'


interface TranscriptInsight {
  category: 'pain_point' | 'opportunity' | 'concern' | 'goal'
  content: string
  confidence: number
  relatedFinancials?: string[]
}

interface TranscriptAnalysisProps {
  companyId: string
  transcript?: string
}

