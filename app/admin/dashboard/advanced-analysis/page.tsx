'use client'

import { useCompany } from '@/app/contexts/CompanyContext';
import { useRouter, useSearchParams } from 'next/navigation';
import EliteAdvancedFinancialAnalyzer from '@/app/components/EliteAdvancedFinancialAnalyzer'
import { Suspense, useEffect } from 'react';

function AdvancedAnalysisContent() {
  const { selectedCompany, isLoading, setSelectedCompany } = useCompany();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get company details from URL params
  const companyIdFromUrl = searchParams.get('companyId');
  const companyNameFromUrl = searchParams.get('company');
  
  useEffect(() => {
    // If no company is selected but we have URL params, set the company
    if (!selectedCompany && companyIdFromUrl && companyNameFromUrl && !isLoading) {
      setSelectedCompany({
        id: companyIdFromUrl,
        name: companyNameFromUrl,
        realmId: companyIdFromUrl
      });
    }
  }, [companyIdFromUrl, companyNameFromUrl, selectedCompany, setSelectedCompany, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Use either context company or URL params
  const companyToUse = selectedCompany || (companyIdFromUrl && companyNameFromUrl ? {
    id: companyIdFromUrl,
    name: companyNameFromUrl,
    realmId: companyIdFromUrl
  } : null);

  if (!companyToUse) {
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
      companyId={companyToUse.realmId || companyToUse.id}
      companyName={companyToUse.name}
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
