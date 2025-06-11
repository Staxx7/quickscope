'use client'
import React, { useState, useEffect, Suspense, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  BarChart3, TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle,
  CheckCircle, Activity, Calendar, RefreshCw, ArrowLeft, Eye, Download,
  PieChart, LineChart, Zap, Building2, CreditCard, Percent, Calculator,
  Shield, Award, Clock, Users, Globe, Brain, Search, Filter, Settings,
  FileText, Bookmark, Share2, Bell, Info, ExternalLink, Briefcase,
  TrendingDown as Decline, ArrowUp, ArrowDown, Minus, Plus,
  PlayCircle, PauseCircle, RotateCcw, Maximize2, MinusCircle,
  Star, Flag, MessageSquare, ThumbsUp, ThumbsDown, HelpCircle
} from 'lucide-react';
import { NextPage } from 'next';

// Enhanced interfaces with more comprehensive data structures
interface FinancialMetrics {
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

interface AIInsight {
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

interface ConnectedAccount {
  id: string;
  companyName: string;
  industry: string;
  subIndustry: string;
  lastAnalysis: string;
  connectionStatus: 'active' | 'warning' | 'error';
  dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
  completeness: number;
  size: 'enterprise' | 'mid-market' | 'small' | 'startup';
  geography: string;
  fiscalYearEnd: string;
  currency: string;
  employees: number;
  revenue: number;
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

interface CompetitiveIntel {
  competitor: string;
  metric: string;
  theirValue: number;
  ourValue: number;
  gap: number;
  source: string;
  lastUpdated: string;
}

function AdvancedAnalysisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountParam = searchParams?.get('account');

  // Enhanced state management
  const [selectedAccount, setSelectedAccount] = useState<string>(accountParam || '1');
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [activeTab, setActiveTab] = useState('executive-summary');
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [financialMetrics, setFinancialMetrics] = useState<FinancialMetrics | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData[]>([]);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([]);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [competitiveData, setCompetitiveData] = useState<CompetitiveIntel[]>([]);
  const [viewMode, setViewMode] = useState<'summary' | 'detailed' | 'executive'>('summary');
  const [timeRange, setTimeRange] = useState<'1Q' | '4Q' | '1Y' | '3Y' | '5Y'>('4Q');
  const [comparisonMode, setComparisonMode] = useState<'industry' | 'peer' | 'historical'>('industry');

  // Enhanced data generation with more sophisticated metrics
  const getAdvancedMetricsForAccount = useCallback((accountId: string) => {
    const accountMetrics = {
      '1': { // TechCorp Solutions - SaaS Company
        healthScore: 78,
        liquidityRatio: 2.1,
        profitMargin: 24.1,
        grossMargin: 82.3,
        operatingMargin: 28.5,
        netMargin: 24.1,
        debtToEquity: 0.45,
        returnOnAssets: 12.3,
        returnOnEquity: 18.7,
        workingCapital: 850000,
        cashFlowRatio: 1.8,
        quickRatio: 1.9,
        currentRatio: 2.1,
        inventoryTurnover: 24.5, // High for SaaS
        receivablesTurnover: 8.1,
        assetTurnover: 1.4,
        ebitda: 3200000,
        freeCashFlow: 2800000,
        cashConversionCycle: 15, // Days
        debtServiceCoverage: 4.2,
        interestCoverage: 12.5,
        equityMultiplier: 1.52,
        priceToBook: 3.8,
        workingCapitalRatio: 0.31,
        industry: 'Technology',
        size: 'mid-market' as const
      },
      '2': { // Global Manufacturing Inc
        healthScore: 82,
        liquidityRatio: 1.8,
        profitMargin: 18.3,
        grossMargin: 35.2,
        operatingMargin: 22.1,
        netMargin: 18.3,
        debtToEquity: 0.52,
        returnOnAssets: 14.1,
        returnOnEquity: 22.3,
        workingCapital: 1200000,
        cashFlowRatio: 2.1,
        quickRatio: 1.6,
        currentRatio: 1.8,
        inventoryTurnover: 4.8,
        receivablesTurnover: 6.2,
        assetTurnover: 1.8,
        ebitda: 6800000,
        freeCashFlow: 5200000,
        cashConversionCycle: 65,
        debtServiceCoverage: 3.8,
        interestCoverage: 8.9,
        equityMultiplier: 1.89,
        priceToBook: 2.1,
        workingCapitalRatio: 0.28,
        industry: 'Manufacturing',
        size: 'enterprise' as const
      },
      '3': { // Healthcare Plus
        healthScore: 75,
        liquidityRatio: 2.3,
        profitMargin: 16.8,
        grossMargin: 68.4,
        operatingMargin: 19.2,
        netMargin: 16.8,
        debtToEquity: 0.38,
        returnOnAssets: 10.9,
        returnOnEquity: 15.8,
        workingCapital: 650000,
        cashFlowRatio: 1.5,
        quickRatio: 2.1,
        currentRatio: 2.3,
        inventoryTurnover: 8.1,
        receivablesTurnover: 9.3,
        assetTurnover: 1.1,
        ebitda: 4200000,
        freeCashFlow: 3600000,
        cashConversionCycle: 42,
        debtServiceCoverage: 5.1,
        interestCoverage: 15.2,
        equityMultiplier: 1.45,
        priceToBook: 2.8,
        workingCapitalRatio: 0.35,
        industry: 'Healthcare',
        size: 'mid-market' as const
      }
    };

    return accountMetrics[accountId as keyof typeof accountMetrics] || accountMetrics['1'];
  }, []);

  // Enhanced trend data with more comprehensive metrics
  const getEnhancedTrendData = useCallback((accountId: string) => {
    const trendData = {
      '1': [ // TechCorp - SaaS Growth Story
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
      ],
      '2': [ // Manufacturing - Operational Excellence
        { 
          period: 'Q1 2024', 
          revenue: 4200000, 
          expenses: 3570000, 
          netIncome: 630000, 
          cashFlow: 720000,
          grossProfit: 1478400,
          operatingIncome: 928200,
          ebitda: 1100000,
          totalAssets: 28500000,
          totalLiabilities: 15200000,
          equity: 13300000,
          freeCashFlow: 520000,
          capex: 200000,
          employees: 387,
          customerCount: 156
        },
        { 
          period: 'Q2 2024', 
          revenue: 4680000, 
          expenses: 3950000, 
          netIncome: 730000, 
          cashFlow: 820000,
          grossProfit: 1647360,
          operatingIncome: 1034280,
          ebitda: 1225000,
          totalAssets: 29200000,
          totalLiabilities: 15600000,
          equity: 13600000,
          freeCashFlow: 620000,
          capex: 220000,
          employees: 394,
          customerCount: 162
        },
        { 
          period: 'Q3 2024', 
          revenue: 4950000, 
          expenses: 4180000, 
          netIncome: 770000, 
          cashFlow: 890000,
          grossProfit: 1742400,
          operatingIncome: 1094950,
          ebitda: 1295000,
          totalAssets: 29800000,
          totalLiabilities: 15800000,
          equity: 14000000,
          freeCashFlow: 670000,
          capex: 240000,
          employees: 401,
          customerCount: 168
        },
        { 
          period: 'Q4 2024', 
          revenue: 5200000, 
          expenses: 4420000, 
          netIncome: 780000, 
          cashFlow: 920000,
          grossProfit: 1830400,
          operatingIncome: 1149600,
          ebitda: 1360000,
          totalAssets: 30500000,
          totalLiabilities: 16000000,
          equity: 14500000,
          freeCashFlow: 680000,
          capex: 260000,
          employees: 408,
          customerCount: 174
        }
      ],
      '3': [ // Healthcare - Regulated Growth
        { 
          period: 'Q1 2024', 
          revenue: 2800000, 
          expenses: 2380000, 
          netIncome: 420000, 
          cashFlow: 480000,
          grossProfit: 1915200,
          operatingIncome: 537600,
          ebitda: 620000,
          totalAssets: 12500000,
          totalLiabilities: 4800000,
          equity: 7700000,
          freeCashFlow: 380000,
          capex: 100000,
          employees: 234,
          customerCount: 2847
        },
        { 
          period: 'Q2 2024', 
          revenue: 3100000, 
          expenses: 2650000, 
          netIncome: 450000, 
          cashFlow: 520000,
          grossProfit: 2120400,
          operatingIncome: 595200,
          ebitda: 685000,
          totalAssets: 13100000,
          totalLiabilities: 5000000,
          equity: 8100000,
          freeCashFlow: 420000,
          capex: 110000,
          employees: 241,
          customerCount: 3102
        },
        { 
          period: 'Q3 2024', 
          revenue: 3350000, 
          expenses: 2870000, 
          netIncome: 480000, 
          cashFlow: 550000,
          grossProfit: 2291400,
          operatingIncome: 643200,
          ebitda: 740000,
          totalAssets: 13600000,
          totalLiabilities: 5200000,
          equity: 8400000,
          freeCashFlow: 450000,
          capex: 120000,
          employees: 248,
          customerCount: 3389
        },
        { 
          period: 'Q4 2024', 
          revenue: 3600000, 
          expenses: 3080000, 
          netIncome: 520000, 
          cashFlow: 580000,
          grossProfit: 2462400,
          operatingIncome: 691200,
          ebitda: 795000,
          totalAssets: 14200000,
          totalLiabilities: 5400000,
          equity: 8800000,
          freeCashFlow: 480000,
          capex: 130000,
          employees: 255,
          customerCount: 3698
        }
      ]
    };
    
    return trendData[accountId as keyof typeof trendData] || trendData['1'];
  }, []);

  // Enhanced AI insights with sophisticated analysis
  const getEliteAIInsights = useCallback((accountId: string) => {
    const insights = {
      '1': [ // TechCorp - SaaS Insights
        {
          id: '1-opp-1',
          type: 'opportunity' as const,
          title: 'SaaS Expansion into Enterprise Market',
          description: 'Strong unit economics (LTV:CAC of 4.2:1) and 127% net revenue retention indicate readiness for enterprise expansion. Current ACV of $18.6K suggests significant upmarket opportunity.',
          confidence: 89,
          impact: 'transformational' as const,
          timeline: '6-12 months',
          actionItems: [
            'Hire enterprise sales team (3-5 AEs)',
            'Develop enterprise security features (SOC2 Type II)',
            'Build customer success for enterprise accounts',
            'Create tiered pricing with enterprise tier'
          ],
          expectedOutcome: 'Increase ACV by 40-60% and expand TAM by $25M',
          investmentRequired: 1200000,
          roi: 3.8,
          kpiTargets: [
            { metric: 'Enterprise MRR', target: 150000, timeframe: '12 months' },
            { metric: 'Average Contract Value', target: 28000, timeframe: '12 months' },
            { metric: 'Enterprise NPS', target: 65, timeframe: '12 months' }
          ],
          dataPoints: ['Customer concentration analysis', 'Competitive pricing study', 'Product-market fit surveys'],
          priority: 1
        },
        {
          id: '1-warn-1',
          type: 'warning' as const,
          title: 'Customer Concentration Risk',
          description: 'Top 3 customers represent 47% of MRR. Typical SaaS benchmark is <20% for risk mitigation.',
          confidence: 94,
          impact: 'high' as const,
          timeline: 'Immediate',
          actionItems: [
            'Implement customer diversification strategy',
            'Expand into adjacent market segments',
            'Strengthen retention programs for key accounts',
            'Develop early warning system for churn risk'
          ],
          expectedOutcome: 'Reduce concentration to <25% within 18 months',
          investmentRequired: 300000,
          roi: 2.1,
          kpiTargets: [
            { metric: 'Customer Concentration', target: 25, timeframe: '18 months' },
            { metric: 'Churn Rate', target: 3.5, timeframe: '12 months' }
          ],
          dataPoints: ['Customer cohort analysis', 'Churn prediction modeling', 'Market segmentation study'],
          priority: 2
        }
      ],
      '2': [ // Manufacturing - Operational Excellence
        {
          id: '2-opp-1',
          type: 'opportunity' as const,
          title: 'Supply Chain Digitization Initiative',
          description: 'Current inventory turnover of 4.8x is above industry average but digital transformation could achieve 6.2x through predictive analytics and IoT integration.',
          confidence: 85,
          impact: 'high' as const,
          timeline: '12-18 months',
          actionItems: [
            'Implement IoT sensors across production line',
            'Deploy predictive maintenance system',
            'Integrate supplier management platform',
            'Train operations team on digital tools'
          ],
          expectedOutcome: 'Reduce inventory holding costs by 18% and improve OEE to 87%',
          investmentRequired: 2800000,
          roi: 2.4,
          kpiTargets: [
            { metric: 'Inventory Turnover', target: 6.2, timeframe: '18 months' },
            { metric: 'OEE', target: 87, timeframe: '18 months' },
            { metric: 'Supply Chain Visibility', target: 95, timeframe: '12 months' }
          ],
          dataPoints: ['Production efficiency analysis', 'Supplier performance metrics', 'Industry 4.0 readiness assessment'],
          priority: 1
        }
      ],
      '3': [ // Healthcare - Compliance & Growth
        {
          id: '3-rec-1',
          type: 'recommendation' as const,
          title: 'Value-Based Care Contract Expansion',
          description: 'Current fee-for-service model at 73% vs industry shift to value-based care. Strong quality metrics (4.8/5 patient satisfaction) position for premium contracts.',
          confidence: 91,
          impact: 'transformational' as const,
          timeline: '9-15 months',
          actionItems: [
            'Develop population health analytics platform',
            'Hire value-based care specialist',
            'Create quality reporting dashboard',
            'Negotiate pilot contracts with 2-3 payers'
          ],
          expectedOutcome: 'Increase reimbursement rates by 12-15% and improve margin stability',
          investmentRequired: 1500000,
          roi: 3.2,
          kpiTargets: [
            { metric: 'Value-Based Contract %', target: 40, timeframe: '18 months' },
            { metric: 'Quality Score', target: 92, timeframe: '12 months' },
            { metric: 'Patient Satisfaction', target: 4.9, timeframe: '12 months' }
          ],
          dataPoints: ['Payer contract analysis', 'Quality metrics benchmarking', 'Population health data'],
          priority: 1
        }
      ]
    };
    
    return insights[accountId as keyof typeof insights] || insights['1'];
  }, []);

  // Enhanced risk assessment with quantitative modeling
  const getAdvancedRiskFactors = useCallback((accountId: string) => {
    const riskData = {
      '1': [
        {
          id: 'tech-1',
          category: 'Technology & Product Risk',
          risk: 'API Rate Limiting Impact on Growth',
          severity: 'medium' as const,
          probability: 35,
          impact: 'Current API infrastructure may limit customer acquisition beyond 2,000 active users',
          financialImpact: 850000,
          timeframe: '6-9 months',
          recommendation: 'Implement microservices architecture and CDN optimization',
          mitigationSteps: [
            'Conduct infrastructure audit',
            'Implement API gateway with rate limiting',
            'Deploy auto-scaling infrastructure',
            'Create performance monitoring dashboard'
          ],
          kpiImpact: ['Customer Acquisition Rate', 'System Uptime', 'API Response Time'],
          industryRelevance: 85,
          regulatoryRisk: false
        },
        {
          id: 'market-1',
          category: 'Market & Competitive Risk',
          risk: 'Enterprise Competitor Market Entry',
          severity: 'high' as const,
          probability: 72,
          impact: 'Major enterprise software vendor launching competing product Q3 2025',
          financialImpact: 2300000,
          timeframe: '12-15 months',
          recommendation: 'Accelerate enterprise feature development and secure key accounts',
          mitigationSteps: [
            'Fast-track enterprise security certifications',
            'Lock in key customers with multi-year contracts',
            'Enhance product differentiation features',
            'Strengthen customer success and retention programs'
          ],
          kpiImpact: ['Customer Churn Rate', 'Average Contract Value', 'Market Share'],
          industryRelevance: 95,
          regulatoryRisk: false
        }
      ],
      '2': [
        {
          id: 'supply-1',
          category: 'Supply Chain & Operations',
          risk: 'Single-Source Supplier Dependency',
          severity: 'critical' as const,
          probability: 28,
          impact: 'Primary steel supplier represents 67% of raw material needs',
          financialImpact: 4200000,
          timeframe: 'Immediate',
          recommendation: 'Diversify supplier base and increase strategic inventory',
          mitigationSteps: [
            'Identify and qualify 2-3 alternative suppliers',
            'Negotiate volume-based contracts with backup suppliers',
            'Increase safety stock levels to 45-day supply',
            'Implement supplier risk monitoring system'
          ],
          kpiImpact: ['Production Uptime', 'Cost of Goods Sold', 'Inventory Turnover'],
          industryRelevance: 90,
          regulatoryRisk: false
        }
      ],
      '3': [
        {
          id: 'reg-1',
          category: 'Regulatory & Compliance',
          risk: 'CMS Reimbursement Rate Changes',
          severity: 'high' as const,
          probability: 85,
          impact: 'Proposed 3.2% reduction in Medicare reimbursement rates for 2025',
          financialImpact: 680000,
          timeframe: '6 months',
          recommendation: 'Diversify payer mix and improve operational efficiency',
          mitigationSteps: [
            'Negotiate higher rates with commercial payers',
            'Implement cost reduction initiatives',
            'Expand value-based care contracts',
            'Optimize revenue cycle management'
          ],
          kpiImpact: ['Operating Margin', 'Payer Mix', 'Days Sales Outstanding'],
          industryRelevance: 100,
          regulatoryRisk: true
        }
      ]
    };
    
    return riskData[accountId as keyof typeof riskData] || riskData['1'];
  }, []);

  // Data loading with enhanced error handling and caching
  const loadAnalysisData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const mockAccounts: ConnectedAccount[] = [
        { 
          id: '1', 
          companyName: 'TechCorp Solutions', 
          industry: 'Technology',
          subIndustry: 'SaaS Software',
          lastAnalysis: '2024-06-09T08:30:00Z',
          connectionStatus: 'active',
          dataQuality: 'excellent',
          completeness: 98,
          size: 'mid-market',
          geography: 'North America',
          fiscalYearEnd: 'December 31',
          currency: 'USD',
          employees: 148,
          revenue: 10760000
        },
        { 
          id: '2', 
          companyName: 'Global Manufacturing Inc', 
          industry: 'Manufacturing',
          subIndustry: 'Industrial Equipment',
          lastAnalysis: '2024-06-09T06:15:00Z',
          connectionStatus: 'active',
          dataQuality: 'good',
          completeness: 95,
          size: 'enterprise',
          geography: 'Global',
          fiscalYearEnd: 'December 31',
          currency: 'USD',
          employees: 408,
          revenue: 19030000
        },
        { 
          id: '3', 
          companyName: 'Healthcare Plus', 
          industry: 'Healthcare',
          subIndustry: 'Medical Services',
          lastAnalysis: '2024-06-09T07:45:00Z',
          connectionStatus: 'warning',
          dataQuality: 'fair',
          completeness: 87,
          size: 'mid-market',
          geography: 'North America',
          fiscalYearEnd: 'June 30',
          currency: 'USD',
          employees: 255,
          revenue: 12850000
        }
      ];

      const currentAccount = mockAccounts.find(acc => acc.id === selectedAccount) || mockAccounts[0];
      const mockMetrics = getAdvancedMetricsForAccount(selectedAccount);
      const mockTrendData = getEnhancedTrendData(selectedAccount);
      const mockAIInsights = getEliteAIInsights(selectedAccount);
      const mockRiskFactors = getAdvancedRiskFactors(selectedAccount);
      
      // Enhanced benchmark data with industry-specific comparisons
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
          companyValue: mockMetrics?.grossMargin || 82.3, 
          industryAverage: currentAccount.industry === 'Technology' ? 75.2 : 
                          currentAccount.industry === 'Manufacturing' ? 32.1 : 65.8, 
          topQuartile: currentAccount.industry === 'Technology' ? 82.0 : 
                      currentAccount.industry === 'Manufacturing' ? 38.5 : 72.3,
          topDecile: currentAccount.industry === 'Technology' ? 87.5 : 
                    currentAccount.industry === 'Manufacturing' ? 42.1 : 78.9,
          performance: 'excellent',
          trend: 'stable',
          priority: 'medium'
        },
        { 
          metric: 'Operating Margin', 
          companyValue: mockMetrics?.operatingMargin || 28.5, 
          industryAverage: currentAccount.industry === 'Technology' ? 22.1 : 
                          currentAccount.industry === 'Manufacturing' ? 15.8 : 18.9, 
          topQuartile: currentAccount.industry === 'Technology' ? 28.0 : 
                      currentAccount.industry === 'Manufacturing' ? 22.5 : 25.1,
          topDecile: currentAccount.industry === 'Technology' ? 35.2 : 
                    currentAccount.industry === 'Manufacturing' ? 28.9 : 32.4,
          performance: 'excellent',
          trend: 'improving',
          priority: 'high'
        },
        { 
          metric: 'Current Ratio', 
          companyValue: mockMetrics?.currentRatio || 2.1, 
          industryAverage: 1.8, 
          topQuartile: 2.3,
          topDecile: 2.8,
          performance: 'above-average',
          trend: 'stable',
          priority: 'medium'
        },
        { 
          metric: 'Return on Assets', 
          companyValue: mockMetrics?.returnOnAssets || 12.3, 
          industryAverage: 8.9, 
          topQuartile: 15.2,
          topDecile: 22.1,
          performance: 'above-average',
          trend: 'improving',
          priority: 'high'
        }
      ];

      // Performance alerts
      const mockAlerts: PerformanceAlert[] = [
        {
          id: 'alert-1',
          type: 'warning',
          title: 'Customer Acquisition Cost Trending Up',
          message: 'CAC increased 23% QoQ, now $1,247 vs target of $950',
          metric: 'Customer Acquisition Cost',
          change: 23.4,
          threshold: 15.0,
          timestamp: '2024-06-09T10:30:00Z',
          acknowledged: false
        },
        {
          id: 'alert-2',
          type: 'success',
          title: 'Net Revenue Retention Above Target',
          message: 'NRR reached 127% vs target of 115%',
          metric: 'Net Revenue Retention',
          change: 10.4,
          threshold: 115.0,
          timestamp: '2024-06-09T09:15:00Z',
          acknowledged: true
        }
      ];

      setAccounts(mockAccounts);
      setFinancialMetrics(mockMetrics);
      setTrendData(mockTrendData);
      setBenchmarkData(mockBenchmarkData);
      setRiskFactors(mockRiskFactors);
      setAIInsights(mockAIInsights);
      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Failed to load analysis data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedAccount, getAdvancedMetricsForAccount, getEnhancedTrendData, getEliteAIInsights, getAdvancedRiskFactors]);

  // Effects
  useEffect(() => {
    loadAnalysisData();
  }, [loadAnalysisData]);

  useEffect(() => {
    if (accountParam && accountParam !== selectedAccount) {
      setSelectedAccount(accountParam);
    }
  }, [accountParam, selectedAccount]);

  // Utility functions
  const getHealthScoreColor = useCallback((score: number) => {
    if (score >= 85) return 'text-emerald-400';
    if (score >= 75) return 'text-green-400';
    if (score >= 65) return 'text-yellow-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  }, []);

  const getPerformanceColor = useCallback((performance: string) => {
    const colors = {
      'excellent': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'above-average': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'average': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'below-average': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'poor': 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[performance as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }, []);

  const getRiskSeverityColor = useCallback((severity: string) => {
    const colors = {
      'critical': 'bg-red-600/30 text-red-300 border-red-500/50',
      'high': 'bg-red-500/20 text-red-400 border-red-500/30',
      'medium': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'low': 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }, []);

  const getInsightTypeIcon = useCallback((type: string) => {
    const icons = {
      'opportunity': TrendingUp,
      'concern': AlertTriangle,
      'trend': BarChart3,
      'recommendation': Target,
      'warning': Flag,
      'growth': ArrowUp
    };
    return icons[type as keyof typeof icons] || Info;
  }, []);

  const formatCurrency = useCallback((value: number, compact = false) => {
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
  }, []);

  const formatPercentage = useCallback((value: number, decimals = 1) => {
    return `${value.toFixed(decimals)}%`;
  }, []);

  const formatNumber = useCallback((value: number, decimals = 1) => {
    return value.toLocaleString('en-US', { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    });
  }, []);

  // Memoized calculations
  const currentAccount = useMemo(() => 
    accounts.find(acc => acc.id === selectedAccount) || accounts[0],
    [accounts, selectedAccount]
  );

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900 flex items-center justify-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-12 text-center max-w-md">
          <div className="relative">
            <RefreshCw className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-6" />
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-pulse"></div>
          </div>
          <h2 className="text-2xl font-medium text-white mb-3">Analyzing Financial Data</h2>
          <p className="text-gray-300 mb-4">Generating comprehensive insights and recommendations...</p>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900 p-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
      
      {/* Enhanced Header with Account Context */}
      <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Advanced Financial Analysis</h1>
                <p className="text-gray-300">Elite-level AI-powered insights and strategic recommendations</p>
              </div>
            </div>
            
            {currentAccount && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-gray-400 text-sm">Company</div>
                  <div className="text-white font-medium">{currentAccount.companyName}</div>
                  <div className="text-gray-500 text-xs">{currentAccount.subIndustry}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-gray-400 text-sm">Annual Revenue</div>
                  <div className="text-white font-medium">{formatCurrency(currentAccount.revenue, true)}</div>
                  <div className="text-gray-500 text-xs">{currentAccount.employees} employees</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-gray-400 text-sm">Data Quality</div>
                  <div className={`font-medium ${
                    currentAccount.dataQuality === 'excellent' ? 'text-green-400' :
                    currentAccount.dataQuality === 'good' ? 'text-blue-400' :
                    currentAccount.dataQuality === 'fair' ? 'text-yellow-400' : 'text-red-400'
                  }`}>{currentAccount.dataQuality}</div>
                  <div className="text-gray-500 text-xs">{currentAccount.completeness}% complete</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-gray-400 text-sm">Last Analysis</div>
                  <div className="text-white font-medium">
                    {new Date(currentAccount.lastAnalysis).toLocaleDateString()}
                  </div>
                  <div className={`text-xs ${
                    currentAccount.connectionStatus === 'active' ? 'text-green-400' :
                    currentAccount.connectionStatus === 'warning' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {currentAccount.connectionStatus}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedAccount}
              onChange={(e) => {
                setSelectedAccount(e.target.value);
                setIsLoading(true);
                setTimeout(() => {
                  loadAnalysisData();
                }, 300);
              }}
              className="px-4 py-3 bg-white/10 border border-white/25 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
            >
              {accounts.map(account => (
                <option key={account.id} value={account.id} className="bg-slate-800 text-white">
                  {account.companyName}
                </option>
              ))}
            </select>
            
            <button 
              onClick={() => router.push('/admin/dashboard/main')}
              className="bg-white/10 backdrop-blur-sm border border-white/25 text-white px-6 py-3 rounded-xl hover:bg-white/15 transition-all duration-200 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
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
                <div className={`text-7xl font-bold mb-4 ${getHealthScoreColor(financialMetrics?.healthScore || 0)}`}>
                  {financialMetrics?.healthScore || 0}
                </div>
                <div className="text-gray-300 text-lg">out of 100</div>
                <div className="mt-6 relative">
                  <div className="w-full bg-white/10 rounded-full h-4">
                    <div 
                      className={`h-4 rounded-full transition-all duration-1000 ${
                        (financialMetrics?.healthScore || 0) >= 85 ? 'bg-gradient-to-r from-emerald-500 to-green-400' :
                        (financialMetrics?.healthScore || 0) >= 75 ? 'bg-gradient-to-r from-green-500 to-lime-400' :
                        (financialMetrics?.healthScore || 0) >= 65 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' :
                        'bg-gradient-to-r from-red-500 to-pink-400'
                      }`}
                      style={{ width: `${financialMetrics?.healthScore || 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
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
                  <span className="text-green-400 font-medium">Strong</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Leverage</span>
                  <span className="text-blue-400 font-medium">Conservative</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Efficiency</span>
                  <span className="text-yellow-400 font-medium">Good</span>
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
                  {growthMetrics ? `+${formatPercentage(growthMetrics.revenueGrowth, 1)}` : 'N/A'}
                </div>
                <div className="text-sm text-green-400">QoQ Growth</div>
              </div>
              
              <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300">Gross Margin</span>
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {formatPercentage(financialMetrics?.grossMargin || 0)}
                </div>
                <div className="text-sm text-blue-400">Industry Leading</div>
              </div>
              
              <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300">Free Cash Flow</span>
                  <DollarSign className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {formatCurrency(financialMetrics?.freeCashFlow || 0, true)}
                </div>
                <div className="text-sm text-cyan-400">Strong Generation</div>
              </div>
              
              <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300">Current Ratio</span>
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {formatNumber(financialMetrics?.currentRatio || 0)}
                </div>
                <div className="text-sm text-green-400">Well Capitalized</div>
              </div>
              
              <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300">ROA</span>
                  <Award className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {formatPercentage(financialMetrics?.returnOnAssets || 0)}
                </div>
                <div className="text-sm text-purple-400">Above Average</div>
              </div>
              
              <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300">Debt/Equity</span>
                  <Activity className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {formatNumber(financialMetrics?.debtToEquity || 0)}
                </div>
                <div className="text-sm text-yellow-400">Conservative</div>
              </div>
            </div>
            
            {/* Quick Growth Metrics */}
            {growthMetrics && (
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    +{formatPercentage(growthMetrics.revenueGrowth, 0)}
                  </div>
                  <div className="text-sm text-gray-400">Revenue Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    +{formatPercentage(growthMetrics.profitGrowth, 0)}
                  </div>
                  <div className="text-sm text-gray-400">Profit Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">
                    +{formatPercentage(growthMetrics.customerGrowth, 0)}
                  </div>
                  <div className="text-sm text-gray-400">Customer Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    +{formatPercentage(growthMetrics.employeeGrowth, 0)}
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

      {/* Executive Summary Tab */}
      {activeTab === 'executive-summary' && (
        <div className="space-y-8">
          {/* Priority Insights */}
          <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Star className="w-6 h-6 mr-3 text-yellow-400" />
              Priority Strategic Insights
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {priorityInsights.map((insight) => {
                const IconComponent = getInsightTypeIcon(insight.type);
                return (
                  <div key={insight.id} className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl ${
                        insight.impact === 'transformational' ? 'bg-purple-500/20 border border-purple-500/30' :
                        insight.impact === 'high' ? 'bg-red-500/20 border border-red-500/30' :
                        insight.impact === 'medium' ? 'bg-yellow-500/20 border border-yellow-500/30' :
                        'bg-green-500/20 border border-green-500/30'
                      }`}>
                        <IconComponent className="w-6 h-6 text-white" />
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
                );
              })}
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

          {/* Key Performance Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
              <h3 className="text-xl font-bold text-white mb-6">Performance Highlights</h3>
              <div className="space-y-4">
                {benchmarkData.filter(b => b.performance === 'excellent' || b.performance === 'above-average').slice(0, 4).map((benchmark, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{benchmark.metric}</div>
                      <div className="text-sm text-gray-400">vs Industry Average</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        benchmark.performance === 'excellent' ? 'text-green-400' : 'text-blue-400'
                      }`}>
                        {benchmark.metric.includes('%') || benchmark.metric.includes('Ratio') 
                          ? formatPercentage(benchmark.companyValue) 
                          : formatNumber(benchmark.companyValue)}
                      </div>
                      <div className="text-sm text-green-400">
                        +{((benchmark.companyValue - benchmark.industryAverage) / benchmark.industryAverage * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
              <h3 className="text-xl font-bold text-white mb-6">Quarterly Momentum</h3>
              {trendData.length >= 2 && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Revenue Trajectory</span>
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-green-400 mt-2">
                      {formatCurrency(trendData[trendData.length - 1].revenue, true)}
                    </div>
                    <div className="text-sm text-green-300">
                      +{growthMetrics ? formatPercentage(growthMetrics.revenueGrowth, 0) : '0%'} QoQ
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Profit Growth</span>
                      <ArrowUp className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-blue-400 mt-2">
                      {formatCurrency(trendData[trendData.length - 1].netIncome, true)}
                    </div>
                    <div className="text-sm text-blue-300">
                      +{growthMetrics ? formatPercentage(growthMetrics.profitGrowth, 0) : '0%'} QoQ
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Cash Generation</span>
                      <DollarSign className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-purple-400 mt-2">
                      {formatCurrency(trendData[trendData.length - 1].freeCashFlow, true)}
                    </div>
                    <div className="text-sm text-purple-300">Free Cash Flow</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Financial Analysis Tab */}
      {activeTab === 'financial-analysis' && (
        <div className="space-y-8">
          {/* Comprehensive Financial Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-400" />
                Liquidity Analysis
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Current Ratio</span>
                  <span className="text-white font-bold">{formatNumber(financialMetrics?.currentRatio || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Quick Ratio</span>
                  <span className="text-white font-bold">{formatNumber(financialMetrics?.quickRatio || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Cash Flow Ratio</span>
                  <span className="text-white font-bold">{formatNumber(financialMetrics?.cashFlowRatio || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Working Capital</span>
                  <span className="text-white font-bold">{formatCurrency(financialMetrics?.workingCapital || 0, true)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Cash Conversion Cycle</span>
                  <span className="text-white font-bold">{financialMetrics?.cashConversionCycle || 0} days</span>
                </div>
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <p className="text-blue-300 text-sm">
                    <strong>Assessment:</strong> Excellent liquidity position with ratios significantly above industry benchmarks. Strong cash management capabilities.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                Profitability Analysis
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Gross Margin</span>
                  <span className="text-white font-bold">{formatPercentage(financialMetrics?.grossMargin || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Operating Margin</span>
                  <span className="text-white font-bold">{formatPercentage(financialMetrics?.operatingMargin || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Net Margin</span>
                  <span className="text-white font-bold">{formatPercentage(financialMetrics?.netMargin || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Return on Assets</span>
                  <span className="text-white font-bold">{formatPercentage(financialMetrics?.returnOnAssets || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Return on Equity</span>
                  <span className="text-white font-bold">{formatPercentage(financialMetrics?.returnOnEquity || 0)}</span>
                </div>
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <p className="text-green-300 text-sm">
                    <strong>Assessment:</strong> Outstanding profitability metrics indicating highly efficient operations and strong competitive positioning.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-yellow-400" />
                Leverage & Solvency
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Debt-to-Equity</span>
                  <span className="text-white font-bold">{formatNumber(financialMetrics?.debtToEquity || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Equity Multiplier</span>
                  <span className="text-white font-bold">{formatNumber(financialMetrics?.equityMultiplier || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Interest Coverage</span>
                  <span className="text-white font-bold">{formatNumber(financialMetrics?.interestCoverage || 0)}x</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Debt Service Coverage</span>
                  <span className="text-white font-bold">{formatNumber(financialMetrics?.debtServiceCoverage || 0)}x</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Free Cash Flow</span>
                  <span className="text-white font-bold">{formatCurrency(financialMetrics?.freeCashFlow || 0, true)}</span>
                </div>
                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <p className="text-yellow-300 text-sm">
                    <strong>Assessment:</strong> Conservative capital structure provides excellent financial flexibility and low financial risk profile.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Efficiency Metrics */}
          <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Operational Efficiency Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">
                  {formatNumber(financialMetrics?.assetTurnover || 0)}x
                </div>
                <div className="text-gray-300">Asset Turnover</div>
                <div className="text-sm text-gray-400 mt-1">Revenue / Total Assets</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {formatNumber(financialMetrics?.inventoryTurnover || 0)}x
                </div>
                <div className="text-gray-300">Inventory Turnover</div>
                <div className="text-sm text-gray-400 mt-1">COGS / Avg Inventory</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {formatNumber(financialMetrics?.receivablesTurnover || 0)}x
                </div>
                <div className="text-gray-300">Receivables Turnover</div>
                <div className="text-sm text-gray-400 mt-1">Revenue / Avg Receivables</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {financialMetrics?.cashConversionCycle || 0}
                </div>
                <div className="text-gray-300">Cash Cycle (Days)</div>
                <div className="text-sm text-gray-400 mt-1">DIO + DSO - DPO</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Growth Trends Tab */}
      {activeTab === 'growth-trends' && (
        <div className="space-y-8">
          {/* Trend Visualization Placeholder */}
          <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Quarterly Performance Trends</h2>
            <div className="h-80 flex items-center justify-center mb-8">
              <div className="text-center">
                <LineChart className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                <p className="text-xl text-gray-300 mb-2">Interactive Financial Charts</p>
                <p className="text-gray-400">Revenue, Profitability, Cash Flow, and Growth Metrics</p>
                <p className="text-sm text-gray-500 mt-2">Charts would integrate with Chart.js or D3.js in production</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {trendData.map((data, index) => (
                <div key={index} className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="font-bold text-white mb-4 text-center">{data.period}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Revenue</span>
                      <span className="text-white font-medium">{formatCurrency(data.revenue, true)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gross Profit</span>
                      <span className="text-green-400 font-medium">{formatCurrency(data.grossProfit, true)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">EBITDA</span>
                      <span className="text-blue-400 font-medium">{formatCurrency(data.ebitda, true)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Net Income</span>
                      <span className="text-cyan-400 font-medium">{formatCurrency(data.netIncome, true)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Free CF</span>
                      <span className="text-purple-400 font-medium">{formatCurrency(data.freeCashFlow, true)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
              <h3 className="text-xl font-bold text-white mb-6">Growth Acceleration</h3>
              {growthMetrics && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Revenue Growth (QoQ)</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <span className="text-2xl font-bold text-green-400">
                        +{formatPercentage(growthMetrics.revenueGrowth)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Profit Growth (QoQ)</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      <span className="text-2xl font-bold text-blue-400">
                        +{formatPercentage(growthMetrics.profitGrowth)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Cash Flow Growth (QoQ)</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-cyan-400" />
                      <span className="text-2xl font-bold text-cyan-400">
                        +{formatPercentage(growthMetrics.cashFlowGrowth)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Customer Growth (QoQ)</span>
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-purple-400" />
                      <span className="text-2xl font-bold text-purple-400">
                        +{formatPercentage(growthMetrics.customerGrowth)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
              <h3 className="text-xl font-bold text-white mb-6">Growth Projections</h3>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
                  <h4 className="text-green-300 font-bold mb-3">Next Quarter Forecast</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Projected Revenue</span>
                      <span className="text-white font-bold">
                        {trendData.length > 0 ? formatCurrency(trendData[trendData.length - 1].revenue * 1.12, true) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Growth Rate</span>
                      <span className="text-green-400 font-bold">+12% (projected)</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6">
                  <h4 className="text-blue-300 font-bold mb-3">Annual Target Progress</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">YTD vs Target</span>
                      <span className="text-blue-400 font-bold">87% achieved</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
                  <h4 className="text-purple-300 font-bold mb-3">Market Expansion</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">TAM Penetration</span>
                      <span className="text-purple-400 font-bold">3.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Growth Potential</span>
                      <span className="text-purple-400 font-bold">High</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Industry Benchmarks Tab */}
      {activeTab === 'benchmarking' && (
        <div className="space-y-8">
          <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Industry Performance Comparison</h2>
            <div className="space-y-6">
              {benchmarkData.map((benchmark, index) => (
                <div key={index} className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">{benchmark.metric}</h3>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPerformanceColor(benchmark.performance)}`}>
                        {benchmark.performance}
                      </span>
                      <span className={`text-sm ${
                        benchmark.trend === 'improving' ? 'text-green-400' :
                        benchmark.trend === 'declining' ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {benchmark.trend === 'improving' ? '↗' : benchmark.trend === 'declining' ? '↘' : '→'} {benchmark.trend}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-center mb-4">
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Your Company</div>
                      <div className="text-2xl font-bold text-white">
                        {benchmark.metric.includes('%') || benchmark.metric.includes('Ratio') || benchmark.metric.includes('ROA') 
                          ? formatPercentage(benchmark.companyValue)
                          : formatNumber(benchmark.companyValue)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Industry Avg</div>
                      <div className="text-lg font-medium text-gray-300">
                        {benchmark.metric.includes('%') || benchmark.metric.includes('Ratio') || benchmark.metric.includes('ROA')
                          ? formatPercentage(benchmark.industryAverage)
                          : formatNumber(benchmark.industryAverage)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Top Quartile</div>
                      <div className="text-lg font-medium text-cyan-400">
                        {benchmark.metric.includes('%') || benchmark.metric.includes('Ratio') || benchmark.metric.includes('ROA')
                          ? formatPercentage(benchmark.topQuartile)
                          : formatNumber(benchmark.topQuartile)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Top Decile</div>
                      <div className="text-lg font-medium text-green-400">
                        {benchmark.metric.includes('%') || benchmark.metric.includes('Ratio') || benchmark.metric.includes('ROA')
                          ? formatPercentage(benchmark.topDecile)
                          : formatNumber(benchmark.topDecile)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-white/10 rounded-full h-3 mb-2">
                      <div className="relative h-3">
                        <div 
                          className="absolute bg-gray-500 h-3 rounded-full"
                          style={{ width: `${(benchmark.industryAverage / benchmark.topDecile) * 100}%` }}
                        />
                        <div 
                          className="absolute bg-cyan-400 h-3 rounded-full"
                          style={{ width: `${(benchmark.topQuartile / benchmark.topDecile) * 100}%` }}
                        />
                        <div 
                          className="absolute bg-blue-400 h-3 rounded-full"
                          style={{ width: `${Math.min((benchmark.companyValue / benchmark.topDecile) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>0</span>
                      <span>Industry Avg</span>
                      <span>Top Quartile</span>
                      <span>Top Decile</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm">
                    <span className="text-gray-400">Gap to Top Quartile: </span>
                    <span className={`font-medium ${
                      benchmark.companyValue >= benchmark.topQuartile ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {benchmark.companyValue >= benchmark.topQuartile 
                        ? `+${((benchmark.companyValue - benchmark.topQuartile) / benchmark.topQuartile * 100).toFixed(1)}%`
                        : `${((benchmark.companyValue - benchmark.topQuartile) / benchmark.topQuartile * 100).toFixed(1)}%`
                      }
                    </span>
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
            <h2 className="text-2xl font-bold text-white mb-6">Comprehensive Risk Analysis</h2>
            <div className="space-y-6">
              {riskFactors.map((risk) => (
                <div key={risk.id} className={`rounded-2xl p-6 border ${
                  risk.severity === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                  risk.severity === 'high' ? 'bg-orange-500/10 border-orange-500/30' :
                  risk.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
                  'bg-green-500/10 border-green-500/30'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{risk.risk}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskSeverityColor(risk.severity)}`}>
                          {risk.severity}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mb-4">{risk.category}</div>
                      <p className="text-gray-300 mb-4">{risk.impact}</p>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-sm text-gray-400">Financial Impact</div>
                      <div className="text-2xl font-bold text-red-400">{formatCurrency(risk.financialImpact, true)}</div>
                      <div className="text-sm text-gray-400 mt-1">Probability: {risk.probability}%</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                      <h4 className="text-blue-300 font-bold mb-3">Strategic Recommendation</h4>
                      <p className="text-blue-200 text-sm mb-3">{risk.recommendation}</p>
                      <div className="text-xs text-blue-300">Timeframe: {risk.timeframe}</div>
                    </div>
                    
                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
                      <h4 className="text-cyan-300 font-bold mb-3">Mitigation Steps</h4>
                      <ul className="space-y-1">
                        {risk.mitigationSteps.slice(0, 3).map((step, idx) => (
                          <li key={idx} className="text-cyan-200 text-sm flex items-start">
                            <span className="text-cyan-400 mr-2">•</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <div className="text-xs text-gray-400">KPI Impact:</div>
                    {risk.kpiImpact.map((kpi, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-500/20 rounded text-xs text-gray-300">
                        {kpi}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Insights Tab */}
      {activeTab === 'ai-insights' && (
        <div className="space-y-8">
          <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Brain className="w-6 h-6 mr-3 text-purple-400" />
              AI-Powered Strategic Insights
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {aiInsights.map((insight) => {
                const IconComponent = getInsightTypeIcon(insight.type);
                return (
                  <div key={insight.id} className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl ${
                        insight.type === 'opportunity' ? 'bg-green-500/20 border border-green-500/30' :
                        insight.type === 'warning' ? 'bg-red-500/20 border border-red-500/30' :
                        insight.type === 'recommendation' ? 'bg-blue-500/20 border border-blue-500/30' :
                        insight.type === 'trend' ? 'bg-purple-500/20 border border-purple-500/30' :
                        'bg-cyan-500/20 border border-cyan-500/30'
                      }`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          insight.impact === 'transformational' ? 'bg-purple-500/20 text-purple-400' :
                          insight.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                          insight.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {insight.impact} impact
                        </div>
                        <div className="text-sm text-gray-400 mt-1">{insight.confidence}% confidence</div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3">{insight.title}</h3>
                    <p className="text-gray-300 mb-4">{insight.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <div className="text-gray-400">Investment Required</div>
                        <div className="text-white font-bold">{formatCurrency(insight.investmentRequired, true)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Expected ROI</div>
                        <div className="text-green-400 font-bold">{insight.roi.toFixed(1)}x</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Timeline</div>
                        <div className="text-cyan-400 font-bold">{insight.timeline}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Priority</div>
                        <div className={`font-bold ${
                          insight.priority === 1 ? 'text-red-400' :
                          insight.priority === 2 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {insight.priority === 1 ? 'High' : insight.priority === 2 ? 'Medium' : 'Low'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                      <h4 className="text-white font-medium mb-2">Expected Outcome</h4>
                      <p className="text-gray-300 text-sm">{insight.expectedOutcome}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-white font-medium">Key Action Items</h4>
                      <ul className="space-y-1">
                        {insight.actionItems.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="text-gray-300 text-sm flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {insight.kpiTargets.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <h4 className="text-white font-medium mb-2">KPI Targets</h4>
                        <div className="space-y-1">
                          {insight.kpiTargets.map((target, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-400">{target.metric}</span>
                              <span className="text-cyan-400 font-medium">
                                {target.target}{target.metric.includes('%') ? '%' : ''} by {target.timeframe}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-8">
          <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Target className="w-6 h-6 mr-3 text-green-400" />
              Strategic Action Plan
            </h2>
            
            {/* Priority Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Flag className="w-5 h-5 mr-2 text-red-400" />
                  Immediate Actions (0-3 months)
                </h3>
                <div className="space-y-3">
                  {aiInsights.filter(i => i.priority === 1).map(insight => (
                    <div key={insight.id} className="bg-white/5 rounded-lg p-3">
                      <div className="text-white font-medium text-sm">{insight.title}</div>
                      <div className="text-gray-400 text-xs mt-1">ROI: {insight.roi.toFixed(1)}x</div>
                    </div>
                  ))}
                  {criticalRisks.slice(0, 2).map(risk => (
                    <div key={risk.id} className="bg-white/5 rounded-lg p-3">
                      <div className="text-white font-medium text-sm">Mitigate: {risk.risk}</div>
                      <div className="text-red-400 text-xs mt-1">Risk: {formatCurrency(risk.financialImpact, true)}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-yellow-400" />
                  Medium-term (3-12 months)
                </h3>
                <div className="space-y-3">
                  {aiInsights.filter(i => i.priority === 2).map(insight => (
                    <div key={insight.id} className="bg-white/5 rounded-lg p-3">
                      <div className="text-white font-medium text-sm">{insight.title}</div>
                      <div className="text-gray-400 text-xs mt-1">Investment: {formatCurrency(insight.investmentRequired, true)}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-green-400" />
                  Long-term (12+ months)
                </h3>
                <div className="space-y-3">
                  {aiInsights.filter(i => i.priority >= 3).map(insight => (
                    <div key={insight.id} className="bg-white/5 rounded-lg p-3">
                      <div className="text-white font-medium text-sm">{insight.title}</div>
                      <div className="text-gray-400 text-xs mt-1">Timeline: {insight.timeline}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Implementation Roadmap */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Implementation Roadmap</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Immediate Risk Mitigation</h4>
                      <p className="text-gray-400 text-sm">Address critical risks and operational vulnerabilities</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-red-400 font-bold">High Priority</div>
                    <div className="text-gray-400 text-sm">0-30 days</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Revenue Optimization</h4>
                      <p className="text-gray-400 text-sm">Implement high-ROI growth initiatives</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold">Quick Wins</div>
                    <div className="text-gray-400 text-sm">1-3 months</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Strategic Expansion</h4>
                      <p className="text-gray-400 text-sm">Execute transformational growth opportunities</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-purple-400 font-bold">Strategic</div>
                    <div className="text-gray-400 text-sm">6-18 months</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const AdvancedAnalysisPage = () => {
 return (
   <Suspense fallback={
     <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900 flex items-center justify-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
       <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-12 text-center max-w-md">
         <div className="relative">
           <RefreshCw className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-6" />
           <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-pulse"></div>
         </div>
         <h2 className="text-2xl font-medium text-white mb-3">Loading Advanced Analysis...</h2>
         <p className="text-gray-300 mb-4">Preparing elite-level financial insights...</p>
         <div className="w-full bg-white/10 rounded-full h-2">
           <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full animate-pulse"></div>
         </div>
       </div>
     </div>
   }>
     <AdvancedAnalysisContent />
   </Suspense>
 );
};

export default AdvancedAnalysisPage;