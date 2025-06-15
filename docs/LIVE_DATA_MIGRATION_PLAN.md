# Live Data Migration Plan

## Overview
This document outlines the systematic migration of all components from mock/demo data to live production data sources.

## Current State Analysis

### Components Using Mock Data

1. **EliteAdvancedFinancialAnalyzer.tsx**
   - Line 260: `const [dataSource, setDataSource] = useState<'real' | 'mock'>('mock');`
   - Has `generateAdvancedMockData()` function
   - Falls back to mock data on API failure

2. **AdvancedFinancialDashboard.tsx**
   - Lines 114-119: Uses `generateMockData()` 
   - No real data fetching implemented

3. **SafeAccountWorkflowDashboard.tsx & CorrectedAccountWorkflowDashboard.tsx**
   - Falls back to `getDemoProspects()` and `getDemoStats()`
   - Shows warning when using demo data

4. **IntelligentAuditDeckGenerator.tsx**
   - Line 506: `const [dataSource, setDataSource] = useState<'real' | 'mock' | 'ai_enhanced'>('mock')`
   - Uses 'Demo Company' as default

5. **CallTranscriptsIntegration.tsx**
   - Line 177: Falls back to 'Sample transcript content for analysis'
   - Line 354: Uses mock content for demo

6. **AIReportGenerator.tsx**
   - Lines 296+: Generates mock financial data for demonstration
   - Has `sampleSections` in templates

## Migration Strategy

### Phase 1: Update Default States (Immediate)

#### 1. EliteAdvancedFinancialAnalyzer.tsx
```typescript
// Change line 260 from:
const [dataSource, setDataSource] = useState<'real' | 'mock'>('mock');
// To:
const [dataSource, setDataSource] = useState<'real' | 'mock'>('real');

// Update useEffect to always try real data first:
useEffect(() => {
  fetchComprehensiveAnalysis(); // Always fetch real data
}, [companyId]);

// Remove automatic fallback to mock data:
// Instead of generateAdvancedMockData(), show error state
```

#### 2. AdvancedFinancialDashboard.tsx
```typescript
// Replace generateMockData() calls with:
useEffect(() => {
  fetchRealFinancialData();
}, [companyId]);

const fetchRealFinancialData = async () => {
  try {
    const response = await fetch(`/api/financial-data/${companyId}`);
    const data = await response.json();
    setMetrics(data);
  } catch (error) {
    setError('Unable to load financial data');
    // Don't fall back to mock data
  }
};
```

#### 3. Workflow Dashboards
```typescript
// Remove getDemoProspects() and getDemoStats()
// Show proper error state instead:
if (error) {
  return (
    <div className="error-state">
      <h2>Unable to Load Data</h2>
      <p>Please check your connection and try again.</p>
      <button onClick={retry}>Retry</button>
    </div>
  );
}
```

#### 4. IntelligentAuditDeckGenerator.tsx
```typescript
// Change default data source:
const [dataSource, setDataSource] = useState<'real' | 'mock' | 'ai_enhanced'>('real');

// Remove 'Demo Company' default:
companyName || 'Loading...' // Instead of 'Demo Company'
```

### Phase 2: API Endpoint Updates

#### 1. Create Error Handling Wrapper
```typescript
// app/lib/apiWrapper.ts
export async function fetchWithFallback(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`API Error: ${url}`, error);
    throw error; // Don't return mock data
  }
}
```

#### 2. Update All API Calls
Replace all instances of fallback to mock data with proper error handling:

```typescript
// Instead of:
try {
  const data = await fetch('/api/...');
} catch {
  generateMockData(); // Remove this
}

// Use:
try {
  const data = await fetchWithFallback('/api/...');
  setData(data);
} catch (error) {
  setError(error.message);
  setShowErrorState(true);
}
```

### Phase 3: Component-Specific Updates

#### 1. ConnectedCompaniesWorkflow.tsx
- ✅ Already uses live data from `/api/admin/connected-companies`
- No changes needed

#### 2. CallTranscriptsIntegration.tsx
```typescript
// Remove line 177 fallback:
transcriptText: fileContent || transcript.transcriptText || '' // Remove sample

// Remove line 354 mock content:
if (!transcriptText) {
  setError('No transcript content available');
  return;
}
```

#### 3. AIReportGenerator.tsx
```typescript
// Remove mock data generation (lines 296+)
// Always fetch real data:
const fetchFinancialData = async () => {
  const data = await fetchWithFallback(`/api/financial-data/${companyId}`);
  return data;
};

// Remove sampleSections from templates
// Generate sections from real data only
```

### Phase 4: Data Validation

#### 1. Add Data Validation Layer
```typescript
// app/lib/dataValidation.ts
export function validateFinancialData(data: any): boolean {
  return !!(
    data &&
    typeof data.revenue === 'number' &&
    typeof data.expenses === 'number' &&
    data.revenue >= 0 &&
    data.expenses >= 0
  );
}

export function validateCompanyData(data: any): boolean {
  return !!(
    data &&
    data.company_id &&
    data.company_name
  );
}
```

#### 2. Use Validation Before Rendering
```typescript
if (!validateFinancialData(financialData)) {
  return <InvalidDataState />;
}
```

### Phase 5: Error States & Loading States

#### 1. Create Consistent Error Components
```typescript
// app/components/ErrorStates.tsx
export const NoDataError = ({ message, onRetry }: Props) => (
  <div className="flex flex-col items-center justify-center p-8">
    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
    <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
    <p className="text-gray-600 mb-4">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-primary">
        Try Again
      </button>
    )}
  </div>
);

export const LoadingState = ({ message }: Props) => (
  <div className="flex flex-col items-center justify-center p-8">
    <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
    <p className="text-gray-600">{message || 'Loading...'}</p>
  </div>
);
```

#### 2. Implement in All Components
```typescript
if (loading) return <LoadingState message="Fetching financial data..." />;
if (error) return <NoDataError message={error} onRetry={fetchData} />;
if (!data) return <NoDataError message="No data available" />;
```

### Phase 6: Testing & Verification

#### 1. Create Test Checklist
- [ ] EliteAdvancedFinancialAnalyzer loads real QuickBooks data
- [ ] AdvancedFinancialDashboard shows live metrics
- [ ] Workflow dashboards display actual prospects
- [ ] Audit deck generator uses real company data
- [ ] Call transcripts show actual content
- [ ] AI reports generate from live data

#### 2. Add Data Source Indicators
```typescript
// Add visual indicator for data source
{process.env.NODE_ENV === 'development' && (
  <div className="fixed bottom-4 right-4 bg-green-500 text-white px-3 py-1 rounded text-xs">
    Live Data
  </div>
)}
```

### Phase 7: Remove Mock Data Functions

#### 1. Delete Mock Generators
- Remove `generateMockData()` functions
- Remove `getDemoProspects()` functions
- Remove `generateAdvancedMockData()` functions
- Remove hardcoded sample data

#### 2. Clean Up Imports
- Remove unused mock data imports
- Remove demo data constants

### Implementation Timeline

1. **Day 1**: Update default states to 'real'
2. **Day 2**: Implement error handling wrapper
3. **Day 3**: Update all API calls
4. **Day 4**: Add validation layer
5. **Day 5**: Implement error/loading states
6. **Day 6**: Test all components
7. **Day 7**: Remove mock data code

### Monitoring & Rollback

1. **Monitor Error Rates**
   - Track API failures
   - Monitor user experience
   - Check loading times

2. **Rollback Plan**
   - Keep mock data functions in separate file
   - Add feature flag for data source
   - Enable quick switching if needed

### Success Criteria

- ✅ All components load real data by default
- ✅ No mock data in production builds
- ✅ Proper error states for data failures
- ✅ Loading indicators during data fetch
- ✅ No hardcoded demo values
- ✅ All API endpoints return live data

## Conclusion

This migration ensures that your production QuickScope platform operates entirely on live data, providing real value to users and maintaining data integrity throughout the application.