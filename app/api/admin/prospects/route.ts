import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    // Fetch prospects with their latest financial data
    const { data: prospects, error } = await supabase
      .from('prospects')
      .select(`
        *,
        qbo_tokens (
          company_id,
          access_token,
          expires_at,
          created_at
        ),
        financial_snapshots (
          revenue,
          expenses,
          profit,
          profit_margin,
          cash_flow,
          created_at
        )
      `)
      .order('connection_date', { ascending: false })

    if (error) {
      console.error('Error fetching prospects:', error)
      return NextResponse.json(
        { error: 'Failed to fetch prospects', details: error.message },
        { status: 500 }
      )
    }

    // Enhance prospects data with status calculations
    const enhancedProspects = prospects?.map(prospect => {
      const hasValidToken = prospect.qbo_tokens && 
        prospect.qbo_tokens.length > 0 && 
        new Date(prospect.qbo_tokens[0].expires_at) > new Date()
      
      const latestFinancialData = prospect.financial_snapshots && 
        prospect.financial_snapshots.length > 0 ? 
        prospect.financial_snapshots[0] : null

      // Calculate workflow stage based on available data
      let workflowStage = 'connected'
      let nextAction = 'Extract Financial Data'
      
      if (latestFinancialData) {
        workflowStage = 'data_extracted'
        nextAction = 'Upload Call Transcript'
      }
      
      // Check if there are call transcripts (you'll need to add this table)
      // For now, assuming no transcripts yet
      
      return {
        ...prospect,
        connection_status: hasValidToken ? 'active' : 'expired',
        workflow_stage: workflowStage,
        next_action: nextAction,
        financial_summary: latestFinancialData ? {
          revenue: latestFinancialData.revenue || 0,
          expenses: latestFinancialData.expenses || 0,
          profit: latestFinancialData.profit || 0,
          profit_margin: latestFinancialData.profit_margin || 0,
          cash_flow: latestFinancialData.cash_flow || 0
        } : null,
        days_connected: Math.floor(
          (new Date().getTime() - new Date(prospect.connection_date).getTime()) / 
          (1000 * 60 * 60 * 24)
        )
      }
    }) || []

    return NextResponse.json({
      prospects: enhancedProspects,
      total: enhancedProspects.length,
      connected: enhancedProspects.filter(p => p.connection_status === 'active').length,
      expired: enhancedProspects.filter(p => p.connection_status === 'expired').length
    })

  } catch (error) {
    console.error('Error in prospects API:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Add a POST endpoint for updating prospect data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, prospect_id, data } = body

    switch (action) {
      case 'update_notes':
        const { data: updatedProspect, error: updateError } = await supabase
          .from('prospects')
          .update({ 
            notes: data.notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', prospect_id)
          .select()

        if (updateError) {
          return NextResponse.json(
            { error: 'Failed to update notes' },
            { status: 500 }
          )
        }

        return NextResponse.json({ success: true, prospect: updatedProspect[0] })

      case 'trigger_sync':
        // Trigger a data refresh for this prospect
        // This would typically queue a background job to fetch latest QB data
        const { data: syncUpdate, error: syncError } = await supabase
          .from('prospects')
          .update({ 
            last_sync: new Date().toISOString(),
            status: 'syncing'
          })
          .eq('id', prospect_id)
          .select()

        if (syncError) {
          return NextResponse.json(
            { error: 'Failed to trigger sync' },
            { status: 500 }
          )
        }

        // TODO: Here you would trigger your QB data extraction API
        // For now, just update the status back to connected
        setTimeout(async () => {
          await supabase
            .from('prospects')
            .update({ status: 'connected' })
            .eq('id', prospect_id)
        }, 2000)

        return NextResponse.json({ success: true, message: 'Sync triggered' })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error in prospects POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
