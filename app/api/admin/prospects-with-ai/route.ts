import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

interface AnalysisPayload {
  prospectId: string;
  companyInfo: {
    name: string;
    industry: string;
    yearEstablished: number;
  };
  analysisType: string;
  financialData?: {
    profitLoss: {
      totalRevenue: number;
      netIncome: number;
      totalExpenses: number;
    };
    balanceSheet: {
      totalAssets: number;
      totalLiabilities: number;
    };
  };
  transcriptText?: string;
}

export async function GET(request: NextRequest) {
  try {
    // Fetch prospects with their latest financial data AND AI analysis
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

    // Fetch AI analysis data for all prospects
    const prospectIds = prospects?.map(p => p.id) || []
    
    let aiAnalysesData = []
    let transcriptAnalysesData = []
    let financialIntelligenceData = []

    if (prospectIds.length > 0) {
      // Get latest AI analyses
      const { data: aiAnalyses } = await supabase
        .from('ai_analyses')
        .select('*')
        .in('prospect_id', prospectIds)
        .order('created_at', { ascending: false })

      // Get latest transcript analyses  
      const { data: transcriptAnalyses } = await supabase
        .from('transcript_analyses')
        .select('*')
        .in('prospect_id', prospectIds)
        .order('created_at', { ascending: false })

      // Get financial intelligence
      const { data: financialIntelligence } = await supabase
        .from('financial_intelligence')
        .select('*')
        .in('prospect_id', prospectIds)
        .order('created_at', { ascending: false })

      aiAnalysesData = aiAnalyses || []
      transcriptAnalysesData = transcriptAnalyses || []
      financialIntelligenceData = financialIntelligence || []
    }

    // Enhance prospects data with AI analysis
    const enhancedProspects = prospects?.map(prospect => {
      const hasValidToken = prospect.qbo_tokens && 
        prospect.qbo_tokens.length > 0 && 
        new Date(prospect.qbo_tokens[0].expires_at) > new Date()
      
      const latestFinancialData = prospect.financial_snapshots && 
        prospect.financial_snapshots.length > 0 ? 
        prospect.financial_snapshots[0] : null

      // Find latest AI analysis for this prospect
      const latestAIAnalysis = aiAnalysesData
        .filter(analysis => analysis.prospect_id === prospect.id)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]

      // Find latest transcript analysis
      const latestTranscriptAnalysis = transcriptAnalysesData
        .filter(analysis => analysis.prospect_id === prospect.id)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]

      // Find latest financial intelligence
      const latestFinancialIntelligence = financialIntelligenceData
        .filter(intel => intel.prospect_id === prospect.id)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]

      // Calculate workflow stage based on available data
      let workflowStage = 'connected'
      let nextAction = 'Extract Financial Data'
      
      if (latestFinancialData) {
        workflowStage = 'data_extracted'
        nextAction = 'Upload Call Transcript'
      }
      
      if (latestTranscriptAnalysis) {
        workflowStage = 'transcript_uploaded'
        nextAction = 'Generate Analysis'
      }
      
      if (latestAIAnalysis) {
        workflowStage = 'analysis_complete'
        nextAction = 'Generate Report'
      }

      // Build AI analysis summary
      let aiAnalysisSummary = null
      if (latestAIAnalysis || latestTranscriptAnalysis || latestFinancialIntelligence) {
        // Extract key insights from AI analysis
        const analysisData = latestAIAnalysis?.analysis_data || {}
        const transcriptData = latestTranscriptAnalysis?.analysis_data || {}
        
        // Calculate closeability score
        let closeabilityScore = latestTranscriptAnalysis?.closeability_score || 0
        if (!closeabilityScore && analysisData.transcriptAnalysis?.salesIntelligence?.closeability) {
          closeabilityScore = analysisData.transcriptAnalysis.salesIntelligence.closeability
        }

        // Determine urgency level
        let urgencyLevel = latestTranscriptAnalysis?.urgency_level || 'low'
        if (!urgencyLevel || urgencyLevel === 'low') {
          if (analysisData.transcriptAnalysis?.urgencySignals?.timeline?.includes('urgent')) {
            urgencyLevel = 'high'
          } else if (analysisData.transcriptAnalysis?.urgencySignals?.timeline?.includes('soon')) {
            urgencyLevel = 'medium'
          }
        }

        // Extract key insights
        const keyInsights = []
        if (analysisData.businessInsights?.keyFindings) {
          keyInsights.push(...analysisData.businessInsights.keyFindings.slice(0, 3))
        }
        if (transcriptData.businessObjectives?.shortTerm) {
          keyInsights.push(...transcriptData.businessObjectives.shortTerm.slice(0, 2))
        }

        // Extract talking points
        const talkingPoints = []
        if (latestTranscriptAnalysis?.talking_points?.valuePropositions) {
          talkingPoints.push(...latestTranscriptAnalysis.talking_points.valuePropositions.slice(0, 3))
        }
        if (analysisData.talkingPoints?.openingStatements) {
          talkingPoints.push(...analysisData.talkingPoints.openingStatements.slice(0, 2))
        }

        // Extract pain points
        const painPoints = []
        if (transcriptData.painPoints?.operational) {
          painPoints.push(...transcriptData.painPoints.operational.slice(0, 2))
        }
        if (transcriptData.painPoints?.financial) {
          painPoints.push(...transcriptData.painPoints.financial.slice(0, 2))
        }

        aiAnalysisSummary = {
          id: latestAIAnalysis?.id || latestTranscriptAnalysis?.id || 'combined',
          closeability_score: Math.round(closeabilityScore),
          urgency_level: urgencyLevel,
          analysis_status: latestAIAnalysis ? 'completed' : 'processing',
          key_insights: keyInsights.slice(0, 4),
          talking_points: talkingPoints.slice(0, 5),
          pain_points: painPoints.slice(0, 4),
          last_analyzed: latestAIAnalysis?.created_at || latestTranscriptAnalysis?.created_at || new Date().toISOString(),
          has_transcript_data: !!latestTranscriptAnalysis,
          financial_health_score: latestFinancialIntelligence?.health_score || 
                                 analysisData.financialIntelligence?.healthScore || null
        }
      }

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
        ),
        ai_analysis: aiAnalysisSummary
      }
    }) || []

    // Calculate enhanced stats
    const total = enhancedProspects.length
    const connected = enhancedProspects.filter(p => p.connection_status === 'active').length
    const expired = enhancedProspects.filter(p => p.connection_status === 'expired').length
    const aiAnalyzed = enhancedProspects.filter(p => p.ai_analysis?.analysis_status === 'completed').length
    const highValue = enhancedProspects.filter(p => p.ai_analysis && p.ai_analysis.closeability_score >= 80).length
    const urgentFollowUp = enhancedProspects.filter(p => p.ai_analysis?.urgency_level === 'high').length

    return NextResponse.json({
      prospects: enhancedProspects,
      total,
      connected,
      expired,
      aiAnalyzed,
      highValue,
      urgentFollowUp
    })

  } catch (error) {
    console.error('Error in prospects-with-ai API:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST endpoint for triggering AI analysis on prospects
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, prospect_id, company_id, analysis_type = 'comprehensive' } = body

    if (action === 'trigger_ai_analysis') {
      if (!prospect_id || !company_id) {
        return NextResponse.json(
          { error: 'prospect_id and company_id are required' },
          { status: 400 }
        )
      }

      // Get prospect details
      const { data: prospect, error: prospectError } = await supabase
        .from('prospects')
        .select('*')
        .eq('id', prospect_id)
        .single()

      if (prospectError || !prospect) {
        return NextResponse.json(
          { error: 'Prospect not found' },
          { status: 404 }
        )
      }

      // Get latest financial data
      const { data: financialData } = await supabase
        .from('financial_snapshots')
        .select('*')
        .eq('company_id', company_id)
        .order('created_at', { ascending: false })
        .limit(1)

      // Get latest transcript
      const { data: transcriptData } = await supabase
        .from('transcript_analyses')
        .select('*')
        .eq('prospect_id', prospect_id)
        .order('created_at', { ascending: false })
        .limit(1)

      // Determine what data is available and trigger appropriate analysis
      const hasFinancialData = financialData && financialData.length > 0
      const hasTranscriptData = transcriptData && transcriptData.length > 0

      let analysisType = 'financial-only'
      if (hasFinancialData && hasTranscriptData) {
        analysisType = 'comprehensive'
      } else if (hasTranscriptData) {
        analysisType = 'transcript-only'
      }

      // Prepare data for AI analysis
      const analysisPayload: AnalysisPayload = {
        prospectId: prospect_id,
        companyInfo: {
          name: prospect.company_name,
          industry: prospect.industry || 'Business Services',
          yearEstablished: new Date().getFullYear() - 5
        },
        analysisType
      }

      if (hasFinancialData) {
        analysisPayload.financialData = {
          profitLoss: {
            totalRevenue: financialData[0].revenue,
            netIncome: financialData[0].profit,
            totalExpenses: financialData[0].expenses
          },
          balanceSheet: {
            totalAssets: financialData[0].revenue * 1.5, // Estimate
            totalLiabilities: financialData[0].expenses * 0.8 // Estimate
          }
        }
      }

      if (hasTranscriptData) {
        analysisPayload.transcriptText = transcriptData[0].transcript_text || ''
      }

      // Call the AI analysis endpoint
      const analysisResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/ai/analyze-prospect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisPayload)
      })

      if (analysisResponse.ok) {
        const analysisResult = await analysisResponse.json()
        return NextResponse.json({
          success: true,
          message: 'AI analysis triggered successfully',
          analysisId: analysisResult.analysisId,
          analysisType,
          dataUsed: {
            hasFinancialData,
            hasTranscriptData
          }
        })
      } else {
        throw new Error('AI analysis failed')
      }
    }

    // Handle other actions from the original prospects endpoint
    switch (action) {
      case 'update_notes':
        const { data: updatedProspect, error: updateError } = await supabase
          .from('prospects')
          .update({ 
            notes: body.data.notes,
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

        // Reset status after a delay (in production, this would be handled by a background job)
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
    console.error('Error in prospects-with-ai POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
