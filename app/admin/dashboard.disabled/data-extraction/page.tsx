'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Database, Download, Upload, RefreshCw, CheckCircle, AlertTriangle,
  FileText, BarChart3, PieChart, TrendingUp, Calendar, Filter,
  Search, Settings, Play, Pause, Eye, X, Zap, Building2,
  DollarSign, Target, Activity, Clock, Server, HardDrive
} from 'lucide-react';

interface ExtractionConfig {
  dateRange: {
    start: string;
    end: string;
  };
  dataTypes: string[];
  depth: 'basic' | 'detailed' | 'comprehensive';
  format: 'json' | 'csv' | 'xlsx' | 'pdf';
  includeAttachments: boolean;
  includeTransactions: boolean;
  includeReports: boolean;
}

interface ConnectedAccount {
  id: string;
  companyName: string;
  lastSync: string;
  status: 'connected' | 'syncing' | 'error';
  dataTypes: string[];
}

interface ExtractionJob {
  id: string;
  accountId: string;
  accountName: string;
  status: 'running' | 'completed' | 'failed' | 'queued';
  progress: number;
  startTime: string;
  estimatedCompletion: string;
  dataSize: string;
  recordsExtracted: number;
}

const DataExtractionPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountId = searchParams?.get('account');

  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [extractionConfig, setExtractionConfig] = useState<ExtractionConfig>({
    dateRange: {
      start: '2024-01-01',
      end: '2024-12-31'
    },
    dataTypes: ['transactions', 'accounts', 'customers'],
    depth: 'detailed',
    format: 'xlsx',
    includeAttachments: true,
    includeTransactions: true,
    includeReports: true
  });
  const [isExtracting, setIsExtracting] = useState(false);
  const [activeJobs, setActiveJobs] = useState<ExtractionJob[]>([]);
  const [extractionHistory, setExtractionHistory] = useState<ExtractionJob[]>([]);
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [activeTab, setActiveTab] = useState('extract');

  useEffect(() => {
    loadAccountsAndJobs();
    if (accountId) {
      setSelectedAccount(accountId);
    }
  }, [accountId]);

  const loadAccountsAndJobs = async () => {
    // Mock data - replace with actual API calls
    const mockAccounts: ConnectedAccount[] = [
      {
        id: '1',
        companyName: 'TechCorp Solutions',
        lastSync: '2024-06-09T08:30:00Z',
        status: 'connected',
        dataTypes: ['transactions', 'accounts', 'customers', 'vendors', 'items']
      },
      {
        id: '2',
        companyName: 'Global Manufacturing Inc',
        lastSync: '2024-06-09T06:15:00Z',
        status: 'connected',
        dataTypes: ['transactions', 'accounts', 'customers', 'vendors', 'payroll']
      },
      {
        id: '3',
        companyName: 'Healthcare Plus',
        lastSync: '2024-06-09T07:45:00Z',
        status: 'syncing',
        dataTypes: ['transactions', 'accounts', 'customers']
      }
    ];

    const mockActiveJobs: ExtractionJob[] = [
      {
        id: 'job-1',
        accountId: '2',
        accountName: 'Global Manufacturing Inc',
        status: 'running',
        progress: 67,
        startTime: '2024-06-09T09:15:00Z',
        estimatedCompletion: '2024-06-09T09:45:00Z',
        dataSize: '2.3 GB',
        recordsExtracted: 15420
      }
    ];

    const mockHistory: ExtractionJob[] = [
      {
        id: 'job-2',
        accountId: '1',
        accountName: 'TechCorp Solutions',
        status: 'completed',
        progress: 100,
        startTime: '2024-06-08T14:20:00Z',
        estimatedCompletion: '2024-06-08T14:45:00Z',
        dataSize: '1.8 GB',
        recordsExtracted: 12650
      },
      {
        id: 'job-3',
        accountId: '3',
        accountName: 'Healthcare Plus',
        status: 'completed',
        progress: 100,
        startTime: '2024-06-07T11:30:00Z',
        estimatedCompletion: '2024-06-07T12:00:00Z',
        dataSize: '3.1 GB',
        recordsExtracted: 18920
      }
    ];

    setAccounts(mockAccounts);
    setActiveJobs(mockActiveJobs);
    setExtractionHistory(mockHistory);
  };

  const handleStartExtraction = async () => {
    if (selectedAccount === 'all') {
      alert('Please select a specific account for extraction');
      return;
    }

    setIsExtracting(true);
    
    // Simulate extraction start
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newJob: ExtractionJob = {
      id: `job-${Date.now()}`,
      accountId: selectedAccount,
      accountName: accounts.find(a => a.id === selectedAccount)?.companyName || 'Unknown',
      status: 'running',
      progress: 0,
      startTime: new Date().toISOString(),
      estimatedCompletion: new Date(Date.now() + 30 * 60000).toISOString(),
      dataSize: 'Calculating...',
      recordsExtracted: 0
    };

    setActiveJobs(prev => [...prev, newJob]);
    setIsExtracting(false);
    
    // Simulate progress updates
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        // Move to completed
        setTimeout(() => {
          setActiveJobs(prev => prev.filter(job => job.id !== newJob.id));
          setExtractionHistory(prev => [{
            ...newJob,
            status: 'completed',
            progress: 100,
            dataSize: '2.1 GB',
            recordsExtracted: 14250
          }, ...prev]);
        }, 2000);
      }
      
      setActiveJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? { ...job, progress: Math.min(progress, 100), recordsExtracted: Math.floor(progress * 140) }
          : job
      ));
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-blue-400 bg-blue-500/20';
      case 'completed': return 'text-green-400 bg-green-500/20';
      case 'failed': return 'text-red-400 bg-red-500/20';
      case 'queued': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900 p-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium text-white mb-2">Advanced Data Extraction</h1>
            <p className="text-gray-300">Extract and process comprehensive QuickBooks financial data</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.push('/admin/dashboard/main')}
              className="bg-white/10 backdrop-blur-sm border border-white/25 text-white px-4 py-2 rounded-xl hover:bg-white/15 transition-all duration-200 flex items-center space-x-2"
            >
              <Database className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 mb-6">
        <div className="flex space-x-1 p-2">
          {[
            { id: 'extract', label: 'Data Extraction', icon: Database },
            { id: 'monitor', label: 'Active Jobs', icon: Activity },
            { id: 'history', label: 'History', icon: Clock }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white/15 text-white border border-white/30'
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Data Extraction Tab */}
      {activeTab === 'extract' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <h2 className="text-xl font-medium text-white mb-4">Extraction Configuration</h2>
              
              {/* Account Selection */}
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Select Account</label>
                  <select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/25 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="all" className="bg-slate-800 text-white">Select Account...</option>
                    {accounts.map(account => (
                      <option key={account.id} value={account.id} className="bg-slate-800 text-white">
                        {account.companyName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Start Date</label>
                    <input
                      type="date"
                      value={extractionConfig.dateRange.start}
                      onChange={(e) => setExtractionConfig(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, start: e.target.value }
                      }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/25 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">End Date</label>
                    <input
                      type="date"
                      value={extractionConfig.dateRange.end}
                      onChange={(e) => setExtractionConfig(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, end: e.target.value }
                      }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/25 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>

                {/* Extraction Depth */}
                <div>
                  <label className="block text-white font-medium mb-2">Extraction Depth</label>
                  <select
                    value={extractionConfig.depth}
                    onChange={(e) => setExtractionConfig(prev => ({
                      ...prev,
                      depth: e.target.value as 'basic' | 'detailed' | 'comprehensive'
                    }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/25 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="basic" className="bg-slate-800 text-white">Basic (Transactions only)</option>
                    <option value="detailed" className="bg-slate-800 text-white">Detailed (Transactions + Reports)</option>
                    <option value="comprehensive" className="bg-slate-800 text-white">Comprehensive (Full dataset)</option>
                  </select>
                </div>

                {/* Export Format */}
                <div>
                  <label className="block text-white font-medium mb-2">Export Format</label>
                  <select
                    value={extractionConfig.format}
                    onChange={(e) => setExtractionConfig(prev => ({
                      ...prev,
                      format: e.target.value as 'json' | 'csv' | 'xlsx' | 'pdf'
                    }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/25 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="xlsx" className="bg-slate-800 text-white">Excel (.xlsx)</option>
                    <option value="csv" className="bg-slate-800 text-white">CSV (.csv)</option>
                    <option value="json" className="bg-slate-800 text-white">JSON (.json)</option>
                    <option value="pdf" className="bg-slate-800 text-white">PDF Report (.pdf)</option>
                  </select>
                </div>
              </div>

              {/* Data Types */}
              <div className="mt-6">
                <label className="block text-white font-medium mb-4">Data Types to Extract</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Transactions', 'Accounts', 'Customers', 'Vendors', 
                    'Items', 'Employees', 'Payroll', 'Tax Data',
                    'Bank Accounts', 'Credit Cards', 'Invoices', 'Bills'
                  ].map(dataType => (
                    <label key={dataType} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={extractionConfig.dataTypes.includes(dataType.toLowerCase())}
                        onChange={(e) => {
                          const value = dataType.toLowerCase();
                          setExtractionConfig(prev => ({
                            ...prev,
                            dataTypes: e.target.checked 
                              ? [...prev.dataTypes, value]
                              : prev.dataTypes.filter(t => t !== value)
                          }));
                        }}
                        className="w-4 h-4 text-blue-500 bg-white/10 border-white/25 rounded focus:ring-blue-400 focus:ring-2"
                      />
                      <span className="text-white">{dataType}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Start Extraction Button */}
              <button
                onClick={handleStartExtraction}
                disabled={isExtracting || selectedAccount === 'all'}
                className={`w-full mt-6 px-6 py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  isExtracting || selectedAccount === 'all'
                    ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700'
                }`}
              >
                {isExtracting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Starting Extraction...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Start Data Extraction</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Data Quality & Preview */}
          <div className="space-y-6">
            {/* Account Status */}
            <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <h2 className="text-xl font-medium text-white mb-4">Connected Accounts Status</h2>
              <div className="space-y-3">
                {accounts.map(account => (
                  <div key={account.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div>
                      <h3 className="font-medium text-white">{account.companyName}</h3>
                      <p className="text-sm text-gray-400">Last sync: {new Date(account.lastSync).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        account.status === 'connected' ? 'bg-green-500/20 text-green-400' :
                        account.status === 'syncing' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {account.status}
                      </span>
                      <button className="p-1 bg-white/10 rounded hover:bg-white/20 transition-colors">
                        <RefreshCw className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Quality Metrics */}
            <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <h2 className="text-xl font-medium text-white mb-4">Data Quality Assessment</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Data Completeness</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-white/10 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                    <span className="text-green-400 font-medium">94%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Data Accuracy</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-white/10 rounded-full h-2">
                      <div className="bg-blue-400 h-2 rounded-full" style={{ width: '97%' }}></div>
                    </div>
                    <span className="text-blue-400 font-medium">97%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Data Freshness</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-white/10 rounded-full h-2">
                      <div className="bg-cyan-400 h-2 rounded-full" style={{ width: '89%' }}></div>
                    </div>
                    <span className="text-cyan-400 font-medium">89%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Export Options */}
            <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <h2 className="text-xl font-medium text-white mb-4">Quick Export Templates</h2>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { name: 'Financial Statements', desc: 'P&L, Balance Sheet, Cash Flow', icon: BarChart3 },
                  { name: 'Transaction History', desc: 'All transactions for date range', icon: Activity },
                  { name: 'Customer Analysis', desc: 'Customer data and metrics', icon: Target },
                  { name: 'Tax Preparation', desc: 'Tax-ready financial data', icon: FileText }
                ].map(template => (
                  <button key={template.name} className="flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-left">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <template.icon className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{template.name}</h3>
                      <p className="text-sm text-gray-400">{template.desc}</p>
                    </div>
                    <Download className="w-4 h-4 text-gray-400 ml-auto" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Jobs Tab */}
      {activeTab === 'monitor' && (
        <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-white">Active Extraction Jobs</h2>
            <span className="text-gray-400">{activeJobs.length} running</span>
          </div>
          
          {activeJobs.length === 0 ? (
            <div className="text-center py-12">
              <Database className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Active Jobs</h3>
              <p className="text-gray-400">Start a new extraction to see progress here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeJobs.map(job => (
                <div key={job.id} className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-white">{job.accountName}</h3>
                      <p className="text-sm text-gray-400">Started: {new Date(job.startTime).toLocaleString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">{Math.round(job.progress)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Records</span>
                        <p className="text-white font-medium">{job.recordsExtracted.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Data Size</span>
                        <p className="text-white font-medium">{job.dataSize}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">ETA</span>
                        <p className="text-white font-medium">
                          {new Date(job.estimatedCompletion).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-white">Extraction History</h2>
            <button className="bg-white/10 border border-white/25 text-white px-3 py-1 rounded-lg hover:bg-white/15 transition-all duration-200 text-sm">
              <Download className="w-4 h-4" />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Account</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Records</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Size</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {extractionHistory.map(job => (
                  <tr key={job.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium text-white">{job.accountName}</div>
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      {new Date(job.startTime).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      {job.recordsExtracted.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      {job.dataSize}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="bg-white/10 border border-white/25 text-white p-1 rounded hover:bg-white/15 transition-all duration-200">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="bg-white/10 border border-white/25 text-white p-1 rounded hover:bg-white/15 transition-all duration-200">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataExtractionPage;
