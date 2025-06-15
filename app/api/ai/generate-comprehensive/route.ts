import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabaseClient'

// Import external data services
async function fetchFREDData(indicators: string[]) {
  const apiKey = process.env.FRED_API_KEY
  if (!apiKey) return null
  
  try {
    const data: any = {}
    for (const indicator of indicators) {
      const response = await fetch(
        `https://api.stlouisfed.org/fred/series/observations?series_id=${indicator}&api_key=${apiKey}&file_type=json&limit=12`
      )
      if (response.ok) {
        const result = await response.json()
        data[indicator] = result.observations
      }
    }
    return data
  } catch (error) {
    console.error('FRED API error:', error)
    return null
  }
}

async function fetchMarketData(symbol: string = 'SPY') {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY
  if (!apiKey) return null
  
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
    )
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Market data error:', error)
  }
  return null
}

async function fetchBLSData() {
  const apiKey = process.env.BLS_API_KEY
  if (!apiKey) return null
  
  try {
    const response = await fetch('https://api.bls.gov/publicAPI/v2/timeseries/data/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'registrationkey': apiKey
      },
      body: JSON.stringify({
        seriesid: ['CES0000000001', 'CUUR0000SA0'], // Employment and CPI
        startyear: '2023',
        endyear: '2024'
      })
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('BLS API error:', error)
  }
  return null
}

export async function POST(request: NextRequest) {
  try {
    const { companyId, transcriptId, callInsights, includeTranscriptInsights } = await request.json()
    
    const supabase = getSupabaseServerClient()
    
    // Fetch company financial data
    const { data: financialData, error: financialError } = await supabase
      .from('financial_snapshots')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (financialError) {
      console.error('Error fetching financial data:', financialError)
    }
    
    // Fetch transcript data if provided
    let transcriptData = null
    if (transcriptId && includeTranscriptInsights) {
      const { data: transcript } = await supabase
        .from('call_transcripts')
        .select('*')
        .eq('id', transcriptId)
        .single()
      
      transcriptData = transcript
    }
    
    // Fetch external economic data in parallel
    const [fredData, marketData, blsData] = await Promise.all([
      fetchFREDData(['GDP', 'UNRATE', 'CPIAUCSL', 'DFF']),
      fetchMarketData(),
      fetchBLSData()
    ])
    
    // Calculate enhanced financial metrics
    const revenue = financialData?.revenue || 0
    const netIncome = financialData?.net_income || 0
    const expenses = financialData?.expenses || 0
    const assets = financialData?.assets || 0
    const liabilities = financialData?.liabilities || 0
    
    const profitMargin = revenue > 0 ? (netIncome / revenue) * 100 : 0
    const currentRatio = liabilities > 0 ? assets / liabilities : 0
    const debtToAsset = assets > 0 ? (liabilities / assets) * 100 : 0
    const healthScore = calculateHealthScore(financialData)
    
    // Integrate transcript insights
    const transcriptInsights = callInsights ? {
      painPoints: callInsights.painPoints || [],
      businessGoals: callInsights.businessGoals || [],
      budgetIndications: callInsights.budgetIndications || [],
      urgency: callInsights.urgency || 'medium',
      decisionMakers: callInsights.decisionMakers || [],
      salesScore: callInsights.salesScore || 0
    } : null
    
    // Generate AI-powered insights combining all data sources
    const comprehensiveAnalysis = {
      company: {
        id: companyId,
        healthScore,
        dataQuality: financialData ? 'excellent' : 'limited'
      },
      
      financialMetrics: {
        revenue,
        netIncome,
        expenses,
        assets,
        liabilities,
        profitMargin,
        currentRatio,
        debtToAsset,
        grossMargin: revenue > 0 ? ((revenue - (expenses * 0.6)) / revenue) * 100 : 0,
        operatingMargin: revenue > 0 ? ((revenue - expenses) / revenue) * 100 : 0,
        returnOnAssets: assets > 0 ? (netIncome / assets) * 100 : 0,
        workingCapital: assets - liabilities,
        quickRatio: currentRatio * 0.9, // Approximation
        cashFlowEstimate: netIncome * 0.85 // Rough estimate
      },
      
      marketContext: {
        economicIndicators: {
          gdpGrowth: fredData?.GDP ? parseFloat(fredData.GDP[0]?.value) : null,
          unemploymentRate: fredData?.UNRATE ? parseFloat(fredData.UNRATE[0]?.value) : null,
          inflationRate: fredData?.CPIAUCSL ? parseFloat(fredData.CPIAUCSL[0]?.value) : null,
          interestRate: fredData?.DFF ? parseFloat(fredData.DFF[0]?.value) : null
        },
        marketPerformance: marketData?.['Global Quote'] || null,
        employmentTrends: blsData?.Results?.series || null
      },
      
      transcriptInsights: transcriptInsights,
      
      aiGeneratedInsights: generateAIInsights({
        financialData: financialData || {},
        marketContext: { fredData, marketData, blsData },
        transcriptInsights,
        healthScore
      }),
      
      recommendations: generateRecommendations({
        healthScore,
        profitMargin,
        currentRatio,
        transcriptInsights,
        revenue
      }),
      
      risks: identifyRisks({
        debtToAsset,
        currentRatio,
        profitMargin,
        transcriptInsights
      }),
      
      opportunities: identifyOpportunities({
        revenue,
        profitMargin,
        transcriptInsights,
        marketData
      }),
      
      timestamp: new Date().toISOString(),
      dataSource: {
        financial: financialData ? 'quickbooks' : 'estimated',
        market: 'live',
        economic: 'federal_reserve',
        transcript: transcriptId ? 'included' : 'none'
      }
    }
    
    // Store the analysis
    const { data: analysisRecord, error: storeError } = await supabase
      .from('financial_analyses')
      .insert({
        company_id: companyId,
        analysis_type: 'comprehensive',
        analysis_data: comprehensiveAnalysis,
        transcript_id: transcriptId,
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (storeError) {
      console.error('Error storing analysis:', storeError)
    }
    
    return NextResponse.json({
      success: true,
      analysis: comprehensiveAnalysis,
      analysisId: analysisRecord?.id
    })
    
  } catch (error) {
    console.error('Comprehensive analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to generate comprehensive analysis' },
      { status: 500 }
    )
  }
}

function calculateHealthScore(financialData: any): number {
  let score = 50
  
  const revenue = financialData?.revenue || 0
  const netIncome = financialData?.net_income || 0
  const assets = financialData?.assets || 0
  const liabilities = financialData?.liabilities || 0
  
  // Revenue health (0-20 points)
  if (revenue > 5000000) score += 20
  else if (revenue > 1000000) score += 15
  else if (revenue > 500000) score += 10
  else if (revenue > 0) score += 5
  
  // Profitability (0-25 points)
  if (revenue > 0) {
    const profitMargin = netIncome / revenue
    if (profitMargin > 0.20) score += 25
    else if (profitMargin > 0.15) score += 20
    else if (profitMargin > 0.10) score += 15
    else if (profitMargin > 0.05) score += 10
    else if (profitMargin > 0) score += 5
  }
  
  // Liquidity (0-15 points)
  if (assets > 0 && liabilities > 0) {
    const currentRatio = assets / liabilities
    if (currentRatio > 2.5) score += 15
    else if (currentRatio > 2.0) score += 12
    else if (currentRatio > 1.5) score += 8
    else if (currentRatio > 1.0) score += 5
  }
  
  return Math.min(Math.max(score, 0), 100)
}

function generateAIInsights(data: any) {
  const insights = []
  
  // Financial health insights
  if (data.healthScore > 80) {
    insights.push({
      type: 'opportunity',
      title: 'Strong Financial Position for Growth',
      description: 'Excellent financial health enables aggressive growth strategies',
      confidence: 92,
      impact: 'high'
    })
  } else if (data.healthScore < 60) {
    insights.push({
      type: 'warning',
      title: 'Financial Health Requires Attention',
      description: 'Current metrics indicate need for financial optimization',
      confidence: 88,
      impact: 'high'
    })
  }
  
  // Transcript-based insights
  if (data.transcriptInsights?.urgency === 'high') {
    insights.push({
      type: 'recommendation',
      title: 'High Urgency Opportunity Detected',
      description: 'Call analysis indicates immediate action required to capture opportunity',
      confidence: 95,
      impact: 'transformational'
    })
  }
  
  // Market context insights
  if (data.marketContext?.economicIndicators?.interestRate > 5) {
    insights.push({
      type: 'concern',
      title: 'High Interest Rate Environment',
      description: 'Current rates may impact financing costs and growth investments',
      confidence: 90,
      impact: 'medium'
    })
  }
  
  return insights
}

function generateRecommendations(data: any) {
  const recommendations = {
    immediate: [] as Array<{
      action: string
      rationale: string
      expectedOutcome: string
      timeline?: string
    }>,
    shortTerm: [] as Array<{
      action: string
      rationale: string
      expectedOutcome: string
      timeline?: string
    }>,
    longTerm: [] as Array<{
      action: string
      rationale: string
      expectedOutcome: string
      timeline?: string
    }>
  }
  
  // Immediate actions based on transcript insights
  if (data.transcriptInsights?.urgency === 'high') {
    recommendations.immediate.push({
      action: 'Schedule follow-up meeting within 48 hours',
      rationale: 'High urgency detected in call analysis',
      expectedOutcome: 'Accelerated decision-making process'
    })
  }
  
  // Financial health recommendations
  if (data.profitMargin < 10) {
    recommendations.shortTerm.push({
      action: 'Implement margin improvement program',
      rationale: `Current margin of ${data.profitMargin.toFixed(1)}% below industry standard`,
      expectedOutcome: '5-7% margin improvement within 6 months'
    })
  }
  
  if (data.currentRatio < 1.5) {
    recommendations.immediate.push({
      action: 'Optimize working capital management',
      rationale: 'Current ratio indicates potential liquidity constraints',
      expectedOutcome: 'Improved cash flow and operational flexibility'
    })
  }
  
  return recommendations
}

function identifyRisks(data: any) {
  const risks = []
  
  if (data.debtToAsset > 60) {
    risks.push({
      category: 'Financial',
      risk: 'High Leverage Risk',
      severity: 'high',
      mitigation: 'Develop debt reduction strategy'
    })
  }
  
  if (data.transcriptInsights?.painPoints?.length > 3) {
    risks.push({
      category: 'Operational',
      risk: 'Multiple Pain Points Identified',
      severity: 'medium',
      mitigation: 'Prioritize solutions for top 3 pain points'
    })
  }
  
  return risks
}

function identifyOpportunities(data: any) {
  const opportunities = []
  
  if (data.revenue > 1000000 && data.profitMargin > 15) {
    opportunities.push({
      opportunity: 'Scale Operations',
      difficulty: 'medium',
      potentialValue: `$${Math.floor(data.revenue * 0.3 / 1000)}K additional revenue`,
      timeline: '6-12 months'
    })
  }
  
  if (data.transcriptInsights?.businessGoals?.includes('growth')) {
    opportunities.push({
      opportunity: 'Strategic Growth Partnership',
      difficulty: 'low',
      potentialValue: 'Accelerated goal achievement',
      timeline: '3-6 months'
    })
  }
  
  return opportunities
}