import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  try {
    const { prospect_id, company_id } = await request.json()

    if (!prospect_id && !company_id) {
      return NextResponse.json({
        error: 'Either prospect_id or company_id is required'
      }, { status: 400 })
    }

    // Get the prospect data
    let prospectData
    if (prospect_id) {
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .eq('id', prospect_id)
        .single()
      
      if (error) throw error
      prospectData = data
    } else {
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .eq('qb_company_id', company_id)
        .single()
      
      if (error) {
        // No prospect found for this company
        return NextResponse.json({
          success: true,
          workflow_stage: 'needs_prospect_info'
        })
      }
      prospectData = data
    }

    // Check for transcripts
    const { count: transcriptCount } = await supabase
      .from('call_transcripts')
      .select('*', { count: 'exact', head: true })
      .eq('prospect_id', prospectData.id)

    // Check for AI analysis
    const { data: aiAnalysis } = await supabase
      .from('ai_analyses')
      .select('*')
      .eq('prospect_id', prospectData.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // Determine new workflow stage
    let newWorkflowStage = 'needs_transcript'
    
    if ((transcriptCount || 0) > 0) {
      newWorkflowStage = 'needs_analysis'
    }
    
    if (aiAnalysis) {
      newWorkflowStage = 'ready_for_report'
    }

    // Update the workflow stage
    const { error: updateError } = await supabase
      .from('prospects')
      .update({ 
        workflow_stage: newWorkflowStage,
        updated_at: new Date().toISOString()
      })
      .eq('id', prospectData.id)

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      workflow_stage: newWorkflowStage,
      prospect_id: prospectData.id,
      message: `Workflow stage updated to: ${newWorkflowStage}`
    })

  } catch (error) {
    console.error('Update workflow stage error:', error)
    return NextResponse.json({
      error: 'Failed to update workflow stage',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}