'use client';

import React, { useState } from 'react';
import { Shield, Zap, Users, Building2, ArrowRight, CheckCircle, Clock, Target, BarChart3 } from 'lucide-react';

export default function ConnectPage() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleQuickBooksConnect = async () => {
    setIsConnecting(true);
    
    try {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            QUICKSCOPE
          </h1>
          <p className="text-lg text-gray-400 mb-8">by STAXX</p>
          
          <h2 className="text-3xl lg:text-4xl font-medium text-white mb-6">
            Connect Your QuickBooks
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Enter your details to begin comprehensive financial analysis. Our team of CFOs will analyze your 
            financial data, and compile insights, findings, and opportunities to present to you on your scheduled Audit Call.
          </p>
        </div>

        {/* Main Connection Card */}
        <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-12 mb-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Connect?</h3>
            <p className="text-gray-300 text-lg max-w-xl mx-auto">
              Connect your QuickBooks account to get started with your comprehensive financial analysis
            </p>
          </div>

          {/* Security Badge */}
          <div className="mb-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
            <div className="flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-400 mr-3" />
              <div className="text-center">
                <div className="text-blue-200 font-medium text-lg">Secure QuickBooks OAuth Connection</div>
                <div className="text-blue-300">
                  Your data is encrypted and never stored on our servers
                </div>
              </div>
            </div>
          </div>

          {/* Connect Button */}
          <div className="text-center">
            <button
              onClick={handleQuickBooksConnect}
              disabled={isConnecting}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-5 px-12 rounded-2xl font-bold text-xl transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed mx-auto shadow-xl hover:shadow-2xl hover:scale-105 transform"
            >
              {isConnecting ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Connecting to QuickBooks...</span>
                </>
              ) : (
                <>
                  <span>Connect QuickBooks Account</span>
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-8 text-center hover:bg-white/10 transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-6 bg-blue-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="font-bold text-white mb-3 text-xl">Secure Connection</h3>
            <p className="text-gray-300">
              Safe OAuth integration with your QuickBooks Account using bank-level security
            </p>
          </div>

          <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-8 text-center hover:bg-white/10 transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-6 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center">
              <Zap className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="font-bold text-white mb-3 text-xl">CFO Level Analysis</h3>
            <p className="text-gray-300">
              Deep analysis of your financial data by one of our experienced CFOs
            </p>
          </div>

          <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-8 text-center hover:bg-white/10 transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-6 bg-purple-500/20 border border-purple-500/30 rounded-2xl flex items-center justify-center">
              <Users className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="font-bold text-white mb-3 text-xl">Audit Deck Creation</h3>
            <p className="text-gray-300">
              We will generate and present this on your scheduled audit call
            </p>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-10">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">What Happens Next?</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-white font-bold text-xl mb-2">Data Analysis Begins</h3>
                <p className="text-gray-300 text-lg">
                  Our team will start analyzing your QuickBooks data to identify key insights and opportunities.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-white font-bold text-xl mb-2">Report Preparation</h3>
                <p className="text-gray-300 text-lg">
                  We'll prepare comprehensive financial reports and AI-driven insights tailored to your business.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-white font-bold text-xl mb-2">Results Delivery</h3>
                <p className="text-gray-300 text-lg">
                  You'll receive detailed analysis and recommendations to optimize your financial performance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Security Notes */}
        <div className="text-center mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center justify-center space-x-2 text-gray-300">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>256-bit SSL encryption</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-300">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Read-only access</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-300">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Revoke access anytime</span>
            </div>
          </div>
          
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            By connecting, you agree to our secure data handling practices. 
            Your financial data remains private and secure.
          </p>
        </div>
      </div>
    </div>
  );
}
