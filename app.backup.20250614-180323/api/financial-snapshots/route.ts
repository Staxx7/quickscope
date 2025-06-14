import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get('company_id');
  const realmId = searchParams.get('realm_id');

  try {
    let query = supabase
      .from('financial_snapshots')
      .select('*')
      .order('created_at', { ascending: false });

    if (companyId) {
      query = query.eq('company_id', companyId);
    } else if (realmId) {
      query = query.eq('company_id', realmId);
    }

    const { data: snapshots, error } = await query;

    if (error) {
      console.error('Error fetching financial snapshots:', error);
      return NextResponse.json({ error: 'Failed to fetch financial snapshots' }, { status: 500 });
    }

    return NextResponse.json(snapshots || []);
  } catch (error) {
    console.error('Financial snapshots API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const snapshotData = await request.json();

    const { data: snapshot, error } = await supabase
      .from('financial_snapshots')
      .insert([{
        company_id: snapshotData.company_id,
        revenue: snapshotData.revenue || 0,
        net_income: snapshotData.net_income || 0,
        expenses: snapshotData.expenses || 0,
        assets: snapshotData.assets || 0,
        liabilities: snapshotData.liabilities || 0,
        snapshot_data: snapshotData.snapshot_data || {},
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating financial snapshot:', error);
      return NextResponse.json({ error: 'Failed to create financial snapshot' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      snapshot
    });
  } catch (error) {
    console.error('Create financial snapshot error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 