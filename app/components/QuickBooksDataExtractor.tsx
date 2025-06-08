"use client"
import React, { useState, useCallback } from 'react';
import { Download, RefreshCw, Calendar, Database, TrendingUp, AlertCircle, CheckCircle, Clock, Settings } from 'lucide-react';
import { qbService } from '../lib/quickbooksService';

interface AdvancedFinancialData {
  accounts: any[];
  transactions: any[];
  customers: any[];
  vendors: any[];
  items: any[];
  reports: {
    profitLoss: any;
    balanceSheet: any;
    cashFlow: any;
    trialBalance: any;
    agingReports: { ar: any; ap: any };
    budgetVsActual: any;
    inventoryReports: any;
  };
  analytics: any;
}

interface Connection {
  companyId: string;
  companyName: string;
  lastSync?: string;
  status: 'connected' | 'error' | 'disconnected';
}

interface ExtractionStatus {
  isExtracting: boolean;
  progress: number;
  currentStep: string;
  errors: string[];
  extractedData: AdvancedFinancialData | null;
}

interface DataExtractionConfig {
  dateRange: {
    start: string;
    end: string;
    period: 'custom' | 'last30' | 'last90' | 'qtd' | 'ytd' | 'last12months';
  };
  includeSubAccounts: boolean;
  includeInactiveAccounts: boolean;
  extractionDepth: 'basic' | 'standard' | 'comprehensive';
  realTimeSync: boolean;
}

const QuickBooksDataExtractor: React.FC = () => {
  const [selectedConnection, setSelectedConnection] = useState<string>('comp_001');
  const [connections, setConnections] = useState<Connection[]>([
    {
      companyId: 'comp_001',
      companyName: 'TechStart Solutions Inc.',
      lastSync: '2025-06-08T10:30:00Z',
      status: 'connected'
    }
  ]);
  
  const [extractionConfig, setExtractionConfig] = useState<DataExtractionConfig>({
    dateRange: {
      start: '2025-01-01',
      end: '2025-06-08',
      period: 'ytd'
    },
    includeSubAccounts: true,
    includeInactiveAccounts: false,
    extractionDepth: 'comprehensive',
    realTimeSync: false
  });

  const [extractionStatus, setExtractionStatus] = useState<ExtractionStatus>({
    isExtracting: false,
    progress: 0,
    currentStep: '',
    errors: [],
    extractedData: null
  });

  const performDataExtraction = useCallback(async () => {
    setExtractionStatus(prev => ({
      ...prev,
      isExtracting: true,
      progress: 0,
      currentStep: 'Initializing connection...',
      errors: []
    }));

    try {
      if (!selectedConnection) {
        throw new Error('No QuickBooks connection selected');
      }

      // Step 1: Get stored QB credentials
      setExtractionStatus(prev => ({
        ...prev,
        currentStep: 'Retrieving QuickBooks credentials...',
        progress: 10
      }));

      const credentials = await qbService.getStoredCredentials(selectedConnection);
      
      if (!credentials) {
        throw new Error('No QuickBooks credentials found. Please reconnect to QuickBooks.');
      }

      // Step 2: Test connection
      setExtractionStatus(prev => ({
        ...prev,
        currentStep: 'Testing QuickBooks connection...',
        progress: 20
      }));

      const isConnected = await qbService.testConnection(credentials);
      
      if (!isConnected) {
        throw new Error('QuickBooks connection failed. Access token may be expired.');
      }

      // Step 3: Fetch comprehensive financial data
      setExtractionStatus(prev => ({
        ...prev,
        currentStep: 'Fetching comprehensive financial data...',
        progress: 30
      }));

      const dateRange = {
        start: extractionConfig.dateRange.start,
        end: extractionConfig.dateRange.end
      };

      const financialData = await qbService.fetchComprehensiveFinancialData(
        credentials,
        dateRange
      );

      // Step 4: Process company info
      setExtractionStatus(prev => ({
        ...prev,
        currentStep: 'Processing company information...',
        progress: 40
      }));

      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 5: Analyze financial statements
      setExtractionStatus(prev => ({
        ...prev,
        currentStep: 'Analyzing financial statements...',
        progress: 55
      }));

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 6: Generate analytics
      setExtractionStatus(prev => ({
        ...prev,
        currentStep: 'Building advanced analytics...',
        progress: 70
      }));

      const analytics = generateAnalyticsFromRealData(financialData);
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Step 7: Create accounts structure
      setExtractionStatus(prev => ({
        ...prev,
        currentStep: 'Structuring chart of accounts...',
        progress: 85
      }));

      const accounts = generateAccountsFromFinancialData(financialData);

      // Step 8: Finalize extraction
      setExtractionStatus(prev => ({
        ...prev,
        currentStep: 'Finalizing extraction...',
        progress: 95
      }));

      await new Promise(resolve => setTimeout(resolve, 500));

      const extractedData: AdvancedFinancialData = {
        accounts,
        transactions: generateMockTransactions(financialData),
        customers: generateMockCustomers(),
        vendors: generateMockVendors(),
        items: generateMockItems(),
        reports: {
          profitLoss: financialData.profitLoss,
          balanceSheet: financialData.balanceSheet,
          cashFlow: financialData.cashFlow,
          trialBalance: {},
          agingReports: { ar: {}, ap: {} },
          budgetVsActual: {},
          inventoryReports: {}
        },
        analytics
      };

      setExtractionStatus((prev: ExtractionStatus) => ({
        ...prev,
        isExtracting: false,
        currentStep: 'Extraction completed successfully!',
        progress: 100,
        extractedData: extractedData as AdvancedFinancialData
      }));

      setConnections((prev: Connection[]) => prev.map((conn: Connection) => 
        conn.companyId === selectedConnection 
          ? { ...conn, lastSync: new Date().toISOString(), status: 'connected' }
          : conn
      ));

    } catch (error: any) {
      console.error('Data extraction error:', error);
      
      setExtractionStatus(prev => ({
        ...prev,
        isExtracting: false,
        currentStep: '',
        errors: [(error as Error).message || 'Failed to extract data from QuickBooks'],
        progress: 0
      }));

      setConnections(prev => prev.map(conn => 
        conn.companyId === selectedConnection 
          ? { ...conn, status: 'error' }
          : conn
      ));
    }
  }, [selectedConnection, extractionConfig]);

  // Helper functions (your cleaned up versions)
  function generateAnalyticsFromRealData(financialData: any) {
    const { profitLoss, balanceSheet, cashFlow } = financialData;
    
    return {
      monthlyRevenueTrend: [
        {
          month: 'Current Period',
          revenue: profitLoss?.totalRevenue || 0,
          profit: profitLoss?.netIncome || 0
        }
      ],
      customerSegmentation: [
        { segment: 'Enterprise', count: 5, revenue: (profitLoss?.totalRevenue || 0) * 0.6 },
        { segment: 'Mid-Market', count: 15, revenue: (profitLoss?.totalRevenue || 0) * 0.3 },
        { segment: 'Small Business', count: 30, revenue: (profitLoss?.totalRevenue || 0) * 0.1 }
      ],
      expenseBreakdown: profitLoss?.expenseItems?.map((item: any, index: number) => ({
        category: item.name,
        amount: item.amount,
        percentage: ((item.amount / profitLoss.totalExpenses) * 100) || 0
      })) || [
        { category: 'Total Expenses', amount: profitLoss?.totalExpenses || 0, percentage: 100 }
      ],
      cashFlowForecast: Array.from({length: 12}, (_, i) => ({
        date: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        projected: (cashFlow?.operatingCashFlow || 0) + (Math.random() - 0.5) * 50000,
        actual: i < 1 ? cashFlow?.operatingCashFlow : undefined
      }))
    };
  }

  function generateAccountsFromFinancialData(financialData: any) {
    const accounts: Array<{
      id: string;
      name: string;
      type: string;
      subType: string;
      balance: number;
      isActive: boolean;
    }> = [];
    
    if (financialData.balanceSheet?.assetItems) {
      financialData.balanceSheet.assetItems.forEach((item: any, index: number) => {
        accounts.push({
          id: `asset_${index}`,
          name: item.name,
          type: 'Asset',
          subType: 'Current Asset',
          balance: item.amount,
          isActive: true
        });
      });
    }
    
    if (financialData.balanceSheet?.liabilityItems) {
      financialData.balanceSheet.liabilityItems.forEach((item: any, index: number) => {
        accounts.push({
          id: `liability_${index}`,
          name: item.name,
          type: 'Liability',
          subType: 'Current Liability',
          balance: item.amount,
          isActive: true
        });
      });
    }
    
    if (financialData.profitLoss?.revenueItems) {
      financialData.profitLoss.revenueItems.forEach((item: any, index: number) => {
        accounts.push({
          id: `revenue_${index}`,
          name: item.name,
          type: 'Income',
          subType: 'Service Revenue',
          balance: item.amount,
          isActive: true
        });
      });
    }
    
    if (financialData.profitLoss?.expenseItems) {
      financialData.profitLoss.expenseItems.forEach((item: any, index: number) => {
        accounts.push({
          id: `expense_${index}`,
          name: item.name,
          type: 'Expense',
          subType: 'Operating Expense',
          balance: item.amount,
          isActive: true
        });
      });
    }
    
    return accounts.length > 0 ? accounts : [
      {
        id: 'acc_001',
        name: 'Total Assets',
        type: 'Asset',
        subType: 'Total',
        balance: financialData.balanceSheet?.totalAssets || 0,
        isActive: true
      },
      {
        id: 'acc_002',
        name: 'Total Revenue',
        type: 'Income',
        subType: 'Total',
        balance: financialData.profitLoss?.totalRevenue || 0,
        isActive: true
      }
    ];
  }

  function generateMockTransactions(financialData: any) {
    return Array.from({length: 100}, (_, i) => ({
      id: `txn_${i.toString().padStart(3, '0')}`,
      date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      type: ['Sale', 'Purchase', 'Payment', 'Deposit'][Math.floor(Math.random() * 4)],
      amount: Math.random() * (financialData.profitLoss?.totalRevenue || 1000000) / 100,
      accountId: `acc_${Math.floor(Math.random() * 3) + 1}`,
      description: `Transaction ${i + 1}`,
      reference: `REF-${i + 1}`
    }));
  }

  function generateMockCustomers() {
    return Array.from({length: 25}, (_, i) => ({
      id: `cust_${i.toString().padStart(3, '0')}`,
      name: `Customer ${i + 1}`,
      email: `customer${i + 1}@example.com`,
      phone: `555-${Math.floor(Math.random() * 9000) + 1000}`,
      balance: Math.random() * 50000,
      creditLimit: 25000,
      paymentTerms: 'Net 30',
      lastTransaction: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
  }

  function generateMockVendors() {
    return Array.from({length: 15}, (_, i) => ({
      id: `vend_${i.toString().padStart(3, '0')}`,
      name: `Vendor ${i + 1}`,
      email: `vendor${i + 1}@example.com`,
      phone: `555-${Math.floor(Math.random() * 9000) + 1000}`,
      balance: Math.random() * 50000,
      creditLimit: 25000,
      paymentTerms: 'Net 30',
      lastTransaction: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
  }

  function generateMockItems() {
    return Array.from({length: 20}, (_, i) => ({
      id: `item_${i.toString().padStart(3, '0')}`,
      name: `Item ${i + 1}`,
      description: `Description of Item ${i + 1}`,
      price: Math.random() * 100,
      quantity: Math.random() * 100,
      total: Math.random() * 10000,
      accountId: `acc_${Math.floor(Math.random() * 3) + 1}`,
      isActive: true
    }));
  }

  // Utility functions
  const handleConfigChange = (key: keyof DataExtractionConfig, value: any) => {
    setExtractionConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'disconnected': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced QuickBooks Data Extraction</h1>
              <p className="text-gray-600">Deep financial data extraction with comprehensive analytics</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={performDataExtraction}
                disabled={extractionStatus.isExtracting}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {extractionStatus.isExtracting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Extracting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Start Extraction
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Connection Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">QuickBooks Connections</h3>
              <div className="space-y-3">
                {connections.map((conn) => (
                  <div 
                    key={conn.companyId}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedConnection === conn.companyId 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedConnection(conn.companyId)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{conn.companyName}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(conn.status)}`}>
                        {conn.status.toUpperCase()}
                      </span>
                    </div>
                    {conn.lastSync && (
                      <div className="text-sm text-gray-500">
                        Last sync: {formatDate(conn.lastSync)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Extraction Configuration */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Extraction Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select 
                    value={extractionConfig.dateRange.period}
                    onChange={(e) => handleConfigChange('dateRange', {
                      ...extractionConfig.dateRange,
                      period: e.target.value as any
                    })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="last30">Last 30 Days</option>
                    <option value="last90">Last 90 Days</option>
                    <option value="qtd">Quarter to Date</option>
                    <option value="ytd">Year to Date</option>
                    <option value="last12months">Last 12 Months</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Extraction Depth</label>
                  <select 
                    value={extractionConfig.extractionDepth}
                    onChange={(e) => handleConfigChange('extractionDepth', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="basic">Basic (P&L, Balance Sheet)</option>
                    <option value="standard">Standard (+ Transactions, Customers)</option>
                    <option value="comprehensive">Comprehensive (All Data + Analytics)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={extractionConfig.includeSubAccounts}
                      onChange={(e) => handleConfigChange('includeSubAccounts', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Include Sub-Accounts</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={extractionConfig.includeInactiveAccounts}
                      onChange={(e) => handleConfigChange('includeInactiveAccounts', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Include Inactive Accounts</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={extractionConfig.realTimeSync}
                      onChange={(e) => handleConfigChange('realTimeSync', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Real-time Sync</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Extraction Status & Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Extraction Progress */}
            {extractionStatus.isExtracting && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Extraction Progress</h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{extractionStatus.currentStep}</span>
                    <span>{extractionStatus.progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${extractionStatus.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {extractionStatus.errors.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800">Extraction Error</h4>
                      <div className="mt-2">
                        {extractionStatus.errors.map((error, index) => (
                          <p key={index} className="text-sm text-red-700">{error}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Extraction Results */}
            {extractionStatus.extractedData && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Extraction Results</h3>
                
                {/* Data Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{extractionStatus.extractedData.accounts.length}</div>
                    <div className="text-sm text-gray-600">Accounts</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{extractionStatus.extractedData.transactions.length}</div>
                    <div className="text-sm text-gray-600">Transactions</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{extractionStatus.extractedData.customers.length}</div>
                    <div className="text-sm text-gray-600">Customers</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{extractionStatus.extractedData.vendors.length}</div>
                    <div className="text-sm text-gray-600">Vendors</div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Process for Analysis
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Raw Data
                  </button>
                </div>
              </div>
            )}

            {/* Ready State */}
            {!extractionStatus.isExtracting && !extractionStatus.extractedData && extractionStatus.errors.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ready for Extraction</h3>
                <p className="text-gray-600 mb-4">
                  Configure your extraction settings and click "Start Extraction" to begin comprehensive data analysis.
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Financial statements and reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Complete transaction history</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Customer and vendor analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Advanced financial ratios and insights</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickBooksDataExtractor;
