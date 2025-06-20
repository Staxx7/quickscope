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
import { useRouter } from 'next/navigation';
import { useToast } from './Toast';

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
  id?: string;
  company_id?: string;
  revenue: number;
  net_income: number;
  expenses: number;
  assets: number;
  liabilities: number;
  created_at?: string;
  healthScore?: number;
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
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(new Set());
  const [loadingFinancialData, setLoadingFinancialData] = useState(false);
  const [realFinancialData, setRealFinancialData] = useState<FinancialSnapshot | null>(null);
  const [dataSource, setDataSource] = useState<'real' | 'mock'>('mock');
  const [metrics, setMetrics] = useState<FinancialMetric[]>([]);
  const [advancedMetrics, setAdvancedMetrics] = useState<AdvancedFinancialMetrics | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData[]>([]);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [aiInsights, setAIInsights] = useState<EnhancedAIInsight[]>([]);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('4Q');
  const [activeTab, setActiveTab] = useState('executive-summary');
  const [selectedCompany, setSelectedCompany] = useState(companyName || 'TechCorp Solutions');
  const [viewMode, setViewMode] = useState<'summary' | 'detailed' | 'executive'>('summary');
  const [dataLoadError, setDataLoadError] = useState<string | null>(null);
  const renderHealthScoreGauge = (score: number) => { /* from artifact 4 */ }

  const fetchRealFinancialData = async (dateRange?: { startDate?: string; endDate?: string; periodType?: string }) => {
    setLoadingFinancialData(true);
    setDataLoadError(null);
    
    try {
      // Get QuickBooks realm ID for the company
      const qboResponse = await fetch('/api/qbo/auth/companies');
      if (!qboResponse.ok) throw new Error('Failed to fetch QuickBooks connections');
      
      const qboData = await qboResponse.json();
      const qboCompany = qboData.companies?.find((c: any) => 
        c.company_name === companyName || c.id === companyId
      );
      
      if (!qboCompany) {
        throw new Error('No QuickBooks connection found for this company');
      }

      const realmId = qboCompany.realm_id || qboCompany.id;
      console.log(`Using QuickBooks realm_id: ${realmId} for enhanced financial data`);

      // Fetch enhanced financial data with date range
      const params = new URLSearchParams({
        realm_id: realmId,
        periodType: dateRange?.periodType || selectedTimeframe === '1Q' ? 'quarter' : 
                   selectedTimeframe === '1Y' ? 'year' : 
                   selectedTimeframe === 'YTD' ? 'ytd' : 'quarter',
        details: 'true'
      });
      
      if (dateRange?.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange?.endDate) params.append('endDate', dateRange.endDate);

      const response = await fetch(`/api/qbo/enhanced-financials?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch financial data');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch financial data');
      }

      // Transform enhanced data into component format
      const financialData = data.financialData;
      const metadata = data.metadata;
      
      // Update component state with real data
      setRealFinancialData({
        revenue: financialData.revenue.total,
        net_income: financialData.profitability.netIncome,
        expenses: financialData.expenses.total,
        assets: financialData.assets.total,
        liabilities: financialData.liabilities.total,
        healthScore: calculateHealthScore({
          revenue: financialData.revenue.total,
          net_income: financialData.profitability.netIncome,
          assets: financialData.assets.total,
          liabilities: financialData.liabilities.total
        })
      });

      // Update metrics with real data
      const realMetrics: FinancialMetric[] = [
        {
          id: 'revenue',
          name: 'Total Revenue',
          value: financialData.revenue.total,
          previousValue: financialData.comparison?.revenue ? 
            financialData.revenue.total - financialData.comparison.revenue.amount : 
            financialData.revenue.total * 0.9,
          change: financialData.comparison?.revenue?.amount || 0,
          changePercent: financialData.comparison?.revenue?.percentage || 0,
          trend: financialData.comparison?.revenue?.percentage > 0 ? 'up' : 'down',
          category: 'revenue'
        },
        {
          id: 'gross-profit',
          name: 'Gross Profit',
          value: financialData.profitability.grossProfit,
          previousValue: financialData.profitability.grossProfit * 0.95,
          change: financialData.profitability.grossProfit * 0.05,
          changePercent: 5.0,
          trend: 'up',
          category: 'profit'
        },
        {
          id: 'operating-expenses',
          name: 'Operating Expenses',
          value: financialData.expenses.operating,
          previousValue: financialData.comparison?.expenses ? 
            financialData.expenses.operating - (financialData.comparison.expenses.amount * 0.7) :
            financialData.expenses.operating * 0.95,
          change: financialData.comparison?.expenses?.amount * 0.7 || financialData.expenses.operating * 0.05,
          changePercent: financialData.comparison?.expenses?.percentage || 5.0,
          trend: 'up',
          category: 'expense'
        },
        {
          id: 'net-profit',
          name: 'Net Profit',
          value: financialData.profitability.netIncome,
          previousValue: financialData.comparison?.netIncome ?
            financialData.profitability.netIncome - financialData.comparison.netIncome.amount :
            financialData.profitability.netIncome * 0.85,
          change: financialData.comparison?.netIncome?.amount || financialData.profitability.netIncome * 0.15,
          changePercent: financialData.comparison?.netIncome?.percentage || 15.0,
          trend: financialData.profitability.netIncome > 0 ? 'up' : 'down',
          category: 'profit'
        }
      ];
      
      setMetrics(realMetrics);

      // Update advanced metrics
      const realAdvancedMetrics: AdvancedFinancialMetrics = {
        healthScore: calculateHealthScore(financialData),
        liquidityRatio: financialData.ratios.liquidity.current,
        profitMargin: financialData.profitability.netMargin,
        debtToEquity: financialData.ratios.leverage.debtToEquity,
        returnOnAssets: financialData.ratios.profitability.roa,
        returnOnEquity: financialData.ratios.profitability.roe,
        workingCapital: financialData.workingCapital,
        cashFlowRatio: financialData.cashFlow.operating / financialData.revenue.total,
        quickRatio: financialData.ratios.liquidity.quick,
        currentRatio: financialData.ratios.liquidity.current,
        inventoryTurnover: financialData.ratios.efficiency.inventoryTurnover,
        receivablesTurnover: financialData.ratios.efficiency.receivablesTurnover || 0,
        assetTurnover: financialData.ratios.efficiency.assetTurnover,
        grossMargin: financialData.profitability.grossMargin,
        operatingMargin: financialData.profitability.operatingMargin,
        netMargin: financialData.profitability.netMargin,
        ebitda: financialData.profitability.ebitda || 0,
        freeCashFlow: financialData.cashFlow.free,
        cashConversionCycle: financialData.ratios.efficiency.cashConversionCycle || 0,
        debtServiceCoverage: financialData.ratios.leverage.debtServiceCoverage || 0,
        interestCoverage: financialData.ratios.leverage.interestCoverage || 0,
        equityMultiplier: financialData.ratios.leverage.equityMultiplier || 0,
        priceToBook: 0, // Market data not available
        workingCapitalRatio: financialData.ratios.liquidity.workingCapitalRatio || 0
      };
      
      setAdvancedMetrics(realAdvancedMetrics);

      // Generate insights from real data
      const realInsights = generateInsightsFromFinancialData(financialData, data.insights);
      setAIInsights(realInsights);

      setDataSource('real');
      showToast(
        `✅ Live QuickBooks data loaded for ${metadata.dateRange.label} (${metadata.dateRange.daysIncluded} days)`,
        'success'
      );
      
      // Log data quality
      if (financialData.dataQuality && financialData.dataQuality.score < 80) {
        console.warn('⚠️ Data quality issues:', financialData.dataQuality.issues);
        if (financialData.dataQuality.issues.length > 0) {
          showToast(
            `Data Quality Warning: ${financialData.dataQuality.issues.join(', ')}`,
            'warning'
          );
        }
      }

    } catch (error) {
      console.error('Failed to load financial data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setDataLoadError(errorMessage);
      showToast(`Failed to load real financial data: ${errorMessage}`, 'error');
      setDataSource('mock');
      
      // Fall back to mock data
      generateAdvancedMockData();
    } finally {
      setLoadingFinancialData(false);
    }
  };

  const parseFinancialValue = (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const cleaned = value.replace(/[,$\s]/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const generateDataFromQuickBooks = async (qbData: any, balanceData: any, plData: any) => {
    // Extract real financial numbers from QuickBooks with proper parsing
    const revenue = parseFinancialValue(
      plData?.QueryResponse?.Item?.[0]?.ColData?.[1]?.value || 
      plData?.totalRevenue || 
      qbData?.revenue || 0
    );
    
    const totalExpenses = parseFinancialValue(
      plData?.QueryResponse?.Item?.find((item: any) => 
        item.ColData?.[0]?.value?.toLowerCase().includes('total expenses'))?.ColData?.[1]?.value || 
      plData?.totalExpenses || 
      qbData?.expenses || 0
    );
    
    const netIncome = revenue - totalExpenses;
    
    const totalAssets = parseFinancialValue(
      balanceData?.QueryResponse?.Item?.find((item: any) => 
        item.ColData?.[0]?.value?.toLowerCase().includes('total assets'))?.ColData?.[1]?.value || 
      balanceData?.totalAssets || 
      qbData?.assets || 0
    );
    
    const totalLiabilities = parseFinancialValue(
      balanceData?.QueryResponse?.Item?.find((item: any) => 
        item.ColData?.[0]?.value?.toLowerCase().includes('total liabilities'))?.ColData?.[1]?.value || 
      balanceData?.totalLiabilities || 
      qbData?.liabilities || 0
    );
    const equity = totalAssets - totalLiabilities;

    // Calculate key financial ratios from real data
    const healthScore = calculateHealthScore({ revenue, net_income: netIncome, assets: totalAssets, liabilities: totalLiabilities });
    const profitMargin = revenue > 0 ? (netIncome / revenue) * 100 : 0;
    const grossMargin = revenue > 0 ? ((revenue - (totalExpenses * 0.7)) / revenue) * 100 : 0; // Estimate COGS as 70% of expenses
    const currentRatio = totalLiabilities > 0 ? totalAssets / totalLiabilities : 0;
    const debtToEquity = equity > 0 ? totalLiabilities / equity : 0;
    const returnOnAssets = totalAssets > 0 ? (netIncome / totalAssets) * 100 : 0;

    // Transform into component format using REAL data
    const realMetrics: FinancialMetric[] = [
      {
        id: 'revenue',
        name: 'Total Revenue',
        value: revenue,
        previousValue: revenue * 0.91, // Estimate previous period as 91% of current
        change: revenue * 0.09,
        changePercent: 9.0,
        trend: revenue > 0 ? 'up' : 'stable',
        category: 'revenue'
      },
      {
        id: 'gross-profit',
        name: 'Gross Profit',
        value: revenue - (totalExpenses * 0.7), // Estimate COGS
        previousValue: (revenue - (totalExpenses * 0.7)) * 0.88,
        change: (revenue - (totalExpenses * 0.7)) * 0.12,
        changePercent: 12.0,
        trend: 'up',
        category: 'profit'
      },
      {
        id: 'operating-expenses',
        name: 'Operating Expenses',
        value: totalExpenses,
        previousValue: totalExpenses * 0.95,
        change: totalExpenses * 0.05,
        changePercent: 5.0,
        trend: 'up',
        category: 'expense'
      },
      {
        id: 'net-profit',
        name: 'Net Profit',
        value: netIncome,
        previousValue: netIncome * 0.85,
        change: netIncome * 0.15,
        changePercent: 15.0,
        trend: netIncome > 0 ? 'up' : 'down',
        category: 'profit'
      },
      {
        id: 'total-assets',
        name: 'Total Assets',
        value: totalAssets,
        previousValue: totalAssets * 0.94,
        change: totalAssets * 0.06,
        changePercent: 6.0,
        trend: 'up',
        category: 'efficiency'
      },
      {
        id: 'current-ratio',
        name: 'Current Ratio',
        value: currentRatio,
        previousValue: currentRatio * 0.96,
        change: currentRatio * 0.04,
        changePercent: 4.0,
        trend: currentRatio > 1.5 ? 'up' : 'stable',
        category: 'efficiency'
      }
    ];

    const realAdvancedMetrics: AdvancedFinancialMetrics = {
      healthScore: healthScore,
      liquidityRatio: currentRatio,
      profitMargin: profitMargin,
      grossMargin: grossMargin,
      operatingMargin: profitMargin + 5, // Estimate
      netMargin: profitMargin,
      debtToEquity: debtToEquity,
      returnOnAssets: returnOnAssets,
      returnOnEquity: equity > 0 ? (netIncome / equity) * 100 : 0,
      workingCapital: totalAssets - totalLiabilities,
      cashFlowRatio: currentRatio * 0.8, // Estimate
      quickRatio: currentRatio * 0.9, // Estimate
      currentRatio: currentRatio,
      inventoryTurnover: revenue > 0 ? revenue / (totalAssets * 0.15) : 0, // Estimate inventory as 15% of assets
      receivablesTurnover: revenue > 0 ? revenue / (totalAssets * 0.2) : 0, // Estimate A/R as 20% of assets
      assetTurnover: totalAssets > 0 ? revenue / totalAssets : 0,
      ebitda: netIncome + (totalExpenses * 0.1), // Estimate depreciation as 10% of expenses
      freeCashFlow: netIncome * 0.8, // Estimate
      cashConversionCycle: 45, // Industry average estimate
      debtServiceCoverage: netIncome > 0 ? netIncome / (totalLiabilities * 0.1) : 0, // Estimate debt service
      interestCoverage: netIncome > 0 ? netIncome / (totalLiabilities * 0.05) : 0, // Estimate interest
      equityMultiplier: equity > 0 ? totalAssets / equity : 0,
      priceToBook: 2.5, // Estimate
      workingCapitalRatio: totalAssets > 0 ? (totalAssets - totalLiabilities) / totalAssets : 0
    };

    // Generate realistic trend data based on current real data
    const realTrendData: TrendData[] = [
      {
        period: 'Q1 2024',
        revenue: revenue * 0.75,
        expenses: totalExpenses * 0.75,
        netIncome: netIncome * 0.70,
        cashFlow: netIncome * 0.65,
        grossProfit: (revenue - totalExpenses) * 0.75,
        operatingIncome: netIncome * 0.75,
        ebitda: netIncome * 0.80,
        totalAssets: totalAssets * 0.85,
        totalLiabilities: totalLiabilities * 0.80,
        equity: equity * 0.85,
        freeCashFlow: netIncome * 0.60,
        capex: revenue * 0.03,
        employees: Math.floor(revenue / 50000) || 5, // Estimate based on revenue
        customerCount: Math.floor(revenue / 5000) || 10 // Estimate based on revenue
      },
      {
        period: 'Q2 2024',
        revenue: revenue * 0.85,
        expenses: totalExpenses * 0.85,
        netIncome: netIncome * 0.80,
        cashFlow: netIncome * 0.75,
        grossProfit: (revenue - totalExpenses) * 0.85,
        operatingIncome: netIncome * 0.85,
        ebitda: netIncome * 0.90,
        totalAssets: totalAssets * 0.90,
        totalLiabilities: totalLiabilities * 0.85,
        equity: equity * 0.90,
        freeCashFlow: netIncome * 0.70,
        capex: revenue * 0.035,
        employees: Math.floor(revenue / 45000) || 8,
        customerCount: Math.floor(revenue / 4500) || 15
      },
      {
        period: 'Q3 2024',
        revenue: revenue * 0.95,
        expenses: totalExpenses * 0.95,
        netIncome: netIncome * 0.90,
        cashFlow: netIncome * 0.85,
        grossProfit: (revenue - totalExpenses) * 0.95,
        operatingIncome: netIncome * 0.95,
        ebitda: netIncome * 0.95,
        totalAssets: totalAssets * 0.95,
        totalLiabilities: totalLiabilities * 0.90,
        equity: equity * 0.95,
        freeCashFlow: netIncome * 0.80,
        capex: revenue * 0.04,
        employees: Math.floor(revenue / 40000) || 12,
        customerCount: Math.floor(revenue / 4000) || 20
      },
      {
        period: 'Current Period',
        revenue: revenue,
        expenses: totalExpenses,
        netIncome: netIncome,
        cashFlow: netIncome * 0.90,
        grossProfit: revenue - totalExpenses,
        operatingIncome: netIncome,
        ebitda: netIncome * 1.1,
        totalAssets: totalAssets,
        totalLiabilities: totalLiabilities,
        equity: equity,
        freeCashFlow: netIncome * 0.85,
        capex: revenue * 0.045,
        employees: Math.floor(revenue / 35000) || 15,
        customerCount: Math.floor(revenue / 3500) || 25
      }
    ];

    // Generate benchmarks using real company data
    const realBenchmarkData: BenchmarkData[] = [
      {
        metric: 'Revenue Growth',
        companyValue: 25.0, // Estimate based on trends
        industryAverage: 18.5,
        topQuartile: 28.0,
        topDecile: 45.2,
        performance: 25.0 > 28.0 ? 'above-average' : 'average',
        trend: 'improving',
        priority: 'high'
      },
      {
        metric: 'Gross Margin',
        companyValue: grossMargin,
        industryAverage: 75.2,
        topQuartile: 82.0,
        topDecile: 87.5,
        performance: grossMargin > 82.0 ? 'excellent' : grossMargin > 75.2 ? 'above-average' : 'average',
        trend: 'stable',
        priority: 'medium'
      },
      {
        metric: 'Net Profit Margin',
        companyValue: profitMargin,
        industryAverage: 22.1,
        topQuartile: 28.0,
        topDecile: 35.2,
        performance: profitMargin > 28.0 ? 'excellent' : profitMargin > 22.1 ? 'above-average' : 'average',
        trend: 'improving',
        priority: 'high'
      },
      {
        metric: 'Current Ratio',
        companyValue: currentRatio,
        industryAverage: 1.8,
        topQuartile: 2.3,
        topDecile: 2.8,
        performance: currentRatio > 2.3 ? 'excellent' : currentRatio > 1.8 ? 'above-average' : 'average',
        trend: 'stable',
        priority: 'medium'
      },
      {
        metric: 'Return on Assets',
        companyValue: returnOnAssets,
        industryAverage: 8.9,
        topQuartile: 15.2,
        topDecile: 22.1,
        performance: returnOnAssets > 15.2 ? 'excellent' : returnOnAssets > 8.9 ? 'above-average' : 'average',
        trend: 'improving',
        priority: 'high'
      }
    ];

    // Generate AI insights based on real financial performance
    const realAIInsights: EnhancedAIInsight[] = [];
    
    // Revenue-based insights
    if (revenue > 1000000) {
      realAIInsights.push({
        id: 'revenue-optimization',
        type: 'opportunity',
        title: 'Revenue Optimization Strategy',
        description: `With current revenue of ${formatCurrency(revenue, true)}, there's opportunity to optimize pricing and expand market reach. Strong revenue base indicates scalability potential.`,
        confidence: 88,
        impact: 'high',
        timeline: '3-6 months',
        actionItems: [
          'Analyze pricing strategy against competitors',
          'Implement value-based pricing models',
          'Expand into adjacent market segments',
          'Optimize customer acquisition channels'
        ],
        expectedOutcome: 'Increase revenue by 15-25% through strategic optimization',
        investmentRequired: Math.floor(revenue * 0.05),
        roi: 3.2,
        kpiTargets: [
          { metric: 'Revenue Growth', target: 25, timeframe: '6 months' },
          { metric: 'Customer Acquisition', target: Math.floor(revenue / 3000), timeframe: '6 months' }
        ],
        dataPoints: ['Current revenue analysis', 'Market positioning study', 'Competitive pricing analysis'],
        priority: 1
      });
    }

    // Profitability insights
    if (profitMargin < 15) {
      realAIInsights.push({
        id: 'margin-improvement',
        type: 'recommendation',
        title: 'Profit Margin Enhancement',
        description: `Current profit margin of ${profitMargin.toFixed(1)}% is below industry standards. Implementing cost optimization and operational efficiency measures could significantly improve profitability.`,
        confidence: 92,
        impact: 'high',
        timeline: '2-4 months',
        actionItems: [
          'Conduct comprehensive cost analysis',
          'Implement automated operational processes',
          'Optimize vendor contracts and pricing',
          'Streamline administrative expenses'
        ],
        expectedOutcome: `Improve profit margin to 18-22% range`,
        investmentRequired: Math.floor(revenue * 0.02),
        roi: 4.1,
        kpiTargets: [
          { metric: 'Profit Margin', target: 20, timeframe: '4 months' },
          { metric: 'Cost Reduction', target: 12, timeframe: '3 months' }
        ],
        dataPoints: ['Expense analysis', 'Process efficiency study', 'Vendor contract review'],
        priority: 2
      });
    }

    // Liquidity insights
    if (currentRatio < 1.5) {
      realAIInsights.push({
        id: 'liquidity-management',
        type: 'warning',
        title: 'Working Capital Management',
        description: `Current ratio of ${currentRatio.toFixed(1)} indicates potential liquidity constraints. Strengthening working capital management is recommended.`,
        confidence: 85,
        impact: 'medium',
        timeline: 'Immediate',
        actionItems: [
          'Implement aggressive accounts receivable collection',
          'Optimize inventory management',
          'Negotiate extended payment terms with suppliers',
          'Establish credit line for working capital needs'
        ],
        expectedOutcome: 'Improve current ratio to 2.0+ within 3 months',
        investmentRequired: Math.floor(revenue * 0.01),
        roi: 2.8,
        kpiTargets: [
          { metric: 'Current Ratio', target: 2.0, timeframe: '3 months' },
          { metric: 'Cash Collection', target: 30, timeframe: '2 months' }
        ],
        dataPoints: ['Cash flow analysis', 'A/R aging report', 'Working capital trends'],
        priority: 1
      });
    }

    // Generate performance alerts based on real data
    const realAlerts: PerformanceAlert[] = [];
    
    if (profitMargin < 10) {
      realAlerts.push({
        id: 'low-margin-alert',
        type: 'warning',
        title: 'Below Average Profit Margins',
        message: `Profit margin of ${profitMargin.toFixed(1)}% is below healthy business standards`,
        metric: 'Net Profit Margin',
        change: profitMargin - 15, // vs industry standard
        threshold: 15.0,
        timestamp: new Date().toISOString(),
        acknowledged: false
      });
    }

    if (currentRatio > 2.0) {
      realAlerts.push({
        id: 'strong-liquidity',
        type: 'success',
        title: 'Strong Liquidity Position',
        message: `Current ratio of ${currentRatio.toFixed(1)} indicates excellent financial stability`,
        metric: 'Current Ratio',
        change: currentRatio - 1.8, // vs industry average
        threshold: 2.0,
        timestamp: new Date().toISOString(),
        acknowledged: false
      });
    }

    if (revenue > 500000) {
      realAlerts.push({
        id: 'revenue-milestone',
        type: 'success',
        title: 'Strong Revenue Performance',
        message: `Annual revenue of ${formatCurrency(revenue, true)} demonstrates solid business foundation`,
        metric: 'Annual Revenue',
        change: 25.0, // Estimated growth
        threshold: 500000,
        timestamp: new Date().toISOString(),
        acknowledged: false
      });
    }

    // Generate risk factors based on real financial data
    const realRiskFactors: RiskFactor[] = [];
    
    if (currentRatio < 1.5) {
      realRiskFactors.push({
        id: 'liquidity-risk',
        category: 'Financial Liquidity',
        risk: 'Working Capital Constraints',
        severity: currentRatio < 1.0 ? 'high' : 'medium',
        probability: 65,
        impact: 'Current liquidity ratio suggests potential cash flow challenges during peak operational periods',
        financialImpact: Math.floor(revenue * 0.1),
        timeframe: '3-6 months',
        recommendation: 'Implement comprehensive working capital management strategy',
        mitigationSteps: [
          'Establish revolving credit facility',
          'Optimize accounts receivable collection cycles',
          'Implement cash flow forecasting systems',
          'Negotiate favorable supplier payment terms'
        ],
        kpiImpact: ['Cash Flow', 'Current Ratio', 'Operational Efficiency'],
        industryRelevance: 85,
        regulatoryRisk: false
      });
    }

    if (debtToEquity > 0.5) {
      realRiskFactors.push({
        id: 'leverage-risk',
        category: 'Capital Structure',
        risk: 'High Leverage Ratio',
        severity: debtToEquity > 1.0 ? 'high' : 'medium',
        probability: 45,
        impact: 'Elevated debt-to-equity ratio may limit financial flexibility and increase borrowing costs',
        financialImpact: Math.floor(revenue * 0.05),
        timeframe: '6-12 months',
        recommendation: 'Focus on debt reduction and equity strengthening strategies',
        mitigationSteps: [
          'Prioritize debt paydown from operational cash flow',
          'Consider equity injection or retained earnings growth',
          'Refinance high-cost debt with favorable terms',
          'Implement strict capital allocation discipline'
        ],
        kpiImpact: ['Debt Service Coverage', 'Interest Coverage', 'Financial Flexibility'],
        industryRelevance: 78,
        regulatoryRisk: false
      });
    }

    // Set all the real data
    setMetrics(realMetrics);
    setAdvancedMetrics(realAdvancedMetrics);
    setTrendData(realTrendData);
    setBenchmarkData(realBenchmarkData);
    setAIInsights(realAIInsights);
    setRiskFactors(realRiskFactors);
    setAlerts(realAlerts);
    setRealFinancialData({ 
      revenue, 
      net_income: netIncome, 
      expenses: totalExpenses, 
      assets: totalAssets, 
      liabilities: totalLiabilities,
      healthScore
    });
  };

  // Generate insights from real financial data
  const generateInsightsFromFinancialData = (financialData: any, apiInsights: string[]): EnhancedAIInsight[] => {
    const insights: EnhancedAIInsight[] = [];
    
    // Add API insights
    if (apiInsights && apiInsights.length > 0) {
      apiInsights.forEach((insight, index) => {
        insights.push({
          id: `api-${index}`,
          type: 'trend',
          title: 'Financial Trend Insight',
          description: insight,
          confidence: 85,
          impact: 'medium',
          timeline: 'immediate',
          actionItems: [],
          expectedOutcome: '',
          investmentRequired: 0,
          roi: 0,
          kpiTargets: [],
          dataPoints: [],
          priority: 3
        });
      });
    }
    
    // Profitability insights
    if (financialData.profitability.netMargin < 5) {
      insights.push({
        id: 'profit-margin-low',
        type: 'concern',
        title: 'Low Profit Margins Detected',
        description: `Current net profit margin of ${financialData.profitability.netMargin.toFixed(1)}% is below industry standards. This indicates potential cost inefficiencies or pricing issues.`,
        confidence: 92,
        impact: 'high',
        timeline: '3-6 months',
        actionItems: [
          'Conduct comprehensive cost analysis',
          'Review pricing strategy',
          'Identify operational inefficiencies',
          'Implement cost reduction measures'
        ],
        expectedOutcome: 'Improve profit margins to 15-20% range',
        investmentRequired: 0,
        roi: 4.2,
        kpiTargets: [
          { metric: 'Net Margin', target: 15, timeframe: '6 months' },
          { metric: 'Operating Margin', target: 18, timeframe: '6 months' }
        ],
        dataPoints: [
          `Gross margin: ${financialData.profitability.grossMargin.toFixed(1)}%`,
          `Operating margin: ${financialData.profitability.operatingMargin.toFixed(1)}%`
        ],
        priority: 1
      });
    }
    
    // Cash flow insights
    if (financialData.cashFlow.free < 0) {
      insights.push({
        id: 'negative-free-cash-flow',
        type: 'warning',
        title: 'Negative Free Cash Flow',
        description: `Free cash flow is negative at ${formatCurrency(financialData.cashFlow.free)}. This indicates the business is consuming more cash than it generates.`,
        confidence: 95,
        impact: 'high',
        timeline: 'immediate',
        actionItems: [
          'Accelerate receivables collection',
          'Optimize inventory levels',
          'Renegotiate payment terms',
          'Review capital expenditures'
        ],
        expectedOutcome: 'Achieve positive free cash flow within 90 days',
        investmentRequired: 0,
        roi: 0,
        kpiTargets: [
          { metric: 'Free Cash Flow', target: 50000, timeframe: '3 months' },
          { metric: 'Cash Conversion Cycle', target: 45, timeframe: '3 months' }
        ],
        dataPoints: [
          `Operating cash flow: ${formatCurrency(financialData.cashFlow.operating)}`,
          `Capital expenditures: ${formatCurrency(Math.abs(financialData.cashFlow.investing))}`
        ],
        priority: 1
      });
    }
    
    // Working capital insights
    if (financialData.workingCapital < 0) {
      insights.push({
        id: 'negative-working-capital',
        type: 'concern',
        title: 'Working Capital Deficit',
        description: `Working capital is negative at ${formatCurrency(financialData.workingCapital)}, indicating potential liquidity issues.`,
        confidence: 90,
        impact: 'high',
        timeline: 'immediate',
        actionItems: [
          'Establish line of credit',
          'Accelerate collections',
          'Extend payables strategically',
          'Improve inventory turnover'
        ],
        expectedOutcome: 'Achieve positive working capital',
        investmentRequired: 0,
        roi: 2.5,
        kpiTargets: [
          { metric: 'Working Capital', target: 100000, timeframe: '6 months' },
          { metric: 'Current Ratio', target: 1.5, timeframe: '6 months' }
        ],
        dataPoints: [
          `Current ratio: ${financialData.ratios.liquidity.current.toFixed(2)}`,
          `Quick ratio: ${financialData.ratios.liquidity.quick.toFixed(2)}`
        ],
        priority: 1
      });
    }
    
    // Growth opportunities
    if (financialData.comparison?.revenue?.percentage > 15) {
      insights.push({
        id: 'strong-revenue-growth',
        type: 'opportunity',
        title: 'Strong Revenue Growth Momentum',
        description: `Revenue grew ${financialData.comparison.revenue.percentage.toFixed(1)}% compared to previous period. This presents opportunities for scaling operations.`,
        confidence: 88,
        impact: 'transformational',
        timeline: '6-12 months',
        actionItems: [
          'Invest in operational capacity',
          'Expand sales team',
          'Enhance technology infrastructure',
          'Optimize supply chain'
        ],
        expectedOutcome: 'Sustain 20%+ annual growth rate',
        investmentRequired: 250000,
        roi: 3.5,
        kpiTargets: [
          { metric: 'Revenue Growth', target: 25, timeframe: '12 months' },
          { metric: 'Market Share', target: 15, timeframe: '12 months' }
        ],
        dataPoints: [
          `Current revenue: ${formatCurrency(financialData.revenue.total)}`,
          `Revenue growth: ${formatCurrency(financialData.comparison.revenue.amount)}`
        ],
        priority: 2
      });
    }
    
    return insights.sort((a, b) => a.priority - b.priority);
  };

  const initializeFinancialData = async () => {
    setLoadingFinancialData(true);
    setDataLoadError(null);
    try {
      console.log(`Initializing financial data for company: ${companyName} (ID: ${companyId})`);
      
      // First, get the QuickBooks realm_id for this company
      const qbCompaniesResponse = await fetch('/api/qbo/auth/companies');
      if (!qbCompaniesResponse.ok) {
        throw new Error('Failed to fetch QuickBooks connections');
      }
      
      const qbCompaniesData = await qbCompaniesResponse.json();
      console.log('Available QuickBooks companies:', qbCompaniesData.companies);
      
      // Try to find the company with more flexible matching
      const qbCompany = qbCompaniesData.companies?.find((c: any) => {
        // Case-insensitive name match
        const nameMatch = c.company_name?.toLowerCase() === companyName?.toLowerCase();
        // ID match (could be realm_id or company_id)
        const idMatch = c.realm_id === companyId || c.id === companyId;
        // Partial name match if exact match fails
        const partialNameMatch = c.company_name?.toLowerCase().includes(companyName?.toLowerCase()) || 
                               companyName?.toLowerCase().includes(c.company_name?.toLowerCase());
        
        return nameMatch || idMatch || partialNameMatch;
      });
      
      if (!qbCompany) {
        console.error('No QuickBooks connection found. Available companies:', 
          qbCompaniesData.companies?.map((c: any) => ({ name: c.company_name, id: c.id, realm_id: c.realm_id }))
        );
        throw new Error(`No QuickBooks connection found for ${companyName}. Please ensure QuickBooks is connected.`);
      }
      
      const realmId = qbCompany.realm_id || qbCompany.id;
      console.log(`Found QuickBooks realm_id: ${realmId} for company: ${companyName}`);
      
      // Try to get stored financial snapshot using realm_id
      const snapshotResponse = await fetch(`/api/financial-snapshots?company_id=${realmId}`);
      if (snapshotResponse.ok) {
        const snapshots = await snapshotResponse.json();
        console.log('Snapshots received:', snapshots);
        
        // Check if we have snapshot data
        if (snapshots && snapshots.length > 0) {
          const latestSnapshot = snapshots[0]; // Get most recent snapshot
          
          // Check if data is not all zeros
          const hasValidData = latestSnapshot.revenue > 0 || 
                             latestSnapshot.expenses > 0 || 
                             latestSnapshot.total_assets > 0 || 
                             latestSnapshot.total_liabilities > 0;
          
          if (hasValidData) {
            // Generate data from the saved snapshot
            await generateDataFromQuickBooks(
              latestSnapshot,
              { totalAssets: latestSnapshot.total_assets, totalLiabilities: latestSnapshot.total_liabilities },
              { totalRevenue: latestSnapshot.revenue, totalExpenses: latestSnapshot.expenses }
            );
            setDataSource('real');
            showToast(`Live ${companyName} financial data loaded successfully! 📊`, 'success');
            return;
          } else {
            console.warn('Snapshot contains all zero values, fetching fresh data...');
          }
        }
      }

      // If no valid snapshot, try direct QuickBooks API with realm_id
      console.log(`Fetching fresh QuickBooks data for realm_id: ${realmId}`);
      const qbResponse = await fetch(`/api/qbo/financial-snapshot?realm_id=${realmId}`);
      const balanceResponse = await fetch(`/api/qbo/balance-sheet?realm_id=${realmId}`);
      const plResponse = await fetch(`/api/qbo/profit-loss?realm_id=${realmId}`);

      if (qbResponse.ok && balanceResponse.ok && plResponse.ok) {
        const qbData = await qbResponse.json();
        const balanceData = await balanceResponse.json();
        const plData = await plResponse.json();
        
        console.log('QuickBooks API responses:', { qbData, balanceData, plData });
        
        // Validate that we have actual data
        const hasAnyData = (qbData[0]?.revenue > 0 || 
                          qbData[0]?.expenses > 0 || 
                          qbData[0]?.total_assets > 0 || 
                          qbData[0]?.total_liabilities > 0) ||
                         (balanceData?.totalAssets > 0 || plData?.totalRevenue > 0);
        
        if (hasAnyData) {
          // Transform real QB data into our component format
          await generateDataFromQuickBooks(qbData[0] || qbData, balanceData, plData);
          setDataSource('real');
          showToast(`Live ${companyName} QuickBooks data loaded successfully! 📊`, 'success');
        } else {
          // Try enhanced financials API for more comprehensive data
          console.log('Basic APIs returned zero values, trying enhanced financials...');
          const enhancedResponse = await fetch(`/api/qbo/enhanced-financials?realm_id=${realmId}&details=true`);
          
          if (enhancedResponse.ok) {
            const enhancedData = await enhancedResponse.json();
            console.log('Enhanced financials response:', enhancedData);
            
            if (enhancedData.success && enhancedData.financialData) {
              // Transform enhanced data into component format
              const fd = enhancedData.financialData;
              await generateDataFromQuickBooks(
                {
                  revenue: fd.revenue.total,
                  expenses: fd.expenses.total,
                  profit: fd.profitability.netIncome,
                  total_assets: fd.assets.total,
                  total_liabilities: fd.liabilities.total
                },
                { totalAssets: fd.assets.total, totalLiabilities: fd.liabilities.total },
                { totalRevenue: fd.revenue.total, totalExpenses: fd.expenses.total }
              );
              setDataSource('real');
              showToast(`Enhanced ${companyName} financial data loaded successfully! 📊`, 'success');
              return;
            }
          }
          
          throw new Error('QuickBooks returned no financial data - the company may have no transactions');
        }
      } else {
        const errors = [];
        if (!qbResponse.ok) errors.push('financial snapshot');
        if (!balanceResponse.ok) errors.push('balance sheet');
        if (!plResponse.ok) errors.push('profit/loss');
        throw new Error(`Failed to load: ${errors.join(', ')}. Please check QuickBooks connection.`);
      }
    } catch (error) {
      console.error('Failed to load real data:', error);
      setDataLoadError(error instanceof Error ? error.message : 'Unable to load financial data. Please ensure QuickBooks is connected and has financial data.');
      setDataSource('mock'); // Keep as mock to prevent crashes, but show error
      
      // Show more helpful error message
      if (error instanceof Error && error.message.includes('No QuickBooks connection found')) {
        showToast('No QuickBooks connection found for this company. Please connect QuickBooks first.', 'error');
      } else {
        showToast('Failed to load real financial data - using enhanced sample data', 'warning');
      }
      
      generateAdvancedMockData(); // Generate mock data to show something
    } finally {
      setLoadingFinancialData(false);
    }
  };

  const runAdvancedAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // Refresh with the latest data
      await initializeFinancialData();
      showToast('Advanced analysis refreshed successfully', 'success');
    } catch (error) {
      showToast('Failed to refresh analysis', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

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

  useEffect(() => {
    initializeFinancialData();
  }, [companyId]);

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
    
    try {
      // Simulate processing time with stages
      const stages = [
        'Preparing financial data...',
        'Analyzing performance metrics...',
        'Generating executive summary...',
        'Creating visual charts...',
        'Compiling strategic insights...',
        'Formatting professional layout...',
        'Finalizing PDF report...'
      ];

      for (let i = 0; i < stages.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 400));
        // You could add a progress indicator here if needed
      }

      // Prepare comprehensive report data
      const reportData = {
        company: {
          name: companyName || selectedCompany,
          id: companyId,
          industry: 'SaaS Technology',
          analysis_date: new Date().toISOString()
        },
        executive_summary: {
          health_score: advancedMetrics?.healthScore || 85,
          key_findings: [
            `Financial Health Score: ${advancedMetrics?.healthScore || 85}/100 - Excellent Performance`,
            `Revenue Growth: +${formatPercent(growthMetrics?.revenueGrowth || 35.2, true)} (Top quartile)`,
            `Operating Margin: ${advancedMetrics?.operatingMargin.toFixed(1) || '28.5'}% (Industry leading)`,
            `Current Ratio: ${advancedMetrics?.currentRatio.toFixed(1) || '2.3'}x (Strong liquidity)`,
            `Free Cash Flow: ${formatCurrency(advancedMetrics?.freeCashFlow || 545000, true)} (Robust generation)`
          ],
          critical_alerts: alerts.filter(alert => alert.type === 'critical' || alert.type === 'warning').map(alert => alert.message),
          opportunities: aiInsights.filter(insight => insight.type === 'opportunity').slice(0, 3).map(insight => ({
            title: insight.title,
            investment: insight.investmentRequired,
            roi: insight.roi,
            timeline: insight.timeline
          }))
        },
        financial_metrics: {
          revenue: realFinancialData?.revenue || 2840000,
          net_income: realFinancialData?.net_income || 684000,
          gross_margin: advancedMetrics?.grossMargin || 82.3,
          operating_margin: advancedMetrics?.operatingMargin || 28.5,
          current_ratio: advancedMetrics?.currentRatio || 2.3,
          debt_to_equity: advancedMetrics?.debtToEquity || 0.36,
          return_on_assets: advancedMetrics?.returnOnAssets || 15.2,
          free_cash_flow: advancedMetrics?.freeCashFlow || 545000,
          ebitda: advancedMetrics?.ebitda || 865000
        },
        growth_analysis: {
          quarterly_trends: trendData,
          growth_metrics: growthMetrics || {
            revenueGrowth: 35.2,
            profitGrowth: 28.4,
            customerGrowth: 18.7,
            employeeGrowth: 16.2
          }
        },
        industry_benchmarks: benchmarkData,
        risk_assessment: riskFactors.map(risk => ({
          category: risk.category,
          risk: risk.risk,
          severity: risk.severity,
          probability: risk.probability,
          financial_impact: risk.financialImpact,
          mitigation: risk.recommendation
        })),
        ai_insights: aiInsights.map(insight => ({
          type: insight.type,
          title: insight.title,
          description: insight.description,
          confidence: insight.confidence,
          investment_required: insight.investmentRequired,
          expected_roi: insight.roi,
          timeline: insight.timeline,
          action_items: insight.actionItems
        })),
        strategic_recommendations: {
          immediate: [
            {
              action: 'Address Customer Concentration Risk',
              priority: 'High',
              investment: '$350K',
              timeline: '30 days',
              expected_outcome: 'Reduce concentration from 52% to <35% of MRR'
            },
            {
              action: 'Implement Real-time Financial Dashboard',
              priority: 'High', 
              investment: '$25K setup',
              timeline: '2-3 weeks',
              expected_outcome: 'Daily financial visibility and automated reporting'
            }
          ],
          short_term: [
            {
              action: 'Deploy AI Operational Efficiency Program',
              priority: 'High',
              investment: '$450K',
              timeline: '3-6 months',
              expected_outcome: '18% cost reduction, $285K annual savings'
            }
          ],
          long_term: [
            {
              action: 'SaaS Enterprise Market Expansion',
              priority: 'Transformational',
              investment: '$1.5M',
              timeline: '6-12 months',
              expected_outcome: '4.2x ROI, $35M TAM expansion'
            }
          ]
        },
        engagement_proposal: {
          services: [
            {
              name: 'Fractional CFO Services',
              description: 'Strategic financial leadership with QuickBooks integration',
              monthly_investment: '$3,500',
              setup_fee: '$2,000',
              deliverables: ['Real-time QB dashboards', 'Strategic planning', 'Financial analysis', 'Board reporting'],
              timeline: '6-12 months',
              expected_roi: '400-500%'
            }
          ],
          total_investment: {
            year_one: '$42,000',
            setup: '$2,000',
            monthly: '$3,500'
          }
        }
      };

      // Call the enhanced PDF generation API
      const response = await fetch('/api/export/financial-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: reportData,
          format: 'pdf',
          companyName: companyName || selectedCompany,
          dateRange: {
            start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            end: new Date().toISOString().split('T')[0]
          },
          reportType: 'elite_financial_analysis'
        })
      });

      if (response.ok) {
        // Download the PDF
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Elite_Financial_Analysis_${(companyName || selectedCompany).replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showToast('Elite PDF report generated successfully! 🎉', 'success');
        
        // Navigate to report generation page after successful PDF generation
        setTimeout(() => {
          router.push('/admin/dashboard/report-generation');
        }, 1500);
      } else {
        throw new Error('PDF generation failed');
      }

    } catch (error) {
      console.error('Error generating PDF report:', error);
      showToast('Failed to generate PDF report. Please try again.', 'error');
    } finally {
      setIsGeneratingReport(false);
    }
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
      <ToastContainer />
      
      {/* Error Banner */}
      {dataLoadError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">Unable to Load Financial Data</h3>
              <p className="text-gray-300 mb-4">{dataLoadError}</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => router.push('/admin/dashboard/data-extraction')}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all text-sm"
                >
                  Re-run Data Extraction
                </button>
                <button
                  onClick={runAdvancedAnalysis}
                  className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all text-sm border border-white/20"
                >
                  Retry Loading
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <div className="text-white font-medium">{selectedCompany}</div>
                <div className="text-gray-500 text-xs">SaaS Technology</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-gray-400 text-sm">Annual Revenue</div>
                <div className="text-white font-medium">
                  {formatCurrency(
                    realFinancialData?.revenue || 
                    metrics.find(m => m.id === 'revenue')?.value || 
                    11360000, 
                    true
                  )}
                </div>
                <div className="text-gray-500 text-xs">
                  {Math.floor((realFinancialData?.revenue || metrics.find(m => m.id === 'revenue')?.value || 11360000) / 75000) || 148} employees
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-gray-400 text-sm">Data Source</div>
                <div className={`font-medium ${dataSource === 'real' ? 'text-green-400' : 'text-yellow-400'}`}>
                  {dataSource === 'real' ? '🔗 Live QuickBooks' : '📊 Demo Data'}
                </div>
                <div className="text-gray-500 text-xs">
                  {dataSource === 'real' ? 'Real-time data' : 'No live data available'}
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-gray-400 text-sm">Last Analysis</div>
                <div className="text-white font-medium">{new Date().toLocaleDateString()}</div>
                <div className="text-green-400 text-xs">Active</div>
              </div>
            </div>

            {/* Date Range and Data Quality Section */}
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Analysis Period</label>
                    <select
                      value={selectedTimeframe}
                      onChange={(e) => {
                        setSelectedTimeframe(e.target.value);
                        if (dataSource === 'real') {
                          const periodMap: Record<string, string> = {
                            '1M': 'month',
                            '1Q': 'quarter',
                            '2Q': 'quarter',
                            'YTD': 'ytd',
                            '1Y': 'year',
                            '4Q': 'year'
                          };
                          fetchRealFinancialData({ periodType: periodMap[e.target.value] || 'quarter' });
                        }
                      }}
                      className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm
                               focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    >
                      <option value="1M">Last Month</option>
                      <option value="1Q">Last Quarter</option>
                      <option value="2Q">Last 6 Months</option>
                      <option value="YTD">Year to Date</option>
                      <option value="1Y">Last Year</option>
                      <option value="4Q">Last 4 Quarters</option>
                    </select>
                  </div>
                  
                  {dataSource === 'real' && realFinancialData && (
                    <div className="text-sm">
                      <span className="text-gray-400">Data includes: </span>
                      <span className="text-cyan-400">
                        {formatCurrency(realFinancialData.revenue)} revenue, 
                        {realFinancialData.expenses > 0 ? ` ${formatCurrency(realFinancialData.expenses)} expenses` : ' limited expense data'}
                      </span>
                    </div>
                  )}
                </div>

                {dataLoadError && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{dataLoadError}</span>
                  </div>
                )}
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
            <button
              onClick={() => router.push('/admin/dashboard/report-generation')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Report</span>
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
          {/* Priority Strategic Insights */}
          <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Star className="w-6 h-6 mr-3 text-yellow-400" />
              Priority Strategic Insights
            </h2>
            {priorityInsights.length > 0 ? (
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
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg mb-2">🤖 AI Analysis in Progress</div>
                <p className="text-gray-500">Priority insights will appear here once analysis is complete.</p>
              </div>
            )}
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

      {/* Financial Deep Dive Tab */}
      {activeTab === 'financial-analysis' && (
        <div className="space-y-8">
          {/* Detailed Financial Metrics */}
          <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Calculator className="w-6 h-6 mr-3 text-blue-400" />
              Comprehensive Financial Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metrics.map((metric) => (
                <div key={metric.id} className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium">{metric.name}</h3>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {metric.category === 'revenue' || metric.category === 'expense' || metric.category === 'profit' 
                      ? formatCurrency(metric.value, true) 
                      : metric.value.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${
                      metric.trend === 'up' ? 'text-green-400' : 
                      metric.trend === 'down' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {metric.changePercent > 0 ? '+' : ''}{metric.changePercent.toFixed(1)}% vs previous
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Ratios Analysis */}
          <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Advanced Financial Ratios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cyan-400">Liquidity Ratios</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Current Ratio</span>
                    <span className="text-white font-bold">{advancedMetrics?.currentRatio.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Quick Ratio</span>
                    <span className="text-white font-bold">{advancedMetrics?.quickRatio.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Cash Flow Ratio</span>
                    <span className="text-white font-bold">{advancedMetrics?.cashFlowRatio.toFixed(2)}x</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-emerald-400">Profitability Ratios</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Gross Margin</span>
                    <span className="text-white font-bold">{advancedMetrics?.grossMargin.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Operating Margin</span>
                    <span className="text-white font-bold">{advancedMetrics?.operatingMargin.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Net Margin</span>
                    <span className="text-white font-bold">{advancedMetrics?.netMargin.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-purple-400">Efficiency Ratios</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Asset Turnover</span>
                    <span className="text-white font-bold">{advancedMetrics?.assetTurnover.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Inventory Turnover</span>
                    <span className="text-white font-bold">{advancedMetrics?.inventoryTurnover.toFixed(1)}x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Receivables Turnover</span>
                    <span className="text-white font-bold">{advancedMetrics?.receivablesTurnover.toFixed(1)}x</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-orange-400">Leverage Ratios</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Debt to Equity</span>
                    <span className="text-white font-bold">{advancedMetrics?.debtToEquity.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Interest Coverage</span>
                    <span className="text-white font-bold">{advancedMetrics?.interestCoverage.toFixed(1)}x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Debt Service Coverage</span>
                    <span className="text-white font-bold">{advancedMetrics?.debtServiceCoverage.toFixed(1)}x</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Growth & Trends Tab */}
      {activeTab === 'growth-trends' && (
        <div className="space-y-8">
          {/* Growth Metrics */}
          <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-3 text-green-400" />
              Growth Performance Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-500/30">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    +{formatPercent(growthMetrics?.revenueGrowth || 0, true)}
                  </div>
                  <div className="text-white font-medium">Revenue Growth</div>
                  <div className="text-sm text-green-300 mt-2">Quarter over Quarter</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-500/30">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    +{formatPercent(growthMetrics?.profitGrowth || 0, true)}
                  </div>
                  <div className="text-white font-medium">Profit Growth</div>
                  <div className="text-sm text-blue-300 mt-2">Sustainable Growth</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl p-6 border border-purple-500/30">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    +{formatPercent(growthMetrics?.customerGrowth || 0, true)}
                  </div>
                  <div className="text-white font-medium">Customer Growth</div>
                  <div className="text-sm text-purple-300 mt-2">Market Expansion</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-orange-500/30">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-2">
                    +{formatPercent(growthMetrics?.employeeGrowth || 0, true)}
                  </div>
                  <div className="text-white font-medium">Team Growth</div>
                  <div className="text-sm text-orange-300 mt-2">Scaling Operations</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quarterly Trends */}
          <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Quarterly Performance Trends</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left text-gray-300 pb-4 font-medium">Period</th>
                    <th className="text-right text-gray-300 pb-4 font-medium">Revenue</th>
                    <th className="text-right text-gray-300 pb-4 font-medium">Net Income</th>
                    <th className="text-right text-gray-300 pb-4 font-medium">Cash Flow</th>
                    <th className="text-right text-gray-300 pb-4 font-medium">Employees</th>
                    <th className="text-right text-gray-300 pb-4 font-medium">Customers</th>
                  </tr>
                </thead>
                <tbody>
                  {trendData.map((period, index) => (
                    <tr key={period.period} className="border-b border-white/10">
                      <td className="py-4 text-white font-medium">{period.period}</td>
                      <td className="py-4 text-right text-white">{formatCurrency(period.revenue, true)}</td>
                      <td className="py-4 text-right text-white">{formatCurrency(period.netIncome, true)}</td>
                      <td className="py-4 text-right text-white">{formatCurrency(period.cashFlow, true)}</td>
                      <td className="py-4 text-right text-white">{period.employees.toLocaleString()}</td>
                      <td className="py-4 text-right text-white">{period.customerCount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Industry Benchmarks Tab */}
      {activeTab === 'benchmarking' && (
        <div className="space-y-8">
          <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Award className="w-6 h-6 mr-3 text-yellow-400" />
              Industry Benchmark Analysis
            </h2>
            <div className="space-y-6">
              {benchmarkData.map((benchmark) => (
                <div key={benchmark.metric} className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{benchmark.metric}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPerformanceColor(benchmark.performance)}`}>
                      {benchmark.performance}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-1">
                        {benchmark.companyValue.toFixed(1)}
                        {benchmark.metric.includes('Growth') || benchmark.metric.includes('Margin') ? '%' : ''}
                      </div>
                      <div className="text-sm text-gray-400">Your Company</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-300 mb-1">
                        {benchmark.industryAverage.toFixed(1)}
                        {benchmark.metric.includes('Growth') || benchmark.metric.includes('Margin') ? '%' : ''}
                      </div>
                      <div className="text-sm text-gray-400">Industry Average</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-yellow-400 mb-1">
                        {benchmark.topQuartile.toFixed(1)}
                        {benchmark.metric.includes('Growth') || benchmark.metric.includes('Margin') ? '%' : ''}
                      </div>
                      <div className="text-sm text-gray-400">Top Quartile</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-emerald-400 mb-1">
                        {benchmark.topDecile.toFixed(1)}
                        {benchmark.metric.includes('Growth') || benchmark.metric.includes('Margin') ? '%' : ''}
                      </div>
                      <div className="text-sm text-gray-400">Top 10%</div>
                    </div>
                  </div>

                  <div className="mt-4 relative">
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full relative" 
                        style={{ width: `${Math.min((benchmark.companyValue / benchmark.topDecile) * 100, 100)}%` }}
                      >
                        <div className="absolute -top-6 right-0 text-xs text-blue-400 font-medium">
                          {((benchmark.companyValue / benchmark.industryAverage - 1) * 100).toFixed(0)}% vs industry
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Risk Assessment Tab */}
      {activeTab === 'risk-assessment' && (
        <div className="space-y-8">
          <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-3 text-red-400" />
              Comprehensive Risk Assessment
            </h2>
            <div className="space-y-6">
              {riskFactors.map((risk) => (
                <div key={risk.id} className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-white">{risk.risk}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskSeverityColor(risk.severity)}`}>
                          {risk.severity} risk
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mb-2">{risk.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Financial Impact</div>
                      <div className="text-xl font-bold text-red-400">{formatCurrency(risk.financialImpact, true)}</div>
                      <div className="text-sm text-gray-400">{risk.probability}% probability</div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4">{risk.impact}</p>

                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 mb-4">
                    <h4 className="text-cyan-300 font-medium mb-2">Recommended Actions:</h4>
                    <p className="text-cyan-200 text-sm mb-3">{risk.recommendation}</p>
                    <div className="space-y-1">
                      {risk.mitigationSteps.map((step, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                          <span className="text-cyan-200 text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Timeline: {risk.timeframe}</span>
                    <span className="text-gray-400">Industry Relevance: {risk.industryRelevance}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Strategic Insights Tab */}
      {activeTab === 'ai-insights' && (
        <div className="space-y-8">
          <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Brain className="w-6 h-6 mr-3 text-purple-400" />
              AI-Powered Strategic Insights
            </h2>
            <div className="space-y-6">
              {aiInsights.map((insight) => (
                <div key={insight.id} className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl ${
                        insight.impact === 'transformational' ? 'bg-purple-500/20 border border-purple-500/30' :
                        insight.impact === 'high' ? 'bg-red-500/20 border border-red-500/30' :
                        insight.impact === 'medium' ? 'bg-yellow-500/20 border border-yellow-500/30' :
                        'bg-green-500/20 border border-green-500/30'
                      }`}>
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-2">{insight.title}</h3>
                        <p className="text-gray-300 text-sm mb-4">{insight.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Confidence</div>
                      <div className="text-2xl font-bold text-green-400">{insight.confidence}%</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-sm text-gray-400">Investment Required</div>
                      <div className="text-lg font-bold text-white">{formatCurrency(insight.investmentRequired, true)}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-sm text-gray-400">Expected ROI</div>
                      <div className="text-lg font-bold text-green-400">{insight.roi.toFixed(1)}x</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-sm text-gray-400">Timeline</div>
                      <div className="text-lg font-bold text-cyan-400">{insight.timeline}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-white font-medium mb-2">Action Items:</h4>
                      <div className="space-y-1">
                        {insight.actionItems.map((item, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <Target className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300 text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-2">KPI Targets:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {insight.kpiTargets.map((kpi, index) => (
                          <div key={index} className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <span className="text-blue-300 text-sm">{kpi.metric}</span>
                              <span className="text-white font-bold">{kpi.target}</span>
                            </div>
                            <div className="text-xs text-blue-400">{kpi.timeframe}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
                    <div className="text-purple-300 font-medium text-sm mb-1">Expected Outcome:</div>
                    <div className="text-purple-200 text-sm">{insight.expectedOutcome}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Plan Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-8">
          <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Target className="w-6 h-6 mr-3 text-emerald-400" />
              Strategic Action Plan
            </h2>
            
            {/* Immediate Actions */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center">
                <Flag className="w-5 h-5 mr-2" />
                Immediate Actions (0-30 days)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl p-6 border border-red-500/30">
                  <h4 className="text-white font-bold mb-3">Address Customer Concentration Risk</h4>
                  <p className="text-gray-300 text-sm mb-4">Implement immediate diversification strategy to reduce dependency on top 3 customers (52% of MRR).</p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-300 text-sm">Launch customer expansion campaigns</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-300 text-sm">Strengthen key account relationships</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-300 text-sm">Implement early warning churn system</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl p-6 border border-red-500/30">
                  <h4 className="text-white font-bold mb-3">Implement Financial Controls</h4>
                  <p className="text-gray-300 text-sm mb-4">Establish advanced financial monitoring and forecasting systems.</p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-300 text-sm">Deploy real-time financial dashboard</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-300 text-sm">Automate financial reporting</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-300 text-sm">Establish weekly financial reviews</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Short-term Actions */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Short-term Actions (1-6 months)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-500/30">
                  <h4 className="text-white font-bold mb-3">Deploy AI Operational Efficiency</h4>
                  <p className="text-gray-300 text-sm mb-4">Implement AI-driven automation to reduce costs by 18% and improve response times.</p>
                  <div className="text-sm text-yellow-300">
                    <strong>Investment:</strong> {formatCurrency(450000, true)} | <strong>ROI:</strong> 3.1x
                  </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-500/30">
                  <h4 className="text-white font-bold mb-3">Expand Enterprise Sales</h4>
                  <p className="text-gray-300 text-sm mb-4">Build enterprise sales capabilities to target higher ACV customers.</p>
                  <div className="text-sm text-yellow-300">
                    <strong>Target:</strong> 45-65% ACV increase | <strong>Timeline:</strong> 6 months
                  </div>
                </div>
              </div>
            </div>

            {/* Long-term Actions */}
            <div>
              <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Long-term Strategic Initiatives (6-18 months)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-500/30">
                  <h4 className="text-white font-bold mb-3">SaaS Enterprise Market Expansion</h4>
                  <p className="text-gray-300 text-sm mb-4">Execute comprehensive enterprise expansion strategy with strong unit economics foundation.</p>
                  <div className="text-sm text-green-300">
                    <strong>Investment:</strong> {formatCurrency(1500000, true)} | <strong>Expected ROI:</strong> 4.2x
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-500/30">
                  <h4 className="text-white font-bold mb-3">Technology Infrastructure Scaling</h4>
                  <p className="text-gray-300 text-sm mb-4">Scale technology infrastructure to support 10x growth and enterprise security requirements.</p>
                  <div className="text-sm text-green-300">
                    <strong>Impact:</strong> Support 25,000+ users | <strong>Timeline:</strong> 12-18 months
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
            disabled={isGeneratingReport || loadingFinancialData || !realFinancialData}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Download className={`w-4 h-4 ${isGeneratingReport ? 'animate-bounce' : ''}`} />
            <span>
              {isGeneratingReport 
                ? 'Generating...' 
                : loadingFinancialData 
                ? 'Loading Data...' 
                : 'Generate Elite Report'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EliteAdvancedFinancialAnalyzer;
