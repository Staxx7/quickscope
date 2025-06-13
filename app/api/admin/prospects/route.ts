import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

interface ProspectData {
  id: string
  company_name: string
  contact_name: string
  email: string
  phone: string
  industry: string
  annual_revenue: number
  created_at: string
  qbo_tokens: Array<{
    company_id: string
    company_name: string
    token_created_at: string
  }>
  ai_analyses: Array<{
    closeability_score: number
    financial_health_score: number
    key_insights: string[]
    pain_points: string[]
    opportunities: string[]
    analysis_date: string
  }>
  call_transcripts: Array<{
    id: string
    file_name: string
    analysis_results: any
    transcript_date: string
  }>
}

export async function GET(request: NextRequest) {
  try {
    // Fetch prospects with their associated data
    const { data: prospects, error: prospectsError } = await supabase
      .from('prospects')
      .select(`
        *,
        qbo_tokens (
          company_id,
          company_name,
          created_at as token_created_at
        ),
        ai_analyses (
          closeability_score,
          financial_health_score,
          key_insights,
          pain_points,
          opportunities,
          created_at as analysis_date
        ),
        call_transcripts (
          id,
          file_name,
          analysis_results,
          created_at as transcript_date
        )
      `)
      .order('created_at', { ascending: false }) as { data: ProspectData[] | null, error: any }

    if (prospectsError) {
      console.error('Error fetching prospects:', prospectsError)
      return NextResponse.json(
        { error: 'Failed to fetch prospects', details: prospectsError.message },
        { status: 500 }
      )
    }

    // Transform and enrich the data
    const enrichedProspects = prospects?.map((prospect: ProspectData) => {
      // Determine workflow stage based on available data
      let workflowStage = 'discovery'
      if (prospect.qbo_tokens && prospect.qbo_tokens.length > 0) {
        workflowStage = 'connected'
      }
      if (prospect.call_transcripts && prospect.call_transcripts.length > 0) {
        workflowStage = 'analyzed'
      }
      if (prospect.ai_analyses && prospect.ai_analyses.length > 0) {
        workflowStage = 'audit_ready'
      }

      // Get latest AI analysis
      const latestAnalysis = prospect.ai_analyses && prospect.ai_analyses.length > 0 
        ? prospect.ai_analyses[0] 
        : null

      // Get QB company info
      const qbToken = prospect.qbo_tokens && prospect.qbo_tokens.length > 0 
        ? prospect.qbo_tokens[0] 
        : null

      // Calculate next step
      let nextStep = 'Connect QuickBooks account'
      if (workflowStage === 'connected') {
        nextStep = 'Upload discovery call transcript'
      } else if (workflowStage === 'analyzed') {
        nextStep = 'Generate audit deck'
      } else if (workflowStage === 'audit_ready') {
        nextStep = 'Schedule audit call'
      }

      return {
        id: prospect.id,
        company_name: prospect.company_name,
        contact_name: prospect.contact_name,
        email: prospect.email,
        phone: prospect.phone,
        industry: prospect.industry,
        revenue: prospect.annual_revenue,
        created_at: prospect.created_at,
        qb_company_id: qbToken?.company_id || null,
        workflow_stage: workflowStage,
        closeability_score: latestAnalysis?.closeability_score || null,
        financial_health_score: latestAnalysis?.financial_health_score || null,
        last_activity: getLastActivity(prospect),
        next_step: nextStep,
        transcript_count: prospect.call_transcripts?.length || 0,
        ai_insights: latestAnalysis?.key_insights || null,
        pain_points: latestAnalysis?.pain_points || null,
        opportunities: latestAnalysis?.opportunities || null
      }
    }) || []

    return NextResponse.json({
      prospects: enrichedProspects,
      total: enrichedProspects.length,
      summary: {
        total_accounts: enrichedProspects.length,
        connected_accounts: enrichedProspects.filter(p => p.workflow_stage !== 'discovery').length,
        ready_for_transcripts: enrichedProspects.filter(p => p.workflow_stage === 'connected').length,
        ready_for_audit: enrichedProspects.filter(p => p.workflow_stage === 'audit_ready').length,
        completed: enrichedProspects.filter(p => p.workflow_stage === 'completed').length
      }
    })

  } catch (error: unknown) {
    console.error('Unexpected error in prospects API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { company_name, contact_name, email, phone, industry, annual_revenue } = body

    // Validate required fields
    if (!company_name || !contact_name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: company_name, contact_name, email' },
        { status: 400 }
      )
    }

    // Create new prospect
    const { data: prospect, error: insertError } = await supabase
      .from('prospects')
      .insert([{
        company_name,
        contact_name,
        email,
        phone,
        industry,
        annual_revenue,
        workflow_stage: 'discovery',
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (insertError) {
      console.error('Error creating prospect:', insertError)
      return NextResponse.json(
        { error: 'Failed to create prospect', details: insertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      prospect,
      message: 'Prospect created successfully'
    }, { status: 201 })

  } catch (error: unknown) {
    console.error('Unexpected error creating prospect:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

function getLastActivity(prospect: any): string {
  const dates = []
  
  if (prospect.qbo_tokens && prospect.qbo_tokens.length > 0) {
    dates.push(new Date(prospect.qbo_tokens[0].token_created_at))
  }
  
  if (prospect.ai_analyses && prospect.ai_analyses.length > 0) {
    dates.push(new Date(prospect.ai_analyses[0].analysis_date))
  }
  
  if (prospect.call_transcripts && prospect.call_transcripts.length > 0) {
    dates.push(new Date(prospect.call_transcripts[0].transcript_date))
  }
  
  if (dates.length === 0) {
    return 'Never'
  }
  
  const latestDate = new Date(Math.max(...dates.map(d => d.getTime())))
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - latestDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) {
    return '1 day ago'
  } else if (diffDays < 30) {
    return `${diffDays} days ago`
  } else {
    return latestDate.toLocaleDateString()
  }
}