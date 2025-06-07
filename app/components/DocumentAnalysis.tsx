import React, { useState } from 'react'
import { Upload, FileText, BarChart3, PieChart, Download, AlertTriangle, CheckCircle, Brain, TrendingUp } from 'lucide-react'

interface DocumentAnalysisProps {
  companyName: string
  onAnalysisComplete: (analysis: AnalysisResults) => void
}

interface DocumentSummary {
  total_files: number
  financial_statements: number
  bank_statements: number
  tax_documents: number
  other_documents: number
}

interface ComplianceCheck {
  tax_compliance: 'Good' | 'Fair' | 'Needs Review'
  gaap_compliance: 'Good' | 'Fair' | 'Needs Review'
  internal_controls: 'Good' | 'Fair' | 'Needs Review'
  documentation_completeness: 'Good' | 'Fair' | 'Needs Review'
}

interface AnalysisResults {
  document_summary: DocumentSummary
  financial_insights: string[]
  red_flags: string[]
  compliance_check: ComplianceCheck
  audit_recommendations: string[]
}

export default function DocumentAnalysis({ companyName, onAnalysisComplete }: DocumentAnalysisProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null)
  const [activeTab, setActiveTab] = useState<'upload' | 'analysis' | 'audit-deck'>('upload')

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])
  }

  const analyzeDocuments = async () => {
    if (uploadedFiles.length === 0) return

    setAnalyzing(true)
    setActiveTab('analysis')
    
    // Simulate document analysis
    setTimeout(() => {
      const mockAnalysis: AnalysisResults = {
        document_summary: {
          total_files: uploadedFiles.length,
          financial_statements: uploadedFiles.filter(f => f.name.includes('statement') || f.name.includes('balance')).length,
          bank_statements: uploadedFiles.filter(f => f.name.includes('bank')).length,
          tax_documents: uploadedFiles.filter(f => f.name.includes('tax') || f.name.includes('1099')).length,
          other_documents: uploadedFiles.filter(f => !f.name.includes('statement') && !f.name.includes('bank') && !f.name.includes('tax')).length
        },
        financial_insights: [
          'Identified discrepancies between bank statements and accounting records',
          'Revenue recognition appears consistent across all documents',
          'Cash flow patterns show seasonal variations in Q4',
          'Expense categorization needs standardization across periods'
        ],
        red_flags: [
          'Large unusual transactions in December require explanation',
          'Missing backup documentation for travel expenses',
          'Inconsistent vendor payment terms'
        ],
        compliance_check: {
          tax_compliance: 'Good',
          gaap_compliance: 'Needs Review',
          internal_controls: 'Fair',
          documentation_completeness: 'Good'
        },
        audit_recommendations: [
          'Implement monthly bank reconciliation process',
          'Standardize expense documentation requirements',
          'Review and update chart of accounts',
          'Establish approval workflows for large transactions'
        ]
      }
      
      setAnalysisResults(mockAnalysis)
      onAnalysisComplete(mockAnalysis)
      setAnalyzing(false)
    }, 3000)
  }

  const generateAuditDeck = () => {
    alert('Generating comprehensive audit deck with all uploaded documents and analysis...')
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-600" />
          Document Analysis & Audit Deck Generation - {companyName}
        </h2>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          {[
            { key: 'upload', label: 'Upload Documents', icon: Upload },
            { key: 'analysis', label: 'Analysis Results', icon: Brain },
            { key: 'audit-deck', label: 'Audit Deck', icon: FileText }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === key
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <div className="text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Financial Documents</h3>
                <p className="text-gray-500 mb-4">
                  Drag and drop your files here, or click to browse
                </p>
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <p>Supported file types:</p>
                  <div className="flex justify-center space-x-4">
                    <span>• Excel (.xlsx, .xls)</span>
                    <span>• PDF documents</span>
                    <span>• CSV files</span>
                    <span>• QuickBooks exports</span>
                  </div>
                </div>
                <input
                  type="file"
                  multiple
                  accept=".xlsx,.xls,.pdf,.csv,.qbo"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="document-upload"
                />
                <label
                  htmlFor="document-upload"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer inline-block"
                >
                  Choose Files
                </label>
              </div>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold">Uploaded Documents ({uploadedFiles.length})</h4>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={analyzeDocuments}
                  disabled={analyzing}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {analyzing ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Brain className="w-5 h-5" />
                  )}
                  <span>{analyzing ? 'Analyzing Documents...' : 'Analyze All Documents'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Analysis Results Tab */}
        {activeTab === 'analysis' && analysisResults && (
          <div className="space-y-6">
            {/* Document Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-700">{analysisResults.document_summary.total_files}</div>
                <div className="text-sm text-blue-600">Total Documents</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-700">{analysisResults.document_summary.financial_statements}</div>
                <div className="text-sm text-green-600">Financial Statements</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-700">{analysisResults.document_summary.bank_statements}</div>
                <div className="text-sm text-purple-600">Bank Statements</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-700">{analysisResults.document_summary.tax_documents}</div>
                <div className="text-sm text-orange-600">Tax Documents</div>
              </div>
            </div>

            {/* Financial Insights */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Financial Insights
              </h3>
              <div className="space-y-3">
                {analysisResults.financial_insights.map((insight: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Red Flags */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Areas Requiring Attention
              </h3>
              <div className="space-y-3">
                {analysisResults.red_flags.map((flag: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-red-800">{flag}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Check */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Compliance Assessment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(analysisResults.compliance_check).map(([key, value]) => (
                  <div key={key} className="p-3 border rounded-lg">
                    <div className="text-sm text-gray-600 capitalize">{key.replace('_', ' ')}</div>
                    <div className={`font-semibold ${
                      value === 'Good' ? 'text-green-600' :
                      value === 'Fair' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Recommendations */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-600" />
                Audit Recommendations
              </h3>
              <div className="space-y-3">
                {analysisResults.audit_recommendations.map((recommendation: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Audit Deck Tab */}
        {activeTab === 'audit-deck' && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Generate Comprehensive Audit Deck</h3>
              <p className="text-gray-600 mb-6">
                Create a professional audit deck combining financial analysis with document insights
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="text-left">
                  <h4 className="font-semibold mb-3">Included in Audit Deck:</h4>
                  <div className="space-y-2">
                    {[
                      'Executive Summary',
                      'Document Analysis Results',
                      'Financial Health Assessment',
                      'Compliance Review',
                      'Risk Analysis',
                      'Improvement Recommendations',
                      'Action Plan with Timelines',
                      'Supporting Documentation'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-left">
                  <h4 className="font-semibold mb-3">Export Formats:</h4>
                  <div className="space-y-3">
                    <button
                      onClick={generateAuditDeck}
                      className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
                    >
                      <Download className="w-5 h-5" />
                      <span>Generate PDF Audit Deck</span>
                    </button>
                    <button
                      onClick={() => alert('Generating PowerPoint presentation...')}
                      className="w-full bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition flex items-center justify-center space-x-2"
                    >
                      <PieChart className="w-5 h-5" />
                      <span>Generate PowerPoint Deck</span>
                    </button>
                    <button
                      onClick={() => alert('Generating Excel workbook...')}
                      className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2"
                    >
                      <BarChart3 className="w-5 h-5" />
                      <span>Generate Excel Analysis</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
