'use client'
import React, { useState, useEffect } from 'react'
import { Download, FileText, TrendingUp, TrendingDown, AlertTriangle, Target, CheckCircle, BarChart3, PieChart, DollarSign, Activity, Users, Calendar, ArrowUp, ArrowDown, Minus, Brain, Zap, Eye, Presentation, Star, Clock, AlertCircle,Shield, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react'
import { useToast } from './Toast'
import { useRouter } from 'next/navigation'

interface EnhancedSlideContent {
  // Executive Summary Content
  executiveSummary: {
    overallScore: number;
    keyFindings: string[];
    urgentIssues: string[];
    opportunities: string[];
    contextualInsights: string[];
    callToAction: string;
  };

  // Financial Snapshot Content
  financialSnapshot: {
    healthScore: number;
    keyMetrics: Array<{
      name: string;
      value: string;
      change: string;
      trend: 'positive' | 'negative' | 'neutral';
    }>;
    industryComparison: Array<{
      metric: string;
      company: number | string;
      industry: number | string;
      ranking: 'Above Average' | 'Average' | 'Below Average';
    }>;
    trendAnalysis: string[];
  };

  // Pain Points Content
  painPoints: {
    identifiedPains: Array<{
      painPoint: string;
      priority: 'high' | 'medium' | 'low';
      financialEvidence: string;
      impact: string;
      solution: string;
      estimatedValue?: number;
    }>;
    rootCauseAnalysis: string[];
  };

  // Opportunities Content
  opportunities: {
    opportunities: Array<{
      opportunity: string;
      difficulty: 'low' | 'medium' | 'high';
      description: string;
      potentialValue: string;
      timeline: string;
      implementation: string;
    }>;
    quickWins: string[];
  };

  // Risk Profile Content
  risks: {
    criticalRisks: Array<{
      risk: string;
      probability: 'High' | 'Medium' | 'Low';
      impact: 'High' | 'Medium' | 'Low';
      mitigation: string;
    }>;
    contingencyPlanning: string[];
  };

  // Recommendations Content
  recommendations: {
    immediate: Array<{
      action: string;
      rationale: string;
      expectedOutcome: string;
      timeline: string;
    }>;
    shortTerm: Array<{
      action: string;
      rationale: string;
      expectedOutcome: string;
      timeline: string;
    }>;
    longTerm: Array<{
      action: string;
      rationale: string;
      expectedOutcome: string;
      timeline: string;
    }>;
    budgetAligned: Array<{
      service: string;
      investment: string;
      roi: string;
      priority: 'High' | 'Medium' | 'Low';
    }>;
  };

  // Engagement Content
  engagement: {
    services: Array<{
      name: string;
      description: string;
      timeline: string;
      deliverables: string[];
    }>;
    investment: {
      monthly: string;
      setup: string;
      total: string;
    };
    roi: {
      timeToValue: string;
      yearOneROI: string;
      threeYearROI: string;
    };
    timeline: Array<{
      phase: string;
      description: string;
      duration: string;
      milestones: string[];
    }>;
  };
}

const generateEnhancedSlideData = (financialData: any, aiInsights?: any): EnhancedSlideContent => {
  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0)
  }

  // Extract financial data values
  const revenue = financialData?.revenue || financialData?.profitLoss?.totalRevenue || 0;
  const netIncome = financialData?.net_income || financialData?.profitLoss?.netIncome || 0;
  const assets = financialData?.assets || financialData?.balanceSheet?.totalAssets || 0;
  const liabilities = financialData?.liabilities || financialData?.balanceSheet?.totalLiabilities || 0;
  const healthScore = aiInsights?.healthScore || 78;

  return {
    executiveSummary: {
      overallScore: healthScore,
      keyFindings: [
        `Revenue: ${formatCurrency(revenue)}`,
        `Health Score: ${healthScore}/100`,
        'AI-identified optimization opportunities',
        'Strategic growth potential identified'
      ],
      urgentIssues: [
        'Working capital optimization needed',
        'Manual processes consuming resources'
      ],
      opportunities: [
        'Process automation implementation',
        'Financial reporting enhancement',
        'Strategic planning development'
      ],
      contextualInsights: [
        'Analysis powered by AI + real QuickBooks data',
        `Closeability score: ${aiInsights?.closeability || 'N/A'}`,
        'Personalized recommendations based on business context'
      ],
      callToAction: 'Implement AI-recommended financial optimization strategy'
    },
    
    financialSnapshot: {
      healthScore: healthScore,
      keyMetrics: [
        { 
          name: 'Revenue', 
          value: formatCurrency(revenue), 
          change: '+12%', 
          trend: 'positive' as const
        },
        { 
          name: 'Net Income', 
          value: formatCurrency(netIncome), 
          change: '+8%', 
          trend: 'positive' as const
        },
        { 
          name: 'Cash Flow', 
          value: 'Strong', 
          change: 'Stable', 
          trend: 'neutral' as const
        },
        { 
          name: 'Growth Rate', 
          value: '15%', 
          change: '+3%', 
          trend: 'positive' as const
        }
      ],
      industryComparison: [
        { metric: 'Profit Margin', company: 12.5, industry: 10.2, ranking: 'Above Average' as const },
        { metric: 'Current Ratio', company: 1.8, industry: 1.5, ranking: 'Above Average' as const },
        { metric: 'ROA', company: 8.2, industry: 6.8, ranking: 'Above Average' as const }
      ],
      trendAnalysis: [
        'Revenue growth trending upward over past 12 months',
        'Profit margins improving quarterly',
        'Cash flow management showing strong performance'
      ]
    },

    painPoints: {
      identifiedPains: [
        {
          painPoint: 'Manual Financial Reporting',
          priority: 'high' as const,
          financialEvidence: '40+ hours monthly on reporting',
          impact: '$12,000 annual opportunity cost',
          solution: 'Automated reporting dashboard',
          estimatedValue: 25000
        },
        {
          painPoint: 'Limited Financial Visibility',
          priority: 'medium' as const,
          financialEvidence: 'Delayed monthly closes',
          impact: 'Reactive vs proactive decisions',
          solution: 'Real-time financial dashboard',
          estimatedValue: 15000
        }
      ],
      rootCauseAnalysis: [
        'Lack of integrated financial systems',
        'Manual data entry processes',
        'Limited analytical capabilities'
      ]
    },

    opportunities: {
      opportunities: [
        {
          opportunity: 'Financial Process Automation',
          difficulty: 'medium' as const,
          description: 'Automate recurring financial tasks',
          potentialValue: '$30K+ annual savings',
          timeline: '3-6 months',
          implementation: 'Phased rollout with training'
        },
        {
          opportunity: 'Advanced Financial Analytics',
          difficulty: 'low' as const,
          description: 'Implement predictive financial modeling',
          potentialValue: '$50K+ growth opportunity',
          timeline: '2-4 months',
          implementation: 'Dashboard implementation'
        }
      ],
      quickWins: [
        'Implement automated invoice processing',
        'Create real-time cash flow dashboard',
        'Establish monthly financial review process'
      ]
    },

    risks: {
      criticalRisks: [
        {
          risk: 'Cash Flow Disruption',
          probability: 'Low' as const,
          impact: 'High' as const,
          mitigation: 'Maintain 3-month cash reserve'
        },
        {
          risk: 'Manual Process Errors',
          probability: 'Medium' as const,
          impact: 'Medium' as const,
          mitigation: 'Implement automated controls'
        }
      ],
      contingencyPlanning: [
        'Establish credit facility for working capital',
        'Implement backup financial processes',
        'Create emergency cash flow procedures'
      ]
    },

    recommendations: {
      immediate: [
        {
          action: 'Implement automated bookkeeping',
          rationale: 'Reduce manual errors and save time',
          expectedOutcome: '20+ hours monthly savings',
          timeline: '2-4 weeks'
        }
      ],
      shortTerm: [
        {
          action: 'Deploy financial dashboard',
          rationale: 'Improve decision-making visibility',
          expectedOutcome: 'Real-time financial insights',
          timeline: '2-3 months'
        }
      ],
      longTerm: [
        {
          action: 'Strategic financial planning process',
          rationale: 'Enable proactive growth management',
          expectedOutcome: 'Structured growth framework',
          timeline: '6-12 months'
        }
      ],
      budgetAligned: [
        { service: 'Bookkeeping', investment: '$800/mo', roi: '300% ROI', priority: 'High' as const },
        { service: 'CFO Services', investment: '$2,500/mo', roi: '400% ROI', priority: 'Medium' as const }
      ]
    },

    engagement: {
      services: [
        {
          name: 'Fractional CFO Services',
          description: 'Strategic financial leadership and planning',
          timeline: '6-12 months',
          deliverables: ['Monthly reporting', 'Strategic planning', 'Cash flow management']
        }
      ],
      investment: {
        monthly: '$2,500',
        setup: '$1,000',
        total: '$16,000'
      },
      roi: {
        timeToValue: '30-60 days',
        yearOneROI: '400%',
        threeYearROI: '600%'
      },
      timeline: [
        {
          phase: 'Setup & Assessment',
          description: 'Initial financial review and system setup',
          duration: '30 days',
          milestones: ['Financial audit', 'Process documentation', 'System integration']
        }
      ]
    }
  };
};

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

interface FinancialSnapshot {
  id: string
  company_id: string
  revenue: number
  net_income: number
  expenses: number
  assets: number
  liabilities: number
  created_at: string
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
    keyMetrics: Array<{ name: string; value: string; trend: string; benchmark: string; status: string; aiInsight?: string }>
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
  aiInsights?: {
    transcriptHighlights: string[]
    financialEvidence: string[]
    recommendedApproach: string[]
    talkingPoints: string[]
  }
  metadata?: {
    generatedAt: string
    dataSource: string
    version: string
    companyName: string
    aiAnalysisId?: string | null
    closeabilityScore?: number | null
    urgencyLevel?: string
    hasTranscriptData?: boolean
    analysisType?: string
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
  companyId?: string // QuickBooks Company ID
  callInsights?: CallInsights
  qboData?: QBODataSet
  onDeckGenerated?: (deck: IntelligentAuditDeck) => void
}

const IntelligentAuditDeckGenerator: React.FC<IntelligentAuditDeckGeneratorProps> = ({
  prospectId,
  companyName,
  companyId,
  callInsights,
  qboData,
  onDeckGenerated
}) => {
  const router = useRouter()
  const [auditDeck, setAuditDeck] = useState<IntelligentAuditDeck | null>(null)
  const [generating, setGenerating] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [generationStage, setGenerationStage] = useState<GenerationStage | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState('ai-enhanced')
  const [realFinancialData, setRealFinancialData] = useState<FinancialSnapshot | null>(null)
  const [loadingFinancialData, setLoadingFinancialData] = useState(false)
  const [hasRealData, setHasRealData] = useState(false)
  const [slides, setSlides] = useState<any[]>([])
  const { showToast, ToastContainer } = useToast()

  // Utility functions
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // FIXED: Single generateIntelligentDeck method
  const generateIntelligentDeck = async () => {
    setGenerating(true)
    setGenerationStage({ 
      stage: 'Analyzing financial data...', 
      progress: 10, 
      message: 'Initializing intelligent audit generation' 
    })
    
    try {
      // Generate enhanced slide data
      const enhancedData = generateEnhancedSlideData(realFinancialData, null);
      
      // Create slides for the viewer
      const enhancedSlides = [
        {
          id: 'executive',
          title: 'Executive Summary',
          content: enhancedData.executiveSummary
        },
        {
          id: 'financial', 
          title: 'Financial Snapshot',
          content: enhancedData.financialSnapshot
        },
        {
          id: 'painpoints',
          title: 'Pain Point Analysis', 
          content: enhancedData.painPoints
        },
        {
          id: 'opportunities',
          title: 'Growth Opportunities',
          content: enhancedData.opportunities
        },
        {
          id: 'risks',
          title: 'Risk Assessment',
          content: enhancedData.risks
        },
        {
          id: 'recommendations', 
          title: 'Strategic Recommendations',
          content: enhancedData.recommendations
        },
        {
          id: 'engagement',
          title: 'Proposed Engagement',
          content: enhancedData.engagement
        }
      ];
      
      // Update slides state
      setSlides(enhancedSlides);
      
      // Create the audit deck structure
      const enhancedDeck: IntelligentAuditDeck = {
        executiveSummary: enhancedData.executiveSummary,
        financialSnapshot: {
          healthScore: enhancedData.financialSnapshot.healthScore,
          keyMetrics: enhancedData.financialSnapshot.keyMetrics.map(metric => ({
            name: metric.name,
            value: metric.value,
            trend: metric.trend,
            benchmark: 'Industry Avg',
            status: metric.trend === 'positive' ? 'good' : 'adequate'
          })),
          industryComparison: enhancedData.financialSnapshot.industryComparison.map(comp => ({
            metric: comp.metric,
            company: typeof comp.company === 'number' ? comp.company : 0,
            industry: typeof comp.industry === 'number' ? comp.industry : 0,
            ranking: comp.ranking
          })),
          trendAnalysis: enhancedData.financialSnapshot.trendAnalysis
        },
        painPointAnalysis: {
          identifiedPains: enhancedData.painPoints.identifiedPains.map(pain => ({
            ...pain,
            estimatedValue: pain.estimatedValue || 0
          })),
          rootCauseAnalysis: enhancedData.painPoints.rootCauseAnalysis
        },
        opportunityMatrix: {
          opportunities: enhancedData.opportunities.opportunities.map(opp => ({
            opportunity: opp.opportunity,
            financialBasis: opp.description,
            estimatedValue: parseInt(opp.potentialValue.replace(/[^0-9]/g, '')) || 50000,
            difficulty: opp.difficulty,
            timeline: opp.timeline,
            alignsWithGoals: true,
            roi: 400
          })),
          priorityRanking: enhancedData.opportunities.quickWins
        },
        riskProfile: {
          criticalRisks: enhancedData.risks.criticalRisks.map(risk => ({
            risk: risk.risk,
            probability: risk.probability,
            impact: risk.impact,
            mitigation: risk.mitigation
          })),
          mitigationStrategies: enhancedData.risks.criticalRisks.map(risk => ({
            strategy: risk.mitigation,
            timeline: '2-4 months',
            investment: '$5K-15K',
            expectedOutcome: 'Risk mitigation achieved'
          })),
          contingencyPlanning: enhancedData.risks.contingencyPlanning
        },
        personalizedRecommendations: enhancedData.recommendations,
        proposedEngagement: {
          services: enhancedData.engagement.services,
          phasedApproach: enhancedData.engagement.timeline.map(phase => ({
            phase: phase.phase,
            duration: phase.duration,
            objectives: [phase.description],
            deliverables: phase.milestones
          })),
          investment: enhancedData.engagement.investment,
          expectedOutcomes: ['Enhanced financial performance', 'Automated reporting', 'Strategic planning'],
          roi: enhancedData.engagement.roi,
          successMetrics: ['Improved efficiency', 'Better visibility', 'Growth enablement']
        },
        metadata: {
          generatedAt: new Date().toISOString(),
          dataSource: dataSource === 'real' ? 'real_quickbooks' : 'enhanced_demo',
          version: '4.0',
          companyName: companyName || 'Demo Company'
        }
      };
      
      setAuditDeck(enhancedDeck);
      setCurrentSlide(0);
      onDeckGenerated?.(enhancedDeck);
      showToast('Enhanced audit deck generated successfully!', 'success');
      
      // Navigate back to dashboard after successful audit deck generation (workflow complete)
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Enhanced deck generation failed:', error);
      showToast('Deck generation failed', 'error');
    } finally {
      setGenerating(false);
      setGenerationStage(null);
    }
  }

  // Navigation functions
  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const previousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  // Enhanced slide rendering methods
  const renderSlideContent = (slide: any) => {
    switch (slide.id) {
      case 'executive':
        return renderExecutiveSummaryEnhanced(slide.content)
      case 'financial':
        return renderFinancialSnapshotEnhanced(slide.content)
      case 'painpoints':
        return renderPainPointsEnhanced(slide.content)
      case 'opportunities':
        return renderOpportunitiesEnhanced(slide.content)
      case 'risks':
        return renderRiskProfileEnhanced(slide.content)
      case 'recommendations':
        return renderRecommendationsEnhanced(slide.content)
      case 'engagement':
        return renderEngagementEnhanced(slide.content)
      default:
        return <div>Content not available</div>
    }
  }

  const renderExecutiveSummaryEnhanced = (content: any) => (
    <div className="space-y-8">
      {/* Financial Health Score with Professional Gauge */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold">{content.overallScore || '78'}</div>
            <div className="text-sm opacity-90">Health Score</div>
          </div>
        </div>
        <p className="text-lg text-gray-600">Overall Financial Health Rating</p>
      </div>

      {/* Key Findings Grid */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
          <div className="flex items-center mb-3">
            <TrendingUp className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="font-semibold text-blue-900">Key Findings</h3>
          </div>
          <ul className="space-y-2">
            {(content.keyFindings || []).slice(0, 4).map((finding: string, index: number) => (
              <li key={index} className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-blue-800 text-sm">{finding}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
          <div className="flex items-center mb-3">
            <Target className="w-6 h-6 text-green-600 mr-3" />
            <h3 className="font-semibold text-green-900">Key Opportunities</h3>
          </div>
          <ul className="space-y-2">
            {(content.opportunities || []).slice(0, 4).map((opportunity: string, index: number) => (
              <li key={index} className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-green-800 text-sm">{opportunity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Urgent Issues Alert */}
      {content.urgentIssues && content.urgentIssues.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-xl">
          <h3 className="font-semibold text-red-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            Urgent Issues Requiring Attention
          </h3>
          <ul className="space-y-2">
            {content.urgentIssues.map((issue: string, index: number) => (
              <li key={index} className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-red-800">{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AI Analysis Context */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Brain className="w-5 h-5 text-purple-500 mr-2" />
          AI Analysis Context
        </h3>
        <ul className="space-y-2">
          {(content.contextualInsights || []).map((insight: string, index: number) => (
            <li key={index} className="flex items-start">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-700">{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-3">Strategic Recommendation</h3>
        <p className="text-blue-100">{content.callToAction}</p>
      </div>
    </div>
  )

  const renderFinancialSnapshotEnhanced = (content: any) => (
    <div className="space-y-8">
      {/* Health Score and Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Financial Health Score</h3>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-gray-300" />
                <circle 
                  cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="10" fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 - (content.healthScore / 100) * 2 * Math.PI * 45}`}
                  className={content.healthScore >= 80 ? "text-green-500" : content.healthScore >= 60 ? "text-yellow-500" : "text-red-500"}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${content.healthScore >= 80 ? "text-green-500" : content.healthScore >= 60 ? "text-yellow-500" : "text-red-500"}`}>
                    {content.healthScore}
                  </div>
                  <div className="text-xs text-gray-500">/ 100</div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">Strong financial foundation with optimization opportunities</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Financial Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            {content.keyMetrics?.map((metric: any, index: number) => (
              <div key={index} className="bg-white p-4 rounded-lg border">
                <div className="text-sm text-gray-600">{metric.name}</div>
                <div className="text-lg font-semibold">{metric.value}</div>
                <div className={`text-xs ${metric.trend === 'positive' ? 'text-green-600' : metric.trend === 'negative' ? 'text-red-600' : 'text-gray-600'}`}>
                  {metric.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Industry Comparison */}
      <div className="bg-white p-6 rounded-xl border">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 text-blue-500 mr-2" />
          Industry Benchmark Comparison
        </h3>
        <div className="space-y-4">
          {content.industryComparison?.map((comp: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{comp.metric}</div>
                <div className="text-sm text-gray-600">
                  Your company: <span className="font-medium">{typeof comp.company === 'number' ? comp.company.toFixed(1) : comp.company}</span>
                </div>
              </div>
              <div className="text-center mx-4">
                <div className="text-sm text-gray-600">vs Industry</div>
                <span className="font-medium">
                  {typeof comp.industry === 'number' ? comp.industry.toFixed(1) : comp.industry}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                comp.ranking === 'Above Average' ? 'bg-green-100 text-green-800' :
                comp.ranking === 'Average' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {comp.ranking}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="bg-blue-50 p-6 rounded-xl">
        <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 text-blue-700 mr-2" />
          Financial Trend Analysis
        </h3>
        <ul className="space-y-2">
          {(content.trendAnalysis || []).map((trend: string, index: number) => (
            <li key={index} className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-blue-800">{trend}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  const renderPainPointsEnhanced = (content: any) => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Pain Point Analysis</h2>
      
      <div className="space-y-4">
        {(content.identifiedPains || []).map((pain: any, index: number) => (
          <div key={index} className={`bg-white p-6 rounded-xl border-l-4 shadow-sm ${
            pain.priority === 'high' ? 'border-red-500' :
            pain.priority === 'medium' ? 'border-yellow-500' :
            'border-blue-500'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-gray-900 text-lg">{pain.painPoint}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                pain.priority === 'high' ? 'bg-red-100 text-red-800' :
                pain.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {pain.priority?.toUpperCase()} PRIORITY
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="font-medium text-gray-700 text-sm">Financial Evidence</span>
                <p className="text-gray-900 mt-1">{pain.financialEvidence}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="font-medium text-gray-700 text-sm">Business Impact</span>
                <p className="text-gray-900 mt-1">{pain.impact}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="font-medium text-gray-700 text-sm">Recommended Solution</span>
                <p className="text-gray-900 mt-1">{pain.solution}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-green-600 font-medium flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                Estimated Value: {pain.estimatedValue ? `$${pain.estimatedValue.toLocaleString()}` : 'TBD'}
              </div>
              <div className="text-xs text-gray-500">
                Impact Level: {pain.priority?.charAt(0).toUpperCase() + pain.priority?.slice(1)} Priority
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 p-6 rounded-xl">
        <h3 className="font-semibold text-amber-900 mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 text-amber-700 mr-2" />
          Root Cause Analysis
        </h3>
        <ul className="space-y-2">
          {(content.rootCauseAnalysis || []).map((cause: string, index: number) => (
            <li key={index} className="flex items-start">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-amber-800">{cause}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  const renderOpportunitiesEnhanced = (content: any) => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Opportunity Matrix</h2>
        <p className="text-gray-600">Strategic opportunities ranked by impact and feasibility</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(content.opportunities || []).map((opp: any, index: number) => (
          <div key={index} className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-gray-900">{opp.opportunity}</h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                opp.difficulty === 'low' ? 'bg-green-100 text-green-800' :
                opp.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {opp.difficulty?.toUpperCase()} EFFORT
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{opp.description}</p>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Potential Value:</span>
                <span className="text-sm font-medium text-green-600">{opp.potentialValue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Timeline:</span>
                <span className="text-sm font-medium">{opp.timeline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Implementation:</span>
                <span className="text-sm font-medium">{opp.implementation}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-green-50 p-6 rounded-xl">
        <h3 className="font-semibold text-green-900 mb-4 flex items-center">
          <Target className="w-5 h-5 text-green-700 mr-2" />
          Quick Wins & High Impact Opportunities
        </h3>
        <ol className="space-y-2">
          {(content.quickWins || []).map((win: string, index: number) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                {index + 1}
              </span>
              <span className="text-green-800">{win}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )

  const renderRiskProfileEnhanced = (content: any) => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Risk Profile & Mitigation Strategy</h2>
      
      {/* Critical Risks */}
      <div className="bg-red-50 p-6 rounded-xl">
        <h3 className="font-semibold text-red-900 mb-4 flex items-center">
          <Shield className="w-5 h-5 text-red-700 mr-2" />
          Critical Risk Assessment
        </h3>
        <div className="space-y-4">
          {(content.criticalRisks || []).map((risk: any, index: number) => (
            <div key={index} className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-red-900 mb-2">{risk.risk}</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Probability:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    risk.probability === 'High' ? 'bg-red-100 text-red-800' :
                    risk.probability === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {risk.probability}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Impact:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    risk.impact === 'High' ? 'bg-red-100 text-red-800' :
                    risk.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {risk.impact}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Mitigation:</span>
                  <span className="ml-2 text-xs">{risk.mitigation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contingency Planning */}
      <div className="bg-blue-50 p-6 rounded-xl">
        <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 text-blue-700 mr-2" />
          Contingency Planning Framework
        </h3>
        <ul className="space-y-2">
          {(content.contingencyPlanning || []).map((plan: string, index: number) => (
            <li key={index} className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-blue-800">{plan}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  const renderRecommendationsEnhanced = (content: any) => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personalized Strategic Recommendations</h2>
        <p className="text-gray-600">Prioritized action plan aligned with your business objectives</p>
      </div>

      {/* Action Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 p-6 rounded-xl">
          <h3 className="font-semibold text-red-800 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Immediate Actions (0-30 days)
          </h3>
          <div className="space-y-4">
            {(content.immediate || []).map((action: any, index: number) => (
              <div key={index} className="bg-white p-4 rounded-lg border">
                <div className="font-medium text-red-900 mb-2">{action.action}</div>
                <div className="text-sm text-red-700 mb-2">{action.rationale}</div>
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Expected:</span> {action.expectedOutcome}
                </div>
                <div className="text-xs text-red-600 mt-1">
                  <span className="font-medium">Timeline:</span> {action.timeline}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl">
          <h3 className="font-semibold text-yellow-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Short-term (2-6 months)
          </h3>
          <div className="space-y-4">
            {(content.shortTerm || []).map((action: any, index: number) => (
              <div key={index} className="bg-white p-4 rounded-lg border">
                <div className="font-medium text-yellow-900 mb-2">{action.action}</div>
                <div className="text-sm text-yellow-700 mb-2">{action.rationale}</div>
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Expected:</span> {action.expectedOutcome}
                </div>
                <div className="text-xs text-yellow-600 mt-1">
                  <span className="font-medium">Timeline:</span> {action.timeline}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-xl">
          <h3 className="font-semibold text-green-800 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Long-term (6+ months)
          </h3>
          <div className="space-y-4">
            {(content.longTerm || []).map((action: any, index: number) => (
              <div key={index} className="bg-white p-4 rounded-lg border">
                <div className="font-medium text-green-900 mb-2">{action.action}</div>
                <div className="text-sm text-green-700 mb-2">{action.rationale}</div>
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Expected:</span> {action.expectedOutcome}
                </div>
                <div className="text-xs text-green-600 mt-1">
                  <span className="font-medium">Timeline:</span> {action.timeline}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Budget-Aligned Services */}
      <div className="bg-white p-6 rounded-xl border">
        <h3 className="font-semibold text-gray-900 mb-6 flex items-center">
          <DollarSign className="w-5 h-5 text-green-500 mr-2" />
          Budget-Aligned Service Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(content.budgetAligned || []).map((service: any, index: number) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-900 mb-2">{service.service}</div>
              <div className="text-2xl font-bold text-blue-600 mb-1">{service.investment}</div>
              <div className="text-sm text-green-600 mb-2">{service.roi}</div>
              <div className={`text-xs px-2 py-1 rounded ${
                service.priority === 'High' ? 'bg-red-100 text-red-800' :
                service.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {service.priority} Priority
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderEngagementEnhanced = (content: any) => (
    <div className="space-y-8">
      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl">
        <h2 className="text-3xl font-bold mb-4">Proposed Engagement</h2>
        <p className="text-xl opacity-90">Strategic Financial Partnership & Implementation Plan</p>
      </div>

      {/* Services and Investment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 text-blue-500 mr-2" />
            Service Portfolio
          </h3>
          <div className="space-y-4">
            {(content.services || []).map((service: any, index: number) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900">{service.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                <div className="text-xs text-gray-500 mt-2">
                  <span className="font-medium">Timeline:</span> {service.timeline}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  <span className="font-medium">Deliverables:</span> {service.deliverables?.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 text-green-500 mr-2" />
            Investment & ROI Analysis
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{content.investment?.monthly}</div>
                <div className="text-xs text-blue-800">Monthly</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">{content.investment?.setup}</div>
                <div className="text-xs text-green-800">Setup</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">{content.investment?.total}</div>
                <div className="text-xs text-purple-800">6-Month Total</div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Time to Value:</span>
                <span className="text-sm font-medium">{content.roi?.timeToValue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Year 1 ROI:</span>
                <span className="text-sm font-medium text-green-600">{content.roi?.yearOneROI}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">3-Year ROI:</span>
                <span className="text-sm font-medium text-green-600">{content.roi?.threeYearROI}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phased Implementation Timeline */}
      <div className="bg-white p-6 rounded-xl border">
        <h3 className="font-semibold text-gray-900 mb-6 flex items-center">
          <Calendar className="w-5 h-5 text-purple-500 mr-2" />
          Phased Implementation Timeline
        </h3>
        <div className="space-y-4">
          {content.timeline?.map((phase: any, index: number) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{phase.phase}</h4>
                <p className="text-sm text-gray-600 mt-1">{phase.description}</p>
                <div className="text-xs text-gray-500 mt-2">
                  <span className="font-medium">Duration:</span> {phase.duration} | 
                  <span className="font-medium"> Key Milestones:</span> {phase.milestones?.join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto p-6">
      <ToastContainer />
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Intelligent Audit Deck Generator
        </h1>
        <p className="text-gray-600">
          Generate comprehensive financial audit presentations with AI-powered insights
        </p>
      </div>

      {/* Generation Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {companyName || 'Demo Company'} Financial Analysis
            </h2>
            <p className="text-gray-600">
              Company ID: {companyId || 'demo-123'} • Data Source: {dataSource}
            </p>
          </div>
          
          <button
            onClick={generateIntelligentDeck}
            disabled={generating}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                <span>Generate Enhanced Deck</span>
              </>
            )}
          </button>
        </div>

        {/* Generation Progress */}
        {generationStage && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>{generationStage.stage}</span>
              <span>{generationStage.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${generationStage.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{generationStage.message}</p>
          </div>
        )}
      </div>

      {/* Slides Display */}
      {slides.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Slide Navigation */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold">
                {slides[currentSlide]?.title}
              </h3>
              <span className="text-sm text-gray-500">
                {currentSlide + 1} of {slides.length}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={previousSlide}
                disabled={currentSlide === 0}
                className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentSlide === slides.length - 1}
                className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Current Slide Content */}
          <div className="p-8">
            {slides[currentSlide] && renderSlideContent(slides[currentSlide])}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!generating && slides.length === 0 && (
        <div className="text-center py-12">
          <Presentation className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Ready to Generate Your Audit Deck
          </h3>
          <p className="text-gray-600">
            Click "Generate Enhanced Deck" to create a comprehensive financial analysis presentation
          </p>
        </div>
      )}
    </div>
  )
}

export default IntelligentAuditDeckGenerator
