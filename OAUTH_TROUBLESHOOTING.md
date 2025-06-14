# OAuth Troubleshooting Guide for QuickScope

## Current Issues & Solutions

### Issue 1: Invalid State Error
**Fixed in latest deployment** - The OAuth login now properly sets the state cookie.

### Issue 2: QuickBooks Shows Connected but Dashboard Doesn't
This happens when OAuth completes on QuickBooks' side but tokens aren't saved to your database.

## Immediate Actions After Deployment

### 1. Check Your QuickBooks App Settings
Go to https://app.developer.intuit.com and verify:
- **Redirect URI** must be exactly: `https://quickscope.info/api/auth/quickbooks/callback`
- Not `/api/auth/callback` (old route)
- Include the full URL with `https://`

### 2. Debug Current Connections
Visit: https://quickscope.info/api/debug/connections

This will show you:
- All saved tokens in database
- All prospects with QB connections
- Current cookies
- Environment configuration

### 3. Check Vercel Environment Variables
Ensure these are set in Vercel:
```
QUICKBOOKS_CLIENT_ID=your_client_id
QUICKBOOKS_CLIENT_SECRET=your_client_secret
QUICKBOOKS_REDIRECT_URI=https://quickscope.info/api/auth/quickbooks/callback
QUICKBOOKS_ENVIRONMENT=production
NEXT_PUBLIC_APP_URL=https://quickscope.info
```

### 4. Run SQL Migration
If you haven't already, run this in Supabase SQL editor:
```sql
-- Add missing columns
ALTER TABLE prospects 
ADD COLUMN IF NOT EXISTS user_type VARCHAR(50) DEFAULT 'prospect',
ADD COLUMN IF NOT EXISTS qb_company_id VARCHAR(255);

-- Add index
CREATE INDEX IF NOT EXISTS idx_prospects_qb_company_id ON prospects(qb_company_id);

-- Check if qbo_tokens table has all required columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'qbo_tokens';
```

## How the Flow Should Work

1. User clicks "Connect to QuickBooks" at `/connect`
2. Redirects to `/api/auth/login` which:
   - Sets state cookie
   - Redirects to QuickBooks OAuth
3. QuickBooks redirects to `/api/auth/quickbooks/callback` which:
   - Verifies state
   - Exchanges code for tokens
   - Saves tokens to `qbo_tokens` table
   - Creates/updates `prospects` record
   - Redirects based on user type

## Common Problems & Solutions

### "Invalid State" Error
- **Cause**: Cookie not being set or read properly
- **Fix**: Clear all cookies for quickscope.info and try again

### Connection Shows in QuickBooks but Not Dashboard
- **Cause**: Token save failed
- **Check**: Visit `/api/debug/connections` to see if tokens were saved
- **Fix**: Disconnect in QuickBooks and reconnect

### Dashboard Shows "No Companies Connected"
- **Cause**: `/api/companies` endpoint not finding tokens
- **Check**: Look at browser console for API errors
- **Fix**: Check if `qbo_tokens` table has data

## Testing Checklist

1. [ ] Clear all cookies for quickscope.info
2. [ ] Go to https://quickscope.info/connect
3. [ ] Fill form and click "Connect to QuickBooks"
4. [ ] Choose company in QuickBooks
5. [ ] Should redirect to success page (prospects) or dashboard (internal)
6. [ ] Check https://quickscope.info/api/debug/connections
7. [ ] Visit https://quickscope.info/dashboard - should show connected company

## Emergency Fixes

### If Nothing Works
1. Check Vercel function logs for errors
2. Temporarily add `console.log` statements to track the flow
3. Check Supabase logs for database errors
4. Verify QuickBooks app is in production mode

### Manual Token Test
You can test if your database accepts tokens by running this in Supabase SQL editor:
```sql
INSERT INTO qbo_tokens (
  company_id, 
  company_name, 
  access_token, 
  refresh_token, 
  expires_at
) VALUES (
  'test_company_123',
  'Test Company',
  'test_token',
  'test_refresh',
  NOW() + INTERVAL '1 hour'
);
```

Then check if it appears in the dashboard.

## Contact Support
If issues persist after following this guide, provide:
1. Results from `/api/debug/connections`
2. Browser console errors
3. Vercel function logs
4. QuickBooks app configuration screenshot