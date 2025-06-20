import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();

    // Get column information
    const { data: columns, error: columnsError } = await supabase
      .from('financial_snapshots')
      .select('*')
      .limit(0);

    // Get the most recent 3 snapshots
    const { data: recentSnapshots, error: snapshotsError } = await supabase
      .from('financial_snapshots')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);

    // Get count of snapshots
    const { count, error: countError } = await supabase
      .from('financial_snapshots')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      success: true,
      table_info: {
        total_snapshots: count || 0,
        columns_available: columns ? Object.keys(columns) : 'Unable to fetch column info'
      },
      recent_snapshots: recentSnapshots || [],
      errors: {
        columns_error: columnsError?.message,
        snapshots_error: snapshotsError?.message,
        count_error: countError?.message
      }
    });

  } catch (error) {
    console.error('Debug check-financial-snapshots error:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 