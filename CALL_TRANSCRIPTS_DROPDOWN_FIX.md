# Call Transcripts Dropdown Fix Summary

## Issue
When clicking "Upload Call" from the dashboard and navigating to the call transcripts page, the "Select a connected company" dropdown was empty, showing no companies.

## Root Causes
1. **API Mismatch**: The CallTranscriptsIntegration component was fetching companies from `/api/admin/prospects`, but only mapping companies that had QuickBooks `company_id` values
2. **Missing Companies**: Prospects without QuickBooks connections (just added contact info) had null `company_id` values, so they weren't showing in the dropdown
3. **Field Name Mismatch**: The component was sending `companyId` to the API, but the endpoint expected `prospect_id`

## Solutions Implemented

### 1. Updated Company Fetching Logic
```javascript
// Before: Only showed QB-connected companies
realm_id: prospect.company_id,

// After: Shows all prospects, using prospect ID as fallback
realm_id: prospect.company_id || prospect.id,
status: prospect.company_id ? 'active' : 'pending',
```

### 2. Fixed API Field Names
```javascript
// Before:
body: JSON.stringify({
  companyId: transcript.companyId,
  fileName: transcript.fileName,
  // ... other mismatched fields
})

// After:
body: JSON.stringify({
  prospect_id: transcript.companyId,  
  file_name: transcript.fileName,     
  transcript_text: fileContent || transcript.transcriptText,
  duration_seconds: // calculated value
})
```

### 3. Updated Navigation Parameters
```javascript
// Now uses prospect_id as fallback when company_id is null
const accountId = company.company_id || company.prospect_id || company.id
```

### 4. Added Auto-Selection
When navigating from the dashboard with a specific company, the dropdown now auto-selects that company.

## Current Behavior
- Dropdown shows ALL prospects, not just QuickBooks-connected ones
- Prospects without QB show as "pending" status
- Navigation from dashboard properly passes prospect/company IDs
- Transcripts can be uploaded for any prospect
- API properly saves transcripts using prospect_id

## Files Modified
- `app/components/CallTranscriptsIntegration.tsx` - Updated fetching logic and API calls
- `app/components/ConnectedCompaniesWorkflow.tsx` - Fixed navigation parameters