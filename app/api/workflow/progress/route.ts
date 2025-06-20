// app/api/workflow/progress/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

interface Document {
  id: string;
  realm_id: string;
  document_type: string;
}

interface FinancialSnapshot {
  id: string;
  realm_id: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const realm_id = searchParams.get('realm_id') || searchParams.get('companyId')

    if (!realm_id) {
      return NextResponse.json(
        { error: 'realm_id or companyId is required' },
        { status: 400 }
      )
    }

    // Get transcript count from documents table
    const { data: allDocuments } = await supabase
      .from('documents')
      .select() as { data: Document[] | null }
    
    const transcripts = allDocuments?.filter(d => 
      d.realm_id === realm_id && d.document_type === 'transcript'
    )

    // Get financial snapshots count  
    const { data: allSnapshots } = await supabase
      .from('financial_snapshots')
      .select() as { data: FinancialSnapshot[] | null }
    
    const snapshots = allSnapshots?.filter(s => s.realm_id === realm_id)

    // Get audit decks count
    const auditDecks = allDocuments?.filter(d => 
      d.realm_id === realm_id && d.document_type === 'audit_deck'
    )

    // Calculate workflow progress
    const transcriptCount = transcripts?.length || 0
    const snapshotCount = snapshots?.length || 0
    const auditDeckCount = auditDecks?.length || 0

    let stage = 1
    let currentStep = 'Connect QuickBooks account'
    let nextStep = 'Schedule discovery call'

    // Stage progression logic
    if (realm_id && realm_id !== 'undefined') {
      stage = 2
      currentStep = 'QuickBooks connected'
      nextStep = 'Upload discovery call transcript'
    }

    if (transcriptCount > 0) {
      stage = 3
      currentStep = 'Discovery call transcript uploaded'
      nextStep = 'Generate audit deck'
    }

    if (auditDeckCount > 0) {
      stage = 4
      currentStep = 'Audit deck generated'
      nextStep = 'Schedule audit call'
    }

    return NextResponse.json({
      stage,
      total_stages: 4,
      current_step: currentStep,
      next_step: nextStep,
      transcript_count: transcriptCount,
      snapshot_count: snapshotCount,
      audit_deck_count: auditDeckCount,
      realm_id,
      last_updated: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching workflow progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workflow progress' },
      { status: 500 }
    )
  }
}
