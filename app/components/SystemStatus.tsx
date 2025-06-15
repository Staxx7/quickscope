'use client'

import { useState, useEffect } from 'react'
import { 
  Activity, 
  Database, 
  Users, 
  FileText, 
  Brain,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Zap,
  Shield,
  BarChart3
} from 'lucide-react'

interface SystemMetrics {
  connectedCompanies: number
  totalProspects: number
  reportsGenerated: number
  aiAnalyses: number
  callTranscripts: number
  lastSync: string
  systemHealth: number
  activeConnections: number
  dataProcessed: string
  apiStatus: 'operational' | 'degraded' | 'down'
  databaseStatus: 'operational' | 'degraded' | 'down'
  aiServiceStatus: 'operational' | 'degraded' | 'down'
}

export default function SystemStatus() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    fetchSystemMetrics()
    const interval = setInterval(fetchSystemMetrics, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchSystemMetrics = async () => {
    try {
      const response = await fetch('/api/system/metrics')
      if (response.ok) {
        const data = await response.json()
        setMetrics(data)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Error fetching system metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-400'
      case 'degraded': return 'text-yellow-400'
      case 'down': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="w-3 h-3" />
      case 'degraded': return <AlertCircle className="w-3 h-3" />
      case 'down': return <AlertCircle className="w-3 h-3" />
      default: return <Activity className="w-3 h-3" />
    }
  }

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-400'
    if (health >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  if (loading) {
    return (
      <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/30">
        <div className="flex items-center justify-center h-32">
          <RefreshCw className="w-6 h-6 text-white animate-spin" />
        </div>
      </div>
    )
  }

  const defaultMetrics: SystemMetrics = {
    connectedCompanies: 0,
    totalProspects: 0,
    reportsGenerated: 0,
    aiAnalyses: 0,
    callTranscripts: 0,
    lastSync: new Date().toISOString(),
    systemHealth: 100,
    activeConnections: 0,
    dataProcessed: '0 MB',
    apiStatus: 'operational',
    databaseStatus: 'operational',
    aiServiceStatus: 'operational'
  }

  const data = metrics || defaultMetrics

  return (
    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/30">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm flex items-center space-x-2">
          <Zap className="w-4 h-4 text-purple-400" />
          <span>System Status</span>
        </h3>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 ${getStatusColor(data.apiStatus)}`}>
            {getStatusIcon(data.apiStatus)}
            <span className="text-xs">Live</span>
          </div>
          <button
            onClick={fetchSystemMetrics}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Refresh metrics"
          >
            <RefreshCw className="w-3 h-3 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs mb-3">
        <div className="bg-white/10 rounded-lg p-2">
          <div className="flex items-center space-x-2 text-gray-400 mb-1">
            <Users className="w-3 h-3" />
            <span>Companies</span>
          </div>
          <div className="text-white font-semibold text-lg">{data.connectedCompanies}</div>
        </div>
        <div className="bg-white/10 rounded-lg p-2">
          <div className="flex items-center space-x-2 text-gray-400 mb-1">
            <FileText className="w-3 h-3" />
            <span>Reports</span>
          </div>
          <div className="text-white font-semibold text-lg">{data.reportsGenerated}</div>
        </div>
        <div className="bg-white/10 rounded-lg p-2">
          <div className="flex items-center space-x-2 text-gray-400 mb-1">
            <Brain className="w-3 h-3" />
            <span>AI Insights</span>
          </div>
          <div className="text-white font-semibold text-lg">{data.aiAnalyses}</div>
        </div>
        <div className="bg-white/10 rounded-lg p-2">
          <div className="flex items-center space-x-2 text-gray-400 mb-1">
            <Shield className="w-3 h-3" />
            <span>Health</span>
          </div>
          <div className={`font-semibold text-lg ${getHealthColor(data.systemHealth)}`}>
            {data.systemHealth}%
          </div>
        </div>
      </div>

      {/* Service Status */}
      <div className="space-y-2 mb-3">
        <div className="text-xs text-gray-400 font-medium mb-1">Service Status</div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300 flex items-center space-x-1">
              <Database className="w-3 h-3" />
              <span>Database</span>
            </span>
            <span className={`flex items-center space-x-1 ${getStatusColor(data.databaseStatus)}`}>
              {getStatusIcon(data.databaseStatus)}
              <span className="capitalize">{data.databaseStatus}</span>
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300 flex items-center space-x-1">
              <Activity className="w-3 h-3" />
              <span>API Services</span>
            </span>
            <span className={`flex items-center space-x-1 ${getStatusColor(data.apiStatus)}`}>
              {getStatusIcon(data.apiStatus)}
              <span className="capitalize">{data.apiStatus}</span>
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300 flex items-center space-x-1">
              <Brain className="w-3 h-3" />
              <span>AI Engine</span>
            </span>
            <span className={`flex items-center space-x-1 ${getStatusColor(data.aiServiceStatus)}`}>
              {getStatusIcon(data.aiServiceStatus)}
              <span className="capitalize">{data.aiServiceStatus}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="pt-3 border-t border-white/20">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-gray-400">Recent Activity</span>
          <span className="text-gray-400">{formatTimeAgo(lastUpdate.toISOString())}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Active Users</span>
            <span className="text-white font-medium">{data.activeConnections}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Data Processed</span>
            <span className="text-white font-medium">{data.dataProcessed}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Transcripts</span>
            <span className="text-white font-medium">{data.callTranscripts}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Last Sync</span>
            <span className="text-white font-medium">{formatTimeAgo(data.lastSync)}</span>
          </div>
        </div>
      </div>

      {/* Performance Indicator */}
      <div className="mt-3 pt-3 border-t border-white/20">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">System Performance</span>
          <TrendingUp className="w-3 h-3 text-green-400" />
        </div>
        <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              data.systemHealth >= 90 ? 'bg-green-400' :
              data.systemHealth >= 70 ? 'bg-yellow-400' : 'bg-red-400'
            }`}
            style={{ width: `${data.systemHealth}%` }}
          />
        </div>
      </div>
    </div>
  )
}