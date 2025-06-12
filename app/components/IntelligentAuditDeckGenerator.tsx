'use client'
import React, { useState, useEffect } from 'react'
import { Download, FileText, TrendingUp, TrendingDown, AlertTriangle, Target, CheckCircle, BarChart3, PieChart, DollarSign, Activity, Users, Calendar, ArrowUp, ArrowDown, Minus, Brain, Zap, Eye, Presentation, Star, Clock, Shield } from 'lucide-react'
import { useToast } from './Toast'

interface CallInsights {
  painPoints: string[]
  businessGoals: string[]
  currentChallenges: string[]
  decisionMakers: Array<{
    name: string
    role: string
    influence: 'high' | 'medium' | 'low'
  }>
  timeline: string
  budget: string
  industryContext: string
  competitiveThreats: string[]
  currentSolutions: string[]
  keyQuotes: string[]
  nextSteps: string[]
  urgency: 'high' | 'medium' | 'low'
  sentiment: 'positive' | 'neutral' | 'negative'
  salesScore: number
}

interface QBODataSet {
  companyInfo: {
    name: string
    industry: string
    revenue: number
    employees: number
    establishedYear: number
  }
  financialMetrics: {
    revenue: { current: number; growth: number; trend: string }
    profitability: { grossMargin: number; netMargin: number; ebitda: number }
    liquidity: { currentRatio: number; quickRatio: number; cashOnHand: number }
    efficiency: { assetTurnover: number; receivablesDays: number; inventoryTurnover: number }
    leverage: { debtToEquity: number; interestCoverage: number; debtServiceCoverage: number }
  }
  healthScore: number
  riskFactors: string[]
  opportunities: string[]
  benchmarks: Record<string, { company: number; industry: number; percentile: number }>
}

interface IntelligentAuditDeck {
  executiveSummary: {
    overallScore: number
    keyFindings: string[]
    urgentIssues: string[]
    opportunities: string[]
    contextualInsights: string[]
    callToAction: string
  }
  financialSnapshot: {
    healthScore: number
    keyMetrics: Array<{ name: string; value: string; trend: string; benchmark: string; status: string }>
    industryComparison: Array<{ metric: string; company: number; industry: number; ranking: string }>
    trendAnalysis: string[]
  }
  painPointAnalysis: {
    identifiedPains: Array<{
      painPoint: string
      financialEvidence: string
      impact: string
      solution: string
      priority: 'high' | 'medium' | 'low'
      estimatedValue: number
    }>
    rootCauseAnalysis: string[]
  }
  opportunityMatrix: {
    opportunities: Array<{
      opportunity: string
      financialBasis: string
      estimatedValue: number
      difficulty: 'low' | 'medium' | 'high'
      timeline: string
      alignsWithGoals: boolean
      roi: number
    }>
    priorityRanking: string[]
  }
  riskProfile: {
    criticalRisks: Array<{ risk: string; probability: string; impact: string; mitigation: string }>
    mitigationStrategies: Array<{ strategy: string; timeline: string; investment: string; expectedOutcome: string }>
    contingencyPlanning: string[]
  }
  personalizedRecommendations: {
    immediate: Array<{ action: string; rationale: string; expectedOutcome: string; timeline: string }>
    shortTerm: Array<{ action: string; rationale: string; expectedOutcome: string; timeline: string }>
    longTerm: Array<{ action: string; rationale: string; expectedOutcome: string; timeline: string }>
    budgetAligned: Array<{ service: string; investment: string; roi: string; priority: string }>
  }
  proposedEngagement: {
    services: Array<{ name: string; description: string; deliverables: string[]; timeline: string }>
    phasedApproach: Array<{ phase: string; duration: string; objectives: string[]; deliverables: string[] }>
    investment: { monthly: string; setup: string; total: string }
    expectedOutcomes: string[]
    roi: { timeToValue: string; yearOneROI: string; threeYearROI: string }
    successMetrics: string[]
  }
}

interface GenerationStage {
  stage: string
  progress: number
  message: string
  insights?: string[]
}

interface IntelligentAuditDeckGeneratorProps {
  prospectId: string
  companyName: string
  callInsights?: CallInsights
  qboData?: QBODataSet
  onDeckGenerated?: (deck: IntelligentAuditDeck) => void
}

const IntelligentAuditDeckGenerator: React.FC<IntelligentAuditDeckGeneratorProps> = ({
  prospectId,
  companyName,
  callInsights,
  qboData,
  onDeckGenerated
}) => {
  const [auditDeck, setAuditDeck] = useState<IntelligentAuditDeck | null>(null)
  const [generating, setGenerating] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [generationStage, setGenerationStage] = useState<GenerationStage | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState('comprehensive')
  const { showToast, ToastContainer } = useToast()

  // Mock data for demonstration
  const mockCallInsights: CallInsights = {
    painPoints: [
      'Manual financial reporting taking 40+ hours monthly',
      'Lack of real-time cash flow visibility affecting decisions',
      'Month-end close process takes 15+ days',
      'Limited financial forecasting capabilities',
      'Difficulty scaling financial operations with growth'
    ],
    businessGoals: [
      'Scale to $10M ARR within 18 months',
      'Improve operational efficiency by 30%',
      'Expand into 3 new geographic markets',
      'Automate 80% of manual financial processes',
      'Prepare for Series B funding round'
    ],
    currentChallenges: [
      'Outgrowing current accounting software',
      'Need for strategic financial planning',
      'Investor reporting requirements increasing',
      'Team capacity constraints limiting growth'
    ],
    decisionMakers: [
      { name: 'Sarah Johnson', role: 'CEO', influence: 'high' },
      { name: 'Michael Chen', role: 'COO', influence: 'high' },
      { name: 'Lisa Rodriguez', role: 'Head of Finance', influence: 'medium' }
    ],
    timeline: '90 days for implementation',
    budget: '$8,000-12,000 monthly for fractional CFO services',
    industryContext: 'B2B SaaS - High growth phase',
    competitiveThreats: [
      'Evaluating 2 other fractional CFO providers',
      'Considering full-time CFO hire',
      'Current CPA firm pushing for expanded services'
    ],
    currentSolutions: ['QuickBooks Pro', 'Manual Excel reporting', 'Outsourced bookkeeping'],
    keyQuotes: [
      '"We need someone who can think strategically, not just count beans"',
      '"Our investors are asking harder questions about our metrics"',
      '"We\'re spending too much time on reporting instead of growing the business"'
    ],
    nextSteps: [
      'Financial audit and analysis within 1 week',
      'Present findings and recommendations',
      'Proposal for ongoing engagement',
      'Reference calls with similar clients'
    ],
    urgency: 'high',
    sentiment: 'positive',
    salesScore: 87
  }

  const mockQBOData: QBODataSet = {
    companyInfo: {
      name: companyName,
      industry: 'B2B SaaS',
      revenue: 4200000,
      employees: 28,
      establishedYear: 2019
    },
    financialMetrics: {
      revenue: { current: 4200000, growth: 0.285, trend: 'increasing' },
      profitability: { grossMargin: 0.78, netMargin: 0.22, ebitda: 1150000 },
      liquidity: { currentRatio: 2.1, quickRatio: 1.8, cashOnHand: 850000 },
      efficiency: { assetTurnover: 1.4, receivablesDays: 42, inventoryTurnover: 0 },
      leverage: { debtToEquity: 0.35, interestCoverage: 12.5, debtServiceCoverage: 3.2 }
    },
    healthScore: 82,
    riskFactors: [
      'Customer concentration - top 3 clients = 45% of revenue',
      'Rapid growth straining operational capacity',
      'Limited financial controls and reporting infrastructure'
    ],
    opportunities: [
      'Expansion into enterprise market segment',
      'Potential for 40% improvement in gross margins through pricing optimization',
      'International expansion opportunity in EMEA region'
    ],
    benchmarks: {
      revenueGrowth: { company: 28.5, industry: 15.2, percentile: 85 },
      grossMargin: { company: 78.0, industry: 68.5, percentile: 75 },
      netMargin: { company: 22.0, industry: 18.3, percentile: 70 }
    }
  }

  const generateIntelligentDeck = async () => {
    const insights = callInsights || mockCallInsights
    const financialData = qboData || mockQBOData

    setGenerating(true)
    setGenerationStage({ stage: 'Initializing AI analysis...', progress: 0, message: 'Preparing intelligent audit generation' })

    const stages = [
      { stage: 'Analyzing call transcript insights...', progress: 10, message: 'Processing stakeholder feedback and requirements', delay: 1200 },
      { stage: 'Cross-referencing financial data...', progress: 20, message: 'Mapping pain points to financial evidence', delay: 1400 },
      { stage: 'Calculating financial health score...', progress: 30, message: 'Benchmarking against industry standards', delay: 1100 },
      { stage: 'Identifying opportunity matrix...', progress: 45, message: 'Quantifying potential value creation', delay: 1600 },
      { stage: 'Generating pain point solutions...', progress: 60, message: 'Mapping solutions to business objectives', delay: 1300 },
      { stage: 'Creating personalized recommendations...', progress: 75, message: 'Aligning proposals with budget and timeline', delay: 1500 },
      { stage: 'Developing engagement proposal...', progress: 85, message: 'Structuring phased implementation approach', delay: 1200 },
      { stage: 'Finalizing intelligent audit deck...', progress: 95, message: 'Compiling comprehensive analysis', delay: 1000 },
      { stage: 'Analysis complete!', progress: 100, message: 'Intelligent audit deck ready for presentation', delay: 800 }
    ]

    for (const { stage, progress, message, delay } of stages) {
      await new Promise(resolve => setTimeout(resolve, delay))
      const stageInsights = progress === 30 ? [
        `Financial health score: ${financialData.healthScore}/100`,
        `Revenue growth: ${(financialData.financialMetrics.revenue.growth * 100).toFixed(1)}% (Top 15% of industry)`,
        `Gross margin: ${(financialData.financialMetrics.profitability.grossMargin * 100).toFixed(1)}% (Above industry average)`
      ] : progress === 60 ? [
        'Identified $127K annual savings opportunity in process automation',
        'Cash flow optimization could free up $85K in working capital',
        'Strategic pricing review could improve margins by 8-12%'
      ] : undefined
      
      setGenerationStage({ stage, progress, message, insights: stageInsights })
    }

    // Generate comprehensive intelligent audit deck
    const intelligentDeck: IntelligentAuditDeck = {
      executiveSummary: {
        overallScore: Math.round((financialData.healthScore + insights.salesScore) / 2),
        keyFindings: [
          `Strong revenue growth of ${(financialData.financialMetrics.revenue.growth * 100).toFixed(1)}% positions ${companyName} in top 15% of industry`,
          `Current financial infrastructure unable to support stated goal of $10M ARR within 18 months`,
          `Manual processes consuming 40+ hours monthly represent $127K annual opportunity cost`,
          `Customer concentration risk (45% from top 3 clients) requires strategic diversification`
        ],
        urgentIssues: [
          'Month-end close taking 15+ days vs industry best practice of 3-5 days',
          'Limited cash flow forecasting creating strategic planning blind spots',
          'Investor reporting gaps may impact upcoming Series B readiness'
        ],
        opportunities: [
          'Process automation could free up 32 hours monthly for strategic initiatives',
          'Financial infrastructure optimization enabling 3x revenue scaling capacity',
          'Enhanced metrics and KPIs improving investor confidence and valuation'
        ],
        contextualInsights: [
          `Based on CEO emphasis on "strategic thinking, not bean counting" - clear need for CFO-level guidance`,
          `90-day implementation timeline aligns with Q4 strategic planning cycle`,
          `$8-12K budget range indicates serious commitment to financial infrastructure investment`
        ],
        callToAction: 'Implement comprehensive financial operations overhaul to support aggressive growth trajectory and Series B preparation'
      },
      financialSnapshot: {
        healthScore: financialData.healthScore,
        keyMetrics: [
          { name: 'Revenue Growth', value: `${(financialData.financialMetrics.revenue.growth * 100).toFixed(1)}%`, trend: 'up', benchmark: '15.2%', status: 'excellent' },
          { name: 'Gross Margin', value: `${(financialData.financialMetrics.profitability.grossMargin * 100).toFixed(1)}%`, trend: 'stable', benchmark: '68.5%', status: 'good' },
          { name: 'Current Ratio', value: financialData.financialMetrics.liquidity.currentRatio.toFixed(1), trend: 'up', benchmark: '1.8', status: 'good' },
          { name: 'Cash Position', value: `$${(financialData.financialMetrics.liquidity.cashOnHand / 1000).toFixed(0)}K`, trend: 'stable', benchmark: 'Industry Average', status: 'adequate' }
        ],
        industryComparison: [
          { metric: 'Revenue Growth', company: financialData.financialMetrics.revenue.growth * 100, industry: 15.2, ranking: 'Top 15%' },
          { metric: 'Gross Margin', company: financialData.financialMetrics.profitability.grossMargin * 100, industry: 68.5, ranking: 'Above Average' },
          { metric: 'Net Margin', company: financialData.financialMetrics.profitability.netMargin * 100, industry: 18.3, ranking: 'Above Average' }
        ],
        trendAnalysis: [
          'Revenue acceleration indicating strong product-market fit',
          'Margin compression risk as growth outpaces operational scaling',
          'Working capital optimization opportunity identified'
        ]
      },
      painPointAnalysis: {
        identifiedPains: insights.painPoints.map((pain, index) => ({
          painPoint: pain,
          financialEvidence: getFinancialEvidence(pain, financialData),
          impact: calculatePainImpact(pain, financialData),
          solution: generateSolution(pain, insights),
          priority: index < 2 ? 'high' : index < 4 ? 'medium' : 'low',
          estimatedValue: Math.floor(Math.random() * 100000) + 50000
        })),
        rootCauseAnalysis: [
          'Rapid growth (28.5% revenue increase) outpacing systems and process development',
          'Limited financial infrastructure investment relative to business complexity',
          'Lack of strategic financial leadership during critical scaling phase'
        ]
      },
      opportunityMatrix: {
        opportunities: [
          {
            opportunity: 'Financial Process Automation',
            financialBasis: '40+ monthly hours in manual reporting @ $75/hour fully loaded cost',
            estimatedValue: 127000,
            difficulty: 'medium',
            timeline: '3-6 months',
            alignsWithGoals: true,
            roi: 425
          },
          {
            opportunity: 'Working Capital Optimization',
            financialBasis: '42-day receivables cycle vs 28-day industry average',
            estimatedValue: 85000,
            difficulty: 'low',
            timeline: '1-3 months',
            alignsWithGoals: true,
            roi: 340
          },
          {
            opportunity: 'Strategic Pricing Optimization',
            financialBasis: 'Gross margin improvement potential based on competitive analysis',
            estimatedValue: 275000,
            difficulty: 'high',
            timeline: '6-12 months',
            alignsWithGoals: true,
            roi: 650
          }
        ],
        priorityRanking: [
          'Immediate: Working Capital Optimization (High ROI, Low Risk)',
          'Short-term: Financial Process Automation (Foundation for scaling)',
          'Medium-term: Strategic Pricing Optimization (Highest value creation)'
        ]
      },
      riskProfile: {
        criticalRisks: [
          { risk: 'Customer Concentration', probability: 'Medium', impact: 'High', mitigation: 'Diversification strategy and contract structuring' },
          { risk: 'Operational Scaling', probability: 'High', impact: 'Medium', mitigation: 'Process automation and infrastructure investment' },
          { risk: 'Financial Control Gaps', probability: 'Medium', impact: 'Medium', mitigation: 'Enhanced controls and reporting systems' }
        ],
        mitigationStrategies: [
          { strategy: 'Customer Diversification Program', timeline: '6-12 months', investment: '$25K', expectedOutcome: 'Reduce top 3 customer concentration to <35%' },
          { strategy: 'Financial Infrastructure Overhaul', timeline: '3-6 months', investment: '$40K', expectedOutcome: 'Automated reporting and real-time visibility' },
          { strategy: 'Strategic Planning Process', timeline: '1-3 months', investment: '$15K', expectedOutcome: 'Enhanced forecasting and scenario planning' }
        ],
        contingencyPlanning: [
          'Established credit facilities for working capital management',
          'Diversified service delivery model to reduce operational risk',
          'Enhanced financial monitoring and early warning systems'
        ]
      },
      personalizedRecommendations: {
        immediate: [
          { action: 'Implement 13-week rolling cash flow forecast', rationale: 'Address CEO concern about financial visibility', expectedOutcome: 'Real-time cash management capability', timeline: '2 weeks' },
          { action: 'Standardize month-end close process', rationale: 'Reduce 15-day close to 5-day industry standard', expectedOutcome: '67% faster financial reporting', timeline: '4 weeks' },
          { action: 'Establish investor reporting package', rationale: 'Prepare for Series B requirements', expectedOutcome: 'Investor-ready metrics dashboard', timeline: '3 weeks' }
        ],
        shortTerm: [
          { action: 'Deploy automated financial reporting system', rationale: 'Eliminate 40+ hours of manual work monthly', expectedOutcome: '$127K annual savings', timeline: '3 months' },
          { action: 'Optimize accounts receivable management', rationale: 'Reduce DSO from 42 to 28 days', expectedOutcome: '$85K working capital improvement', timeline: '2 months' },
          { action: 'Implement advanced budgeting and forecasting', rationale: 'Support $10M revenue scaling goal', expectedOutcome: 'Enhanced strategic planning capability', timeline: '3 months' }
        ],
        longTerm: [
          { action: 'Develop comprehensive FP&A function', rationale: 'Support Series B fundraising and beyond', expectedOutcome: 'Strategic financial partnership', timeline: '6-12 months' },
          { action: 'Implement strategic pricing optimization', rationale: 'Maximize margin potential identified in analysis', expectedOutcome: '8-12% margin improvement', timeline: '9 months' },
          { action: 'Build scalable financial operations', rationale: 'Support 3x revenue growth trajectory', expectedOutcome: 'Operational leverage and efficiency', timeline: '12 months' }
        ],
        budgetAligned: [
          { service: 'Fractional CFO Services', investment: '$10,000/month', roi: '400% Year 1', priority: 'High' },
          { service: 'Financial Systems Implementation', investment: '$15,000 setup', roi: '350% Year 1', priority: 'High' },
          { service: 'Controller Services', investment: '$6,000/month', roi: '280% Year 1', priority: 'Medium' }
        ]
      },
      proposedEngagement: {
        services: [
          {
            name: 'Fractional CFO Services',
            description: 'Strategic financial leadership and oversight',
            deliverables: ['Weekly cash flow management', 'Monthly board reporting', 'Strategic planning support', 'Investor relations'],
            timeline: 'Ongoing engagement'
          },
          {
            name: 'Financial Systems Implementation',
            description: 'Technology infrastructure and process automation',
            deliverables: ['Automated reporting dashboards', 'Integrated planning tools', 'Process documentation', 'Team training'],
            timeline: '3-6 months implementation'
          },
          {
            name: 'Strategic Advisory',
            description: 'Growth strategy and operational guidance',
            deliverables: ['Market analysis', 'Pricing optimization', 'M&A support', 'Fundraising preparation'],
            timeline: 'Project-based initiatives'
          }
        ],
        phasedApproach: [
          {
            phase: 'Foundation (Months 1-2)',
            duration: '60 days',
            objectives: ['Stabilize current operations', 'Implement core reporting', 'Establish financial controls'],
            deliverables: ['Real-time dashboard', 'Automated month-end process', 'Cash flow forecasting', 'KPI framework']
          },
          {
            phase: 'Optimization (Months 3-4)',
            duration: '60 days',
            objectives: ['Optimize working capital', 'Enhance operational efficiency', 'Prepare for scaling'],
            deliverables: ['A/R optimization', 'Process automation', 'Scenario planning models', 'Team training']
          },
          {
            phase: 'Strategic Growth (Months 5-6)',
            duration: '60 days',
            objectives: ['Scale financial operations', 'Prepare for fundraising', 'Strategic initiatives'],
            deliverables: ['Series B preparation', 'Strategic plan execution', 'Advanced analytics', 'Investor materials']
          }
        ],
        investment: {
          monthly: '$10,000',
          setup: '$15,000',
          total: '$75,000 (6 months)'
        },
        expectedOutcomes: [
          'Reduced month-end close from 15 to 3 days',
          '$127K annual savings in process automation',
          '$85K working capital optimization',
          'Series B-ready financial infrastructure',
          'Real-time financial visibility and control'
        ],
        roi: {
          timeToValue: '30 days for initial improvements',
          yearOneROI: '400% return on investment',
          threeYearROI: '650% cumulative return'
        },
        successMetrics: [
          'Month-end close time reduction to 3 days',
          'Automated reporting reducing manual work by 80%',
          'Cash flow forecasting accuracy >95%',
          'Investor satisfaction score >4.5/5',
          'Financial team productivity increase >40%'
        ]
      }
    }

    setAuditDeck(intelligentDeck)
    onDeckGenerated?.(intelligentDeck)
    setGenerating(false)
    setTimeout(() => setGenerationStage(null), 2000)
    showToast('Intelligent audit deck generated successfully!', 'success')
  }

  // Helper functions
  const getFinancialEvidence = (pain: string, data: QBODataSet): string => {
    if (pain.includes('manual')) return `Current efficiency metrics show ${data.financialMetrics.efficiency.receivablesDays} days in receivables cycle vs 28-day industry standard`
    if (pain.includes('cash flow')) return `Working capital of $${(data.financialMetrics.liquidity.cashOnHand / 1000).toFixed(0)}K with limited forecasting visibility`
    if (pain.includes('reporting')) return `Financial reporting infrastructure unable to support current ${(data.financialMetrics.revenue.growth * 100).toFixed(1)}% growth rate`
    return 'Financial analysis confirms operational inefficiency impacting profitability'
  }

  const calculatePainImpact = (pain: string, data: QBODataSet): string => {
    if (pain.includes('manual')) return `Estimated $${Math.floor(data.financialMetrics.revenue.current * 0.03 / 1000)}K annual opportunity cost`
    if (pain.includes('cash flow')) return `Working capital optimization opportunity of $${Math.floor(data.financialMetrics.liquidity.cashOnHand * 0.1 / 1000)}K`
    return 'Moderate to significant operational impact requiring strategic attention'
  }

  const generateSolution = (pain: string, insights: CallInsights): string => {
    if (pain.includes('manual')) return 'Implement automated financial reporting and analytics platform with real-time dashboards'
    if (pain.includes('cash flow')) return 'Deploy 13-week rolling cash flow forecasting with scenario planning capabilities'
    if (pain.includes('close')) return 'Standardize month-end close process with automated reconciliations and controls'
    return 'Comprehensive financial operations optimization with strategic oversight'
  }

  const exportDeck = async (format: 'pdf' | 'pptx' | 'html') => {
    if (!auditDeck) return

    showToast(`Generating ${format.toUpperCase()} export...`, 'info')
    
    // Simulate export generation
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const exportContent = generateExportContent(auditDeck, format)
    const blob = new Blob([exportContent], { 
      type: format === 'pdf' ? 'application/pdf' : 
           format === 'pptx' ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation' : 
           'text/html' 
    })
    
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `intelligent-audit-deck-${companyName.replace(/\s+/g, '-')}.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    showToast(`${format.toUpperCase()} export completed successfully`, 'success')
  }

  const generateExportContent = (deck: IntelligentAuditDeck, format: string): string => {
    if (format === 'html') {
      return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Intelligent Financial Audit - ${companyName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #fff; }
        .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 50px; padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 15px; }
        .header h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .header p { font-size: 1.2rem; opacity: 0.9; }
        .section { margin: 40px 0; padding: 30px; background: #f8f9fa; border-radius: 10px; border-left: 5px solid #667eea; }
        .section h2 { color: #667eea; margin-bottom: 20px; font-size: 1.8rem; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric-card { background: white; padding: 20px; border-radius: 10px; border: 1px solid #e9ecef; text-align: center; }
        .metric-value { font-size: 2rem; font-weight: bold; color: #667eea; margin-bottom: 5px; }
        .metric-label { color: #6c757d; font-size: 0.9rem; }
        .findings-list { list-style: none; }
        .findings-list li { margin: 10px 0; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #28a745; }
        .risk-item { border-left-color: #dc3545 !important; }
        .opportunity-item { border-left-color: #ffc107 !important; }
        .footer { text-align: center; margin-top: 50px; padding: 30px; background: #343a40; color: white; border-radius: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Intelligent Financial Audit</h1>
            <p>${companyName} • Executive Assessment & Strategic Recommendations</p>
            <p>Generated: ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="section">
            <h2>Executive Summary</h2>
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-value">${deck.executiveSummary.overallScore}/100</div>
                    <div class="metric-label">Overall Health Score</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${deck.financialSnapshot.keyMetrics[0]?.value || 'N/A'}</div>
                    <div class="metric-label">Revenue Growth</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${deck.opportunityMatrix.opportunities.length}</div>
                    <div class="metric-label">Opportunities Identified</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${deck.proposedEngagement.roi.yearOneROI}</div>
                    <div class="metric-label">Year 1 ROI</div>
                </div>
            </div>
            <ul class="findings-list">
                ${deck.executiveSummary.keyFindings.map(finding => `<li>${finding}</li>`).join('')}
            </ul>
        </div>

        <div class="section">
            <h2>Opportunity Matrix</h2>
            <div class="metrics-grid">
                ${deck.opportunityMatrix.opportunities.map(opp => `
                <div class="metric-card">
                    <h3 style="color: #667eea; margin-bottom: 10px;">${opp.opportunity}</h3>
                    <div class="metric-value">$${(opp.estimatedValue / 1000).toFixed(0)}K</div>
                    <div class="metric-label">Estimated Value</div>
                    <p style="margin-top: 10px; font-size: 0.9rem; color: #6c757d;">${opp.financialBasis}</p>
                </div>
                `).join('')}
            </div>
        </div>

        <div class="section">
            <h2>Strategic Recommendations</h2>
            <h3 style="color: #28a745; margin: 20px 0 10px 0;">Immediate Actions (30 days)</h3>
            <ul class="findings-list">
                ${deck.personalizedRecommendations.immediate.map(rec => 
                    `<li><strong>${rec.action}</strong><br><small>${rec.rationale}</small></li>`
                ).join('')}
            </ul>
            <h3 style="color: #ffc107; margin: 20px 0 10px 0;">Short-term Initiatives (90 days)</h3>
            <ul class="findings-list">
                ${deck.personalizedRecommendations.shortTerm.map(rec => 
                    `<li class="opportunity-item"><strong>${rec.action}</strong><br><small>${rec.rationale}</small></li>`
                ).join('')}
            </ul>
        </div>

        <div class="section">
            <h2>Proposed Engagement</h2>
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-value">${deck.proposedEngagement.investment.monthly}</div>
                    <div class="metric-label">Monthly Investment</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${deck.proposedEngagement.roi.timeToValue}</div>
                    <div class="metric-label">Time to Value</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${deck.proposedEngagement.roi.yearOneROI}</div>
                    <div class="metric-label">Year 1 ROI</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${deck.proposedEngagement.services.length}</div>
                    <div class="metric-label">Service Components</div>
                </div>
            </div>
            <h3 style="margin: 20px 0 10px 0;">Expected Outcomes</h3>
            <ul class="findings-list">
                ${deck.proposedEngagement.expectedOutcomes.map(outcome => `<li>${outcome}</li>`).join('')}
            </ul>
        </div>

        <div class="footer">
            <h3>Ready to Transform Your Financial Operations?</h3>
            <p>Let's discuss how we can help ${companyName} achieve these results.</p>
            <p style="margin-top: 15px; font-size: 0.9rem; opacity: 0.8;">
                This analysis was generated using AI-powered financial intelligence combined with stakeholder insights.
            </p>
        </div>
    </div>
</body>
</html>`
    }
    
    // For PDF and PPTX, return JSON data that would be processed by a backend service
    return JSON.stringify({
      type: format,
      data: deck,
      company: companyName,
      generatedAt: new Date().toISOString()
    }, null, 2)
  }

  const slides = [
    { title: 'Executive Summary', key: 'summary', icon: Star },
    { title: 'Financial Snapshot', key: 'financial', icon: BarChart3 },
    { title: 'Pain Point Analysis', key: 'painpoints', icon: AlertTriangle },
    { title: 'Opportunity Matrix', key: 'opportunities', icon: Target },
    { title: 'Risk Assessment', key: 'risks', icon: Shield },
    { title: 'Recommendations', key: 'recommendations', icon: CheckCircle },
    { title: 'Proposed Engagement', key: 'engagement', icon: Presentation }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <ToastContainer />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Intelligent Audit Deck Generator</h2>
            <p className="text-purple-100">AI-powered financial analysis with contextual insights for {companyName}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Brain className="h-12 w-12 text-purple-200" />
            <div className="text-right">
              <div className="text-sm text-purple-200">Powered by</div>
              <div className="font-semibold">AI Intelligence</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Generation Progress */}
        {generationStage && (
          <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-purple-800 mb-1">{generationStage.stage}</h3>
                <p className="text-purple-600 text-sm mb-2">{generationStage.message}</p>
                <div className="w-full bg-purple-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${generationStage.progress}%` }}
                  />
                </div>
                <div className="text-right text-sm text-purple-600 mt-1">{generationStage.progress}%</div>
                {generationStage.insights && (
                  <div className="mt-3 space-y-1">
                    {generationStage.insights.map((insight, index) => (
                      <div key={index} className="text-xs text-purple-700 flex items-center">
                        <Zap className="w-3 h-3 mr-1" />
                        {insight}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Generation Controls */}
        {!auditDeck && !generating && (
          <div className="mb-6 text-center">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Analysis Template</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'comprehensive', name: 'Comprehensive Analysis', desc: 'Full financial audit with strategic recommendations' },
                  { id: 'focused', name: 'Focused Assessment', desc: 'Targeted analysis of key issues and opportunities' },
                  { id: 'investor', name: 'Investor Ready', desc: 'Presentation-ready deck for stakeholder meetings' }
                ].map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={generateIntelligentDeck}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center space-x-2 mx-auto"
            >
              <Brain className="w-5 h-5" />
              <span>Generate Intelligent Audit Deck</span>
            </button>
          </div>
        )}

        {/* Generated Deck Display */}
        {auditDeck && (
          <div>
            {/* Export Controls */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Intelligent Audit Deck Generated</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => exportDeck('html')}
                  className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm flex items-center space-x-1"
                >
                  <Download className="w-4 h-4" />
                  <span>HTML</span>
                </button>
                <button
                  onClick={() => exportDeck('pdf')}
                  className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 text-sm flex items-center space-x-1"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => exportDeck('pptx')}
                  className="bg-orange-600 text-white px-3 py-2 rounded-md hover:bg-orange-700 text-sm flex items-center space-x-1"
                >
                  <Download className="w-4 h-4" />
                  <span>PowerPoint</span>
                </button>
              </div>
            </div>

            {/* Slide Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex overflow-x-auto">
                {slides.map((slide, index) => {
                  const Icon = slide.icon
                  return (
                    <button
                      key={slide.key}
                      onClick={() => setCurrentSlide(index)}
                      className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                        currentSlide === index
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{slide.title}</span>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Slide Content */}
            <div className="min-h-96">
              {/* Executive Summary */}
              {currentSlide === 0 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Executive Summary</h2>
                    <div className="flex items-center justify-center space-x-8">
                      <div className="text-center">
                        <div className={`text-4xl font-bold px-6 py-3 rounded-full inline-block ${
                          auditDeck.executiveSummary.overallScore >= 80 ? 'bg-green-100 text-green-800' :
                          auditDeck.executiveSummary.overallScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {auditDeck.executiveSummary.overallScore}/100
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Overall Health Score</p>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-purple-600">
                          {auditDeck.proposedEngagement.roi.yearOneROI}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Expected Year 1 ROI</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                      <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Key Findings
                      </h4>
                      <ul className="space-y-2">
                        {auditDeck.executiveSummary.keyFindings.map((finding, index) => (
                          <li key={index} className="text-sm text-green-700">• {finding}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                      <h4 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Urgent Issues
                      </h4>
                      <ul className="space-y-2">
                        {auditDeck.executiveSummary.urgentIssues.map((issue, index) => (
                          <li key={index} className="text-sm text-red-700">• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      Strategic Opportunities
                    </h4>
                    <ul className="space-y-2">
                      {auditDeck.executiveSummary.opportunities.map((opportunity, index) => (
                        <li key={index} className="text-sm text-blue-700">• {opportunity}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <h4 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                      <Brain className="w-5 h-5 mr-2" />
                      Contextual Intelligence
                    </h4>
                    <ul className="space-y-2">
                      {auditDeck.executiveSummary.contextualInsights.map((insight, index) => (
                        <li key={index} className="text-sm text-purple-700">• {insight}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg border border-purple-300">
                    <h4 className="text-lg font-semibold text-purple-800 mb-2">Strategic Call to Action</h4>
                    <p className="text-purple-700">{auditDeck.executiveSummary.callToAction}</p>
                  </div>
                </div>
              )}

              {/* Financial Snapshot */}
              {currentSlide === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Financial Snapshot</h2>
                  
                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {auditDeck.financialSnapshot.keyMetrics.map((metric, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">{metric.name}</h4>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                        <div className="flex items-center justify-center space-x-1">
                          {metric.trend === 'up' ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : metric.trend === 'down' ? (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          ) : (
                            <Minus className="w-4 h-4 text-gray-500" />
                          )}
                          <span className={`text-xs ${
                            metric.status === 'excellent' ? 'text-green-600' :
                            metric.status === 'good' ? 'text-blue-600' :
                            metric.status === 'adequate' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            vs {metric.benchmark}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Industry Comparison */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Industry Benchmarking</h3>
                    <div className="space-y-4">
                      {auditDeck.financialSnapshot.industryComparison.map((comparison, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded">
                          <span className="font-medium">{comparison.metric}</span>
                          <div className="flex items-center space-x-4">
                            <span className="text-blue-600 font-semibold">{comparison.company.toFixed(1)}%</span>
                            <span className="text-gray-500">vs</span>
                            <span className="text-gray-700">{comparison.industry.toFixed(1)}%</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              comparison.ranking.includes('Top') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {comparison.ranking}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trend Analysis */}
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">Trend Analysis</h3>
                    <ul className="space-y-2">
                      {auditDeck.financialSnapshot.trendAnalysis.map((trend, index) => (
                        <li key={index} className="text-blue-700 flex items-start">
                          <TrendingUp className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          {trend}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Pain Point Analysis */}
              {currentSlide === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Pain Point Analysis</h2>
                  
                  <div className="space-y-4">
                    {auditDeck.painPointAnalysis.identifiedPains.map((pain, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">{pain.painPoint}</h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              pain.priority === 'high' ? 'bg-red-100 text-red-800' :
                              pain.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {pain.priority.toUpperCase()} PRIORITY
                            </span>
                            <span className="text-lg font-bold text-green-600">
                              {formatCurrency(pain.estimatedValue)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Financial Evidence</h4>
                            <p className="text-sm text-gray-600">{pain.financialEvidence}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Business Impact</h4>
                            <p className="text-sm text-gray-600">{pain.impact}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Recommended Solution</h4>
                            <p className="text-sm text-gray-600">{pain.solution}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <h3 className="text-lg font-semibold text-orange-800 mb-4">Root Cause Analysis</h3>
                    <ul className="space-y-2">
                      {auditDeck.painPointAnalysis.rootCauseAnalysis.map((cause, index) => (
                        <li key={index} className="text-orange-700 flex items-start">
                          <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          {cause}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Opportunity Matrix */}
              {currentSlide === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Opportunity Matrix</h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {auditDeck.opportunityMatrix.opportunities.map((opportunity, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="text-center mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{opportunity.opportunity}</h3>
                          <div className="text-3xl font-bold text-green-600 mb-1">
                            {formatCurrency(opportunity.estimatedValue)}
                          </div>
                          <div className="text-sm text-gray-600">Estimated Value</div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-700">Financial Basis:</span>
                            <p className="text-sm text-gray-600">{opportunity.financialBasis}</p>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Difficulty:</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              opportunity.difficulty === 'low' ? 'bg-green-100 text-green-800' :
                              opportunity.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {opportunity.difficulty.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Timeline:</span>
                            <span className="text-sm text-gray-600">{opportunity.timeline}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">ROI:</span>
                            <span className="text-sm font-bold text-blue-600">{opportunity.roi}%</span>
                          </div>
                          
                          {opportunity.alignsWithGoals && (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              <span className="text-xs">Aligns with business goals</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">Priority Ranking</h3>
                    <ol className="space-y-2">
                      {auditDeck.opportunityMatrix.priorityRanking.map((priority, index) => (
                        <li key={index} className="text-blue-700 flex items-start">
                          <span className="font-bold mr-2">{index + 1}.</span>
                          {priority}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {/* Risk Assessment */}
              {currentSlide === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Risk Assessment</h2>
                  
                  {/* Critical Risks */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Critical Risk Factors</h3>
                    {auditDeck.riskProfile.criticalRisks.map((risk, index) => (
                      <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-red-800">{risk.risk}</h4>
                          <div className="flex space-x-2">
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                              {risk.probability} Probability
                            </span>
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                              {risk.impact} Impact
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-red-700">
                          <strong>Mitigation:</strong> {risk.mitigation}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Mitigation Strategies */}
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-4">Mitigation Strategies</h3>
                    <div className="space-y-4">
                      {auditDeck.riskProfile.mitigationStrategies.map((strategy, index) => (
                        <div key={index} className="bg-white p-4 rounded border border-green-200">
                          <h4 className="font-medium text-green-800 mb-2">{strategy.strategy}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Timeline:</span>
                              <span className="text-gray-600 ml-1">{strategy.timeline}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Investment:</span>
                              <span className="text-gray-600 ml-1">{strategy.investment}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Expected Outcome:</span>
                              <span className="text-gray-600 ml-1">{strategy.expectedOutcome}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contingency Planning */}
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">Contingency Planning</h3>
                    <ul className="space-y-2">
                      {auditDeck.riskProfile.contingencyPlanning.map((plan, index) => (
                        <li key={index} className="text-blue-700 flex items-start">
                          <Shield className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          {plan}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {currentSlide === 5 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Strategic Recommendations</h2>
                  
                  {/* Immediate Actions */}
                  <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                    <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Immediate Actions (30 days)
                    </h3>
                    <div className="space-y-3">
                      {auditDeck.personalizedRecommendations.immediate.map((action, index) => (
                        <div key={index} className="bg-white p-4 rounded border border-red-200">
                          <h4 className="font-medium text-gray-900 mb-1">{action.action}</h4>
                          <p className="text-sm text-gray-600 mb-2">{action.rationale}</p>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500">Expected: {action.expectedOutcome}</span>
                            <span className="font-medium text-red-600">{action.timeline}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Short-term Initiatives */}
                  <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Short-term Initiatives (90 days)
                    </h3>
                    <div className="space-y-3">
                      {auditDeck.personalizedRecommendations.shortTerm.map((action, index) => (
                        <div key={index} className="bg-white p-4 rounded border border-yellow-200">
                          <h4 className="font-medium text-gray-900 mb-1">{action.action}</h4>
                          <p className="text-sm text-gray-600 mb-2">{action.rationale}</p>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500">Expected: {action.expectedOutcome}</span>
                            <span className="font-medium text-yellow-600">{action.timeline}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Long-term Strategic */}
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      Long-term Strategic (6-12 months)
                    </h3>
                    <div className="space-y-3">
                      {auditDeck.personalizedRecommendations.longTerm.map((action, index) => (
                        <div key={index} className="bg-white p-4 rounded border border-green-200">
                          <h4 className="font-medium text-gray-900 mb-1">{action.action}</h4>
                          <p className="text-sm text-gray-600 mb-2">{action.rationale}</p>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500">Expected: {action.expectedOutcome}</span>
                            <span className="font-medium text-green-600">{action.timeline}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Budget-Aligned Services */}
                  <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-800 mb-4">Budget-Aligned Services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {auditDeck.personalizedRecommendations.budgetAligned.map((service, index) => (
                        <div key={index} className="bg-white p-4 rounded border border-purple-200 text-center">
                          <h4 className="font-medium text-gray-900 mb-2">{service.service}</h4>
                          <div className="text-lg font-bold text-purple-600 mb-1">{service.investment}</div>
                          <div className="text-sm text-gray-600 mb-2">{service.roi}</div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            service.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {service.priority} Priority
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Proposed Engagement */}
              {currentSlide === 6 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Proposed Engagement</h2>
                  
                  {/* Investment Summary */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-800 mb-4 text-center">Investment & ROI Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{auditDeck.proposedEngagement.investment.monthly}</div>
                        <div className="text-sm text-gray-600">Monthly Investment</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{auditDeck.proposedEngagement.roi.timeToValue}</div>
                        <div className="text-sm text-gray-600">Time to Value</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{auditDeck.proposedEngagement.roi.yearOneROI}</div>
                        <div className="text-sm text-gray-600">Year 1 ROI</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">{auditDeck.proposedEngagement.roi.threeYearROI}</div>
                        <div className="text-sm text-gray-600">3-Year ROI</div>
                      </div>
                    </div>
                  </div>

                  {/* Phased Approach */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Phased Implementation Approach</h3>
                    {auditDeck.proposedEngagement.phasedApproach.map((phase, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">{phase.phase}</h4>
                          <span className="text-sm text-gray-600">{phase.duration}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">Objectives</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {phase.objectives.map((objective, objIndex) => (
                                <li key={objIndex}>• {objective}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">Key Deliverables</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {phase.deliverables.map((deliverable, delIndex) => (
                                <li key={delIndex}>• {deliverable}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Expected Outcomes */}
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-4">Expected Outcomes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="space-y-2">
                        {auditDeck.proposedEngagement.expectedOutcomes.slice(0, Math.ceil(auditDeck.proposedEngagement.expectedOutcomes.length / 2)).map((outcome, index) => (
                          <li key={index} className="text-green-700 flex items-start">
                            <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2">
                        {auditDeck.proposedEngagement.expectedOutcomes.slice(Math.ceil(auditDeck.proposedEngagement.expectedOutcomes.length / 2)).map((outcome, index) => (
                          <li key={index} className="text-green-700 flex items-start">
                            <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Success Metrics */}
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">Success Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {auditDeck.proposedEngagement.successMetrics.map((metric, index) => (
                        <div key={index} className="bg-white p-3 rounded border border-blue-200 text-center">
                          <BarChart3 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                          <p className="text-sm text-blue-700">{metric}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg text-center">
                    <h3 className="text-xl font-bold mb-2">Ready to Transform Your Financial Operations?</h3>
                    <p className="mb-4">Let's schedule a call to discuss your implementation timeline and answer any questions.</p>
                    <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                      Schedule Your Strategy Call
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="border-t border-gray-200 pt-6 mt-8 flex justify-between items-center">
              <button
                onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                disabled={currentSlide === 0}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="text-sm text-gray-500">
                {currentSlide + 1} of {slides.length}
              </span>
              
              <button
                onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
                disabled={currentSlide === slides.length - 1}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Prerequisites Check */}
        {!callInsights && !qboData && !auditDeck && !generating && (
          <div className="text-center py-8">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Intelligent Audit Deck Ready</h3>
            <p className="text-gray-600 mb-6">
              This demo uses comprehensive mock data to showcase the full capabilities of the intelligent audit deck generator.
            </p>
            <div className="space-y-2 text-sm text-gray-500 mb-6">
              <div className="flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                Financial data analysis capabilities
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                Call transcript insights integration
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                AI-powered recommendation engine
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                Professional presentation export
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default IntelligentAuditDeckGenerator
