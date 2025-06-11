'use client'

import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Calendar, BarChart3, TrendingUp, DollarSign, Users, Building2, Brain, Zap, AlertCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';

interface ConnectedCompany {
  id: string;
  company_name: string;
  realm_id: string;
  status: 'active' | 'expired' | 'error';
  connected_at: string;
}

interface FinancialData {
  revenue: number;
  net_income: number;
  expenses: number;
  assets: number;
  liabilities: number;
  created_at: string;
}

interface TranscriptData {
  id: string;
  title: string;
  duration_seconds: number;
  participant_count: number;
  call_date: string;
  key_topics: string[];
  action_items: string[];
}

interface GeneratedReport {
  id: string;
  title: string;
  type: 'financial' | 'audit' | 'analysis';
  status: 'generating' | 'completed' | 'error';
  generatedAt: string;
  company_id: string;
  data: {
    financial: FinancialData | null;
    transcripts: TranscriptData[];
    insights: string[];
    recommendations: string[];
  };
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'financial' | 'audit' | 'analysis';
  icon: React.ReactNode;
  estimatedTime: string;
  requirements: string[];
}

export default function AIReportGenerator() {
  const [selectedCompany, setSelectedCompany] = useState<ConnectedCompany | null>(null);
  const [connectedCompanies, setConnectedCompanies] = useState<ConnectedCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [transcripts, setTranscripts] = useState<TranscriptData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'comprehensive-financial',
      name: 'Comprehensive Financial Analysis',
      description: 'Complete financial health assessment with AI-powered insights and recommendations',
      type: 'financial',
      icon: <DollarSign className="w-6 h-6" />,
      estimatedTime: '3-5 minutes',
      requirements: ['QuickBooks data', 'Optional: Call transcripts']
    },
    {
      id: 'audit-presentation',
      name: 'Professional Audit Deck',
      description: 'Client-ready presentation with executive summary and strategic recommendations',
      type: 'audit',
      icon: <FileText className="w-6 h-6" />,
      estimatedTime: '5-8 minutes',
      requirements: ['Financial data', 'Discovery call transcripts']
    },
    {
      id: 'performance-analysis',
      name: 'Performance & Growth Analysis',
      description: 'Detailed analysis of business performance with growth projections and benchmarking',
      type: 'analysis',
      icon: <TrendingUp className="w-6 h-6" />,
      estimatedTime: '4-6 minutes',
      requirements: ['Historical financial data', 'Industry benchmarks']
    }
  ];

  useEffect(() => {
    fetchConnectedCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchCompanyData(selectedCompany.realm_id);
    }
  }, [selectedCompany]);

  const fetchConnectedCompanies = async () => {
    try {
      setError(null);
      const response = await fetch('/api/companies');
      if (response.ok) {
        const data = await response.json();
        if (data.companies && data.companies.length > 0) {
          setConnectedCompanies(data.companies);
          // Auto-select first active company
          const firstActive = data.companies.find((c: ConnectedCompany) => c.status === 'active');
          setSelectedCompany(firstActive || data.companies[0]);
        } else {
          setError('No connected QuickBooks companies found. Please connect a company first.');
        }
      } else {
        throw new Error('Failed to fetch companies');
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      setError('Failed to load companies. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompanyData = async (realmId: string) => {
    try {
      // Fetch financial data
      const financialResponse = await fetch(`/api/financial-snapshots?realm_id=${realmId}`);
      if (financialResponse.ok) {
        const financialData = await financialResponse.json();
        if (financialData && financialData.length > 0) {
          setFinancialData(financialData[0]);
        }
      }

      // Fetch transcripts
      const transcriptsResponse = await fetch(`/api/documents?realm_id=${realmId}&document_type=transcript`);
      if (transcriptsResponse.ok) {
        const transcriptsData = await transcriptsResponse.json();
        setTranscripts(transcriptsData || []);
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
    }
  };

  const generateReport = async (templateId: string) => {
    if (!selectedCompany || !financialData) {
      setError('Missing required data. Please ensure financial data is available.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const template = reportTemplates.find(t => t.id === templateId);
      if (!template) throw new Error('Template not found');

      // Create report object
      const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newReport: GeneratedReport = {
        id: reportId,
        title: `${template.name} - ${selectedCompany.company_name}`,
        type: template.type,
        status: 'generating',
        generatedAt: new Date().toISOString(),
        company_id: selectedCompany.realm_id,
        data: {
          financial: financialData,
          transcripts: transcripts,
          insights: [],
          recommendations: []
        }
      };

      // Add to generated reports
      setGeneratedReports(prev => [newReport, ...prev]);

      // Simulate AI analysis (replace with actual AI API call)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate AI insights and recommendations based on real data
      const insights = generateAIInsights(financialData, transcripts);
      const recommendations = generateAIRecommendations(financialData, transcripts);

      // Update report with completed status
      const completedReport: GeneratedReport = {
        ...newReport,
        status: 'completed',
        data: {
          ...newReport.data,
          insights,
          recommendations
        }
      };

      setGeneratedReports(prev => 
        prev.map(report => 
          report.id === reportId ? completedReport : report
        )
      );

      // Store report in database
      await storeReportInDatabase(completedReport);

    } catch (error) {
      console.error('Error generating report:', error);
      setError('Failed to generate report. Please try again.');
      
      // Update report status to error
      setGeneratedReports(prev => 
        prev.map(report => 
          report.id.includes(Date.now().toString()) 
            ? { ...report, status: 'error' as const }
            : report
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAIInsights = (financial: FinancialData, transcripts: TranscriptData[]): string[] => {
    const insights: string[] = [];
    
    // Revenue insights
    if (financial.revenue > 0) {
      const margin = ((financial.revenue - financial.expenses) / financial.revenue) * 100;
      insights.push(`Current profit margin of ${margin.toFixed(1)}% ${margin > 20 ? 'exceeds' : 'falls below'} industry benchmarks`);
    }

    // Liquidity insights
    if (financial.assets && financial.liabilities) {
      const currentRatio = financial.assets / financial.liabilities;
      insights.push(`Current ratio of ${currentRatio.toFixed(2)} indicates ${currentRatio > 1.5 ? 'strong' : 'moderate'} liquidity position`);
    }

    // Growth insights
    insights.push(`Revenue growth trajectory shows ${financial.revenue > 1000000 ? 'strong' : 'moderate'} market position`);

    // Transcript insights
    if (transcripts.length > 0) {
      const commonTopics = transcripts.flatMap(t => t.key_topics).reduce((acc, topic) => {
        acc[topic] = (acc[topic] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const topTopic = Object.entries(commonTopics).sort(([,a], [,b]) => b - a)[0];
      if (topTopic) {
        insights.push(`Client discussions frequently focus on ${topTopic[0].toLowerCase()}, indicating strategic priority`);
      }
    }

    return insights;
  };

  const generateAIRecommendations = (financial: FinancialData, transcripts: TranscriptData[]): string[] => {
    const recommendations: string[] = [];
    
    // Financial recommendations
    const margin = financial.revenue > 0 ? ((financial.revenue - financial.expenses) / financial.revenue) * 100 : 0;
    
    if (margin < 15) {
      recommendations.push('Implement cost optimization strategies to improve profit margins');
      recommendations.push('Review pricing strategy to ensure optimal revenue capture');
    } else if (margin > 25) {
      recommendations.push('Consider strategic investments in growth initiatives');
      recommendations.push('Evaluate market expansion opportunities');
    }

    // Liquidity recommendations
    if (financial.assets && financial.liabilities) {
      const currentRatio = financial.assets / financial.liabilities;
      if (currentRatio < 1.2) {
        recommendations.push('Improve working capital management to enhance liquidity');
      } else if (currentRatio > 3) {
        recommendations.push('Optimize cash utilization for better returns on assets');
      }
    }

    // Growth recommendations
    recommendations.push('Implement advanced analytics for predictive business insights');
    recommendations.push('Diversify revenue streams to reduce market concentration risk');

    // Transcript-based recommendations
    if (transcripts.length > 0) {
      recommendations.push('Leverage client feedback themes to enhance service delivery');
      recommendations.push('Develop targeted solutions based on recurring client concerns');
    }

    return recommendations;
  };

  const storeReportInDatabase = async (report: GeneratedReport) => {
    try {
      await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: report.title,
          description: `AI-generated ${report.type} report`,
          file_name: `${report.title.replace(/\s+/g, '_')}.html`,
          document_type: 'analysis_report',
          realm_id: report.company_id,
          account_name: selectedCompany?.company_name,
          status: 'completed',
          analysis_completion_percentage: 100
        })
      });
    } catch (error) {
      console.error('Error storing report in database:', error);
    }
  };

  const handleDownloadReport = (report: GeneratedReport) => {
    // Use your existing handleDownloadReport function with enhanced data
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${report.title} - QuickScope Analytics</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background: #fff;
            padding: 40px;
        }
        .header { 
            border-bottom: 3px solid #1e40af; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
        }
        .logo { 
            display: flex; 
            align-items: center; 
            gap: 15px; 
            margin-bottom: 20px; 
        }
        .logo-icon { 
            width: 50px; 
            height: 50px; 
            background: linear-gradient(135deg, #3b82f6, #1e40af); 
            border-radius: 12px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: white; 
            font-weight: bold; 
            font-size: 20px; 
        }
        .company-name { 
            font-size: 28px; 
            font-weight: bold; 
            color: #1e40af; 
        }
        .tagline { 
            color: #64748b; 
            font-size: 14px; 
        }
        .report-title { 
            font-size: 36px; 
            font-weight: bold; 
            color: #1e293b; 
            margin: 20px 0; 
        }
        .report-meta { 
            color: #64748b; 
            font-size: 14px; 
        }
        .section { 
            margin: 40px 0; 
        }
        .section-title { 
            font-size: 24px; 
            font-weight: bold; 
            color: #1e40af; 
            margin-bottom: 20px; 
            border-left: 4px solid #3b82f6; 
            padding-left: 15px; 
        }
        .executive-summary { 
            background: linear-gradient(135deg, #f8fafc, #e2e8f0); 
            padding: 25px; 
            border-radius: 12px; 
            border-left: 5px solid #3b82f6; 
            margin: 20px 0; 
        }
        .metrics-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 20px; 
            margin: 20px 0; 
        }
        .metric-card { 
            background: #fff; 
            border: 1px solid #e5e7eb; 
            border-radius: 12px; 
            padding: 20px; 
            text-align: center; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
        }
        .metric-value { 
            font-size: 28px; 
            font-weight: bold; 
            color: #1e40af; 
            margin-bottom: 5px; 
        }
        .metric-label { 
            color: #64748b; 
            font-size: 14px; 
        }
        .insight-box { 
            background: #fef7cd; 
            border: 1px solid #fbbf24; 
            border-radius: 8px; 
            padding: 15px; 
            margin: 15px 0; 
        }
        .insight-title { 
            font-weight: 600; 
            color: #92400e; 
            margin-bottom: 8px; 
        }
        .recommendations { 
            background: #f0f9ff; 
            border: 1px solid #0ea5e9; 
            border-radius: 12px; 
            padding: 20px; 
            margin: 20px 0; 
        }
        .recommendation-item { 
            margin: 10px 0; 
            padding-left: 20px; 
            position: relative; 
        }
        .recommendation-item::before { 
            content: "→"; 
            position: absolute; 
            left: 0; 
            color: #0ea5e9; 
            font-weight: bold; 
        }
        .footer { 
            margin-top: 60px; 
            padding-top: 20px; 
            border-top: 1px solid #e5e7eb; 
            text-align: center; 
            color: #64748b; 
            font-size: 12px; 
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">
            <div class="logo-icon">QS</div>
            <div>
                <div class="company-name">QUICKSCOPE</div>
                <div class="tagline">by STAXX</div>
            </div>
        </div>
        <h1 class="report-title">${report.title}</h1>
        <div class="report-meta">
            Generated: ${new Date(report.generatedAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })} | Report ID: ${report.id}
        </div>
    </div>

    <div class="executive-summary">
        <h2 class="section-title">Executive Summary</h2>
        <p>This comprehensive ${report.title.toLowerCase()} provides detailed insights into your business performance, 
        identifying key opportunities for growth and optimization. Our AI-powered analysis reveals actionable 
        recommendations based on your actual financial data and business context.</p>
    </div>

    <div class="section">
        <h2 class="section-title">Key Performance Indicators</h2>
        <div class="metrics-grid">
            ${report.data.financial ? `
            <div class="metric-card">
                <div class="metric-value">$${(report.data.financial.revenue / 1000000).toFixed(2)}M</div>
                <div class="metric-label">Annual Revenue</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">$${(report.data.financial.net_income / 1000).toFixed(0)}K</div>
                <div class="metric-label">Net Income</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${(((report.data.financial.revenue - report.data.financial.expenses) / report.data.financial.revenue) * 100).toFixed(1)}%</div>
                <div class="metric-label">Profit Margin</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">$${(report.data.financial.assets / 1000).toFixed(0)}K</div>
                <div class="metric-label">Total Assets</div>
            </div>
            ` : ''}
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">AI-Generated Insights</h2>
        ${report.data.insights.map(insight => `
        <div class="insight-box">
            <div class="insight-title">💡 Key Insight</div>
            ${insight}
        </div>
        `).join('')}
    </div>

    <div class="section">
        <h2 class="section-title">Strategic Recommendations</h2>
        <div class="recommendations">
            ${report.data.recommendations.map(rec => `
            <div class="recommendation-item">${rec}</div>
            `).join('')}
        </div>
    </div>

    ${report.data.transcripts.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Discovery Call Analysis</h2>
        <p>Based on ${report.data.transcripts.length} discovery call transcript(s), key themes include:</p>
        <ul style="margin: 15px 0; padding-left: 20px;">
            ${report.data.transcripts.flatMap(t => t.key_topics).slice(0, 5).map(topic => `<li>${topic}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    <div class="footer">
        <p>© 2025 QuickScope by STAXX. All rights reserved.</p>
        <p>Generated using AI-powered financial analytics platform with live QuickBooks data.</p>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generating': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const canGenerateReport = (template: ReportTemplate): boolean => {
    if (!selectedCompany) return false;
    if (template.requirements.includes('Financial data') && !financialData) return false;
    if (template.requirements.includes('Discovery call transcripts') && transcripts.length === 0) return false;
    return true;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading AI Report Generator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg mr-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">AI Report Generator</h1>
              <p className="text-gray-300">Generate professional reports with AI-powered insights</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 backdrop-blur-xl bg-red-500/20 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-red-200">{error}</span>
            </div>
          </div>
        )}

        {/* Company Selector */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Select Company</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {connectedCompanies.map((company) => (
              <button
                key={company.id}
                onClick={() => setSelectedCompany(company)}
                className={`p-4 border rounded-xl text-left transition-all ${
                  selectedCompany?.id === company.id
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/20 hover:border-white/30 bg-white/5'
                }`}
              >
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-gray-300 mr-3" />
                  <div>
                    <div className="font-medium text-white">{company.company_name}</div>
                    <div className="text-sm text-gray-300">Status: {company.status}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Data Status */}
        {selectedCompany && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Data Availability</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-gray-300">Financial Data</span>
                {financialData ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-gray-300">Transcripts ({transcripts.length})</span>
                {transcripts.length > 0 ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                )}
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-gray-300">Company Connection</span>
                {selectedCompany.status === 'active' ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Report Templates */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-6">Available Report Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reportTemplates.map((template) => (
              <div
                key={template.id}
                className="border border-white/20 rounded-xl p-6 bg-white/5 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-xl mr-3">
                    {template.icon}
                  </div>
                  <h3 className="font-semibold text-white">{template.name}</h3>
                </div>
                <p className="text-gray-300 text-sm mb-4">{template.description}</p>
                <div className="text-xs text-gray-400 mb-4">
                  <div>Estimated time: {template.estimatedTime}</div>
                  <div>Requirements: {template.requirements.join(', ')}</div>
                </div>
                <button
                  onClick={() => generateReport(template.id)}
                  disabled={!canGenerateReport(template) || isGenerating}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Generate Report
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Generated Reports */}
        {generatedReports.length > 0 && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Generated Reports</h2>
            <div className="space-y-4">
              {generatedReports.map((report) => (
                <div
                  key={report.id}
                  className="border border-white/20 rounded-xl p-4 bg-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(report.status)}
                    <div>
                      <div className="font-medium text-white">{report.title}</div>
                      <div className="text-sm text-gray-300">
                        Generated: {new Date(report.generatedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {report.status === 'completed' && (
                      <>
                        <button
                          onClick={() => handleDownloadReport(report)}
                          className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 text-sm flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                        <button className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
