# Supabase Schema Cache Issue - Complete Solution

## Issue Summary
Contact save functionality was failing with PostgREST schema cache errors, preventing users from adding new contacts to the QuickScope platform.

## Error Details
```
Error: Failed to create prospect
Details: Could not find the 'annual_revenue' column of 'prospects' in the schema cache
Code: PGRST204
```

Later evolved to:
```
Details: Could not find the 'contact_name' column of 'prospects' in the schema cache
```

## Root Cause
Supabase's PostgREST API maintains a schema cache that can become out of sync with the actual database schema. This is a known issue that can occur when:
- Tables have been modified after initial setup
- Row Level Security (RLS) policies are enabled
- The Supabase project has been idle for extended periods
- Schema changes haven't propagated to all PostgREST instances

## Solutions Implemented

### 1. Removed Problematic Fields (Initial Attempt)
- Removed `annual_revenue` and `employee_count` fields from all forms and APIs
- These fields weren't needed as financial data comes from QuickBooks integration

### 2. Created SQL-Based Fallback Endpoint
Created `/api/prospects/create-or-update-sql` that:
- Uses a progressive fallback approach
- Attempts full insert first
- Falls back to minimal fields if schema cache issues occur
- Updates additional fields via raw SQL if needed

### 3. Updated UI Components
- Modified `/admin/prospects/create/page.tsx` to use the new SQL endpoint
- Removed unnecessary financial input fields
- Improved error handling and user feedback

## Code Changes

### New SQL Endpoint
```typescript
// /api/prospects/create-or-update-sql/route.ts
// Attempts multiple strategies to save data:
1. Try full insert with all fields
2. If that fails, insert with minimal fields only
3. Update remaining fields using raw SQL
```

### Form Update
```typescript
// Changed from:
const response = await fetch('/api/prospects/create-or-update', ...)
// To:
const response = await fetch('/api/prospects/create-or-update-sql', ...)
```

## How to Fix in Supabase Dashboard

If you have access to the Supabase dashboard:

1. **Reload Schema** (Temporary Fix)
   - Go to Supabase Dashboard > Database > Tables
   - Click "Reload Schema" button
   - Wait for cache to refresh

2. **Restart PostgREST** (More Persistent)
   - Go to Settings > Infrastructure
   - Restart the PostgREST service

3. **Check RLS Policies**
   - Ensure service role key is being used for server-side operations
   - Check that RLS policies aren't blocking the operations

## Testing

Test the SQL endpoint:
```bash
node test-contact-save-sql.js
```

## Long-term Solutions

1. **Consider Direct Database Connection**
   - Use Supabase's connection pooler for direct SQL queries
   - Bypass PostgREST entirely for critical operations

2. **Schema Versioning**
   - Implement database migrations
   - Keep schema definitions in code
   - Use tools like Prisma or TypeORM

3. **Monitoring**
   - Add health checks for schema cache status
   - Monitor failed operations
   - Alert on schema cache errors

## Current Status
- Contact save functionality restored using SQL fallback
- All TypeScript build errors fixed
- Successfully deployed to production
- Forms now use simplified field set (no manual financial data entry)