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
  Zap
} from 'lucide-react'

const navigation = [
  {
    name: 'Sales Pipeline',
    href: '/admin/dashboard/main',
    icon: Target,
    description: 'Manage prospects and sales pipeline'
  },
  {
    name: 'Data Extraction',
    href: '/admin/dashboard/data-extraction',
    icon: Database,
    description: 'Extract and process QuickBooks data'
  },
  {
    name: 'Advanced Analysis',
    href: '/admin/dashboard/advanced-analysis',
    icon: TrendingUp,
    description: 'AI-powered financial analytics'
  },
  {
    name: 'Report Generation',
    href: '/admin/dashboard/report-generation',
    icon: FileText,
    description: 'Generate professional reports'
  },
  {
    name: 'Call Transcripts',
    href: '/admin/dashboard/call-transcripts',
    icon: Mic,
    description: 'Upload and analyze client call transcripts'
  }
]

interface AdminLayoutProps {
  children: React.ReactNode
  currentPage?: string
}

export default function AdminLayout({ children, currentPage }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

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
              <h1 className="text-2xl font-bold text-white">QuickScope</h1>
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
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-purple-300' : 'text-gray-400'}`} />
                    <div>
                      <div>{item.name}</div>
                      <div className="text-xs text-gray-400">{item.description}</div>
                    </div>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-72 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white/10 backdrop-blur-lg border-r border-white/20">
          <div className="flex flex-1 flex-col overflow-y-auto pt-6 pb-4">
            <div className="flex flex-shrink-0 items-center px-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">QuickScope</h1>
              </div>
            </div>
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
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className={`mr-4 h-5 w-5 ${isActive ? 'text-purple-300' : 'text-gray-400 group-hover:text-gray-300'}`} />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-400 mt-1">{item.description}</div>
                    </div>
                  </Link>
                )
              })}
            </nav>
            
            {/* Bottom section */}
            <div className="px-4 pt-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <div className="text-center">
                  <h3 className="text-white font-semibold mb-1">QuickScope Pro</h3>
                  <p className="text-gray-300 text-xs mb-3">Advanced financial analytics</p>
                  <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <p className="text-gray-400 text-xs">70% of features used</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-72">
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
                QuickScope Admin Dashboard
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
