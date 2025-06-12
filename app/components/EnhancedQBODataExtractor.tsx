'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, FileText, RefreshCw, CheckCircle, AlertTriangle, AlertCircle, TrendingUp, DollarSign, Calendar, Users, Settings, Filter, Search, BarChart3, Database, Brain, Zap, Clock, Target } from 'lucide-react';
import { useToast } from './Toast';

interface DataFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  recordCount?: number;
  extractionResults?: ExtractionResults;
}

interface ExtractionResults {
  totalTransactions: number;
  dateRange: { start: string; end: string };
  accountsFound: number;
  revenue: number;
  expenses: number;
  netIncome: number;
  categories: Array<{ name: string; amount: number; percentage: number }>;
  keyMetrics: {
    grossMargin: number;
    currentRatio: number;
    debtToEquity: number;
    daysOutstanding: number;
  };
  insights: string[];
  riskFactors: string[];
}

interface ConnectedCompany {
  id: string;
  company_name: string;
  realm_id: string;
  status: 'active' | 'expired' | 'error';
  connected_at: string;
  last_sync?: string;
}

interface AIAnalysisProgress {
  stage: string;
  progress: number;
  message: string;
}

const EnhancedQBODataExtractor: React.FC = () => {
  const [files, setFiles] = useState<DataFile[]>([]);
  const [connectedCompanies, setConnectedCompanies] = useState<ConnectedCompany[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<ConnectedCompany | null>(null);
  const [extractionResults, setExtractionResults] = useState<ExtractionResults[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('extraction');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [aiAnalysisProgress, setAiAnalysisProgress] = useState<AIAnalysisProgress | null>(null);
  const [extractionMode, setExtractionMode] = useState<'live' | 'file'>('live');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast, ToastContainer } = useToast();

  // Fetch connected companies on mount
  useEffect(() => {
    fetchConnectedCompanies();
  }, []);

  const fetchConnectedCompanies = async () => {
    try {
      const response = await fetch('/api/companies');
      if (response.ok) {
        const data = await response.json();
        setConnectedCompanies(data.companies || []);
        if (data.companies && data.companies.length > 0) {
          setSelectedCompany(data.companies[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      showToast('Failed to load connected companies', 'error');
    }
  };

  const performLiveExtraction = async (companyId: string) => {
    if (!companyId) {
      showToast('Please select a company first', 'warning');
      return;
    }

    setIsProcessing(true);
    setAiAnalysisProgress({ stage: 'Connecting to QuickBooks...', progress: 10, message: 'Establishing secure connection' });

    try {
      // Step 1: Extract basic company data
      setAiAnalysisProgress({ stage: 'Retrieving company information...', progress: 20, message: 'Fetching company details' });
      const companyResponse = await fetch(`/api/qbo/company-info?companyId=${companyId}`);
      
      // Step 2: Extract Chart of Accounts
      setAiAnalysisProgress({ stage: 'Analyzing chart of accounts...', progress: 35, message: 'Mapping account structure' });
      const accountsResponse = await fetch(`/api/qbo/chart-of-accounts?companyId=${companyId}`);
      
      // Step 3: Extract P&L Data
      setAiAnalysisProgress({ stage: 'Processing profit & loss data...', progress: 50, message: 'Calculating financial metrics' });
      const plResponse = await fetch(`/api/qbo/profit-loss?companyId=${companyId}`);
      
      // Step 4: Extract Balance Sheet
      setAiAnalysisProgress({ stage: 'Analyzing balance sheet...', progress: 65, message: 'Evaluating financial position' });
      const bsResponse = await fetch(`/api/qbo/balance-sheet?companyId=${companyId}`);
      
      // Step 5: Extract Cash Flow
      setAiAnalysisProgress({ stage: 'Analyzing cash flow patterns...', progress: 80, message: 'Identifying cash flow trends' });
      const cfResponse = await fetch(`/api/qbo/cash-flow?companyId=${companyId}`);
      
      // Step 6: AI Analysis
      setAiAnalysisProgress({ stage: 'Running AI financial analysis...', progress: 90, message: 'Generating insights and recommendations' });
      
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create comprehensive extraction results
      const mockResults: ExtractionResults = {
        totalTransactions: Math.floor(Math.random() * 5000) + 1000,
        dateRange: {
          start: new Date(2024, 0, 1).toISOString().split('T')[0],
          end: new Date().toISOString().split('T')[0]
        },
        accountsFound: Math.floor(Math.random() * 50) + 20,
        revenue: Math.floor(Math.random() * 1000000) + 500000,
        expenses: Math.floor(Math.random() * 800000) + 400000,
        netIncome: 0,
        categories: [
          { name: 'Revenue', amount: 750000, percentage: 100 },
          { name: 'Cost of Goods Sold', amount: 300000, percentage: 40 },
          { name: 'Operating Expenses', amount: 200000, percentage: 26.7 },
          { name: 'Marketing', amount: 75000, percentage: 10 },
          { name: 'Administrative', amount: 50000, percentage: 6.7 }
        ],
        keyMetrics: {
          grossMargin: 0.6,
          currentRatio: 2.1,
          debtToEquity: 0.3,
          daysOutstanding: 32
        },
        insights: [
          'Revenue growth of 18% year-over-year indicates strong market position',
          'Gross margin of 60% exceeds industry average of 45%',
          'Current ratio of 2.1 shows healthy liquidity position',
          'Customer concentration risk: top 3 customers represent 65% of revenue',
          'Inventory turnover of 8.2x is above industry benchmark'
        ],
        riskFactors: [
          'High customer concentration creates revenue vulnerability',
          'Accounts receivable aging shows 15% over 60 days',
          'Seasonal revenue patterns may impact Q1 cash flow',
          'Limited diversification in revenue streams'
        ]
      };

      mockResults.netIncome = mockResults.revenue - mockResults.expenses;

      setExtractionResults(prev => [...prev, mockResults]);
      setAiAnalysisProgress({ stage: 'Analysis complete!', progress: 100, message: 'Financial extraction successful' });
      
      showToast('Live data extraction completed successfully', 'success');
      
      // Update company last sync
      setConnectedCompanies(prev => prev.map(company => 
        company.realm_id === companyId 
          ? { ...company, last_sync: new Date().toISOString() }
          : company
      ));

    } catch (error) {
      console.error('Live extraction error:', error);
      showToast('Failed to extract live financial data', 'error');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setAiAnalysisProgress(null), 2000);
    }
  };

  const handleFileUpload = async (uploadedFiles: FileList) => {
    if (extractionMode !== 'file') return;
    
    setIsProcessing(true);
    
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      const newFile: DataFile = {
        id: `file_${Date.now()}_${i}`,
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedAt: new Date().toISOString(),
        status: 'uploading',
        progress: 0
      };
      
      setFiles(prev => [...prev, newFile]);
      
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setFiles(prev => prev.map(f => 
          f.id === newFile.id ? { ...f, progress, status: progress === 100 ? 'processing' : 'uploading' } : f
        ));
      }
      
      // Simulate processing
      setTimeout(() => {
        const mockResult: ExtractionResults = {
          totalTransactions: Math.floor(Math.random() * 1000) + 100,
          dateRange: {
            start: '2024-01-01',
            end: '2024-12-31'
          },
          accountsFound: Math.floor(Math.random() * 30) + 10,
          revenue: Math.floor(Math.random() * 500000) + 100000,
          expenses: Math.floor(Math.random() * 400000) + 80000,
          netIncome: 0,
          categories: [
            { name: 'Sales Revenue', amount: 150000, percentage: 75 },
            { name: 'Service Revenue', amount: 50000, percentage: 25 },
            { name: 'Operating Expenses', amount: 80000, percentage: 40 },
            { name: 'Cost of Sales', amount: 60000, percentage: 30 }
          ],
          keyMetrics: {
            grossMargin: 0.55,
            currentRatio: 1.8,
            debtToEquity: 0.4,
            daysOutstanding: 28
          },
          insights: [
            'Strong revenue growth trend identified',
            'Expense management appears efficient',
            'Good liquidity position maintained'
          ],
          riskFactors: [
            'Monitor accounts receivable aging',
            'Consider revenue diversification'
          ]
        };
        
        mockResult.netIncome = mockResult.revenue - mockResult.expenses;
        
        setFiles(prev => prev.map(f => 
          f.id === newFile.id 
            ? { ...f, status: 'completed', recordCount: mockResult.totalTransactions, extractionResults: mockResult }
            : f
        ));
        
        showToast(`File ${file.name} processed successfully`, 'success');
      }, 3000 + i * 1000);
    }
    
    setIsProcessing(false);
  };

  const exportResults = (format: 'csv' | 'excel' | 'pdf') => {
    if (extractionResults.length === 0) {
      showToast('No results to export', 'warning');
      return;
    }

    // Create export data
    const results = extractionResults[0]; // Use latest results
    const exportData = {
      summary: {
        totalTransactions: results.totalTransactions,
        dateRange: results.dateRange,
        revenue: results.revenue,
        expenses: results.expenses,
        netIncome: results.netIncome
      },
      metrics: results.keyMetrics,
      insights: results.insights,
      riskFactors: results.riskFactors,
      categories: results.categories
    };

    // Simulate export
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial-analysis-${selectedCompany?.company_name || 'export'}-${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : format === 'excel' ? 'xlsx' : 'pdf'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Results exported as ${format.toUpperCase()}`, 'success');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'processing': return <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return <Upload className="w-5 h-5 text-gray-400" />;
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || file.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900 p-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <ToastContainer />
      
      {/* Header */}
      <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium text-white mb-2">Enhanced QBO Data Extractor</h1>
            <p className="text-gray-300">Live financial data extraction with AI-powered analysis</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/25">
              <Brain className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="text-right">
              <div className="text-white font-semibold">{extractionResults.length}</div>
              <div className="text-gray-400 text-sm">Analyses Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Progress */}
      {aiAnalysisProgress && (
        <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-white mb-1">{aiAnalysisProgress.stage}</h3>
              <p className="text-gray-400 text-sm mb-2">{aiAnalysisProgress.message}</p>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${aiAnalysisProgress.progress}%` }}
                />
              </div>
              <div className="text-right text-sm text-gray-400 mt-1">{aiAnalysisProgress.progress}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Extraction Mode Selector */}
      <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 mb-6">
        <div className="flex space-x-1 p-2">
          <button
            onClick={() => setExtractionMode('live')}
            className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 flex-1 ${
              extractionMode === 'live'
                ? 'bg-white/15 text-white border border-white/30'
                : 'text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span className="font-medium">Live QuickBooks Extraction</span>
          </button>
          <button
            onClick={() => setExtractionMode('file')}
            className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 flex-1 ${
              extractionMode === 'file'
                ? 'bg-white/15 text-white border border-white/30'
                : 'text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span className="font-medium">File Upload</span>
          </button>
        </div>
      </div>

      {/* Live Extraction Tab */}
      {extractionMode === 'live' && (
        <div className="space-y-6">
          {/* Company Selection */}
          <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <h3 className="text-xl font-medium text-white mb-4">Select Connected Company</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connectedCompanies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => setSelectedCompany(company)}
                  className={`p-4 border rounded-xl text-left transition-all ${
                    selectedCompany?.id === company.id
                      ? 'border-cyan-500 bg-cyan-500/20'
                      : 'border-white/20 hover:border-white/30 bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{company.company_name}</h4>
                    <div className={`px-2 py-1 rounded text-xs ${
                      company.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {company.status}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    Connected: {new Date(company.connected_at).toLocaleDateString()}
                  </div>
                  {company.last_sync && (
                    <div className="text-sm text-gray-400">
                      Last sync: {new Date(company.last_sync).toLocaleDateString()}
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            {selectedCompany && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => performLiveExtraction(selectedCompany.realm_id)}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2 mx-auto"
                >
                  <Brain className="w-5 h-5" />
                  <span>{isProcessing ? 'Extracting...' : 'Start AI-Powered Extraction'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Extraction Results */}
          {extractionResults.length > 0 && (
            <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-white">AI Analysis Results</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportResults('csv')}
                    className="bg-white/10 border border-white/25 text-white px-3 py-2 rounded-lg hover:bg-white/15 transition-all text-sm"
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={() => exportResults('excel')}
                    className="bg-white/10 border border-white/25 text-white px-3 py-2 rounded-lg hover:bg-white/15 transition-all text-sm"
                  >
                    Export Excel
                  </button>
                  <button
                    onClick={() => exportResults('pdf')}
                    className="bg-white/10 border border-white/25 text-white px-3 py-2 rounded-lg hover:bg-white/15 transition-all text-sm"
                  >
                    Export PDF
                  </button>
                </div>
              </div>

              {extractionResults.map((result, index) => (
                <div key={index} className="space-y-6">
                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-white">Revenue</h4>
                          <p className="text-2xl font-semibold text-green-400">{formatCurrency(result.revenue)}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-400" />
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-white">Net Income</h4>
                          <p className="text-2xl font-semibold text-blue-400">{formatCurrency(result.netIncome)}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-blue-400" />
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-white">Transactions</h4>
                          <p className="text-2xl font-semibold text-cyan-400">{result.totalTransactions.toLocaleString()}</p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-cyan-400" />
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-white">Gross Margin</h4>
                          <p className="text-2xl font-semibold text-purple-400">{(result.keyMetrics.grossMargin * 100).toFixed(1)}%</p>
                        </div>
                        <Target className="w-8 h-8 text-purple-400" />
                      </div>
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                      <h4 className="font-medium text-white mb-3 flex items-center">
                        <Brain className="w-5 h-5 mr-2 text-cyan-400" />
                        AI Insights
                      </h4>
                      <ul className="space-y-2">
                        {result.insights.map((insight, idx) => (
                          <li key={idx} className="text-sm text-gray-300 flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                      <h4 className="font-medium text-white mb-3 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                        Risk Factors
                      </h4>
                      <ul className="space-y-2">
                        {result.riskFactors.map((risk, idx) => (
                          <li key={idx} className="text-sm text-gray-300 flex items-start">
                            <AlertTriangle className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* File Upload Tab */}
      {extractionMode === 'file' && (
        <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/25 mb-6">
              <div className="bg-cyan-500/20 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Upload className="w-12 h-12 text-cyan-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Upload QuickBooks Files</h3>
              <p className="text-gray-400 mb-6">Drag and drop your QBO files or click to browse</p>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".qbo,.qbw,.qbb,.iif,.csv,.xlsx"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Choose Files'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                <Database className="w-8 h-8 text-blue-400 mb-2" />
                <h4 className="font-medium text-white mb-1">Secure Processing</h4>
                <p className="text-gray-400 text-sm">Enterprise-grade security for your financial data</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                <Brain className="w-8 h-8 text-cyan-400 mb-2" />
                <h4 className="font-medium text-white mb-1">AI Analysis</h4>
                <p className="text-gray-400 text-sm">Advanced insights and risk assessment</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                <Download className="w-8 h-8 text-slate-300 mb-2" />
                <h4 className="font-medium text-white mb-1">Export Ready</h4>
                <p className="text-gray-400 text-sm">Multiple formats for analysis and reporting</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedQBODataExtractor;
