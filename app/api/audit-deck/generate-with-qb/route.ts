// app/api/audit-deck/generate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyId, companyName, includeTranscripts = true, includeFinancials = true } = body

    if (!companyId || !companyName) {
      return NextResponse.json({ error: 'Company ID and name are required' }, { status: 400 })
    }

    // Step 1: Gather all available data
    const [financialData, transcriptData] = await Promise.all([
      includeFinancials ? getFinancialData(companyId) : null,
      includeTranscripts ? getTranscriptData(companyId) : null
    ])

    // Step 2: Generate intelligent audit deck
    const auditDeck = await generateIntelligentAuditDeck({
      companyId,
      companyName,
      financialData,
      transcriptData
    })

    // Step 3: Store the generated deck
    const { data: deckRecord, error: deckError } = await supabase
      .from('audit_decks')
      .insert({
        company_id: companyId,
        company_name: companyName,
        deck_data: auditDeck,
        generation_date: new Date().toISOString(),
        data_sources: {
          financial: !!financialData,
          transcript: !!transcriptData
        }
      })
      .select()
      .single()

    if (deckError) {
      throw new Error(`Failed to store audit deck: ${deckError.message}`)
    }

    return NextResponse.json({
      success: true,
      auditDeck,
      deckId: deckRecord.id,
      summary: {
        totalSlides: auditDeck.slides.length,
        healthScore: auditDeck.executiveSummary.healthScore,
        keyRecommendations: auditDeck.recommendations.immediate.length,
        dataSourcesUsed: auditDeck.metadata.dataSources
      }
    })

  } catch (error) {
    console.error('Audit deck generation error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate audit deck',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function getFinancialData(companyId: string) {
  try {
    // Get enhanced financial data
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/qbo/enhanced-financials?companyId=${companyId}`)
    if (!response.ok) return null
    
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching financial data:', error)
    return null
  }
}

async function getTranscriptData(companyId: string) {
  try {
    const { data: transcripts, error } = await supabase
      .from('call_transcripts')
      .select(`
        *,
        transcript_analyses (*)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(3) // Get last 3 calls

    if (error) throw error
    return transcripts || []
  } catch (error) {
    console.error('Error fetching transcript data:', error)
    return []
  }
}

async function generateIntelligentAuditDeck(params: {
  companyId: string
  companyName: string
  financialData: any
  transcriptData: any[] | null
}) {
  const { companyId, companyName, financialData, transcriptData: rawTranscriptData } = params
  const transcriptData = rawTranscriptData || []

  // Prepare AI prompt with all available data
  const prompt = `
You are a senior fractional CFO creating a comprehensive audit deck for ${companyName}. 

FINANCIAL DATA:
${financialData ? JSON.stringify(financialData, null, 2) : 'Not available'}

CALL TRANSCRIPT ANALYSIS:
${transcriptData.length > 0 ? JSON.stringify(transcriptData.map(t => t.transcript_analyses?.[0] || {}), null, 2) : 'Not available'}

Create a compelling, professional audit deck that will help close this prospect. Structure it as follows:

{
  "executiveSummary": {
    "healthScore": 85,
    "overallAssessment": "comprehensive assessment",
    "keyFindings": ["finding 1", "finding 2", "finding 3"],
    "urgencyFactors": ["urgent issue 1", "urgent issue 2"],
    "opportunityValue": 150000
  },
  "currentState": {
    "strengths": [
      {
        "area": "strength area",
        "description": "detailed description",
        "evidence": "supporting evidence"
      }
    ],
    "challenges": [
      {
        "area": "challenge area", 
        "description": "detailed description",
        "impact": "business impact",
        "severity": "high|medium|low"
      }
    ],
    "riskFactors": [
      {
        "risk": "specific risk",
        "probability": "high|medium|low",
        "impact": "potential impact",
        "mitigation": "recommended mitigation"
      }
    ]
  },
  "financialAnalysis": {
    "keyMetrics": [
      {
        "metric": "metric name",
        "current": "current value",
        "benchmark": "industry benchmark",
        "variance": "variance from benchmark",
        "trend": "improving|declining|stable"
      }
    ],
    "profitabilityAnalysis": {
      "grossMargin": {
        "current": 35.5,
        "benchmark": 42.0,
        "recommendation": "specific recommendation"
      },
      "netMargin": {
        "current": 12.3,
        "benchmark": 15.0,
        "recommendation": "specific recommendation"
      }
    },
    "liquidityAnalysis": {
      "currentRatio": {
        "current": 1.2,
        "benchmark": 2.0,
        "recommendation": "specific recommendation"
      },
      "cashFlow": {
        "current": "cash flow status",
        "forecast": "3-month forecast",
        "recommendation": "specific recommendation"
      }
    }
  },
  "painPointAnalysis": {
    "identifiedPains": [
      {
        "painPoint": "specific pain point",
        "source": "financial data|transcript|both",
        "evidence": "supporting evidence",
        "impact": "business impact",
        "cost": "estimated cost of inaction",
        "priority": "high|medium|low"
      }
    ],
    "rootCauseAnalysis": ["root cause 1", "root cause 2"],
    "interconnections": ["how pain points relate"]
  },
  "opportunities": {
    "immediate": [
      {
        "opportunity": "specific opportunity",
        "value": 25000,
        "timeline": "1-3 months",
        "effort": "low|medium|high",
        "roi": "return on investment"
      }
    ],
    "shortTerm": [
      {
        "opportunity": "specific opportunity",
        "value": 50000,
        "timeline": "3-6 months",
        "effort": "low|medium|high",
        "roi": "return on investment"
      }
    ],
    "longTerm": [
      {
        "opportunity": "specific opportunity",
        "value": 100000,
        "timeline": "6-12 months",
        "effort": "low|medium|high",
        "roi": "return on investment"
      }
    ]
  },
  "recommendations": {
    "immediate": [
      {
        "action": "specific action",
        "rationale": "why this is important",
        "timeline": "when to implement",
        "investment": "required investment",
        "expectedOutcome": "expected result"
      }
    ],
    "phase1": [
      {
        "action": "specific action",
        "rationale": "why this is important", 
        "timeline": "when to implement",
        "investment": "required investment",
        "expectedOutcome": "expected result"
      }
    ],
    "phase2": [
      {
        "action": "specific action",
        "rationale": "why this is important",
        "timeline": "when to implement", 
        "investment": "required investment",
        "expectedOutcome": "expected result"
      }
    ]
  },
  "proposedEngagement": {
    "servicePackages": [
      {
        "name": "Immediate Stabilization",
        "duration": "1-3 months",
        "deliverables": ["deliverable 1", "deliverable 2"],
        "investment": "$X,XXX/month",
        "roi": "projected ROI"
      },
      {
        "name": "Strategic Growth",
        "duration": "3-6 months", 
        "deliverables": ["deliverable 1", "deliverable 2"],
        "investment": "$X,XXX/month",
        "roi": "projected ROI"
      }
    ],
    "implementation": [
      {
        "phase": "Phase 1",
        "duration": "30 days",
        "objectives": ["objective 1", "objective 2"],
        "deliverables": ["deliverable 1", "deliverable 2"]
      }
    ],
    "investment": {
      "setup": "$X,XXX",
      "monthly": "$X,XXX",
      "totalFirstYear": "$XX,XXX"
    },
    "roi": {
      "yearOne": "X%",
      "yearTwo": "X%",
      "breakEven": "X months"
    }
  },
  "nextSteps": [
    {
      "action": "specific next step",
      "owner": "who is responsible",
      "timeline": "when to complete",
      "outcome": "expected outcome"
    }
  ],
  "metadata": {
    "generatedAt": "${new Date().toISOString()}",
    "dataSources": {
      "financial": ${!!financialData},
      "transcript": ${transcriptData?.length > 0},
      "callAnalysis": ${transcriptData?.some(t => t.transcript_analyses?.length > 0)}
    },
    "version": "1.0"
  }
}

Make this specific to ${companyName} using the available data. Be professional, data-driven, and compelling. Focus on ROI and business impact.
`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a senior fractional CFO and business consultant with 20+ years of experience. Create compelling, data-driven audit presentations that close deals."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    })

    const deckContent = completion.choices[0].message.content
    if (!deckContent) {
      throw new Error('No deck content generated')
    }

    const auditDeck = JSON.parse(deckContent)
    
    // Add slides structure for presentation
    auditDeck.slides = generateSlides(auditDeck)
    
    return auditDeck

  } catch (error) {
    console.error('AI deck generation error:', error)
    
    // Return fallback deck if AI fails
    return generateFallbackDeck(companyName, financialData, transcriptData)
  }
}

function generateSlides(deckData: any) {
  return [
    {
      id: 'executive-summary',
      title: 'Executive Summary',
      type: 'summary',
      content: deckData.executiveSummary
    },
    {
      id: 'current-state',
      title: 'Current State Analysis',
      type: 'analysis',
      content: deckData.currentState
    },
    {
      id: 'financial-analysis',
      title: 'Financial Health Assessment',
      type: 'metrics',
      content: deckData.financialAnalysis
    },
    {
      id: 'pain-points',
      title: 'Pain Point Analysis',
      type: 'problems',
      content: deckData.painPointAnalysis
    },
    {
      id: 'opportunities',
      title: 'Growth Opportunities',
      type: 'opportunities',
      content: deckData.opportunities
    },
    {
      id: 'recommendations',
      title: 'Strategic Recommendations',
      type: 'recommendations',
      content: deckData.recommendations
    },
    {
      id: 'engagement',
      title: 'Proposed Engagement',
      type: 'proposal',
      content: deckData.proposedEngagement
    },
    {
      id: 'next-steps',
      title: 'Next Steps',
      type: 'action',
      content: deckData.nextSteps
    }
  ]
}

function generateFallbackDeck(companyName: string, financialData: any, transcriptData: any[]) {
  return {
    executiveSummary: {
      healthScore: 75,
      overallAssessment: `${companyName} shows potential for significant improvement in financial management and operational efficiency.`,
      keyFindings: [
        "Opportunities for cost optimization",
        "Need for enhanced financial reporting",
        "Potential for improved cash flow management"
      ],
      urgencyFactors: ["Manual processes creating inefficiencies"],
      opportunityValue: 100000
    },
    slides: [
      {
        id: 'executive-summary',
        title: 'Executive Summary',
        type: 'summary',
        content: {
          message: `We've identified significant opportunities to improve ${companyName}'s financial operations.`
        }
      }
    ],
    metadata: {
      generatedAt: new Date().toISOString(),
      dataSources: {
        financial: !!financialData,
        transcript: transcriptData?.length > 0,
        callAnalysis: false
      },
      version: "1.0-fallback"
    }
  }
}

// GET endpoint to retrieve existing audit decks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 })
    }

    const { data: decks, error } = await supabase
      .from('audit_decks')
      .select('*')
      .eq('company_id', companyId)
      .order('generation_date', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({
      success: true,
      decks: decks || []
    })

  } catch (error) {
    console.error('Get audit decks error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch audit decks',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}