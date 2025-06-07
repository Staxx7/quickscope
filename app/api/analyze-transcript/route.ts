import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { transcript, companyId, companyName } = await request.json()

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript required' }, { status: 400 })
    }

    // Simple analysis logic (you can enhance with AI/ML services)
    const analysis = analyzeTranscriptContent(transcript, companyName)

    return NextResponse.json(analysis)

  } catch (error) {
    console.error('Error analyzing transcript:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}

function analyzeTranscriptContent(transcript: string, companyName: string) {
  const text = transcript.toLowerCase()

  // Extract key points based on keywords
  const keyPoints = []
  const painPoints = []
  const opportunities = []
  const financialContext = []
  const actionItems = []

  // Pain point indicators
  if (text.includes('cash flow') || text.includes('cash problem')) {
    painPoints.push('Cash flow challenges mentioned')
    actionItems.push('Prioritize cash flow management solutions')
  }
  
  if (text.includes('bookkeeping') || text.includes('accounting mess')) {
    painPoints.push('Bookkeeping/accounting issues identified')
    actionItems.push('Recommend bookkeeping cleanup and standardization')
  }

  if (text.includes('growth') || text.includes('scaling')) {
    opportunities.push('Company is in growth/scaling phase')
    actionItems.push('Present growth-focused financial strategies')
  }

  if (text.includes('profit') || text.includes('margin')) {
    financialContext.push('Profitability concerns discussed')
  }

  if (text.includes('tax') || text.includes('irs')) {
    painPoints.push('Tax-related concerns mentioned')
    actionItems.push('Offer tax optimization strategies')
  }

  // Sentiment analysis (basic)
  const positiveWords = ['good', 'great', 'excited', 'interested', 'yes', 'definitely']
  const negativeWords = ['bad', 'terrible', 'concerned', 'worried', 'no', 'problem']
  
  const positiveCount = positiveWords.filter(word => text.includes(word)).length
  const negativeCount = negativeWords.filter(word => text.includes(word)).length
  
  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral'
  if (positiveCount > negativeCount + 1) sentiment = 'positive'
  else if (negativeCount > positiveCount + 1) sentiment = 'negative'

  // Add generic insights
  keyPoints.push(`Discovery call completed for ${companyName}`)
  actionItems.push('Schedule follow-up audit call')
  actionItems.push('Prepare customized audit deck')

  return {
    keyPoints,
    painPoints,
    opportunities,
    financialContext,
    actionItems,
    sentiment
  }
}
