import React, { useState, useEffect } from 'react'
import { TrendingUp, AlertTriangle, CheckCircle, DollarSign, Brain, FileText, Download, Upload, BarChart3, PieChart, Calendar, Filter } from 'lucide-react'

interface EnhancedFinancialAnalysisProps {
  companyId: string
  companyName: string
  dateRange: { start: string; end: string }
}

interface RevenueItem {
  category: string
  amount: number
  percentage: number
}

interface ExpenseItem {
  category: string
  amount: number
  percentage: number
}

interface FinancialData {
  summary: {
    revenue: number
    expenses: number
    net_income: number
    gross_margin: number
    net_margin: number
  }
  profit_loss: {
    revenue_breakdown: RevenueItem[]
    expense_breakdown: ExpenseItem[]
  }
  balance_sheet: {
    assets: {
      current_assets: number
      fixed_assets: number
      total_assets: number
    }
    liabilities: {
      current_liabilities: number
      long_term_liabilities: number
      total_liabilities: number
    }
    equity: number
  }
  cash_flow: {
    operating: number
    investing: number
    financing: number
    net_change: number
  }
  key_ratios: {
    current_ratio: number
    debt_to_equity: number
    return_on_assets: number
    gross_margin_ratio: number
  }
}

interface Opportunity {
  title: string
  potential_value: number
  difficulty: 'low' | 'medium' | 'high'
  description: string
}

interface Analysis {
  financial_health_score: number
  key_insights: string[]
  opportunities: Opportunity[]
  risk_factors: string[]
}

export default function EnhancedFinancialAnalysis({ 
  companyId, 
  companyName, 
  dateRange
}: EnhancedFinancialAnalysisProps) {
  const [loading, setLoading] = useState(false)
  const [activeView, setActiveView] = useState<'summary' | 'profit-loss' | 'balance-sheet' | 'cash-flow' | 'audit-deck'>('summary')
  const [financialData, setFinancialData] = useState<FinancialData | null>(null)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  useEffect(() => {
    if (companyId) {
      fetchFinancialData()
    }
  }, [companyId, dateRange])

  const fetchFinancialData = async () => {
    setLoading(true)
    
    // Simulate API call - replace with actual QuickBooks API calls
    setTimeout(() => {
      const mockData: FinancialData = {
        summary: {
          revenue: 1250000,
          expenses: 1167500,
          net_income: 82500,
          gross_margin: 52.1,
          net_margin: 6.6
        },
        profit_loss: {
          revenue_breakdown: [
            { category: 'Product Sales', amount: 890000, percentage: 71.2 },
            { category: 'Service Revenue', amount: 280000, percentage: 22.4 },
            { category: 'Other Income', amount: 80000, percentage: 6.4 }
          ],
          expense_breakdown: [
            { category: 'Cost of Goods Sold', amount: 598750, percentage: 51.3 },
            { category: 'Salaries & Benefits', amount: 312500, percentage: 26.8 },
            { category: 'Rent & Utilities', amount: 93750, percentage: 8.0 },
            { category: 'Marketing & Advertising', amount: 62500, percentage: 5.4 },
            { category: 'Professional Services', amount: 50000, percentage: 4.3 },
            { category: 'Other Expenses', amount: 50000, percentage: 4.3 }
          ]
        },
        balance_sheet: {
          assets: {
            current_assets: 485000,
            fixed_assets: 315000,
            total_assets: 800000
          },
          liabilities: {
            current_liabilities: 145000,
            long_term_liabilities: 280000,
            total_liabilities: 425000
          },
          equity: 375000
        },
        cash_flow: {
          operating: 125000,
          investing: -45000,
          financing: -35000,
          net_change: 45000
        },
        key_ratios: {
          current_ratio: 3.34,
          debt_to_equity: 1.13,
          return_on_assets: 10.3,
          gross_margin_ratio: 52.1
        }
      }

      const mockAnalysis: Analysis = {
        financial_health_score: 74,
        key_insights: [
          'Strong gross margin of 52.1% indicates excellent pricing power and cost control',
          'Current ratio of 3.34 shows strong liquidity position',
          'Net margin of 6.6% has room for improvement through expense optimization',
          'Debt-to-equity ratio of 1.13 is manageable but could be reduced'
        ],
        opportunities: [
          {
            title: 'Cash Flow Optimization',
            potential_value: 28000,
            difficulty: 'medium',
            description: 'Implement better accounts receivable management'
          },
          {
            title: 'Expense Review',
            potential_value: 45000,
            difficulty: 'low', 
            description: 'Review and optimize recurring operating expenses'
          },
          {
            title: 'Revenue Mix Enhancement',
            potential_value: 85000,
            difficulty: 'high',
            description: 'Increase higher-margin service revenue percentage'
          }
        ],
        risk_factors: [
          'High dependency on product sales (71% of revenue)',
          'Operating expenses growing faster than revenue',
          'Limited cash flow from operations relative to company size'
        ]
      }
      
      setFinancialData(mockData)
      setAnalysis(mockAnalysis)
      setLoading(false)
    }, 1500)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])
  }

  const generateAuditDeck = () => {
    // This would generate a comprehensive audit deck
    alert('Audit deck generation would be implemented here - creating PDF report with all financial analysis')
  }

  const exportReport = (type: string) => {
    alert(`Exporting ${type} report - would generate downloadable file`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading comprehensive financial analysis...</span>
      </div>
    )
  }

  if (!financialData || !analysis) return null

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Financial Analysis - {companyName}</h2>
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 rounded-full font-bold text-lg bg-green-100 text-green-600">
              {analysis.financial_health_score}/100 Health Score
            </div>
            <button
              onClick={generateAuditDeck}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Audit Deck</span>
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          {[
            { key: 'summary', label: 'Summary', icon: Brain },
            { key: 'profit-loss', label: 'P&L Analysis', icon: TrendingUp },
            { key: 'balance-sheet', label: 'Balance Sheet', icon: BarChart3 },
            { key: 'cash-flow', label: 'Cash Flow', icon: DollarSign },
            { key: 'audit-deck', label: 'Audit Deck', icon: FileText }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveView(key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                activeView === key
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* File Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Upload className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Upload Financial Documents</p>
                <p className="text-xs text-gray-500">Excel files, PDFs, CSV exports from QuickBooks</p>
              </div>
            </div>
            <input
              type="file"
              multiple
              accept=".xlsx,.xls,.pdf,.csv"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
              Choose Files
            </label>
          </div>
          {uploadedFiles.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {uploadedFiles.map((file, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {file.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary View */}
      {activeView === 'summary' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData.summary.revenue)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Net Income</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData.summary.net_income)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Gross Margin</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPercentage(financialData.summary.gross_margin)}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Ratio</p>
                  <p className="text-2xl font-bold text-gray-900">{financialData.key_ratios.current_ratio}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-blue-600" />
              Key Financial Insights
            </h3>
            <div className="space-y-3">
              {analysis.key_insights.map((insight: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Opportunities */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Optimization Opportunities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analysis.opportunities.map((opportunity: Opportunity, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-gray-900">{opportunity.title}</h4>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(opportunity.potential_value)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{opportunity.description}</p>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    opportunity.difficulty === 'low' ? 'bg-green-100 text-green-800' :
                    opportunity.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {opportunity.difficulty} difficulty
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* P&L Analysis View */}
      {activeView === 'profit-loss' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Profit & Loss Analysis</h3>
              <button
                onClick={() => exportReport('P&L')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export P&L</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Breakdown */}
              <div>
                <h4 className="font-semibold mb-4">Revenue Breakdown</h4>
                <div className="space-y-3">
                  {financialData.profit_loss.revenue_breakdown.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">{item.category}</span>
                      <div className="text-right">
                        <div className="font-bold text-green-700">{formatCurrency(item.amount)}</div>
                        <div className="text-sm text-green-600">{formatPercentage(item.percentage)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expense Breakdown */}
              <div>
                <h4 className="font-semibold mb-4">Expense Breakdown</h4>
                <div className="space-y-3">
                  {financialData.profit_loss.expense_breakdown.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="font-medium">{item.category}</span>
                      <div className="text-right">
                        <div className="font-bold text-red-700">{formatCurrency(item.amount)}</div>
                        <div className="text-sm text-red-600">{formatPercentage(item.percentage)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Balance Sheet View */}
      {activeView === 'balance-sheet' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Balance Sheet Analysis</h3>
            <button
              onClick={() => exportReport('Balance Sheet')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Balance Sheet</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Assets */}
            <div>
              <h4 className="font-semibold mb-4 text-blue-700">Assets</h4>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between">
                    <span>Current Assets</span>
                    <span className="font-bold">{formatCurrency(financialData.balance_sheet.assets.current_assets)}</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between">
                    <span>Fixed Assets</span>
                    <span className="font-bold">{formatCurrency(financialData.balance_sheet.assets.fixed_assets)}</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg border-2 border-blue-200">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Assets</span>
                    <span className="font-bold text-blue-700">{formatCurrency(financialData.balance_sheet.assets.total_assets)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Liabilities */}
            <div>
              <h4 className="font-semibold mb-4 text-red-700">Liabilities</h4>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="flex justify-between">
                    <span>Current Liabilities</span>
                    <span className="font-bold">{formatCurrency(financialData.balance_sheet.liabilities.current_liabilities)}</span>
                  </div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="flex justify-between">
                    <span>Long-term Liabilities</span>
                    <span className="font-bold">{formatCurrency(financialData.balance_sheet.liabilities.long_term_liabilities)}</span>
                  </div>
                </div>
                <div className="p-3 bg-red-100 rounded-lg border-2 border-red-200">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Liabilities</span>
                    <span className="font-bold text-red-700">{formatCurrency(financialData.balance_sheet.liabilities.total_liabilities)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Equity */}
            <div>
              <h4 className="font-semibold mb-4 text-green-700">Equity</h4>
              <div className="space-y-3">
                <div className="p-3 bg-green-100 rounded-lg border-2 border-green-200">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Equity</span>
                    <span className="font-bold text-green-700">{formatCurrency(financialData.balance_sheet.equity)}</span>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between mb-1">
                      <span>Debt-to-Equity Ratio</span>
                      <span className="font-medium">{financialData.key_ratios.debt_to_equity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Return on Assets</span>
                      <span className="font-medium">{formatPercentage(financialData.key_ratios.return_on_assets)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cash Flow View */}
      {activeView === 'cash-flow' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Cash Flow Analysis</h3>
            <button
              onClick={() => exportReport('Cash Flow')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Cash Flow</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">{formatCurrency(financialData.cash_flow.operating)}</div>
                <div className="text-sm text-blue-600 mt-1">Operating Cash Flow</div>
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-700">{formatCurrency(financialData.cash_flow.investing)}</div>
                <div className="text-sm text-purple-600 mt-1">Investing Cash Flow</div>
              </div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-700">{formatCurrency(financialData.cash_flow.financing)}</div>
                <div className="text-sm text-orange-600 mt-1">Financing Cash Flow</div>
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">{formatCurrency(financialData.cash_flow.net_change)}</div>
                <div className="text-sm text-green-600 mt-1">Net Cash Change</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Deck View */}
      {activeView === 'audit-deck' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-6">Audit Deck Generator</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold">Included Sections</h4>
              <div className="space-y-2">
                {[
                  'Executive Summary',
                  'Financial Health Score',
                  'Profit & Loss Analysis',
                  'Balance Sheet Review',
                  'Cash Flow Analysis',
                  'Key Performance Ratios',
                  'Risk Assessment',
                  'Improvement Recommendations',
                  'Industry Benchmarks',
                  'Action Plan'
                ].map((section, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{section}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Export Options</h4>
              <div className="space-y-3">
                <button
                  onClick={() => generateAuditDeck()}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
                >
                  <FileText className="w-5 h-5" />
                  <span>Generate Complete Audit Deck (PDF)</span>
                </button>
                <button
                  onClick={() => exportReport('Executive Summary')}
                  className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Export Executive Summary</span>
                </button>
                <button
                  onClick={() => exportReport('Detailed Analysis')}
                  className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition flex items-center justify-center space-x-2"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Export Detailed Analysis (Excel)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Risk Factors */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
          Risk Factors & Areas of Concern
        </h3>
        <div className="space-y-2">
          {analysis.risk_factors.map((risk: string, index: number) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-800 text-sm">{risk}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
