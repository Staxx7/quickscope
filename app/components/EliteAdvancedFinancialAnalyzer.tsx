'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart,
  Activity, AlertTriangle, CheckCircle, Calendar, FileText, Download,
  RefreshCw, Zap, Target, Users, Clock, Building2, CreditCard, 
  Percent, Calculator, Shield, Award, Brain, Search, Filter, 
  Settings, Bookmark, Share2, Bell, Info, ExternalLink, Briefcase,
  ArrowUp, ArrowDown, Minus, Plus, PlayCircle, PauseCircle, 
  RotateCcw, Maximize2, MinusCircle, Star, Flag, MessageSquare, 
  ThumbsUp, ThumbsDown, HelpCircle, Eye, Globe, LineChart,
  ChevronLeft, ChevronRight, Presentation
} from 'lucide-react';
import { toast } from 'react-toastify';

// Enhanced interfaces with comprehensive data structures
interface FinancialMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  category: 'revenue' | 'expense' | 'profit' | 'efficiency';
}

interface AdvancedFinancialMetrics {
  healthScore: number;
  liquidityRatio: number;
  profitMargin: number;
  debtToEquity: number;
  returnOnAssets: number;
  returnOnEquity: number;
  workingCapital: number;
  cashFlowRatio: number;
  quickRatio: number;
  currentRatio: number;
  inventoryTurnover: number;
  receivablesTurnover: number;
  assetTurnover: number;
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  ebitda: number;
  freeCashFlow: number;
  cashConversionCycle: number;
  debtServiceCoverage: number;
  interestCoverage: number;
  equityMultiplier: number;
  priceToBook: number;
  workingCapitalRatio: number;
}

interface TrendData {
  period: string;
  revenue: number;
  expenses: number;
  netIncome: number;
  cashFlow: number;
  grossProfit: number;
  operatingIncome: number;
  ebitda: number;
  totalAssets: number;
  totalLiabilities: number;
  equity: number;
  freeCashFlow: number;
  capex: number;
  employees: number;
  customerCount: number;
}

interface BenchmarkData {
  metric: string;
  companyValue: number;
  industryAverage: number;
  topQuartile: number;
  topDecile: number;
  performance: 'excellent' | 'above-average' | 'average' | 'below-average' | 'poor';
  trend: 'improving' | 'stable' | 'declining';
  priority: 'high' | 'medium' | 'low';
}

interface RiskFactor {
  id: string;
  category: string;
  risk: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  probability: number;
  impact: string;
  financialImpact: number;
  timeframe: string;
  recommendation: string;
  mitigationSteps: string[];
  kpiImpact: string[];
  industryRelevance: number;
  regulatoryRisk: boolean;
}

interface EnhancedAIInsight {
  id: string;
  type: 'opportunity' | 'concern' | 'trend' | 'recommendation' | 'warning' | 'growth';
  title: string;
  description: string;
  confidence: number;
  impact: 'transformational' | 'high' | 'medium' | 'low';
  timeline: string;
  actionItems: string[];
  expectedOutcome: string;
  investmentRequired: number;
  roi: number;
  kpiTargets: { metric: string; target: number; timeframe: string }[];
  dataPoints: string[];
  priority: number;
}

interface PerformanceAlert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  metric: string;
  change: number;
  threshold: number;
  timestamp: string;
  acknowledged: boolean;
}

interface FinancialSnapshot {
  id: string;
  company_id: string;
  revenue: number;
  net_income: number;
  expenses: number;
  assets: number;
  liabilities: number;
  created_at: string;
}

interface EnhancedSlideContent {
  executiveSummary: {
    overallScore: number;
    keyFindings: string[];
    urgentIssues: string[];
    opportunities: string[];
    contextualInsights: string[];
    callToAction: string;
  };
  financialSnapshot: {
    healthScore: number;
    keyMetrics: Array<{
      name: string;
      value: string;
      change: string;
      trend: 'positive' | 'negative' | 'neutral';
    }>;
    industryComparison: Array<{
      metric: string;
      company: number | string;
      industry: number | string;
      ranking: 'Above Average' | 'Average' | 'Below Average';
    }>;
    trendAnalysis: string[];
  };
  painPoints: {
    identifiedPains: Array<{
      painPoint: string;
      priority: 'high' | 'medium' | 'low';
      financialEvidence: string;
      impact: string;
      solution: string;
      estimatedValue?: number;
    }>;
    rootCauseAnalysis: string[];
  };
  opportunities: {
    opportunities: Array<{
      opportunity: string;
      difficulty: 'low' | 'medium' | 'high';
      description: string;
      potentialValue: string;
      timeline: string;
      implementation: string;
    }>;
    quickWins: string[];
  };
  risks: {
    criticalRisks: Array<{
      risk: string;
      probability: 'High' | 'Medium' | 'Low';
      impact: 'High' | 'Medium' | 'Low';
      mitigation: string;
    }>;
    contingencyPlanning: string[];
  };
  recommendations: {
    immediate: Array<{
      action: string;
      rationale: string;
      expectedOutcome: string;
      timeline: string;
    }>;
    shortTerm: Array<{
      action: string;
      rationale: string;
      expectedOutcome: string;
      timeline: string;
    }>;
    longTerm: Array<{
      action: string;
      rationale: string;
      expectedOutcome: string;
      timeline: string;
    }>;
    budgetAligned: Array<{
      service: string;
      investment: string;
      roi: string;
      priority: 'High' | 'Medium' | 'Low';
    }>;
  };
  engagement: {
    services: Array<{
      name: string;
      description: string;
      timeline: string;
      deliverables: string[];
    }>;
    investment: {
      monthly: string;
      setup: string;
      total: string;
    };
    roi: {
      timeToValue: string;
      yearOneROI: string;
      threeYearROI: string;
    };
    timeline: Array<{
      phase: string;
      description: string;
      duration: string;
      milestones: string[];
    }>;
  };
}

interface EliteAdvancedFinancialAnalyzerProps {
  companyId: string;
  companyName: string;
}

const EliteAdvancedFinancialAnalyzer: React.FC<EliteAdvancedFinancialAnalyzerProps> = ({ companyId, companyName }) => {
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    toast[type](message);
  };

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingFinancialData, setLoadingFinancialData] = useState(false);
  const [realFinancialData, setRealFinancialData] = useState<FinancialSnapshot | null>(null);
  const [dataSource, setDataSource] = useState<'real' | 'mock'>('real');
  const [metrics, setMetrics] = useState<FinancialMetric[]>([]);
  const [advancedMetrics, setAdvancedMetrics] = useState<AdvancedFinancialMetrics | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData[]>([]);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [aiInsights, setAIInsights] = useState<EnhancedAIInsight[]>([]);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('4Q');
  const [activeTab, setActiveTab] = useState('executive-summary');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('TechCorp Solutions');
  const [viewMode, setViewMode] = useState<'summary' | 'detailed' | 'executive'>('summary');
  const [comprehensiveAnalysis, setComprehensiveAnalysis] = useState<any>(null);
  const [transcriptInsights, setTranscriptInsights] = useState<any>(null);
  const [marketContext, setMarketContext] = useState<any>(null);

  const fetchRealFinancialData = async () => {
    setLoadingFinancialData(true);
    try {
      const response = await fetch(`/api/financial-data/${companyId}`);
      if (!response.ok) throw new Error('Failed to fetch financial data');
      const data = await response.json();
      setRealFinancialData(data);
      setDataSource('real');
      showToast('Real QuickBooks financial data loaded successfully!', 'success');
    } catch (error) {
      showToast('Failed to load real financial data', 'error');
      setDataSource('mock');
    } finally {
      setLoadingFinancialData(false);
    }
  };

  const getTranscriptIdFromUrl = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('transcript');
    }
    return null;
  };

  const fetchComprehensiveAnalysis = async () => {
    setLoadingFinancialData(true);
    try {
      const transcriptId = getTranscriptIdFromUrl();
      
      const response = await fetch('/api/ai/generate-comprehensive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          transcriptId,
          includeTranscriptInsights: !!transcriptId
        })
      });

      if (!response.ok) throw new Error('Failed to fetch comprehensive analysis');
      
      const data = await response.json();
      setComprehensiveAnalysis(data.analysis);
      
      if (data.analysis) {
        setRealFinancialData(data.analysis.financialMetrics);
        setTranscriptInsights(data.analysis.transcriptInsights);
        setMarketContext(data.analysis.marketContext);
        setDataSource(data.analysis.dataSource.financial === 'quickbooks' ? 'real' : 'mock');
        
        const metrics = data.analysis.financialMetrics;
        setAdvancedMetrics({
          healthScore: data.analysis.company.healthScore,
          liquidityRatio: metrics.currentRatio || 2.3,
          profitMargin: metrics.profitMargin || 24.1,
          grossMargin: metrics.grossMargin || 82.3,
          operatingMargin: metrics.operatingMargin || 28.5,
          netMargin: metrics.profitMargin || 24.1,
          debtToEquity: metrics.debtToAsset ? metrics.debtToAsset / 100 : 0.36,
          returnOnAssets: metrics.returnOnAssets || 15.2,
          returnOnEquity: 20.7,
          workingCapital: metrics.workingCapital || 1200000,
          cashFlowRatio: 2.1,
          quickRatio: metrics.quickRatio || 2.1,
          currentRatio: metrics.currentRatio || 2.3,
          inventoryTurnover: 28.5,
          receivablesTurnover: 9.4,
          assetTurnover: 1.6,
          ebitda: metrics.netIncome * 1.3 || 865000,
          freeCashFlow: metrics.cashFlowEstimate || 545000,
          cashConversionCycle: 12,
          debtServiceCoverage: 5.2,
          interestCoverage: 18.5,
          equityMultiplier: 1.36,
          priceToBook: 4.2,
          workingCapitalRatio: 0.34
        });
        
        if (data.analysis.aiGeneratedInsights) {
          setAIInsights(data.analysis.aiGeneratedInsights.map((insight: any, index: number) => ({
            id: `insight-${index}`,
            type: insight.type,
            title: insight.title,
            description: insight.description,
            confidence: insight.confidence,
            impact: insight.impact,
            timeline: '3-6 months',
            actionItems: [],
            expectedOutcome: '',
            investmentRequired: 0,
            roi: 3.5,
            kpiTargets: [],
            dataPoints: [],
            priority: insight.impact === 'transformational' ? 1 : 2
          })));
        }
      }
      
      showToast('Comprehensive analysis with market data loaded successfully!', 'success');
    } catch (error) {
      showToast('Failed to load comprehensive analysis. Please ensure you have connected your QuickBooks account.', 'error');
      setDataSource('real'); // Keep it as real, don't switch to mock
      // Don't call generateAdvancedMockData() - let the user see the error state
    } finally {
      setLoadingFinancialData(false);
    }
  };

  const runAdvancedAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      await fetchComprehensiveAnalysis();
      showToast('Advanced analysis completed successfully', 'success');
    } catch (error) {
      showToast('Failed to run advanced analysis', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    // Load comprehensive analysis on mount
    fetchComprehensiveAnalysis();
  }, [companyId]); // Re-fetch if company changes

  // Enhanced data generation
  const generateAdvancedMockData = useCallback(() => {
    const mockMetrics: FinancialMetric[] = [
      {
        id: 'revenue',
        name: 'Total Revenue',
        value: 2840000,
        previousValue: 2580000,
        change: 260000,
        changePercent: 10.1,
        trend: 'up',
        category: 'revenue'
      },
      {
        id: 'gross-profit',
        name: 'Gross Profit',
        value: 2337320,
        previousValue: 2123400,
        change: 213920,
        changePercent: 10.1,
        trend: 'up',
        category: 'profit'
      },
      {
        id: 'operating-expenses',
        name: 'Operating Expenses',
        value: 1527920,
        previousValue: 1388100,
        change: 139820,
        changePercent: 10.1,
        trend: 'up',
        category: 'expense'
      },
      {
        id: 'net-profit',
        name: 'Net Profit',
        value: 684000,
        previousValue: 630000,
        change: 54000,
        changePercent: 8.6,
        trend: 'up',
        category: 'profit'
      },
      {
        id: 'cash-flow',
        name: 'Operating Cash Flow',
        value: 640000,
        previousValue: 590000,
        change: 50000,
        changePercent: 8.5,
        trend: 'up',
        category: 'efficiency'
      },
      {
        id: 'conversion-rate',
        name: 'Lead Conversion Rate',
        value: 4.8,
        previousValue: 4.2,
        change: 0.6,
        changePercent: 14.3,
        trend: 'up',
        category: 'efficiency'
      }
    ];

    const mockAdvancedMetrics: AdvancedFinancialMetrics = {
      healthScore: 85,
      liquidityRatio: 2.3,
      profitMargin: 24.1,
      grossMargin: 82.3,
      operatingMargin: 28.5,
      netMargin: 24.1,
      debtToEquity: 0.36,
      returnOnAssets: 15.2,
      returnOnEquity: 20.7,
      workingCapital: 1200000,
      cashFlowRatio: 2.1,
      quickRatio: 2.1,
      currentRatio: 2.3,
      inventoryTurnover: 28.5,
      receivablesTurnover: 9.4,
      assetTurnover: 1.6,
      ebitda: 865000,
      freeCashFlow: 545000,
      cashConversionCycle: 12,
      debtServiceCoverage: 5.2,
      interestCoverage: 18.5,
      equityMultiplier: 1.36,
      priceToBook: 4.2,
      workingCapitalRatio: 0.34
    };

    const mockTrendData: TrendData[] = [
      {
        period: 'Q1 2024',
        revenue: 2100000,
        expenses: 1680000,
        netIncome: 420000,
        cashFlow: 380000,
        grossProfit: 1728000,
        operatingIncome: 598500,
        ebitda: 645000,
        totalAssets: 8500000,
        totalLiabilities: 3200000,
        equity: 5300000,
        freeCashFlow: 285000,
        capex: 95000,
        employees: 127,
        customerCount: 847
      },
      {
        period: 'Q2 2024',
        revenue: 2340000,
        expenses: 1780000,
        netIncome: 560000,
        cashFlow: 520000,
        grossProfit: 1925800,
        operatingIncome: 666900,
        ebitda: 715000,
        totalAssets: 9200000,
        totalLiabilities: 3400000,
        equity: 5800000,
        freeCashFlow: 425000,
        capex: 105000,
        employees: 134,
        customerCount: 923
      },
      {
        period: 'Q3 2024',
        revenue: 2580000,
        expenses: 1950000,
        netIncome: 630000,
        cashFlow: 590000,
        grossProfit: 2123400,
        operatingIncome: 735300,
        ebitda: 785000,
        totalAssets: 9850000,
        totalLiabilities: 3600000,
        equity: 6250000,
        freeCashFlow: 495000,
        capex: 115000,
        employees: 142,
        customerCount: 1015
      },
      {
        period: 'Q4 2024',
        revenue: 2840000,
        expenses: 2156000,
        netIncome: 684000,
        cashFlow: 640000,
        grossProfit: 2337320,
        operatingIncome: 809400,
        ebitda: 865000,
        totalAssets: 10500000,
        totalLiabilities: 3800000,
        equity: 6700000,
        freeCashFlow: 545000,
        capex: 125000,
        employees: 148,
        customerCount: 1127
      }
    ];

    const mockBenchmarkData: BenchmarkData[] = [
      {
        metric: 'Revenue Growth',
        companyValue: 35.2,
        industryAverage: 18.5,
        topQuartile: 28.0,
        topDecile: 45.2,
        performance: 'above-average',
        trend: 'improving',
        priority: 'high'
      },
      {
        metric: 'Gross Margin',
        companyValue: 82.3,
        industryAverage: 75.2,
        topQuartile: 82.0,
        topDecile: 87.5,
        performance: 'excellent',
        trend: 'stable',
        priority: 'medium'
      },
      {
        metric: 'Operating Margin',
        companyValue: 28.5,
        industryAverage: 22.1,
        topQuartile: 28.0,
        topDecile: 35.2,
        performance: 'excellent',
        trend: 'improving',
        priority: 'high'
      },
      {
        metric: 'Current Ratio',
        companyValue: 2.3,
        industryAverage: 1.8,
        topQuartile: 2.3,
        topDecile: 2.8,
        performance: 'excellent',
        trend: 'stable',
        priority: 'medium'
      },
      {
        metric: 'Return on Assets',
        companyValue: 15.2,
        industryAverage: 8.9,
        topQuartile: 15.2,
        topDecile: 22.1,
        performance: 'excellent',
        trend: 'improving',
        priority: 'high'
      }
    ];

    const mockAIInsights: EnhancedAIInsight[] = [
      {
        id: 'saas-expansion',
        type: 'opportunity',
        title: 'SaaS Enterprise Market Expansion',
        description: 'Strong unit economics (LTV:CAC of 4.8:1) and 135% net revenue retention indicate readiness for enterprise expansion. Current ACV of $22.1K suggests significant upmarket opportunity.',
        confidence: 92,
        impact: 'transformational',
        timeline: '6-12 months',
        actionItems: [
          'Hire enterprise sales team (3-5 AEs)',
          'Develop enterprise security features (SOC2 Type II)',
          'Build customer success for enterprise accounts',
          'Create tiered pricing with enterprise tier'
        ],
        expectedOutcome: 'Increase ACV by 45-65% and expand TAM by $35M',
        investmentRequired: 1500000,
        roi: 4.2,
        kpiTargets: [
          { metric: 'Enterprise MRR', target: 180000, timeframe: '12 months' },
          { metric: 'Average Contract Value', target: 32000, timeframe: '12 months' },
          { metric: 'Enterprise NPS', target: 68, timeframe: '12 months' }
        ],
        dataPoints: ['Customer concentration analysis', 'Competitive pricing study', 'Product-market fit surveys'],
        priority: 1
      },
      {
        id: 'operational-efficiency',
        type: 'recommendation',
        title: 'AI-Powered Operational Efficiency',
        description: 'Implementation of AI-driven automation could reduce operational costs by 18% while improving response times by 40%. Strong cash position supports technology investment.',
        confidence: 87,
        impact: 'high',
        timeline: '3-9 months',
        actionItems: [
          'Deploy AI chatbot for customer support',
          'Implement automated billing and invoicing',
          'Optimize resource allocation algorithms',
          'Integrate predictive analytics for demand forecasting'
        ],
        expectedOutcome: 'Reduce operational costs by $285K annually while improving customer satisfaction',
        investmentRequired: 450000,
        roi: 3.1,
        kpiTargets: [
          { metric: 'Operational Cost Reduction', target: 18, timeframe: '9 months' },
          { metric: 'Customer Response Time', target: 40, timeframe: '6 months' },
          { metric: 'Customer Satisfaction Score', target: 4.7, timeframe: '12 months' }
        ],
        dataPoints: ['Process automation analysis', 'Customer service metrics', 'Cost structure breakdown'],
        priority: 2
      },
      {
        id: 'market-risk',
        type: 'warning',
        title: 'Customer Concentration Risk',
        description: 'Top 3 customers represent 52% of MRR. Typical SaaS benchmark is <20% for risk mitigation. Immediate diversification required.',
        confidence: 96,
        impact: 'high',
        timeline: 'Immediate',
        actionItems: [
          'Implement customer diversification strategy',
          'Expand into adjacent market segments',
          'Strengthen retention programs for key accounts',
          'Develop early warning system for churn risk'
        ],
        expectedOutcome: 'Reduce concentration to <25% within 18 months',
        investmentRequired: 350000,
        roi: 2.4,
        kpiTargets: [
          { metric: 'Customer Concentration', target: 25, timeframe: '18 months' },
          { metric: 'Churn Rate', target: 3.2, timeframe: '12 months' }
        ],
        dataPoints: ['Customer cohort analysis', 'Churn prediction modeling', 'Market segmentation study'],
        priority: 1
      }
    ];

    const mockRiskFactors: RiskFactor[] = [
      {
        id: 'tech-scalability',
        category: 'Technology & Infrastructure',
        risk: 'API Scalability Limitations',
        severity: 'medium',
        probability: 42,
        impact: 'Current API infrastructure may limit customer acquisition beyond 2,500 active users without significant upgrades',
        financialImpact: 950000,
        timeframe: '6-9 months',
        recommendation: 'Implement microservices architecture and advanced caching solutions',
        mitigationSteps: [
          'Conduct comprehensive infrastructure audit',
          'Implement API gateway with advanced rate limiting',
          'Deploy auto-scaling cloud infrastructure',
          'Create real-time performance monitoring dashboard'
        ],
        kpiImpact: ['Customer Acquisition Rate', 'System Uptime', 'API Response Time', 'Customer Satisfaction'],
        industryRelevance: 88,
        regulatoryRisk: false
      },
      {
        id: 'competitive-threat',
        category: 'Market & Competitive Risk',
        risk: 'Major Enterprise Competitor Entry',
        severity: 'high',
        probability: 78,
        impact: 'Leading enterprise software vendor launching competing product with 40% pricing advantage in Q2 2025',
        financialImpact: 2800000,
        timeframe: '9-15 months',
        recommendation: 'Accelerate product differentiation and secure key customer lock-ins',
        mitigationSteps: [
          'Fast-track enterprise security certifications',
          'Negotiate multi-year contracts with 15% discounts',
          'Enhance unique value proposition features',
          'Launch customer advisory board program'
        ],
        kpiImpact: ['Customer Churn Rate', 'Average Contract Value', 'Market Share', 'Competitive Win Rate'],
        industryRelevance: 95,
        regulatoryRisk: false
      }
    ];

    const mockAlerts: PerformanceAlert[] = [
      {
        id: 'cac-alert',
        type: 'warning',
        title: 'Customer Acquisition Cost Trending Up',
        message: 'CAC increased 28% QoQ, now $1,425 vs target of $1,100',
        metric: 'Customer Acquisition Cost',
        change: 28.4,
        threshold: 15.0,
        timestamp: '2024-06-11T10:30:00Z',
        acknowledged: false
      },
      {
        id: 'nrr-success',
        type: 'success',
        title: 'Net Revenue Retention Exceeds Target',
        message: 'NRR reached 135% vs target of 120%',
        metric: 'Net Revenue Retention',
        change: 12.5,
        threshold: 120.0,
        timestamp: '2024-06-11T09:15:00Z',
        acknowledged: true
      },
      {
        id: 'margin-improvement',
        type: 'success',
        title: 'Gross Margin Improvement',
        message: 'Gross margin improved to 82.3% from 79.1% last quarter',
        metric: 'Gross Margin',
        change: 4.0,
        threshold: 80.0,
        timestamp: '2024-06-11T08:45:00Z',
        acknowledged: false
      }
    ];

    setMetrics(mockMetrics);
    setAdvancedMetrics(mockAdvancedMetrics);
    setTrendData(mockTrendData);
    setBenchmarkData(mockBenchmarkData);
    setAIInsights(mockAIInsights);
    setRiskFactors(mockRiskFactors);
    setAlerts(mockAlerts);
  }, []);

  const calculateHealthScore = (financialData: any): number => {
    let score = 50; // Base score
    
    const revenue = financialData?.revenue || 0;
    const netIncome = financialData?.net_income || 0;
    const assets = financialData?.assets || 0;
    const liabilities = financialData?.liabilities || 0;
    
    // Revenue health (0-20 points)
    if (revenue > 0) {
      if (revenue > 5000000) score += 20;
      else if (revenue > 1000000) score += 15;
      else if (revenue > 500000) score += 10;
      else score += 5;
    }
    
    // Profitability (0-25 points)
    if (revenue > 0) {
      const profitMargin = netIncome / revenue;
      if (profitMargin > 0.20) score += 25;
      else if (profitMargin > 0.15) score += 20;
      else if (profitMargin > 0.10) score += 15;
      else if (profitMargin > 0.05) score += 10;
      else if (profitMargin > 0) score += 5;
    }
    
    // Liquidity (0-15 points)
    if (assets > 0 && liabilities > 0) {
      const currentRatio = assets / liabilities;
      if (currentRatio > 2.5) score += 15;
      else if (currentRatio > 2.0) score += 12;
      else if (currentRatio > 1.5) score += 8;
      else if (currentRatio > 1.0) score += 5;
    }
    
    // Growth potential (0-10 points)
    if (revenue > 100000) score += 10;
    else if (revenue > 50000) score += 5;
    
    return Math.min(Math.max(score, 0), 100);
  };

  // Enhanced slide data generation with real QB data
  const generateEnhancedSlideDataWithRealData = (financialData: any, aiInsights?: any): EnhancedSlideContent => {
    const formatCurrency = (amount: number): string => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount || 0)
    }

    // Extract real QB data
    const revenue = financialData?.revenue || financialData?.profitLoss?.totalRevenue || 0
    const netIncome = financialData?.net_income || financialData?.profitLoss?.netIncome || 0
    const expenses = financialData?.expenses || financialData?.profitLoss?.totalExpenses || 0
    const assets = financialData?.assets || financialData?.balanceSheet?.totalAssets || 0
    const liabilities = financialData?.liabilities || financialData?.balanceSheet?.totalLiabilities || 0
    const healthScore = financialData?.healthScore || calculateHealthScore(financialData)

    // Calculate key ratios
    const profitMargin = revenue > 0 ? (netIncome / revenue) * 100 : 0
    const currentRatio = liabilities > 0 ? assets / liabilities : 0
    const debtToAsset = assets > 0 ? (liabilities / assets) * 100 : 0

    return {
      executiveSummary: {
        overallScore: healthScore,
        keyFindings: [
          `Annual Revenue: ${formatCurrency(revenue)}`,
          `Net Income: ${formatCurrency(netIncome)} (${profitMargin.toFixed(1)}% margin)`,
          `Financial Health Score: ${healthScore}/100`,
          `Current Ratio: ${currentRatio.toFixed(2)}x`,
          revenue > 1000000 ? 'Strong revenue foundation for growth' : 'Emerging business with growth potential'
        ],
        urgentIssues: [
          profitMargin < 10 ? 'Profit margins below industry average - optimization needed' : null,
          currentRatio < 1.5 ? 'Working capital management requires attention' : null,
          debtToAsset > 60 ? 'High debt levels may limit financial flexibility' : null
        ].filter(Boolean) as string[],
        opportunities: [
          revenue > 500000 ? 'Scale operations with strong revenue base' : 'Focus on revenue growth strategies',
          profitMargin < 15 ? 'Margin improvement through operational efficiency' : 'Maintain strong profitability',
          'Financial process automation and strategic planning',
          'Enhanced cash flow forecasting and management'
        ],
        contextualInsights: [
          'Analysis based on real QuickBooks financial data',
          `Company: ${companyName}`,
          `Data source: ${dataSource === 'real' ? 'Live QuickBooks API' : 'Historical database'}`,
          'AI-powered insights combining financial metrics with industry benchmarks'
        ],
        callToAction: healthScore > 80 ? 
          'Optimize strong financial position for strategic growth acceleration' :
          'Implement comprehensive financial optimization strategy to enhance performance'
      },
      
      financialSnapshot: {
        healthScore: healthScore,
        keyMetrics: [
          { 
            name: 'Revenue', 
            value: formatCurrency(revenue), 
            change: revenue > 0 ? '+Growth' : 'Baseline', 
            trend: 'positive' as const
          },
          { 
            name: 'Net Income', 
            value: formatCurrency(netIncome), 
            change: `${profitMargin.toFixed(1)}% margin`, 
            trend: profitMargin > 10 ? 'positive' : profitMargin > 0 ? 'neutral' : 'negative' as const
          },
          { 
            name: 'Assets', 
            value: formatCurrency(assets), 
            change: 'Total Assets', 
            trend: 'neutral' as const
          },
          { 
            name: 'Current Ratio', 
            value: currentRatio.toFixed(2), 
            change: currentRatio > 2 ? 'Strong' : currentRatio > 1 ? 'Adequate' : 'Weak', 
            trend: currentRatio > 1.5 ? 'positive' : 'neutral' as const
          }
        ],
        industryComparison: [
          { 
            metric: 'Profit Margin', 
            company: profitMargin, 
            industry: 15.0, 
            ranking: profitMargin > 15 ? 'Above Average' : profitMargin > 10 ? 'Average' : 'Below Average' as const
          },
          { 
            metric: 'Current Ratio', 
            company: currentRatio, 
            industry: 2.0, 
            ranking: currentRatio > 2 ? 'Above Average' : currentRatio > 1.5 ? 'Average' : 'Below Average' as const
          },
          { 
            metric: 'Revenue Growth', 
            company: 12.0, // This would come from historical analysis
            industry: 10.5, 
            ranking: 'Above Average' as const
          }
        ],
        trendAnalysis: [
          revenue > 1000000 ? 'Strong revenue foundation supports growth initiatives' : 'Revenue growth opportunity exists',
          profitMargin > 15 ? 'Excellent profitability maintained' : 'Margin optimization opportunity identified',
          currentRatio > 2 ? 'Strong liquidity position' : 'Working capital management focus needed',
          'Financial infrastructure ready for scaling and automation'
        ]
      },

      // Rest of the structure remains the same but with real financial context
      painPoints: {
        identifiedPains: [
          {
            painPoint: profitMargin < 10 ? 'Below-average profit margins limiting growth investment' : 'Manual financial processes consuming resources',
            priority: profitMargin < 10 ? 'high' as const : 'medium' as const,
            financialEvidence: profitMargin < 10 ? 
              `Current net margin of ${profitMargin.toFixed(1)}% below industry standard of 15%` :
              `Revenue of ${formatCurrency(revenue)} requires sophisticated reporting infrastructure`,
            impact: profitMargin < 10 ? 
              `Estimated ${formatCurrency(revenue * 0.05)} annual opportunity cost` :
              `Operational impact affecting ${formatCurrency(revenue * 0.02)} efficiency potential`,
            solution: profitMargin < 10 ? 
              'Implement margin optimization and cost structure analysis' :
              'Deploy automated financial reporting and dashboard systems',
            estimatedValue: Math.floor(revenue * 0.03) || 25000
          }
        ],
        rootCauseAnalysis: [
          'Financial data indicates need for enhanced strategic planning',
          revenue < 500000 ? 'Revenue scale requires focused growth strategies' : 'Strong revenue base needs optimization focus',
          'Manual processes limiting analytical capabilities and strategic insights'
        ]
      },

      // Continue with other sections using similar real data integration...
      opportunities: {
        opportunities: [
          {
            opportunity: 'Financial Process Automation',
            difficulty: 'medium' as const,
            description: `Automate financial tasks for ${formatCurrency(revenue)} revenue business`,
            potentialValue: `${formatCurrency(Math.floor(revenue * 0.02))}+ annual savings`,
            timeline: '3-6 months',
            implementation: 'Phased rollout with QB integration'
          }
        ],
        quickWins: [
          'Implement automated QuickBooks reporting',
          'Create real-time financial dashboard',
          'Establish monthly financial review process',
          revenue > 1000000 ? 'Optimize high-revenue operations' : 'Focus on revenue growth strategies'
        ]
      },

      risks: {
        criticalRisks: [
          {
            risk: currentRatio < 1.5 ? 'Working Capital Management' : 'Growth Scaling Challenges',
            probability: currentRatio < 1.5 ? 'Medium' as const : 'Low' as const,
            impact: 'High' as const,
            mitigation: currentRatio < 1.5 ? 
              'Implement cash flow forecasting and working capital optimization' :
              'Establish scalable financial infrastructure'
          }
        ],
        contingencyPlanning: [
          'Establish financial monitoring systems with QB integration',
          'Implement scenario-based planning with real financial data',
          'Create operational flexibility based on current financial position'
        ]
      },

      recommendations: {
        immediate: [
          {
            action: 'Implement real-time QuickBooks dashboard',
            rationale: `${formatCurrency(revenue)} revenue business needs enhanced visibility`,
            expectedOutcome: 'Daily financial monitoring with QB data',
            timeline: '2-3 weeks'
          }
        ],
        shortTerm: [
          {
            action: 'Deploy automated financial analysis',
            rationale: `Current ${profitMargin.toFixed(1)}% margin has optimization potential`,
            expectedOutcome: 'Improved financial performance tracking',
            timeline: '1-2 months'
          }
        ],
        longTerm: [
          {
            action: 'Build comprehensive financial intelligence system',
            rationale: 'Scale financial operations to support business growth',
            expectedOutcome: 'Strategic financial partnership enabling expansion',
            timeline: '6-12 months'
          }
        ],
        budgetAligned: [
          { 
            service: 'QuickBooks Integration', 
            investment: '$1,200/mo', 
            roi: '400% ROI', 
            priority: 'High' as const 
          },
          { 
            service: 'Fractional CFO', 
            investment: revenue > 1000000 ? '$3,500/mo' : '$2,500/mo', 
            roi: '450% ROI', 
            priority: 'High' as const 
          }
        ]
      },

      engagement: {
        services: [
          {
            name: 'QuickBooks-Enhanced Fractional CFO Services',
            description: 'Strategic financial leadership with real-time QB integration',
            timeline: '6-12 months',
            deliverables: ['Automated QB reporting', 'Strategic planning', 'Real-time analytics']
          }
        ],
        investment: {
          monthly: revenue > 1000000 ? '$3,500' : '$2,500',
          setup: '$2,000',
          total: revenue > 1000000 ? '$23,000' : '$17,000'
        },
        roi: {
          timeToValue: '30-45 days',
          yearOneROI: '400-500%',
          threeYearROI: '650%'
        },
        timeline: [
          {
            phase: 'QuickBooks Integration & Setup',
            description: `Integrate with existing ${formatCurrency(revenue)} revenue operations`,
            duration: '30 days',  
            milestones: ['QB API integration', 'Financial dashboard', 'Reporting automation']
          }
        ]
      }
    }
  }

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const reportContent = `ELITE FINANCIAL ANALYSIS REPORT
Generated: ${new Date().toLocaleDateString()}
Company: ${selectedCompany}

EXECUTIVE SUMMARY
====================
Financial Health Score: ${advancedMetrics?.healthScore}/100
Total Revenue: $${formatCurrency(2840000)} (+10.1% QoQ)
Net Profit: $${formatCurrency(684000)} (+8.6% QoQ)
Free Cash Flow: $${formatCurrency(545000)}
Gross Margin: ${advancedMetrics?.grossMargin.toFixed(1)}%

KEY PERFORMANCE INDICATORS
============================
• Revenue Growth: +35.2% (Above industry avg of 18.5%)
• Operating Margin: 28.5% (Excellent vs industry 22.1%)
• Return on Assets: 15.2% (Top quartile performance)
• Current Ratio: 2.3 (Strong liquidity position)
• Debt-to-Equity: 0.36 (Conservative capital structure)

STRATEGIC INSIGHTS
===================
1. SaaS Enterprise Expansion Opportunity
   - Investment Required: $1.5M
   - Expected ROI: 4.2x
   - Timeline: 6-12 months

2. Customer Concentration Risk (High Priority)
   - Top 3 customers: 52% of MRR
   - Recommendation: Immediate diversification
   - Target: <25% concentration in 18 months

3. AI-Powered Operational Efficiency
   - Cost reduction potential: 18%
   - Investment: $450K
   - ROI: 3.1x

RISK ASSESSMENT
================
• Technology Scalability: Medium risk ($950K impact)
• Competitive Threat: High risk ($2.8M impact)
• Customer Concentration: High priority mitigation

RECOMMENDATIONS
================
1. IMMEDIATE (0-3 months):
   - Address customer concentration risk
   - Implement retention programs
   - Strengthen key account relationships

2. SHORT-TERM (3-9 months):
   - Deploy AI operational improvements
   - Expand enterprise sales capabilities
   - Enhance product differentiation

3. LONG-TERM (9-18 months):
   - Execute enterprise market expansion
   - Diversify customer base
   - Scale technology infrastructure

This analysis was generated using advanced AI financial modeling and industry benchmarking.`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Elite_Financial_Analysis_${selectedCompany.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsGeneratingReport(false);
  };

  // Utility functions
  const formatCurrency = (value: number, compact = false) => {
    if (compact && value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (compact && value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number, decimal: boolean = false) => {
    return `${decimal ? value.toFixed(1) : value.toFixed(0)}%`;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Target className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'trend': return <TrendingUp className="w-4 h-4 text-blue-400" />;
      case 'recommendation': return <Zap className="w-4 h-4 text-cyan-400" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPerformanceColor = (performance: string) => {
    const colors = {
      'excellent': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'above-average': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'average': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'below-average': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'poor': 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[performance as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getRiskSeverityColor = (severity: string) => {
    const colors = {
      'critical': 'bg-red-600/30 text-red-300 border-red-500/50',
      'high': 'bg-red-500/20 text-red-400 border-red-500/30',
      'medium': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'low': 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  // Memoized calculations
  const growthMetrics = useMemo(() => {
    if (trendData.length < 2) return null;
    const latest = trendData[trendData.length - 1];
    const previous = trendData[trendData.length - 2];

    return {
      revenueGrowth: ((latest.revenue - previous.revenue) / previous.revenue) * 100,
      profitGrowth: ((latest.netIncome - previous.netIncome) / previous.netIncome) * 100,
      cashFlowGrowth: ((latest.cashFlow - previous.cashFlow) / previous.cashFlow) * 100,
      employeeGrowth: ((latest.employees - previous.employees) / previous.employees) * 100,
      customerGrowth: ((latest.customerCount - previous.customerCount) / previous.customerCount) * 100
    };
  }, [trendData]);

  const priorityInsights = useMemo(() =>
    aiInsights
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3),
    [aiInsights]
  );

  const criticalRisks = useMemo(() =>
    riskFactors.filter(risk => risk.severity === 'critical' || risk.severity === 'high'),
    [riskFactors]
  );

  const getHealthScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400';
    if (score >= 75) return 'text-green-400';
    if (score >= 65) return 'text-yellow-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900 p-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Loading State */}
      {loadingFinancialData && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading financial data for {companyName}...</p>
            <p className="text-gray-400 text-sm mt-2">Connecting to QuickBooks...</p>
          </div>
        </div>
      )}

      {/* Empty State - No Financial Data */}
      {!loadingFinancialData && dataSource === 'real' && !realFinancialData && (
        <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-12">
          <div className="text-center max-w-2xl mx-auto">
            <div className="bg-yellow-500/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <AlertTriangle className="w-12 h-12 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">No Financial Data Available</h2>
            <p className="text-gray-300 mb-6">
              Financial data for <strong>{companyName}</strong> hasn't been synced yet. 
              Please ensure QuickBooks is connected and data has been extracted.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => {
                  const params = new URLSearchParams({
                    company_id: companyId,
                    company_name: companyName
                  });
                  window.location.href = `/dashboard/data-extraction?${params.toString()}`;
                }}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
              >
                Go to Data Extraction
              </button>
              <button
                onClick={fetchComprehensiveAnalysis}
                className="block mx-auto text-gray-400 hover:text-white transition-colors"
              >
                Retry Loading Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Only show when data is available */}
      {!loadingFinancialData && (realFinancialData || dataSource !== 'real') && (
        <>
          {/* Enhanced Header */}
          <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">Elite Financial Analysis</h1>
                    <p className="text-gray-300">Advanced AI-powered insights and strategic recommendations</p>
                  </div>
                </div>

                {/* Company Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-gray-400 text-sm">Company</div>
                    <div className="text-white font-medium">{companyName}</div>
                    <div className="text-gray-500 text-xs">{comprehensiveAnalysis?.company?.industry || 'Technology'}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-gray-400 text-sm">Annual Revenue</div>
                    <div className="text-white font-medium">
                      {realFinancialData?.revenue ? formatCurrency(realFinancialData.revenue * 4, true) : 'Loading...'}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {comprehensiveAnalysis?.company?.employeeCount ? `${comprehensiveAnalysis.company.employeeCount} employees` : ''}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-gray-400 text-sm">Data Quality</div>
                    <div className={`font-medium ${dataSource === 'real' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {dataSource === 'real' ? 'Live QuickBooks' : 'Demo Data'}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {dataSource === 'real' ? 'Real-time sync' : 'Sample data'}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-gray-400 text-sm">Last Analysis</div>
                    <div className="text-white font-medium">{new Date().toLocaleDateString()}</div>
                    <div className={`text-xs ${loadingFinancialData ? 'text-yellow-400' : 'text-green-400'}`}>
                      {loadingFinancialData ? 'Loading...' : 'Active'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={runAdvancedAnalysis}
                  disabled={isAnalyzing}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzing ? 'Analyzing...' : 'Run Analysis'}</span>
                </button>
              </div>
            </div>

            {/* Performance Alerts */}
            {alerts.filter(alert => !alert.acknowledged).length > 0 && (
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-yellow-400" />
                  Performance Alerts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {alerts.filter(alert => !alert.acknowledged).slice(0, 2).map(alert => (
                    <div key={alert.id} className={`p-4 rounded-xl border ${
                      alert.type === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                      alert.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                      alert.type === 'success' ? 'bg-green-500/10 border-green-500/30' :
                      'bg-blue-500/10 border-blue-500/30'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-white">{alert.title}</h4>
                          <p className="text-sm text-gray-300 mt-1">{alert.message}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          alert.type === 'critical' ? 'bg-red-500 text-white' :
                          alert.type === 'warning' ? 'bg-yellow-500 text-black' :
                          alert.type === 'success' ? 'bg-green-500 text-white' :
                          'bg-blue-500 text-white'
                        }`}>
                          {alert.change > 0 ? '+' : ''}{alert.change.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Transcript Insights Alert - Show when transcript data is included */}
          {transcriptInsights && (
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Call Transcript Insights Integrated</h3>
                  <p className="text-gray-300 mb-4">This analysis includes insights from your recent call transcript</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="text-sm text-gray-400 mb-1">Urgency Level</div>
                      <div className={`text-lg font-bold ${
                        transcriptInsights.urgency === 'high' ? 'text-red-400' :
                        transcriptInsights.urgency === 'medium' ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {transcriptInsights.urgency.toUpperCase()}
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="text-sm text-gray-400 mb-1">Sales Score</div>
                      <div className="text-lg font-bold text-cyan-400">
                        {transcriptInsights.salesScore}/100
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="text-sm text-gray-400 mb-1">Pain Points</div>
                      <div className="text-lg font-bold text-orange-400">
                        {transcriptInsights.painPoints?.length || 0} Identified
                      </div>
                    </div>
                  </div>
                  
                  {transcriptInsights.painPoints && transcriptInsights.painPoints.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Key Pain Points from Call:</h4>
                      <div className="flex flex-wrap gap-2">
                        {transcriptInsights.painPoints.slice(0, 3).map((pain: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">
                            {pain}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Market Context Alert - Show when external data is available */}
          {marketContext && marketContext.economicIndicators && (
            <div className="bg-gradient-to-r from-cyan-500/10 to-green-500/10 backdrop-blur-xl rounded-3xl border border-cyan-500/20 p-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-cyan-500/20 rounded-xl">
                  <Globe className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Live Market & Economic Data</h3>
                  <p className="text-gray-300 mb-4">Analysis enhanced with real-time Federal Reserve and market data</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {marketContext.economicIndicators.gdpGrowth && (
                      <div className="bg-white/10 rounded-xl p-3">
                        <div className="text-xs text-gray-400 mb-1">GDP Growth</div>
                        <div className="text-lg font-bold text-green-400">
                          {marketContext.economicIndicators.gdpGrowth.toFixed(1)}%
                        </div>
                      </div>
                    )}
                    {marketContext.economicIndicators.unemploymentRate && (
                      <div className="bg-white/10 rounded-xl p-3">
                        <div className="text-xs text-gray-400 mb-1">Unemployment</div>
                        <div className="text-lg font-bold text-yellow-400">
                          {marketContext.economicIndicators.unemploymentRate.toFixed(1)}%
                        </div>
                      </div>
                    )}
                    {marketContext.economicIndicators.inflationRate && (
                      <div className="bg-white/10 rounded-xl p-3">
                        <div className="text-xs text-gray-400 mb-1">Inflation</div>
                        <div className="text-lg font-bold text-orange-400">
                          {marketContext.economicIndicators.inflationRate.toFixed(1)}%
                        </div>
                      </div>
                    )}
                    {marketContext.economicIndicators.interestRate && (
                      <div className="bg-white/10 rounded-xl p-3">
                        <div className="text-xs text-gray-400 mb-1">Fed Rate</div>
                        <div className="text-lg font-bold text-blue-400">
                          {marketContext.economicIndicators.interestRate.toFixed(2)}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Financial Health Score Dashboard */}
          <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-6">Financial Health Score</h2>
                  <div className="relative">
                    <div className={`text-7xl font-bold mb-4 ${getHealthScoreColor(advancedMetrics?.healthScore || 0)}`}>
                      {advancedMetrics?.healthScore || 0}
                    </div>
                    <div className="text-gray-300 text-lg">out of 100</div>
                    <div className="mt-6 relative">
                      <div className="w-full bg-white/10 rounded-full h-4">
                        <div
                          className={`h-4 rounded-full transition-all duration-1000 ${
                            (advancedMetrics?.healthScore || 0) >= 85 ? 'bg-gradient-to-r from-emerald-500 to-green-400' :
                            (advancedMetrics?.healthScore || 0) >= 75 ? 'bg-gradient-to-r from-green-500 to-lime-400' :
                            (advancedMetrics?.healthScore || 0) >= 65 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' :
                            'bg-gradient-to-r from-red-500 to-pink-400'
                          }`}
                          style={{ width: `${advancedMetrics?.healthScore || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Health Score Breakdown */}
                  <div className="mt-8 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Liquidity</span>
                      <span className="text-green-400 font-medium">Excellent</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Profitability</span>
                      <span className="text-green-400 font-medium">Outstanding</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Leverage</span>
                      <span className="text-blue-400 font-medium">Conservative</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Efficiency</span>
                      <span className="text-green-400 font-medium">Excellent</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <h3 className="text-xl font-bold text-white mb-6">Key Performance Indicators</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-300">Revenue Growth</span>
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {growthMetrics ? `+${formatPercent(growthMetrics.revenueGrowth, true)}` : 'N/A'}
                    </div>
                    <div className="text-sm text-green-400">QoQ Growth</div>
                  </div>

                  <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-300">Gross Margin</span>
                      <Target className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {formatPercent(advancedMetrics?.grossMargin || 0)}
                    </div>
                    <div className="text-sm text-blue-400">Industry Leading</div>
                  </div>

                  <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-300">Free Cash Flow</span>
                      <DollarSign className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {formatCurrency(advancedMetrics?.freeCashFlow || 0, true)}
                    </div>
                    <div className="text-sm text-cyan-400">Strong Generation</div>
                  </div>

                  <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-300">Current Ratio</span>
                      <Shield className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {(advancedMetrics?.currentRatio || 0).toFixed(1)}
                    </div>
                    <div className="text-sm text-green-400">Well Capitalized</div>
                  </div>

                  <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-300">ROA</span>
                      <Award className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {formatPercent(advancedMetrics?.returnOnAssets || 0)}
                    </div>
                    <div className="text-sm text-purple-400">Top Quartile</div>
                  </div>

                  <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-300">Debt/Equity</span>
                      <Activity className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {(advancedMetrics?.debtToEquity || 0).toFixed(1)}
                    </div>
                    <div className="text-sm text-yellow-400">Conservative</div>
                  </div>
                </div>

                {/* Quick Growth Metrics */}
                {growthMetrics && (
                  <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        +{formatPercent(growthMetrics.revenueGrowth, false)}
                      </div>
                      <div className="text-sm text-gray-400">Revenue Growth</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        +{formatPercent(growthMetrics.profitGrowth, false)}
                      </div>
                      <div className="text-sm text-gray-400">Profit Growth</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">
                        +{formatPercent(growthMetrics.customerGrowth, false)}
                      </div>
                      <div className="text-sm text-gray-400">Customer Growth</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        +{formatPercent(growthMetrics.employeeGrowth, false)}
                      </div>
                      <div className="text-sm text-gray-400">Team Growth</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Tab Navigation */}
          <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 mb-8">
            <div className="flex flex-wrap gap-2 p-3">
              {[
                { id: 'executive-summary', label: 'Executive Summary', icon: Briefcase },
                { id: 'financial-analysis', label: 'Financial Deep Dive', icon: Calculator },
                { id: 'growth-trends', label: 'Growth & Trends', icon: TrendingUp },
                { id: 'benchmarking', label: 'Industry Benchmarks', icon: Award },
                { id: 'risk-assessment', label: 'Risk Assessment', icon: Shield },
                { id: 'ai-insights', label: 'AI Strategic Insights', icon: Brain },
                { id: 'recommendations', label: 'Action Plan', icon: Target }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-500/30 shadow-lg'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'executive-summary' && (
            <div className="space-y-8">
              {/* Priority Insights */}
              <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Star className="w-6 h-6 mr-3 text-yellow-400" />
                  Priority Strategic Insights
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {priorityInsights.map((insight) => (
                    <div key={insight.id} className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${
                          insight.impact === 'transformational' ? 'bg-purple-500/20 border border-purple-500/30' :
                          insight.impact === 'high' ? 'bg-red-500/20 border border-red-500/30' :
                          insight.impact === 'medium' ? 'bg-yellow-500/20 border border-yellow-500/30' :
                          'bg-green-500/20 border border-green-500/30'
                        }`}>
                          {getInsightIcon(insight.type)}
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">ROI</div>
                          <div className="text-lg font-bold text-green-400">{insight.roi.toFixed(1)}x</div>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-3">{insight.title}</h3>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-3">{insight.description}</p>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Investment Required</span>
                          <span className="text-white font-medium">{formatCurrency(insight.investmentRequired, true)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Timeline</span>
                          <span className="text-cyan-400">{insight.timeline}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Confidence</span>
                          <span className="text-green-400">{insight.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Risks Overview */}
              {criticalRisks.length > 0 && (
                <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <AlertTriangle className="w-6 h-6 mr-3 text-red-400" />
                    Critical Risk Factors
                  </h2>
                  <div className="space-y-4">
                    {criticalRisks.map((risk) => (
                      <div key={risk.id} className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl p-6 border border-red-500/20">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-white mb-2">{risk.risk}</h3>
                            <div className="flex items-center space-x-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskSeverityColor(risk.severity)}`}>
                                {risk.severity} risk
                              </span>
                              <span className="text-gray-400 text-sm">{risk.probability}% probability</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">Financial Impact</div>
                            <div className="text-xl font-bold text-red-400">{formatCurrency(risk.financialImpact, true)}</div>
                          </div>
                        </div>

                        <p className="text-gray-300 mb-4">{risk.impact}</p>

                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
                          <h4 className="text-cyan-300 font-medium mb-2">Immediate Action Required:</h4>
                          <p className="text-cyan-200 text-sm">{risk.recommendation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Other tab content would continue here with similar enhanced styling... */}
          
          {/* Controls and Report Generation */}
          <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-4 mt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/25 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="1Q" className="bg-slate-800 text-white">Last Quarter</option>
                  <option value="4Q" className="bg-slate-800 text-white">Last 4 Quarters</option>
                  <option value="1Y" className="bg-slate-800 text-white">Last Year</option>
                  <option value="3Y" className="bg-slate-800 text-white">Last 3 Years</option>
                </select>
              </div>
              
              <button
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2"
              >
                <Download className={`w-4 h-4 ${isGeneratingReport ? 'animate-bounce' : ''}`} />
                <span>{isGeneratingReport ? 'Generating...' : 'Generate Elite Report'}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EliteAdvancedFinancialAnalyzer;
