# QuickBooks Company Name Display Feature

## Overview
The QuickBooks integration now automatically fetches and displays the actual company name instead of showing the QuickBooks Company ID (realm ID).

## How It Works

### 1. During OAuth Connection
When a company connects their QuickBooks account:
- The OAuth callback (`/api/qbo/callback`) automatically fetches the company information from QuickBooks
- The company name is retrieved using the QuickBooks Company Info API
- The name is stored in the `qbo_tokens` table alongside the connection details

### 2. Company Name Fetching
The system tries multiple paths to find the company name in the QuickBooks response:
```javascript
// Paths checked (in order):
- data.CompanyInfo.CompanyName
- data.CompanyInfo.Name  
- data.QueryResponse.CompanyInfo[0].CompanyName
- data.QueryResponse.CompanyInfo[0].Name
- data.QueryResponse.CompanyInfo[0].LegalName
```

### 3. Display in Dashboard
- Connected companies show their actual business name
- If name fetch fails, displays `Company {realm_id}` as fallback
- Companies like "TechFlow Solutions" appear with their proper name

## Refresh Company Names Feature

### Purpose
For existing connections that might be showing Company IDs, there's a refresh feature to fetch names from QuickBooks.

### How to Use
1. **From Dashboard**: Click the "Refresh Company Names" button (purple button in header)
2. **Via API**: POST to `/api/admin/refresh-company-names`

### What It Does
- Scans all QuickBooks connections
- Skips companies that already have proper names
- Skips expired tokens
- Fetches company names from QuickBooks for those showing IDs
- Updates the database with fetched names

### Results
The refresh provides a summary:
- **Updated**: Number of names successfully fetched and updated
- **Skipped**: Companies that already had names or had expired tokens
- **Failed**: Companies where the name fetch failed

## API Endpoints

### 1. OAuth Callback
`GET /api/qbo/callback`
- Automatically fetches company name during connection
- Stores name in `qbo_tokens.company_name`

### 2. Refresh Company Names
`POST /api/admin/refresh-company-names`
- Batch updates company names for existing connections
- Returns detailed results for each company

### 3. Connected Companies
`GET /api/admin/connected-companies`
- Returns all connected companies with their names
- Uses `company_name` field from `qbo_tokens`

## Database Schema
The `qbo_tokens` table includes:
```sql
company_id: VARCHAR(255) -- QuickBooks Realm ID
company_name: VARCHAR(255) -- Actual company name from QuickBooks
```

## Troubleshooting

### Company Still Shows ID
1. Token might be expired - reconnect QuickBooks
2. QuickBooks API might have failed - use refresh button
3. Company might not have a name set in QuickBooks

### Refresh Fails
- Check if token is still valid (not expired)
- Verify QuickBooks API is accessible
- Check Vercel logs for detailed error messages

## Benefits
- **Better UX**: Users see recognizable company names instead of cryptic IDs
- **Easier Management**: Can identify companies at a glance
- **Consistent Display**: Names appear throughout the platform
- **No Manual Entry Required**: Names come directly from QuickBooks

## Note
The manual contact information update feature remains available for cases where:
- Additional contact details are needed
- QuickBooks connection isn't available
- Override information is required