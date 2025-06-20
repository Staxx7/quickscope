// Create new file: app/api/ai/combined-analysis/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { prospect_id } = await request.json();

    if (!prospect_id) {
      return NextResponse.json({ error: 'prospect_id is required' }, { status: 400 });
    }

    // Trigger all analysis types in sequence
    const results = {
      financial_analysis: null,
      transcript_analysis: null,
      audit_deck: null
    };

    try {
      // 1. Financial Analysis
      const financialResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ai/financial-health-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospect_id })
      });
      
      if (financialResponse.ok) {
        results.financial_analysis = await financialResponse.json();
      }

      // 2. Transcript Analysis (if transcript exists)
      const transcriptResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ai/analyze-transcript`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospect_id })
      });
      
      if (transcriptResponse.ok) {
        results.transcript_analysis = await transcriptResponse.json();
      }

      // 3. Generate Audit Deck
      const auditResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ai/generate-audit-deck`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospect_id })
      });
      
      if (auditResponse.ok) {
        results.audit_deck = await auditResponse.json();
      }

    } catch (analysisError) {
      console.error('Error in combined analysis:', analysisError);
    }

    // Update prospect workflow stage
    await supabase
      .from('prospects')
      .update({ 
        workflow_stage: 'analysis_complete',
        updated_at: new Date().toISOString()
      })
      .eq('id', prospect_id);

    return NextResponse.json({
      success: true,
      prospect_id,
      results,
      completed_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in combined analysis:', error);
    return NextResponse.json(
      { error: 'Combined analysis failed' },
      { status: 500 }
    );
  }
}
