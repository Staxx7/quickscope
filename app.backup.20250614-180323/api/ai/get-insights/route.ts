// Create new file: app/api/ai/get-insights/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const prospect_id = searchParams.get('prospect_id');

    if (!prospect_id) {
      return NextResponse.json({ error: 'prospect_id is required' }, { status: 400 });
    }

    // Get all AI data for this prospect
    const [aiAnalysis, transcriptAnalysis, financialIntelligence] = await Promise.all([
      supabase.from('ai_analyses').select('*').eq('prospect_id', prospect_id).order('created_at', { ascending: false }).limit(1),
      supabase.from('transcript_analyses').select('*').eq('prospect_id', prospect_id).order('created_at', { ascending: false }).limit(1),
      supabase.from('financial_intelligence').select('*').eq('prospect_id', prospect_id).order('created_at', { ascending: false }).limit(1)
    ]);

    const insights = {
      prospect_id,
      closeability_score: transcriptAnalysis.data?.[0]?.closeability_score || aiAnalysis.data?.[0]?.analysis_data?.salesIntelligence?.closeability || 0,
      urgency_level: transcriptAnalysis.data?.[0]?.urgency_level || 'low',
      financial_health_score: financialIntelligence.data?.[0]?.health_score || 0,
      talking_points: transcriptAnalysis.data?.[0]?.talking_points || aiAnalysis.data?.[0]?.analysis_data?.talkingPoints || [],
      pain_points: transcriptAnalysis.data?.[0]?.pain_points || [],
      next_actions: [
        transcriptAnalysis.data?.[0]?.urgency_level === 'high' ? 'Schedule immediate follow-up call' : null,
        financialIntelligence.data?.[0]?.health_score < 50 ? 'Focus on financial improvement opportunities' : null,
        'Generate personalized audit deck'
      ].filter(Boolean),
      data_completeness: {
        has_financial_data: !!financialIntelligence.data?.[0],
        has_transcript_data: !!transcriptAnalysis.data?.[0],
        has_ai_analysis: !!aiAnalysis.data?.[0]
      }
    };

    return NextResponse.json({ insights });

  } catch (error) {
    console.error('Error getting insights:', error);
    return NextResponse.json(
      { error: 'Failed to get insights' },
      { status: 500 }
    );
  }
}