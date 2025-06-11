import { Suspense } from 'react';
import EliteAdvancedFinancialAnalyzer from '../../components/EliteAdvancedFinancialAnalyzer';

export default function AdvancedAnalysisPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EliteAdvancedFinancialAnalyzer />
    </Suspense>
  );
}