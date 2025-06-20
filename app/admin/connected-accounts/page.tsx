'use client'

export default function ConnectedAccountsPage() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900 p-6">
        <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
          <h1 className="text-3xl font-bold text-white mb-4">Connected Accounts</h1>
          <p className="text-gray-300">Manage your QuickBooks integrations and account connections.</p>
          <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-blue-300">This module is coming soon. You'll be able to manage all your connected financial accounts here.</p>
          </div>
        </div>
      </div>
    );
  }