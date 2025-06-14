'use client'
import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('QuickScope Error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error?: Error; resetError: () => void }> = ({ 
  error, 
  resetError 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900 flex items-center justify-center p-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-8 text-center max-w-md w-full">
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
        <p className="text-gray-300 mb-6">
          We encountered an unexpected error. Don't worry, your data is safe.
        </p>
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6 text-left">
            <p className="text-red-300 text-sm font-mono">{error.message}</p>
          </div>
        )}
        <div className="flex space-x-3">
          <button
            onClick={resetError}
            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <button
            onClick={() => window.location.href = '/admin/dashboard/main'}
            className="flex-1 bg-white/10 border border-white/25 text-white px-4 py-3 rounded-xl hover:bg-white/15 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
