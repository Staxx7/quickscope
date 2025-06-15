import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabaseClient'

interface ProspectData {
  id: string
  company_name: string
  contact_name: string
  email: string
  phone?: string
  industry?: string
  workflow_stage?: string
  user_type?: string
  qb_company_id?: string
  created_at: string
  updated_at?: string
  qbo_tokens?: Array<{
    company_id: string
    company_name: string
    token_created_at: string
  }>
  ai_analyses?: Array<{
    closeability_score: number
    financial_health_score: number
    key_insights: string[]
    pain_points: string[]
    opportunities: string[]
    analysis_date: string
  }>
  call_transcripts?: Array<{
    id: string
    file_name: string
    analysis_results: any
    transcript_date: string
  }>
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    
    // Simplified query - fetch only prospects without relationships
    // to avoid schema cache issues
    const { data: prospects, error: prospectsError } = await supabase
      .from('prospects')
      .select('*')
      .order('created_at', { ascending: false })

    if (prospectsError) {
      console.error('Error fetching prospects:', prospectsError)
      return NextResponse.json(
        { error: 'Failed to fetch prospects', details: prospectsError.message },
        { status: 500 }
      )
    }

    // For now, return simplified data without the complex relationships
    const enrichedProspects = prospects?.map((prospect: any) => {
      return {
        id: prospect.id,
        company_name: prospect.company_name || prospect.name || 'Unknown',
        contact_name: prospect.contact_name || 'Unknown',
        email: prospect.email,
        phone: prospect.phone || 'N/A',
        industry: prospect.industry || 'N/A',
        status: prospect.workflow_stage || 'discovery',
        company_id: prospect.qb_company_id || null,
        closeability_score: 0,
        financial_health_score: null,
        last_activity: prospect.updated_at || prospect.created_at,
        next_step: 'Continue workflow',
        transcript_count: 0,
        ai_insights: null,
        pain_points: null,
        opportunities: null,
        analysis_status: prospect.workflow_stage || 'discovery',
        needs_transcript: prospect.workflow_stage === 'needs_transcript',
        transcript_id: null,
        workflow_stage: prospect.workflow_stage || 'discovery',
        created_at: prospect.created_at
      }
    }) || []

    return NextResponse.json({
      prospects: enrichedProspects,
      total: enrichedProspects.length,
      summary: {
        total_accounts: enrichedProspects.length,
        connected_accounts: enrichedProspects.filter(p => p.company_id).length,
        ready_for_transcripts: enrichedProspects.filter(p => p.workflow_stage === 'needs_transcript').length,
        ready_for_audit: enrichedProspects.filter(p => p.workflow_stage === 'ready_for_report').length,
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
    const { company_name, contact_name, email, phone, industry } = body

    // Validate required fields
    if (!company_name || !contact_name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: company_name, contact_name, email' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseServerClient()

    // Create new prospect
    const { data: prospect, error: insertError } = await supabase
      .from('prospects')
      .insert([{
        company_name,
        contact_name,
        email,
        phone,
        industry,
        workflow_stage: 'needs_transcript',
        user_type: 'prospect',
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