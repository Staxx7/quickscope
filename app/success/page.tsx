'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Shield, Zap, Users, Clock } from 'lucide-react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [companyName, setCompanyName] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const company = searchParams.get('company');
    if (company) setCompanyName(decodeURIComponent(company));
    
    // Set date and time on client side only to avoid hydration mismatch
    const now = new Date();
    setCurrentDate(now.toLocaleDateString());
    setCurrentTime(now.toLocaleTimeString());
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg animate-bounce">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">🎉 Connection Successful!</h1>
          {companyName && (
            <p className="text-lg text-blue-300 mb-4 font-medium">
              {companyName} QuickBooks Integration Complete
            </p>
          )}
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your QuickBooks account has been successfully connected to our financial analysis platform. 
            Our team can now access your data to provide powerful insights and reporting.
          </p>
        </div>

        {/* Connection Status Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 mb-8">
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
              <div>
                <div className="text-green-200 font-medium">Connection Status: Active</div>
                <div className="text-green-300 text-sm">
                  Your QuickBooks data is now securely accessible for financial analysis and reporting.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Bank-Level Security</h3>
            <p className="text-gray-300 text-sm">
              Your data is protected with enterprise-grade encryption and security protocols.
            </p>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Real-Time Analysis</h3>
            <p className="text-gray-300 text-sm">
              Our team will provide up-to-date financial insights with automatic data synchronization.
            </p>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Expert Support</h3>
            <p className="text-gray-300 text-sm">
              Our financial experts will analyze your data and provide actionable recommendations.
            </p>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">What Happens Next?</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 mt-1">
                1
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Data Analysis Begins</h3>
                <p className="text-gray-300 text-sm">
                  Our team will start analyzing your QuickBooks data to identify key insights and opportunities.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 mt-1">
                2
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Report Preparation</h3>
                <p className="text-gray-300 text-sm">
                  We'll prepare comprehensive financial reports and AI-driven insights tailored to your business.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 mt-1">
                3
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Results Delivery</h3>
                <p className="text-gray-300 text-sm">
                  You'll receive detailed analysis and recommendations to optimize your financial performance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">We'll Be In Touch</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Our financial analysis team will review your data and contact you within 24-48 hours with 
              initial insights and next steps for your business.
            </p>
            <div className="text-center text-gray-400">
              <p className="text-sm mb-2">Questions? Contact our support team:</p>
              <p className="text-blue-400 font-medium">support@quickscope.info</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400">
          <p className="text-sm">
            Connection established on {currentDate} at {currentTime}
          </p>
          <p className="text-xs mt-2">
            Your data is secure and will only be used for financial analysis and reporting purposes.
          </p>
          <p className="text-xs mt-3 text-gray-500">
            You can safely close this window - the connection is complete.
          </p>
        </div>
      </div>
    </div>
  );
}
