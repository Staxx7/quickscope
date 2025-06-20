"use client"
import React, { useState, useMemo } from 'react';
import { BarChart3, Database, FileText, Zap, TrendingUp, AlertTriangle, DollarSign, Users, Clock, Target, Shield, Briefcase, Calendar, CheckCircle, ArrowRight, Settings, RefreshCw } from 'lucide-react';

interface AnalysisModule {
  id: string;
  name: string;
  description: string;
  status: 'ready' | 'processing' | 'completed' | 'error';
  lastUpdated?: string;
  metrics?: {
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'stable';
  }[];
  actions: {
    label: string;
    action: string;
    primary?: boolean;
  }[];
}

interface CompanyOverview {
  name: string;
  industry: string;
  fiscalYear: string;
  lastAnalysis: string;
  overallHealth: {
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    trend: 'improving' | 'stable' | 'declining';
  };
  keyMetrics: {
    revenue: number;
    growth: number;
    margin: number;
    cashflow: number;
    runway: number;
  };
  alerts: {
    critical: number;
    warnings: number;
    opportunities: number;
  };
}

const DeepFinancialDashboard: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>('overview');
  const [selectedCompany] = useState<string>('comp_001');

  // Mock company data
  const companyOverview: CompanyOverview = useMemo(() => ({
    name: 'TechStart Solutions Inc.',
    industry: 'Technology Services',
    fiscalYear: '2025',
    lastAnalysis: '2025-06-08T14:30:00Z',
    overallHealth: {
      score: 78,
      grade: 'B',
      trend: 'improving'
    },
    keyMetrics: {
      revenue: 2850000,
      growth: 28.3,
      margin: 50.0,
      cashflow: 425000,
      runway: 7.6
    },
    alerts: {
      critical: 1,
      warnings: 3,
      opportunities: 5
    }
  }), []);

  // Analysis modules
  const analysisModules: AnalysisModule[] = useMemo(() => [
    {
      id: 'data_extraction',
      name: 'QuickBooks Data Extraction',
      description: 'Deep extraction of financial data from QuickBooks with comprehensive analytics',
      status: 'completed',
      lastUpdated: '2025-06-08T10:30:00Z',
      metrics: [
        { label: 'Accounts Extracted', value: '247', trend: 'up' },
        { label: 'Transactions', value: '12,847', trend: 'up' },
        { label: 'Data Completeness', value: '98.3%', trend: 'stable' }
      ],
      actions: [
        { label: 'Re-extract Data', action: 'extract' },
        { label: 'Configure Extraction', action: 'configure' },
        { label: 'View Raw Data', action: 'view', primary: true }
      ]
    },
    {
      id: 'financial_analysis',
      name: 'Advanced Financial Analysis',
      description: 'AI-powered analysis with ratios, benchmarking, and predictive insights',
      status: 'completed',
      lastUpdated: '2025-06-08T11:15:00Z',
      metrics: [
        { label: 'Risk Score', value: '78/100', trend: 'up' },
        { label: 'Industry Percentile', value: '73rd', trend: 'up' },
        { label: 'Insights Generated', value: '23', trend: 'stable' }
      ],
      actions: [
        { label: 'Refresh Analysis', action: 'analyze' },
        { label: 'View Insights', action: 'insights', primary: true },
        { label: 'Compare Benchmarks', action: 'benchmark' }
      ]
    },
    {
      id: 'report_generation',
      name: 'AI Report Generation',
      description: 'Professional audit decks and comprehensive financial reports',
      status: 'ready',
      metrics: [
        { label: 'Reports Generated', value: '4', trend: 'up' },
        { label: 'Templates Available', value: '5', trend: 'stable' },
        { label: 'Avg Generation Time', value: '8.5 min', trend: 'down' }
      ],
      actions: [
        { label: 'Generate Report', action: 'generate', primary: true },
        { label: 'View Templates', action: 'templates' },
        { label: 'Download Reports', action: 'download' }
      ]
    },
    {
      id: 'call_integration',
      name: 'Call Transcript Analysis',
      description: 'Integration of sales call insights with financial data analysis',
      status: 'processing',
      metrics: [
        { label: 'Calls Analyzed', value: '8', trend: 'up' },
        { label: 'Insights Extracted', value: '34', trend: 'up' },
        { label: 'Financial Correlations', value: '12', trend: 'stable' }
      ],
      actions: [
        { label: 'Upload Transcript', action: 'upload' },
        { label: 'View Analysis', action: 'view_analysis', primary: true },
        { label: 'Configure Integration', action: 'configure' }
      ]
    }
  ], []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'ready': return 'text-gray-600 bg-gray-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'C': return 'text-yellow-600 bg-yellow-100';
      case 'D': return 'text-orange-600 bg-orange-100';
      case 'F': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Deep Financial Analysis</h1>
              <p className="text-gray-600">{companyOverview.name} • Comprehensive Financial Intelligence Platform</p>
            </div>
            <div className="flex gap-3">
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh All
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Company Overview Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Financial Health Score */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Financial Health</h3>
              <Shield className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{companyOverview.overallHealth.score}</div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(companyOverview.overallHealth.grade)}`}>
                Grade {companyOverview.overallHealth.grade}
              </div>
              <div className="text-xs text-gray-500 mt-2 capitalize">
                {companyOverview.overallHealth.trend}
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Revenue & Growth</h3>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {formatCurrency(companyOverview.keyMetrics.revenue)}
            </div>
            <div className="text-sm text-green-600">
              +{companyOverview.keyMetrics.growth}% YoY Growth
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {companyOverview.keyMetrics.margin}% Gross Margin
            </div>
          </div>

          {/* Cash Flow */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Cash Position</h3>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {formatCurrency(companyOverview.keyMetrics.cashflow)}
            </div>
            <div className="text-sm text-blue-600">Operating Cash Flow</div>
            <div className="text-xs text-gray-500 mt-2">
              {companyOverview.keyMetrics.runway} months runway
            </div>
          </div>

          {/* Alerts Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Active Alerts</h3>
              <AlertTriangle className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-600">Critical</span>
                <span className="font-semibold text-red-600">{companyOverview.alerts.critical}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-yellow-600">Warnings</span>
                <span className="font-semibold text-yellow-600">{companyOverview.alerts.warnings}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-600">Opportunities</span>
                <span className="font-semibold text-green-600">{companyOverview.alerts.opportunities}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Modules */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Analysis Modules</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analysisModules.map((module) => (
              <div key={module.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{module.name}</h4>
                    <p className="text-sm text-gray-600">{module.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(module.status)}`}>
                    {module.status.toUpperCase()}
                  </span>
                </div>

                {module.lastUpdated && (
                  <div className="text-xs text-gray-500 mb-4">
                    Last updated: {formatDate(module.lastUpdated)}
                  </div>
                )}

                {module.metrics && (
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {module.metrics.map((metric, index) => (
                      <div key={index} className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <span className="font-semibold text-gray-900">{metric.value}</span>
                          {metric.trend && getTrendIcon(metric.trend)}
                        </div>
                        <div className="text-xs text-gray-500">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  {module.actions.map((action, index) => (
                    <button
                      key={index}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        action.primary 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Generate Audit Deck</h3>
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-blue-100 text-sm mb-4">
              Create a comprehensive financial audit deck with AI-powered insights and recommendations.
            </p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2">
              Start Generation
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Deep Data Extraction</h3>
              <Database className="w-6 h-6" />
            </div>
            <p className="text-green-100 text-sm mb-4">
              Extract comprehensive financial data from QuickBooks with advanced analytics and validation.
            </p>
            <button className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2">
              Start Extraction
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Advanced Analysis</h3>
              <Zap className="w-6 h-6" />
            </div>
            <p className="text-purple-100 text-sm mb-4">
              Run AI-powered financial analysis with risk assessment, benchmarking, and predictive insights.
            </p>
            <button className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2">
              Run Analysis
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div className="flex-1">
                <div className="font-medium text-gray-900">Financial Analysis Completed</div>
                <div className="text-sm text-gray-600">Generated 23 insights with 78/100 risk score</div>
              </div>
              <div className="text-sm text-gray-500">2 hours ago</div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <Database className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <div className="font-medium text-gray-900">QuickBooks Data Extracted</div>
                <div className="text-sm text-gray-600">12,847 transactions processed with 98.3% completeness</div>
              </div>
              <div className="text-sm text-gray-500">3 hours ago</div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5 text-purple-500" />
              <div className="flex-1">
                <div className="font-medium text-gray-900">Q1 Audit Deck Generated</div>
                <div className="text-sm text-gray-600">42-page comprehensive report with executive summary</div>
              </div>
              <div className="text-sm text-gray-500">1 day ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeepFinancialDashboard;
