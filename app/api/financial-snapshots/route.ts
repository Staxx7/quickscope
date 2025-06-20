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

    // Ensure we're using the correct column names for the database
    const dataToInsert = {
      company_id: snapshotData.company_id,
      revenue: snapshotData.revenue || 0,
      profit: snapshotData.net_income || snapshotData.profit || 0,  // Map to correct column name
      expenses: snapshotData.expenses || 0,
      total_assets: snapshotData.assets || snapshotData.total_assets || 0,  // Map to correct column name
      total_liabilities: snapshotData.liabilities || snapshotData.total_liabilities || 0,  // Map to correct column name
      profit_margin: snapshotData.revenue > 0 ? ((snapshotData.net_income || 0) / snapshotData.revenue) * 100 : 0,
      cash_flow: snapshotData.cash_flow || 0,
      current_ratio: snapshotData.current_ratio || 0,
      debt_to_equity: snapshotData.debt_to_equity || 0,
      gross_margin: snapshotData.gross_margin || 0,
      operating_margin: snapshotData.operating_margin || 0,
      revenue_growth_rate: snapshotData.revenue_growth_rate || 0,
      snapshot_type: snapshotData.snapshot_type || 'monthly',
      snapshot_data: snapshotData.snapshot_data || {},
      created_at: new Date().toISOString()
    };

    console.log('Inserting financial snapshot with correct column names:', {
      company_id: dataToInsert.company_id,
      profit: dataToInsert.profit,
      total_assets: dataToInsert.total_assets,
      total_liabilities: dataToInsert.total_liabilities
    });

    const { data: snapshot, error } = await supabase
      .from('financial_snapshots')
      .insert([dataToInsert])
      .select()
      .single();

    if (error) {
      console.error('Error creating financial snapshot:', error);
      return NextResponse.json({ 
        error: 'Failed to create financial snapshot',
        details: error.message,
        hint: 'Check that all column names match the database schema'
      }, { status: 500 });
    }

    // Return the snapshot with mapped field names for consistency
    const responseData = {
      ...snapshot,
      net_income: snapshot.profit,  // Map back for API response
      assets: snapshot.total_assets,
      liabilities: snapshot.total_liabilities
    };

    return NextResponse.json({
      success: true,
      snapshot: responseData
    });
  } catch (error) {
    console.error('Create financial snapshot error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 