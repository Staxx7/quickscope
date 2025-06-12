import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET: Fetch all transcripts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('company_id')

    let query = supabase
      .from('call_transcripts')
      .select(`
        *,
        prospects (
          company_name,
          company_id
        )
      `)
      .order('created_at', { ascending: false })

    // Filter by company if specified
    if (companyId) {
      query = query.eq('company_id', companyId)
    }

    const { data: transcripts, error } = await query

    if (error) {
      console.error('Error fetching transcripts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch transcripts' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      transcripts: transcripts || []
    })

  } catch (error) {
    console.error('Error in transcripts GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create new transcript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      fileName,
      companyId,
      callType,
      duration,
      participants,
      transcriptText,
      aiAnalysis,
      sentiment,
      confidence
    } = body

    if (!fileName || !companyId) {
      return NextResponse.json(
        { error: 'fileName and companyId are required' },
        { status: 400 }
      )
    }

    // Create transcript record
    const { data: transcript, error } = await supabase
      .from('call_transcripts')
      .insert({
        file_name: fileName,
        company_id: companyId,
        call_type: callType || 'discovery',
        duration: duration || '00:00',
        participants: participants || [],
        transcript_text: transcriptText,
        sentiment: sentiment || 'neutral',
        confidence: confidence || 0,
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating transcript:', error)
      return NextResponse.json(
        { error: 'Failed to create transcript' },
        { status: 500 }
      )
    }

    // Store AI analysis separately if provided
    if (aiAnalysis && transcript) {
      const { error: analysisError } = await supabase
        .from('call_transcript_analysis')
        .insert({
          transcript_id: transcript.id,
          pain_points: aiAnalysis.painPoints || [],
          business_goals: aiAnalysis.businessGoals || [],
          budget_indications: aiAnalysis.budgetIndications || [],
          decision_makers: aiAnalysis.decisionMakers || [],
          competitive_threats: aiAnalysis.competitiveThreats || [],
          urgency: aiAnalysis.urgency || 'medium',
          next_steps: aiAnalysis.nextSteps || [],
          sales_score: aiAnalysis.salesScore || 0,
          financial_insights: aiAnalysis.financialInsights || [],
          risk_factors: aiAnalysis.riskFactors || [],
          created_at: new Date().toISOString()
        })

      if (analysisError) {
        console.error('Error storing AI analysis:', analysisError)
        // Don't fail the request, but log the error
      }
    }

    return NextResponse.json({
      success: true,
      id: transcript.id,
      transcript
    })

  } catch (error) {
    console.error('Error in transcripts POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}\