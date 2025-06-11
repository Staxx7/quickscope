'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3, TrendingUp, DollarSign, Users, FileText, Phone,
  Database, Settings, Bell, Search, Filter, Calendar, Download,
  Activity, Target, Shield, Brain, Globe, CreditCard, PieChart,
  LineChart, Building2, Zap, Award, Clock, ArrowRight, Eye,
  RefreshCw, AlertTriangle, CheckCircle, Star, Flag, ThumbsUp
} from 'lucide-react';

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  status: 'active' | 'beta' | 'coming-soon';
  stats?: {
    value: string;
    label: string;
    trend?: 'up' | 'down' | 'stable';
  };
  notifications?: number;
}

const AdminDashboardMain: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const dashboardCards: DashboardCard[] = [
    {
      id: 'main-dashboard',
      title: 'Main Dashboard',
      description: 'Quick access overview with system status, recent activity, and key performance metrics',
      icon: BarChart3,
      route: '/admin/dashboard/main',
      status: 'active',
      stats: {
        value: '42',
        label: 'Active Projects',
        trend: 'up'
      }
    },
    {
      id: 'account-workflow',
      title: 'Account Workflow Dashboard',
      description: 'Manage QuickBooks integrations and audit deck generation workflow with progress tracking',
      icon: Building2,
      route: '/admin/dashboard/main',
      status: 'active',
      stats: {
        value: '5',
        label: 'Connected Accounts',
        trend: 'stable'
      }
    },
    {
      id: 'advanced-analysis',
      title: 'Advanced Financial Analysis',
      description: 'Comprehensive AI-powered financial insights with health scoring, risk assessment, and benchmarking',
      icon: TrendingUp,
      route: '/admin/dashboard/advanced-analysis',
      status: 'active',
      stats: {
        value: '78/100',
        label: 'Health Score',
        trend: 'up'
      },
      notifications: 2
    },
    {
      id: 'data-extraction',
      title: 'Advanced Data Extraction',
      description: 'Extract and process comprehensive QuickBooks financial data with quality assessment and export templates',
      icon: Database,
      route: '/admin/dashboard/data-extraction',
      status: 'active',
      stats: {
        value: '94%',
        label: 'Data Quality',
        trend: 'up'
      }
    },
    {
      id: 'report-generation',
      title: 'AI Report Generator',
      description: 'Generate comprehensive business reports powered by AI with custom templates and automated insights',
      icon: FileText,
      route: '/admin/dashboard/report-generation',
      status: 'active',
      stats: {
        value: '0',
        label: 'Reports Generated',
        trend: 'stable'
      }
    },
    {
      id: 'call-transcripts',
      title: 'Call Transcript Management',
      description: 'Upload and analyze client call transcripts for enhanced context and automated action item extraction',
      icon: Phone,
      route: '/admin/dashboard/call-transcripts',
      status: 'active',
      stats: {
        value: '1',
        label: 'Transcripts Processed',
        trend: 'up'
      },
      notifications: 1
    },
    {
      id: 'sales-pipeline',
      title: 'Sales Pipeline',
      description: 'Manage prospects and sales pipeline with integrated QuickBooks data and opportunity tracking',
      icon: Users,
      route: '/admin/sales-pipeline',
      status: 'active',
      stats: {
        value: '28',
        label: 'Active Prospects',
        trend: 'up'
      }
    },
    {
      id: 'advanced-analysis',
      title: 'Advanced Analysis',
      description: 'Deep-dive financial modeling, predictive analytics, and comprehensive business intelligence',
      icon: Brain,
      route: '/admin/advanced-analysis',
      status: 'active',
      stats: {
        value: '94%',
        label: 'Accuracy Rate',
        trend: 'up'
      }
    },
    {
      id: 'client-portal',
      title: 'Client Portal',
      description: 'Secure client access to reports, dashboards, and collaborative financial planning tools',
      icon: Users,
      route: '/admin/client-portal',
      status: 'beta',
      stats: {
        value: '28',
        label: 'Active Clients',
        trend: 'up'
      }
    },
    {
      id: 'ai-insights',
      title: 'AI Strategic Insights',
      description: 'Machine learning-powered business recommendations and predictive financial modeling',
      icon: Zap,
      route: '/admin/ai-insights',
      status: 'active',
      stats: {
        value: '23',
        label: 'Active Insights',
        trend: 'up'
      },
      notifications: 5
    },
    {
      id: 'risk-management',
      title: 'Risk Management',
      description: 'Comprehensive risk assessment, monitoring, and mitigation strategy recommendations',
      icon: Shield,
      route: '/admin/risk-management',
      status: 'active',
      stats: {
        value: 'Low',
        label: 'Risk Level',
        trend: 'stable'
      }
    },
    {
      id: 'benchmarking',
      title: 'Industry Benchmarking',
      description: 'Compare performance against industry standards and competitive intelligence',
      icon: Award,
      route: '/admin/benchmarking',
      status: 'active',
      stats: {
        value: 'Top 15%',
        label: 'Industry Rank',
        trend: 'up'
      }
    },
    {
      id: 'automation',
      title: 'Process Automation',
      description: 'Automate routine financial tasks, reporting, and data processing workflows',
      icon: RefreshCw,
      route: '/admin/automation',
      status: 'beta',
      stats: {
        value: '67%',
        label: 'Time Saved',
        trend: 'up'
      }
    },
    {
      id: 'settings',
      title: 'System Settings',
      description: 'Configure system preferences, user management, and integration settings',
      icon: Settings,
      route: '/admin/settings',
      status: 'active'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Modules', count: dashboardCards.length },
    { id: 'financial', label: 'Financial', count: dashboardCards.filter(card => 
      ['financial-analysis', 'advanced-analysis', 'benchmarking', 'risk-management'].includes(card.id)).length },
    { id: 'data', label: 'Data & AI', count: dashboardCards.filter(card => 
      ['data-extractor', 'ai-insights', 'call-transcripts', 'automation'].includes(card.id)).length },
    { id: 'client', label: 'Client Management', count: dashboardCards.filter(card => 
      ['client-portal', 'connected-accounts', 'report-generation'].includes(card.id)).length },
    { id: 'system', label: 'System', count: dashboardCards.filter(card => 
      ['settings'].includes(card.id)).length }
  ];

  const filteredCards = dashboardCards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'financial' && ['financial-analysis', 'advanced-analysis', 'benchmarking', 'risk-management'].includes(card.id)) ||
      (selectedCategory === 'data' && ['data-extractor', 'ai-insights', 'call-transcripts', 'automation'].includes(card.id)) ||
      (selectedCategory === 'client' && ['client-portal', 'connected-accounts', 'report-generation'].includes(card.id)) ||
      (selectedCategory === 'system' && ['settings'].includes(card.id));

    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'beta': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'coming-soon': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'down': return <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />;
      default: return <Activity className="w-3 h-3 text-gray-400" />;
    }
  };

  const totalNotifications = dashboardCards.reduce((sum, card) => sum + (card.notifications || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900 p-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">QuickScope Admin Dashboard</h1>
                <p className="text-gray-300">Comprehensive financial intelligence and business analytics platform</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-gray-400 text-sm">Active Modules</div>
                <div className="text-white font-medium">{dashboardCards.filter(c => c.status === 'active').length}</div>
                <div className="text-green-400 text-xs">Operational</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-gray-400 text-sm">Beta Features</div>
                <div className="text-white font-medium">{dashboardCards.filter(c => c.status === 'beta').length}</div>
                <div className="text-yellow-400 text-xs">Testing</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-gray-400 text-sm">Notifications</div>
                <div className="text-white font-medium">{totalNotifications}</div>
                <div className="text-blue-400 text-xs">Pending</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-gray-400 text-sm">System Status</div>
                <div className="text-green-400 font-medium">Operational</div>
                <div className="text-gray-500 text-xs">99.9% uptime</div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {totalNotifications > 0 && (
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-400" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">{totalNotifications}</span>
                </div>
              </div>
            )}
            <div className="text-right">
              <div className="text-sm text-gray-400">Last Updated</div>
              <div className="text-white font-medium">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search modules and features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/25 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-500/30'
                    : 'bg-white/10 text-gray-300 hover:bg-white/15 hover:text-white border border-white/25'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            onClick={() => router.push(card.route)}
            className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/12 transition-all duration-300 cursor-pointer group relative overflow-hidden"
          >
            {/* Notification Badge */}
            {card.notifications && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-medium">{card.notifications}</span>
              </div>
            )}

            {/* Status Badge */}
            <div className={`absolute top-4 left-4 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(card.status)}`}>
              {card.status === 'coming-soon' ? 'Coming Soon' : card.status.charAt(0).toUpperCase() + card.status.slice(1)}
            </div>

            {/* Card Content */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/10">
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">{card.description}</p>

              {/* Stats */}
              {card.stats && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                  <div>
                    <div className="text-white font-bold">{card.stats.value}</div>
                    <div className="text-gray-400 text-xs">{card.stats.label}</div>
                  </div>
                  {card.stats.trend && (
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(card.stats.trend)}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredCards.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No modules found</h3>
          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Footer Stats */}
      <div className="mt-12 bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400">98.9%</div>
            <div className="text-gray-400 text-sm">System Uptime</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">847ms</div>
            <div className="text-gray-400 text-sm">Avg Response Time</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">1.2M+</div>
            <div className="text-gray-400 text-sm">Data Points Processed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-cyan-400">24/7</div>
            <div className="text-gray-400 text-sm">Support Available</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardMain;
