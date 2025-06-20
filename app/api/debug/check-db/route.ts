import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const envCheck = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...'
    };

    // Initialize Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        error: 'Missing Supabase configuration',
        envCheck
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test database connection by checking table existence
    const { data: tables, error: tableError } = await supabase
      .from('financial_snapshots')
      .select('*')
      .limit(1);

    const tableCheck = {
      canAccessTable: !tableError,
      tableError: tableError?.message,
      tableErrorCode: tableError?.code,
      tableErrorHint: tableError?.hint
    };

    // Try to get table schema info
    const { data: columns, error: schemaError } = await supabase
      .rpc('get_table_columns', { table_name: 'financial_snapshots' })
      .single()
      .catch(() => ({ data: null, error: 'Schema check not available' }));

    // Test insert capability with dummy data
    const testCompanyId = 'test_' + Date.now();
    const { data: insertTest, error: insertError } = await supabase
      .from('financial_snapshots')
      .insert({
        company_id: testCompanyId,
        revenue: 1000,
        net_income: 100,
        expenses: 900,
        assets: 5000,
        liabilities: 2000,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    const insertCheck = {
      canInsert: !insertError,
      insertError: insertError?.message,
      insertErrorCode: insertError?.code,
      insertErrorHint: insertError?.hint,
      insertedId: insertTest?.id
    };

    // Clean up test data if insert was successful
    if (insertTest?.id) {
      await supabase
        .from('financial_snapshots')
        .delete()
        .eq('company_id', testCompanyId);
    }

    // Check if we can query qbo_tokens table
    const { error: tokenTableError } = await supabase
      .from('qbo_tokens')
      .select('company_id')
      .limit(1);

    const tokenTableCheck = {
      canAccessTokenTable: !tokenTableError,
      tokenTableError: tokenTableError?.message
    };

    return NextResponse.json({
      status: 'Database connectivity check',
      timestamp: new Date().toISOString(),
      envCheck,
      tableCheck,
      insertCheck,
      tokenTableCheck,
      schemaInfo: columns || 'Not available',
      recommendation: getRecommendation(tableCheck, insertCheck, tokenTableCheck)
    });

  } catch (error) {
    console.error('Database check error:', error);
    return NextResponse.json({
      error: 'Failed to check database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function getRecommendation(tableCheck: any, insertCheck: any, tokenTableCheck: any): string {
  if (!tableCheck.canAccessTable) {
    return 'Cannot access financial_snapshots table. Check if table exists and permissions are correct.';
  }
  if (!insertCheck.canInsert) {
    if (insertCheck.insertErrorCode === '23505') {
      return 'Duplicate key error. There might be a unique constraint issue.';
    }
    if (insertCheck.insertErrorCode === '42501') {
      return 'Permission denied. Check database role permissions.';
    }
    return `Insert failed with: ${insertCheck.insertError}`;
  }
  if (!tokenTableCheck.canAccessTokenTable) {
    return 'Cannot access qbo_tokens table. Check table permissions.';
  }
  return 'Database connection and permissions appear to be working correctly.';
} 