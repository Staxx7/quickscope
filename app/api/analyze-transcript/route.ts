import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { supabase } from '@/lib/supabaseClient'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { transcript, companyId, companyName } = await request.json()

    if (!transcript || !companyId) {
      return NextResponse.json(
        { error: 'Transcript and company ID are required' },
        { status: 400 }
      )
    }

    // Analyze transcript with OpenAI
    const analysisPrompt = `Analyze this business discovery call transcript and extract key insights:

TRANSCRIPT:
${transcript}

Extract and return as JSON:
{
  "painPoints": {
    "operational": ["list of operational pain points"],
    "financial": ["list of financial challenges"],
    "strategic": ["list of strategic issues"],
    "technology": ["list of technology problems"]
  },
  "businessObjectives": {
    "shortTerm": ["immediate goals"],
    "longTerm": ["future objectives"],
    "growthTargets": ["growth goals"],
    "efficiency": ["efficiency improvements"]
  },
  "decisionMakers": [
    {
      "name": "person name",
      "role": "their role",
      "influence": "high/medium/low",
      "concerns": ["their concerns"],
      "priorities": ["their priorities"]
    }
  ],
  "urgencySignals": {
    "timeline": "mentioned timeline",
    "pressurePoints": ["urgent issues"],
    "catalysts": ["reasons for urgency"],
    "budget": "budget information"
  },
  "salesIntelligence": {
    "buyingSignals": ["positive indicators"],
    "objections": ["concerns or objections"],
    "nextSteps": ["recommended actions"],
    "closeability": 85,
    "recommendedStrategy": "approach recommendation"
  }
}

Focus on extracting actionable business intelligence for a fractional CFO service provider.`

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a business analyst specializing in B2B sales for fractional CFO services. Extract actionable insights from discovery calls."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    })

    const analysis = JSON.parse(response.choices[0].message.content || '{}')

    // Store analysis in database
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('transcript_analyses')
      .insert({
        prospect_id: companyId,
        company_name: companyName || 'Unknown',
        transcript_text: transcript,
        analysis_data: analysis,
        closeability_score: analysis.salesIntelligence?.closeability || 50,
        urgency_level: analysis.urgencySignals?.timeline?.includes('urgent') ? 'high' : 'medium',
        pain_points_count: Object.values(analysis.painPoints || {}).flat().length,
        buying_signals_count: (analysis.salesIntelligence?.buyingSignals || []).length,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (saveError) {
      console.error('Failed to save transcript analysis:', saveError)
    }

    return NextResponse.json({
      success: true,
      analysis,
      analysisId: savedAnalysis?.id || null,
      companyId,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Transcript analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze transcript' },
      { status: 500 }
    )
  }
}
