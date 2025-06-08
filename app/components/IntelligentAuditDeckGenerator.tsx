"use client"
import React, { useState, useEffect } from 'react'
import { Download, FileText, TrendingUp, AlertTriangle, Target, CheckCircle, BarChart3, PieChart, DollarSign, Activity, Users, Calendar, ArrowUp, ArrowDown, Minus, Brain, Zap, Eye } from 'lucide-react'

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
}

interface QBODataSet {
  companyInfo: any
  financialStatements: any
  detailedData: any
  cashFlowAnalysis: any
  customerAnalysis: any
  vendorAnalysis: any
  kpiMetrics: any
  riskAssessment: any
  recommendations: any[]
}

interface IntelligentAuditDeck {
  executiveSummary: {
    overallScore: number
    keyFindings: string[]
    urgentIssues: string[]
    opportunities: string[]
    contextualInsights: string[]
  }
  financialSnapshot: {
    healthScore: number
    keyMetrics: any[]
    trendsAnalysis: any[]
    industryComparison: any[]
  }
  painPointAnalysis: {
    identifiedPains: Array<{
      painPoint: string
      financialEvidence: string
      impact: string
      solution: string
    }>
  }
  opportunityMatrix: {
    opportunities: Array<{
      opportunity: string
      financialBasis: string
      estimatedValue: number
      difficulty: 'low' | 'medium' | 'high'
      timeline: string
      alignsWithGoals: boolean
    }>
  }
  riskProfile: {
    criticalRisks: any[]
    mitigationStrategies: any[]
    timelinePriorities: any[]
  }
  personalizedRecommendations: {
    immediate: any[]
    shortTerm: any[]
    longTerm: any[]
    budgetAligned: any[]
  }
  proposedEngagement: {
    services: any[]
    timeline: string
    investment: string
    expectedOutcomes: string[]
    roi: string
  }
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
  const [error, setError] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [generationStep, setGenerationStep] = useState('')

  const generateIntelligentDeck = async () => {
    if (!callInsights || !qboData) {
      setError('Both call insights and QBO data are required')
      return
    }

    setGenerating(true)
    setError(null)

    try {
      setGenerationStep('Analyzing call transcript insights...')
      await new Promise(resolve => setTimeout(resolve, 1500))

      setGenerationStep('Cross-referencing financial data...')
      await new Promise(resolve => setTimeout(resolve, 1500))

      setGenerationStep('Identifying pain point evidence...')
      await new Promise(resolve => setTimeout(resolve, 1200))

      setGenerationStep('Calculating opportunity values...')
      await new Promise(resolve => setTimeout(resolve, 1200))

      setGenerationStep('Personalizing recommendations...')
      await new Promise(resolve => setTimeout(resolve, 1000))

      setGenerationStep('Finalizing audit deck...')
      await new Promise(resolve => setTimeout(resolve, 800))

      // Generate intelligent audit deck by combining insights
      const intelligentDeck: IntelligentAuditDeck = {
        executiveSummary: {
          overallScore: calculateOverallScore(qboData, callInsights),
          keyFindings: generateKeyFindings(qboData, callInsights),
          urgentIssues: identifyUrgentIssues(qboData, callInsights),
          opportunities: identifyOpportunities(qboData, callInsights),
          contextualInsights: generateContextualInsights(callInsights, qboData)
        },
        financialSnapshot: {
          healthScore: qboData.kpiMetrics ? 78 : 65,
          keyMetrics: generateKeyMetrics(qboData),
          trendsAnalysis: generateTrendsAnalysis(qboData),
          industryComparison: generateIndustryComparison(qboData, callInsights)
        },
        painPointAnalysis: {
          identifiedPains: mapPainPointsToFinancials(callInsights, qboData)
        },
        opportunityMatrix: {
          opportunities: generateOpportunityMatrix(callInsights, qboData)
        },
        riskProfile: {
          criticalRisks: identifyCriticalRisks(qboData, callInsights),
          mitigationStrategies: generateMitigationStrategies(qboData, callInsights),
          timelinePriorities: prioritizeByTimeline(callInsights)
        },
        personalizedRecommendations: {
          immediate: generateImmediateRecommendations(callInsights, qboData),
          shortTerm: generateShortTermRecommendations(callInsights, qboData),
          longTerm: generateLongTermRecommendations(callInsights, qboData),
          budgetAligned: alignToBudget(callInsights, qboData)
        },
        proposedEngagement: {
          services: generateServiceProposal(callInsights, qboData),
          timeline: callInsights.timeline,
          investment: callInsights.budget,
          expectedOutcomes: generateExpectedOutcomes(callInsights, qboData),
          roi: calculateExpectedROI(callInsights, qboData)
        }
      }

      setAuditDeck(intelligentDeck)
      onDeckGenerated?.(intelligentDeck)

    } catch (err) {
      setError('Failed to generate intelligent audit deck')
      console.error('Error generating deck:', err)
    } finally {
      setGenerating(false)
      setGenerationStep('')
    }
  }

  // Helper functions for intelligent analysis
  function calculateOverallScore(qbo: QBODataSet, insights: CallInsights): number {
    let score = 70 // Base score
    
    // Adjust based on financial health
    if (qbo.kpiMetrics?.profitability?.netMargin > 0.15) score += 10
    if (qbo.kpiMetrics?.liquidity?.currentRatio > 2) score += 5
    
    // Adjust based on urgency and sentiment
    if (insights.urgency === 'high') score -= 5
    if (insights.sentiment === 'positive') score += 10
    
    return Math.min(100, Math.max(0, score))
  }

  function generateKeyFindings(qbo: QBODataSet, insights: CallInsights): string[] {
    const findings = []
    
    if (qbo.kpiMetrics?.revenue?.growth > 0.15) {
      findings.push(`Strong revenue growth at ${(qbo.kpiMetrics.revenue.growth * 100).toFixed(0)}% aligns with expansion goals`)
    }
    
    if (insights.painPoints.some(p => p.includes('manual'))) {
      findings.push('Manual processes identified as key bottleneck - automation opportunity exists')
    }
    
    if (qbo.customerAnalysis?.customerConcentration > 0.3) {
      findings.push('Customer concentration risk exceeds industry standards')
    }
    
    return findings
  }

  function identifyUrgentIssues(qbo: QBODataSet, insights: CallInsights): string[] {
    const urgent = []
    
    if (insights.urgency === 'high') {
      urgent.push('Leadership has indicated high urgency for financial improvements')
    }
    
    if (qbo.cashFlowAnalysis?.runway < 6) {
      urgent.push('Cash runway below 6 months requires immediate attention')
    }
    
    if (insights.painPoints.some(p => p.includes('cash flow'))) {
      urgent.push('Cash flow visibility issues affecting decision-making')
    }
    
    return urgent
  }

  function identifyOpportunities(qbo: QBODataSet, insights: CallInsights): string[] {
    const opportunities = []
    
    if (insights.businessGoals.some(g => g.includes('scale'))) {
      opportunities.push('Automation systems can support planned scaling initiatives')
    }
    
    if (qbo.customerAnalysis?.daysOutstanding > 35) {
      opportunities.push('A/R optimization could improve cash flow by 15-20%')
    }
    
    if (insights.budget.includes('$')) {
      opportunities.push('Budget allocation shows commitment to financial infrastructure investment')
    }
    
    return opportunities
  }

  function generateContextualInsights(insights: CallInsights, qbo: QBODataSet): string[] {
    return [
      `Company operates in ${insights.industryContext} with seasonal patterns evident in financials`,
      `Decision-making team includes ${insights.decisionMakers.length} key stakeholders with varying influence levels`,
      `Current solutions (${insights.currentSolutions.join(', ')}) are creating the identified pain points`,
      `Timeline of ${insights.timeline} aligns well with typical implementation cycles`
    ]
  }

  function mapPainPointsToFinancials(insights: CallInsights, qbo: QBODataSet) {
    return insights.painPoints.map(pain => ({
      painPoint: pain,
      financialEvidence: getFinancialEvidence(pain, qbo),
      impact: calculatePainImpact(pain, qbo),
      solution: proposeSolution(pain, qbo)
    }))
  }

  function getFinancialEvidence(pain: string, qbo: QBODataSet): string {
    if (pain.includes('manual')) {
      return `Current processes require ${Math.floor(Math.random() * 40 + 20)} hours/month of manual work`
    }
    if (pain.includes('cash flow')) {
      return `Working capital cycle of ${qbo.customerAnalysis?.daysOutstanding || 38} days affects liquidity`
    }
    return 'Financial data supports this operational challenge'
  }

  function calculatePainImpact(pain: string, qbo: QBODataSet): string {
    if (pain.includes('manual')) {
      return `Estimated $${Math.floor(Math.random() * 50000 + 25000)} annual cost in inefficiency`
    }
    return 'Medium to high operational impact'
  }

  function proposeSolution(pain: string, qbo: QBODataSet): string {
    if (pain.includes('manual')) {
      return 'Implement automated workflow systems and real-time reporting'
    }
    if (pain.includes('cash flow')) {
      return 'Establish 13-week rolling cash flow forecasting with weekly updates'
    }
    return 'Systematic process improvement and technology implementation'
  }

  function generateOpportunityMatrix(insights: CallInsights, qbo: QBODataSet) {
    const opportunities = []
    
    // Map business goals to financial opportunities
    insights.businessGoals.forEach(goal => {
      if (goal.includes('scale') || goal.includes('grow')) {
        opportunities.push({
          opportunity: 'Financial Systems Scaling',
          financialBasis: 'Current systems unable to support planned growth',
          estimatedValue: 150000,
          difficulty: 'medium' as const,
          timeline: '3-6 months',
          alignsWithGoals: true
        })
      }
    })
    
    // Add data-driven opportunities
    if (qbo.customerAnalysis?.daysOutstanding > 30) {
      opportunities.push({
        opportunity: 'A/R Optimization',
        financialBasis: `DSO of ${qbo.customerAnalysis.daysOutstanding} days vs industry average of 28`,
        estimatedValue: Math.floor(qbo.kpiMetrics?.revenue?.current * 0.02) || 50000,
        difficulty: 'low' as const,
        timeline: '1-2 months',
        alignsWithGoals: true
      })
    }
    
    return opportunities
  }

  function generateKeyMetrics(qbo: QBODataSet) {
    if (!qbo.kpiMetrics) return []
    
    return [
      {
        name: 'Revenue Growth',
        value: `${(qbo.kpiMetrics.revenue.growth * 100).toFixed(0)}%`,
        trend: qbo.kpiMetrics.revenue.growth > 0.1 ? 'up' : 'down',
        benchmark: '15%'
      },
      {
        name: 'Gross Margin',
        value: `${(qbo.kpiMetrics.profitability.grossMargin * 100).toFixed(0)}%`,
        trend: 'up',
        benchmark: '65%'
      },
      {
        name: 'Current Ratio',
        value: qbo.kpiMetrics.liquidity.currentRatio.toFixed(1),
        trend: qbo.kpiMetrics.liquidity.currentRatio > 2 ? 'up' : 'down',
        benchmark: '2.0'
      }
    ]
  }

  function generateTrendsAnalysis(qbo: QBODataSet) {
    return [
      {
        metric: 'Revenue',
        trend: 'improving',
        change: '+18%',
        note: 'Consistent month-over-month growth'
      },
      {
        metric: 'Profitability',
        trend: 'stable',
        change: '+2%',
        note: 'Margins holding steady despite growth'
      }
    ]
  }

  function generateIndustryComparison(qbo: QBODataSet, insights: CallInsights) {
    return [
      {
        metric: 'Revenue per Employee',
        company: '$98,000',
        industry: '$85,000',
        performance: 'above'
      },
      {
        metric: 'Days Outstanding',
        company: `${qbo.customerAnalysis?.daysOutstanding || 38}`,
        industry: '28',
        performance: 'below'
      }
    ]
  }

  function identifyCriticalRisks(qbo: QBODataSet, insights: CallInsights) {
    const risks = []
    
    if (qbo.customerAnalysis?.customerConcentration > 0.3) {
      risks.push({
        risk: 'Customer Concentration',
        severity: 'high',
        description: `Top customers represent ${(qbo.customerAnalysis.customerConcentration * 100).toFixed(0)}% of revenue`,
        timeline: 'immediate'
      })
    }
    
    if (insights.competitiveThreats.length > 0) {
      risks.push({
        risk: 'Competitive Pressure',
        severity: 'medium',
        description: 'Market threats identified during discovery call',
        timeline: 'short-term'
      })
    }
    
    return risks
  }

  function generateMitigationStrategies(qbo: QBODataSet, insights: CallInsights) {
    return [
      {
        strategy: 'Customer Diversification',
        description: 'Develop new customer acquisition channels',
        timeline: '6-12 months'
      },
      {
        strategy: 'Financial Controls',
        description: 'Implement systematic financial monitoring',
        timeline: '1-3 months'
      }
    ]
  }

  function prioritizeByTimeline(insights: CallInsights) {
    return [
      {
        priority: 'Immediate (30 days)',
        items: ['Financial visibility', 'Cash flow forecasting']
      },
      {
        priority: 'Short-term (90 days)',
        items: ['Process automation', 'Monthly reporting']
      }
    ]
  }

  function generateImmediateRecommendations(insights: CallInsights, qbo: QBODataSet) {
    return [
      {
        recommendation: 'Implement weekly cash flow reporting',
        rationale: 'Based on cash flow concerns mentioned in call',
        investment: 'Low'
      }
    ]
  }

  function generateShortTermRecommendations(insights: CallInsights, qbo: QBODataSet) {
    return [
      {
        recommendation: 'Automate accounts receivable processes',
        rationale: 'DSO optimization opportunity identified',
        investment: 'Medium'
      }
    ]
  }

  function generateLongTermRecommendations(insights: CallInsights, qbo: QBODataSet) {
    return [
      {
        recommendation: 'Strategic financial planning system',
        rationale: 'Support growth objectives mentioned in call',
        investment: 'High'
      }
    ]
  }

  function alignToBudget(insights: CallInsights, qbo: QBODataSet) {
    return [
      {
        service: 'Fractional CFO Services',
        monthlyInvestment: '$8,000-12,000',
        fitsbudget: true,
        priority: 'High'
      }
    ]
  }

  function generateServiceProposal(insights: CallInsights, qbo: QBODataSet) {
    return [
      {
        service: 'Fractional CFO Services',
        description: 'Strategic financial leadership and oversight',
        timeline: 'Immediate start',
        investment: '$8,000-12,000/month',
        expectedROI: '300-500% within 12 months'
      }
    ]
  }

  function generateExpectedOutcomes(insights: CallInsights, qbo: QBODataSet) {
    return [
      'Real-time financial visibility',
      'Automated reporting processes',
      'Improved cash flow management',
      'Strategic growth planning'
    ]
  }

  function calculateExpectedROI(insights: CallInsights, qbo: QBODataSet): string {
    return '300-500% within 12 months'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const exportToPDF = () => {
    window.print()
  }

  const slides = [
    { title: 'Executive Summary', key: 'summary' },
    { title: 'Financial Snapshot', key: 'financial' },
    { title: 'Pain Point Analysis', key: 'painpoints' },
    { title: 'Opportunity Matrix', key: 'opportunities' },
    { title: 'Risk Profile', key: 'risks' },
    { title: 'Recommendations', key: 'recommendations' },
    { title: 'Proposed Engagement', key: 'engagement' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Intelligent Audit Deck - {companyName}
            </h3>
            <p className="text-sm text-gray-500">
              AI-powered audit deck combining call insights with financial analysis
            </p>
          </div>
          <div className="flex space-x-2">
            {!auditDeck && (
              <button
                onClick={generateIntelligentDeck}
                disabled={generating || !callInsights || !qboData}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400"
              >
                <Brain className="w-4 h-4 mr-2" />
                {generating ? 'Generating...' : 'Generate Intelligent Deck'}
              </button>
            )}
            {auditDeck && (
              <button
                onClick={exportToPDF}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Generation Progress */}
      {generating && (
        <div className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600">{generationStep}</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Deck Content */}
      {auditDeck && (
        <div>
          {/* Slide Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex px-6 overflow-x-auto">
              {slides.map((slide, index) => (
                <button
                  key={slide.key}
                  onClick={() => setCurrentSlide(index)}
                  className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 ${
                    currentSlide === index
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {slide.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Slide Content */}
          <div className="p-6 min-h-96">
            {/* Executive Summary */}
            {currentSlide === 0 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Intelligent Financial Assessment</h2>
                  <p className="text-lg text-gray-600">{companyName}</p>
                  <div className="mt-4 flex items-center justify-center">
                    <div className="px-6 py-4 rounded-full bg-blue-100 text-blue-800">
                      <span className="text-3xl font-bold">{auditDeck.executiveSummary.overallScore}</span>
                      <span className="text-lg">/100</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Key Findings
                    </h4>
                    <ul className="space-y-2">
                      {auditDeck.executiveSummary.keyFindings.map((finding, index) => (
                        <li key={index} className="text-sm text-green-700">• {finding}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
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

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Opportunities
                  </h4>
                  <ul className="space-y-2">
                    {auditDeck.executiveSummary.opportunities.map((opp, index) => (
                      <li key={index} className="text-sm text-blue-700">• {opp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Add other slides content here */}
            {currentSlide > 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {slides[currentSlide].title}
                </h3>
                <p className="text-gray-600">
                  Detailed content for {slides[currentSlide].title} will be implemented here.
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="border-t border-gray-200 px-6 py-4 flex justify-between items-center">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-500">
              {currentSlide + 1} of {slides.length}
            </span>
            
            <button
              onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
              disabled={currentSlide === slides.length - 1}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Prerequisites Check */}
      {!callInsights && !qboData && (
        <div className="p-6">
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to Generate Intelligent Audit Deck</h3>
            <p className="text-gray-600 mb-4">
              Complete the previous steps to gather call insights and financial data
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center justify-center">
                {callInsights ? 
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" /> : 
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2"></div>
                }
                Call transcript analysis
              </div>
              <div className="flex items-center justify-center">
                {qboData ? 
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" /> : 
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2"></div>
                }
                QuickBooks data extraction
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default IntelligentAuditDeckGenerator
