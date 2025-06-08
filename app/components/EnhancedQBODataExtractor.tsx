"use client"
import React, { useState, useEffect } from 'react'
import { Database, RefreshCw, CheckCircle, AlertTriangle, Download, BarChart3, DollarSign, Calendar, Users, TrendingUp } from 'lucide-react'

interface QBODataSet {
  companyInfo: {
    companyName: string
    ein: string
    address: string
    currency: string
    fiscalYearStart: string
  }
  financialStatements: {
    profitLoss: any
    balanceSheet: any
    cashFlow: any
  }
  detailedData: {
    accountsReceivable: any[]
    accountsPayable: any[]
    customerList: any[]
    vendorList: any[]
    itemList: any[]
    employees: any[]
    chartOfAccounts: any[]
    generalLedger: any[]
  }
  cashFlowAnalysis: {
    monthlyFlow: any[]
    projectedFlow: any[]
    workingCapital: number
    burnRate: number
    runway: number
  }
  customerAnalysis: {
    topCustomers: any[]
    customerConcentration: number
    averageInvoiceValue: number
    daysOutstanding: number
    collectionEfficiency: number
  }
  vendorAnalysis: {
    topVendors: any[]
    paymentTerms: any[]
    daysPayableOutstanding: number
    spendConcentration: number
  }
  kpiMetrics: {
    revenue: {
      current: number
      growth: number
      recurring: number
      seasonal: boolean
    }
    profitability: {
      grossMargin: number
      netMargin: number
      ebitda: number
      trends: any[]
    }
    liquidity: {
      currentRatio: number
      quickRatio: number
      cashRatio: number
      workingCapital: number
    }
    efficiency: {
      assetTurnover: number
      inventoryTurnover: number
      receivablesTurnover: number
      payablesTurnover: number
    }
    leverage: {
      debtToEquity: number
      debtToAssets: number
      interestCoverage: number
    }
  }
  riskAssessment: {
    concentrationRisks: any[]
    cashFlowRisks: any[]
    complianceIssues: any[]
    operationalRisks: any[]
  }
  recommendations: any[]
}

interface EnhancedQBODataExtractorProps {
  prospectId: string
  companyName: string
  onDataExtracted?: (data: QBODataSet) => void
}

const EnhancedQBODataExtractor: React.FC<EnhancedQBODataExtractorProps> = ({
  prospectId,
  companyName,
  onDataExtracted
}) => {
  const [dataSet, setDataSet] = useState<QBODataSet | null>(null)
  const [extracting, setExtracting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [extractionStep, setExtractionStep] = useState('')
  const [extractionProgress, setExtractionProgress] = useState(0)

  const extractionSteps = [
    { step: 'Connecting to QuickBooks...', weight: 10 },
    { step: 'Fetching company information...', weight: 5 },
    { step: 'Extracting financial statements...', weight: 15 },
    { step: 'Analyzing accounts receivable...', weight: 10 },
    { step: 'Analyzing accounts payable...', weight: 10 },
    { step: 'Processing customer data...', weight: 10 },
    { step: 'Processing vendor data...', weight: 10 },
    { step: 'Extracting chart of accounts...', weight: 10 },
    { step: 'Generating cash flow analysis...', weight: 15 },
    { step: 'Calculating KPI metrics...', weight: 10 },
    { step: 'Performing risk assessment...', weight: 5 }
  ]

  const performDeepExtraction = async () => {
    setExtracting(true)
    setError(null)
    setExtractionProgress(0)

    try {
      let currentProgress = 0

      for (let i = 0; i < extractionSteps.length; i++) {
        const stepInfo = extractionSteps[i]
        setExtractionStep(stepInfo.step)
        
        // Simulate API calls with realistic delays
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
        
        currentProgress += stepInfo.weight
        setExtractionProgress(currentProgress)
      }

      // Generate comprehensive mock data
      const mockDataSet: QBODataSet = {
        companyInfo: {
          companyName: companyName,
          ein: "12-3456789",
          address: "123 Business Ave, Suite 100, Charlotte, NC 28202",
          currency: "USD",
          fiscalYearStart: "January"
        },
        financialStatements: {
          profitLoss: {
            revenue: 2450000,
            cogs: 735000,
            grossProfit: 1715000,
            operatingExpenses: 1372000,
            netIncome: 343000,
            periods: generateMonthlyData()
          },
          balanceSheet: {
            totalAssets: 1850000,
            currentAssets: 925000,
            cash: 385000,
            accountsReceivable: 340000,
            inventory: 125000,
            totalLiabilities: 620000,
            currentLiabilities: 340000,
            totalEquity: 1230000
          },
          cashFlow: {
            operatingCashFlow: 425000,
            investingCashFlow: -85000,
            financingCashFlow: -125000,
            netCashFlow: 215000
          }
        },
        detailedData: {
          accountsReceivable: generateARData(),
          accountsPayable: generateAPData(),
          customerList: generateCustomerData(),
          vendorList: generateVendorData(),
          itemList: generateItemData(),
          employees: generateEmployeeData(),
          chartOfAccounts: generateCOAData(),
          generalLedger: generateGLData()
        },
        cashFlowAnalysis: {
          monthlyFlow: generateCashFlowData(),
          projectedFlow: generateProjectedCashFlow(),
          workingCapital: 585000,
          burnRate: 125000,
          runway: 4.7
        },
        customerAnalysis: {
          topCustomers: generateTopCustomers(),
          customerConcentration: 0.35,
          averageInvoiceValue: 12500,
          daysOutstanding: 38,
          collectionEfficiency: 0.92
        },
        vendorAnalysis: {
          topVendors: generateTopVendors(),
          paymentTerms: generatePaymentTerms(),
          daysPayableOutstanding: 28,
          spendConcentration: 0.42
        },
        kpiMetrics: {
          revenue: {
            current: 2450000,
            growth: 0.18,
            recurring: 0.65,
            seasonal: true
          },
          profitability: {
            grossMargin: 0.70,
            netMargin: 0.14,
            ebitda: 485000,
            trends: generateProfitabilityTrends()
          },
          liquidity: {
            currentRatio: 2.72,
            quickRatio: 2.35,
            cashRatio: 1.13,
            workingCapital: 585000
          },
          efficiency: {
            assetTurnover: 1.32,
            inventoryTurnover: 8.5,
            receivablesTurnover: 7.2,
            payablesTurnover: 12.3
          },
          leverage: {
            debtToEquity: 0.50,
            debtToAssets: 0.34,
            interestCoverage: 15.2
          }
        },
        riskAssessment: {
          concentrationRisks: [
            {
              type: "Customer Concentration",
              severity: "medium",
              description: "Top 3 customers represent 35% of revenue",
              recommendation: "Diversify customer base"
            },
            {
              type: "Vendor Concentration", 
              severity: "low",
              description: "Healthy vendor distribution",
              recommendation: "Continue monitoring"
            }
          ],
          cashFlowRisks: [
            {
              type: "Seasonal Volatility",
              severity: "medium", 
              description: "Q1 typically shows 25% revenue decline",
              recommendation: "Establish credit facility for seasonal support"
            }
          ],
          complianceIssues: [
            {
              type: "Sales Tax",
              severity: "low",
              description: "All filings current",
              recommendation: "Maintain current compliance procedures"
            }
          ],
          operationalRisks: [
            {
              type: "Key Person Dependency",
              severity: "high",
              description: "Revenue heavily dependent on founder relationships", 
              recommendation: "Develop business development team"
            }
          ]
        },
        recommendations: [
          {
            category: "Cash Flow Management",
            priority: "high",
            recommendation: "Implement payment terms optimization",
            impact: "$85,000 annual benefit",
            effort: "low"
          },
          {
            category: "Process Automation",
            priority: "high", 
            recommendation: "Automate AP/AR processes",
            impact: "$125,000 annual savings",
            effort: "medium"
          },
          {
            category: "Risk Management",
            priority: "medium",
            recommendation: "Diversify customer concentration",
            impact: "Reduced revenue risk",
            effort: "high"
          }
        ]
      }

      setDataSet(mockDataSet)
      onDataExtracted?.(mockDataSet)

    } catch (err) {
      setError('Failed to extract QBO data')
      console.error('Error extracting QBO data:', err)
    } finally {
      setExtracting(false)
      setExtractionStep('')
      setExtractionProgress(0)
    }
  }

  const exportDataSet = () => {
    if (!dataSet) return
    
    const dataBlob = new Blob([JSON.stringify(dataSet, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(dataBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${companyName}_financial_data.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Helper functions to generate mock data
  function generateMonthlyData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months.map(month => ({
      month,
      revenue: Math.floor(180000 + Math.random() * 80000),
      expenses: Math.floor(120000 + Math.random() * 40000),
      netIncome: Math.floor(15000 + Math.random() * 35000)
    }))
  }

  function generateARData() {
    return [
      { customer: "TechCorp Solutions", amount: 45000, daysOld: 15, invoiceDate: "2024-11-20" },
      { customer: "Global Industries", amount: 32000, daysOld: 25, invoiceDate: "2024-11-10" },
      { customer: "StartupX", amount: 18000, daysOld: 35, invoiceDate: "2024-10-31" },
      { customer: "Enterprise LLC", amount: 28000, daysOld: 8, invoiceDate: "2024-11-27" }
    ]
  }

  function generateAPData() {
    return [
      { vendor: "Office Supplies Co", amount: 8500, dueDate: "2024-12-15", daysUntilDue: 10 },
      { vendor: "IT Services Inc", amount: 15000, dueDate: "2024-12-20", daysUntilDue: 15 },
      { vendor: "Marketing Agency", amount: 12000, dueDate: "2024-12-10", daysUntilDue: 5 }
    ]
  }

  function generateCustomerData() {
    return [
      { name: "TechCorp Solutions", totalRevenue: 285000, invoiceCount: 24, avgInvoice: 11875 },
      { name: "Global Industries", totalRevenue: 195000, invoiceCount: 18, avgInvoice: 10833 },
      { name: "StartupX", totalRevenue: 145000, invoiceCount: 15, avgInvoice: 9667 }
    ]
  }

  function generateVendorData() {
    return [
      { name: "IT Services Inc", totalSpend: 85000, invoiceCount: 12, avgInvoice: 7083 },
      { name: "Office Supplies Co", totalSpend: 45000, invoiceCount: 24, avgInvoice: 1875 },
      { name: "Marketing Agency", totalSpend: 120000, invoiceCount: 8, avgInvoice: 15000 }
    ]
  }

  function generateItemData() {
    return [
      { name: "Consulting Services", type: "Service", unitPrice: 175, quantitySold: 1200 },
      { name: "Software License", type: "Product", unitPrice: 2500, quantitySold: 48 },
      { name: "Training Program", type: "Service", unitPrice: 1200, quantitySold: 65 }
    ]
  }

  function generateEmployeeData() {
    return [
      { name: "John Smith", title: "CEO", department: "Executive", salary: 185000 },
      { name: "Sarah Johnson", title: "COO", department: "Operations", salary: 145000 },
      { name: "Mike Chen", title: "VP Engineering", department: "Technology", salary: 165000 }
    ]
  }

  function generateCOAData() {
    return [
      { account: "1000 - Cash", type: "Asset", balance: 385000 },
      { account: "1200 - Accounts Receivable", type: "Asset", balance: 340000 },
      { account: "4000 - Revenue", type: "Income", balance: 2450000 },
      { account: "5000 - Cost of Goods Sold", type: "Expense", balance: 735000 }
    ]
  }

  function generateGLData() {
    return Array.from({ length: 50 }, (_, i) => ({
      date: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      account: `Account ${i + 1}`,
      description: `Transaction ${i + 1}`,
      debit: Math.random() > 0.5 ? Math.floor(Math.random() * 50000) : 0,
      credit: Math.random() > 0.5 ? Math.floor(Math.random() * 50000) : 0
    }))
  }

  function generateCashFlowData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months.map(month => ({
      month,
      inflow: Math.floor(200000 + Math.random() * 100000),
      outflow: Math.floor(150000 + Math.random() * 80000),
      netFlow: Math.floor(25000 + Math.random() * 50000)
    }))
  }

  function generateProjectedCashFlow() {
    return Array.from({ length: 12 }, (_, i) => ({
      month: `Month ${i + 1}`,
      projected: Math.floor(180000 + Math.random() * 80000),
      confidence: Math.floor(70 + Math.random() * 25)
    }))
  }

  function generateTopCustomers() {
    return [
      { name: "TechCorp Solutions", revenue: 285000, percentage: 11.6 },
      { name: "Global Industries", revenue: 195000, percentage: 8.0 },
      { name: "StartupX", revenue: 145000, percentage: 5.9 },
      { name: "Enterprise LLC", revenue: 125000, percentage: 5.1 },
      { name: "Innovation Co", revenue: 98000, percentage: 4.0 }
    ]
  }

  function generateTopVendors() {
    return [
      { name: "IT Services Inc", spend: 85000, percentage: 12.5 },
      { name: "Marketing Agency", spend: 120000, percentage: 17.6 },
      { name: "Office Supplies Co", spend: 45000, percentage: 6.6 },
      { name: "Legal Services", spend: 65000, percentage: 9.5 }
    ]
  }

  function generatePaymentTerms() {
    return [
      { terms: "Net 30", percentage: 45 },
      { terms: "Net 15", percentage: 30 },
      { terms: "Due on Receipt", percentage: 20 },
      { terms: "Net 45", percentage: 5 }
    ]
  }

  function generateProfitabilityTrends() {
    return Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      grossMargin: 0.68 + Math.random() * 0.08,
      netMargin: 0.12 + Math.random() * 0.06
    }))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Database className="w-5 h-5 mr-2 text-blue-600" />
              Enhanced QuickBooks Data Extraction
            </h3>
            <p className="text-sm text-gray-500">
              Deep financial data analysis for {companyName}
            </p>
          </div>
          <div className="flex space-x-2">
            {!dataSet && (
              <button
                onClick={performDeepExtraction}
                disabled={extracting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${extracting ? 'animate-spin' : ''}`} />
                {extracting ? 'Extracting...' : 'Start Deep Extraction'}
              </button>
            )}
            {dataSet && (
              <button
                onClick={exportDataSet}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Extraction Progress */}
      {extracting && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="mb-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{extractionStep}</span>
              <span className="text-gray-600">{extractionProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${extractionProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Extraction Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Summary */}
      {dataSet && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">Extraction Complete</p>
                  <p className="text-xs text-green-600">All data successfully retrieved</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-800">Annual Revenue</p>
                  <p className="text-lg font-bold text-blue-900">{formatCurrency(dataSet.kpiMetrics.revenue.current)}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <BarChart3 className="w-8 h-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-800">Health Score</p>
                  <p className="text-lg font-bold text-purple-900">78/100</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-800">Growth Rate</p>
                  <p className="text-lg font-bold text-yellow-900">{(dataSet.kpiMetrics.revenue.growth * 100).toFixed(0)}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Financial Data</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">P&L Statements</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Balance Sheets</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cash Flow</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">General Ledger</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Operational Data</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer Analysis</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vendor Analysis</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">A/R & A/P Details</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Employee Data</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Analytics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">KPI Metrics</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Risk Assessment</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recommendations</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Projections</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EnhancedQBODataExtractor
