# Ledgr Platform - 8-Hour Implementation Guide

## 🚀 Pre-Implementation Checklist

Before starting, ensure you have:
- [ ] Access to Supabase dashboard
- [ ] QuickBooks Developer account
- [ ] OpenAI API key
- [ ] Stripe account (optional for now)
- [ ] 8 hours of focused time

## ⏰ Hour 0-1: Environment Foundation

### Step 1: Backup Current State (5 minutes)
```bash
# Create a backup branch
git checkout -b pre-transformation-backup
git add .
git commit -m "Backup before 8-hour transformation"
git checkout -b transformation-implementation
```

### Step 2: Standardize Environment Variables (20 minutes)

Run these commands in your terminal:

```bash
# Fix QB_ to QUICKBOOKS_ across all files
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i.bak 's/QB_CLIENT_ID/QUICKBOOKS_CLIENT_ID/g' {} +
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i.bak 's/QB_CLIENT_SECRET/QUICKBOOKS_CLIENT_SECRET/g' {} +
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i.bak 's/QB_REDIRECT_URI/QUICKBOOKS_REDIRECT_URI/g' {} +

# Fix QBO_ to QUICKBOOKS_
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i.bak 's/QBO_CLIENT_ID/QUICKBOOKS_CLIENT_ID/g' {} +
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i.bak 's/QBO_CLIENT_SECRET/QUICKBOOKS_CLIENT_SECRET/g' {} +
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i.bak 's/QBO_ENVIRONMENT/QUICKBOOKS_ENVIRONMENT/g' {} +

# Clean up backup files
find . -name "*.bak" -type f -delete
```

### Step 3: Create Complete Environment Configuration (15 minutes)

Create/update `.env.local`:

```bash
cat > .env.local << 'EOF'
# QuickBooks OAuth (REQUIRED)
QUICKBOOKS_CLIENT_ID=your_actual_client_id
QUICKBOOKS_CLIENT_SECRET=your_actual_client_secret
QUICKBOOKS_REDIRECT_URI=http://localhost:3000/api/auth/callback
QUICKBOOKS_ENVIRONMENT=sandbox
QUICKBOOKS_SCOPE=com.intuit.quickbooks.accounting

# AI Power (REQUIRED)
OPENAI_API_KEY=your_openai_api_key

# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# External Data APIs (Optional for now)
BLS_API_KEY=optional_for_initial_launch
CENSUS_API_KEY=optional_for_initial_launch

# Stripe (Optional for now)
STRIPE_SECRET_KEY=optional_for_initial_launch
STRIPE_PUBLISHABLE_KEY=optional_for_initial_launch

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development

# Email (Optional)
RESEND_API_KEY=optional_for_initial_launch
EOF
```

### Step 4: Update .gitignore (5 minutes)
```bash
echo -e "\n# Environment files\n.env.local\n.env.production" >> .gitignore
```

### Step 5: Verify Environment Loading (15 minutes)

Create a test script:

```bash
cat > test-env.js << 'EOF'
require('dotenv').config({ path: '.env.local' })

console.log('Environment Variables Check:')
console.log('✓ QUICKBOOKS_CLIENT_ID:', process.env.QUICKBOOKS_CLIENT_ID ? 'Set' : '❌ Missing')
console.log('✓ QUICKBOOKS_CLIENT_SECRET:', process.env.QUICKBOOKS_CLIENT_SECRET ? 'Set' : '❌ Missing')
console.log('✓ OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Set' : '❌ Missing')
console.log('✓ NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : '❌ Missing')
EOF

node test-env.js
rm test-env.js
```

## ⏰ Hour 1-2: Remove Mock Data Barriers

### Step 1: Fix Companies API Route (15 minutes)

```typescript
// app/api/companies/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';

export async function GET() {
  try {
    const { data: tokens, error } = await supabase
      .from('qbo_tokens')
      .select('company_id, company_name, created_at, expires_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching companies:', error);
      // Return empty array instead of mock data
      return NextResponse.json({ companies: [], total: 0 });
    }

    const companies = tokens?.map(token => ({
      id: token.company_id,
      company_name: token.company_name || 'Unknown Company',
      realm_id: token.company_id,
      connected_at: token.created_at,
      status: new Date(token.expires_at) > new Date() ? 'active' : 'expired'
    })) || [];

    return NextResponse.json({ 
      companies,
      total: companies.length,
      message: 'Live data from QuickBooks'
    });
  } catch (error) {
    console.error('Companies API error:', error);
    return NextResponse.json({ companies: [], error: 'Database connection error' });
  }
}
```

### Step 2: Remove Component Mock Data (30 minutes)

Search and update these files:

```bash
# Find all mock data instances
grep -r "mockData\|mock\|generateMock\|fallback" app/components --include="*.tsx" --include="*.ts"
```

For each component with mock data, replace with error handling:

```typescript
// Example pattern to follow:
// BEFORE:
if (!data) {
  return generateMockData();
}

// AFTER:
if (!data) {
  return (
    <div className="text-center p-8">
      <p className="text-gray-500">No data available. Please connect your QuickBooks account.</p>
      <button onClick={() => router.push('/connect')} className="mt-4 btn-primary">
        Connect QuickBooks
      </button>
    </div>
  );
}
```

### Step 3: Create Database Schema (15 minutes)

Run these in your Supabase SQL editor:

```sql
-- Prospects table
CREATE TABLE IF NOT EXISTS prospects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  industry TEXT,
  annual_revenue NUMERIC,
  workflow_stage TEXT DEFAULT 'discovery',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- QuickBooks tokens
CREATE TABLE IF NOT EXISTS qbo_tokens (
  company_id TEXT PRIMARY KEY,
  company_name TEXT,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- AI analyses
CREATE TABLE IF NOT EXISTS ai_analyses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  prospect_id UUID REFERENCES prospects(id),
  closeability_score INTEGER,
  financial_health_score INTEGER,
  urgency_level TEXT,
  key_insights JSONB,
  pain_points JSONB,
  opportunities JSONB,
  analysis_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Call transcripts
CREATE TABLE IF NOT EXISTS call_transcripts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  prospect_id UUID REFERENCES prospects(id),
  file_name TEXT,
  transcript_text TEXT,
  duration_seconds INTEGER,
  call_type TEXT,
  sentiment TEXT,
  analysis_results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Financial snapshots
CREATE TABLE IF NOT EXISTS financial_snapshots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id TEXT,
  revenue NUMERIC,
  expenses NUMERIC,
  net_income NUMERIC,
  assets NUMERIC,
  liabilities NUMERIC,
  snapshot_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_prospects_email ON prospects(email);
CREATE INDEX IF NOT EXISTS idx_qbo_tokens_company_id ON qbo_tokens(company_id);
CREATE INDEX IF NOT EXISTS idx_ai_analyses_prospect_id ON ai_analyses(prospect_id);
CREATE INDEX IF NOT EXISTS idx_call_transcripts_prospect_id ON call_transcripts(prospect_id);
CREATE INDEX IF NOT EXISTS idx_financial_snapshots_company_id ON financial_snapshots(company_id);
```

## ⏰ Hour 2-3: Service Consolidation

### Step 1: Remove Duplicate QuickBooks Service (10 minutes)

```bash
# Remove the duplicate service
rm lib/quickbooksService.ts

# Update all imports to use the app/lib version
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|from.*lib/quickbooksService|from "@/app/lib/quickbooksService|g' {} +
```

### Step 2: Create Unified Service Factory (20 minutes)

Create `app/lib/services.ts`:

```typescript
// app/lib/services.ts
import { getQuickBooksService } from './quickbooksService';
import { createAIInsightsEngine } from '@/lib/aiInsightsEngine';
import { BLSService } from './blsService';
import { CensusService } from './censusService';
import { supabase } from './supabaseClient';

// Create singleton instances
let servicesInstance: Services | null = null;

interface Services {
  quickbooks: ReturnType<typeof getQuickBooksService>;
  ai: ReturnType<typeof createAIInsightsEngine>;
  bls: BLSService;
  census: CensusService;
  supabase: typeof supabase;
}

export function getServices(): Services {
  if (!servicesInstance) {
    servicesInstance = {
      quickbooks: getQuickBooksService(),
      ai: createAIInsightsEngine(process.env.OPENAI_API_KEY),
      bls: new BLSService(),
      census: new CensusService(),
      supabase
    };
  }
  return servicesInstance;
}

// Health check function
export async function checkServicesHealth() {
  const health = {
    quickbooks: false,
    ai: false,
    database: false,
    overall: false
  };

  try {
    // Check Supabase
    const { error } = await supabase.from('prospects').select('count').limit(1);
    health.database = !error;

    // Check OpenAI
    health.ai = !!process.env.OPENAI_API_KEY;

    // Check QuickBooks
    health.quickbooks = !!process.env.QUICKBOOKS_CLIENT_ID && !!process.env.QUICKBOOKS_CLIENT_SECRET;

    health.overall = health.database && health.ai && health.quickbooks;
  } catch (error) {
    console.error('Health check error:', error);
  }

  return health;
}
```

### Step 3: Create Health Check Endpoint (10 minutes)

Create `app/api/health/route.ts`:

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { checkServicesHealth } from '@/app/lib/services';

export async function GET() {
  const health = await checkServicesHealth();
  const status = health.overall ? 200 : 503;
  
  return NextResponse.json({
    status: health.overall ? 'healthy' : 'unhealthy',
    services: health,
    timestamp: new Date().toISOString()
  }, { status });
}
```

### Step 4: Fix Supabase Client Consolidation (20 minutes)

Update `app/lib/supabaseClient.ts` to be the primary client:

```typescript
// app/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables');
}

// Server-side client with service role key
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Client-side operations
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions
export async function testConnection() {
  try {
    const { error } = await supabase.from('prospects').select('count').limit(1);
    return !error;
  } catch {
    return false;
  }
}
```

## ⏰ Hour 3-4: Fix Critical Routes

### Step 1: Fix Main Dashboard Route (15 minutes)

```typescript
// app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AccountWorkflowDashboard from '@/app/components/AccountWorkflowDashboard'

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      // Check for QB token in localStorage or cookies
      const hasQBToken = 
        localStorage.getItem('qb_company_id') ||
        document.cookie.includes('qb_session');
      
      if (!hasQBToken) {
        router.push('/connect');
        return;
      }
      
      setIsAuthenticated(true);
    };

    checkAuth();
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <AccountWorkflowDashboard />;
}
```

### Step 2: Fix Homepage Smart Routing (15 minutes)

```typescript
// app/page.tsx
'use client'

import { useEffect } from 'react'

export default function HomePage() {
  useEffect(() => {
    const checkAuthAndRoute = async () => {
      // Check multiple auth indicators
      const hasQBToken = localStorage.getItem('qb_company_id');
      const hasQBCookie = document.cookie.includes('qb_session');
      const isReturningUser = localStorage.getItem('has_connected_before');
      
      if (hasQBToken || hasQBCookie) {
        window.location.href = '/dashboard';
      } else if (isReturningUser) {
        window.location.href = '/connect';
      } else {
        // First time user - show pricing
        window.location.href = '/pricing';
      }
    };

    // Small delay to prevent flash
    setTimeout(checkAuthAndRoute, 100);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">QuickScope</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-slate-400">Loading your experience...</p>
      </div>
    </div>
  );
}
```

### Step 3: Update OAuth Callback (20 minutes)

```typescript
// app/api/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const realmId = searchParams.get('realmId');

  if (!code) {
    return NextResponse.redirect(new URL('/connect?error=no_code', request.url));
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${Buffer.from(
          `${process.env.QUICKBOOKS_CLIENT_ID}:${process.env.QUICKBOOKS_CLIENT_SECRET}`
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.QUICKBOOKS_REDIRECT_URI!
      })
    });

    if (!tokenResponse.ok) {
      throw new Error('Token exchange failed');
    }

    const tokens = await tokenResponse.json();

    // Get company info
    const companyResponse = await fetch(
      `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/companyinfo/${realmId}`,
      {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
          'Accept': 'application/json'
        }
      }
    );

    const companyData = await companyResponse.json();
    const companyName = companyData.CompanyInfo?.CompanyName || 'Unknown Company';

    // Store tokens in database
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);
    
    await supabase.from('qbo_tokens').upsert({
      company_id: realmId,
      company_name: companyName,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString()
    });

    // Set cookie and redirect
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    response.cookies.set('qb_session', 'active', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(`/connect?error=auth_failed&message=${encodeURIComponent(error.message)}`, request.url)
    );
  }
}
```

### Step 4: Fix Admin Layout Integration (10 minutes)

```typescript
// app/admin/layout.tsx
import AdminLayout from '@/app/components/AdminLayout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}
```

## ⏰ Hour 4-5: Connect AI Engine

### Step 1: Create AI Analysis Endpoint (20 minutes)

Create `app/api/ai/analyze-prospect/route.ts`:

```typescript
// app/api/ai/analyze-prospect/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { analyzeProspectData } from '@/lib/aiInsightsEngine';
import { getServices } from '@/app/lib/services';

export async function POST(request: NextRequest) {
  try {
    const { prospectId, companyId, analysisType = 'comprehensive' } = await request.json();
    
    if (!prospectId || !companyId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const services = getServices();
    
    // Get financial data from QuickBooks
    const qbService = services.quickbooks;
    const credentials = await qbService.getStoredCredentials(companyId);
    
    if (!credentials) {
      return NextResponse.json({ error: 'No QuickBooks connection found' }, { status: 404 });
    }

    // Fetch comprehensive financial data
    const financialData = await qbService.fetchComprehensiveFinancialData(
      credentials,
      { start: new Date(new Date().getFullYear(), 0, 1).toISOString(), end: new Date().toISOString() }
    );

    // Get prospect and transcript data
    const { data: prospect } = await services.supabase
      .from('prospects')
      .select('*, call_transcripts(*)')
      .eq('id', prospectId)
      .single();

    if (!prospect) {
      return NextResponse.json({ error: 'Prospect not found' }, { status: 404 });
    }

    // Get industry data for context
    const industryData = await services.bls.getIndustryBenchmarks(prospect.industry || 'technology');

    // Run comprehensive AI analysis
    const transcript = prospect.call_transcripts?.[0]?.transcript_text || '';
    const analysis = await analyzeProspectData(
      transcript,
      financialData,
      {
        name: prospect.company_name,
        industry: prospect.industry || 'Unknown',
        yearEstablished: new Date().getFullYear() - 5, // Default
        industryData
      }
    );

    // Store analysis results
    await services.supabase.from('ai_analyses').insert({
      prospect_id: prospectId,
      closeability_score: analysis.salesIntelligence.closeability,
      financial_health_score: analysis.financialIntelligence.healthScore,
      urgency_level: analysis.transcriptAnalysis.urgencySignals.timeline,
      key_insights: analysis.businessInsights.keyFindings,
      pain_points: analysis.transcriptAnalysis.painPoints,
      opportunities: analysis.businessInsights.growthOpportunities,
      analysis_date: new Date().toISOString()
    });

    // Update prospect workflow stage
    await services.supabase
      .from('prospects')
      .update({ 
        workflow_stage: 'analysis_complete',
        updated_at: new Date().toISOString()
      })
      .eq('id', prospectId);

    return NextResponse.json({
      success: true,
      analysis,
      prospectId,
      message: 'AI analysis completed successfully'
    });

  } catch (error) {
    console.error('AI analysis error:', error);
    return NextResponse.json(
      { error: 'AI analysis failed', details: error.message },
      { status: 500 }
    );
  }
}
```

### Step 2: Wire AI to Dashboard Components (20 minutes)

Update the dashboard component to trigger AI analysis:

```typescript
// In AccountWorkflowDashboard component, add this function:
const runAIAnalysis = async (prospectId: string, companyId: string) => {
  try {
    setRunningAIAnalysis(prospectId);
    
    const response = await fetch('/api/ai/analyze-prospect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prospectId,
        companyId,
        analysisType: 'comprehensive'
      })
    });

    if (!response.ok) {
      throw new Error('AI analysis failed');
    }

    const result = await response.json();
    showToast('AI analysis completed successfully!', 'success');
    
    // Refresh the dashboard data
    await fetchProspects();
    
  } catch (error) {
    console.error('Error running AI analysis:', error);
    showToast('AI analysis failed. Please try again.', 'error');
  } finally {
    setRunningAIAnalysis(null);
  }
};
```

### Step 3: Create Combined Analysis Trigger (20 minutes)

Enable the existing combined analysis endpoint:

```typescript
// Update app/api/ai/combined-analysis/route.ts to use real base URL
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

// In each fetch call, update to:
const financialResponse = await fetch(`${baseUrl}/api/ai/financial-health-score`, {
  // ... rest of the code
});
```

## ⏰ Hour 5-6: Enable Advanced Features

### Step 1: Connect External Data to AI (20 minutes)

Update the AI analysis to include external data:

```typescript
// In your AI analysis endpoint, add:
const enrichedAnalysis = {
  ...baseAnalysis,
  industryContext: {
    blsData: await services.bls.getComprehensiveIndustryReport(prospect.industry),
    censusData: await services.census.getIndustryDemographics(prospect.industry),
    economicIndicators: await services.bls.getInflationData()
  }
};
```

### Step 2: Enable Report Generation (20 minutes)

Fix the report generation component connection:

```typescript
// In AIReportGenerator component, ensure it connects to real data:
const generateReport = async (templateId: string) => {
  // ... existing code ...
  
  // Use real financial data
  const financialResponse = await fetch(`/api/qbo/financial-snapshot?company_id=${selectedCompany.realm_id}`);
  const financialData = await financialResponse.json();
  
  // Use real AI analysis
  const aiResponse = await fetch(`/api/ai/get-insights?company_id=${selectedCompany.realm_id}`);
  const aiInsights = await aiResponse.json();
  
  // Generate report with real data
  // ... rest of implementation
};
```

### Step 3: Test Payment Flow (20 minutes)

Create a simple test for Stripe integration:

```typescript
// app/api/stripe/test/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const stripeConfigured = !!process.env.STRIPE_SECRET_KEY;
  
  return NextResponse.json({
    configured: stripeConfigured,
    message: stripeConfigured 
      ? 'Stripe is configured - ready for payments' 
      : 'Stripe not configured - payments disabled for now'
  });
}
```

## ⏰ Hour 6-7: Database & Testing

### Step 1: Create Test Data Script (15 minutes)

Create `scripts/seed-test-data.ts`:

```typescript
// scripts/seed-test-data.ts
import { supabase } from '../app/lib/supabaseClient';

async function seedTestData() {
  console.log('Seeding test data...');
  
  // Create test prospect
  const { data: prospect, error } = await supabase
    .from('prospects')
    .insert({
      company_name: 'Test Company Inc',
      contact_name: 'John Doe',
      email: 'test@example.com',
      phone: '555-1234',
      industry: 'technology',
      annual_revenue: 1000000,
      workflow_stage: 'connected'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating test prospect:', error);
    return;
  }

  console.log('Test prospect created:', prospect.id);
  
  // You can add more test data here
}

seedTestData().catch(console.error);
```

### Step 2: Create Integration Test (30 minutes)

Create `test-integration.js`:

```javascript
// test-integration.js
const tests = {
  'Environment Variables': () => {
    const required = [
      'QUICKBOOKS_CLIENT_ID',
      'QUICKBOOKS_CLIENT_SECRET',
      'OPENAI_API_KEY',
      'NEXT_PUBLIC_SUPABASE_URL'
    ];
    
    const missing = required.filter(key => !process.env[key]);
    return {
      passed: missing.length === 0,
      message: missing.length ? `Missing: ${missing.join(', ')}` : 'All set!'
    };
  },
  
  'Database Connection': async () => {
    try {
      const response = await fetch('http://localhost:3000/api/health');
      const data = await response.json();
      return {
        passed: data.services.database,
        message: data.services.database ? 'Connected' : 'Failed to connect'
      };
    } catch (error) {
      return { passed: false, message: error.message };
    }
  },
  
  'QuickBooks OAuth': () => {
    const configured = process.env.QUICKBOOKS_CLIENT_ID && process.env.QUICKBOOKS_CLIENT_SECRET;
    return {
      passed: configured,
      message: configured ? 'Configured' : 'Not configured'
    };
  },
  
  'AI Engine': () => {
    const configured = !!process.env.OPENAI_API_KEY;
    return {
      passed: configured,
      message: configured ? 'Ready' : 'OpenAI API key missing'
    };
  }
};

async function runTests() {
  console.log('\n🧪 Running Integration Tests\n');
  
  for (const [name, test] of Object.entries(tests)) {
    const result = await test();
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${name}: ${result.message}`);
  }
  
  console.log('\n✨ Testing complete!\n');
}

runTests();
```

### Step 3: Manual Testing Checklist (15 minutes)

Create a testing checklist:

```markdown
# Manual Testing Checklist

## 1. Authentication Flow
- [ ] Navigate to http://localhost:3000
- [ ] Should redirect to /pricing or /connect
- [ ] Click "Connect QuickBooks"
- [ ] Complete OAuth flow
- [ ] Should redirect to /dashboard

## 2. Dashboard Functionality  
- [ ] Dashboard loads with AccountWorkflowDashboard component
- [ ] Can see connected companies
- [ ] Can trigger AI analysis
- [ ] Can navigate to sub-pages

## 3. AI Analysis
- [ ] Select a prospect
- [ ] Click "Run AI Analysis"
- [ ] Should see loading state
- [ ] Should complete within 30 seconds
- [ ] Results should display

## 4. Report Generation
- [ ] Navigate to report generation
- [ ] Select a template
- [ ] Generate report
- [ ] Should download or display

## 5. Error Handling
- [ ] Disconnect internet - should show error
- [ ] Invalid API key - should show meaningful error
- [ ] No data - should show empty state
```

## ⏰ Hour 7-8: Launch Preparation

### Step 1: Build and Optimize (20 minutes)

```bash
# Clear cache and rebuild
rm -rf .next
npm run build

# Check for build errors
# Fix any TypeScript errors that appear
```

### Step 2: Create Production Environment File (10 minutes)

```bash
cp .env.local .env.production
# Update with production values:
# - Production QuickBooks OAuth URIs
# - Production Supabase URL
# - Remove any test keys
```

### Step 3: Final Verification Script (15 minutes)

Create `verify-launch.js`:

```javascript
// verify-launch.js
console.log('🚀 Launch Verification\n');

const checks = [
  { name: 'Build successful', cmd: 'npm run build' },
  { name: 'TypeScript check', cmd: 'npx tsc --noEmit' },
  { name: 'Environment complete', check: () => {
    const required = ['QUICKBOOKS_CLIENT_ID', 'OPENAI_API_KEY', 'NEXT_PUBLIC_SUPABASE_URL'];
    return required.every(key => process.env[key]);
  }},
  { name: 'Database connected', check: async () => {
    const res = await fetch('http://localhost:3000/api/health');
    const data = await res.json();
    return data.services.database;
  }}
];

// Run checks...
```

### Step 4: Deploy (15 minutes)

```bash
# Option 1: Vercel
vercel --prod

# Option 2: Railway
railway up

# Option 3: Docker
docker build -t ledgr-platform .
docker run -p 3000:3000 --env-file .env.production ledgr-platform
```

## 🎉 Post-Implementation Checklist

### Immediate Next Steps:
1. [ ] Test complete user flow
2. [ ] Share with 1-2 beta users
3. [ ] Monitor error logs
4. [ ] Set up basic analytics

### Within 24 Hours:
1. [ ] Fix any critical bugs found
2. [ ] Optimize slow queries
3. [ ] Add rate limiting to AI endpoints
4. [ ] Set up error monitoring (Sentry)

### Within 1 Week:
1. [ ] Launch to 10 beta users
2. [ ] Implement user feedback
3. [ ] Add missing features based on usage
4. [ ] Start charging for premium features

## 🚨 Troubleshooting Guide

### Common Issues:

1. **"Cannot connect to Supabase"**
   - Check SUPABASE_SERVICE_ROLE_KEY is set
   - Verify Supabase URL is correct
   - Check if tables are created

2. **"QuickBooks OAuth fails"**
   - Verify redirect URI matches exactly
   - Check if using sandbox vs production
   - Ensure client ID/secret are correct

3. **"AI analysis times out"**
   - Check OpenAI API key is valid
   - Verify API rate limits
   - Consider implementing queue system

4. **"Dashboard shows no data"**
   - Check browser console for errors
   - Verify API routes return data
   - Check if mock data was properly removed

## 🎯 Success Indicators

After 8 hours, you should have:
- ✅ Working authentication flow
- ✅ Live dashboard with real data
- ✅ AI analysis functioning
- ✅ Reports generating
- ✅ Platform ready for users

**Congratulations! Your $2M platform is now live!** 🚀