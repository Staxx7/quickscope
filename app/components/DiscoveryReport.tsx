'use client'
import React from 'react'

interface BalanceSheetData {
  keyMetrics: {
    totalAssets: number
    totalLiabilities: number
    totalEquity: number
    currentAssets: number
    currentLiabilities: number
    assetItems: Array<{ name: string; amount: number }>
    liabilityItems: Array<{ name: string; amount: number }>
    equityItems: Array<{ name: string; amount: number }>
  }
}

interface ProfitLossData {
  reportPeriod: {
    startDate: string
    endDate: string
  }
  keyMetrics: {
    totalRevenue: number
    totalExpenses: number
    netIncome: number
    grossProfit: number
    revenueItems: Array<{ name: string; amount: number }>
    expenseItems: Array<{ name: string; amount: number }>
  }
}

interface DiscoveryReportProps {
  companyName: string
  companyId: string
  data: ProfitLossData
  balanceSheetData?: BalanceSheetData
  generatedBy?: string
  generatedDate?: string
}

export default function DiscoveryReport({ 
  companyName, 
  companyId, 
  data, 
  balanceSheetData,
  generatedBy = "QUICKSCOPE Financial Analysis",
  generatedDate = new Date().toLocaleDateString()
}: DiscoveryReportProps) {
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateMargins = () => {
    const profitMargin = data.keyMetrics.totalRevenue > 0 
      ? (data.keyMetrics.netIncome / data.keyMetrics.totalRevenue * 100) 
      : 0
    const expenseRatio = data.keyMetrics.totalRevenue > 0 
      ? (data.keyMetrics.totalExpenses / data.keyMetrics.totalRevenue * 100) 
      : 0
    return { profitMargin, expenseRatio }
  }

  const calculateRatios = () => {
    if (!balanceSheetData) return { currentRatio: 0, debtToEquity: 0, workingCapital: 0 }
    
    const currentRatio = balanceSheetData.keyMetrics.currentLiabilities > 0 
      ? (balanceSheetData.keyMetrics.currentAssets / balanceSheetData.keyMetrics.currentLiabilities) 
      : 0
    const debtToEquity = balanceSheetData.keyMetrics.totalEquity > 0 
      ? (balanceSheetData.keyMetrics.totalLiabilities / balanceSheetData.keyMetrics.totalEquity) 
      : 0
    const workingCapital = balanceSheetData.keyMetrics.currentAssets - balanceSheetData.keyMetrics.currentLiabilities

    return { currentRatio, debtToEquity, workingCapital }
  }

  const getFinancialHealth = () => {
    const { profitMargin } = calculateMargins()
    const { currentRatio } = calculateRatios()
    
    let score = 0
    if (profitMargin >= 15) score += 3
    else if (profitMargin >= 5) score += 2
    else if (profitMargin >= 0) score += 1
    
    if (currentRatio >= 2) score += 2
    else if (currentRatio >= 1) score += 1
    
    if (score >= 4) return { status: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-50' }
    if (score >= 3) return { status: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-50' }
    if (score >= 2) return { status: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-50' }
    return { status: 'Needs Attention', color: 'text-red-600', bgColor: 'bg-red-50' }
  }

  const { profitMargin, expenseRatio } = calculateMargins()
  const { currentRatio, debtToEquity, workingCapital } = calculateRatios()
  const healthScore = getFinancialHealth()

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 print:p-6 print:shadow-none shadow-lg">
      {/* Header */}
      <div className="border-b-2 border-black pb-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              {/* QUICKSCOPE Logo */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute w-12 h-12 border-3 border-black rounded-full opacity-90"></div>
                <div className="absolute w-10 h-10 border-2 border-gray-600 rounded-full"></div>
                <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-black"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-black"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-black"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-black"></div>
                <div className="absolute w-0.5 h-12 bg-black"></div>
                <div className="absolute w-12 h-0.5 bg-black"></div>
                <div className="absolute w-3 h-0.5 bg-black top-1"></div>
                <div className="absolute w-3 h-0.5 bg-black bottom-1"></div>
                <div className="absolute w-0.5 h-3 bg-black left-1"></div>
                <div className="absolute w-0.5 h-3 bg-black right-1"></div>
                <div className="absolute w-4 h-4 border border-black rounded-full bg-white"></div>
                <div className="absolute w-2 h-2 bg-black rounded-full"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-black">QUICKSCOPE</h1>
                <p className="text-gray-600">by STAXX</p>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-black">Financial Discovery Report</h2>
            <p className="text-gray-600 text-lg">{companyName}</p>
          </div>
          <div className="text-right text-sm text-gray-500">
            <p>Generated: {generatedDate}</p>
            <p>Company ID: {companyId}</p>
            <p>Report Period: {formatDate(data.reportPeriod.startDate)} - {formatDate(data.reportPeriod.endDate)}</p>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-black mb-4">Executive Summary</h3>
        <div className={`p-4 rounded-lg ${healthScore.bgColor} border`}>
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-lg">Financial Health Assessment</h4>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${healthScore.color} bg-white`}>
              {healthScore.status}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-black">{formatCurrency(data.keyMetrics.totalRevenue)}</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-black">{formatCurrency(data.keyMetrics.netIncome)}</p>
              <p className="text-sm text-gray-600">Net Income</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-black">{profitMargin.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">Profit Margin</p>
            </div>
            {balanceSheetData && (
              <div>
                <p className="text-2xl font-bold text-black">{formatCurrency(balanceSheetData.keyMetrics.totalAssets)}</p>
                <p className="text-sm text-gray-600">Total Assets</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Financial Ratios & Key Metrics */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-black mb-4">Key Financial Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* P&L Metrics */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Profitability Analysis</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Revenue:</span>
                <span className="font-semibold text-green-600">{formatCurrency(data.keyMetrics.totalRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Expenses:</span>
                <span className="font-semibold text-red-600">{formatCurrency(data.keyMetrics.totalExpenses)}</span>
              </div>
              <div className="flex justify-between">
                <span>Net Income:</span>
                <span className={`font-semibold ${data.keyMetrics.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(data.keyMetrics.netIncome)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Profit Margin:</span>
                <span className="font-semibold">{profitMargin.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Balance Sheet Metrics */}
          {balanceSheetData && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Financial Position</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Assets:</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(balanceSheetData.keyMetrics.totalAssets)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Liabilities:</span>
                  <span className="font-semibold text-red-600">{formatCurrency(balanceSheetData.keyMetrics.totalLiabilities)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Equity:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(balanceSheetData.keyMetrics.totalEquity)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Ratio:</span>
                  <span className="font-semibold">{currentRatio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Working Capital:</span>
                  <span className={`font-semibold ${workingCapital >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(workingCapital)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Revenue Breakdown */}
      {data.keyMetrics.revenueItems.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-black mb-4">Revenue Sources</h3>
          <div className="bg-green-50 p-4 rounded-lg">
            {data.keyMetrics.revenueItems.slice(0, 5).map((item, index) => (
              <div key={index} className="flex justify-between py-2 border-b last:border-b-0">
                <span className="text-gray-700">{item.name}</span>
                <span className="font-semibold text-green-600">{formatCurrency(item.amount)}</span>
              </div>
            ))}
            {data.keyMetrics.revenueItems.length > 5 && (
              <p className="text-sm text-gray-500 mt-2">
                + {data.keyMetrics.revenueItems.length - 5} additional revenue sources
              </p>
            )}
          </div>
        </div>
      )}

      {/* Assets Breakdown */}
      {balanceSheetData && balanceSheetData.keyMetrics.assetItems.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-black mb-4">Major Assets</h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            {balanceSheetData.keyMetrics.assetItems.slice(0, 5).map((item, index) => (
              <div key={index} className="flex justify-between py-2 border-b last:border-b-0">
                <span className="text-gray-700">{item.name}</span>
                <span className="font-semibold text-blue-600">{formatCurrency(item.amount)}</span>
              </div>
            ))}
            {balanceSheetData.keyMetrics.assetItems.length > 5 && (
              <p className="text-sm text-gray-500 mt-2">
                + {balanceSheetData.keyMetrics.assetItems.length - 5} additional asset categories
              </p>
            )}
          </div>
        </div>
      )}

      {/* Key Insights */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-black mb-4">Key Insights & Opportunities</h3>
        <div className="bg-blue-50 p-4 rounded-lg">
          <ul className="space-y-2 text-gray-700">
            {data.keyMetrics.netIncome > 0 ? (
              <li>• Company is profitable with positive net income of {formatCurrency(data.keyMetrics.netIncome)}</li>
            ) : (
              <li>• Company is currently operating at a loss of {formatCurrency(Math.abs(data.keyMetrics.netIncome))}</li>
            )}
            <li>• Profit margin of {profitMargin.toFixed(1)}% indicates {healthScore.status.toLowerCase()} financial performance</li>
            {balanceSheetData && (
              <>
                <li>• Current ratio of {currentRatio.toFixed(2)} shows {currentRatio >= 2 ? 'strong' : currentRatio >= 1 ? 'adequate' : 'concerning'} liquidity position</li>
                <li>• Working capital of {formatCurrency(workingCapital)} indicates {workingCapital >= 0 ? 'positive' : 'negative'} short-term financial health</li>
                <li>• Total assets of {formatCurrency(balanceSheetData.keyMetrics.totalAssets)} with {((balanceSheetData.keyMetrics.totalEquity / balanceSheetData.keyMetrics.totalAssets) * 100).toFixed(1)}% equity ownership</li>
              </>
            )}
            {data.keyMetrics.revenueItems.length > 0 && (
              <li>• Revenue diversification across {data.keyMetrics.revenueItems.length} different sources</li>
            )}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t pt-6 text-center text-sm text-gray-500">
        <p>This report was generated by {generatedBy}</p>
        <p>Data sourced from QuickBooks Online • Confidential and Proprietary</p>
        <p className="mt-2 font-semibold">QUICKSCOPE by STAXX - Precision Financial Analysis</p>
      </div>
    </div>
  )
}
