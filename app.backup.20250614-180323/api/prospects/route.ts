import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const { data: prospects, error } = await supabase
      .from('prospects')
      .select(`
        *,
        qbo_tokens (
          company_id,
          company_name,
          expires_at
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching prospects:', error);
      return NextResponse.json({ error: 'Failed to fetch prospects' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      prospects: prospects || [],
      count: prospects?.length || 0
    });
  } catch (error) {
    console.error('Prospects API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 