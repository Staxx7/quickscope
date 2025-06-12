// app/api/audit-deck/generate-with-qb/route.ts
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
    const financialResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/financial-snapshots?realm_id=${companyId}`, {
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
    painPointAnalysis: {
      identifiedPains: baseInsights.painPoints.map((pain: string, index: number) => ({
        painPoint: pain,
        financialEvidence: `Financial impact analysis shows ${(revenue * 0.02 / 1000).toFixed(0)}K annual cost`,
        impact: `Operational efficiency reduction of ${15 + index * 5}%`,
        solution: `Implement automated ${pain.includes('manual') ? 'reporting' : 'optimization'} solution`,
        priority: index < 2 ? 'high' : 'medium',
        estimatedValue: Math.floor(revenue * 0.01) + (index * 25000)
      })),
      rootCauseAnalysis: [
        `${financialData ? 'Data analysis reveals' : 'Assessment indicates'} operational scaling challenges`,
        'Manual processes limiting growth capacity',
        'Infrastructure gaps affecting financial visibility'
      ]
    },
    opportunityMatrix: {
      opportunities: [
        {
          opportunity: 'Financial Process Automation',
          financialBasis: `Revenue base of $${(revenue / 1000000).toFixed(1)}M supports automation ROI`,
          estimatedValue: Math.floor(revenue * 0.03),
          difficulty: 'medium',
          timeline: '3-6 months',
          alignsWithGoals: true,
          roi: 350
        },
        {
          opportunity: 'Working Capital Optimization',
          financialBasis: `Cash flow enhancement potential identified`,
          estimatedValue: Math.floor(revenue * 0.02),
          difficulty: 'low',
          timeline: '1-3 months',
          alignsWithGoals: true,
          roi: 280
        }
      ],
      priorityRanking: [
        'Immediate: Process automation (High impact, sustainable)',
        'Short-term: Working capital optimization (Quick wins)',
        'Long-term: Strategic planning enhancement (Growth enabler)'
      ]
    },
    riskProfile: {
      criticalRisks: [
        { risk: 'Operational scaling limitations', probability: 'High', impact: 'Medium', mitigation: 'Infrastructure enhancement program' },
        { risk: 'Manual process dependencies', probability: 'Medium', impact: 'High', mitigation: 'Automation implementation' }
      ],
      mitigationStrategies: [
        { strategy: 'Financial infrastructure modernization', timeline: '3-6 months', investment: '$25K', expectedOutcome: 'Automated operations' },
        { strategy: 'Process optimization program', timeline: '2-4 months', investment: '$15K', expectedOutcome: 'Enhanced efficiency' }
      ],
      contingencyPlanning: [
        'Phased implementation to minimize disruption',
        'Backup systems and processes during transition',
        'Training programs for team adaptation'
      ]
    },
    personalizedRecommendations: {
      immediate: [
        { action: 'Deploy financial dashboard', rationale: 'Enhance real-time visibility', expectedOutcome: 'Daily financial monitoring', timeline: '2 weeks' },
        { action: 'Optimize cash flow processes', rationale: 'Improve working capital efficiency', expectedOutcome: 'Enhanced liquidity management', timeline: '3 weeks' }
      ],
      shortTerm: [
        { action: 'Implement automated reporting', rationale: 'Eliminate manual processes', expectedOutcome: '40+ hours monthly savings', timeline: '2 months' },
        { action: 'Strategic planning system', rationale: 'Support growth objectives', expectedOutcome: 'Enhanced forecasting capability', timeline: '3 months' }
      ],
      longTerm: [
        { action: 'Comprehensive FP&A function', rationale: 'Scale financial operations', expectedOutcome: 'Strategic financial partnership', timeline: '6-12 months' },
        { action: 'Advanced analytics implementation', rationale: 'Data-driven decision making', expectedOutcome: 'Predictive financial insights', timeline: '9-12 months' }
      ],
      budgetAligned: [
        { service: 'Fractional CFO Services', investment: '$10,000/month', roi: '400% Year 1', priority: 'High' },
        { service: 'Financial Systems Setup', investment: '$15,000 one-time', roi: '350% Year 1', priority: 'High' },
        { service: 'Strategic Advisory', investment: '$6,000/month', roi: '280% Year 1', priority: 'Medium' }
      ]
    },
    proposedEngagement: {
      services: [
        {
          name: 'Fractional CFO Services',
          description: 'Strategic financial leadership and oversight',
          deliverables: ['Weekly financial monitoring', 'Monthly strategic reporting', 'Quarterly business reviews', 'Annual planning'],
          timeline: 'Ongoing monthly engagement'
        },
        {
          name: 'Financial Infrastructure Setup',
          description: 'Technology and process optimization',
          deliverables: ['Automated reporting system', 'Dashboard implementation', 'Process documentation', 'Team training'],
          timeline: '3-6 months implementation'
        }
      ],
      phasedApproach: [
        {
          phase: 'Foundation (Months 1-2)',
          duration: '60 days',
          objectives: ['Stabilize operations', 'Implement monitoring', 'Establish controls'],
          deliverables: ['Real-time dashboard', 'Automated processes', 'Financial controls', 'KPI framework']
        },
        {
          phase: 'Optimization (Months 3-4)',
          duration: '60 days',
          objectives: ['Enhance efficiency', 'Optimize processes', 'Improve margins'],
          deliverables: ['Process automation', 'Efficiency improvements', 'Cost optimization', 'Performance metrics']
        },
        {
          phase: 'Strategic Growth (Months 5-6)',
          duration: '60 days',
          objectives: ['Scale operations', 'Strategic planning', 'Growth enablement'],
          deliverables: ['Growth strategy', 'Strategic roadmap', 'Advanced analytics', 'Future planning']
        }
      ],
      investment: {
        monthly: '$10,000',
        setup: '$15,000',
        total: '$75,000 (6 months)'
      },
      expectedOutcomes: [
        `Enhanced financial performance using ${financialData ? 'real-time QuickBooks' : 'optimized financial'} data`,
        'Automated reporting reducing manual effort by 80%',
        'Improved cash flow management and working capital optimization',
        'Strategic planning capabilities supporting growth objectives',
        'Scalable financial infrastructure for future expansion'
      ],
      roi: {
        timeToValue: '30 days for initial improvements',
        yearOneROI: '400% return on investment',
        threeYearROI: '650% cumulative return'
      },
      successMetrics: [
        'Financial reporting cycle reduced to 3 days',
        'Automated processes saving 40+ hours monthly',
        'Cash flow forecasting accuracy >95%',
        'Stakeholder satisfaction >4.5/5',
        'Operational efficiency increase >40%'
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

// app/api/prospects/[id]/audit-deck/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const prospectId = params.id

    // Fetch saved audit decks for this prospect
    const { data: auditDecks, error } = await supabase
      .from('audit_decks')
      .select('*')
      .eq('prospect_id', prospectId)
      .order('generated_at', { ascending: false })

    if (error) {
      console.error('Error fetching audit decks:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ auditDecks })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prospectId = params.id
    const { searchParams } = new URL(request.url)
    const deckId = searchParams.get('deckId')

    if (!deckId) {
      return NextResponse.json({ error: 'deckId is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('audit_decks')
      .delete()
      .eq('id', deckId)
      .eq('prospect_id', prospectId)

    if (error) {
      console.error('Error deleting audit deck:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
