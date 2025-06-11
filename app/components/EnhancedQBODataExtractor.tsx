'use client';
import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, Play, Pause, RefreshCw, CheckCircle, AlertCircle, TrendingUp, DollarSign, Calendar, Users, Settings, Filter, Search, BarChart3, Database } from 'lucide-react';

interface DataFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  recordCount?: number;
}

interface ExtractionResult {
  id: string;
  fileName: string;
  extractedAt: string;
  recordCount: number;
  categories: string[];
  totalAmount: number;
  dateRange: {
    start: string;
    end: string;
  };
}

const EnhancedQBODataExtractor: React.FC = () => {
  const [files, setFiles] = useState<DataFile[]>([]);
  const [extractionResults, setExtractionResults] = useState<ExtractionResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (uploadedFiles: FileList) => {
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
      
      // Simulate upload and processing
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setFiles(prev => prev.map(f => 
          f.id === newFile.id ? { ...f, progress, status: progress === 100 ? 'processing' : 'uploading' } : f
        ));
      }
      
      // Simulate processing completion
      setTimeout(() => {
        const mockResult: ExtractionResult = {
          id: newFile.id,
          fileName: file.name,
          extractedAt: new Date().toISOString(),
          recordCount: Math.floor(Math.random() * 1000) + 100,
          categories: ['Income', 'Expenses', 'Assets', 'Liabilities'],
          totalAmount: Math.floor(Math.random() * 100000) + 10000,
          dateRange: {
            start: '2024-01-01',
            end: '2024-12-31'
          }
        };
        
        setFiles(prev => prev.map(f => 
          f.id === newFile.id ? { ...f, status: 'completed', recordCount: mockResult.recordCount } : f
        ));
        setExtractionResults(prev => [...prev, mockResult]);
      }, 2000);
    }
    
    setIsProcessing(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900 p-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium text-white mb-2">QuickBooks Data Extractor</h1>
            <p className="text-gray-300">Extract and analyze your QuickBooks financial data</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/25">
              <Database className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="text-right">
              <div className="text-white font-semibold">{files.length}</div>
              <div className="text-gray-400 text-sm">Files Processed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 mb-6">
        <div className="flex space-x-1 p-2">
          {[
            { id: 'upload', label: 'Upload & Extract', icon: Upload },
            { id: 'files', label: 'File Manager', icon: FileText },
            { id: 'results', label: 'Results', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings }
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

      {/* Upload Tab */}
      {activeTab === 'upload' && (
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
                accept=".qbo,.qbw,.qbb,.iif"
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
                <TrendingUp className="w-8 h-8 text-cyan-400 mb-2" />
                <h4 className="font-medium text-white mb-1">Smart Analysis</h4>
                <p className="text-gray-400 text-sm">AI-powered insights and categorization</p>
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

      {/* Files Tab */}
      {activeTab === 'files' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/25 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/25 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="all" className="bg-slate-800">All Files</option>
                <option value="completed" className="bg-slate-800">Completed</option>
                <option value="processing" className="bg-slate-800">Processing</option>
                <option value="error" className="bg-slate-800">Error</option>
              </select>
            </div>
          </div>

          {/* Files List */}
          <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <div className="space-y-4">
              {filteredFiles.map(file => (
                <div
                  key={file.id}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25 hover:bg-white/15 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-blue-500/20">
                        {getStatusIcon(file.status)}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{file.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{file.size}</span>
                          <span>{new Date(file.uploadedAt).toLocaleString()}</span>
                          {file.recordCount && <span>{file.recordCount} records</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        file.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        file.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                        file.status === 'error' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {file.status}
                      </span>
                      {file.status === 'completed' && (
                        <button className="bg-white/10 border border-white/25 text-white px-3 py-1 rounded-lg hover:bg-white/15 transition-all duration-200 text-xs">
                          <Download className="w-3 h-3 inline mr-1" />
                          Export
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {file.status === 'uploading' || file.status === 'processing' ? (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
                        <span>{file.status === 'uploading' ? 'Uploading...' : 'Processing...'}</span>
                        <span>{file.progress}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
              
              {filteredFiles.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No files found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results Tab */}
      {activeTab === 'results' && (
        <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">Total Records</h3>
                  <p className="text-2xl font-semibold text-cyan-400">
                    {extractionResults.reduce((sum, result) => sum + result.recordCount, 0).toLocaleString()}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">Total Amount</h3>
                  <p className="text-2xl font-semibold text-blue-400">
                    ${extractionResults.reduce((sum, result) => sum + result.totalAmount, 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">Files Processed</h3>
                  <p className="text-2xl font-semibold text-slate-300">{extractionResults.length}</p>
                </div>
                <FileText className="w-8 h-8 text-slate-300" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {extractionResults.map(result => (
              <div key={result.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-white">{result.fileName}</h3>
                  <span className="text-sm text-gray-400">{new Date(result.extractedAt).toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Records:</span>
                    <span className="text-white font-medium ml-2">{result.recordCount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white font-medium ml-2">${result.totalAmount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Categories:</span>
                    <span className="text-white font-medium ml-2">{result.categories.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Date Range:</span>
                    <span className="text-white font-medium ml-2">{result.dateRange.start} to {result.dateRange.end}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <h2 className="text-xl font-medium text-white mb-6">Extraction Settings</h2>
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
              <h3 className="font-medium text-white mb-4">Data Categories</h3>
              <div className="grid grid-cols-2 gap-4">
                {['Income', 'Expenses', 'Assets', 'Liabilities', 'Equity', 'Accounts'].map(category => (
                  <label key={category} className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded border-white/25" />
                    <span className="text-gray-300">{category}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
              <h3 className="font-medium text-white mb-4">Export Format</h3>
              <select className="w-full px-4 py-2 bg-white/10 border border-white/25 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="csv" className="bg-slate-800">CSV</option>
                <option value="xlsx" className="bg-slate-800">Excel (XLSX)</option>
                <option value="json" className="bg-slate-800">JSON</option>
                <option value="pdf" className="bg-slate-800">PDF Report</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedQBODataExtractor;
