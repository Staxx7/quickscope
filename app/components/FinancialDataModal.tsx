"use client"
import React, { useState, useEffect } from 'react'
import { X, Printer, Calendar, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

interface FinancialDataModalProps {
  isOpen: boolean
  onClose: () => void
  selectedReports: string[]
  dateRange?: { start: string; end: string } | null
  companyId: string
  companyName?: string
}

interface ProfitLossData {
  totalRevenue: number
  totalExpenses: number
  netIncome: number
  grossProfit: number
  revenueItems: Array<{ name: string; amount: number }>
  expenseItems: Array<{ name: string; amount: number }>
}

interface BalanceSheetData {
  totalAssets: number
  totalLiabilities: number
  totalEquity: number
  assetItems: Array<{ name: string; amount: number }>
  liabilityItems: Array<{ name: string; amount: number }>
  equityItems: Array<{ name: string; amount: number }>
}

export default function FinancialDataModal({
  isOpen,
  onClose,
  selectedReports,
  dateRange,
  companyId,
  companyName
}: FinancialDataModalProps) {
  const [profitLossData, setProfitLossData] = useState<ProfitLossData | null>(null)
  const [balanceSheetData, setBalanceSheetData] = useState<BalanceSheetData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Provide default date range if not provided
  const safeeDateRange = dateRange || { 
    start: new Date().getFullYear() + '-01-01', 
    end: new Date().toISOString().split('T')[0] 
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Format date range for display
  const formatDateRange = () => {
    if (!safeeDateRange.start || !safeeDateRange.end) return 'All Time'
    
    // Parse dates manually to avoid timezone issues
    const parseDate = (dateString: string) => {
      const [year, month, day] = dateString.split('-').map(Number)
      return new Date(year, month - 1, day) // month is 0-indexed
    }
    
    const startDate = parseDate(safeeDateRange.start)
    const endDate = parseDate(safeeDateRange.end)
    
    return `${startDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })} - ${endDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })}`
  }

  // Load financial data when modal opens or parameters change
  useEffect(() => {
    if (!isOpen || selectedReports.length === 0) {
      return
    }

    const loadFinancialData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log(`📊 Loading data for reports:`, selectedReports)
        console.log(`📅 Date range: startDate=${safeeDateRange.start}&endDate=${safeeDateRange.end}`)
        console.log(`🏢 Company ID: ${companyId}`)

        const results = await Promise.allSettled(
          selectedReports.map(async (reportType) => {
            const params = new URLSearchParams({
              companyId,
              ...(safeeDateRange.start && { startDate: safeeDateRange.start }),
              ...(safeeDateRange.end && { endDate: safeeDateRange.end }),
            })

            const url = `/api/qbo/${reportType}?${params.toString()}`
            console.log(`📊 ${reportType.toUpperCase()} URL: ${url}`)

            const response = await fetch(url)
            
            if (!response.ok) {
              const errorText = await response.text()
              console.error(`❌ API Error for ${reportType}: ${response.status}`)
              console.error(`❌ Error details:`, errorText)
              throw new Error(`Failed to load ${reportType}: ${response.status}`)
            }

            const data = await response.json()
            console.log(`📊 ${reportType.toUpperCase()} Response Data:`, data)
            
            return { reportType, data }
          })
        )

        // Process results
        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            const { reportType, data } = result.value
            
            if (reportType === 'profit-loss') {
              console.log(`✅ Setting P&L Data:`, data)
              setProfitLossData(data)
            } else if (reportType === 'balance-sheet') {
              console.log(`✅ Setting Balance Sheet Data:`, data)
              setBalanceSheetData(data)
            }
          } else {
            console.error(`❌ Failed to load report:`, result.reason)
            setError(result.reason.message || 'Failed to load financial data')
          }
        })

      } catch (err) {
        console.error('❌ Error loading financial data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    loadFinancialData()
  }, [isOpen, selectedReports, safeeDateRange.start, safeeDateRange.end, companyId])

  // Print function
  const handlePrint = () => {
    window.print()
  }

  // Reset data when modal closes
  useEffect(() => {
    if (!isOpen) {
      setProfitLossData(null)
      setBalanceSheetData(null)
      setError(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .print-content, .print-content * { visibility: visible; }
          .print-content { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            background: white; 
            padding: 20px; 
          }
          .no-print { display: none !important; }
          .print-page-break { page-break-before: always; }
        }
      `}</style>

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 no-print">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Financial Reports</h2>
              {companyName && (
                <p className="text-lg font-semibold text-blue-600 mt-1">
                  {companyName}
                </p>
              )}
              <p className="text-sm text-gray-600 mt-1">
                {formatDateRange()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-6 print-content">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading financial data...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
                <p className="text-red-700">{error}</p>
                <p className="text-sm text-red-600 mt-2">
                  This may be due to expired QuickBooks access token. The system is displaying mock data for testing.
                </p>
              </div>
            )}

            {!loading && !error && (
              <>
                {/* Debug Information */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm font-mono">
                  <h3 className="font-semibold text-gray-700 mb-2">🔍 Debug Information:</h3>
                  <div className="space-y-1 text-gray-600">
                    <div>📊 Selected Reports: {selectedReports.join(', ')}</div>
                    <div>📅 Date Range: {safeeDateRange.start || 'null'} to {safeeDateRange.end || 'null'}</div>
                    <div>🏢 Company ID: {companyId}</div>
                    <div>✅ P&L Data Loaded: {profitLossData ? 'Yes' : 'No'}</div>
                    <div>✅ Balance Sheet Data Loaded: {balanceSheetData ? 'Yes' : 'No'}</div>
                  </div>
                </div>

                {/* Profit & Loss Report */}
                {selectedReports.includes('profit-loss') && profitLossData && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                      Profit & Loss Statement
                    </h3>
                    
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-green-900">
                              {formatCurrency(profitLossData?.totalRevenue || 0)}
                            </p>
                          </div>
                          <DollarSign className="w-8 h-8 text-green-600" />
                        </div>
                      </div>
                      
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-red-600">Total Expenses</p>
                            <p className="text-2xl font-bold text-red-900">
                              {formatCurrency(profitLossData?.totalExpenses || 0)}
                            </p>
                          </div>
                          <TrendingDown className="w-8 h-8 text-red-600" />
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-600">Gross Profit</p>
                            <p className="text-2xl font-bold text-blue-900">
                              {formatCurrency(profitLossData?.grossProfit || 0)}
                            </p>
                          </div>
                          <TrendingUp className="w-8 h-8 text-blue-600" />
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-600">Net Income</p>
                            <p className="text-2xl font-bold text-purple-900">
                              {formatCurrency(profitLossData?.netIncome || 0)}
                            </p>
                          </div>
                          <DollarSign className="w-8 h-8 text-purple-600" />
                        </div>
                      </div>
                    </div>

                    {/* Revenue Breakdown */}
                    <div className="bg-white border border-gray-200 rounded-lg mb-6">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900">Revenue Breakdown</h4>
                      </div>
                      <div className="p-6">
                        <div className="space-y-3">
                          {(profitLossData?.revenueItems || []).map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                              <span className="text-gray-700">{item.name}</span>
                              <span className="font-semibold text-green-600">{formatCurrency(item.amount)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Expense Breakdown */}
                    <div className="bg-white border border-gray-200 rounded-lg">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900">Expense Breakdown</h4>
                      </div>
                      <div className="p-6">
                        <div className="space-y-3">
                          {(profitLossData?.expenseItems || []).map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                              <span className="text-gray-700">{item.name}</span>
                              <span className="font-semibold text-red-600">{formatCurrency(item.amount)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Balance Sheet Report */}
                {selectedReports.includes('balance-sheet') && balanceSheetData && (
                  <div className="print-page-break">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                      Balance Sheet
                    </h3>
                    
                    {/* Balance Sheet Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-600">Total Assets</p>
                            <p className="text-2xl font-bold text-blue-900">
                              {formatCurrency(balanceSheetData?.totalAssets || 0)}
                            </p>
                          </div>
                          <TrendingUp className="w-8 h-8 text-blue-600" />
                        </div>
                      </div>
                      
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-orange-600">Total Liabilities</p>
                            <p className="text-2xl font-bold text-orange-900">
                              {formatCurrency(balanceSheetData?.totalLiabilities || 0)}
                            </p>
                          </div>
                          <TrendingDown className="w-8 h-8 text-orange-600" />
                        </div>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-600">Total Equity</p>
                            <p className="text-2xl font-bold text-green-900">
                              {formatCurrency(balanceSheetData?.totalEquity || 0)}
                            </p>
                          </div>
                          <DollarSign className="w-8 h-8 text-green-600" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Assets */}
                      <div className="bg-white border border-gray-200 rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-900">Assets</h4>
                        </div>
                        <div className="p-6">
                          <div className="space-y-3">
                            {(balanceSheetData?.assetItems || []).map((item, index) => (
                              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                                <span className="text-gray-700">{item.name}</span>
                                <span className="font-semibold text-blue-600">{formatCurrency(item.amount)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Liabilities */}
                      <div className="bg-white border border-gray-200 rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-900">Liabilities</h4>
                        </div>
                        <div className="p-6">
                          <div className="space-y-3">
                            {(balanceSheetData?.liabilityItems || []).map((item, index) => (
                              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                                <span className="text-gray-700">{item.name}</span>
                                <span className="font-semibold text-orange-600">{formatCurrency(item.amount)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Equity */}
                      <div className="bg-white border border-gray-200 rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-900">Equity</h4>
                        </div>
                        <div className="p-6">
                          <div className="space-y-3">
                            {(balanceSheetData?.equityItems || []).map((item, index) => (
                              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                                <span className="text-gray-700">{item.name}</span>
                                <span className="font-semibold text-green-600">{formatCurrency(item.amount)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* No Data Message */}
                {!loading && selectedReports.length > 0 && !profitLossData && !balanceSheetData && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No financial data available for the selected reports and date range.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
