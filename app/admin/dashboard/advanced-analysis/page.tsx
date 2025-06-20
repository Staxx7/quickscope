'use client'

import { useCompany } from '@/app/contexts/CompanyContext';
import { useRouter } from 'next/navigation';
import EliteAdvancedFinancialAnalyzer from '@/app/components/EliteAdvancedFinancialAnalyzer'
import { Suspense } from 'react';

function AdvancedAnalysisContent() {
  const { selectedCompany, isLoading } = useCompany();
  const router = useRouter();

  if (isLoading) {
    return <div>Loading company data...</div>;
  }

  if (!selectedCompany) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center p-8 bg-slate-800/50 rounded-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">No Company Selected</h2>
          <p className="text-slate-300 mb-6">Please select a company from the dashboard to view financial analysis.</p>
          <button 
            onClick={() => router.push('/admin/dashboard')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <EliteAdvancedFinancialAnalyzer 
      companyId={selectedCompany.realmId || selectedCompany.id}
      companyName={selectedCompany.name}
    />
  );
}

export default function AdvancedAnalysisPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <AdvancedAnalysisContent />
    </Suspense>
  )
}
