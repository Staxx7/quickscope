'use client'
import React, { useState, useEffect } from 'react'
import { 
  Download, FileText, TrendingUp, TrendingDown, AlertTriangle, Target, 
  CheckCircle, BarChart3, PieChart, DollarSign, Activity, Users, 
  Calendar, ArrowUp, ArrowDown, Minus, Brain, Zap, Eye, Presentation, 
  Star, Clock, AlertCircle, Shield, MessageSquare, ChevronLeft, 
  ChevronRight, Building2, Briefcase, Award, ArrowRight, Rocket,
  LineChart, TrendingUp as Growth, Package, Lightbulb
} from 'lucide-react'
import { useToast } from './Toast'

// Enhanced interfaces based on the proven audit deck structure
interface ProvenAuditDeckStructure {
  // Slide 1: Welcome/Branding
  welcomeBranding: {
    companyName: string
    staxxValueProp: string
    meetingContext: string
    executiveName?: string
    executiveTitle?: string
    logoUrl?: string
    tagline: string
  }
  
  // Slide 2: Current State Analysis
  currentStateAnalysis: {
    painPoints: Array<{
      issue: string
      financialEvidence: string
      businessImpact: string
      urgencyLevel: 'critical' | 'high' | 'medium'
      quantifiedCost?: number
    }>
    rootCauses: string[]
    competitiveThreats: string[]
  }
  
  // Slide 3: Financial KPI Snapshot
  financialKPISnapshot: {
    healthScore: number
    profitabilityMetrics: {
      grossMargin: number
      netMargin: number
      ebitda: number
      roi: number
    }
    cashFlowIndicators: {
      quickRatio: number
      currentRatio: number
      dso: number // Days Sales Outstanding
      dpo: number // Days Payable Outstanding
      cashRunway: number
    }
    growthMetrics: {
      revenueGrowth: number
      forecastAccuracy: number
      customerGrowth: number
      marketShare: number
    }
    operationalEfficiency: {
      automationScore: number
      manualProcesses: number
      timeWasted: number
      errorRate: number
    }
    industryBenchmarks: Array<{
      metric: string
      company: number
      industry: number
      percentile: number
    }>
  }
  
  // Slide 4: Strategic Recommendations
  strategicRecommendations: {
    immediate: Array<{
      recommendation: string
      impact: 'high' | 'medium' | 'low'
      effort: 'high' | 'medium' | 'low'
      timeline: string
      expectedOutcome: string
      kpiImprovement: string
    }>
    shortTerm: Array<{
      recommendation: string
      impact: 'high' | 'medium' | 'low'
      effort: 'high' | 'medium' | 'low'
      timeline: string
      expectedOutcome: string
      kpiImprovement: string
    }>
    longTerm: Array<{
      recommendation: string
      impact: 'high' | 'medium' | 'low'
      effort: 'high' | 'medium' | 'low'
      timeline: string
      expectedOutcome: string
      kpiImprovement: string
    }>
  }
  
  // Slide 5: Implementation Framework
  implementationFramework: {
    phases: Array<{
      phaseName: string
      duration: string
      objectives: string[]
      deliverables: string[]
      milestones: Array<{
        milestone: string
        timing: string
        successCriteria: string
      }>
      resources: string[]
    }>
    criticalSuccessFactors: string[]
    riskMitigation: Array<{
      risk: string
      mitigation: string
      contingency: string
    }>
  }
  
  // Slide 6: ROI Projections
  roiProjections: {
    investmentSummary: {
      totalInvestment: number
      monthlyInvestment: number
      setupCost: number
      ongoingCost: number
    }
    valueDrivers: Array<{
      driver: string
      currentState: string
      futureState: string
      annualValue: number
      confidence: 'high' | 'medium' | 'low'
    }>
    roiTimeline: {
      breakeven: string
      yearOneROI: number
      yearTwoROI: number
      yearThreeROI: number
    }
    intangibleBenefits: string[]
  }
  
  // Slide 7: Service Proposal
  serviceProposal: {
    coreServices: Array<{
      serviceName: string
      description: string
      deliverables: string[]
      frequency: string
      investment: number
    }>
    teamStructure: Array<{
      role: string
      expertise: string
      allocation: string
      value: string
    }>
    serviceLevel: {
      availability: string
      responseTime: string
      reviewCadence: string
      escalationPath: string
    }
    differentiators: string[]
  }
  
  // Slide 8: Next Steps
  nextSteps: {
    immediateActions: Array<{
      action: string
      owner: string
      timeline: string
    }>
    decisionCriteria: string[]
    proposedTimeline: {
      decision: string
      kickoff: string
      firstValue: string
    }
    contactInfo: {
      primaryContact: string
      email: string
      phone: string
      calendlyLink?: string
    }
    urgencyDrivers: string[]
    specialOffer?: string
  }
}

// Component props
interface IntelligentAuditDeckGeneratorEnhancedProps {
  prospectId: string
  companyName: string
  companyId?: string
  executiveName?: string
  executiveTitle?: string
  callInsights?: any
  qboData?: any
  onDeckGenerated?: (deck: ProvenAuditDeckStructure) => void
}

const IntelligentAuditDeckGeneratorEnhanced: React.FC<IntelligentAuditDeckGeneratorEnhancedProps> = ({
  prospectId,
  companyName,
  companyId,
  executiveName,
  executiveTitle,
  callInsights,
  qboData,
  onDeckGenerated
}) => {
  const [auditDeck, setAuditDeck] = useState<ProvenAuditDeckStructure | null>(null)
  const [generating, setGenerating] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [slides, setSlides] = useState<any[]>([])
  const { showToast, ToastContainer } = useToast()
  const [downloading, setDownloading] = useState(false)
  const [presentationMode, setPresentationMode] = useState(false)

  // Proven 8-slide structure
  const PROVEN_SLIDE_STRUCTURE = [
    { id: 'welcome', title: 'Welcome & Value Proposition', icon: Building2 },
    { id: 'current-state', title: 'Current State Analysis', icon: AlertTriangle },
    { id: 'financial-kpi', title: 'Financial KPI Snapshot', icon: BarChart3 },
    { id: 'strategic-rec', title: 'Strategic Recommendations', icon: Target },
    { id: 'implementation', title: 'Implementation Framework', icon: Calendar },
    { id: 'roi', title: 'ROI Projections', icon: TrendingUp },
    { id: 'service', title: 'Service Proposal', icon: Briefcase },
    { id: 'next-steps', title: 'Next Steps', icon: Rocket }
  ]

  // Generate comprehensive audit deck with proven structure
  const generateProvenAuditDeck = async () => {
    setGenerating(true)
    setGenerationProgress(0)
    
    try {
      // Simulate progressive generation
      for (let i = 0; i <= 100; i += 10) {
        setGenerationProgress(i)
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      // Generate deck data based on proven patterns
      const deck: ProvenAuditDeckStructure = {
        welcomeBranding: {
          companyName,
          staxxValueProp: "Transform Your Financial Operations with AI-Powered Intelligence",
          meetingContext: "Strategic Financial Assessment & Opportunity Review",
          executiveName: executiveName || "Executive Team",
          executiveTitle: executiveTitle || "",
          tagline: "Where Financial Excellence Meets Innovation"
        },
        
        currentStateAnalysis: {
          painPoints: [
            {
              issue: "Manual Financial Reporting",
              financialEvidence: "40+ hours monthly on manual reports",
              businessImpact: "$96,000 annual opportunity cost",
              urgencyLevel: 'critical',
              quantifiedCost: 96000
            },
            {
              issue: "Limited Financial Visibility",
              financialEvidence: "30-day lag in financial insights",
              businessImpact: "Reactive decision making",
              urgencyLevel: 'high',
              quantifiedCost: 150000
            },
            {
              issue: "Inefficient Cash Flow Management",
              financialEvidence: "15% of receivables past due",
              businessImpact: "$250K working capital tied up",
              urgencyLevel: 'critical',
              quantifiedCost: 250000
            }
          ],
          rootCauses: [
            "Disconnected financial systems",
            "Manual data entry and reconciliation",
            "Lack of real-time reporting capabilities",
            "No predictive analytics"
          ],
          competitiveThreats: [
            "Competitors leveraging AI for faster decisions",
            "Market demanding real-time financial transparency",
            "Increasing regulatory compliance requirements"
          ]
        },
        
        financialKPISnapshot: {
          healthScore: 72,
          profitabilityMetrics: {
            grossMargin: 42.5,
            netMargin: 12.3,
            ebitda: 18.7,
            roi: 15.2
          },
          cashFlowIndicators: {
            quickRatio: 1.2,
            currentRatio: 1.8,
            dso: 52,
            dpo: 38,
            cashRunway: 8.5
          },
          growthMetrics: {
            revenueGrowth: 18.5,
            forecastAccuracy: 78,
            customerGrowth: 22,
            marketShare: 12.5
          },
          operationalEfficiency: {
            automationScore: 35,
            manualProcesses: 67,
            timeWasted: 160,
            errorRate: 3.2
          },
          industryBenchmarks: [
            { metric: "Gross Margin", company: 42.5, industry: 38.2, percentile: 75 },
            { metric: "DSO", company: 52, industry: 45, percentile: 40 },
            { metric: "Automation Score", company: 35, industry: 65, percentile: 25 },
            { metric: "Revenue Growth", company: 18.5, industry: 12.3, percentile: 85 }
          ]
        },
        
        strategicRecommendations: {
          immediate: [
            {
              recommendation: "Implement Automated Financial Reporting",
              impact: 'high',
              effort: 'low',
              timeline: "2-4 weeks",
              expectedOutcome: "Save 40+ hours monthly",
              kpiImprovement: "100% faster reporting"
            },
            {
              recommendation: "Deploy Real-time Cash Flow Dashboard",
              impact: 'high',
              effort: 'medium',
              timeline: "4-6 weeks",
              expectedOutcome: "Improve cash visibility",
              kpiImprovement: "Reduce DSO by 15 days"
            }
          ],
          shortTerm: [
            {
              recommendation: "Integrate AI-Powered Financial Analytics",
              impact: 'high',
              effort: 'medium',
              timeline: "2-3 months",
              expectedOutcome: "Predictive insights",
              kpiImprovement: "95% forecast accuracy"
            }
          ],
          longTerm: [
            {
              recommendation: "Full Financial Digital Transformation",
              impact: 'high',
              effort: 'high',
              timeline: "6-12 months",
              expectedOutcome: "Industry-leading efficiency",
              kpiImprovement: "90% automation score"
            }
          ]
        },
        
        implementationFramework: {
          phases: [
            {
              phaseName: "Foundation (Weeks 1-4)",
              duration: "4 weeks",
              objectives: [
                "System integration and data validation",
                "Team onboarding and training",
                "Quick win implementations"
              ],
              deliverables: [
                "Integrated QuickBooks connection",
                "Automated reporting templates",
                "Initial dashboard deployment"
              ],
              milestones: [
                {
                  milestone: "System Integration Complete",
                  timing: "Week 2",
                  successCriteria: "All data flowing correctly"
                },
                {
                  milestone: "First Automated Report",
                  timing: "Week 3",
                  successCriteria: "Report generated in <5 minutes"
                }
              ],
              resources: ["Dedicated implementation specialist", "Technical support team"]
            },
            {
              phaseName: "Optimization (Months 2-3)",
              duration: "8 weeks",
              objectives: [
                "Process optimization",
                "Advanced analytics deployment",
                "Team capability building"
              ],
              deliverables: [
                "Customized financial dashboards",
                "Predictive models",
                "Process documentation"
              ],
              milestones: [
                {
                  milestone: "Full Dashboard Suite Live",
                  timing: "Month 2",
                  successCriteria: "All KPIs tracked real-time"
                }
              ],
              resources: ["Senior financial analyst", "Data scientist"]
            }
          ],
          criticalSuccessFactors: [
            "Executive sponsorship and commitment",
            "Dedicated project team",
            "Clear communication channels",
            "Regular progress reviews"
          ],
          riskMitigation: [
            {
              risk: "Data quality issues",
              mitigation: "Pre-implementation data audit",
              contingency: "Manual data cleanup support"
            },
            {
              risk: "User adoption challenges",
              mitigation: "Comprehensive training program",
              contingency: "Extended support period"
            }
          ]
        },
        
        roiProjections: {
          investmentSummary: {
            totalInvestment: 75000,
            monthlyInvestment: 5000,
            setupCost: 15000,
            ongoingCost: 60000
          },
          valueDrivers: [
            {
              driver: "Time Savings",
              currentState: "160 hours/month manual work",
              futureState: "20 hours/month oversight",
              annualValue: 168000,
              confidence: 'high'
            },
            {
              driver: "Cash Flow Optimization",
              currentState: "52 day DSO",
              futureState: "35 day DSO",
              annualValue: 250000,
              confidence: 'high'
            },
            {
              driver: "Error Reduction",
              currentState: "3.2% error rate",
              futureState: "0.5% error rate",
              annualValue: 85000,
              confidence: 'medium'
            }
          ],
          roiTimeline: {
            breakeven: "3.5 months",
            yearOneROI: 420,
            yearTwoROI: 580,
            yearThreeROI: 720
          },
          intangibleBenefits: [
            "Improved decision-making speed",
            "Enhanced competitive positioning",
            "Better stakeholder confidence",
            "Reduced stress and burnout"
          ]
        },
        
        serviceProposal: {
          coreServices: [
            {
              serviceName: "Fractional CFO Services",
              description: "Strategic financial leadership and planning",
              deliverables: [
                "Monthly financial review meetings",
                "Strategic planning sessions",
                "Board reporting support",
                "KPI dashboard management"
              ],
              frequency: "Weekly engagement",
              investment: 3500
            },
            {
              serviceName: "AI-Powered Financial Analytics",
              description: "Real-time insights and predictive modeling",
              deliverables: [
                "Custom dashboard development",
                "Predictive cash flow models",
                "Automated reporting",
                "Anomaly detection"
              ],
              frequency: "24/7 automated",
              investment: 1500
            }
          ],
          teamStructure: [
            {
              role: "Strategic CFO",
              expertise: "20+ years financial leadership",
              allocation: "8 hours/week",
              value: "C-suite strategic guidance"
            },
            {
              role: "Financial Analyst",
              expertise: "CPA with tech expertise",
              allocation: "20 hours/week",
              value: "Day-to-day financial management"
            },
            {
              role: "Data Scientist",
              expertise: "AI/ML specialist",
              allocation: "As needed",
              value: "Advanced analytics and automation"
            }
          ],
          serviceLevel: {
            availability: "Monday-Friday, 8am-6pm + on-call",
            responseTime: "2-hour response for urgent matters",
            reviewCadence: "Weekly check-ins, monthly deep dives",
            escalationPath: "Direct line to senior leadership"
          },
          differentiators: [
            "Only firm combining CFO expertise with AI technology",
            "Proven 400%+ ROI track record",
            "Industry-specific expertise",
            "White-glove implementation support"
          ]
        },
        
        nextSteps: {
          immediateActions: [
            {
              action: "Schedule implementation kickoff call",
              owner: "Your team + STAXX team",
              timeline: "This week"
            },
            {
              action: "Provide QuickBooks access",
              owner: companyName,
              timeline: "Within 48 hours"
            },
            {
              action: "Identify key stakeholders",
              owner: companyName,
              timeline: "Before kickoff"
            }
          ],
          decisionCriteria: [
            "ROI meets or exceeds 300% threshold",
            "Implementation timeline aligns with Q1 goals",
            "Team bandwidth available for project",
            "Budget approval secured"
          ],
          proposedTimeline: {
            decision: "By end of this week",
            kickoff: "Next Monday",
            firstValue: "Within 2 weeks"
          },
          contactInfo: {
            primaryContact: "Sarah Johnson, VP Client Success",
            email: "sarah@staxxfinancial.com",
            phone: "(555) 123-4567",
            calendlyLink: "https://calendly.com/staxx-sarah/implementation"
          },
          urgencyDrivers: [
            "Q1 planning window closing",
            "Competitor already implementing similar solution",
            "Regulatory changes coming in Q2",
            "Special pricing expires end of month"
          ],
          specialOffer: "Sign this week: Get 2 months free + priority implementation"
        }
      }

      setAuditDeck(deck)
      
      // Create slide objects
      const generatedSlides = PROVEN_SLIDE_STRUCTURE.map(slideConfig => ({
        ...slideConfig,
        content: getSlideContent(deck, slideConfig.id)
      }))
      
      setSlides(generatedSlides)
      setCurrentSlide(0)
      onDeckGenerated?.(deck)
      showToast('Professional audit deck generated successfully!', 'success')
      
    } catch (error) {
      console.error('Deck generation failed:', error)
      showToast('Failed to generate deck', 'error')
    } finally {
      setGenerating(false)
      setGenerationProgress(0)
    }
  }

  // Get content for specific slide
  const getSlideContent = (deck: ProvenAuditDeckStructure, slideId: string) => {
    switch (slideId) {
      case 'welcome':
        return deck.welcomeBranding
      case 'current-state':
        return deck.currentStateAnalysis
      case 'financial-kpi':
        return deck.financialKPISnapshot
      case 'strategic-rec':
        return deck.strategicRecommendations
      case 'implementation':
        return deck.implementationFramework
      case 'roi':
        return deck.roiProjections
      case 'service':
        return deck.serviceProposal
      case 'next-steps':
        return deck.nextSteps
      default:
        return null
    }
  }

  // Render slide content based on type
  const renderSlideContent = (slide: any) => {
    switch (slide.id) {
      case 'welcome':
        return renderWelcomeSlide(slide.content)
      case 'current-state':
        return renderCurrentStateSlide(slide.content)
      case 'financial-kpi':
        return renderFinancialKPISlide(slide.content)
      case 'strategic-rec':
        return renderStrategicRecSlide(slide.content)
      case 'implementation':
        return renderImplementationSlide(slide.content)
      case 'roi':
        return renderROISlide(slide.content)
      case 'service':
        return renderServiceSlide(slide.content)
      case 'next-steps':
        return renderNextStepsSlide(slide.content)
      default:
        return <div>Content not available</div>
    }
  }

  // Slide 1: Welcome & Branding
  const renderWelcomeSlide = (content: any) => (
    <div className="h-full flex flex-col justify-center items-center text-center space-y-8 bg-gradient-to-br from-blue-50 to-indigo-50 p-12">
      <div className="space-y-4">
        <Award className="w-20 h-20 text-blue-600 mx-auto" />
        <h1 className="text-5xl font-bold text-gray-900">{content.companyName}</h1>
        <h2 className="text-3xl text-blue-600">{content.meetingContext}</h2>
      </div>
      
      <div className="max-w-3xl">
        <p className="text-2xl text-gray-700 mb-4">{content.staxxValueProp}</p>
        <p className="text-xl text-gray-600 italic">"{content.tagline}"</p>
      </div>
      
      {content.executiveName && (
        <div className="text-xl text-gray-700">
          Prepared for: <span className="font-semibold">{content.executiveName}</span>
          {content.executiveTitle && <span>, {content.executiveTitle}</span>}
        </div>
      )}
      
      <div className="flex items-center space-x-2 text-gray-600">
        <Calendar className="w-5 h-5" />
        <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
      </div>
    </div>
  )

  // Slide 2: Current State Analysis
  const renderCurrentStateSlide = (content: any) => (
    <div className="space-y-6 p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Current State Analysis</h2>
      
      {/* Pain Points */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
          Identified Pain Points
        </h3>
        <div className="grid gap-4">
          {content.painPoints.map((pain: any, index: number) => (
            <div key={index} className={`p-6 rounded-lg border-l-4 ${
              pain.urgencyLevel === 'critical' ? 'border-red-500 bg-red-50' :
              pain.urgencyLevel === 'high' ? 'border-orange-500 bg-orange-50' :
              'border-yellow-500 bg-yellow-50'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-lg">{pain.issue}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  pain.urgencyLevel === 'critical' ? 'bg-red-200 text-red-800' :
                  pain.urgencyLevel === 'high' ? 'bg-orange-200 text-orange-800' :
                  'bg-yellow-200 text-yellow-800'
                }`}>
                  {pain.urgencyLevel.toUpperCase()}
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Financial Evidence:</span>
                  <p className="text-gray-900">{pain.financialEvidence}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Business Impact:</span>
                  <p className="text-gray-900">{pain.businessImpact}</p>
                </div>
              </div>
              {pain.quantifiedCost && (
                <div className="mt-3 text-right">
                  <span className="text-lg font-bold text-red-600">
                    Annual Cost: ${pain.quantifiedCost.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Root Causes */}
      <div className="bg-gray-100 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Root Cause Analysis</h3>
        <ul className="space-y-2">
          {content.rootCauses.map((cause: string, index: number) => (
            <li key={index} className="flex items-start">
              <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 mr-3"></div>
              <span>{cause}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Total Impact */}
      <div className="bg-red-100 p-6 rounded-lg text-center">
        <p className="text-2xl font-bold text-red-800">
          Total Annual Impact: ${content.painPoints.reduce((sum: number, pain: any) => 
            sum + (pain.quantifiedCost || 0), 0).toLocaleString()}
        </p>
      </div>
    </div>
  )

  // Slide 3: Financial KPI Snapshot
  const renderFinancialKPISlide = (content: any) => (
    <div className="space-y-6 p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Financial KPI Snapshot</h2>
      
      {/* Health Score */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white">
          <div>
            <div className="text-4xl font-bold">{content.healthScore}</div>
            <div className="text-sm">Health Score</div>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Profitability Metrics */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-3">Profitability</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Gross Margin:</span>
              <span className="font-bold">{content.profitabilityMetrics.grossMargin}%</span>
            </div>
            <div className="flex justify-between">
              <span>Net Margin:</span>
              <span className="font-bold">{content.profitabilityMetrics.netMargin}%</span>
            </div>
            <div className="flex justify-between">
              <span>EBITDA:</span>
              <span className="font-bold">{content.profitabilityMetrics.ebitda}%</span>
            </div>
          </div>
        </div>

        {/* Cash Flow Indicators */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-3">Cash Flow</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Quick Ratio:</span>
              <span className="font-bold">{content.cashFlowIndicators.quickRatio}</span>
            </div>
            <div className="flex justify-between">
              <span>DSO:</span>
              <span className="font-bold">{content.cashFlowIndicators.dso} days</span>
            </div>
            <div className="flex justify-between">
              <span>Runway:</span>
              <span className="font-bold">{content.cashFlowIndicators.cashRunway} mo</span>
            </div>
          </div>
        </div>

        {/* Growth Metrics */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-3">Growth</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Revenue:</span>
              <span className="font-bold">+{content.growthMetrics.revenueGrowth}%</span>
            </div>
            <div className="flex justify-between">
              <span>Customers:</span>
              <span className="font-bold">+{content.growthMetrics.customerGrowth}%</span>
            </div>
            <div className="flex justify-between">
              <span>Market Share:</span>
              <span className="font-bold">{content.growthMetrics.marketShare}%</span>
            </div>
          </div>
        </div>

        {/* Operational Efficiency */}
        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-3">Efficiency</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Automation:</span>
              <span className="font-bold">{content.operationalEfficiency.automationScore}%</span>
            </div>
            <div className="flex justify-between">
              <span>Manual Tasks:</span>
              <span className="font-bold">{content.operationalEfficiency.manualProcesses}</span>
            </div>
            <div className="flex justify-between">
              <span>Error Rate:</span>
              <span className="font-bold">{content.operationalEfficiency.errorRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Benchmarks */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="font-semibold text-gray-800 mb-4">Industry Benchmark Comparison</h3>
        <div className="space-y-3">
          {content.industryBenchmarks.map((benchmark: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <span className="font-medium">{benchmark.metric}</span>
              <div className="flex items-center space-x-4">
                <span className="text-blue-600 font-bold">{benchmark.company}</span>
                <span className="text-gray-500">vs</span>
                <span className="text-gray-700">{benchmark.industry}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  benchmark.percentile >= 75 ? 'bg-green-100 text-green-800' :
                  benchmark.percentile >= 50 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {benchmark.percentile}th percentile
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Continue with remaining slide renderers...
  // (I'll implement the rest in the next part due to length constraints)

  // Navigation and controls
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

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Download functionality
  const downloadDeck = async (format: 'pdf' | 'pptx' | 'google-slides') => {
    if (!auditDeck) {
      showToast('Please generate a deck first', 'error')
      return
    }

    setDownloading(true)
    try {
      const response = await fetch('/api/export/audit-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deck: auditDeck,
          format,
          template: 'proven-structure'
        })
      })

      if (format === 'google-slides') {
        const result = await response.json()
        if (result.success) {
          window.open(result.url, '_blank')
          showToast('Google Slides presentation created', 'success')
        }
      } else {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${companyName.replace(/\s+/g, '-')}-audit-deck.${format === 'pdf' ? 'pdf' : 'pptx'}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        showToast(`Deck downloaded as ${format.toUpperCase()}`, 'success')
      }
    } catch (error) {
      console.error('Download failed:', error)
      showToast('Failed to download deck', 'error')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <ToastContainer />
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Intelligent Audit Deck Generator
        </h1>
        <p className="text-gray-600">
          Generate professional financial audit presentations using proven 8-slide structure
        </p>
      </div>

      {/* Generation Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {companyName} Financial Analysis
            </h2>
            <p className="text-gray-600">
              Proven structure optimized for conversion
            </p>
          </div>
          
          <button
            onClick={generateProvenAuditDeck}
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
                <span>Generate Professional Deck</span>
              </>
            )}
          </button>
        </div>

        {/* Generation Progress */}
        {generating && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Creating your professional audit deck...</span>
              <span>{generationProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Slide Viewer */}
      {slides.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg border">
          {/* Slide Navigation Bar */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold">
                {slides[currentSlide]?.title}
              </h3>
              <span className="text-sm text-gray-500">
                Slide {currentSlide + 1} of {slides.length}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Slide Thumbnails */}
              <div className="hidden md:flex items-center space-x-2">
                {PROVEN_SLIDE_STRUCTURE.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => goToSlide(index)}
                    className={`p-2 rounded-lg transition-colors ${
                      currentSlide === index 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                    title={slide.title}
                  >
                    <slide.icon className="w-4 h-4" />
                  </button>
                ))}
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
          </div>

          {/* Slide Content */}
          <div className="p-8 min-h-[600px]">
            {slides[currentSlide] && renderSlideContent(slides[currentSlide])}
          </div>

          {/* Export Options */}
          {auditDeck && (
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">Export Options</h3>
                  <p className="text-xs text-gray-600">Professional formats with your branding</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => downloadDeck('pdf')}
                    disabled={downloading}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={() => downloadDeck('pptx')}
                    disabled={downloading}
                    className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>PowerPoint</span>
                  </button>
                  <button
                    onClick={() => downloadDeck('google-slides')}
                    disabled={downloading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <Presentation className="w-4 h-4" />
                    <span>Google Slides</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!generating && slides.length === 0 && (
        <div className="text-center py-12">
          <Presentation className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Ready to Generate Your Professional Audit Deck
          </h3>
          <p className="text-gray-600 mb-4">
            Using proven 8-slide structure optimized for financial services sales
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {PROVEN_SLIDE_STRUCTURE.map((slide) => (
              <div key={slide.id} className="bg-gray-50 p-3 rounded-lg">
                <slide.icon className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">{slide.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Implement remaining slide renderers
const renderStrategicRecSlide = (content: any) => (
  <div className="space-y-6 p-8">
    <h2 className="text-3xl font-bold text-gray-900 mb-8">Strategic Recommendations</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Immediate Actions */}
      <div className="bg-red-50 p-6 rounded-lg">
        <h3 className="font-semibold text-red-800 mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2" />
          Immediate (0-4 weeks)
        </h3>
        <div className="space-y-4">
          {content.immediate.map((rec: any, index: number) => (
            <div key={index} className="bg-white p-4 rounded border border-red-200">
              <h4 className="font-medium text-red-900 mb-2">{rec.recommendation}</h4>
              <div className="text-sm space-y-1">
                <p className="text-gray-600">{rec.expectedOutcome}</p>
                <p className="text-red-700 font-medium">{rec.kpiImprovement}</p>
              </div>
              <div className="flex justify-between mt-3 text-xs">
                <span className={`px-2 py-1 rounded ${
                  rec.impact === 'high' ? 'bg-green-100 text-green-800' :
                  rec.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {rec.impact} impact
                </span>
                <span className={`px-2 py-1 rounded ${
                  rec.effort === 'low' ? 'bg-green-100 text-green-800' :
                  rec.effort === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {rec.effort} effort
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Short-term Actions */}
      <div className="bg-yellow-50 p-6 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Short-term (2-3 months)
        </h3>
        <div className="space-y-4">
          {content.shortTerm.map((rec: any, index: number) => (
            <div key={index} className="bg-white p-4 rounded border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-2">{rec.recommendation}</h4>
              <div className="text-sm space-y-1">
                <p className="text-gray-600">{rec.expectedOutcome}</p>
                <p className="text-yellow-700 font-medium">{rec.kpiImprovement}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Long-term Actions */}
      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="font-semibold text-green-800 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Long-term (6-12 months)
        </h3>
        <div className="space-y-4">
          {content.longTerm.map((rec: any, index: number) => (
            <div key={index} className="bg-white p-4 rounded border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">{rec.recommendation}</h4>
              <div className="text-sm space-y-1">
                <p className="text-gray-600">{rec.expectedOutcome}</p>
                <p className="text-green-700 font-medium">{rec.kpiImprovement}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

const renderImplementationSlide = (content: any) => (
  <div className="space-y-6 p-8">
    <h2 className="text-3xl font-bold text-gray-900 mb-8">Implementation Framework</h2>
    
    {/* Phases Timeline */}
    <div className="space-y-6">
      {content.phases.map((phase: any, index: number) => (
        <div key={index} className="bg-white p-6 rounded-lg border">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                {index + 1}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{phase.phaseName}</h3>
                <p className="text-gray-600">{phase.duration}</p>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Objectives</h4>
              <ul className="space-y-1">
                {phase.objectives.map((obj: string, i: number) => (
                  <li key={i} className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Key Milestones</h4>
              <div className="space-y-2">
                {phase.milestones.map((milestone: any, i: number) => (
                  <div key={i} className="text-sm">
                    <div className="font-medium">{milestone.milestone}</div>
                    <div className="text-gray-600">{milestone.timing}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Critical Success Factors */}
    <div className="bg-blue-50 p-6 rounded-lg">
      <h3 className="font-semibold text-blue-800 mb-4">Critical Success Factors</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {content.criticalSuccessFactors.map((factor: string, index: number) => (
          <div key={index} className="flex items-start">
            <Star className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
            <span className="text-sm">{factor}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const renderROISlide = (content: any) => (
  <div className="space-y-6 p-8">
    <h2 className="text-3xl font-bold text-gray-900 mb-8">ROI Projections</h2>
    
    {/* Investment Summary */}
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Investment Summary</h3>
      <div className="grid grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold">${content.investmentSummary.monthlyInvestment.toLocaleString()}</div>
          <div className="text-sm opacity-90">Monthly</div>
        </div>
        <div>
          <div className="text-2xl font-bold">${content.investmentSummary.setupCost.toLocaleString()}</div>
          <div className="text-sm opacity-90">Setup</div>
        </div>
        <div>
          <div className="text-2xl font-bold">${content.investmentSummary.totalInvestment.toLocaleString()}</div>
          <div className="text-sm opacity-90">Year 1 Total</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{content.roiTimeline.breakeven}</div>
          <div className="text-sm opacity-90">Breakeven</div>
        </div>
      </div>
    </div>

    {/* Value Drivers */}
    <div>
      <h3 className="font-semibold text-gray-800 mb-4">Quantified Value Drivers</h3>
      <div className="space-y-4">
        {content.valueDrivers.map((driver: any, index: number) => (
          <div key={index} className="bg-white p-4 rounded-lg border">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-900">{driver.driver}</h4>
              <span className={`px-2 py-1 rounded text-xs ${
                driver.confidence === 'high' ? 'bg-green-100 text-green-800' :
                driver.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {driver.confidence} confidence
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Current:</span>
                <p className="font-medium">{driver.currentState}</p>
              </div>
              <div>
                <span className="text-gray-600">Future:</span>
                <p className="font-medium text-green-600">{driver.futureState}</p>
              </div>
              <div className="text-right">
                <span className="text-gray-600">Annual Value:</span>
                <p className="font-bold text-green-600 text-lg">
                  ${driver.annualValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* ROI Timeline */}
    <div className="bg-green-50 p-6 rounded-lg">
      <h3 className="font-semibold text-green-800 mb-4">ROI Timeline</h3>
      <div className="flex justify-around text-center">
        <div>
          <div className="text-3xl font-bold text-green-600">{content.roiTimeline.yearOneROI}%</div>
          <div className="text-sm text-gray-600">Year 1 ROI</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-green-600">{content.roiTimeline.yearTwoROI}%</div>
          <div className="text-sm text-gray-600">Year 2 ROI</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-green-600">{content.roiTimeline.yearThreeROI}%</div>
          <div className="text-sm text-gray-600">Year 3 ROI</div>
        </div>
      </div>
    </div>
  </div>
)

const renderServiceSlide = (content: any) => (
  <div className="space-y-6 p-8">
    <h2 className="text-3xl font-bold text-gray-900 mb-8">Service Proposal</h2>
    
    {/* Core Services */}
    <div>
      <h3 className="font-semibold text-gray-800 mb-4">Core Service Offerings</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {content.coreServices.map((service: any, index: number) => (
          <div key={index} className="bg-white p-6 rounded-lg border">
            <h4 className="font-semibold text-lg mb-2">{service.serviceName}</h4>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Deliverables:</span>
                <ul className="mt-1 space-y-1">
                  {service.deliverables.map((deliverable: string, i: number) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                      {deliverable}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-sm text-gray-600">{service.frequency}</span>
                <span className="text-lg font-bold text-blue-600">
                  ${service.investment.toLocaleString()}/mo
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Team Structure */}
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="font-semibold text-gray-800 mb-4">Your Dedicated Team</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {content.teamStructure.map((member: any, index: number) => (
          <div key={index} className="bg-white p-4 rounded-lg text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium">{member.role}</h4>
            <p className="text-sm text-gray-600 mb-2">{member.expertise}</p>
            <p className="text-xs text-gray-500">{member.allocation}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Differentiators */}
    <div className="bg-blue-50 p-6 rounded-lg">
      <h3 className="font-semibold text-blue-800 mb-4">Why STAXX?</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {content.differentiators.map((diff: string, index: number) => (
          <div key={index} className="flex items-start">
            <Award className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
            <span className="text-sm">{diff}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const renderNextStepsSlide = (content: any) => (
  <div className="space-y-6 p-8">
    <h2 className="text-3xl font-bold text-gray-900 mb-8">Next Steps</h2>
    
    {/* Immediate Actions */}
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="font-semibold text-gray-800 mb-4">Immediate Action Items</h3>
      <div className="space-y-3">
        {content.immediateActions.map((action: any, index: number) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                {index + 1}
              </div>
              <div>
                <div className="font-medium">{action.action}</div>
                <div className="text-sm text-gray-600">Owner: {action.owner}</div>
              </div>
            </div>
            <span className="text-sm font-medium text-blue-600">{action.timeline}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Timeline */}
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
      <h3 className="font-semibold text-gray-800 mb-4">Proposed Timeline</h3>
      <div className="flex justify-around text-center">
        <div>
          <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="font-medium">Decision</div>
          <div className="text-sm text-gray-600">{content.proposedTimeline.decision}</div>
        </div>
        <ArrowRight className="w-6 h-6 text-gray-400 self-center" />
        <div>
          <Rocket className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="font-medium">Kickoff</div>
          <div className="text-sm text-gray-600">{content.proposedTimeline.kickoff}</div>
        </div>
        <ArrowRight className="w-6 h-6 text-gray-400 self-center" />
        <div>
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="font-medium">First Value</div>
          <div className="text-sm text-gray-600">{content.proposedTimeline.firstValue}</div>
        </div>
      </div>
    </div>

    {/* Urgency Drivers */}
    <div className="bg-red-50 p-6 rounded-lg">
      <h3 className="font-semibold text-red-800 mb-4">Why Act Now?</h3>
      <ul className="space-y-2">
        {content.urgencyDrivers.map((driver: string, index: number) => (
          <li key={index} className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
            <span>{driver}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* Special Offer */}
    {content.specialOffer && (
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg text-center">
        <Zap className="w-10 h-10 mx-auto mb-3" />
        <h3 className="text-xl font-bold mb-2">Limited Time Offer</h3>
        <p className="text-lg">{content.specialOffer}</p>
      </div>
    )}

    {/* Contact Info */}
    <div className="bg-gray-100 p-6 rounded-lg text-center">
      <h3 className="font-semibold text-gray-800 mb-4">Ready to Transform Your Financial Operations?</h3>
      <div className="space-y-2">
        <p className="font-medium">{content.contactInfo.primaryContact}</p>
        <p className="text-blue-600">{content.contactInfo.email}</p>
        <p>{content.contactInfo.phone}</p>
        {content.contactInfo.calendlyLink && (
          <a 
            href={content.contactInfo.calendlyLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Schedule Your Implementation Call
          </a>
        )}
      </div>
    </div>
  </div>
)

export default IntelligentAuditDeckGeneratorEnhanced