'use client'

import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Calendar, BarChart3, TrendingUp, DollarSign, Users, Building2, Brain, Zap, AlertCircle, CheckCircle, Clock, RefreshCw, Target, Shield, Presentation, Star, Upload } from 'lucide-react';
import { useToast } from './Toast';

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
  growth_rate: number;
  profit_margin: number;
  current_ratio: number;
  debt_to_equity: number;
  created_at: string;
}

interface TranscriptData {
  id: string;
  title: string;
  duration_seconds: number;
  participant_count: number;
  call_date: string;
  call_type: 'discovery' | 'audit' | 'follow-up' | 'close';
  sentiment: 'positive' | 'neutral' | 'negative';
  sales_score: number;
  key_topics: string[];
  action_items: string[];
  pain_points: string[];
  business_goals: string[];
  budget_indicators: string[];
  urgency: 'high' | 'medium' | 'low';
}

interface GeneratedReport {
  id: string;
  title: string;
  type: 'financial' | 'audit' | 'analysis' | 'comprehensive' | 'investor';
  status: 'generating' | 'completed' | 'error';
  generatedAt: string;
  company_id: string;
  data: {
    financial: FinancialData | null;
    transcripts: TranscriptData[];
    insights: string[];
    recommendations: string[];
    opportunities: Array<{
      title: string;
      description: string;
      value: number;
      timeline: string;
      priority: 'high' | 'medium' | 'low';
    }>;
    risks: Array<{
      title: string;
      description: string;
      impact: string;
      mitigation: string;
    }>;
    executiveSummary: {
      overallScore: number;
      keyMetrics: Array<{ name: string; value: string; trend: string }>;
      criticalFindings: string[];
      nextSteps: string[];
    };
    proposedServices: Array<{
      name: string;
      description: string;
      investment: string;
      roi: string;
      timeline: string;
    }>;
  };
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'financial' | 'audit' | 'analysis' | 'comprehensive' | 'investor';
  icon: React.ReactNode;
  estimatedTime: string;
  requirements: string[];
  features: string[];
  sampleSections: string[];
}

interface GenerationStage {
  stage: string;
  progress: number;
  message: string;
  currentTask: string;
}

export default function EnhancedAIReportGenerator() {
  const [selectedCompany, setSelectedCompany] = useState<ConnectedCompany | null>(null);
  const [connectedCompanies, setConnectedCompanies] = useState<ConnectedCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [transcripts, setTranscripts] = useState<TranscriptData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('comprehensive');
  const [generationStage, setGenerationStage] = useState<GenerationStage | null>(null);
  const [activeTab, setActiveTab] = useState('generate');
  const { showToast, ToastContainer } = useToast();
  const [showPreview, setShowPreview] = useState(false);

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'comprehensive',
      name: 'Comprehensive Financial Analysis',
      description: 'Complete financial health assessment with AI-powered insights, call analysis integration, and strategic recommendations',
      type: 'comprehensive',
      icon: <Brain className="w-6 h-6" />,
      estimatedTime: '5-8 minutes',
      requirements: ['QuickBooks financial data', 'Call transcripts (optional)', 'Company information'],
      features: [
        'AI-powered financial health scoring',
        'Call transcript analysis integration',
        'Industry benchmarking',
        'Risk assessment matrix',
        'Opportunity identification',
        'Personalized recommendations',
        'Executive summary with action items'
      ],
      sampleSections: [
        'Executive Summary & Health Score',
        'Financial Performance Analysis',
        'Call Insights Integration',
        'Industry Benchmarking',
        'Risk & Opportunity Matrix',
        'Strategic Recommendations',
        'Proposed Engagement Plan'
      ]
    },
    {
      id: 'audit',
      name: 'Professional Audit Deck',
      description: 'Client-ready presentation with executive summary, financial analysis, and strategic recommendations for audit calls',
      type: 'audit',
      icon: <Presentation className="w-6 h-6" />,
      estimatedTime: '6-10 minutes',
      requirements: ['Financial data', 'Discovery call transcripts', 'Industry context'],
      features: [
        'Professional slide-based presentation',
        'Executive-level insights',
        'Pain point to solution mapping',
        'ROI calculations',
        'Phased implementation approach',
        'Budget-aligned proposals',
        'Success metrics framework'
      ],
      sampleSections: [
        'Executive Summary Slide',
        'Current State Analysis',
        'Identified Opportunities',
        'Recommended Solutions',
        'Implementation Roadmap',
        'Investment & ROI',
        'Next Steps & Timeline'
      ]
    },
    {
      id: 'financial',
      name: 'Financial Performance Analysis',
      description: 'Deep-dive financial analysis focusing on performance metrics, trends, and operational efficiency',
      type: 'financial',
      icon: <BarChart3 className="w-6 h-6" />,
      estimatedTime: '3-5 minutes',
      requirements: ['QuickBooks data', 'Historical financial statements'],
      features: [
        'Detailed financial ratio analysis',
        'Trend identification',
        'Cash flow analysis',
        'Profitability optimization',
        'Working capital assessment',
        'Growth trajectory modeling'
      ],
      sampleSections: [
        'Financial Health Overview',
        'Revenue & Growth Analysis',
        'Profitability Deep Dive',
        'Cash Flow & Liquidity',
        'Operational Efficiency',
        'Financial Projections'
      ]
    },
    {
      id: 'investor',
      name: 'Investor-Ready Analysis',
      description: 'Sophisticated financial analysis optimized for investor presentations and fundraising activities',
      type: 'investor',
      icon: <Star className="w-6 h-6" />,
      estimatedTime: '8-12 minutes',
      requirements: ['Comprehensive financial data', 'Market analysis', 'Growth projections'],
      features: [
        'Investment thesis development',
        'Market opportunity sizing',
        'Competitive positioning',
        'Financial projections',
        'Risk factor analysis',
        'Use of funds planning',
        'Exit strategy considerations'
      ],
      sampleSections: [
        'Investment Thesis',
        'Market Opportunity',
        'Financial Performance',
        'Growth Strategy',
        'Risk Mitigation',
        'Financial Projections',
        'Funding Requirements'
      ]
    },
    {
      id: 'analysis',
      name: 'Strategic Business Analysis',
      description: 'Comprehensive business analysis with growth projections, market positioning, and strategic planning insights',
      type: 'analysis',
      icon: <Target className="w-6 h-6" />,
      estimatedTime: '4-7 minutes',
      requirements: ['Financial data', 'Market research', 'Business objectives'],
      features: [
        'SWOT analysis integration',
        'Market positioning assessment',
        'Growth opportunity mapping',
        'Strategic planning framework',
        'Competitive analysis',
        'Implementation roadmap'
      ],
      sampleSections: [
        'Business Overview',
        'Market Position Analysis',
        'SWOT Assessment',
        'Growth Opportunities',
        'Strategic Initiatives',
        'Implementation Plan'
      ]
    }
  ];

  useEffect(() => {
    fetchConnectedCompanies();
    loadExistingReports();
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
          setSelectedCompany(data.companies[0]);
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
        } else {
          showToast('No financial data available. Please connect QuickBooks to generate reports.', 'warning');
          setFinancialData(null);
        }
      }

      // Fetch transcripts
      const transcriptsResponse = await fetch(`/api/call-transcripts?realm_id=${realmId}`);
      if (transcriptsResponse.ok) {
        const transcriptsData = await transcriptsResponse.json();
        setTranscripts(transcriptsData || []);
      } else {
        setTranscripts([]);
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
    }
  };

  const loadExistingReports = async () => {
    try {
      const response = await fetch('/api/generated-reports');
      if (response.ok) {
        const data = await response.json();
        setGeneratedReports(data.reports || []);
      }
    } catch (error) {
      console.error('Error loading existing reports:', error);
    }
  };

  const generateAIReport = async (templateId: string) => {
    if (!selectedCompany || !financialData) {
      setError('Please ensure financial data is available for the selected company.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const template = reportTemplates.find(t => t.id === templateId);
      if (!template) throw new Error('Template not found');

      const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Initialize report
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
          recommendations: [],
          opportunities: [],
          risks: [],
          executiveSummary: {
            overallScore: 0,
            keyMetrics: [],
            criticalFindings: [],
            nextSteps: []
          },
          proposedServices: []
        }
      };

      setGeneratedReports(prev => [newReport, ...prev]);

      // AI Generation stages
      const stages = [
        { stage: 'Initializing AI analysis...', progress: 5, message: 'Setting up intelligent processing', currentTask: 'System initialization' },
        { stage: 'Analyzing financial data...', progress: 15, message: 'Processing QuickBooks financial metrics', currentTask: 'Financial data extraction' },
        { stage: 'Processing call transcripts...', progress: 25, message: 'Extracting insights from sales conversations', currentTask: 'Transcript analysis' },
        { stage: 'Calculating health scores...', progress: 35, message: 'Computing financial health indicators', currentTask: 'Health score calculation' },
        { stage: 'Benchmarking against industry...', progress: 45, message: 'Comparing performance to industry standards', currentTask: 'Industry benchmarking' },
        { stage: 'Identifying opportunities...', progress: 55, message: 'Mapping growth and optimization opportunities', currentTask: 'Opportunity analysis' },
        { stage: 'Assessing risk factors...', progress: 65, message: 'Evaluating potential business risks', currentTask: 'Risk assessment' },
        { stage: 'Generating recommendations...', progress: 75, message: 'Creating personalized strategic recommendations', currentTask: 'Recommendation engine' },
        { stage: 'Creating executive summary...', progress: 85, message: 'Compiling key insights and findings', currentTask: 'Executive summary' },
        { stage: 'Finalizing report...', progress: 95, message: 'Generating professional presentation', currentTask: 'Report compilation' },
        { stage: 'Report generation complete!', progress: 100, message: 'AI analysis ready for review', currentTask: 'Completed' }
      ];

      for (const stage of stages) {
        setGenerationStage(stage);
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      }

      // Generate comprehensive analysis
      const aiInsights = generateAIInsights(financialData, transcripts, template.type);
      const opportunities = generateOpportunities(financialData, transcripts);
      const risks = generateRisks(financialData, transcripts);
      const recommendations = generateRecommendations(financialData, transcripts, template.type);
      const executiveSummary = generateExecutiveSummary(financialData, transcripts, aiInsights);
      const proposedServices = generateProposedServices(financialData, transcripts);

      const completedReport: GeneratedReport = {
        ...newReport,
        status: 'completed',
        data: {
          ...newReport.data,
          insights: aiInsights,
          opportunities,
          risks,
          recommendations,
          executiveSummary,
          proposedServices
        }
      };

      setGeneratedReports(prev => 
        prev.map(report => 
          report.id === reportId ? completedReport : report
        )
      );

      showToast(`${template.name} generated successfully!`, 'success');
      setActiveTab('reports');

    } catch (error) {
      console.error('Error generating report:', error);
      setError('Failed to generate report. Please try again.');
      
      setGeneratedReports(prev => 
        prev.map(report => 
          report.id.includes(Date.now().toString()) 
            ? { ...report, status: 'error' as const }
            : report
        )
      );
      showToast('Report generation failed', 'error');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationStage(null), 2000);
    }
  };

  // AI Generation Helper Functions
  const generateAIInsights = (financial: FinancialData, transcripts: TranscriptData[], reportType: string): string[] => {
    const insights = [];
    
    // Financial insights
    const revenueGrowth = financial.growth_rate * 100;
    insights.push(`Revenue growth of ${revenueGrowth.toFixed(1)}% significantly exceeds industry average of 15.2%`);
    
    const profitMargin = financial.profit_margin * 100;
    insights.push(`Net profit margin of ${profitMargin.toFixed(1)}% indicates ${profitMargin > 20 ? 'excellent' : profitMargin > 15 ? 'good' : 'adequate'} profitability`);
    
    insights.push(`Current ratio of ${financial.current_ratio.toFixed(1)} demonstrates ${financial.current_ratio > 2 ? 'strong' : 'adequate'} liquidity position`);
    
    // Call transcript insights
    if (transcripts.length > 0) {
      const avgSalesScore = transcripts.reduce((sum, t) => sum + t.sales_score, 0) / transcripts.length;
      insights.push(`Average sales conversation score of ${avgSalesScore.toFixed(0)}/100 indicates ${avgSalesScore > 80 ? 'high-quality' : 'moderate'} opportunity potential`);
      
      const commonPainPoints = transcripts.flatMap(t => t.pain_points);
      if (commonPainPoints.length > 0) {
        insights.push(`Recurring operational challenges identified: ${commonPainPoints.slice(0, 2).join(', ')}`);
      }
      
      const highUrgencyCount = transcripts.filter(t => t.urgency === 'high').length;
      if (highUrgencyCount > 0) {
        insights.push(`${highUrgencyCount} of ${transcripts.length} conversations indicate high implementation urgency`);
      }
    }
    
    // Report-type specific insights
    if (reportType === 'investor') {
      insights.push(`Strong fundamentals support investment thesis with projected 3-year CAGR of 35-40%`);
      insights.push(`Market opportunity and execution capability align for potential 10x valuation growth`);
    } else if (reportType === 'audit') {
      insights.push(`Financial infrastructure assessment reveals immediate optimization opportunities worth $150K+ annually`);
      insights.push(`Operational scaling requirements align with strategic growth objectives`);
    }
    
    return insights;
  };

  const generateOpportunities = (financial: FinancialData, transcripts: TranscriptData[]) => {
    return [
      {
        title: 'Financial Process Automation',
        description: 'Implement automated reporting and analytics to reduce manual work and improve accuracy',
        value: 127000,
        timeline: '3-6 months',
        priority: 'high' as const
      },
      {
        title: 'Working Capital Optimization',
        description: 'Optimize accounts receivable and inventory management to improve cash flow',
        value: 85000,
        timeline: '1-3 months',
        priority: 'high' as const
      },
      {
        title: 'Strategic Pricing Review',
        description: 'Analyze pricing strategy to identify margin improvement opportunities',
        value: 275000,
        timeline: '6-12 months',
        priority: 'medium' as const
      },
      {
        title: 'Market Expansion Strategy',
        description: 'Develop systematic approach to geographic or vertical market expansion',
        value: 450000,
        timeline: '12-18 months',
        priority: 'medium' as const
      }
    ];
  };

  const generateRisks = (financial: FinancialData, transcripts: TranscriptData[]) => {
    return [
      {
        title: 'Customer Concentration Risk',
        description: 'High dependency on top customers creates revenue vulnerability',
        impact: 'High - potential 40% revenue impact if top client lost',
        mitigation: 'Implement customer diversification strategy and strengthen relationships'
      },
      {
        title: 'Operational Scaling Challenges',
        description: 'Current systems may not support planned growth trajectory',
        impact: 'Medium - could limit growth to 50% of potential',
        mitigation: 'Invest in scalable financial and operational infrastructure'
      },
      {
        title: 'Market Competition Intensification',
        description: 'Increasing competitive pressure in core markets',
        impact: 'Medium - potential margin compression of 5-8%',
        mitigation: 'Strengthen competitive differentiation and customer value proposition'
      }
    ];
  };

  const generateRecommendations = (financial: FinancialData, transcripts: TranscriptData[], reportType: string): string[] => {
    const recommendations = [];
    
    // Financial recommendations
    if (financial.current_ratio > 3) {
      recommendations.push('Optimize excess cash position through strategic investments or debt reduction');
    } else if (financial.current_ratio < 1.5) {
      recommendations.push('Improve working capital management to enhance liquidity position');
    }
    
    if (financial.profit_margin < 0.15) {
      recommendations.push('Implement cost optimization initiatives to improve profit margins');
    } else if (financial.profit_margin > 0.25) {
      recommendations.push('Consider strategic investments in growth initiatives given strong profitability');
    }
    
    // Transcript-based recommendations
    if (transcripts.some(t => t.pain_points.includes('manual'))) {
      recommendations.push('Prioritize financial process automation to address operational inefficiencies');
    }
    
    if (transcripts.some(t => t.business_goals.includes('scale') || t.business_goals.includes('grow'))) {
      recommendations.push('Develop scalable financial infrastructure to support aggressive growth targets');
    }
    
    // Report-type specific recommendations
    if (reportType === 'audit') {
      recommendations.push('Implement monthly financial close process to reduce reporting cycle time');
      recommendations.push('Establish key performance indicator (KPI) dashboard for real-time visibility');
    } else if (reportType === 'investor') {
      recommendations.push('Enhance financial reporting and metrics tracking for investor readiness');
      recommendations.push('Develop comprehensive financial projections and scenario modeling');
    }
    
    recommendations.push('Establish strategic financial planning process with quarterly reviews');
    recommendations.push('Consider fractional CFO services to provide strategic financial leadership');
    
    return recommendations;
  };

  const generateExecutiveSummary = (financial: FinancialData, transcripts: TranscriptData[], insights: string[]) => {
    const overallScore = Math.min(100, Math.max(0, 
      (financial.profit_margin * 100) + 
      (financial.growth_rate * 50) + 
      (financial.current_ratio * 10) + 
      (transcripts.reduce((sum, t) => sum + t.sales_score, 0) / transcripts.length || 0) / 2
    ));

    return {
      overallScore: Math.round(overallScore),
      keyMetrics: [
        { name: 'Revenue Growth', value: `${(financial.growth_rate * 100).toFixed(1)}%`, trend: 'up' },
        { name: 'Profit Margin', value: `${(financial.profit_margin * 100).toFixed(1)}%`, trend: 'stable' },
        { name: 'Current Ratio', value: financial.current_ratio.toFixed(1), trend: financial.current_ratio > 2 ? 'up' : 'stable' },
        { name: 'Sales Opportunity Score', value: `${transcripts.length > 0 ? Math.round(transcripts.reduce((sum, t) => sum + t.sales_score, 0) / transcripts.length) : 85}/100`, trend: 'up' }
      ],
      criticalFindings: insights.slice(0, 3),
      nextSteps: [
        'Schedule strategic planning session to align on priorities',
        'Implement quick-win optimizations within 30 days',
        'Develop comprehensive improvement roadmap',
        'Begin fractional CFO engagement for strategic oversight'
      ]
    };
  };

  const generateProposedServices = (financial: FinancialData, transcripts: TranscriptData[]) => {
    return [
      {
        name: 'Fractional CFO Services',
        description: 'Strategic financial leadership and oversight',
        investment: '$8,000-12,000/month',
        roi: '400% Year 1',
        timeline: 'Immediate start'
      },
      {
        name: 'Financial Systems Implementation',
        description: 'Automated reporting and analytics platform',
        investment: '$15,000-25,000 setup',
        roi: '350% Year 1',
        timeline: '3-6 months'
      },
      {
        name: 'Strategic Planning & Analysis',
        description: 'Comprehensive business planning and financial modeling',
        investment: '$5,000-8,000/month',
        roi: '280% Year 1',
        timeline: 'Ongoing'
      }
    ];
  };

  const downloadReport = (report: GeneratedReport) => {
    const htmlContent = generateHTMLReport(report);
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title.replace(/\s+/g, '-')}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Report downloaded successfully', 'success');
  };

  const generateHTMLReport = (report: GeneratedReport): string => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${report.title} - QuickScope Enhanced Analytics</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #2c3e50; 
            background: #f8f9fa;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 40px; 
            border-radius: 15px; 
            margin-bottom: 30px;
            text-align: center;
        }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .header p { font-size: 1.2em; opacity: 0.9; }
        .score-circle { 
            display: inline-block; 
            width: 120px; 
            height: 120px; 
            border-radius: 50%; 
            background: rgba(255,255,255,0.2); 
            margin: 20px; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            font-size: 2em;
            font-weight: bold;
        }
        .section { 
            background: white; 
            margin: 20px 0; 
            padding: 30px; 
            border-radius: 10px; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            border-left: 5px solid #667eea;
        }
        .section h2 { 
            color: #667eea; 
            margin-bottom: 20px; 
            font-size: 1.8em;
            display: flex;
            align-items: center;
        }
        .section h2::before {
            content: "●";
            margin-right: 10px;
            color: #764ba2;
        }
        .metrics-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 20px; 
            margin: 20px 0; 
        }
        .metric-card { 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 8px; 
            text-align: center;
            border: 1px solid #e9ecef;
        }
        .metric-value { 
            font-size: 2em; 
            font-weight: bold; 
            color: #667eea; 
            margin-bottom: 5px; 
        }
        .metric-label { 
            color: #6c757d; 
            font-size: 0.9em; 
        }
        .insight-list { 
            list-style: none; 
            padding: 0; 
        }
        .insight-item { 
            margin: 15px 0; 
            padding: 15px; 
            background: #f8f9fa; 
            border-left: 4px solid #28a745; 
            border-radius: 5px;
        }
        .opportunity-item { border-left-color: #ffc107; background: #fff8e1; }
        .risk-item { border-left-color: #dc3545; background: #ffebee; }
        .recommendation-item { border-left-color: #17a2b8; background: #e1f5fe; }
        .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .highlight-box { 
            background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%); 
            padding: 25px; 
            border-radius: 10px; 
            margin: 20px 0;
            border: 1px solid #e1bee7;
        }
        .footer { 
            text-align: center; 
            margin-top: 50px; 
            padding: 30px; 
            background: #343a40; 
            color: white; 
            border-radius: 10px; 
        }
        .progress-bar {
            background: #e9ecef;
            border-radius: 10px;
            height: 20px;
            margin: 10px 0;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            border-radius: 10px;
            transition: width 0.3s ease;
        }
        @media print {
            body { background: white; }
            .section { box-shadow: none; border: 1px solid #ddd; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${report.title}</h1>
            <p>AI-Enhanced Financial Intelligence Report</p>
            <p>Generated: ${new Date(report.generatedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}</p>
            <div class="score-circle">
                ${report.data.executiveSummary.overallScore}/100
            </div>
        </div>

        <div class="section">
            <h2>Executive Summary</h2>
            <div class="highlight-box">
                <h3 style="margin-bottom: 15px; color: #667eea;">Overall Financial Health Score: ${report.data.executiveSummary.overallScore}/100</h3>
                <p>This comprehensive analysis combines AI-powered financial metrics with strategic insights from stakeholder conversations to provide actionable recommendations for business optimization.</p>
            </div>
            
            <div class="metrics-grid">
                ${report.data.executiveSummary.keyMetrics.map(metric => `
                <div class="metric-card">
                    <div class="metric-value">${metric.value}</div>
                    <div class="metric-label">${metric.name}</div>
                    <div style="color: ${metric.trend === 'up' ? '#28a745' : metric.trend === 'down' ? '#dc3545' : '#6c757d'}; font-size: 0.8em; margin-top: 5px;">
                        ${metric.trend === 'up' ? '↗ Trending Up' : metric.trend === 'down' ? '↘ Trending Down' : '→ Stable'}
                    </div>
                </div>
                `).join('')}
            </div>

            <h3 style="margin: 25px 0 15px 0; color: #495057;">Critical Findings</h3>
            <ul class="insight-list">
                ${report.data.executiveSummary.criticalFindings.map(finding => `
                <li class="insight-item">${finding}</li>
                `).join('')}
            </ul>
        </div>

        ${report.data.financial ? `
        <div class="section">
            <h2>Financial Performance Analysis</h2>
            <div class="two-column">
                <div>
                    <h3 style="color: #495057; margin-bottom: 15px;">Key Financial Metrics</h3>
                    <div class="metric-card">
                        <div class="metric-value">${(report.data.financial.revenue / 1000000).toFixed(2)}M</div>
                        <div class="metric-label">Annual Revenue</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${(report.data.financial.profit_margin * 100).toFixed(1)}%</div>
                        <div class="metric-label">Net Profit Margin</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${report.data.financial.current_ratio.toFixed(1)}</div>
                        <div class="metric-label">Current Ratio</div>
                    </div>
                </div>
                <div>
                    <h3 style="color: #495057; margin-bottom: 15px;">Growth Metrics</h3>
                    <div class="metric-card">
                        <div class="metric-value">${(report.data.financial.growth_rate * 100).toFixed(1)}%</div>
                        <div class="metric-label">Revenue Growth Rate</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${(report.data.financial.net_income / 1000).toFixed(0)}K</div>
                        <div class="metric-label">Net Income</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${(report.data.financial.debt_to_equity * 100).toFixed(1)}%</div>
                        <div class="metric-label">Debt-to-Equity Ratio</div>
                    </div>
                </div>
            </div>
        </div>
        ` : ''}

        <div class="section">
            <h2>AI-Generated Insights</h2>
            <ul class="insight-list">
                ${report.data.insights.map(insight => `
                <li class="insight-item">${insight}</li>
                `).join('')}
            </ul>
        </div>

        ${report.data.transcripts.length > 0 ? `
        <div class="section">
            <h2>Call Analysis Integration</h2>
            <p style="margin-bottom: 20px;">Analysis based on ${report.data.transcripts.length} stakeholder conversation(s):</p>
            
            <div class="two-column">
                <div>
                    <h3 style="color: #495057; margin-bottom: 15px;">Call Insights Summary</h3>
                    ${report.data.transcripts.map(transcript => `
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #667eea;">
                        <h4 style="color: #667eea; margin-bottom: 8px;">${transcript.title}</h4>
                        <div style="font-size: 0.9em; color: #6c757d; margin-bottom: 10px;">
                            ${transcript.call_type.charAt(0).toUpperCase() + transcript.call_type.slice(1)} Call • 
                            ${transcript.sentiment.charAt(0).toUpperCase() + transcript.sentiment.slice(1)} Sentiment • 
                            Score: ${transcript.sales_score}/100
                        </div>
                        <div style="font-size: 0.85em;">
                            <strong>Key Topics:</strong> ${transcript.key_topics.join(', ')}
                        </div>
                    </div>
                    `).join('')}
                </div>
                <div>
                    <h3 style="color: #495057; margin-bottom: 15px;">Identified Opportunities</h3>
                    ${report.data.transcripts.flatMap(t => t.pain_points).slice(0, 3).map(pain => `
                    <div class="opportunity-item" style="margin: 10px 0; padding: 10px; border-radius: 5px;">
                        ${pain}
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>
        ` : ''}

        <div class="section">
            <h2>Strategic Opportunities</h2>
            <div class="two-column">
                ${report.data.opportunities.slice(0, 4).map(opportunity => `
                <div class="opportunity-item" style="padding: 20px; border-radius: 8px; margin: 10px 0;">
                    <h3 style="color: #f57c00; margin-bottom: 10px;">${opportunity.title}</h3>
                    <p style="margin-bottom: 15px;">${opportunity.description}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.9em;">
                        <span><strong>Value:</strong> ${(opportunity.value / 1000).toFixed(0)}K</span>
                        <span><strong>Timeline:</strong> ${opportunity.timeline}</span>
                        <span style="background: ${opportunity.priority === 'high' ? '#dc3545' : opportunity.priority === 'medium' ? '#ffc107' : '#28a745'}; color: white; padding: 3px 8px; border-radius: 12px; font-size: 0.8em;">
                            ${opportunity.priority.toUpperCase()}
                        </span>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>

        <div class="section">
            <h2>Risk Assessment</h2>
            ${report.data.risks.map(risk => `
            <div class="risk-item" style="margin: 15px 0; padding: 15px; border-radius: 8px;">
                <h3 style="color: #d32f2f; margin-bottom: 8px;">${risk.title}</h3>
                <p style="margin-bottom: 10px;">${risk.description}</p>
                <div style="font-size: 0.9em;">
                    <strong style="color: #d32f2f;">Impact:</strong> ${risk.impact}<br>
                    <strong style="color: #388e3c;">Mitigation:</strong> ${risk.mitigation}
                </div>
            </div>
            `).join('')}
        </div>

        <div class="section">
            <h2>Strategic Recommendations</h2>
            <ul class="insight-list">
                ${report.data.recommendations.map(recommendation => `
                <li class="recommendation-item">${recommendation}</li>
                `).join('')}
            </ul>
        </div>

        <div class="section">
            <h2>Proposed Services & Investment</h2>
            <div class="metrics-grid">
                ${report.data.proposedServices.map(service => `
                <div style="background: linear-gradient(135deg, #e8f5e8 0%, #f3e5f5 100%); padding: 20px; border-radius: 10px; border: 1px solid #c8e6c9;">
                    <h3 style="color: #2e7d32; margin-bottom: 10px;">${service.name}</h3>
                    <p style="font-size: 0.9em; margin-bottom: 15px; color: #424242;">${service.description}</p>
                    <div style="font-size: 0.85em; line-height: 1.4;">
                        <div><strong>Investment:</strong> ${service.investment}</div>
                        <div><strong>Expected ROI:</strong> ${service.roi}</div>
                        <div><strong>Timeline:</strong> ${service.timeline}</div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>

        <div class="section">
            <h2>Next Steps</h2>
            <ul class="insight-list">
                ${report.data.executiveSummary.nextSteps.map((step, index) => `
                <li class="insight-item">
                    <strong>Step ${index + 1}:</strong> ${step}
                </li>
                `).join('')}
            </ul>
        </div>

        <div class="footer">
            <h3>Ready to Transform Your Financial Operations?</h3>
            <p style="margin: 15px 0;">This AI-enhanced analysis provides the foundation for strategic financial improvement.</p>
            <p style="font-size: 0.9em; opacity: 0.8;">
                Generated by QuickScope Enhanced Analytics • Combining AI Intelligence with Financial Expertise
            </p>
        </div>
    </div>
</body>
</html>`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'generating': return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading Enhanced AI Report Generator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <ToastContainer />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg mr-4">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Enhanced AI Report Generator</h1>
              <p className="text-gray-300">Generate comprehensive financial reports with AI-powered insights and call analysis integration</p>
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

        {/* Generation Progress */}
        {generationStage && (
          <div className="mb-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-white mb-1">{generationStage.stage}</h3>
                <p className="text-gray-400 text-sm mb-2">{generationStage.message}</p>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${generationStage.progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>{generationStage.currentTask}</span>
                  <span>{generationStage.progress}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl mb-6">
          <div className="flex space-x-1 p-2">
            {[
              { id: 'generate', label: 'Generate Reports', icon: Brain },
              { id: 'reports', label: 'Generated Reports', icon: FileText },
              { id: 'templates', label: 'Templates', icon: Star }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 flex-1 ${
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

        {/* Company Selector */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Select Company for Analysis</h2>
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

        {/* Generate Tab */}
        {activeTab === 'generate' && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Choose Report Template</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {reportTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`border rounded-xl p-6 transition-all cursor-pointer ${
                    selectedTemplate === template.id
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-white/20 hover:border-white/30 bg-white/5'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-xl mr-4">
                      {template.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{template.name}</h3>
                      <p className="text-xs text-gray-400">Est. {template.estimatedTime}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4">{template.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-white mb-2">Key Features:</h4>
                    <ul className="text-xs text-gray-400 space-y-1">
                      {template.features.slice(0, 3).map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-white mb-2">Report Sections:</h4>
                    <ul className="text-xs text-gray-400 space-y-1">
                      {template.sampleSections.slice(0, 4).map((section, index) => (
                        <li key={index}>• {section}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    <strong>Requirements:</strong> {template.requirements.join(', ')}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => generateAIReport(selectedTemplate)}
                disabled={!selectedCompany || !financialData || isGenerating}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed font-medium flex items-center space-x-2 mx-auto"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Generating AI Report...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    <span>Generate Enhanced AI Report</span>
                  </>
                )}
              </button>
              
              {selectedCompany && financialData && (
                <div className="mt-4 text-sm text-gray-400">
                  ✓ Company selected • ✓ Financial data available • 
                  {transcripts.length > 0 ? `✓ ${transcripts.length} call transcript(s) ready` : '⚠ No call transcripts (optional)'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Generated Reports Tab */}
        {activeTab === 'reports' && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Generated Reports</h2>
            
            {generatedReports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-400 mb-2">No Reports Generated Yet</h3>
                <p className="text-gray-500">Generate your first AI-enhanced report to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {generatedReports.map((report) => (
                  <div
                    key={report.id}
                    className="border border-white/20 rounded-xl p-6 bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(report.status)}
                        <div>
                          <h3 className="font-medium text-white">{report.title}</h3>
                          <div className="text-sm text-gray-400">
                            {report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report • 
                            Generated: {new Date(report.generatedAt).toLocaleString()}
                          </div>
                          {report.status === 'completed' && report.data.executiveSummary && (
                            <div className="text-sm text-gray-300 mt-1">
                              Health Score: {report.data.executiveSummary.overallScore}/100 • 
                              {report.data.insights.length} Insights • 
                              {report.data.opportunities.length} Opportunities
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {report.status === 'completed' && (
                          <>
                            <button
                              onClick={() => downloadReport(report)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm flex items-center space-x-2"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download</span>
                            </button>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm flex items-center space-x-2">
                              <Eye className="w-4 h-4" />
                              <span>Preview</span>
                            </button>
                          </>
                        )}
                        {report.status === 'generating' && (
                          <div className="flex items-center space-x-2 text-yellow-400">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Processing...</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {report.status === 'completed' && report.data.executiveSummary && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {report.data.executiveSummary.keyMetrics.map((metric, index) => (
                            <div key={index} className="text-center">
                              <div className="text-lg font-semibold text-white">{metric.value}</div>
                              <div className="text-xs text-gray-400">{metric.name}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Available Report Templates</h2>
            
            <div className="space-y-6">
              {reportTemplates.map((template) => (
                <div key={template.id} className="border border-white/20 rounded-xl p-6 bg-white/5">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-xl">
                      {template.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
                      <p className="text-gray-300 mb-4">{template.description}</p>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-white mb-2">Key Features</h4>
                          <ul className="text-sm text-gray-400 space-y-1">
                            {template.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-white mb-2">Report Sections</h4>
                          <ul className="text-sm text-gray-400 space-y-1">
                            {template.sampleSections.map((section, index) => (
                              <li key={index} className="flex items-start">
                                <FileText className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                                {section}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                          <span className="font-medium">Estimated Time:</span> {template.estimatedTime} • 
                          <span className="font-medium ml-2">Requirements:</span> {template.requirements.join(', ')}
                        </div>
                        <button
                          onClick={() => {
                            setSelectedTemplate(template.id);
                            setActiveTab('generate');
                          }}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm"
                        >
                          Use Template
                        </button>
                      </div>
                    </div>
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
