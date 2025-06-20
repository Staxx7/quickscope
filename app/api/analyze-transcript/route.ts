// app/api/transcripts/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const companyId = formData.get('companyId') as string
    const companyName = formData.get('companyName') as string
    const callType = formData.get('callType') as string || 'discovery'

    if (!file || !companyId) {
      return NextResponse.json({ error: 'File and company ID are required' }, { status: 400 })
    }

    // Step 1: Transcribe audio using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      language: "en",
      response_format: "verbose_json",
      timestamp_granularities: ["segment"]
    })

    // Step 2: Analyze transcript for sales intelligence
    const analysis = await analyzeTranscriptForSales(transcription.text, companyName, callType)

    // Step 3: Store transcript and analysis
    const { data: transcriptRecord, error: transcriptError } = await supabase
      .from('call_transcripts')
      .insert({
        company_id: companyId,
        company_name: companyName,
        call_type: callType,
        transcript_text: transcription.text,
        transcript_json: transcription,
        duration: transcription.duration,
        language: transcription.language,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (transcriptError) {
      throw new Error(`Failed to store transcript: ${transcriptError.message}`)
    }

    // Step 4: Store analysis
    const { data: analysisRecord, error: analysisError } = await supabase
      .from('transcript_analyses')
      .insert({
        transcript_id: transcriptRecord.id,
        company_id: companyId,
        pain_points: analysis.painPoints,
        buying_signals: analysis.buyingSignals,
        decision_makers: analysis.decisionMakers,
        budget_indicators: analysis.budgetIndicators,
        timeline_indicators: analysis.timelineIndicators,
        objections: analysis.objections,
        next_steps: analysis.nextSteps,
        closeability_score: analysis.closeabilityScore,
        urgency_level: analysis.urgencyLevel,
        key_insights: analysis.keyInsights,
        recommended_approach: analysis.recommendedApproach,
        talking_points: analysis.talkingPoints,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (analysisError) {
      throw new Error(`Failed to store analysis: ${analysisError.message}`)
    }

    return NextResponse.json({
      success: true,
      transcript: transcriptRecord,
      analysis: analysisRecord,
      summary: {
        duration: Math.round(transcription.duration || 0),
        closeabilityScore: analysis.closeabilityScore,
        urgencyLevel: analysis.urgencyLevel,
        keyPainPoints: analysis.painPoints.slice(0, 3),
        nextSteps: analysis.nextSteps.slice(0, 3)
      }
    })

  } catch (error) {
    console.error('Transcript analysis error:', error)
    return NextResponse.json({ 
      error: 'Failed to process transcript',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function analyzeTranscriptForSales(transcript: string, companyName: string, callType: string) {
  const analysisPrompt = `
You are an AI sales intelligence analyst. Analyze this ${callType} call transcript for ${companyName} and extract actionable sales insights.

TRANSCRIPT:
${transcript}

Please provide a comprehensive analysis in the following JSON format:
{
  "painPoints": [
    {
      "category": "operational|financial|strategic|technology",
      "description": "specific pain point",
      "evidence": "quote from transcript",
      "severity": "high|medium|low",
      "impact": "estimated business impact"
    }
  ],
  "buyingSignals": [
    {
      "signal": "specific buying signal",
      "strength": "strong|moderate|weak",
      "context": "relevant context"
    }
  ],
  "decisionMakers": [
    {
      "name": "name if mentioned",
      "role": "role/title",
      "influence": "high|medium|low",
      "concerns": ["list of concerns"],
      "motivations": ["list of motivations"]
    }
  ],
  "budgetIndicators": [
    {
      "indicator": "budget signal",
      "amount": "estimated amount if mentioned",
      "context": "context"
    }
  ],
  "timelineIndicators": [
    {
      "urgency": "high|medium|low",
      "timeline": "specific timeline mentioned",
      "driver": "reason for urgency"
    }
  ],
  "objections": [
    {
      "objection": "specific objection",
      "type": "price|trust|timing|authority|need",
      "response_strategy": "recommended response"
    }
  ],
  "nextSteps": [
    {
      "action": "specific action",
      "timeline": "when to complete",
      "owner": "who is responsible"
    }
  ],
  "closeabilityScore": 85,
  "urgencyLevel": "high|medium|low",
  "keyInsights": [
    "most important insights"
  ],
  "recommendedApproach": [
    "strategic recommendations"
  ],
  "talkingPoints": [
    "key points to emphasize in next conversation"
  ]
}

Focus on actionable insights that will help close the deal. Be specific and quote relevant parts of the transcript as evidence.
`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert sales intelligence analyst specializing in B2B fractional CFO and accounting services. Provide detailed, actionable analysis."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    })

    const analysisText = completion.choices[0].message.content
    if (!analysisText) {
      throw new Error('No analysis generated')
    }

    // Parse the JSON response
    const analysis = JSON.parse(analysisText)
    
    // Validate required fields
    if (!analysis.closeabilityScore || !analysis.urgencyLevel) {
      throw new Error('Invalid analysis format')
    }

    return analysis

  } catch (error) {
    console.error('OpenAI analysis error:', error)
    
    // Return default analysis if AI fails
    return {
      painPoints: [{ 
        category: "financial", 
        description: "Need better financial reporting", 
        evidence: "Unable to parse transcript", 
        severity: "medium",
        impact: "Moderate impact on decision making"
      }],
      buyingSignals: [],
      decisionMakers: [],
      budgetIndicators: [],
      timelineIndicators: [],
      objections: [],
      nextSteps: [{ 
        action: "Follow up on transcript analysis", 
        timeline: "Within 24 hours", 
        owner: "Sales rep" 
      }],
      closeabilityScore: 50,
      urgencyLevel: "medium",
      keyInsights: ["Transcript analysis incomplete - manual review needed"],
      recommendedApproach: ["Follow up with prospect to clarify key points"],
      talkingPoints: ["Review call recording for key details"]
    }
  }
}

// GET endpoint to retrieve transcript analyses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 })
    }

    const { data: transcripts, error } = await supabase
      .from('call_transcripts')
      .select(`
        *,
        transcript_analyses (*)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({
      success: true,
      transcripts: transcripts || []
    })

  } catch (error) {
    console.error('Get transcripts error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch transcripts',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}