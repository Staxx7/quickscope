'use client';

import React, { useState } from 'react';
import { Shield, Zap, Users, Building2, ArrowRight, CheckCircle } from 'lucide-react';

export default function ConnectPage() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleQuickBooksConnect = async () => {
    setIsConnecting(true);
    
    // This will eventually connect to your QuickBooks OAuth endpoint
    // For now, we'll simulate the connection
    try {
      // Replace this with your actual QuickBooks OAuth URL
      const quickbooksAuthUrl = `https://appcenter.intuit.com/connect/oauth2?` +
        `client_id=YOUR_CLIENT_ID&` +
        `scope=com.intuit.quickbooks.accounting&` +
        `redirect_uri=${encodeURIComponent('https://www.quickscope.info/success')}&` +
        `response_type=code&` +
        `access_type=offline`;
      
      // For demo purposes, we'll redirect to success page after a short delay
      setTimeout(() => {
        window.location.href = '/success?company=Demo%20Company';
      }, 2000);
      
    } catch (error) {
      console.error('Connection error:', error);
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">QUICKSCOPE</span>
            <span className="text-sm text-gray-400">by STAXX</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Connect Your
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                QuickBooks
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Our team of CFOs will analyze your financial data and compile insights, 
              findings, and opportunities to present to you on your scheduled Audit Call.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Secure Connection</h3>
                <p className="text-gray-300 text-sm">
                  Bank-level security with OAuth 2.0 encryption
                </p>
              </div>

              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">CFO Analysis</h3>
                <p className="text-gray-300 text-sm">
                  Deep financial analysis by experienced CFOs
                </p>
              </div>

              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Audit Deck</h3>
                <p className="text-gray-300 text-sm">
                  Comprehensive presentation on your audit call
                </p>
              </div>
            </div>

            {/* Process Steps */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                  1
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold">Connect QuickBooks</h3>
                  <p className="text-gray-300 text-sm">Secure OAuth connection to your accounting data</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                  2
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold">CFO Analysis</h3>
                  <p className="text-gray-300 text-sm">Our team analyzes your financial performance</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                  3
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold">Receive Insights</h3>
                  <p className="text-gray-300 text-sm">Get actionable recommendations and insights</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Connection Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 w-full max-w-md">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Ready to Connect?</h2>
                <p className="text-gray-300">
                  Connect your QuickBooks account to get started with your financial analysis
                </p>
              </div>

              {/* Connection Status */}
              <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-blue-400 mr-3" />
                  <div>
                    <div className="text-blue-200 font-medium text-sm">Secure OAuth 2.0</div>
                    <div className="text-blue-300 text-xs">
                      View-only access • No data stored
                    </div>
                  </div>
                </div>
              </div>

              {/* Connect Button */}
              <button
                onClick={handleQuickBooksConnect}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Connecting to QuickBooks...</span>
                  </>
                ) : (
                  <>
                    <span>Connect to QuickBooks</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Security Notes */}
              <div className="mt-6 space-y-3 text-center">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Read-only access</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Revoke access anytime</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-gray-400 text-center">
                  By connecting, you agree to our secure data handling practices. 
                  Your financial data remains private and secure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
