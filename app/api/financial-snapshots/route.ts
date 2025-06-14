import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/app/lib/serviceFactory';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const realmId = searchParams.get('realm_id');
    const companyId = searchParams.get('company_id');
    const limit = searchParams.get('limit') || '10';

    const supabase = getSupabase();
    let query = supabase
      .from('financial_snapshots')
      .select('*')
      .order('snapshot_date', { ascending: false })
      .limit(parseInt(limit));

    if (realmId || companyId) {
      query = query.eq('company_id', realmId || companyId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching financial snapshots:', error);
      return NextResponse.json(
        { error: 'Failed to fetch financial snapshots', details: error.message },
        { status: 500 }
      );
    }

    // Transform data to match the expected format
    const transformedData = data?.map(snapshot => ({
      revenue: snapshot.revenue || 0,
      net_income: snapshot.net_income || 0,
      expenses: snapshot.expenses || 0,
      assets: snapshot.assets || 0,
      liabilities: snapshot.liabilities || 0,
      growth_rate: calculateGrowthRate(data, snapshot),
      profit_margin: snapshot.net_margin ? snapshot.net_margin / 100 : 0,
      current_ratio: snapshot.current_ratio || 0,
      debt_to_equity: snapshot.debt_to_equity || 0,
      created_at: snapshot.created_at || new Date().toISOString()
    })) || [];

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company_id, ...snapshotData } = body;

    if (!company_id) {
      return NextResponse.json(
        { error: 'company_id is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('financial_snapshots')
      .upsert({
        company_id,
        snapshot_date: new Date().toISOString().split('T')[0],
        ...snapshotData,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating financial snapshot:', error);
      return NextResponse.json(
        { error: 'Failed to create financial snapshot', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      snapshot: data
    }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function calculateGrowthRate(allSnapshots: any[], currentSnapshot: any): number {
  if (!allSnapshots || allSnapshots.length < 2) return 0;
  
  const currentRevenue = currentSnapshot.revenue || 0;
  const previousSnapshot = allSnapshots.find(s => 
    s.company_id === currentSnapshot.company_id && 
    s.snapshot_date < currentSnapshot.snapshot_date
  );
  
  if (!previousSnapshot || !previousSnapshot.revenue) return 0;
  
  return (currentRevenue - previousSnapshot.revenue) / previousSnapshot.revenue;
} 