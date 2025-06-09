'use client'

import { useState, useEffect } from 'react';

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

export default function TranscriptAnalysis({ companyId, transcript: initialTranscript }: TranscriptAnalysisProps) {
  const [transcript, setTranscript] = useState(initialTranscript || '')
  const [insights, setInsights] = useState<TranscriptInsight[]>([])
  const [analyzing, setAnalyzing] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<'paste' | 'upload'>('paste')

  const analyzeTranscript = async () => {
    if (!transcript.trim()) return

    setAnalyzing(true)
    try {
      const response = await fetch('/api/qbo/analyze-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          transcript,
        })
      })

      const result = await response.json()
      setInsights(result.insights || [])
    } catch (error) {
      console.error('Error analyzing transcript:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setTranscript(e.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pain_point': return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'opportunity': return <TrendingUp className="h-5 w-5 text-green-500" />
      case 'concern': return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'goal': return <CheckCircle className="h-5 w-5 text-blue-500" />
      default: return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'pain_point': return 'bg-red-50 border-red-200'
      case 'opportunity': return 'bg-green-50 border-green-200'
      case 'concern': return 'bg-yellow-50 border-yellow-200'
      case 'goal': return 'bg-blue-50 border-blue-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Discovery Call Analysis</h2>
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-purple-500" />
          <span className="text-sm text-gray-600">AI-Powered Insights</span>
        </div>
      </div>

      {/* Upload Method Toggle */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => setUploadMethod('paste')}
            className={`px-4 py-2 rounded-md ${uploadMethod === 'paste' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Paste Text
          </button>
          <button
            onClick={() => setUploadMethod('upload')}
            className={`px-4 py-2 rounded-md ${uploadMethod === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Upload File
          </button>
        </div>

        {uploadMethod === 'paste' ? (
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your discovery call transcript here..."
            className="w-full h-40 border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="mb-4">
              <label htmlFor="transcript-upload" className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-700 font-medium">
                  Click to upload
                </span>
                <span className="text-gray-600"> or drag and drop</span>
              </label>
              <input
                id="transcript-upload"
                type="file"
                accept=".txt,.docx,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <p className="text-sm text-gray-500">TXT, DOCX, or PDF files</p>
          </div>
        )}
      </div>

      {/* Analyze Button */}
      <div className="mb-6">
        <button
          onClick={analyzeTranscript}
          disabled={!transcript.trim() || analyzing}
          className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <Brain className="h-5 w-5" />
          <span>{analyzing ? 'Analyzing...' : 'Analyze Transcript'}</span>
        </button>
      </div>

      {/* Analysis Results */}
      {insights.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Key Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${getCategoryColor(insight.category)}`}
              >
                <div className="flex items-start space-x-3">
                  {getCategoryIcon(insight.category)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-900 capitalize">
                        {insight.category.replace('_', ' ')}
                      </h4>
                      <span className="text-xs bg-white px-2 py-1 rounded">
                        {Math.round(insight.confidence * 100)}% confidence
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{insight.content}</p>
                    {insight.relatedFinancials && (
                      <div className="text-xs text-gray-600">
                        <strong>Related metrics:</strong> {insight.relatedFinancials.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {analyzing && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing transcript with AI...</p>
        </div>
      )}
    </div>
  )
}
```

## 3. Create API Endpoints for Enhanced Analysis

```typescript
// app/api/qbo/financial-analysis/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const companyId = searchParams.get('companyId')
    const period = searchParams.get('period') || 'current_year'

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      )
    }

    // In a real implementation, you would:
    // 1. Fetch access token for this company
    // 2. Make multiple QBO API calls for P&L, Balance Sheet, Cash Flow
    // 3. Calculate financial ratios and health scores
    // 4. Return comprehensive analysis

    // Mock comprehensive financial analysis
    const mockAnalysis = {
      revenue: {
        current: 2500000,
        previous: 2200000,
        trend: 'up' as const,
        monthlyGrowth: 0.136
      },
      expenses: {
        current: 1800000,
        previous: 1650000,
        categories: [
          { name: 'Cost of Goods Sold', amount: 800000, percentage: 0.44 },
          { name: 'Salaries & Benefits', amount: 400000, percentage: 0.22 },
          { name: 'Marketing', amount: 200000, percentage: 0.11 },
          { name: 'Office & Admin', amount: 150000, percentage: 0.08 },
          { name: 'Professional Services', amount: 120000, percentage: 0.07 },
          { name: 'Other', amount: 130000, percentage: 0.08 }
        ]
      },
      profitMargin: {
        gross: 0.68,
        net: 0.28,
        operating: 0.32
      },
      cashFlow: {
        operating: 450000,
        investing: -150000,
        financing: -100000
      },
      ratios: {
        currentRatio: 2.1,
        quickRatio: 1.8,
        debtToEquity: 0.35,
        returnOnAssets: 0.15
      },
      healthScore: {
        overall: 82,
        factors: [
          { name: 'Profitability', score: 85, impact: 'Strong profit margins' },
          { name: 'Liquidity', score: 90, impact: 'Excellent cash position' },
          { name: 'Efficiency', score: 75, impact: 'Good operational efficiency' },
          { name: 'Leverage', score: 80, impact: 'Conservative debt levels' },
          { name: 'Growth', score: 88, impact: 'Strong revenue growth' }
        ]
      }
    }

    return NextResponse.json({
      success: true,
      data: mockAnalysis
    })

  } catch (error) {
    console.error('Error in financial analysis:', error)
    return NextResponse.json(
      { error: 'Failed to generate financial analysis' },
      { status: 500 }
    )
  }
}
```

```typescript
// app/api/qbo/analyze-transcript/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { companyId, transcript } = await request.json()

    if (!companyId || !transcript) {
      return NextResponse.json(
        { error: 'Company ID and transcript are required' },
        { status: 400 }
      )
    }

    // In a real implementation, you would:
    // 1. Use OpenAI/Claude API to analyze the transcript
    // 2. Cross-reference with financial data from QuickBooks
    // 3. Generate actionable insights

    // Mock AI analysis results
    const mockInsights = [
      {
        category: 'pain_point' as const,
        content: 'Client mentioned struggling with cash flow management and late payments from customers',
        confidence: 0.92,
        relatedFinancials: ['Days Sales Outstanding', 'Cash Flow']
      },
      {
        category: 'opportunity' as const,
        content: 'Expressed interest in expanding to new market segments with strong profit potential',
        confidence: 0.85,
        relatedFinancials: ['Revenue Growth', 'Market Analysis']
      },
      {
        category: 'concern' as const,
        content: 'Worried about rising operational costs affecting profitability',
        confidence: 0.88,
        relatedFinancials: ['Operating Margin', 'Expense Ratios']
      },
      {
        category: 'goal' as const,
        content: 'Wants to achieve 25% revenue growth next year while maintaining current profit margins',
        confidence: 0.90,
        relatedFinancials: ['Revenue Growth', 'Profit Margin']
      }
    ]

    return NextResponse.json({
      success: true,
      insights: mockInsights
    })

  } catch (error) {
    console.error('Error analyzing transcript:', error)
    return NextResponse.json(
      { error: 'Failed to analyze transcript' },
      { status: 500 }
    )
  }
}
```
