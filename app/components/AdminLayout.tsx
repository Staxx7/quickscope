'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, Users, FileText, Settings, HelpCircle, LogOut, 
  Menu, X, Zap, Bell, RefreshCw, ChevronDown, CheckCircle, 
  Briefcase, DollarSign, Brain, Target, Shield, Award, Calculator,
  TrendingUp, Home, Database, Mic
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home, color: 'blue', description: 'Main overview and KPIs' },
    { name: 'Account Workflow', href: '/admin/dashboard', icon: Briefcase, color: 'green', description: 'Track prospect progress' },
    { name: 'Call Transcripts', href: '/admin/dashboard/call-transcripts', icon: Mic, badge: 'New', color: 'purple', description: 'Upload and analyze client calls' },
    { name: 'Data Extraction', href: '/admin/dashboard/data-extraction', icon: Database, badge: 'Live Data', color: 'cyan', description: 'Extract live QuickBooks data' },
    { name: 'Financial Analysis', href: '/admin/dashboard/advanced-analysis', icon: BarChart3, badge: 'AI-Powered', color: 'orange', description: 'AI-powered financial insights' },
    { name: 'Report Generation', href: '/admin/dashboard/report-generation', icon: FileText, badge: 'Pro', color: 'indigo', description: 'Generate audit decks' }
];

const systemStats = {
  connectedCompanies: 12,
  reportsGenerated: 47,
  aiInsights: 156,
  systemHealth: 98,
  lastSync: '2 minutes ago',
};

export default function AdminLayout({ children, currentPage = 'Dashboard' }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const getColorClasses = (color: string, isActive = false) => {
    const colors: { [key: string]: string } = {
      blue: isActive ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'text-blue-400',
      green: isActive ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'text-green-400',
      purple: isActive ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'text-purple-400',
      cyan: isActive ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 'text-cyan-400',
      orange: isActive ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' : 'text-orange-400',
      indigo: isActive ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'text-indigo-400'
    };
    return colors[color] || colors.blue;
  };

  const getBadgeColor = (color: string) => {
    const badgeColors: { [key: string]: string } = {
      blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      green: 'bg-green-500/20 text-green-300 border-green-500/30',
      purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      orange: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      indigo: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    };
    return badgeColors[color] || badgeColors.blue;
  };

  const SidebarContent = () => (
    <div className="flex flex-1 flex-col overflow-y-auto pt-6 pb-4">
      <div className="flex flex-shrink-0 items-center px-6 mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">QuickScope</h1>
            <p className="text-sm text-purple-300">Enhanced AI Platform</p>
          </div>
        </div>
      </div>
      <div className="px-6 mb-6">
        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold text-sm">System Status</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400 text-xs">Online</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div><div className="text-gray-400">Companies</div><div className="text-white font-semibold">{systemStats.connectedCompanies}</div></div>
            <div><div className="text-gray-400">Reports</div><div className="text-white font-semibold">{systemStats.reportsGenerated}</div></div>
            <div><div className="text-gray-400">AI Insights</div><div className="text-white font-semibold">{systemStats.aiInsights}</div></div>
            <div><div className="text-gray-400">Health</div><div className="text-green-400 font-semibold">{systemStats.systemHealth}%</div></div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/20"><div className="flex items-center justify-between text-xs"><span className="text-gray-400">Last sync</span><span className="text-white">{systemStats.lastSync}</span></div></div>
        </div>
      </div>
      <nav className="flex-1 space-y-2 px-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className={`group flex items-center px-4 py-4 text-sm font-medium rounded-xl transition-all duration-200 ${isActive ? `${getColorClasses(item.color, true)} border` : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>
              <Icon className={`mr-4 h-5 w-5 ${isActive ? '' : getColorClasses(item.color)} group-hover:text-gray-300`} />
              <div className="flex-1">
                <div className="flex items-center justify-between"><span className="font-medium">{item.name}</span>{item.badge && (<span className={`text-xs px-2 py-0.5 rounded-full border ${getBadgeColor(item.color)}`}>{item.badge}</span>)}</div>
                <div className="text-xs text-gray-400 mt-1">{item.description}</div>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900">
        <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white/10 backdrop-blur-lg border-r border-white/20">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button type="button" className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400" onClick={() => setSidebarOpen(false)}><X className="h-6 w-6 text-white" /></button>
            </div>
            <SidebarContent />
          </div>
        </div>
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-80 md:flex-col"><div className="flex min-h-0 flex-1 flex-col bg-white/10 backdrop-blur-lg border-r border-white/20"><SidebarContent /></div></div>
        <div className="md:pl-80">
          <div className="sticky top-0 z-10 bg-white/10 backdrop-blur-lg border-b border-white/20">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
              <button type="button" className="md:hidden bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20" onClick={() => setSidebarOpen(true)}><Menu className="h-6 w-6 text-white" /></button>
              <div className="flex items-center space-x-4"><div className="text-sm text-gray-200">QuickScope Enhanced AI Dashboard</div></div>
            </div>
          </div>
          <main className="flex-1">
            <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
              <div className="px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{currentPage}</h2>
                    <p className="text-sm text-gray-400 mt-1">AI-enhanced financial analysis and insights platform</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button onClick={async () => { try { const response = await fetch('/api/qbo/sync', { method: 'POST' }); if (response.ok) { window.location.reload(); } } catch (error) { console.error('Sync failed:', error); } }} className="bg-white/10 border border-white/25 text-white px-3 py-2 rounded-lg hover:bg-white/15 transition-all text-sm flex items-center space-x-2"><RefreshCw className="w-4 h-4" /><span>Sync All</span></button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6 lg:p-8">{children}</div>
          </main>
        </div>
      </div>
  );
}
