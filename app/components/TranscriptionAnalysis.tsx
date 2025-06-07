// app/api/transcripts/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prospectId, companyId, transcript } = body

    if (!prospectId || !transcript) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Analyze transcript for key financial insights
    const analysis = await analyzeTranscript(transcript)

    // Store in database
    const { data, error } = await supabase
      .from('transcript_analysis')
      .upsert({
        prospect_id: prospectId,
        company_id: companyId,
        transcript,
        analysis
      }, {
        onConflict: 'prospect_id'
      })

    if (error) {
      throw error
    }

    // Update prospect with analysis items
    await supabase
      .from('prospects')
      .update({
        transcript_data: { transcript, uploadedAt: new Date().toISOString() },
        analysis_items: analysis.keyItems
      })
      .eq('id', prospectId)

    return NextResponse.json({
      success: true,
      analysis
    })

  } catch (error) {
    console.error('Transcript analysis error:', error)
    return NextResponse.json({ error: 'Failed to analyze transcript' }, { status: 500 })
  }
}

async function analyzeTranscript(transcript: string) {
  // Extract key financial mentions
  const financialMentions = extractFinancialMentions(transcript)
  const painPoints = extractPainPoints(transcript)
  const goals = extractGoals(transcript)
  const challenges = extractChallenges(transcript)

  return {
    keyItems: {
      financialMentions,
      painPoints,
      goals,
      challenges
    },
    sentiment: analyzeSentiment(transcript),
    urgency: detectUrgency(transcript),
    recommendedActions: generateRecommendations(financialMentions, painPoints, goals)
  }
}

function extractFinancialMentions(transcript: string) {
  const mentions = []
  const patterns = [
    /revenue[s]?\s+(?:of\s+)?(\$?[\d,]+[kKmM]?)/gi,
    /expense[s]?\s+(?:of\s+)?(\$?[\d,]+[kKmM]?)/gi,
    /profit[s]?\s+(?:of\s+)?(\$?[\d,]+[kKmM]?)/gi,
    /cash\s+flow[s]?\s+(?:of\s+)?(\$?[\d,]+[kKmM]?)/gi,
    /margin[s]?\s+(?:of\s+)?(\d+%)/gi,
    /growth\s+(?:of\s+)?(\d+%)/gi
  ]

  patterns.forEach(pattern => {
    let match
    while ((match = pattern.exec(transcript)) !== null) {
      mentions.push({
        type: pattern.source.split(/\[|\\/)[0],
        value: match[1],
        context: transcript.substring(match.index - 50, match.index + 50)
      })
    }
  })

  return mentions
}

function extractPainPoints(transcript: string) {
  const painKeywords = [
    'struggle', 'difficult', 'challenge', 'problem', 'issue',
    'concern', 'worried', 'frustrat', 'confus', 'overwhelm',
    'behind', 'late', 'delay', 'miss', 'lack'
  ]

  const painPoints = []
  const sentences = transcript.split(/[.!?]+/)

  sentences.forEach(sentence => {
    const lower = sentence.toLowerCase()
    if (painKeywords.some(keyword => lower.includes(keyword))) {
      painPoints.push({
        text: sentence.trim(),
        category: categorizePainPoint(sentence)
      })
    }
  })

  return painPoints
}

function extractGoals(transcript: string) {
  const goalKeywords = [
    'want to', 'need to', 'plan to', 'goal', 'objective',
    'target', 'improve', 'increase', 'grow', 'expand',
    'optimize', 'streamline', 'automate'
  ]

  const goals = []
  const sentences = transcript.split(/[.!?]+/)

  sentences.forEach(sentence => {
    const lower = sentence.toLowerCase()
    if (goalKeywords.some(keyword => lower.includes(keyword))) {
      goals.push({
        text: sentence.trim(),
        priority: detectPriority(sentence)
      })
    }
  })

  return goals
}

function extractChallenges(transcript: string) {
  // Similar pattern matching for challenges
  return []
}

function analyzeSentiment(transcript: string) {
  // Basic sentiment analysis
  const positive = (transcript.match(/good|great|excellent|improve|better|growth/gi) || []).length
  const negative = (transcript.match(/bad|poor|worse|decline|struggle|difficult/gi) || []).length
  
  return {
    score: (positive - negative) / (positive + negative + 1),
    label: positive > negative ? 'positive' : negative > positive ? 'negative' : 'neutral'
  }
}

function detectUrgency(transcript: string) {
  const urgentKeywords = [
    'asap', 'urgent', 'immediately', 'right away', 'quickly',
    'as soon as possible', 'critical', 'emergency'
  ]
  
  const urgencyScore = urgentKeywords.reduce((score, keyword) => {
    return score + (transcript.toLowerCase().includes(keyword) ? 1 : 0)
  }, 0)

  return urgencyScore > 2 ? 'high' : urgencyScore > 0 ? 'medium' : 'low'
}

function generateRecommendations(financialMentions: any[], painPoints: any[], goals: any[]) {
  const recommendations = []

  // Analyze patterns and generate recommendations
  if (painPoints.some(p => p.category === 'cash flow')) {
    recommendations.push({
      type: 'cash_flow_optimization',
      title: 'Cash Flow Management',
      description: 'Implement better AR/AP management and cash flow forecasting'
    })
  }

  if (goals.some(g => g.text.toLowerCase().includes('growth'))) {
    recommendations.push({
      type: 'growth_strategy',
      title: 'Growth Planning',
      description: 'Develop financial models for sustainable growth'
    })
  }

  return recommendations
}

function categorizePainPoint(text: string) {
  const lower = text.toLowerCase()
  if (lower.includes('cash') || lower.includes('payment')) return 'cash flow'
  if (lower.includes('expense') || lower.includes('cost')) return 'expense management'
  if (lower.includes('revenue') || lower.includes('sales')) return 'revenue'
  if (lower.includes('report') || lower.includes('data')) return 'reporting'
  return 'general'
}

function detectPriority(text: string) {
  const high = ['urgent', 'critical', 'immediate', 'asap']
  const medium = ['important', 'need', 'should']
  
  const lower = text.toLowerCase()
  if (high.some(word => lower.includes(word))) return 'high'
  if (medium.some(word => lower.includes(word))) return 'medium'
  return 'low'
}
