'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Database, 
  FileText, 
  Menu, 
  X,
  Mic,
  TrendingUp,
  Target,
  Zap,
  Brain,
  BarChart3,
  Users,
  Settings,
  Shield,
  Presentation,
  Eye,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'

const navigation = [
  {
    name: 'Account Workflow',
    href: '/admin',  // Changed from /admin/dashboard/main
    icon: Target,
    description: 'Connected accounts with workflow progress tracking',
    badge: null,
    color: 'blue'
  },
  {
    name: 'Call Transcripts',
    href: '/admin/dashboard/call-transcripts',
    icon: Mic,
    description: 'Upload and analyze client call transcripts',
    badge: 'New',
    color: 'cyan'
  },
  {
    name: 'Data Extraction',
    href: '/admin/dashboard/data-extraction',
    icon: Database,
    description: 'Extract live QuickBooks financial data',
    badge: 'Live Data',
    color: 'green'
  },
  {
    name: 'Financial Analysis',
    href: '/admin/dashboard/advanced-analysis',
    icon: Brain,
    description: 'AI-powered financial insights and analysis',
    badge: 'AI-Powered',
    color: 'purple'
  },
  {
    name: 'Report Generation',
    href: '/admin/dashboard/report-generation',
    icon: FileText,
    description: 'Generate audit decks and financial reports',
    badge: 'Pro',
    color: 'indigo'
  }
]

const quickActions = [
  {
    name: 'Generate Audit Deck',
    icon: Presentation,
    action: 'audit',
    color: 'from-orange-500 to-red-500',
    description: 'Create intelligent presentation'
  },
  {
    name: 'Run AI Analysis',
    icon: Brain,
    action: 'analysis',
    color: 'from-purple-500 to-pink-500',
    description: 'Deep financial intelligence'
  },
  {
    name: 'Process Call Recording',
    icon: Mic,
    action: 'transcript',
    color: 'from-cyan-500 to-blue-500',
    description: 'Extract call insights'
  },
  {
    name: 'Extract Live Data',
    icon: Database,
    action: 'extract',
    color: 'from-green-500 to-teal-500',
    description: 'Pull latest QBO data'
  }
]

const systemStats = {
  connectedCompanies: 12,
  reportsGenerated: 47,
  callsAnalyzed: 23,
  aiInsights: 156,
  lastSync: '2 minutes ago',
  systemHealth: 98
}

interface AdminLayoutProps {
  children: React.ReactNode
  currentPage?: string
}

export default function EnhancedAdminLayout({ children, currentPage }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [quickActionOpen, setQuickActionOpen] = useState(false)
  const pathname = usePathname()

  const getColorClasses = (color: string, isActive: boolean = false) => {
    const colors = {
      blue: isActive ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'text-blue-400',
      green: isActive ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'text-green-400',
      purple: isActive ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'text-purple-400',
      cyan: isActive ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 'text-cyan-400',
      orange: isActive ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' : 'text-orange-400',
      indigo: isActive ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'text-indigo-400'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getBadgeColor = (color: string) => {
    const badgeColors = {
      blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      green: 'bg-green-500/20 text-green-300 border-green-500/30',
      purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      orange: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      indigo: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    }
    return badgeColors[color as keyof typeof badgeColors] || badgeColors.blue
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white/10 backdrop-blur-lg border-r border-white/20">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">QuickScope</h1>
                  <p className="text-xs text-purple-300">Enhanced AI Platform</p>
                </div>
              </div>
            </div>
            <nav className="space-y-2 px-3">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? `${getColorClasses(item.color, true)} border`
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? '' : getColorClasses(item.color)}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span>{item.name}</span>
                        {item.badge && (
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${getBadgeColor(item.color)}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{item.description}</div>
                    </div>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-80 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white/10 backdrop-blur-lg border-r border-white/20">
          <div className="flex flex-1 flex-col overflow-y-auto pt-6 pb-4">
            {/* Logo */}
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

            {/* System Status */}
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
                  <div>
                    <div className="text-gray-400">Companies</div>
                    <div className="text-white font-semibold">{systemStats.connectedCompanies}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Reports</div>
                    <div className="text-white font-semibold">{systemStats.reportsGenerated}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">AI Insights</div>
                    <div className="text-white font-semibold">{systemStats.aiInsights}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Health</div>
                    <div className="text-green-400 font-semibold">{systemStats.systemHealth}%</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Last sync</span>
                    <span className="text-white">{systemStats.lastSync}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 px-4">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-4 py-4 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? `${getColorClasses(item.color, true)} border`
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className={`mr-4 h-5 w-5 ${isActive ? '' : getColorClasses(item.color)} group-hover:text-gray-300`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.name}</span>
                        {item.badge && (
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${getBadgeColor(item.color)}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{item.description}</div>
                    </div>
                  </Link>
                )
              })}
            </nav>
            
            {/* Quick Actions */}
            <div className="px-4 pt-6">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold text-sm">Quick Actions</h3>
                  <button
                    onClick={() => setQuickActionOpen(!quickActionOpen)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <button
                        key={action.name}
                        className={`relative overflow-hidden bg-gradient-to-r ${action.color} p-3 rounded-lg text-white text-xs font-medium hover:scale-105 transition-transform duration-200`}
                        title={action.description}
                      >
                        <div className="flex flex-col items-center space-y-1">
                          <Icon className="w-4 h-4" />
                          <span className="text-center leading-tight">{action.name}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="px-4 pt-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <div className="text-center">
                  <h3 className="text-white font-semibold mb-2 text-sm">AI Performance</h3>
                  <div className="text-2xl font-bold text-cyan-400 mb-1">94.7%</div>
                  <div className="text-xs text-gray-400 mb-3">Accuracy Score</div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full" style={{ width: '94.7%' }}></div>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">Enhanced with latest models</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-80">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 bg-white/10 backdrop-blur-lg border-b border-white/20">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              className="md:hidden bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6 text-white" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-200">
                QuickScope Enhanced AI Dashboard
              </div>
              
              {/* Real-time Indicators */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-300">Live Data</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-gray-300">AI Active</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-300">Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {/* Enhanced breadcrumb/page header */}
          <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {currentPage || 'Dashboard'}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    AI-enhanced financial analysis and insights platform
                  </p>
                </div>
                
                {/* Action buttons */}
                <div className="flex items-center space-x-3">
                  <button className="bg-white/10 border border-white/25 text-white px-3 py-2 rounded-lg hover:bg-white/15 transition-all text-sm flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4" />
                    <span>Sync All</span>
                  </button>
                  <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-sm flex items-center space-x-2">
                    <Brain className="w-4 h-4" />
                    <span>AI Assist</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Global notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {/* AI Processing Indicator */}
        <div className="bg-purple-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-purple-500/50 flex items-center space-x-2">
          <Brain className="w-4 h-4 animate-pulse" />
          <span className="text-sm">AI Processing Active</span>
        </div>
        
        {/* System Health */}
        <div className="bg-green-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-green-500/50 flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">All Systems Operational</span>
        </div>
      </div>
    </div>
  )
}
