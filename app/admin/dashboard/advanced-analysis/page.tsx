'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  BarChart3, TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle,
  CheckCircle, Activity, Calendar, RefreshCw, ArrowLeft, Eye, Download,
  PieChart, LineChart, Zap, Building2, CreditCard, Percent, Calculator,
  Shield, Award, Clock, Users, Globe, Brain, Search, Filter, Settings
} from 'lucide-react';
import { NextPage } from 'next';

interface FinancialMetrics {
  healthScore: number;
  liquidityRatio: number;
  profitMargin: number;
  debtToEquity: number;
  returnOnAssets: number;
  workingCapital: number;
  cashFlowRatio: number;
  quickRatio: number;
  currentRatio: number;
  inventoryTurnover: number;
  receivablesTurnover: number;
  assetTurnover: number;
}

interface TrendData {
  period: string;
  revenue: number;
  expenses: number;
  netIncome: number;
  cashFlow: number;
}

interface BenchmarkData {
  metric: string;
  companyValue: number;
  industryAverage: number;
  topQuartile: number;
  performance: 'excellent' | 'above-average' | 'average' | 'below-average' | 'poor';
}

interface RiskFactor {
  category: string;
  risk: string;
  severity: 'high' | 'medium' | 'low';
  impact: string;
  recommendation: string;
}

interface AIInsight {
  type: 'opportunity' | 'concern' | 'trend' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeline: string;
}

interface ConnectedAccount {
  id: string;
  companyName: string;
  industry: string;
  lastAnalysis: string;
}

const AdvancedAnalysisPage = () => {
  // Router and params
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountParam = searchParams?.get('account');

  // State declarations
  const [selectedAccount, setSelectedAccount] = useState<string>(accountParam || '1');
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [financialMetrics, setFinancialMetrics] = useState<FinancialMetrics | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData[]>([]);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([]);

  // Create dynamic metrics based on selected account
  const getMetricsForAccount = (accountId: string) => {
    const accountMetrics = {
      '1': { // TechCorp Solutions
        healthScore: 78,
        liquidityRatio: 2.1,
        profitMargin: 24.1,
        debtToEquity: 0.45,
        returnOnAssets: 12.3,
        workingCapital: 850000,
        cashFlowRatio: 1.8,
        quickRatio: 1.9,
        currentRatio: 2.1,
        inventoryTurnover: 6.2,
        receivablesTurnover: 8.1,
        assetTurnover: 1.4,
        industry: 'Technology'
      },
      '2': { // Global Manufacturing Inc
        healthScore: 82,
        liquidityRatio: 1.8,
        profitMargin: 18.3,
        debtToEquity: 0.52,
        returnOnAssets: 14.1,
        workingCapital: 1200000,
        cashFlowRatio: 2.1,
        quickRatio: 1.6,
        currentRatio: 1.8,
        inventoryTurnover: 4.8,
        receivablesTurnover: 6.2,
        assetTurnover: 1.8,
        industry: 'Manufacturing'
      },
      '3': { // Healthcare Plus
        healthScore: 75,
        liquidityRatio: 2.3,
        profitMargin: 16.8,
        debtToEquity: 0.38,
        returnOnAssets: 10.9,
        workingCapital: 650000,
        cashFlowRatio: 1.5,
        quickRatio: 2.1,
        currentRatio: 2.3,
        inventoryTurnover: 8.1,
        receivablesTurnover: 9.3,
        assetTurnover: 1.1,
        industry: 'Healthcare'
      }
    };

    return accountMetrics[accountId as keyof typeof accountMetrics] || accountMetrics['1'];
  };

  // Dynamic trend data based on account
  const getTrendDataForAccount = (accountId: string) => {
    const trendData = {
      '1': [ // TechCorp
        { period: 'Q1 2024', revenue: 2100000, expenses: 1680000, netIncome: 420000, cashFlow: 380000 },
        { period: 'Q2 2024', revenue: 2340000, expenses: 1780000, netIncome: 560000, cashFlow: 520000 },
        { period: 'Q3 2024', revenue: 2580000, expenses: 1950000, netIncome: 630000, cashFlow: 590000 },
        { period: 'Q4 2024', revenue: 2840000, expenses: 2156000, netIncome: 684000, cashFlow: 640000 }
      ],
      '2': [ // Manufacturing
        { period: 'Q1 2024', revenue: 4200000, expenses: 3570000, netIncome: 630000, cashFlow: 720000 },
        { period: 'Q2 2024', revenue: 4680000, expenses: 3950000, netIncome: 730000, cashFlow: 820000 },
        { period: 'Q3 2024', revenue: 4950000, expenses: 4180000, netIncome: 770000, cashFlow: 890000 },
        { period: 'Q4 2024', revenue: 5200000, expenses: 4420000, netIncome: 780000, cashFlow: 920000 }
      ],
      '3': [ // Healthcare
        { period: 'Q1 2024', revenue: 2800000, expenses: 2380000, netIncome: 420000, cashFlow: 480000 },
        { period: 'Q2 2024', revenue: 3100000, expenses: 2650000, netIncome: 450000, cashFlow: 520000 },
        { period: 'Q3 2024', revenue: 3350000, expenses: 2870000, netIncome: 480000, cashFlow: 550000 },
        { period: 'Q4 2024', revenue: 3600000, expenses: 3080000, netIncome: 520000, cashFlow: 580000 }
      ]
    };
    
    return trendData[accountId as keyof typeof trendData] || trendData['1'];
  };

  // Dynamic AI insights based on account
  const getInsightsForAccount = (accountId: string) => {
    const insights = {
      '1': [ // TechCorp
        {
          type: 'opportunity' as const,
          title: 'Tech Expansion Opportunity',
          description: 'Strong cash flow and low debt indicate capacity for R&D investment and market expansion.',
          confidence: 87,
          impact: 'high' as const,
          timeline: '6-12 months'
        },
        {
          type: 'concern' as const,
          title: 'Asset Efficiency in Tech',
          description: 'Technology assets may need updating to maintain competitive edge.',
          confidence: 73,
          impact: 'medium' as const,
          timeline: 'Current'
        }
      ],
      '2': [ // Manufacturing
        {
          type: 'opportunity' as const,
          title: 'Manufacturing Optimization',
          description: 'High inventory turnover suggests efficient production. Consider capacity expansion.',
          confidence: 91,
          impact: 'high' as const,
          timeline: '3-6 months'
        },
        {
          type: 'trend' as const,
          title: 'Supply Chain Efficiency',
          description: 'Consistent improvement in receivables turnover indicates strong customer relationships.',
          confidence: 85,
          impact: 'medium' as const,
          timeline: 'Ongoing'
        }
      ],
      '3': [ // Healthcare
        {
          type: 'recommendation' as const,
          title: 'Healthcare Compliance Focus',
          description: 'Strong liquidity provides buffer for regulatory compliance investments.',
          confidence: 89,
          impact: 'high' as const,
          timeline: '2-4 months'
        },
        {
          type: 'opportunity' as const,
          title: 'Service Line Expansion',
          description: 'Healthy profit margins suggest room for specialized service development.',
          confidence: 78,
          impact: 'medium' as const,
          timeline: '6-12 months'
        }
      ]
    };
    
    return insights[accountId as keyof typeof insights] || insights['1'];
  };

  // Enhanced risk factors based on selected account
  const getRiskFactorsForAccount = (accountId: string) => {
    const riskData = {
      '1': [ // TechCorp
        {
          category: 'Technology Risk',
          risk: 'Rapid Technology Obsolescence',
          severity: 'medium' as const,
          impact: 'Technology investments may become outdated quickly in fast-moving tech sector',
          recommendation: 'Implement rolling technology refresh cycle and maintain R&D investment at 15%+ of revenue'
        },
        {
          category: 'Market Risk',
          risk: 'Customer Concentration',
          severity: 'high' as const,
          impact: 'Over-reliance on top 3 clients represents 60% of revenue',
          recommendation: 'Diversify customer base and implement multi-year contracts with existing clients'
        }
      ],
      '2': [ // Manufacturing
        {
          category: 'Operational Risk',
          risk: 'Supply Chain Disruption',
          severity: 'high' as const,
          impact: 'Single-source suppliers for critical components pose production risk',
          recommendation: 'Develop secondary supplier relationships and increase safety stock levels'
        },
        {
          category: 'Environmental Risk',
          risk: 'Regulatory Compliance',
          severity: 'medium' as const,
          impact: 'Changing environmental regulations may require equipment upgrades',
          recommendation: 'Establish compliance monitoring system and budget for regulatory changes'
        }
      ],
      '3': [ // Healthcare
        {
          category: 'Regulatory Risk',
          risk: 'Healthcare Compliance',
          severity: 'high' as const,
          impact: 'HIPAA and healthcare regulations require continuous compliance investment',
          recommendation: 'Maintain dedicated compliance team and conduct quarterly audits'
        },
        {
          category: 'Reimbursement Risk',
          risk: 'Insurance Payment Changes',
          severity: 'medium' as const,
          impact: 'Changes in insurance reimbursement rates could affect profitability',
          recommendation: 'Diversify payer mix and negotiate multi-year reimbursement contracts'
        }
      ]
    };
    
    return riskData[accountId as keyof typeof riskData] || riskData['1'];
  };

  // Data loading
  const loadAnalysisData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAccounts: ConnectedAccount[] = [
        { id: '1', companyName: 'TechCorp Solutions', industry: 'Technology', lastAnalysis: '2024-06-09T08:30:00Z' },
        { id: '2', companyName: 'Global Manufacturing Inc', industry: 'Manufacturing', lastAnalysis: '2024-06-09T06:15:00Z' },
        { id: '3', companyName: 'Healthcare Plus', industry: 'Healthcare', lastAnalysis: '2024-06-09T07:45:00Z' }
      ];

      const mockMetrics = getMetricsForAccount(selectedAccount);
      const mockTrendData = getTrendDataForAccount(selectedAccount);
      const mockAIInsights = getInsightsForAccount(selectedAccount);
      const mockRiskFactors = getRiskFactorsForAccount(selectedAccount);
      
      // Enhanced benchmark data based on current metrics
      const mockBenchmarkData: BenchmarkData[] = [
        { metric: 'Profit Margin', companyValue: mockMetrics?.profitMargin || 24.1, industryAverage: 18.5, topQuartile: 22.0, performance: 'excellent' },
        { metric: 'Current Ratio', companyValue: mockMetrics?.currentRatio || 2.1, industryAverage: 1.8, topQuartile: 2.3, performance: 'above-average' },
        { metric: 'ROA', companyValue: mockMetrics?.returnOnAssets || 12.3, industryAverage: 8.9, topQuartile: 15.2, performance: 'above-average' },
        { metric: 'Debt-to-Equity', companyValue: mockMetrics?.debtToEquity || 0.45, industryAverage: 0.62, topQuartile: 0.35, performance: 'above-average' },
        { metric: 'Asset Turnover', companyValue: mockMetrics?.assetTurnover || 1.4, industryAverage: 1.6, topQuartile: 2.1, performance: 'below-average' }
      ];

      setAccounts(mockAccounts);
      setFinancialMetrics(mockMetrics);
      setTrendData(mockTrendData);
      setBenchmarkData(mockBenchmarkData);
      setRiskFactors(mockRiskFactors);
      setAIInsights(mockAIInsights);
    } catch (error) {
      console.error('Failed to load analysis data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    loadAnalysisData();
  }, []);

  useEffect(() => {
    if (accountParam && accounts.length > 0) {
      setSelectedAccount(accountParam);
      loadAnalysisData();
    }
  }, [accountParam, accounts, selectedAccount]);

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'bg-green-500/20 text-green-400';
      case 'above-average': return 'bg-blue-500/20 text-blue-400';
      case 'average': return 'bg-yellow-500/20 text-yellow-400';
      case 'below-average': return 'bg-orange-500/20 text-orange-400';
      case 'poor': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getRiskSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getInsightTypeColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-green-500/20 text-green-400';
      case 'concern': return 'bg-red-500/20 text-red-400';
      case 'trend': return 'bg-blue-500/20 text-blue-400';
      case 'recommendation': return 'bg-cyan-500/20 text-cyan-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900 flex items-center justify-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-8 text-center">
          <RefreshCw className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-medium text-white mb-2">Analyzing Financial Data</h2>
          <p className="text-gray-300">Generating comprehensive insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900 p-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
      
      {/* Header */}
      <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium text-white mb-2">Advanced Financial Analysis</h1>
            <p className="text-gray-300">Comprehensive AI-powered financial insights and risk assessment</p>
          </div>
          <div className="flex items-center space-x-4">
          <select
  value={selectedAccount}
  onChange={(e) => {
    setSelectedAccount(e.target.value);
    // Trigger data reload when account changes
    setIsLoading(true);
    setTimeout(() => {
      loadAnalysisData();
    }, 300); // Small delay for better UX
  }}
  className="px-4 py-2 bg-white/10 border border-white/25 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
>
  {accounts.map(account => (
    <option key={account.id} value={account.id} className="bg-slate-800 text-white">
      {account.companyName}
    </option>
  ))}
</select>
            <button 
              onClick={() => router.push('/admin/dashboard/main')}
              className="bg-white/10 backdrop-blur-sm border border-white/25 text-white px-4 py-2 rounded-xl hover:bg-white/15 transition-all duration-200 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Financial Health Score */}
      <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="text-center">
              <h2 className="text-xl font-medium text-white mb-4">Financial Health Score</h2>
              <div className={`text-6xl font-bold mb-2 ${getHealthScoreColor(financialMetrics?.healthScore || 0)}`}>
                {financialMetrics?.healthScore || 0}
              </div>
              <div className="text-gray-300">out of 100</div>
              <div className="mt-4 w-full bg-white/10 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    (financialMetrics?.healthScore || 0) >= 80 ? 'bg-green-400' :
                    (financialMetrics?.healthScore || 0) >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${financialMetrics?.healthScore || 0}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <h3 className="text-lg font-medium text-white mb-4">Key Performance Indicators</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">Profit Margin</span>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white">{formatPercentage(financialMetrics?.profitMargin || 0)}</div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">Current Ratio</span>
                  <Activity className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">{financialMetrics?.currentRatio?.toFixed(1) || '0.0'}</div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">ROA</span>
                  <Target className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold text-white">{formatPercentage(financialMetrics?.returnOnAssets || 0)}</div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">Debt-to-Equity</span>
                  <Shield className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold text-white">{financialMetrics?.debtToEquity?.toFixed(2) || '0.00'}</div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">Working Capital</span>
                  <DollarSign className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white">{formatCurrency(financialMetrics?.workingCapital || 0)}</div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">Cash Flow Ratio</span>
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white">{financialMetrics?.cashFlowRatio?.toFixed(1) || '0.0'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 mb-6">
        <div className="flex space-x-1 p-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'detailed', label: 'Detailed Analysis', icon: Calculator },
            { id: 'trends', label: 'Trends & Growth', icon: TrendingUp },
            { id: 'benchmarks', label: 'Industry Benchmarks', icon: Award },
            { id: 'insights', label: 'AI Insights', icon: Brain }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white/15 text-white border border-white/30'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <h2 className="text-xl font-medium text-white mb-4">Financial Ratios Overview</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Liquidity Ratio</span>
                <span className="text-white font-medium">{financialMetrics?.liquidityRatio?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Quick Ratio</span>
                <span className="text-white font-medium">{financialMetrics?.quickRatio?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Inventory Turnover</span>
                <span className="text-white font-medium">{financialMetrics?.inventoryTurnover?.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Receivables Turnover</span>
                <span className="text-white font-medium">{financialMetrics?.receivablesTurnover?.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Asset Turnover</span>
                <span className="text-white font-medium">{financialMetrics?.assetTurnover?.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <h2 className="text-xl font-medium text-white mb-4">Risk Assessment Summary</h2>
            <div className="space-y-3">
              {riskFactors.slice(0, 4).map((risk, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskSeverityColor(risk.severity)}`}>
                    {risk.severity}
                  </span>
                  <div>
                    <h3 className="font-medium text-white">{risk.risk}</h3>
                    <p className="text-sm text-gray-300">{risk.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Analysis Tab */}
      {activeTab === 'detailed' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <h3 className="text-lg font-medium text-white mb-4">Liquidity Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Current Ratio</span>
                  <span className="text-white font-medium">{financialMetrics?.currentRatio?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Quick Ratio</span>
                  <span className="text-white font-medium">{financialMetrics?.quickRatio?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Cash Flow Ratio</span>
                  <span className="text-white font-medium">{financialMetrics?.cashFlowRatio?.toFixed(2)}</span>
                </div>
                <div className="mt-4 p-3 bg-blue-500/20 rounded-lg">
                  <p className="text-blue-300 text-sm">
                    <strong>Assessment:</strong> Strong liquidity position with ratios above industry standards.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <h3 className="text-lg font-medium text-white mb-4">Profitability Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Profit Margin</span>
                  <span className="text-white font-medium">{formatPercentage(financialMetrics?.profitMargin || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Return on Assets</span>
                  <span className="text-white font-medium">{formatPercentage(financialMetrics?.returnOnAssets || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Asset Turnover</span>
                  <span className="text-white font-medium">{financialMetrics?.assetTurnover?.toFixed(2)}</span>
                </div>
                <div className="mt-4 p-3 bg-green-500/20 rounded-lg">
                  <p className="text-green-300 text-sm">
                    <strong>Assessment:</strong> Excellent profitability metrics indicating efficient operations.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <h3 className="text-lg font-medium text-white mb-4">Leverage Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Debt-to-Equity</span>
                  <span className="text-white font-medium">{financialMetrics?.debtToEquity?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Working Capital</span>
                  <span className="text-white font-medium">{formatCurrency(financialMetrics?.workingCapital || 0)}</span>
                </div>
                <div className="mt-4 p-3 bg-yellow-500/20 rounded-lg">
                  <p className="text-yellow-300 text-sm">
                    <strong>Assessment:</strong> Conservative debt levels provide financial flexibility.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <h2 className="text-xl font-medium text-white mb-6">Detailed Risk Analysis</h2>
            <div className="space-y-4">
              {riskFactors.map((risk, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-white">{risk.risk}</h3>
                      <span className="text-sm text-gray-400">{risk.category}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskSeverityColor(risk.severity)}`}>
                      {risk.severity} risk
                    </span>
                  </div>
                  <p className="text-gray-300 mb-3">{risk.impact}</p>
                  <div className="bg-cyan-500/20 rounded-lg p-3">
                    <h4 className="text-cyan-300 font-medium mb-1">Recommendation:</h4>
                    <p className="text-cyan-200 text-sm">{risk.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trends & Growth Tab */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <h2 className="text-xl font-medium text-white mb-6">Quarterly Performance Trends</h2>
            <div className="h-64 flex items-center justify-center mb-6">
              <div className="text-center">
                <LineChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300">Interactive trend charts would display here</p>
                <p className="text-gray-400 text-sm">Revenue, Expenses, Net Income, and Cash Flow over time</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {trendData.map((data, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4">
                  <h3 className="font-medium text-white mb-3">{data.period}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Revenue</span>
                      <span className="text-white">{formatCurrency(data.revenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Expenses</span>
                      <span className="text-white">{formatCurrency(data.expenses)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Net Income</span>
                      <span className="text-green-400">{formatCurrency(data.netIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cash Flow</span>
                      <span className="text-blue-400">{formatCurrency(data.cashFlow)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <h3 className="text-lg font-medium text-white mb-4">Growth Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Revenue Growth (YoY)</span>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-medium">+35.2%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Net Income Growth</span>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-medium">+62.9%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Cash Flow Growth</span>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-medium">+68.4%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <h3 className="text-lg font-medium text-white mb-4">Growth Forecast</h3>
              <div className="space-y-4">
                <div className="bg-blue-500/20 rounded-lg p-4">
                  <h4 className="text-blue-300 font-medium mb-2">Next Quarter Projection</h4>
                  <p className="text-white">Revenue: {formatCurrency(3120000)}</p>
                  <p className="text-gray-300 text-sm">Based on current growth trajectory</p>
                </div>
                <div className="bg-green-500/20 rounded-lg p-4">
                  <h4 className="text-green-300 font-medium mb-2">Annual Target</h4>
                  <p className="text-white">Revenue: {formatCurrency(12500000)}</p>
                  <p className="text-gray-300 text-sm">98% probability of achievement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Industry Benchmarks Tab */}
      {activeTab === 'benchmarks' && (
        <div className="space-y-6">
          <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <h2 className="text-xl font-medium text-white mb-6">Industry Performance Comparison</h2>
            <div className="space-y-4">
              {benchmarkData.map((benchmark, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-white">{benchmark.metric}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(benchmark.performance)}`}>
                      {benchmark.performance}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <span className="text-gray-400 block">Your Company</span>
                      <span className="text-white font-medium text-lg">
                        {benchmark.metric.includes('%') || benchmark.metric.includes('Ratio') || benchmark.metric.includes('ROA') 
                          ? formatPercentage(benchmark.companyValue)
                          : benchmark.companyValue.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-gray-400 block">Industry Avg</span>
                      <span className="text-gray-300 font-medium text-lg">
                        {benchmark.metric.includes('%') || benchmark.metric.includes('Ratio') || benchmark.metric.includes('ROA')
                          ? formatPercentage(benchmark.industryAverage)
                          : benchmark.industryAverage.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-gray-400 block">Top Quartile</span>
                      <span className="text-cyan-400 font-medium text-lg">
                        {benchmark.metric.includes('%') || benchmark.metric.includes('Ratio') || benchmark.metric.includes('ROA')
                          ? formatPercentage(benchmark.topQuartile)
                          : benchmark.topQuartile.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 w-full bg-white/10 rounded-full h-2">
                    <div className="relative h-2">
                      <div 
                        className="absolute bg-gray-400 h-2 rounded-full"
                        style={{ width: `${(benchmark.industryAverage / benchmark.topQuartile) * 100}%` }}
                      />
                      <div 
                        className="absolute bg-blue-400 h-2 rounded-full"
                        style={{ width: `${(benchmark.companyValue / benchmark.topQuartile) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiInsights.map((insight, index) => (
              <div key={index} className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getInsightTypeColor(insight.type)}`}>
                      {insight.type}
                    </span>
                    <span className="text-gray-400 text-sm">{insight.confidence}% confidence</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className={`px-2 py-1 rounded text-xs ${
                      insight.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                      insight.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {insight.impact} impact
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-white mb-3">{insight.title}</h3>
                <p className="text-gray-300 mb-4">{insight.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Timeline: {insight.timeline}</span>
                  <div className="w-16 bg-white/10 rounded-full h-1">
                    <div 
                      className="bg-blue-400 h-1 rounded-full"
                      style={{ width: `${insight.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedAnalysisPage;
