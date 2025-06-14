import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { prospect_id } = await request.json();

    if (!prospect_id) {
      return NextResponse.json({ error: 'prospect_id is required' }, { status: 400 });
    }

    // Get prospect and financial data
    const { data: prospect } = await supabase
      .from('prospects')
      .select('*')
      .eq('id', prospect_id)
      .single();

    const { data: financialData } = await supabase
      .from('financial_snapshots')
      .select('*')
      .eq('company_id', prospect.company_id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!financialData || financialData.length === 0) {
      return NextResponse.json({ error: 'No financial data found' }, { status: 404 });
    }

    const data = financialData[0];
    
    // Calculate health score
    const profitability = Math.min(100, Math.max(0, (data.profit_margin + 20) * 2.5));
    const liquidity = Math.min(100, Math.max(0, data.current_ratio * 50));
    const solvency = Math.min(100, Math.max(0, (1 - data.debt_to_equity) * 100));
    const efficiency = Math.min(100, Math.max(0, data.operating_margin * 5));
    const growth = Math.min(100, Math.max(0, (data.revenue_growth_rate + 10) * 5));

    const overall_score = Math.round(
      (profitability * 0.3) + (liquidity * 0.2) + (solvency * 0.2) + (efficiency * 0.15) + (growth * 0.15)
    );

    return NextResponse.json({
      success: true,
      health_score: {
        overall_score,
        component_scores: { profitability, liquidity, solvency, efficiency, growth },
        company_name: prospect.name,
        financial_data: data
      }
    });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
