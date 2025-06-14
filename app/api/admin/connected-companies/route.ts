import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching connected QuickBooks companies...')

    // Get ALL companies from qbo_tokens table WITHOUT joining prospects
    const { data: qboTokens, error: tokensError } = await supabase
      .from('qbo_tokens')
      .select('*')
      .order('created_at', { ascending: false })

    if (tokensError) {
      console.error('Error fetching QB tokens:', tokensError)
      return NextResponse.json({
        error: 'Failed to fetch connected companies',
        details: tokensError.message
      }, { status: 500 })
    }

    console.log(`Found ${qboTokens?.length || 0} connected companies`)

    // Now for each token, try to find associated prospect data (if exists)
    const connectedCompanies = await Promise.all((qboTokens || []).map(async (token) => {
      // Check if token is expired
      const isExpired = new Date(token.expires_at) < new Date()
      
      // Try to find associated prospect
      let prospectData = null
      if (token.prospect_id) {
        const { data: prospect } = await supabase
          .from('prospects')
          .select('*')
          .eq('id', token.prospect_id)
          .single()
        
        prospectData = prospect
      }

      // Try to get financial snapshot
      let financialData = null
      const { data: snapshot } = await supabase
        .from('financial_snapshots')
        .select('*')
        .eq('company_id', token.company_id)
        .order('snapshot_date', { ascending: false })
        .limit(1)
        .single()
      
      if (snapshot) {
        financialData = {
          revenue: snapshot.revenue || 0,
          expenses: snapshot.expenses || 0,
          profit: snapshot.net_income || 0,
          profit_margin: snapshot.net_margin || 0
        }
      }

      // Check for AI analysis
      let aiAnalysis = null
      const { data: analysis } = await supabase
        .from('ai_analyses')
        .select('*')
        .eq('company_id', token.company_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (analysis) {
        aiAnalysis = {
          closeability_score: analysis.closeability_score,
          financial_health_score: analysis.financial_health_score,
          key_insights: analysis.key_insights,
          analysis_date: analysis.created_at
        }
      }

      // Check for transcripts
      const { count: transcriptCount } = await supabase
        .from('call_transcripts')
        .select('*', { count: 'exact', head: true })
        .eq('prospect_id', token.prospect_id || 'none')

      return {
        // Core company data
        id: token.company_id,
        company_id: token.company_id,
        company_name: token.company_name || 'Unknown Company',
        
        // Connection info
        connection_status: isExpired ? 'expired' : 'active',
        connected_at: token.created_at,
        expires_at: token.expires_at,
        days_connected: Math.floor((Date.now() - new Date(token.created_at).getTime()) / (1000 * 60 * 60 * 24)),
        
        // Prospect data (if exists)
        prospect_id: token.prospect_id,
        contact_name: prospectData?.contact_name || null,
        email: prospectData?.email || `contact@${token.company_id}.com`,
        phone: prospectData?.phone || null,
        industry: prospectData?.industry || 'Not specified',
        user_type: prospectData?.user_type || 'prospect',
        
        // Workflow & Analysis
        workflow_stage: determineWorkflowStage(token, prospectData, transcriptCount || 0, aiAnalysis),
        has_prospect_record: !!prospectData,
        has_financial_data: !!financialData,
        has_ai_analysis: !!aiAnalysis,
        transcript_count: transcriptCount || 0,
        
        // Financial summary
        financial_summary: financialData,
        
        // AI Analysis summary
        ai_analysis: aiAnalysis,
        
        // Next recommended action
        next_action: determineNextAction(!!prospectData, !!financialData, transcriptCount || 0, !!aiAnalysis)
      }
    }))

    // Calculate stats
    const stats = {
      total: connectedCompanies.length,
      active: connectedCompanies.filter(c => c.connection_status === 'active').length,
      expired: connectedCompanies.filter(c => c.connection_status === 'expired').length,
      with_prospects: connectedCompanies.filter(c => c.has_prospect_record).length,
      with_financial_data: connectedCompanies.filter(c => c.has_financial_data).length,
      with_ai_analysis: connectedCompanies.filter(c => c.has_ai_analysis).length,
      with_transcripts: connectedCompanies.filter(c => c.transcript_count > 0).length
    }

    return NextResponse.json({
      success: true,
      companies: connectedCompanies,
      stats,
      message: `Found ${connectedCompanies.length} connected QuickBooks companies`
    })

  } catch (error) {
    console.error('Connected companies API error:', error)
    return NextResponse.json({
      error: 'Failed to fetch connected companies',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

function determineWorkflowStage(token: any, prospect: any, transcriptCount: number, aiAnalysis: any): string {
  if (!prospect) return 'needs_prospect_info'
  if (transcriptCount === 0) return 'needs_transcript'
  if (!aiAnalysis) return 'needs_analysis'
  return 'ready_for_report'
}

function determineNextAction(hasProspect: boolean, hasFinancial: boolean, transcriptCount: number, hasAI: boolean): string {
  if (!hasProspect) return 'Add Contact Information'
  if (!hasFinancial) return 'Sync Financial Data'
  if (transcriptCount === 0) return 'Upload Discovery Call'
  if (!hasAI) return 'Run AI Analysis'
  return 'Generate Audit Report'
}