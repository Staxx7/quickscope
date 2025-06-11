'use client';
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart, Activity, AlertTriangle, CheckCircle, Calendar, FileText, Download, RefreshCw, Zap, Target, Users, Clock } from 'lucide-react';

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

interface AnalysisInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'trend' | 'action';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
}

const [selectedCompany, setSelectedCompany] = useState('TechCorp Solutions');

const AdvancedFinancialAnalyzer: React.FC = () => {
  const [metrics, setMetrics] = useState<FinancialMetric[]>([]);
  const [insights, setInsights] = useState<AnalysisInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    generateMockData();
  }, [selectedTimeframe]);

  const generateMockData = () => {
    const mockMetrics: FinancialMetric[] = [
      {
        id: 'revenue',
        name: 'Total Revenue',
        value: 145000,
        previousValue: 132000,
        change: 13000,
        changePercent: 9.8,
        trend: 'up',
        category: 'revenue'
      },
      {
        id: 'gross-profit',
        name: 'Gross Profit',
        value: 89000,
        previousValue: 81000,
        change: 8000,
        changePercent: 9.9,
        trend: 'up',
        category: 'profit'
      },
      {
        id: 'operating-expenses',
        name: 'Operating Expenses',
        value: 67000,
        previousValue: 71000,
        change: -4000,
        changePercent: -5.6,
        trend: 'down',
        category: 'expense'
      },
      {
        id: 'net-profit',
        name: 'Net Profit',
        value: 22000,
        previousValue: 10000,
        change: 12000,
        changePercent: 120,
        trend: 'up',
        category: 'profit'
      },
      {
        id: 'cash-flow',
        name: 'Operating Cash Flow',
        value: 28000,
        previousValue: 15000,
        change: 13000,
        changePercent: 86.7,
        trend: 'up',
        category: 'efficiency'
      },
      {
        id: 'conversion-rate',
        name: 'Lead Conversion Rate',
        value: 4.2,
        previousValue: 3.1,
        change: 1.1,
        changePercent: 35.5,
        trend: 'up',
        category: 'efficiency'
      }
    ];

    const mockInsights: AnalysisInsight[] = [
      {
        id: 'revenue-growth',
        type: 'opportunity',
        title: 'Revenue Growth Acceleration',
        description: 'Revenue growth has accelerated to 9.8% this period, driven by improved lead conversion and higher average deal sizes.',
        impact: 'high',
        confidence: 87
      },
      {
        id: 'expense-optimization',
        type: 'trend',
        title: 'Expense Reduction Success',
        description: 'Operating expenses decreased by 5.6% while maintaining revenue growth, indicating improved operational efficiency.',
        impact: 'medium',
        confidence: 92
      },
      {
        id: 'cash-flow-improvement',
        type: 'opportunity',
        title: 'Strong Cash Flow Position',
        description: 'Operating cash flow improved by 86.7%, providing strong foundation for growth investments.',
        impact: 'high',
        confidence: 95
      },
      {
        id: 'market-expansion',
        type: 'action',
        title: 'Market Expansion Opportunity',
        description: 'Current metrics suggest readiness for market expansion. Consider increasing marketing spend by 15-20%.',
        impact: 'medium',
        confidence: 78
      }
    ];

    setMetrics(mockMetrics);
    setInsights(mockInsights);
  };

  const runAdvancedAnalysis = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    generateMockData();
    setIsAnalyzing(false);
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Create and download report
    const reportContent = `Financial Analysis Report
Generated: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY
Total Revenue: $145,000 (+9.8%)
Net Profit: $22,000 (+120%)
Cash Flow: $28,000 (+86.7%)

KEY INSIGHTS
• Revenue growth acceleration driven by improved conversion
• Operating expense reduction of 5.6%
• Strong cash flow position enables growth investments
• Market expansion opportunity identified

RECOMMENDATIONS
1. Increase marketing spend by 15-20%
2. Continue operational efficiency improvements
3. Evaluate growth investment opportunities
4. Monitor cash flow for expansion timing

This is a comprehensive financial analysis report.`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Financial_Analysis_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setIsGeneratingReport(false);
  };

  const formatCurrency = (value: number) => {
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
      case 'risk': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'trend': return <TrendingUp className="w-4 h-4 text-blue-400" />;
      case 'action': return <Zap className="w-4 h-4 text-cyan-400" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900 p-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium text-white mb-2">Advanced Financial Analysis</h1>
            <p className="text-gray-300">AI-powered insights and predictive analytics for your business</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/25">
              <BarChart3 className="w-8 h-8 text-cyan-400" />
            </div>
            <button
              onClick={runAdvancedAnalysis}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Analyzing...' : 'Run Analysis'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-4 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex space-x-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'insights', label: 'AI Insights', icon: Zap },
              { id: 'detailed', label: 'Detailed Analysis', icon: FileText },
              { id: 'trends', label: 'Trends & Growth', icon: TrendingUp },
              { id: 'reports', label: 'Reports', icon: FileText }
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
          <div className="flex items-center space-x-4">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/25 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="7d" className="bg-slate-800 text-white">Last 7 Days</option>
              <option value="30d" className="bg-slate-800 text-white">Last 30 Days</option>
              <option value="90d" className="bg-slate-800 text-white">Last 90 Days</option>
              <option value="12m" className="bg-slate-800 text-white">Last 12 Months</option>
            </select>
            <button
              onClick={handleGenerateReport}
              disabled={isGeneratingReport}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2"
            >
              <Download className={`w-4 h-4 ${isGeneratingReport ? 'animate-bounce' : ''}`} />
              <span>{isGeneratingReport ? 'Generating...' : 'Generate Report'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map(metric => (
              <div key={metric.id} className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-white">{metric.name}</h3>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-semibold text-white">
                    {metric.category === 'efficiency' && metric.id === 'conversion-rate'
                      ? formatPercent(metric.value, true)
                      : formatCurrency(metric.value)
                    }
                  </div>
                  <div className={`flex items-center space-x-2 text-sm ${
                    metric.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <span>
                      {metric.change >= 0 ? '+' : ''}
                      {metric.category === 'efficiency' && metric.id === 'conversion-rate'
                        ? metric.change.toFixed(1)
                        : formatCurrency(metric.change)
                      }
                    </span>
                    <span>({formatPercent(Math.abs(metric.changePercent))})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Performance Summary */}
          <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <h2 className="text-xl font-medium text-white mb-4">Performance Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                <h3 className="font-medium text-white mb-3">Revenue Analysis</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Current Period</span>
                    <span className="text-white font-medium">{formatCurrency(145000)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Previous Period</span>
                    <span className="text-gray-400">{formatCurrency(132000)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Growth Rate</span>
                    <span className="text-green-400 font-medium">+9.8%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                <h3 className="font-medium text-white mb-3">Profitability</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Gross Margin</span>
                    <span className="text-white font-medium">61.4%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Net Margin</span>
                    <span className="text-white font-medium">15.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">EBITDA</span>
                    <span className="text-cyan-400 font-medium">{formatCurrency(35000)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-white">AI-Generated Insights</h2>
            <div className="text-sm text-gray-300">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>

          <div className="space-y-4">
            {insights.map(insight => (
              <div key={insight.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getInsightIcon(insight.type)}
                    <div>
                      <h3 className="font-medium text-white">{insight.title}</h3>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-300 capitalize">{insight.type}</span>
                        <span className="text-gray-500">•</span>
                        <span className={`font-medium ${getImpactColor(insight.impact)}`}>
                          {insight.impact.toUpperCase()} IMPACT
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-300">Confidence</div>
                    <div className="font-medium text-white">{insight.confidence}%</div>
                  </div>
                </div>
                <p className="text-gray-300">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Analysis Tab */}
      {activeTab === 'detailed' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <h3 className="text-xl font-medium text-white mb-4">Financial Ratios</h3>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                  <h4 className="font-medium text-white mb-3">Liquidity Ratios</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Current Ratio</span>
                      <span className="text-white font-medium">2.1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Quick Ratio</span>
                      <span className="text-white font-medium">1.8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Cash Ratio</span>
                      <span className="text-white font-medium">0.6</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                  <h4 className="font-medium text-white mb-3">Efficiency Ratios</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Asset Turnover</span>
                      <span className="text-white font-medium">1.4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Inventory Turnover</span>
                      <span className="text-white font-medium">8.2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Receivables Turnover</span>
                      <span className="text-white font-medium">12.3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <h3 className="text-xl font-medium text-white mb-4">Risk Assessment</h3>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                  <h4 className="font-medium text-white mb-3">Financial Health Score</h4>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="text-3xl font-bold text-green-400">85/100</div>
                    <div className="flex-1">
                      <div className="w-full bg-white/10 rounded-full h-3">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">Strong financial position with excellent liquidity and profitability metrics.</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Credit Risk</span>
                    <span className="text-green-400 font-medium">Low</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Liquidity Risk</span>
                    <span className="text-green-400 font-medium">Low</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Operational Risk</span>
                    <span className="text-yellow-400 font-medium">Medium</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Market Risk</span>
                    <span className="text-yellow-400 font-medium">Medium</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trends & Growth Tab */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <h3 className="text-xl font-medium text-white mb-4">Growth Trends</h3>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                  <h4 className="font-medium text-white mb-3">Revenue Growth</h4>
                  <div className="flex items-center space-x-3 mb-3">
                    <TrendingUp className="w-8 h-8 text-green-400" />
                    <div>
                      <div className="text-2xl font-semibold text-green-400">+9.8%</div>
                      <div className="text-sm text-gray-300">vs. previous period</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Q1 Growth</span>
                      <span className="text-white">+5.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Q2 Growth</span>
                      <span className="text-white">+7.1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Q3 Growth</span>
                      <span className="text-white">+9.8%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                  <h4 className="font-medium text-white mb-3">Profit Margin Trend</h4>
                  <div className="flex items-center space-x-3 mb-3">
                    <TrendingUp className="w-8 h-8 text-blue-400" />
                    <div>
                      <div className="text-2xl font-semibold text-blue-400">15.2%</div>
                      <div className="text-sm text-gray-300">current net margin</div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">Consistent improvement in profit margins over the last 3 quarters.</p>
                </div>
              </div>
            </div>

            <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <h3 className="text-xl font-medium text-white mb-4">Growth Projections</h3>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                  <h4 className="font-medium text-white mb-3">12-Month Forecast</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Projected Revenue</span>
                      <span className="text-cyan-400 font-medium">{formatCurrency(175000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Expected Growth</span>
                      <span className="text-green-400 font-medium">+20.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Confidence Level</span>
                      <span className="text-white font-medium">87%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                  <h4 className="font-medium text-white mb-3">Key Growth Drivers</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300">Market expansion initiatives</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300">Product line diversification</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span className="text-gray-300">Operational efficiency gains</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-white">Available Reports</h2>
            <button 
              onClick={handleGenerateReport}
              disabled={isGeneratingReport}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2"
            >
              <Download className={`w-4 h-4 ${isGeneratingReport ? 'animate-bounce' : ''}`} />
              <span>{isGeneratingReport ? 'Generating...' : 'Export All Reports'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Executive Summary', description: 'High-level financial overview', icon: Target, status: 'ready' },
              { name: 'Detailed Analysis', description: 'Comprehensive financial breakdown', icon: BarChart3, status: 'ready' },
              { name: 'Cash Flow Report', description: 'Operating cash flow analysis', icon: DollarSign, status: 'ready' },
              { name: 'Risk Assessment', description: 'Financial risk evaluation', icon: AlertTriangle, status: 'ready' },
              { name: 'Growth Projections', description: 'Future performance forecasts', icon: TrendingUp, status: 'ready' },
              { name: 'Benchmark Comparison', description: 'Industry performance comparison', icon: Activity, status: 'ready' }
            ].map((report, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25 hover:bg-white/15 transition-all duration-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <report.icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{report.name}</h3>
                    <p className="text-sm text-gray-300">{report.description}</p>
                  </div>
                  <div className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                    {report.status}
                  </div>
                </div>
                <button 
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                  className="w-full bg-white/10 border border-white/25 text-white px-4 py-2 rounded-lg hover:bg-white/15 transition-all duration-200 text-sm disabled:opacity-50"
                >
                  {isGeneratingReport ? 'Generating...' : 'Generate Report'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFinancialAnalyzer;
