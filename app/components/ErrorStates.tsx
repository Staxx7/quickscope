import React from 'react'
import { AlertCircle, RefreshCw, Loader2, Database, WifiOff } from 'lucide-react'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

interface LoadingStateProps {
  message?: string
}

export const NoDataError: React.FC<ErrorStateProps> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
    <Database className="w-16 h-16 text-gray-400 mb-4" />
    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h3>
    <p className="text-gray-600 mb-6 text-center max-w-md">
      {message || 'Unable to load data. Please ensure you have connected your QuickBooks account and have the necessary permissions.'}
    </p>
    {onRetry && (
      <button 
        onClick={onRetry} 
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Try Again</span>
      </button>
    )}
  </div>
)

export const ConnectionError: React.FC<ErrorStateProps> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
    <WifiOff className="w-16 h-16 text-red-400 mb-4" />
    <h3 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h3>
    <p className="text-gray-600 mb-6 text-center max-w-md">
      {message || 'Unable to connect to the server. Please check your internet connection and try again.'}
    </p>
    {onRetry && (
      <button 
        onClick={onRetry} 
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Retry Connection</span>
      </button>
    )}
  </div>
)

export const LoadingState: React.FC<LoadingStateProps> = ({ message }) => (
  <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
    <Loader2 className="w-16 h-16 animate-spin text-blue-500 mb-4" />
    <p className="text-lg text-gray-600">{message || 'Loading data...'}</p>
  </div>
)

export const QuickBooksNotConnected: React.FC<{ onConnect?: () => void }> = ({ onConnect }) => (
  <div className="flex flex-col items-center justify-center p-8 min-h-[400px] bg-yellow-50 rounded-lg">
    <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
    <h3 className="text-xl font-semibold text-gray-900 mb-2">QuickBooks Not Connected</h3>
    <p className="text-gray-600 mb-6 text-center max-w-md">
      To view financial data and generate reports, please connect your QuickBooks account.
    </p>
    {onConnect ? (
      <button 
        onClick={onConnect} 
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
      >
        Connect QuickBooks
      </button>
    ) : (
      <a 
        href="/connect" 
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
      >
        Connect QuickBooks
      </a>
    )}
  </div>
)

export const InvalidDataState: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
    <AlertCircle className="w-16 h-16 text-orange-400 mb-4" />
    <h3 className="text-xl font-semibold text-gray-900 mb-2">Invalid Data Format</h3>
    <p className="text-gray-600 text-center max-w-md">
      {message || 'The data received is not in the expected format. Please contact support if this issue persists.'}
    </p>
  </div>
)

// Data source indicator for development
export const DataSourceIndicator: React.FC<{ source: 'live' | 'mock' | 'demo' }> = ({ source }) => {
  if (process.env.NODE_ENV !== 'development') return null
  
  const getColor = () => {
    switch (source) {
      case 'live':
        return 'bg-green-500'
      case 'mock':
        return 'bg-yellow-500'
      case 'demo':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }
  
  return (
    <div className={`fixed bottom-4 right-4 ${getColor()} text-white px-3 py-1 rounded text-xs font-medium shadow-lg z-50`}>
      {source.toUpperCase()} DATA
    </div>
  )
}