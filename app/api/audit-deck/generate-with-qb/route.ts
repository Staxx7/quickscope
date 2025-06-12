import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

interface AuditDeckRequest {
  prospectId: string
  companyId: string
  companyName: string
  callInsights?: any
  template?: 'comprehensive' | 'focused' | 'investor'
}

export async function POST(request: NextRequest) {
  try {
    const body: AuditDeckRequest = await request.json()
    const { prospectId, companyId, companyName, callInsights, template = 'comprehensive' } = body

    if (!prospectId || !companyId || !companyName) {
      return NextResponse.json({ 
        error: 'Missing required fields: prospectId, companyId, companyName' 
      }, { status: 400 })
    }

    // Step 1: Fetch real financial data
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const financialResponse = await fetch(`${baseUrl}/api/financial-snapshots?realm_id=${companyId}`, {
      headers: {
        'Authorization': request.headers.get('Authorization') || ''
      }
    })

    let financialData = null
    if (financialResponse.ok) {
      const snapshots = await financialResponse.json()
      if (snapshots && snapshots.length > 0) {
        financialData = snapshots[0]
      }
    }

    // Step 2: Get call transcript data if available
    let transcriptInsights = callInsights
    if (!transcriptInsights && prospectId) {
      const { data: transcripts } = await supabase
        .from('call_transcripts')
        .select('analysis_results')
        .eq('prospect_id', prospectId)
        .order('created_at', { ascending: false })
        .limit(1)

      if (transcripts && transcripts.length > 0 && transcripts[0].analysis_results) {
        transcriptInsights = transcripts[0].analysis_results
      }
    }

    // Step 3: Generate intelligent audit deck
    const auditDeck = await generateAuditDeckWithRealData({
      financialData,
      transcriptInsights,
      companyName,
      template
    })

    // Step 4: Store the generated audit deck
    const { data: savedDeck, error: saveError } = await supabase
      .from('audit_decks')
      .insert({
        prospect_id: prospectId,
        company_id: companyId,
        company_name: companyName,
        template,
        deck_data: auditDeck,
        data_source: financialData ? 'real_qb' : 'demo',
        generated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (saveError) {
      console.error('Error saving audit deck:', saveError)
      // Continue anyway, just log the error
    }

    return NextResponse.json({
      success: true,
      auditDeck,
      dataSource: financialData ? 'real' : 'demo',
      savedDeckId: savedDeck?.id
    })

  } catch (error) {
    console.error('Error generating audit deck:', error)
    return NextResponse.json({ 
      error: 'Failed to generate audit deck',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function generateAuditDeckWithRealData({ 
  financialData, 
  transcriptInsights, 
  companyName, 
  template 
}: {
  financialData: any
  transcriptInsights: any
  companyName: string
  template: string
}) {
  // Enhanced audit deck generation logic using real QB data
  const healthScore = financialData ? calculateHealthScore(financialData) : 75
  const netMargin = financialData ? (financialData.revenue > 0 ? financialData.net_income / financialData.revenue : 0) : 0.18
  const revenue = financialData ? financialData.revenue : 2500000

  const baseInsights = transcriptInsights || {
    painPoints: ['Manual financial processes', 'Limited real-time visibility', 'Scaling challenges'],
    businessGoals: ['Improve efficiency', 'Scale operations', 'Enhance reporting'],
    urgency: 'high',
    budget: '$8,000-12,000 monthly'
  }

  return {
    executiveSummary: {
      overallScore: healthScore,
      keyFindings: [
        `${financialData ? 'QuickBooks analysis reveals' : 'Financial projection shows'} revenue of $${(revenue / 1000000).toFixed(1)}M`,
        `Net profit margin of ${(netMargin * 100).toFixed(1)}% ${netMargin > 0.15 ? 'exceeds' : 'below'} industry benchmark`,
        `Financial health score of ${healthScore}/100 indicates ${healthScore > 75 ? 'strong' : 'moderate'} foundation`,
        `${baseInsights.painPoints.length} operational improvement areas identified`
      ],
      urgentIssues: [
        ...baseInsights.painPoints.slice(0, 2),
        'Financial infrastructure scaling requirements'
      ],
      opportunities: [
        'Process automation implementation',
        'Working capital optimization',
        'Strategic financial planning enhancement'
      ],
      contextualInsights: [
        `Analysis using ${financialData ? 'real QuickBooks data' : 'projected financials'}`,
        `Stakeholder priorities align with ${baseInsights.urgency} urgency`,
        `Budget allocation of ${baseInsights.budget} enables comprehensive solution`
      ],
      callToAction: 'Implement comprehensive financial optimization strategy to enhance operational efficiency and support growth objectives'
    },
    financialSnapshot: {
      healthScore,
      keyMetrics: [
        { 
          name: 'Revenue', 
          value: `$${(revenue / 1000000).toFixed(1)}M`, 
          trend: 'up', 
          benchmark: 'Industry Avg', 
          status: revenue > 1000000 ? 'excellent' : 'good' 
        },
        { 
          name: 'Net Margin', 
          value: `${(netMargin * 100).toFixed(1)}%`, 
          trend: netMargin > 0.15 ? 'up' : 'stable', 
          benchmark: '15.0%', 
          status: netMargin > 0.15 ? 'excellent' : 'adequate' 
        },
        { 
          name: 'Health Score', 
          value: `${healthScore}/100`, 
          trend: 'stable', 
          benchmark: '75', 
          status: healthScore > 75 ? 'good' : 'adequate' 
        }
      ],
      industryComparison: [
        { metric: 'Revenue Growth', company: 18.5, industry: 12.5, ranking: 'Above Average' },
        { metric: 'Net Margin', company: netMargin * 100, industry: 15.0, ranking: netMargin > 0.15 ? 'Above Average' : 'Below Average' },
        { metric: 'Operational Efficiency', company: 82, industry: 75, ranking: 'Above Average' }
      ],
      trendAnalysis: [
        `${financialData ? 'Current' : 'Projected'} performance indicates sustainable growth potential`,
        'Operational efficiency improvements identified through process analysis',
        'Working capital optimization opportunities present immediate value'
      ]
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      dataSource: financialData ? 'real_quickbooks' : 'demo',
      template,
      companyName,
      version: '2.0'
    }
  }
}

function calculateHealthScore(financialData: any): number {
  if (!financialData) return 75

  let score = 50

  // Revenue health (25%)
  if (financialData.revenue > 5000000) score += 20
  else if (financialData.revenue > 1000000) score += 15
  else if (financialData.revenue > 500000) score += 10
  else if (financialData.revenue > 100000) score += 5

  // Profitability (30%)
  const netMargin = financialData.revenue > 0 ? financialData.net_income / financialData.revenue : 0
  if (netMargin > 0.25) score += 20
  else if (netMargin > 0.15) score += 15
  else if (netMargin > 0.1) score += 10
  else if (netMargin > 0) score += 5

  // Asset efficiency (20%)
  const assetTurnover = financialData.assets > 0 ? financialData.revenue / financialData.assets : 1
  if (assetTurnover > 2.0) score += 15
  else if (assetTurnover > 1.5) score += 12
  else if (assetTurnover > 1.0) score += 8
  else if (assetTurnover > 0.5) score += 5

  // Financial stability (25%)
  const debtRatio = financialData.assets > 0 ? financialData.liabilities / financialData.assets : 0.3
  if (debtRatio < 0.2) score += 15
  else if (debtRatio < 0.4) score += 12
  else if (debtRatio < 0.6) score += 8
  else if (debtRatio < 0.8) score += 4

  return Math.min(Math.max(score, 20), 100)
}
