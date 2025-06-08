"use client"
import React, { useState, useMemo, useCallback } from 'react';
import { FileText, Download, Eye, Settings, Zap, BarChart3, TrendingUp, AlertTriangle, CheckCircle, Calendar, Users, DollarSign, PieChart } from 'lucide-react';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'audit_deck' | 'executive_summary' | 'detailed_analysis' | 'investor_report' | 'tax_preparation' | 'custom';
  estimatedPages: number;
  generationTime: string;
  features: string[];
}

interface ReportConfiguration {
  templateId: string;
  companyId: string;
  timeFrame: {
    start: string;
    end: string;
    comparison?: string;
  };
  includeElements: {
    executiveSummary: boolean;
    financialStatements: boolean;
    kpiAnalysis: boolean;
    riskAssessment: boolean;
    industryBenchmarks: boolean;
    recommendations: boolean;
    cashFlowProjections: boolean;
    customerAnalysis: boolean;
    operationalMetrics: boolean;
    taxOptimization: boolean;
  };
  customization: {
    branding: boolean;
    logoUrl?: string;
    colorScheme: 'professional' | 'modern' | 'corporate' | 'custom';
    confidentialityLevel: 'public' | 'internal' | 'confidential' | 'restricted';
  };
  aiEnhancements: {
    generateInsights: boolean;
    predictiveAnalysis: boolean;
    benchmarkComparisons: boolean;
    riskScoring: boolean;
    recommendationEngine: boolean;
  };
}

interface GeneratedReport {
  id: string;
  name: string;
  type: string;
  status: 'generating' | 'completed' | 'error';
  progress: number;
  generatedAt: string;
  pages: number;
  fileSize: string;
  downloadUrl?: string;
  previewSections: {
    title: string;
    content: string;
    charts?: string[];
  }[];
}

const AIReportGenerator: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('audit_deck');
  const [reportConfig, setReportConfig] = useState<ReportConfiguration>({
    templateId: 'audit_deck',
    companyId: 'comp_001',
    timeFrame: {
      start: '2025-01-01',
      end: '2025-06-08',
      comparison: '2024-01-01'
    },
    includeElements: {
      executiveSummary: true,
      financialStatements: true,
      kpiAnalysis: true,
      riskAssessment: true,
      industryBenchmarks: true,
      recommendations: true,
      cashFlowProjections: true,
      customerAnalysis: false,
      operationalMetrics: false,
      taxOptimization: false
    },
    customization: {
      branding: true,
      colorScheme: 'professional',
      confidentialityLevel: 'confidential'
    },
    aiEnhancements: {
      generateInsights: true,
      predictiveAnalysis: true,
      benchmarkComparisons: true,
      riskScoring: true,
      recommendationEngine: true
    }
  });

  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([
    {
      id: 'rpt_001',
      name: 'Q1 2025 Financial Audit Deck',
      type: 'audit_deck',
      status: 'completed',
      progress: 100,
      generatedAt: '2025-06-08T14:30:00Z',
      pages: 42,
      fileSize: '8.7 MB',
      downloadUrl: '#',
      previewSections: [
        {
          title: 'Executive Summary',
          content: 'Strong financial performance with 28.3% YoY revenue growth and improving profitability metrics. Key opportunities identified in gross margin optimization and working capital efficiency.',
          charts: ['revenue_trend', 'profitability_analysis']
        },
        {
          title: 'Risk Assessment',
          content: 'Overall risk level: MEDIUM. Primary concerns include cash runway (7.6 months) and customer concentration. Recommended actions include diversification and cash flow optimization.',
          charts: ['risk_factors', 'cash_flow_forecast']
        }
      ]
    }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const reportTemplates: ReportTemplate[] = useMemo(() => [
    {
      id: 'audit_deck',
      name: 'Financial Audit Deck',
      description: 'Comprehensive financial analysis with executive summary, detailed breakdowns, and strategic recommendations',
      type: 'audit_deck',
      estimatedPages: 35,
      generationTime: '8-12 minutes',
      features: ['Executive Summary', 'Financial Statements', 'KPI Analysis', 'Risk Assessment', 'Recommendations']
    },
    {
      id: 'executive_summary',
      name: 'Executive Summary Report',
      description: 'High-level overview for leadership with key metrics, trends, and strategic insights',
      type: 'executive_summary',
      estimatedPages: 12,
      generationTime: '3-5 minutes',
      features: ['Key Metrics Dashboard', 'Performance Highlights', 'Strategic Recommendations']
    },
    {
      id: 'detailed_analysis',
      name: 'Detailed Financial Analysis',
      description: 'In-depth analysis with granular breakdowns, variance analysis, and operational insights',
      type: 'detailed_analysis',
      estimatedPages: 68,
      generationTime: '15-20 minutes',
      features: ['Detailed Breakdowns', 'Variance Analysis', 'Operational Metrics', 'Customer Analysis']
    },
    {
      id: 'investor_report',
      name: 'Investor Relations Report',
      description: 'Investment-grade report with growth metrics, market position, and future projections',
      type: 'investor_report',
      estimatedPages: 28,
      generationTime: '10-15 minutes',
      features: ['Growth Metrics', 'Market Analysis', 'Financial Projections', 'Investment Highlights']
    },
    {
      id: 'tax_preparation',
      name: 'Tax Preparation Package',
      description: 'Comprehensive tax-ready documentation with deduction analysis and optimization strategies',
      type: 'tax_preparation',
      estimatedPages: 45,
      generationTime: '12-18 minutes',
      features: ['Tax Documents', 'Deduction Analysis', 'Optimization Strategies', 'Compliance Checklist']
    }
  ], []);

  const generateReport = useCallback(async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    const steps = [
      { step: 'Initializing AI analysis engine...', duration: 1000 },
      { step: 'Processing financial data...', duration: 2000 },
      { step: 'Generating executive insights...', duration: 1500 },
      { step: 'Creating financial visualizations...', duration: 3000 },
      { step: 'Performing benchmark analysis...', duration: 2500 },
      { step: 'Calculating risk assessments...', duration: 2000 },
      { step: 'Generating recommendations...', duration: 2500 },
      { step: 'Building cash flow projections...', duration: 2000 },
      { step: 'Formatting professional layout...', duration: 1500 },
      { step: 'Applying branding and styling...', duration: 1000 },
      { step: 'Quality assurance and validation...', duration: 1500 },
      { step: 'Finalizing PDF generation...', duration: 1000 }
    ];

    for (let i = 0; i < steps.length; i++) {
      const { step, duration } = steps[i];
      
      setCurrentStep(step);
      setGenerationProgress(((i + 0.5) / steps.length) * 100);

      await new Promise(resolve => setTimeout(resolve, duration));
      
      setGenerationProgress(((i + 1) / steps.length) * 100);
    }

    // Create new report
    const newReport: GeneratedReport = {
      id: `rpt_${Date.now()}`,
      name: `${reportTemplates.find(t => t.id === selectedTemplate)?.name} - ${new Date().toLocaleDateString()}`,
      type: selectedTemplate,
      status: 'completed',
      progress: 100,
      generatedAt: new Date().toISOString(),
      pages: reportTemplates.find(t => t.id === selectedTemplate)?.estimatedPages || 30,
      fileSize: `${(Math.random() * 10 + 5).toFixed(1)} MB`,
      downloadUrl: '#',
      previewSections: generatePreviewContent(selectedTemplate)
    };

    setGeneratedReports(prev => [newReport, ...prev]);
    setIsGenerating(false);
    setCurrentStep('');
  }, [selectedTemplate, reportTemplates]);

  const generatePreviewContent = (templateId: string) => {
    const baseContent = [
      {
        title: 'Executive Summary',
        content: 'AI-generated executive summary highlighting key financial performance indicators, growth trends, and strategic recommendations based on comprehensive data analysis.',
        charts: ['executive_dashboard', 'key_metrics']
      },
      {
        title: 'Financial Performance Analysis',
        content: 'Detailed analysis of revenue growth, profitability metrics, and operational efficiency with year-over-year comparisons and industry benchmarking.',
        charts: ['revenue_analysis', 'profitability_trends', 'efficiency_metrics']
      }
    ];

    switch (templateId) {
      case 'audit_deck':
        return [
          ...baseContent,
          {
            title: 'Risk Assessment & Mitigation',
            content: 'Comprehensive risk evaluation covering liquidity, operational, and market risks with specific mitigation strategies and timeline recommendations.',
            charts: ['risk_matrix', 'mitigation_roadmap']
          },
          {
            title: 'Strategic Recommendations',
            content: 'AI-powered recommendations for optimizing financial performance, reducing costs, and accelerating growth based on industry best practices.',
            charts: ['opportunity_analysis', 'implementation_timeline']
          }
        ];
      
      case 'investor_report':
        return [
          ...baseContent,
          {
            title: 'Growth Projections',
            content: 'Data-driven growth forecasts with scenario modeling and market opportunity analysis for the next 12-24 months.',
            charts: ['growth_scenarios', 'market_opportunity']
          },
          {
            title: 'Investment Highlights',
            content: 'Key value propositions, competitive advantages, and investment thesis supported by financial metrics and market positioning.',
            charts: ['value_drivers', 'competitive_analysis']
          }
        ];
      
      default:
        return baseContent;
    }
  };

  const handleConfigChange = (section: keyof ReportConfiguration, key: string, value: any) => {
    setReportConfig(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, any>),
        [key]: value
      }
    }));
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
      case 'completed': return 'text-green-600 bg-green-100';
      case 'generating': return 'text-blue-600 bg-blue-100';
      case 'error': return 'text-red-600 bg-red-100';
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Powered Report Generator</h1>
              <p className="text-gray-600">Create professional financial reports with advanced AI analysis</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={generateReport}
                disabled={isGenerating}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
          </div>
        </div>

        {/* Generation Progress */}
        {isGenerating && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Generation Progress</h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{currentStep}</span>
                <span>{generationProgress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Estimated completion: {reportTemplates.find(t => t.id === selectedTemplate)?.generationTime}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Template Selection */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Templates</h3>
              <div className="space-y-3">
                {reportTemplates.map((template) => (
                  <div 
                    key={template.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate === template.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <span className="text-xs text-gray-500">{template.estimatedPages} pages</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {template.features.slice(0, 3).map((feature) => (
                        <span key={feature} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                      {template.features.length > 3 && (
                        <span className="text-xs text-gray-500">+{template.features.length - 3} more</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Report Configuration */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Include Elements</label>
                  <div className="space-y-2">
                    {Object.entries(reportConfig.includeElements).map(([key, value]) => (
                      <label key={key} className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={value}
                          onChange={(e) => handleConfigChange('includeElements', key, e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">AI Enhancements</label>
                  <div className="space-y-2">
                    {Object.entries(reportConfig.aiEnhancements).map(([key, value]) => (
                      <label key={key} className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={value}
                          onChange={(e) => handleConfigChange('aiEnhancements', key, e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color Scheme</label>
                  <select 
                    value={reportConfig.customization.colorScheme}
                    onChange={(e) => handleConfigChange('customization', 'colorScheme', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="professional">Professional Blue</option>
                    <option value="modern">Modern Purple</option>
                    <option value="corporate">Corporate Gray</option>
                    <option value="custom">Custom Branding</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confidentiality</label>
                  <select 
                    value={reportConfig.customization.confidentialityLevel}
                    onChange={(e) => handleConfigChange('customization', 'confidentialityLevel', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="public">Public</option>
                    <option value="internal">Internal Use</option>
                    <option value="confidential">Confidential</option>
                    <option value="restricted">Restricted</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Generated Reports */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Reports</h3>
              
              {generatedReports.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Reports Generated</h4>
                  <p className="text-gray-600">Generate your first AI-powered financial report</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedReports.map((report) => (
                    <div key={report.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{report.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Generated: {formatDate(report.generatedAt)}</span>
                            <span>{report.pages} pages</span>
                            <span>{report.fileSize}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(report.status)}`}>
                              {report.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {report.previewSections && (
                        <div className="space-y-3">
                          <h5 className="font-medium text-gray-900">Preview Sections</h5>
                          {report.previewSections.map((section, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4">
                              <h6 className="font-medium text-gray-900 mb-2">{section.title}</h6>
                              <p className="text-sm text-gray-600 mb-3">{section.content}</p>
                              {section.charts && (
                                <div className="flex flex-wrap gap-2">
                                  {section.charts.map((chart) => (
                                    <span key={chart} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                      📊 {chart.replace(/_/g, ' ')}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-3 mt-4">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Download PDF
                        </button>
                        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                          Share
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIReportGenerator;
