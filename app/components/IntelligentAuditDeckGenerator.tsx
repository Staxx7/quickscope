'use client'
import React, { useState, useEffect } from 'react'
import { Download, FileText, TrendingUp, TrendingDown, AlertTriangle, Target, CheckCircle, BarChart3, PieChart, DollarSign, Activity, Users, Calendar, ArrowUp, ArrowDown, Minus, Brain, Zap, Eye, Presentation, Star, Clock, Shield, MessageSquare } from 'lucide-react'
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
  const [auditDeck, setAuditDeck] = useState<IntelligentAuditDeck | null>(null)
  const [generating, setGenerating] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [generationStage, setGenerationStage] = useState<GenerationStage | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState('ai-enhanced')
  const [realFinancialData, setRealFinancialData] = useState<FinancialSnapshot | null>(null)
  const [loadingFinancialData, setLoadingFinancialData] = useState(false)
  const [dataSource, setDataSource] = useState<'real' | 'mock' | 'ai_enhanced'>('mock')
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

  // AI-Enhanced Deck Generation
  const generateAIEnhancedDeck = async () => {
    if (!companyId && !prospectId) {
      showToast('Company ID or Prospect ID required for AI analysis', 'error');
      return;
    }

    setGenerating(true);
    setGenerationStage({ 
      stage: 'Initializing AI-enhanced analysis...', 
      progress: 5, 
      message: 'Connecting to AI intelligence pipeline' 
    });

    try {
      // Step 1: Get enhanced financial data
      setGenerationStage({ 
        stage: 'Fetching comprehensive financial data...', 
        progress: 15, 
        message: 'Retrieving QuickBooks financial intelligence' 
      });

      let enhancedFinancialData = null;
      if (companyId) {
        try {
          const financialResponse = await fetch(`/api/qbo/enhanced-financials?companyId=${companyId}`);
          if (financialResponse.ok) {
            enhancedFinancialData = await financialResponse.json();
          }
        } catch (error) {
          console.log('Enhanced financial data not available, using existing data');
        }
      }

      // Step 2: Get existing transcript analysis if available
      setGenerationStage({ 
        stage: 'Analyzing call transcripts...', 
        progress: 30, 
        message: 'Processing sales intelligence from discovery calls' 
      });

      let transcriptData = null;
      try {
        const transcriptResponse = await fetch(`/api/ai/process-transcript?prospectId=${prospectId}`);
        if (transcriptResponse.ok) {
          const transcriptResult = await transcriptResponse.json();
          transcriptData = transcriptResult.analyses?.[0]; // Get most recent analysis
        }
      } catch (error) {
        console.log('No transcript data available, proceeding with financial analysis only');
      }

      // Step 3: Run comprehensive AI analysis
      setGenerationStage({ 
        stage: 'Generating AI business insights...', 
        progress: 50, 
        message: 'AI combining financial data with sales intelligence' 
      });

      const aiAnalysisResponse = await fetch('/api/ai/analyze-prospect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prospectId: prospectId || `temp-${Date.now()}`,
          transcriptText: transcriptData?.transcript_text || '',
          financialData: enhancedFinancialData || (realFinancialData ? convertToEnhancedFormat(realFinancialData) : null),
          companyInfo: {
            name: companyName,
            industry: enhancedFinancialData?.companyInfo?.industry || 'Business Services',
            yearEstablished: enhancedFinancialData?.companyInfo?.yearEstablished || new Date().getFullYear() - 5
          },
          analysisType: transcriptData ? 'comprehensive' : 'financial-only'
        })
      });

      if (!aiAnalysisResponse.ok) {
        throw new Error('AI analysis failed');
      }

      const aiResults = await aiAnalysisResponse.json();

      // Step 4: Generate AI-enhanced audit deck
      setGenerationStage({ 
        stage: 'Creating intelligent audit presentation...', 
        progress: 75, 
        message: 'Building AI-powered audit deck with personalized insights' 
      });

      const aiEnhancedDeck = generateAIEnhancedAuditDeck(
        aiResults.results, 
        enhancedFinancialData || realFinancialData,
        transcriptData
      );

      setGenerationStage({ 
        stage: 'AI analysis complete!', 
        progress: 100, 
        message: 'Intelligent audit deck ready with AI-powered insights and talking points' 
      });

      setAuditDeck(aiEnhancedDeck);
      setDataSource('ai_enhanced');
      onDeckGenerated?.(aiEnhancedDeck);
      
      showToast('AI-enhanced audit deck generated successfully!', 'success');

    } catch (error: unknown) {
      console.error('AI-enhanced generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      showToast(`AI analysis failed: ${errorMessage}. Falling back to standard generation.`, 'warning');
      
      // Fall back to your existing generation method
      await generateIntelligentDeck();
    } finally {
      setGenerating(false);
      setTimeout(() => setGenerationStage(null), 2000);
    }
  };

  const generateAIEnhancedAuditDeck = (
    aiResults: any, 
    financialData: any, 
    transcriptData?: any
  ): IntelligentAuditDeck => {
    const { transcriptAnalysis, financialIntelligence, businessInsights, auditDeckIntelligence } = aiResults;
    const revenue = financialData?.profitLoss?.totalRevenue || financialData?.revenue || 0;
    const netIncome = financialData?.profitLoss?.netIncome || financialData?.net_income || 0;
    
    return {
      executiveSummary: {
        overallScore: financialIntelligence?.healthScore || 75,
        keyFindings: businessInsights?.keyFindings || [
          `AI analysis reveals revenue of ${formatCurrency(revenue)}`,
          `Financial health score: ${financialIntelligence?.healthScore || 75}/100`,
          'AI-identified optimization opportunities worth significant ROI',
          transcriptData ? 'Discovery call insights integrated into analysis' : 'Comprehensive financial data analysis completed'
        ],
        urgentIssues: businessInsights?.riskAssessment || [
          'Financial infrastructure gaps limiting growth potential',
          'Manual processes consuming valuable time and resources'
        ],
        opportunities: businessInsights?.growthOpportunities || [
          'Process automation implementation',
          'Working capital optimization',
          'Strategic financial planning enhancement'
        ],
        contextualInsights: [
          `Analysis powered by AI combining ${transcriptData ? 'call transcript insights + ' : ''}real QuickBooks data`,
          `Closeability score: ${transcriptAnalysis?.salesIntelligence?.closeability || 'N/A'}${transcriptAnalysis?.salesIntelligence?.closeability ? '/100' : ''}`,
          `Urgency level: ${transcriptAnalysis?.urgencySignals?.timeline || 'Standard business timeline'}`,
          'Personalized recommendations based on AI analysis of business context'
        ],
        callToAction: businessInsights?.executiveSummary || 
          'Implement AI-recommended financial optimization strategy to enhance operational efficiency and accelerate growth'
      },
      financialSnapshot: {
        healthScore: financialIntelligence?.healthScore || 75,
        keyMetrics: generateAIEnhancedMetrics(financialData, financialIntelligence),
        industryComparison: financialIntelligence?.industryBenchmarks ? 
          Object.entries(financialIntelligence.industryBenchmarks).map(([metric, data]: [string, any]) => ({
            metric: metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
            company: data.company,
            industry: data.industry,
            ranking: data.percentile > 70 ? 'Above Average' : data.percentile > 30 ? 'Average' : 'Below Average'
          })) : [
            { metric: 'Revenue Growth', company: 15.0, industry: 12.5, ranking: 'Above Average' },
            { metric: 'Net Margin', company: 18.0, industry: 15.0, ranking: 'Above Average' }
          ],
        trendAnalysis: [
          `AI analysis indicates ${revenue > 1000000 ? 'strong' : 'moderate'} revenue foundation`,
          'Financial infrastructure optimization opportunities identified',
          transcriptData ? 'Sales intelligence integrated for comprehensive assessment' : 'Comprehensive financial data analysis completed'
        ]
      },
      painPointAnalysis: {
        identifiedPains: generateAIPainPointAnalysis(transcriptAnalysis, financialData).map(pain => ({
          ...pain,
          priority: (pain.priority.toLowerCase() === 'high' ? 'high' : 
                    pain.priority.toLowerCase() === 'medium' ? 'medium' : 'low') as 'high' | 'medium' | 'low'
        })),
        rootCauseAnalysis: businessInsights?.riskAssessment || [
          'AI analysis reveals operational scaling challenges',
          'Limited financial infrastructure relative to business complexity',
          'Manual processes creating inefficiencies and growth bottlenecks'
        ]
      },
      opportunityMatrix: {
        opportunities: generateAIOpportunityMatrix(financialIntelligence, businessInsights, financialData),
        priorityRanking: auditDeckIntelligence?.slideRecommendations?.map((slide: { title: string }) => slide.title) || [
          'Immediate: Financial process automation (High impact, medium effort)',
          'Short-term: Working capital optimization (Medium impact, low effort)',
          'Long-term: Strategic financial planning (High impact, high effort)'
        ]
      },
      riskProfile: {
        criticalRisks: (financialIntelligence?.riskFactors || []).map((risk: any) => ({
          risk: risk.risk || risk,
          probability: risk.likelihood ? `${risk.likelihood}%` : 'Medium',
          impact: risk.severity || 'Medium',
          mitigation: risk.mitigation || 'Strategic optimization recommended'
        })),
        mitigationStrategies: [
          { 
            strategy: 'AI-recommended financial infrastructure enhancement', 
            timeline: '3-6 months', 
            investment: '$15K-25K setup', 
            expectedOutcome: 'Automated reporting and real-time visibility' 
          }
        ],
        contingencyPlanning: businessInsights?.strategicRecommendations || [
          'Establish AI-powered financial monitoring systems',
          'Implement scenario-based planning and stress testing',
          'Create operational flexibility for market adaptation'
        ]
      },
      personalizedRecommendations: {
        immediate: (businessInsights?.urgentActions || []).map((action: string) => ({
          action,
          rationale: 'AI analysis indicates high-priority intervention needed',
          expectedOutcome: 'Measurable improvement in operational efficiency',
          timeline: '2-4 weeks'
        })),
        shortTerm: (businessInsights?.strategicRecommendations || []).slice(0, 3).map((rec: string) => ({
          action: rec,
          rationale: 'AI-identified opportunity with strong ROI potential',
          expectedOutcome: 'Enhanced financial performance and visibility',
          timeline: '2-3 months'
        })),
        longTerm: [
          {
            action: 'Implement comprehensive AI-powered financial intelligence system',
            rationale: 'Long-term competitive advantage through advanced analytics',
            expectedOutcome: 'Industry-leading financial performance and scalability',
            timeline: '6-12 months'
          }
        ],
        budgetAligned: transcriptAnalysis?.urgencySignals?.budget ? [
          { 
            service: 'AI-Enhanced Fractional CFO Services', 
            investment: transcriptAnalysis.urgencySignals.budget,
            roi: '350-450% Year 1', 
            priority: 'High' 
          }
        ] : [
          { service: 'Fractional CFO Services', investment: '$8,000-12,000/month', roi: '400% Year 1', priority: 'High' }
        ]
      },
      proposedEngagement: {
        services: [
          {
            name: 'AI-Enhanced Fractional CFO Services',
            description: 'Strategic financial leadership with AI-powered insights',
            deliverables: ['Weekly AI-generated financial reports', 'Monthly strategic planning', 'Real-time performance monitoring'],
            timeline: 'Ongoing monthly engagement'
          }
        ],
        phasedApproach: [
          {
            phase: 'AI Analysis & Setup (Month 1)',
            duration: '30 days',
            objectives: ['Complete financial infrastructure assessment', 'Implement AI monitoring systems'],
            deliverables: ['AI-powered dashboard', 'Automated reporting systems', 'Performance benchmarking']
          }
        ],
        investment: {
          monthly: transcriptAnalysis?.urgencySignals?.budget?.match(/\d+,?\d*/)?.[0] || '$10,000',
          setup: '$15,000',
          total: '$75,000 (6 months)'
        },
        expectedOutcomes: [
          `AI-optimized financial performance based on ${transcriptData ? 'call insights + ' : ''}QuickBooks analysis`,
          'Automated reporting reducing manual effort by 80%',
          'Enhanced decision-making through AI-powered insights',
          transcriptData ? 'Customized solutions addressing specific concerns raised in discovery' : 'Comprehensive financial optimization'
        ],
        roi: {
          timeToValue: auditDeckIntelligence?.presentationStrategy?.duration || '30 days',
          yearOneROI: '400-500% return on investment',
          threeYearROI: '750% cumulative return'
        },
        successMetrics: [
          'AI-generated financial reports delivered within 24 hours',
          'Real-time performance monitoring with 95% accuracy',
          transcriptData ? `Address ${(transcriptAnalysis?.painPoints?.operational?.length || 0) + (transcriptAnalysis?.painPoints?.financial?.length || 0)} identified pain points` : 'Comprehensive financial optimization',
          'Measurable improvement in all key financial ratios within 90 days'
        ]
      },
      aiInsights: {
        transcriptHighlights: transcriptData ? [
          ...((transcriptAnalysis?.salesIntelligence?.buyingSignals || []).map((signal: string) => `Buying signal: ${signal}`)),
          ...((transcriptAnalysis?.urgencySignals?.pressurePoints || []).map((point: string) => `Pressure point: ${point}`)),
          transcriptAnalysis?.urgencySignals?.timeline ? `Timeline mentioned: ${transcriptAnalysis.urgencySignals.timeline}` : null
        ].filter(Boolean) : ['No transcript data available - analysis based on financial data only'],
        financialEvidence: [
          `AI health score: ${financialIntelligence?.healthScore || 75}/100`,
          `Revenue analysis: ${formatCurrency(revenue)}`,
          ...(financialIntelligence?.opportunities || []).map((opp: any) => 
            `Opportunity: ${opp.opportunity} - ${formatCurrency(opp.estimatedValue || opp.potential || 50000)} potential value`
          )
        ],
        recommendedApproach: auditDeckIntelligence?.narrativeStructure ? [
          auditDeckIntelligence.narrativeStructure.openingHook,
          auditDeckIntelligence.narrativeStructure.problemStatement,
          auditDeckIntelligence.narrativeStructure.solutionFramework
        ] : [
          'Lead with AI-powered financial intelligence',
          'Demonstrate comprehensive understanding of business challenges',
          'Present data-driven solutions with quantified outcomes'
        ],
        talkingPoints: transcriptAnalysis?.salesIntelligence ? [
          ...(transcriptAnalysis.salesIntelligence.buyingSignals || []),
          `Closeability assessment: ${transcriptAnalysis.salesIntelligence.closeability || 'TBD'}/100`,
          transcriptAnalysis.salesIntelligence.recommendedStrategy || 'Data-driven engagement strategy'
        ] : ['Focus on AI-powered financial insights', 'Emphasize ROI and measurable outcomes']
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        dataSource: 'ai_enhanced_real_quickbooks',
        version: '4.0',
        companyName,
        aiAnalysisId: aiResults.analysisId || null,
        closeabilityScore: transcriptAnalysis?.salesIntelligence?.closeability || null,
        urgencyLevel: transcriptAnalysis?.urgencySignals ? 
          (transcriptAnalysis.urgencySignals.timeline?.includes('urgent') ? 'high' : 'medium') : 'standard',
        hasTranscriptData: !!transcriptData,
        analysisType: transcriptData ? 'comprehensive' : 'financial-only'
      }
    };
  };

  // Helper functions for AI-enhanced analysis
  const generateAIEnhancedMetrics = (financialData: any, financialIntelligence: any) => {
    const revenue = financialData?.profitLoss?.totalRevenue || financialData?.revenue || 0;
    const netIncome = financialData?.profitLoss?.netIncome || financialData?.net_income || 0;
    const totalAssets = financialData?.balanceSheet?.totalAssets || financialData?.assets || 0;
    
    return [
      { 
        name: 'Revenue', 
        value: formatCurrency(revenue), 
        trend: revenue > 0 ? 'up' : 'stable', 
        benchmark: 'Industry Avg', 
        status: revenue > 1000000 ? 'excellent' : revenue > 500000 ? 'good' : 'adequate',
        aiInsight: financialIntelligence?.keyMetrics?.revenue?.insights?.[0] || 'AI analysis indicates growth potential'
      },
      { 
        name: 'Net Margin', 
        value: revenue > 0 ? `${((netIncome / revenue) * 100).toFixed(1)}%` : '0%', 
        trend: netIncome > 0 ? 'up' : 'stable', 
        benchmark: '15.0%', 
        status: (netIncome / revenue) > 0.15 ? 'excellent' : (netIncome / revenue) > 0.1 ? 'good' : 'adequate',
        aiInsight: financialIntelligence?.keyMetrics?.profitability?.insights?.[0] || 'Margin optimization opportunities identified'
      },
      { 
        name: 'Financial Health', 
        value: `${financialIntelligence?.healthScore || 75}/100`, 
        trend: 'stable', 
        benchmark: '80+', 
        status: (financialIntelligence?.healthScore || 75) > 80 ? 'excellent' : 
                (financialIntelligence?.healthScore || 75) > 60 ? 'good' : 'adequate',
        aiInsight: 'AI-calculated comprehensive health assessment'
      }
    ];
  };

  const generateAIPainPointAnalysis = (transcriptAnalysis: any, financialData: any) => {
    const painPoints = [];
    
    // Add transcript-identified pain points
    if (transcriptAnalysis?.painPoints) {
      Object.entries(transcriptAnalysis.painPoints).forEach(([category, points]: [string, any]) => {
        (points || []).forEach((pain: string, index: number) => {
          painPoints.push({
            painPoint: pain,
            financialEvidence: getFinancialEvidence(pain, financialData),
            impact: calculatePainImpact(pain, financialData),
            solution: generateSolution(pain, transcriptAnalysis),
            priority: index < 2 ? 'high' : 'medium',
            estimatedValue: Math.floor(50000 + Math.random() * 100000)
          });
        });
      });
    }
    
    // Add financial data-derived pain points if no transcript
    if (painPoints.length === 0) {
      const revenue = financialData?.profitLoss?.totalRevenue || financialData?.revenue || 0;
      const netMargin = revenue > 0 ? (financialData?.profitLoss?.netIncome || financialData?.net_income || 0) / revenue : 0;
      
      if (netMargin < 0.1) {
        painPoints.push({
          painPoint: 'Below-average profit margins limiting growth investment',
          financialEvidence: `Current net margin of ${(netMargin * 100).toFixed(1)}% below industry standard`,
          impact: `Estimated ${formatCurrency(revenue * 0.05)} annual opportunity cost`,
          solution: 'Implement margin optimization and cost structure analysis',
          priority: 'high',
          estimatedValue: Math.floor(revenue * 0.03)
        });
      }
    }
    
    return painPoints;
  };

  const generateAIOpportunityMatrix = (financialIntelligence: any, businessInsights: any, financialData: any) => {
    if (financialIntelligence?.opportunities) {
      return financialIntelligence.opportunities;
    }
    
    const revenue = financialData?.profitLoss?.totalRevenue || financialData?.revenue || 0;
    
    return [
      {
        opportunity: 'AI-Powered Financial Automation',
        financialBasis: `Revenue base of ${formatCurrency(revenue)} supports automation investment`,
        estimatedValue: Math.floor(revenue * 0.05),
        difficulty: 'medium',
        timeline: '3-6 months',
        alignsWithGoals: true,
        roi: 450
      },
      {
        opportunity: 'Strategic Financial Planning Implementation',
        financialBasis: 'AI analysis reveals planning infrastructure gaps',
        estimatedValue: Math.floor(revenue * 0.08),
        difficulty: 'low',
        timeline: '2-4 months',
        alignsWithGoals: true,
        roi: 380
      }
    ];
  };

  // Enhanced financial data fetching
  useEffect(() => {
    const fetchEnhancedFinancialData = async () => {
      if (!companyId) return

      setLoadingFinancialData(true)
      try {
        // Try enhanced-financials endpoint first
        const response = await fetch(`/api/qbo/enhanced-financials?companyId=${companyId}`)
        
        if (response.ok) {
          const enhancedData = await response.json()
          
          // Convert enhanced QB data to your existing format
          const convertedSnapshot: FinancialSnapshot = {
            id: Date.now().toString(),
            company_id: companyId,
            revenue: enhancedData.profitLoss?.totalRevenue || 0,
            net_income: enhancedData.profitLoss?.netIncome || 0,
            expenses: enhancedData.profitLoss?.totalExpenses || 0,
            assets: enhancedData.balanceSheet?.totalAssets || 0,
            liabilities: enhancedData.balanceSheet?.totalLiabilities || 0,
            created_at: new Date().toISOString()
          }

          setRealFinancialData(convertedSnapshot)
          setDataSource('real')
          showToast('Enhanced QuickBooks financial data loaded successfully!', 'success')
          
          // Store the full enhanced data for more detailed analysis
          localStorage.setItem(`enhanced-qb-data-${companyId}`, JSON.stringify(enhancedData))
        } else {
          throw new Error('Enhanced data not available')
        }
        
      } catch (error) {
        console.error('Error fetching enhanced financial data:', error)
        
        // Fallback to regular financial snapshots
        try {
          const fallbackResponse = await fetch(`/api/financial-snapshots?realm_id=${companyId}`)
          if (fallbackResponse.ok) {
            const snapshots = await fallbackResponse.json()
            if (snapshots && snapshots.length > 0) {
              setRealFinancialData(snapshots[0])
              setDataSource('real')
              showToast('QuickBooks financial data loaded successfully!', 'success')
            }
          }
        } catch (fallbackError) {
          console.error('Fallback financial data fetch failed:', fallbackError)
          showToast('Using demo data - QuickBooks data unavailable', 'info')
          setDataSource('mock')
        }
      } finally {
        setLoadingFinancialData(false)
      }
    }

    fetchEnhancedFinancialData()
  }, [companyId, showToast])

  const convertToEnhancedFormat = (snapshot: FinancialSnapshot) => {
    return {
      profitLoss: {
        totalRevenue: snapshot.revenue,
        netIncome: snapshot.net_income,
        totalExpenses: snapshot.expenses
      },
      balanceSheet: {
        totalAssets: snapshot.assets,
        totalLiabilities: snapshot.liabilities
      },
      companyInfo: {
        name: companyName,
        industry: 'Business Services'
      }
    }
  }

  const convertToQBODataSet = (snapshot: FinancialSnapshot): QBODataSet => {
    const revenue = snapshot.revenue
    const netIncome = snapshot.net_income
    const totalAssets = snapshot.assets
    const totalLiabilities = snapshot.liabilities
    const totalExpenses = snapshot.expenses

    const grossMargin = revenue > 0 ? (revenue - totalExpenses * 0.7) / revenue : 0
    const currentRatio = totalLiabilities > 0 ? (totalAssets * 0.4) / (totalLiabilities * 0.6) : 2.0

    return {
      companyInfo: {
        name: companyName,
        industry: 'Business Services',
        revenue,
        employees: Math.floor(revenue / 150000) || 1,
        establishedYear: new Date().getFullYear() - 5
      },
      financialMetrics: {
        revenue: { 
          current: revenue, 
          growth: 0.15,
          trend: revenue > 0 ? 'increasing' : 'stable' 
        },
        profitability: { 
          grossMargin, 
          netMargin: revenue > 0 ? netIncome / revenue : 0,
          ebitda: netIncome + (totalExpenses * 0.1)
        },
        liquidity: { 
          currentRatio, 
          quickRatio: currentRatio * 0.8, 
          cashOnHand: totalAssets * 0.2
        },
        efficiency: { 
          assetTurnover: totalAssets > 0 ? revenue / totalAssets : 1.0,
          receivablesDays: 45,
          inventoryTurnover: 6
        },
        leverage: { 
          debtToEquity: totalAssets > 0 ? totalLiabilities / (totalAssets - totalLiabilities) : 0.3,
          interestCoverage: 10,
          debtServiceCoverage: 2.5
        }
      },
      healthScore: calculateHealthScore(snapshot),
      riskFactors: generateRiskFactors(snapshot),
      opportunities: generateOpportunities(snapshot),
      benchmarks: {
        revenueGrowth: { company: 15, industry: 12.5, percentile: 65 },
        grossMargin: { company: grossMargin * 100, industry: 65.0, percentile: grossMargin > 0.65 ? 75 : 45 },
        netMargin: { company: (netIncome / revenue) * 100, industry: 15.0, percentile: (netIncome / revenue) > 0.15 ? 70 : 40 }
      }
    }
  }

  const calculateHealthScore = (snapshot: FinancialSnapshot): number => {
    let score = 50; // Base score
    
    // Revenue health
    if (snapshot.revenue > 0) score += 10;
    
    // Profitability
    const profitMargin = snapshot.net_income / snapshot.revenue;
    if (profitMargin > 0.15) score += 15;
    else if (profitMargin > 0) score += 10;
    
    // Liquidity
    const currentRatio = snapshot.assets / snapshot.liabilities;
    if (currentRatio > 2) score += 15;
    else if (currentRatio > 1) score += 10;
    
    return Math.min(score, 100);
  };

  const generateRiskFactors = (snapshot: FinancialSnapshot): string[] => {
    const risks: string[] = []
    
    const netMargin = snapshot.revenue > 0 ? snapshot.net_income / snapshot.revenue : 0
    const debtRatio = snapshot.assets > 0 ? snapshot.liabilities / snapshot.assets : 0

    if (netMargin < 0.05) risks.push('Low profitability margins indicating operational inefficiency')
    if (debtRatio > 0.6) risks.push('High debt levels may limit financial flexibility')
    if (snapshot.revenue < 500000) risks.push('Revenue scale may limit growth opportunities')
    if (snapshot.net_income < 0) risks.push('Negative net income requires immediate attention')

    return risks.length > 0 ? risks : ['Overall financial position appears stable with manageable risk levels']
  }

  const generateOpportunities = (snapshot: FinancialSnapshot): string[] => {
    const opportunities: string[] = []
    
    const netMargin = snapshot.revenue > 0 ? snapshot.net_income / snapshot.revenue : 0
    const assetTurnover = snapshot.assets > 0 ? snapshot.revenue / snapshot.assets : 0

    if (netMargin < 0.15) opportunities.push('Margin improvement through cost optimization and pricing strategy')
    if (assetTurnover < 1.0) opportunities.push('Asset utilization enhancement to drive revenue efficiency')
    if (snapshot.revenue > 500000) opportunities.push('Scale economies through operational leverage')
    
    opportunities.push('Financial process automation and strategic planning implementation')

    return opportunities
  }

  // Mock data fallback (keeping your existing sophisticated mock data)
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
    // Determine which data to use
    const insights = callInsights || mockCallInsights
    let financialData: QBODataSet

    if (dataSource === 'real' && realFinancialData) {
      financialData = convertToQBODataSet(realFinancialData)
    } else {
      financialData = qboData || mockQBOData
    }

    setGenerating(true)
    setGenerationStage({ 
      stage: `Analyzing ${dataSource === 'real' ? 'real QuickBooks' : 'demonstration'} data...`, 
      progress: 0, 
      message: 'Initializing intelligent audit generation' 
    })

    const stages = [
      { stage: 'Processing financial data from QuickBooks...', progress: 10, message: 'Extracting key financial metrics and trends', delay: 1200 },
      { stage: 'Cross-referencing with call insights...', progress: 20, message: 'Mapping stakeholder feedback to financial evidence', delay: 1400 },
      { stage: 'Calculating industry benchmarks...', progress: 30, message: 'Comparing performance against industry standards', delay: 1100 },
      { stage: 'Identifying optimization opportunities...', progress: 45, message: 'Quantifying potential value creation initiatives', delay: 1600 },
      { stage: 'Generating AI-powered recommendations...', progress: 60, message: 'Creating data-driven solution strategies', delay: 1300 },
      { stage: 'Personalizing engagement proposal...', progress: 75, message: 'Aligning services with business objectives and budget', delay: 1500 },
      { stage: 'Preparing presentation deck...', progress: 85, message: 'Structuring professional client presentation', delay: 1200 },
      { stage: 'Finalizing intelligent audit...', progress: 95, message: 'Compiling comprehensive analysis and recommendations', delay: 1000 },
      { stage: 'Analysis complete!', progress: 100, message: `Intelligent audit deck generated using ${dataSource === 'real' ? 'real QuickBooks data' : 'demonstration data'}`, delay: 800 }
    ]

    for (const { stage, progress, message, delay } of stages) {
      await new Promise(resolve => setTimeout(resolve, delay))
      const stageInsights = progress === 30 ? [
        `Financial health score: ${financialData.healthScore}/100`,
        `Revenue: ${formatCurrency(financialData.financialMetrics.revenue.current)}`,
        `Net margin: ${(financialData.financialMetrics.profitability.netMargin * 100).toFixed(1)}%`
      ] : progress === 60 ? [
        `Identified ${financialData.opportunities.length} optimization opportunities`,
        `Risk mitigation strategies for ${financialData.riskFactors.length} key areas`,
        'Custom ROI projections aligned with business goals'
      ] : undefined
      
      setGenerationStage({ stage, progress, message, insights: stageInsights })
    }

    // Generate comprehensive intelligent audit deck using real or mock data
    const intelligentDeck: IntelligentAuditDeck = generateComprehensiveDeck(insights, financialData)

    setAuditDeck(intelligentDeck)
    onDeckGenerated?.(intelligentDeck)
    setGenerating(false)
    setTimeout(() => setGenerationStage(null), 2000)
    showToast(`Intelligent audit deck generated successfully using ${dataSource === 'real' ? 'real QuickBooks data' : 'demonstration data'}!`, 'success')
  }

  const generateComprehensiveDeck = (insights: CallInsights, financialData: QBODataSet): IntelligentAuditDeck => {
    return {
      executiveSummary: {
        overallScore: Math.round((financialData.healthScore + insights.salesScore) / 2),
        keyFindings: [
          `${dataSource === 'real' ? 'Real QuickBooks analysis shows' : 'Financial analysis indicates'} revenue of ${formatCurrency(financialData.financialMetrics.revenue.current)}`,
          `Net profit margin of ${(financialData.financialMetrics.profitability.netMargin * 100).toFixed(1)}% ${financialData.financialMetrics.profitability.netMargin > 0.15 ? 'exceeds' : 'falls below'} industry standards`,
          `Financial health score of ${financialData.healthScore}/100 indicates ${financialData.healthScore > 75 ? 'strong' : financialData.healthScore > 50 ? 'moderate' : 'weak'} operational foundation`,
          `${financialData.riskFactors.length} critical risk factors identified requiring strategic attention`
        ],
        urgentIssues: [
          ...financialData.riskFactors.slice(0, 2),
          'Financial infrastructure gaps limiting growth potential'
        ],
        opportunities: financialData.opportunities,
        contextualInsights: [
          `Analysis based on ${dataSource === 'real' ? 'live QuickBooks financial data' : 'comprehensive demonstration data'}`,
          `Stakeholder priorities align with ${insights.urgency} urgency timeline`,
          `Budget range of ${insights.budget} enables comprehensive solution implementation`
        ],
        callToAction: `Implement comprehensive financial optimization strategy to ${dataSource === 'real' ? 'address identified gaps' : 'capitalize on growth opportunities'} and enhance operational efficiency`
      },
      financialSnapshot: {
        healthScore: financialData.healthScore,
        keyMetrics: [
          { 
            name: 'Revenue', 
            value: formatCurrency(financialData.financialMetrics.revenue.current), 
            trend: 'up', 
            benchmark: 'Industry Avg', 
            status: financialData.financialMetrics.revenue.current > 1000000 ? 'excellent' : 'good' 
          },
          { 
            name: 'Net Margin', 
            value: `${(financialData.financialMetrics.profitability.netMargin * 100).toFixed(1)}%`, 
            trend: financialData.financialMetrics.profitability.netMargin > 0.15 ? 'up' : 'stable', 
            benchmark: '15.0%', 
            status: financialData.financialMetrics.profitability.netMargin > 0.15 ? 'excellent' : 'adequate' 
          },
          { 
            name: 'Current Ratio', 
            value: financialData.financialMetrics.liquidity.currentRatio.toFixed(1), 
            trend: 'stable', 
            benchmark: '2.0', 
            status: financialData.financialMetrics.liquidity.currentRatio > 2.0 ? 'good' : 'adequate' 
          },
          { 
            name: 'Debt/Equity', 
            value: financialData.financialMetrics.leverage.debtToEquity.toFixed(2), 
            trend: 'stable', 
            benchmark: '0.40', 
            status: financialData.financialMetrics.leverage.debtToEquity < 0.4 ? 'good' : 'adequate' 
          }
        ],
        industryComparison: [
          { metric: 'Revenue Growth', company: financialData.financialMetrics.revenue.growth * 100, industry: 12.5, ranking: 'Above Average' },
          { metric: 'Net Margin', company: financialData.financialMetrics.profitability.netMargin * 100, industry: 15.0, ranking: financialData.financialMetrics.profitability.netMargin > 0.15 ? 'Above Average' : 'Below Average' },
          { metric: 'Asset Turnover', company: financialData.financialMetrics.efficiency.assetTurnover, industry: 1.2, ranking: financialData.financialMetrics.efficiency.assetTurnover > 1.2 ? 'Above Average' : 'Average' }
        ],
        trendAnalysis: [
          `${dataSource === 'real' ? 'Current' : 'Projected'} revenue trajectory supports sustainable growth`,
          'Margin optimization opportunities identified through operational efficiency',
          'Working capital management presents immediate improvement potential'
        ]
      },
      painPointAnalysis: {
        identifiedPains: insights.painPoints.map((pain, index) => ({
          painPoint: pain,
          financialEvidence: getFinancialEvidence(pain, financialData),
          impact: calculatePainImpact(pain, financialData),
          solution: generateSolution(pain, insights),
          priority: index < 2 ? 'high' : index < 4 ? 'medium' : 'low',
          estimatedValue: Math.floor((financialData.financialMetrics.revenue.current * 0.02) + Math.random() * 50000)
        })),
        rootCauseAnalysis: [
          `${dataSource === 'real' ? 'Financial data analysis reveals' : 'Assessment indicates'} operational scaling challenges`,
          'Limited financial infrastructure relative to business complexity',
          'Manual processes creating inefficiencies and growth bottlenecks'
        ]
      },
      opportunityMatrix: {
        opportunities: [
          {
            opportunity: 'Financial Process Automation',
            financialBasis: `Current revenue of ${formatCurrency(financialData.financialMetrics.revenue.current)} supports automation investment`,
            estimatedValue: Math.floor(financialData.financialMetrics.revenue.current * 0.05),
            difficulty: 'medium',
            timeline: '3-6 months',
            alignsWithGoals: true,
            roi: 425
          },
          {
            opportunity: 'Margin Optimization',
            financialBasis: `Net margin of ${(financialData.financialMetrics.profitability.netMargin * 100).toFixed(1)}% has improvement potential`,
            estimatedValue: Math.floor(financialData.financialMetrics.revenue.current * 0.03),
            difficulty: 'low',
            timeline: '1-3 months',
            alignsWithGoals: true,
            roi: 340
          },
          {
            opportunity: 'Working Capital Optimization',
            financialBasis: `Asset base of ${formatCurrency(financialData.financialMetrics.liquidity.cashOnHand)} enables cash flow enhancement`,
            estimatedValue: Math.floor(financialData.financialMetrics.liquidity.cashOnHand * 0.15),
            difficulty: 'low',
            timeline: '2-4 months',
            alignsWithGoals: true,
            roi: 280
          }
        ],
        priorityRanking: [
          'Immediate: Working Capital Optimization (Quick wins, high impact)',
          'Short-term: Financial Process Automation (Foundation building)',
          'Medium-term: Strategic Margin Enhancement (Long-term value)'
        ]
      },
      riskProfile: {
        criticalRisks: financialData.riskFactors.map((risk, index) => ({
          risk,
          probability: ['High', 'Medium', 'Medium'][index] || 'Medium',
          impact: ['High', 'Medium', 'High'][index] || 'Medium',
          mitigation: `Strategic ${risk.includes('margin') ? 'pricing and cost' : risk.includes('debt') ? 'capital structure' : 'operational'} optimization`
        })),
        mitigationStrategies: [
          { 
            strategy: 'Financial Infrastructure Enhancement', 
            timeline: '3-6 months', 
            investment: '$25K setup', 
            expectedOutcome: 'Automated reporting and real-time visibility' 
          },
          { 
            strategy: 'Performance Optimization Program', 
            timeline: '2-4 months', 
            investment: '$15K monthly', 
            expectedOutcome: 'Improved margins and operational efficiency' 
          }
        ],
        contingencyPlanning: [
          'Establish financial monitoring and early warning systems',
          'Develop scenario-based financial modeling and stress testing',
          'Create operational flexibility for market adaptation'
        ]
      },
      personalizedRecommendations: {
        immediate: [
          { 
            action: 'Implement real-time financial dashboard', 
            rationale: `${dataSource === 'real' ? 'QuickBooks data shows' : 'Analysis indicates'} need for enhanced visibility`, 
            expectedOutcome: 'Daily financial monitoring capability', 
            timeline: '2 weeks' 
          },
          { 
            action: 'Optimize cash flow management', 
            rationale: `Current cash position of ${formatCurrency(financialData.financialMetrics.liquidity.cashOnHand)} needs strategic management`, 
            expectedOutcome: 'Improved working capital efficiency', 
            timeline: '3 weeks' 
          }
        ],
        shortTerm: [
          { 
            action: 'Deploy automated financial reporting', 
            rationale: 'Eliminate manual processes identified in stakeholder feedback', 
            expectedOutcome: 'Monthly time savings of 40+ hours', 
            timeline: '2 months' 
          },
          { 
            action: 'Implement strategic budgeting system', 
            rationale: 'Support growth trajectory with enhanced planning capabilities', 
            expectedOutcome: 'Improved forecasting accuracy and strategic alignment', 
            timeline: '3 months' 
          }
        ],
        longTerm: [
          { 
            action: 'Develop comprehensive FP&A function', 
            rationale: 'Scale financial operations to support business growth goals', 
            expectedOutcome: 'Strategic financial partnership enabling expansion', 
            timeline: '6-12 months' 
          },
          { 
            action: 'Build investor-ready financial infrastructure', 
            rationale: 'Prepare for future funding rounds and strategic initiatives', 
            expectedOutcome: 'Enhanced valuation and investor confidence', 
            timeline: '9-12 months' 
          }
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
            deliverables: ['Weekly cash flow management', 'Monthly financial reporting', 'Strategic planning support', 'Stakeholder communications'],
            timeline: 'Ongoing monthly engagement'
          },
          {
            name: 'Financial Systems Implementation',
            description: 'Technology infrastructure and process automation',
            deliverables: ['Automated reporting dashboards', 'Integrated planning tools', 'Process documentation', 'Team training'],
            timeline: '3-6 months implementation'
          }
        ],
        phasedApproach: [
          {
            phase: 'Foundation Building (Months 1-2)',
            duration: '60 days',
            objectives: ['Stabilize current operations', 'Implement core reporting', 'Establish financial controls'],
            deliverables: ['Real-time dashboard', 'Automated processes', 'Cash flow forecasting', 'KPI framework']
          },
          {
            phase: 'Optimization (Months 3-4)',
            duration: '60 days',
            objectives: ['Enhance operational efficiency', 'Optimize working capital', 'Improve margins'],
            deliverables: ['Process automation', 'Working capital optimization', 'Performance metrics', 'Strategic analysis']
          },
          {
            phase: 'Strategic Growth (Months 5-6)',
            duration: '60 days',
            objectives: ['Scale financial operations', 'Prepare for growth', 'Strategic initiatives'],
            deliverables: ['Growth planning', 'Strategic roadmap', 'Advanced analytics', 'Stakeholder presentations']
          }
        ],
        investment: {
          monthly: '$10,000',
          setup: '$15,000',
          total: '$75,000 (6 months)'
        },
        expectedOutcomes: [
          `Optimized financial performance based on ${dataSource === 'real' ? 'actual' : 'projected'} data analysis`,
          'Automated reporting reducing manual effort by 80%',
          'Enhanced cash flow management and working capital optimization',
          'Strategic planning capabilities supporting growth objectives',
          'Professional financial infrastructure ready for scaling'
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
          'Financial team productivity increase >40%'
        ]
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        dataSource: dataSource === 'real' ? 'real_quickbooks' : 'demonstration_data',
        version: '3.0',
        companyName
      }
    }
  }

  // Helper functions
  const getFinancialEvidence = (pain: string, data: QBODataSet): string => {
    if (pain.includes('manual')) return `Current financial metrics show ${(data.financialMetrics.efficiency.assetTurnover * 100).toFixed(0)}% asset utilization efficiency`
    if (pain.includes('cash flow')) return `Working capital of ${formatCurrency(data.financialMetrics.liquidity.cashOnHand)} requires enhanced forecasting visibility`
    if (pain.includes('reporting')) return `Revenue of ${formatCurrency(data.financialMetrics.revenue.current)} demands sophisticated reporting infrastructure`
    return `Financial analysis indicates ${(data.financialMetrics.profitability.netMargin * 100).toFixed(1)}% net margin with optimization potential`
  }

  const calculatePainImpact = (pain: string, data: QBODataSet): string => {
    const revenue = data.financialMetrics.revenue.current
    if (pain.includes('manual')) return `Estimated ${formatCurrency(revenue * 0.02)} annual opportunity cost from inefficiencies`
    if (pain.includes('cash flow')) return `Working capital optimization potential of ${formatCurrency(data.financialMetrics.liquidity.cashOnHand * 0.1)}`
    return `Operational impact affecting ${(revenue / 1000000).toFixed(1)}M revenue optimization potential`
  }

  const generateSolution = (pain: string, insights: CallInsights): string => {
    if (pain.includes('manual')) return 'Implement automated financial reporting and dashboard systems'
    if (pain.includes('cash flow')) return 'Deploy real-time cash flow monitoring and forecasting tools'
    if (pain.includes('close')) return 'Install streamlined month-end close process with automation'
    if (pain.includes('forecasting')) return 'Establish comprehensive financial planning and analysis framework'
    if (pain.includes('scaling')) return 'Build scalable financial infrastructure with growth capacity'
    return 'Develop comprehensive financial optimization strategy addressing core operational challenges'
  }

  // Export functions
  const exportDeck = (format: 'pdf' | 'html' | 'pptx') => {
    if (!auditDeck) return
    
    const filename = `${companyName}_Audit_Deck_${new Date().toISOString().split('T')[0]}`
    
    switch (format) {
      case 'html':
        const htmlContent = generateHTML(auditDeck)
        const blob = new Blob([htmlContent], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${filename}.html`
        a.click()
        break
      case 'pdf':
        // Implementation would depend on PDF library
        showToast('PDF export functionality to be implemented', 'info')
        break
      case 'pptx':
        // Implementation would depend on PowerPoint library
        showToast('PowerPoint export functionality to be implemented', 'info')
        break
    }
  }

  const generateHTML = (deck: IntelligentAuditDeck): string => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${deck.metadata?.companyName} Financial Audit</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .slide { page-break-after: always; margin-bottom: 50px; }
        .metric { display: inline-block; margin: 10px; padding: 15px; border: 1px solid #ddd; }
        h1 { color: #2563eb; }
        h2 { color: #1e40af; }
      </style>
    </head>
    <body>
      <div class="slide">
        <h1>Executive Summary</h1>
        <p><strong>Overall Score:</strong> ${deck.executiveSummary.overallScore}/100</p>
        <h3>Key Findings:</h3>
        <ul>${deck.executiveSummary.keyFindings.map(finding => `<li>${finding}</li>`).join('')}</ul>
      </div>
      <div class="slide">
        <h1>Financial Snapshot</h1>
        <div>
          ${deck.financialSnapshot.keyMetrics.map(metric => 
            `<div class="metric">
              <strong>${metric.name}:</strong> ${metric.value}<br>
              <small>Benchmark: ${metric.benchmark} | Status: ${metric.status}</small>
            </div>`
          ).join('')}
        </div>
      </div>
      <!-- Additional slides would be generated here -->
    </body>
    </html>
    `
  }

  const slides = auditDeck ? [
    { id: 'executive', title: 'Executive Summary', content: auditDeck.executiveSummary },
    { id: 'financial', title: 'Financial Snapshot', content: auditDeck.financialSnapshot },
    { id: 'painpoints', title: 'Pain Point Analysis', content: auditDeck.painPointAnalysis },
    { id: 'opportunities', title: 'Opportunity Matrix', content: auditDeck.opportunityMatrix },
    { id: 'risks', title: 'Risk Profile', content: auditDeck.riskProfile },
    { id: 'recommendations', title: 'Personalized Recommendations', content: auditDeck.personalizedRecommendations },
    { id: 'engagement', title: 'Proposed Engagement', content: auditDeck.proposedEngagement }
  ] : []

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

  const renderSlideContent = (slide: any) => {
    switch (slide.id) {
      case 'executive':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Executive Summary</h2>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{slide.content.overallScore}</span>
                </div>
                <span className="text-sm text-gray-600">Overall Score</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Key Findings
                </h3>
                <ul className="space-y-1">
                  {slide.content.keyFindings.map((finding: string, index: number) => (
                    <li key={index} className="text-sm text-green-700">• {finding}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Opportunities
                </h3>
                <ul className="space-y-1">
                  {slide.content.opportunities.map((opp: string, index: number) => (
                    <li key={index} className="text-sm text-blue-700">• {opp}</li>
                  ))}
                </ul>
              </div>
            </div>

            {slide.content.urgentIssues.length > 0 && (
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-semibold text-amber-800 mb-2 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Urgent Issues
                </h3>
                <ul className="space-y-1">
                  {slide.content.urgentIssues.map((issue: string, index: number) => (
                    <li key={index} className="text-sm text-amber-700">• {issue}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Call to Action</h3>
              <p className="text-gray-700">{slide.content.callToAction}</p>
            </div>
          </div>
        )

      case 'financial':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Financial Snapshot</h2>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{slide.content.healthScore}</span>
                </div>
                <span className="text-sm text-gray-600">Health Score</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {slide.content.keyMetrics.map((metric: any, index: number) => (
                <div key={index} className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">{metric.name}</span>
                    <div className="flex items-center">
                      {metric.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                      {metric.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                      {metric.trend === 'stable' && <Minus className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-900">{metric.value}</div>
                  <div className="text-xs text-gray-500">vs {metric.benchmark}</div>
                  <div className={`text-xs mt-1 px-2 py-1 rounded ${
                    metric.status === 'excellent' ? 'bg-green-100 text-green-800' :
                    metric.status === 'good' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {metric.status}
                  </div>
                  {metric.aiInsight && (
                    <div className="text-xs text-purple-600 mt-2 flex items-center">
                      <Brain className="w-3 h-3 mr-1" />
                      {metric.aiInsight}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-800 mb-3">Industry Comparison</h3>
              <div className="space-y-3">
                {slide.content.industryComparison.map((comp: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{comp.metric}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">
                        Company: {typeof comp.company === 'number' ? comp.company.toFixed(1) : comp.company}
                      </span>
                      <span className="text-sm text-gray-600">
                        Industry: {typeof comp.industry === 'number' ? comp.industry.toFixed(1) : comp.industry}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        comp.ranking === 'Above Average' ? 'bg-green-100 text-green-800' :
                        comp.ranking === 'Average' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {comp.ranking}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'painpoints':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Pain Point Analysis</h2>
            
            <div className="space-y-4">
              {slide.content.identifiedPains.map((pain: any, index: number) => (
                <div key={index} className="bg-white p-4 rounded-lg border-l-4 border-red-500">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{pain.painPoint}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      pain.priority === 'high' ? 'bg-red-100 text-red-800' :
                      pain.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {pain.priority} priority
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Financial Evidence:</span>
                      <p className="text-gray-800">{pain.financialEvidence}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Impact:</span>
                      <p className="text-gray-800">{pain.impact}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Solution:</span>
                      <p className="text-gray-800">{pain.solution}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-green-600 font-medium">
                    Estimated Value: {formatCurrency(pain.estimatedValue)}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Root Cause Analysis</h3>
              <ul className="space-y-1">
                {slide.content.rootCauseAnalysis.map((cause: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700">• {cause}</li>
                ))}
              </ul>
            </div>
          </div>
        )

      case 'opportunities':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Opportunity Matrix</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slide.content.opportunities.map((opp: any, index: number) => (
                <div key={index} className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{opp.opportunity}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      opp.difficulty === 'low' ? 'bg-green-100 text-green-800' :
                      opp.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {opp.difficulty} effort
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{opp.financialBasis}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Value:</span>
                      <span className="font-medium text-green-600">{formatCurrency(opp.estimatedValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timeline:</span>
                      <span className="font-medium">{opp.timeline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ROI:</span>
                      <span className="font-medium text-blue-600">{opp.roi}%</span>
                    </div>
                  </div>
                  {opp.alignsWithGoals && (
                    <div className="mt-2 flex items-center text-xs text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Aligns with business goals
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Priority Ranking</h3>
              <ol className="space-y-1">
                {slide.content.priorityRanking.map((priority: string, index: number) => (
                  <li key={index} className="text-sm text-blue-700">{index + 1}. {priority}</li>
                ))}
              </ol>
            </div>
          </div>
        )

      case 'recommendations':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Personalized Recommendations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-3 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Immediate Actions
                </h3>
                <div className="space-y-3">
                  {slide.content.immediate.map((action: any, index: number) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium text-red-900">{action.action}</div>
                      <div className="text-red-700 mt-1">{action.rationale}</div>
                      <div className="text-xs text-red-600 mt-1">Timeline: {action.timeline}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-3 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Short-term (2-6 months)
                </h3>
                <div className="space-y-3">
                  {slide.content.shortTerm.map((action: any, index: number) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium text-yellow-900">{action.action}</div>
                      <div className="text-yellow-700 mt-1">{action.rationale}</div>
                      <div className="text-xs text-yellow-600 mt-1">Timeline: {action.timeline}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Long-term (6+ months)
                </h3>
                <div className="space-y-3">
                  {slide.content.longTerm.map((action: any, index: number) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium text-green-900">{action.action}</div>
                      <div className="text-green-700 mt-1">{action.rationale}</div>
                      <div className="text-xs text-green-600 mt-1">Timeline: {action.timeline}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-800 mb-3">Budget-Aligned Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {slide.content.budgetAligned.map((service: any, index: number) => (
                  <div key={index} className="text-center p-3 rounded border">
                    <div className="font-medium text-gray-900">{service.service}</div>
                    <div className="text-lg font-bold text-blue-600 my-1">{service.investment}</div>
                    <div className="text-sm text-green-600">{service.roi} ROI</div>
                    <div className={`text-xs mt-1 px-2 py-1 rounded ${
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

      case 'engagement':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Proposed Engagement</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold text-gray-800 mb-3">Services Overview</h3>
                <div className="space-y-4">
                  {slide.content.services.map((service: any, index: number) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-gray-900">{service.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                      <div className="text-xs text-gray-500 mt-2">
                        <span className="font-medium">Timeline:</span> {service.timeline}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <span className="font-medium">Key Deliverables:</span> {service.deliverables.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold text-gray-800 mb-3">Investment & ROI</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded">
                      <div className="text-lg font-bold text-blue-600">{slide.content.investment.monthly}</div>
                      <div className="text-xs text-blue-800">Monthly</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded">
                      <div className="text-lg font-bold text-green-600">{slide.content.investment.setup}</div>
                      <div className="text-xs text-green-800">Setup</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded">
                      <div className="text-lg font-bold text-purple-600">{slide.content.investment.total}</div>
                      <div className="text-xs text-purple-800">Total (6mo)</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Time to Value:</span>
                      <span className="text-sm font-medium">{slide.content.roi.timeToValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Year 1 ROI:</span>
                      <span className="text-sm font-medium text-green-600">{slide.content.roi.yearOneROI}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">3-Year ROI:</span>
                      <span className="text-sm font-medium text-green-600">{slide.content.roi.threeYearROI}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-800 mb-3">Phased Implementation</h3>
              <div className="space-y-4">
                {slide.content.phasedApproach.map((phase: any, index: number) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{phase.phase}</h4>
                        <span className="text-xs text-gray-500">({phase.duration})</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Objectives:</span> {phase.objectives.join(', ')}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Deliverables:</span> {phase.deliverables.join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-3">Success Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {slide.content.successMetrics.map((metric: string, index: number) => (
                  <div key={index} className="flex items-center text-sm text-green-700">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    {metric}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return <div>Content not available</div>
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50">
      <ToastContainer />
      
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Intelligent Audit Deck Generator</h1>
            <p className="text-gray-600">
              Company: {companyName} | {dataSource === 'real' ? 'Real QuickBooks Data' : dataSource === 'ai_enhanced' ? 'AI-Enhanced Analysis' : 'Demo Data'}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {loadingFinancialData && (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-sm">Loading financial data...</span>
              </div>
            )}
            
            {!generating && !auditDeck && (
              <div className="flex space-x-2">
                <button
                  onClick={generateIntelligentDeck}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Generate Standard Deck</span>
                </button>
                
                <button
                  onClick={generateAIEnhancedDeck}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Brain className="w-4 h-4" />
                  <span>AI-Enhanced Analysis</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Generation Progress */}
      {generationStage && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{generationStage.stage}</span>
                <span className="text-sm text-gray-500">{generationStage.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${generationStage.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">{generationStage.message}</p>
              
              {generationStage.insights && (
                <div className="mt-2 text-xs text-blue-600">
                  {generationStage.insights.map((insight, index) => (
                    <div key={index}>• {insight}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Audit Deck Presentation */}
      {auditDeck && (
        <div className="space-y-6">
          {/* Deck Header */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {companyName} - Financial Audit Deck
                </h2>
                <p className="text-gray-600 text-sm">
                  Generated {new Date(auditDeck.metadata?.generatedAt || '').toLocaleDateString()} • 
                  {auditDeck.metadata?.hasTranscriptData ? ' With Call Analysis' : ' Financial Analysis Only'} •
                  Version {auditDeck.metadata?.version || '1.0'}
                </p>
                
                {auditDeck.aiInsights && (
                  <div className="mt-2 flex items-center space-x-4 text-sm">
                    {auditDeck.metadata?.closeabilityScore && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>Closeability: {auditDeck.metadata.closeabilityScore}/100</span>
                      </div>
                    )}
                    
                    {auditDeck.metadata?.urgencyLevel && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-red-500" />
                        <span>Urgency: {auditDeck.metadata.urgencyLevel}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => exportDeck('html')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm flex items-center space-x-1"
                >
                  <Download className="w-4 h-4" />
                  <span>Export HTML</span>
                </button>
                
                <button
                  onClick={() => exportDeck('pdf')}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm flex items-center space-x-1"
                >
                  <FileText className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Slide Navigation */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlide(index)}
                    className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                      currentSlide === index
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {slide.title}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={previousSlide}
                  disabled={currentSlide === 0}
                  className="p-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowDown className="w-4 h-4 rotate-90" />
                </button>
                
                <span className="text-sm text-gray-600">
                  {currentSlide + 1} of {slides.length}
                </span>
                
                <button
                  onClick={nextSlide}
                  disabled={currentSlide === slides.length - 1}
                  className="p-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowDown className="w-4 h-4 -rotate-90" />
                </button>
              </div>
            </div>
          </div>

          {/* Current Slide Content */}
          <div className="bg-white rounded-lg shadow-sm p-6 min-h-[600px]">
            {renderSlideContent(slides[currentSlide])}
          </div>

          {/* AI Insights Panel */}
          {auditDeck.aiInsights && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-600" />
                AI-Powered Sales Intelligence
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Recommended Talking Points</h4>
                  <ul className="space-y-1 text-sm">
                    {auditDeck.aiInsights.talkingPoints.map((point, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <MessageSquare className="w-3 h-3 mr-2 mt-1 text-blue-500 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Key Financial Evidence</h4>
                  <ul className="space-y-1 text-sm">
                    {auditDeck.aiInsights.financialEvidence.map((evidence, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <DollarSign className="w-3 h-3 mr-2 mt-1 text-green-500 flex-shrink-0" />
                        {evidence}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {auditDeck.aiInsights.transcriptHighlights.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-800 mb-2">Call Transcript Highlights</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    {auditDeck.aiInsights.transcriptHighlights.map((highlight, index) => (
                      <div key={index} className="flex items-start">
                        <Eye className="w-3 h-3 mr-2 mt-1 text-purple-500 flex-shrink-0" />
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default IntelligentAuditDeckGenerator
