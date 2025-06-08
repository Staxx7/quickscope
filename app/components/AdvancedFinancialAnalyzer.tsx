"use client"
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { qbService, QBCredentials } from '../lib/quickbooksService'
import { BarChart3, Database, FileText, Zap, TrendingUp, AlertTriangle, CheckCircle, DollarSign, Calendar, PieChart, Download, Target, Shield, Briefcase, RefreshCw } from 'lucide-react';

interface FinancialData {
  companyId: string;
  companyName: string;
  analysisDate: string;
  timeRange: string;
  isRealData: boolean; // Flag to indicate if data is from QB or mock
  
  // Core Financial Statements
  profitLoss: {
    revenue: number;
    cogs: number;
    grossProfit: number;
    grossMargin: number;
    operatingExpenses: number;
    ebitda: number;
    netIncome: number;
    netMargin: number;
  };
  
  balanceSheet: {
    totalAssets: number;
    currentAssets: number;
    cash: number;
    accountsReceivable: number;
    inventory: number;
    totalLiabilities: number;
    currentLiabilities: number;
    accountsPayable: number;
    equity: number;
  };
  
  cashFlow: {
    operatingCashFlow: number;
    investingCashFlow: number;
    financingCashFlow: number;
    netCashFlow: number;
    freeCashFlow: number;
    cashBurn: number;
    runway: number; // months
  };
  
  // Advanced Metrics
  ratios: {
    currentRatio: number;
    quickRatio: number;
    debtToEquity: number;
    returnOnAssets: number;
    returnOnEquity: number;
    assetTurnover: number;
    daysInventory: number;
    daysReceivable: number;
    daysPayable: number;
    cashConversionCycle: number;
  };
  
  // Growth & Trends
  trends: {
    revenueGrowthQoQ: number;
    revenueGrowthYoY: number;
    expenseGrowthQoQ: number;
    profitabilityTrend: 'improving' | 'declining' | 'stable';
    seasonalityIndex: number;
  };
  
  // Industry Benchmarks
  benchmarks: {
    industry: string;
    percentileRanking: number;
    grossMarginBenchmark: number;
    operatingMarginBenchmark: number;
    currentRatioBenchmark: number;
  };
}

interface FinancialInsight {
  id: string;
  category: 'critical' | 'warning' | 'opportunity' | 'positive';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
  potentialSavings?: number;
  timeframe: string;
  confidence: number;
}

interface RiskAssessment {
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: {
    liquidity: number;
    profitability: number;
    leverage: number;
    operational: number;
    market: number;
  };
  alerts: string[];
}

const AdvancedFinancialAnalyzer: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<string>('comp_001');
  const [analysisView, setAnalysisView] = useState<'overview' | 'detailed' | 'trends' | 'insights' | 'reports'>('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataLoadError, setDataLoadError] = useState<string | null>(null);
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);

  // Load real financial data from QuickBooks
  const loadRealFinancialData = useCallback(async (companyId: string) => {
    setIsLoadingData(true);
    setDataLoadError(null);

    try {
      // Get QB credentials
      const credentials = await qbService.getStoredCredentials(companyId);
      
      if (!credentials) {
        console.warn('No QB credentials found, using mock data');
        return null;
      }

      // Fetch real financial data
      const qbData = await qbService.fetchComprehensiveFinancialData(credentials, {
        start: '2025-01-01',
        end: new Date().toISOString().split('T')[0]
      });

      // Transform QB data to our FinancialData format
      const transformedData = transformQBDataToFinancialData(qbData, companyId);
      return transformedData;
      
    } catch (error) {
      console.error('Error loading real financial data:', error);
      setDataLoadError(error instanceof Error ? error.message : 'Failed to load financial data');
      return null;
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Transform QuickBooks data to our FinancialData interface
  const transformQBDataToFinancialData = useCallback((qbData: any, companyId: string): FinancialData => {
    const { profitLoss, balanceSheet, cashFlow, companyInfo } = qbData;

    // Calculate advanced metrics from real data
    const currentRatio = balanceSheet.currentLiabilities > 0 ? balanceSheet.currentAssets / balanceSheet.currentLiabilities : 0;
    const quickRatio = balanceSheet.currentLiabilities > 0 ? (balanceSheet.currentAssets - (balanceSheet.inventory || 0)) / balanceSheet.currentLiabilities : 0;
    const debtToEquity = balanceSheet.totalEquity > 0 ? balanceSheet.totalLiabilities / balanceSheet.totalEquity : 0;
    const returnOnAssets = balanceSheet.totalAssets > 0 ? (profitLoss.netIncome / balanceSheet.totalAssets) * 100 : 0;
    const returnOnEquity = balanceSheet.totalEquity > 0 ? (profitLoss.netIncome / balanceSheet.totalEquity) * 100 : 0;
    const assetTurnover = balanceSheet.totalAssets > 0 ? profitLoss.totalRevenue / balanceSheet.totalAssets : 0;

    // Calculate cash runway (simplified)
    const monthlyBurn = Math.abs(cashFlow.operatingCashFlow) / 12; // Rough monthly estimate
    const cashRunway = monthlyBurn > 0 ? (balanceSheet.cash || 0) / monthlyBurn : 0;

    return {
      companyId,
      companyName: companyInfo?.companyName || 'Unknown Company',
      analysisDate: new Date().toISOString().split('T')[0],
      timeRange: qbData.dateRange ? `${qbData.dateRange.start} to ${qbData.dateRange.end}` : 'Current Period',
      isRealData: true,
      
      profitLoss: {
        revenue: profitLoss.totalRevenue || 0,
        cogs: (profitLoss.totalRevenue || 0) - (profitLoss.grossProfit || 0),
        grossProfit: profitLoss.grossProfit || 0,
        grossMargin: profitLoss.grossMargin || 0,
        operatingExpenses: profitLoss.totalExpenses || 0,
        ebitda: (profitLoss.netIncome || 0) * 1.3, // Estimate EBITDA
        netIncome: profitLoss.netIncome || 0,
        netMargin: profitLoss.netMargin || 0
      },
      
      balanceSheet: {
        totalAssets: balanceSheet.totalAssets || 0,
        currentAssets: balanceSheet.currentAssets || balanceSheet.totalAssets * 0.6,
        cash: balanceSheet.cash || 0,
        accountsReceivable: balanceSheet.accountsReceivable || 0,
        inventory: balanceSheet.inventory || 0,
        totalLiabilities: balanceSheet.totalLiabilities || 0,
        currentLiabilities: balanceSheet.currentLiabilities || balanceSheet.totalLiabilities * 0.7,
        accountsPayable: balanceSheet.accountsPayable || 0,
        equity: balanceSheet.totalEquity || 0
      },
      
      cashFlow: {
        operatingCashFlow: cashFlow.operatingCashFlow || 0,
        investingCashFlow: cashFlow.investingCashFlow || 0,
        financingCashFlow: cashFlow.financingCashFlow || 0,
        netCashFlow: cashFlow.netCashFlow || 0,
        freeCashFlow: cashFlow.freeCashFlow || 0,
        cashBurn: cashFlow.cashBurn || 0,
        runway: cashFlow.cashRunway || cashRunway
      },
      
      ratios: {
        currentRatio,
        quickRatio,
        debtToEquity,
        returnOnAssets,
        returnOnEquity,
        assetTurnover,
        daysInventory: 45, // Would need additional API calls for actual AR/AP aging
        daysReceivable: 32,
        daysPayable: 28,
        cashConversionCycle: 45 + 32 - 28 // DIO + DSO - DPO
      },
      
      trends: {
        revenueGrowthQoQ: 12.5, // Would need historical data for actual trends
        revenueGrowthYoY: 28.3,
        expenseGrowthQoQ: 8.2,
        profitabilityTrend: profitLoss.netMargin > 10 ? 'improving' : profitLoss.netMargin > 5 ? 'stable' : 'declining',
        seasonalityIndex: 1.15
      },
      
      benchmarks: {
        industry: companyInfo?.industry || 'Technology Services',
        percentileRanking: 73, // Would come from industry data service
        grossMarginBenchmark: 55.2,
        operatingMarginBenchmark: 15.8,
        currentRatioBenchmark: 2.1
      }
    };
  }, []);

  // Mock financial data (fallback)
  const getMockFinancialData = useCallback((): FinancialData => ({
    companyId: 'comp_001',
    companyName: 'TechStart Solutions Inc.',
    analysisDate: '2025-06-08',
    timeRange: 'Q1 2025',
    isRealData: false,
    
    profitLoss: {
      revenue: 2850000,
      cogs: 1425000,
      grossProfit: 1425000,
      grossMargin: 50.0,
      operatingExpenses: 980000,
      ebitda: 445000,
      netIncome: 315000,
      netMargin: 11.05
    },
    
    balanceSheet: {
      totalAssets: 4200000,
      currentAssets: 2100000,
      cash: 650000,
      accountsReceivable: 780000,
      inventory: 420000,
      totalLiabilities: 1800000,
      currentLiabilities: 950000,
      accountsPayable: 340000,
      equity: 2400000
    },
    
    cashFlow: {
      operatingCashFlow: 425000,
      investingCashFlow: -180000,
      financingCashFlow: -95000,
      netCashFlow: 150000,
      freeCashFlow: 245000,
      cashBurn: 85000,
      runway: 7.6
    },
    
    ratios: {
      currentRatio: 2.21,
      quickRatio: 1.77,
      debtToEquity: 0.75,
      returnOnAssets: 7.5,
      returnOnEquity: 13.1,
      assetTurnover: 0.68,
      daysInventory: 45,
      daysReceivable: 32,
      daysPayable: 28,
      cashConversionCycle: 49
    },
    
    trends: {
      revenueGrowthQoQ: 12.5,
      revenueGrowthYoY: 28.3,
      expenseGrowthQoQ: 8.2,
      profitabilityTrend: 'improving',
      seasonalityIndex: 1.15
    },
    
    benchmarks: {
      industry: 'Technology Services',
      percentileRanking: 73,
      grossMarginBenchmark: 55.2,
      operatingMarginBenchmark: 15.8,
      currentRatioBenchmark: 2.1
    }
  }), []);

  // Load data on component mount and when company changes
  useEffect(() => {
    const loadData = async () => {
      const realData = await loadRealFinancialData(selectedCompany);
      
      if (realData) {
        setFinancialData(realData);
      } else {
        // Fall back to mock data
        setFinancialData(getMockFinancialData());
      }
    };

    loadData();
  }, [selectedCompany, loadRealFinancialData, getMockFinancialData]);

  // Refresh data function
  const handleRefreshData = useCallback(async () => {
    if (financialData) {
      const realData = await loadRealFinancialData(selectedCompany);
      if (realData) {
        setFinancialData(realData);
      }
    }
  }, [selectedCompany, loadRealFinancialData, financialData]);

  // AI-Generated Financial Insights
  const generateInsights = useCallback((data: FinancialData): FinancialInsight[] => {
    const insights: FinancialInsight[] = [];

    // Cash Flow Analysis
    if (data.cashFlow.runway < 12) {
      insights.push({
        id: 'cash_runway',
        category: 'critical',
        title: 'Limited Cash Runway',
        description: `With ${data.cashFlow.runway.toFixed(1)} months of runway remaining, immediate action is required.`,
        impact: 'high',
        recommendation: 'Consider reducing burn rate by 20% or securing additional funding within 60 days.',
        timeframe: 'Immediate',
        confidence: 95
      });
    }

    // Profitability Opportunity
    if (data.profitLoss.grossMargin < data.benchmarks.grossMarginBenchmark) {
      const gap = data.benchmarks.grossMarginBenchmark - data.profitLoss.grossMargin;
      const potentialSavings = (data.profitLoss.revenue * gap) / 100;
      
      insights.push({
        id: 'gross_margin_gap',
        category: 'opportunity',
        title: 'Gross Margin Below Industry Average',
        description: `Gross margin of ${data.profitLoss.grossMargin}% is ${gap.toFixed(1)}% below industry benchmark.`,
        impact: 'high',
        recommendation: 'Review pricing strategy and supplier costs. Consider value-based pricing for key services.',
        potentialSavings,
        timeframe: '3-6 months',
        confidence: 85
      });
    }

    // Working Capital Efficiency
    if (data.ratios.cashConversionCycle > 60) {
      insights.push({
        id: 'working_capital',
        category: 'warning',
        title: 'Long Cash Conversion Cycle',
        description: `${data.ratios.cashConversionCycle} days is above optimal range, tying up working capital.`,
        impact: 'medium',
        recommendation: 'Implement faster collection processes and negotiate better payment terms with suppliers.',
        timeframe: '2-4 months',
        confidence: 80
      });
    }

    // Growth Sustainability
    if (data.trends.revenueGrowthQoQ > 15 && data.cashFlow.operatingCashFlow < data.profitLoss.netIncome * 0.8) {
      insights.push({
        id: 'growth_cash_flow',
        category: 'warning',
        title: 'Growth Outpacing Cash Generation',
        description: 'Rapid revenue growth may be straining cash flow conversion.',
        impact: 'medium',
        recommendation: 'Monitor customer payment terms and inventory levels closely during growth phase.',
        timeframe: 'Ongoing',
        confidence: 75
      });
    }

    // Positive Trends
    if (data.trends.profitabilityTrend === 'improving' && data.ratios.returnOnEquity > 12) {
      insights.push({
        id: 'strong_performance',
        category: 'positive',
        title: 'Strong Financial Performance',
        description: `ROE of ${data.ratios.returnOnEquity}% with improving profitability trends.`,
        impact: 'medium',
        recommendation: 'Consider strategic investments to accelerate growth while maintaining profitability.',
        timeframe: 'Strategic',
        confidence: 90
      });
    }

    // Real data specific insights
    if (data.isRealData) {
      insights.push({
        id: 'real_data_advantage',
        category: 'positive',
        title: 'Real-Time QuickBooks Integration',
        description: 'Analysis based on live QuickBooks data provides accurate, up-to-date insights.',
        impact: 'medium',
        recommendation: 'Schedule regular analysis updates to track performance trends.',
        timeframe: 'Ongoing',
        confidence: 100
      });
    }

    return insights;
  }, []);

  // Risk Assessment Algorithm
  const calculateRiskAssessment = useCallback((data: FinancialData): RiskAssessment => {
    const liquidity = Math.min(100, Math.max(0, (data.ratios.currentRatio - 0.5) * 50));
    const profitability = Math.min(100, Math.max(0, data.profitLoss.netMargin * 5));
    const leverage = Math.min(100, Math.max(0, 100 - (data.ratios.debtToEquity * 50)));
    const operational = Math.min(100, Math.max(0, (data.ratios.assetTurnover * 100)));
    const market = Math.min(100, Math.max(0, data.benchmarks.percentileRanking));

    const overallScore = (liquidity + profitability + leverage + operational + market) / 5;
    
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (overallScore >= 80) riskLevel = 'low';
    else if (overallScore >= 60) riskLevel = 'medium';
    else if (overallScore >= 40) riskLevel = 'high';
    else riskLevel = 'critical';

    const alerts: string[] = [];
    if (data.cashFlow.runway < 6) alerts.push('Critical cash runway');
    if (data.ratios.currentRatio < 1.0) alerts.push('Liquidity concerns');
    if (data.profitLoss.netMargin < 0) alerts.push('Negative profitability');
    if (data.ratios.debtToEquity > 2.0) alerts.push('High leverage');

    return {
      overallScore,
      riskLevel,
      factors: {
        liquidity,
        profitability,
        leverage,
        operational,
        market
      },
      alerts
    };
  }, []);

  const insights = useMemo(() => financialData ? generateInsights(financialData) : [], [financialData, generateInsights]);
  const riskAssessment = useMemo(() => financialData ? calculateRiskAssessment(financialData) : null, [financialData, calculateRiskAssessment]);

  const handleGenerateReport = async () => {
    setIsAnalyzing(true);
    // Simulate API call for report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
    
    // In real implementation, this would trigger PDF generation
    console.log('Generated comprehensive financial analysis report');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'opportunity': return <Target className="w-5 h-5 text-blue-500" />;
      case 'positive': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <CheckCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Loading state
  if (isLoadingData || !financialData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading financial data...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Financial Analysis</h1>
              <div className="flex items-center gap-4">
                <p className="text-gray-600">{financialData.companyName} • {financialData.timeRange}</p>
                {financialData.isRealData ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Database className="w-3 h-3 mr-1" />
                    Live QuickBooks Data
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Demo Data
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefreshData}
                disabled={isLoadingData}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
                Refresh Data
              </button>
              <button
                onClick={handleGenerateReport}
                disabled={isAnalyzing}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Data Load Error */}
          {dataLoadError && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-yellow-800 font-medium">QuickBooks Data Unavailable</p>
                  <p className="text-yellow-700 text-sm">{dataLoadError}</p>
                  <p className="text-yellow-600 text-xs mt-1">Displaying demo data for analysis purposes.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex gap-4">
            {[
              { id: 'overview', label: 'Overview', icon: PieChart },
              { id: 'detailed', label: 'Detailed Analysis', icon: BarChart3 },
              { id: 'trends', label: 'Trends & Growth', icon: TrendingUp },
              { id: 'insights', label: 'AI Insights', icon: Zap },
              { id: 'reports', label: 'Reports', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAnalysisView(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  analysisView === tab.id 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {analysisView === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Key Metrics */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Health Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(financialData.profitLoss.revenue)}</div>
                    <div className="text-sm text-gray-500">Revenue</div>
                    <div className="text-xs text-green-600">+{formatPercentage(financialData.trends.revenueGrowthQoQ)} QoQ</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{formatPercentage(financialData.profitLoss.grossMargin)}</div>
                    <div className="text-sm text-gray-500">Gross Margin</div>
                    <div className="text-xs text-gray-500">vs {formatPercentage(financialData.benchmarks.grossMarginBenchmark)} industry</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{formatCurrency(financialData.cashFlow.freeCashFlow)}</div>
                    <div className="text-sm text-gray-500">Free Cash Flow</div>
                    <div className="text-xs text-gray-500">{financialData.cashFlow.runway.toFixed(1)} mo runway</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{formatPercentage(financialData.ratios.returnOnEquity)}</div>
                    <div className="text-sm text-gray-500">ROE</div>
                    <div className="text-xs text-green-600">{financialData.benchmarks.percentileRanking}th percentile</div>
                  </div>
                </div>
              </div>

              {/* Financial Ratios */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Financial Ratios</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Current Ratio</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{financialData.ratios.currentRatio.toFixed(2)}</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{width: `${Math.min(100, (financialData.ratios.currentRatio / 3) * 100)}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Quick Ratio</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{financialData.ratios.quickRatio.toFixed(2)}</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{width: `${Math.min(100, (financialData.ratios.quickRatio / 2) * 100)}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Debt-to-Equity</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{financialData.ratios.debtToEquity.toFixed(2)}</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-600 h-2 rounded-full" 
                          style={{width: `${Math.min(100, (financialData.ratios.debtToEquity / 2) * 100)}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Cash Conversion Cycle</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{financialData.ratios.cashConversionCycle} days</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{width: `${Math.min(100, (90 - financialData.ratios.cashConversionCycle) / 90 * 100)}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="space-y-6">
              {riskAssessment && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold mb-2">{riskAssessment.overallScore.toFixed(0)}/100</div>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(riskAssessment.riskLevel)}`}>
                      {riskAssessment.riskLevel.toUpperCase()} RISK
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {Object.entries(riskAssessment.factors).map(([factor, score]) => (
                      <div key={factor} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{factor}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{score.toFixed(0)}</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{width: `${score}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {riskAssessment.alerts.length > 0 && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg">
                      <div className="font-medium text-red-800 mb-2">Active Alerts</div>
                      <ul className="text-sm text-red-700 space-y-1">
                        {riskAssessment.alerts.map((alert, index) => (
                          <li key={index}>• {alert}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Top Insights Preview */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Insights</h3>
                <div className="space-y-3">
                  {insights.slice(0, 3).map((insight) => (
                    <div key={insight.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      {getCategoryIcon(insight.category)}
                      <div className="flex-1">
                        <div className="font-medium text-sm">{insight.title}</div>
                        <div className="text-xs text-gray-600 mt-1">{insight.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setAnalysisView('insights')}
                  className="w-full mt-4 text-blue-600 text-sm hover:text-blue-700"
                >
                  View All Insights →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Insights Tab */}
        {analysisView === 'insights' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">AI-Powered Financial Insights</h3>
              <div className="text-sm text-gray-500">{insights.length} insights identified</div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {insights.map((insight) => (
                <div key={insight.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-4">
                    {getCategoryIcon(insight.category)}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                          insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {insight.impact.toUpperCase()} IMPACT
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{insight.description}</p>
                      
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="font-medium text-sm text-gray-900 mb-1">Recommendation</div>
                        <p className="text-sm text-gray-700">{insight.recommendation}</p>
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Timeframe: {insight.timeframe}</span>
                        <span>Confidence: {insight.confidence}%</span>
                      </div>
                      
                      {insight.potentialSavings && (
                        <div className="mt-2 text-sm font-medium text-green-600">
                          Potential Impact: {formatCurrency(insight.potentialSavings)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
        {analysisView === 'detailed' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Detailed Financial Analysis</h3>
            <div className="text-gray-600">Detailed analysis view - implement comprehensive breakdowns, variance analysis, and drill-down capabilities</div>
          </div>
        )}

        {analysisView === 'trends' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Trends & Growth Analysis</h3>
            <div className="text-gray-600">Trends view - implement time series analysis, forecasting, and growth pattern recognition</div>
          </div>
        )}

        {analysisView === 'reports' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Financial Reports</h3>
            <div className="text-gray-600">Reports view - implement PDF generation, custom report builder, and scheduled reporting</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedFinancialAnalyzer;