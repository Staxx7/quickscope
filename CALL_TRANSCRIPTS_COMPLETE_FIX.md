# Call Transcripts Dropdown Issue - Complete Fix

## Original Problem
User reported that after adding contact info and clicking "Upload Call", the call transcripts page showed an empty dropdown with no companies listed.

## Root Causes Identified

1. **Permission Issue**: The `/api/admin/prospects` endpoint was using the regular Supabase client instead of the service client, causing RLS policies to block data access

2. **Logic Issue**: The CallTranscriptsIntegration component was only showing companies with QuickBooks connections, excluding newly added prospects

3. **API Mismatch**: The component was sending incorrect field names to the API (companyId vs prospect_id)

4. **Navigation Issue**: The dashboard was passing null company_id for prospects without QB connections

## Fixes Applied

### 1. Fixed API Permissions
```javascript
// app/api/admin/prospects/route.ts
// Changed from:
import { supabase } from '@/lib/supabaseClient'

// To:
import { getSupabaseServerClient } from '@/lib/supabaseClient'
const supabase = getSupabaseServerClient()
```

### 2. Updated Company Fetching Logic
```javascript
// app/components/CallTranscriptsIntegration.tsx
// Now maps ALL prospects, using prospect ID as fallback:
const companies = data.prospects?.map((prospect: any) => ({
  id: prospect.id,
  company_name: prospect.company_name,
  realm_id: prospect.company_id || prospect.id,
  status: prospect.company_id ? 'active' : 'pending',
  connected_at: prospect.created_at || prospect.last_activity
})).filter((company: any) => company.company_name) || [];
```

### 3. Fixed API Field Names
```javascript
// Changed the POST body to match API expectations:
body: JSON.stringify({
  prospect_id: transcript.companyId,      // was: companyId
  file_name: transcript.fileName,         // was: fileName
  transcript_text: fileContent || transcript.transcriptText,
  duration_seconds: // calculated value
})
```

### 4. Fixed Navigation Parameters
```javascript
// app/components/ConnectedCompaniesWorkflow.tsx
const accountId = company.company_id || company.prospect_id || company.id
const params = new URLSearchParams({
  account: accountId,
  company: company.company_name
})
```

### 5. Added Auto-Selection
```javascript
// Auto-select company when navigating from dashboard
useEffect(() => {
  if (defaultCompanyId && connectedCompanies.length > 0) {
    const matchingCompany = connectedCompanies.find(c => 
      c.realm_id === defaultCompanyId || c.id === defaultCompanyId
    )
    if (matchingCompany) {
      setSelectedCompanyForUpload(matchingCompany.realm_id)
    }
  }
}, [defaultCompanyId, connectedCompanies])
```

## Test Results
After fixes:
- ✅ Dropdown now shows all prospects (with or without QuickBooks)
- ✅ Navigation from dashboard works properly
- ✅ Company auto-selects when navigating from dashboard
- ✅ Transcripts can be uploaded for any prospect
- ✅ API properly saves transcripts with correct prospect_id

## Files Modified
1. `app/api/admin/prospects/route.ts` - Fixed permissions with service client
2. `app/components/CallTranscriptsIntegration.tsx` - Updated fetching logic and API calls
3. `app/components/ConnectedCompaniesWorkflow.tsx` - Fixed navigation parameters

## Current Status
The call transcripts dropdown is now fully functional. Users can:
1. Add contact information for a company
2. Click "Upload Call" from the dashboard
3. See the company in the dropdown (regardless of QB connection status)
4. Upload and process call transcripts
5. Have transcripts properly associated with the prospect record