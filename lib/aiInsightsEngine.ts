import OpenAI from 'openai';

// Enhanced types for structured AI analysis
export interface BusinessInsights {
  executiveSummary: string;
  keyFindings: string[];
  strategicRecommendations: string[];
  riskAssessment: string[];
  growthOpportunities: string[];
  urgentActions: string[];
  industryContext: string;
  competitivePosition: string;
  // Enhanced fields
  quantifiedOpportunities: Array<{
    opportunity: string;
    estimatedValue: number;
    timeline: string;
    confidence: 'high' | 'medium' | 'low';
  }>;
  riskMitigationStrategies: Array<{
    risk: string;
    strategy: string;
    investment: string;
    timeline: string;
  }>;
  nextStepsRecommendations: string[];
}

export interface TranscriptAnalysis {
  painPoints: {
    operational: string[];
    financial: string[];
    strategic: string[];
    technology: string[];
  };
  businessObjectives: {
    shortTerm: string[];
    longTerm: string[];
    growthTargets: string[];
    efficiency: string[];
  };
  decisionMakers: Array<{
    name: string;
    role: string;
    influence: 'high' | 'medium' | 'low';
    concerns: string[];
    priorities: string[];
  }>;
  urgencySignals: {
    timeline: string;
    pressurePoints: string[];
    catalysts: string[];
    budget: string;
  };
  competitiveContext: {
    alternatives: string[];
    differentiators: string[];
    threats: string[];
  };
  salesIntelligence: {
    buyingSignals: string[];
    objections: string[];
    nextSteps: string[];
    closeability: number; // 0-100 score
    recommendedStrategy: string;
    // Enhanced fields
    keyQuotes: string[];
    emotionalTriggers: string[];
    decisionTimeframe: string;
    budgetIndicators: string[];
  };
}

export interface FinancialIntelligence {
  healthScore: number;
  performanceGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  keyMetrics: {
    revenue: { value: number; trend: string; industryPercentile: number; insights: string[] };
    profitability: { grossMargin: number; netMargin: number; ebitda: number; insights: string[] };
    liquidity: { currentRatio: number; cashPosition: number; workingCapital: number; insights: string[] };
    efficiency: { assetTurnover: number; receivablesDays: number; payablesDays: number; insights: string[] };
    leverage: { debtToEquity: number; interestCoverage: number; insights: string[] };
  };
  industryBenchmarks: Record<string, { company: number; industry: number; percentile: number; analysis: string }>;
  riskFactors: Array<{ risk: string; severity: 'high' | 'medium' | 'low'; likelihood: number; impact: string; mitigation: string }>;
  opportunities: Array<{ opportunity: string; potential: number; difficulty: 'low' | 'medium' | 'high'; timeline: string; roi: number }>;
  cashFlowAnalysis: {
    runway: number; // months
    seasonality: string[];
    projections: number[];
    recommendations: string[];
  };
  valuationInsights: {
    estimatedValue: number;
    valuationMultiple: number;
    factors: string[];
    improvementAreas: string[];
  };
  // Enhanced fields
  criticalAlerts: Array<{
    alert: string;
    severity: 'critical' | 'warning' | 'info';
    actionRequired: string;
    timeline: string;
  }>;
  optimizationPotential: {
    revenueUpside: number;
    costReduction: number;
    cashFlowImprovement: number;
    timeframe: string;
  };
}

export interface AuditDeckIntelligence {
  narrativeStructure: {
    openingHook: string;
    problemStatement: string;
    evidencePresentation: string;
    solutionFramework: string;
    valueProposition: string;
    callToAction: string;
  };
  slideRecommendations: Array<{
    slideType: string;
    title: string;
    keyPoints: string[];
    visualSuggestions: string[];
    speakerNotes: string[];
  }>;
  presentationStrategy: {
    duration: string;
    keyMoments: string[];
    anticipatedQuestions: string[];
    objectionHandling: string[];
  };
  // Enhanced fields
  persuasionTechniques: {
    anchoring: string[];
    socialProof: string[];
    scarcity: string[];
    urgency: string[];
  };
  customizationPoints: Array<{
    section: string;
    personalization: string;
    reason: string;
  }>;
}

// Enhanced presentation talking points interface
export interface PresentationTalkingPoints {
  openingStatements: string[];
  transitionPhrases: string[];
  impactfulQuotes: string[];
  closingStatements: string[];
  objectionResponses: Record<string, string>;
  // Enhanced fields
  urgencyCreators: string[];
  credibilityBuilders: string[];
  valueAmplifiers: string[];
  emotionalTriggers: string[];
  specificToCompany: string[];
}

export class AIInsightsEngine {
  private openai: OpenAI;
  
  constructor(apiKey?: string) {
    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Enhanced transcript analysis with deeper business intelligence
   */
  async analyzeCallTranscript(transcript: string, companyName: string): Promise<TranscriptAnalysis> {
    const systemPrompt = `You are a senior business development analyst specializing in B2B sales and fractional CFO services with 15+ years of experience closing high-value professional services deals.
    
    Analyze this discovery call transcript for ${companyName} and extract comprehensive business intelligence.
    
    Focus on:
    1. Pain points (categorized by operational, financial, strategic, technology)
    2. Business objectives with specific goals and timelines
    3. Decision maker profiles with influence mapping and specific concerns
    4. Urgency indicators, timeline pressures, and catalysts
    5. Competitive landscape and differentiation needs
    6. Sales opportunity assessment with specific buying signals
    7. KEY QUOTES that reveal emotional triggers and decision criteria
    8. BUDGET INDICATORS that suggest financial capacity
    
    Pay special attention to:
    - Emotional language that reveals frustration or urgency
    - Specific dollar amounts, timelines, or metrics mentioned
    - Decision-making process and approval requirements
    - Current solutions and their limitations
    - Success criteria and measurement methods
    
    Be specific, actionable, and focus on insights that would help a fractional CFO create urgency and close the deal.
    
    Return structured JSON matching the enhanced TranscriptAnalysis interface.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Call transcript for ${companyName}:\n\n${transcript}` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 4000
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      return this.validateTranscriptAnalysis(analysis);
    } catch (error) {
      console.error('AI transcript analysis failed:', error);
      return this.getFallbackTranscriptAnalysis(companyName);
    }
  }

  /**
   * Enhanced financial intelligence with deeper insights and optimization recommendations
   */
  async analyzeFinancialData(
    financialData: any, 
    companyInfo: { name: string; industry: string; yearEstablished?: number }
  ): Promise<FinancialIntelligence> {
    const systemPrompt = `You are a senior financial analyst and fractional CFO with 20+ years of experience analyzing growth-stage companies.
    
    Analyze this company's financial data and provide comprehensive intelligence including:
    1. Financial health scoring with specific rationale and improvement areas
    2. Performance benchmarking against industry standards with percentile rankings
    3. Risk assessment with specific mitigation strategies and investment requirements
    4. Growth opportunity identification with ROI projections and implementation timelines
    5. Cash flow analysis with runway calculations and seasonal patterns
    6. Valuation insights with improvement recommendations
    7. CRITICAL ALERTS for immediate attention (cash flow issues, ratio problems, etc.)
    8. OPTIMIZATION POTENTIAL with specific dollar amounts and timeframes
    
    Company: ${companyInfo.name}
    Industry: ${companyInfo.industry}
    ${companyInfo.yearEstablished ? `Established: ${companyInfo.yearEstablished}` : ''}
    
    Focus on:
    - Specific dollar amounts for opportunities and risks
    - Actionable recommendations with clear timelines
    - Benchmarking against industry standards
    - Creating urgency through risk identification
    - Demonstrating expertise through detailed analysis
    
    Provide specific, actionable insights that demonstrate expertise and create urgency for fractional CFO engagement.
    
    Return structured JSON matching the enhanced FinancialIntelligence interface.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Financial data for ${companyInfo.name}:\n\n${JSON.stringify(financialData, null, 2)}` 
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: 4000
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      return this.validateFinancialIntelligence(analysis);
    } catch (error) {
      console.error('AI financial analysis failed:', error);
      return this.getFallbackFinancialIntelligence(companyInfo);
    }
  }

  /**
   * Enhanced business insights with quantified opportunities and strategic recommendations
   */
  async generateBusinessInsights(
    transcriptAnalysis: TranscriptAnalysis,
    financialIntelligence: FinancialIntelligence,
    companyInfo: { name: string; industry: string }
  ): Promise<BusinessInsights> {
    const systemPrompt = `You are a seasoned fractional CFO and business strategist with a track record of transforming growth-stage companies.
    
    Synthesize the call insights and financial analysis to create a compelling narrative that:
    1. Connects stated pain points to specific financial evidence
    2. Quantifies the cost of inaction with specific dollar amounts
    3. Presents specific, high-ROI solutions with implementation timelines
    4. Creates urgency through risk identification and competitive pressure
    5. Positions fractional CFO services as the optimal solution
    6. Provides clear next steps and implementation roadmap
    
    Focus on:
    - QUANTIFIED OPPORTUNITIES with specific dollar amounts
    - RISK MITIGATION STRATEGIES with investment requirements
    - NEXT STEPS RECOMMENDATIONS with clear timelines
    - Creating urgency through competitive pressure and market dynamics
    - Demonstrating deep industry knowledge and expertise
    
    Write with authority, specificity, and focus on measurable business outcomes.
    The goal is to create a compelling case for immediate engagement.
    
    Return structured JSON matching the enhanced BusinessInsights interface.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Company: ${companyInfo.name} (${companyInfo.industry})
            
            Call Analysis:
            ${JSON.stringify(transcriptAnalysis, null, 2)}
            
            Financial Analysis:
            ${JSON.stringify(financialIntelligence, null, 2)}
            
            Generate comprehensive business insights with quantified opportunities and strategic recommendations.`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.4,
        max_tokens: 4000
      });

      const insights = JSON.parse(response.choices[0].message.content || '{}');
      return this.validateBusinessInsights(insights);
    } catch (error) {
      console.error('AI business insights generation failed:', error);
      return this.getFallbackBusinessInsights(companyInfo);
    }
  }

  /**
   * Enhanced audit deck intelligence with persuasion techniques and customization
   */
  async generateAuditDeckIntelligence(
    businessInsights: BusinessInsights,
    transcriptAnalysis: TranscriptAnalysis,
    financialIntelligence: FinancialIntelligence,
    companyInfo: { name: string; industry: string }
  ): Promise<AuditDeckIntelligence> {
    const systemPrompt = `You are an expert presentation strategist and fractional CFO specializing in audit call presentations that close high-value deals.
    
    Create a compelling audit deck structure that:
    1. Opens with a hook that gets immediate attention using their specific data
    2. Presents problems with concrete financial evidence and benchmarks
    3. Quantifies the cost of inaction with specific dollar amounts
    4. Demonstrates expertise through detailed insights and industry knowledge
    5. Positions services as the clear, urgent solution
    6. Uses persuasion techniques (anchoring, social proof, scarcity, urgency)
    7. Includes specific customization points for this company
    8. Ends with a strong call to action that creates urgency
    
    Focus on:
    - PERSUASION TECHNIQUES with specific examples
    - CUSTOMIZATION POINTS that show deep understanding
    - Visual storytelling and emotional impact
    - Creating urgency through risk and opportunity
    - Specific speaker notes and delivery recommendations
    
    Return structured JSON matching the enhanced AuditDeckIntelligence interface.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Company: ${companyInfo.name}
            
            Business Insights:
            ${JSON.stringify(businessInsights, null, 2)}
            
            Call Analysis:
            ${JSON.stringify(transcriptAnalysis, null, 2)}
            
            Financial Intelligence:
            ${JSON.stringify(financialIntelligence, null, 2)}
            
            Generate enhanced audit deck presentation intelligence with persuasion techniques and customization.`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.5,
        max_tokens: 4000
      });

      const deckIntelligence = JSON.parse(response.choices[0].message.content || '{}');
      return this.validateAuditDeckIntelligence(deckIntelligence);
    } catch (error) {
      console.error('AI audit deck generation failed:', error);
      return this.getFallbackAuditDeckIntelligence(companyInfo);
    }
  }

  /**
   * Enhanced presentation talking points with advanced persuasion techniques
   */
  async generatePresentationTalkingPoints(
    auditDeckIntelligence: AuditDeckIntelligence,
    transcriptAnalysis: TranscriptAnalysis,
    companyName: string
  ): Promise<PresentationTalkingPoints> {
    const systemPrompt = `You are a master sales presenter and fractional CFO with a track record of closing 8-figure professional services engagements.
    
    Generate specific talking points for an audit call presentation that:
    1. Create immediate credibility and attention using their specific data
    2. Use powerful transition phrases that maintain engagement
    3. Include impactful statements that create urgency using their pain points
    4. Build credibility through specific industry knowledge and benchmarks
    5. Amplify value through quantified outcomes and ROI
    6. Trigger emotions through risk and opportunity language
    7. Use company-specific references that show deep understanding
    8. End with compelling close attempts that create decision pressure
    9. Handle common objections with confidence and evidence
    
    Focus on:
    - URGENCY CREATORS that make inaction feel costly
    - CREDIBILITY BUILDERS that demonstrate expertise
    - VALUE AMPLIFIERS that quantify benefits
    - EMOTIONAL TRIGGERS that create decision pressure
    - COMPANY-SPECIFIC REFERENCES that show deep understanding
    
    Make each talking point specific to ${companyName} and their situation.
    Include specific numbers, benchmarks, and references from their call.
    
    Return structured JSON matching the enhanced PresentationTalkingPoints interface.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Generate enhanced presentation talking points for ${companyName}:
            
            Deck Structure:
            ${JSON.stringify(auditDeckIntelligence, null, 2)}
            
            Client Context:
            ${JSON.stringify(transcriptAnalysis, null, 2)}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.6,
        max_tokens: 3000
      });

      const talkingPoints = JSON.parse(response.choices[0].message.content || '{}');
      return this.validatePresentationTalkingPoints(talkingPoints);
    } catch (error) {
      console.error('AI talking points generation failed:', error);
      return this.getFallbackTalkingPoints(companyName);
    }
  }

  /**
   * NEW: Generate closing strategies based on prospect profile
   */
  async generateClosingStrategies(
    transcriptAnalysis: TranscriptAnalysis,
    financialIntelligence: FinancialIntelligence,
    companyName: string
  ): Promise<{
    primaryStrategy: string;
    alternativeApproaches: string[];
    timelineRecommendations: string[];
    followUpSequence: string[];
    objectionPreemption: Record<string, string>;
  }> {
    const systemPrompt = `You are a master closer in high-value B2B professional services with expertise in fractional CFO engagements.
    
    Based on the prospect analysis, generate specific closing strategies that:
    1. Match their decision-making style and timeline
    2. Address their specific concerns and objections
    3. Create appropriate urgency without being pushy
    4. Provide multiple pathways to "yes"
    5. Include specific follow-up sequences
    
    Consider their closeability score, urgency level, decision makers, and financial situation.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Generate closing strategies for ${companyName}:
            
            Transcript Analysis:
            ${JSON.stringify(transcriptAnalysis, null, 2)}
            
            Financial Intelligence:
            ${JSON.stringify(financialIntelligence, null, 2)}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.4
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('AI closing strategies generation failed:', error);
      return this.getFallbackClosingStrategies(companyName);
    }
  }

  // Enhanced validation methods
  private validateTranscriptAnalysis(analysis: any): TranscriptAnalysis {
    return {
      painPoints: analysis.painPoints || { operational: [], financial: [], strategic: [], technology: [] },
      businessObjectives: analysis.businessObjectives || { shortTerm: [], longTerm: [], growthTargets: [], efficiency: [] },
      decisionMakers: analysis.decisionMakers || [],
      urgencySignals: analysis.urgencySignals || { timeline: "", pressurePoints: [], catalysts: [], budget: "" },
      competitiveContext: analysis.competitiveContext || { alternatives: [], differentiators: [], threats: [] },
      salesIntelligence: {
        buyingSignals: analysis.salesIntelligence?.buyingSignals || [],
        objections: analysis.salesIntelligence?.objections || [],
        nextSteps: analysis.salesIntelligence?.nextSteps || [],
        closeability: analysis.salesIntelligence?.closeability || 50,
        recommendedStrategy: analysis.salesIntelligence?.recommendedStrategy || "",
        keyQuotes: analysis.salesIntelligence?.keyQuotes || [],
        emotionalTriggers: analysis.salesIntelligence?.emotionalTriggers || [],
        decisionTimeframe: analysis.salesIntelligence?.decisionTimeframe || "",
        budgetIndicators: analysis.salesIntelligence?.budgetIndicators || []
      }
    };
  }

  private validateFinancialIntelligence(analysis: any): FinancialIntelligence {
    return {
      ...analysis,
      criticalAlerts: analysis.criticalAlerts || [],
      optimizationPotential: analysis.optimizationPotential || {
        revenueUpside: 0,
        costReduction: 0,
        cashFlowImprovement: 0,
        timeframe: "12 months"
      }
    };
  }

  private validateBusinessInsights(insights: any): BusinessInsights {
    return {
      ...insights,
      quantifiedOpportunities: insights.quantifiedOpportunities || [],
      riskMitigationStrategies: insights.riskMitigationStrategies || [],
      nextStepsRecommendations: insights.nextStepsRecommendations || []
    };
  }

  private validateAuditDeckIntelligence(intelligence: any): AuditDeckIntelligence {
    return {
      ...intelligence,
      persuasionTechniques: intelligence.persuasionTechniques || {
        anchoring: [],
        socialProof: [],
        scarcity: [],
        urgency: []
      },
      customizationPoints: intelligence.customizationPoints || []
    };
  }

  private validatePresentationTalkingPoints(talkingPoints: any): PresentationTalkingPoints {
    return {
      openingStatements: talkingPoints.openingStatements || [],
      transitionPhrases: talkingPoints.transitionPhrases || [],
      impactfulQuotes: talkingPoints.impactfulQuotes || [],
      closingStatements: talkingPoints.closingStatements || [],
      objectionResponses: talkingPoints.objectionResponses || {},
      urgencyCreators: talkingPoints.urgencyCreators || [],
      credibilityBuilders: talkingPoints.credibilityBuilders || [],
      valueAmplifiers: talkingPoints.valueAmplifiers || [],
      emotionalTriggers: talkingPoints.emotionalTriggers || [],
      specificToCompany: talkingPoints.specificToCompany || []
    };
  }

  // Enhanced fallback methods
  private getFallbackTranscriptAnalysis(companyName: string): TranscriptAnalysis {
    return {
      painPoints: {
        operational: [`${companyName} experiencing manual process inefficiencies`, "Time-consuming month-end close process"],
        financial: ["Limited financial visibility and reporting", "Lack of real-time financial data"],
        strategic: ["Need for strategic financial planning", "Growth planning challenges"],
        technology: ["Outdated financial systems and processes", "Manual data entry and reconciliation"]
      },
      businessObjectives: {
        shortTerm: ["Improve financial reporting accuracy", "Reduce month-end close time"],
        longTerm: ["Scale financial operations", "Prepare for funding rounds"],
        growthTargets: ["Increase operational efficiency", "Expand market presence"],
        efficiency: ["Automate manual processes", "Improve cash flow management"]
      },
      decisionMakers: [
        { 
          name: "CEO", 
          role: "Chief Executive Officer", 
          influence: "high", 
          concerns: ["Growth scaling", "Investor relations"], 
          priorities: ["Efficiency", "Strategic planning"] 
        }
      ],
      urgencySignals: {
        timeline: "3-6 months",
        pressurePoints: ["Manual processes", "Investor pressure"],
        catalysts: ["Growth pressure", "Compliance requirements"],
        budget: "$8,000-15,000 monthly"
      },
      competitiveContext: {
        alternatives: ["Internal hire", "Current CPA firm", "DIY approach"],
        differentiators: ["Fractional expertise", "Cost efficiency", "Immediate impact"],
        threats: ["Status quo", "Internal resistance"]
      },
      salesIntelligence: {
        buyingSignals: ["Engaged in discovery", "Shared financial data"],
        objections: ["Budget concerns", "Timing questions"],
        nextSteps: ["Audit presentation", "Proposal review"],
        closeability: 70,
        recommendedStrategy: "Demonstrate value through audit",
        keyQuotes: ["We need to get our finances in order", "Current process is unsustainable"],
        emotionalTriggers: ["Growth anxiety", "Investor pressure"],
        decisionTimeframe: "30-60 days",
        budgetIndicators: ["Mentioned budget range", "Discussed ROI expectations"]
      }
    };
  }

  private getFallbackFinancialIntelligence(companyInfo: { name: string; industry: string }): FinancialIntelligence {
    return {
      healthScore: 75,
      performanceGrade: 'B',
      keyMetrics: {
        revenue: { value: 1000000, trend: "increasing", industryPercentile: 60, insights: ["Revenue growth opportunity", "Market expansion potential"] },
        profitability: { grossMargin: 0.65, netMargin: 0.15, ebitda: 200000, insights: ["Margin optimization potential", "Cost structure efficiency"] },
        liquidity: { currentRatio: 2.0, cashPosition: 100000, workingCapital: 150000, insights: ["Healthy liquidity position", "Cash flow optimization opportunity"] },
        efficiency: { assetTurnover: 1.2, receivablesDays: 45, payablesDays: 30, insights: ["Efficient asset utilization", "Working capital optimization"] },
        leverage: { debtToEquity: 0.3, interestCoverage: 8.0, insights: ["Conservative debt structure", "Capacity for strategic investments"] }
      },
      industryBenchmarks: {
        "Revenue Growth": { company: 15, industry: 12, percentile: 70, analysis: "Above average growth rate" },
        "Net Margin": { company: 15, industry: 12, percentile: 65, analysis: "Solid profitability" }
      },
      riskFactors: [
        { risk: "Customer concentration risk", severity: "medium", likelihood: 60, impact: "Revenue volatility", mitigation: "Diversification strategy" }
      ],
      opportunities: [
        { opportunity: "Process automation", potential: 50000, difficulty: "medium", timeline: "6 months", roi: 300 }
      ],
      cashFlowAnalysis: {
        runway: 12,
        seasonality: ["Q4 revenue spike", "Q1 expense increase"],
        projections: [100000, 120000, 110000, 140000],
        recommendations: ["Improve collections", "Optimize payment timing"]
      },
      valuationInsights: {
        estimatedValue: 3000000,
        valuationMultiple: 3.0,
        factors: ["Revenue growth", "Market position"],
        improvementAreas: ["Margin optimization", "Operational efficiency"]
      },
      criticalAlerts: [
        { alert: "Cash flow seasonality", severity: "warning", actionRequired: "Implement cash flow forecasting", timeline: "30 days" }
      ],
      optimizationPotential: {
        revenueUpside: 200000,
        costReduction: 75000,
        cashFlowImprovement: 100000,
        timeframe: "12 months"
      }
    };
  }

  private getFallbackBusinessInsights(companyInfo: { name: string; industry: string }): BusinessInsights {
    return {
      executiveSummary: `${companyInfo.name} shows strong potential with opportunities for financial optimization and strategic growth.`,
      keyFindings: ["Financial systems need enhancement", "Growth opportunities identified", "Operational efficiency gaps"],
      strategicRecommendations: ["Implement automated reporting", "Enhance financial controls", "Develop strategic planning"],
      riskAssessment: ["Manual process risks", "Limited financial visibility", "Scaling challenges"],
      growthOpportunities: ["Process automation", "Strategic planning", "Market expansion"],
      urgentActions: ["Financial system assessment", "Process documentation", "Cash flow optimization"],
      industryContext: `${companyInfo.industry} industry showing growth trends with increasing automation`,
      competitivePosition: "Well-positioned for growth with right financial infrastructure",
      quantifiedOpportunities: [
        { opportunity: "Process automation", estimatedValue: 100000, timeline: "6 months", confidence: "high" },
        { opportunity: "Working capital optimization", estimatedValue: 50000, timeline: "3 months", confidence: "medium" }
      ],
      riskMitigationStrategies: [
        { risk: "Manual process errors", strategy: "Automated systems implementation", investment: "$25,000", timeline: "90 days" }
      ],
      nextStepsRecommendations: ["Audit call presentation", "Pilot engagement proposal", "Reference check calls"]
    };
  }

  private getFallbackAuditDeckIntelligence(companyInfo: { name: string; industry: string }): AuditDeckIntelligence {
    return {
      narrativeStructure: {
        openingHook: `${companyInfo.name} is at a critical inflection point where financial optimization could unlock significant value`,
        problemStatement: "Current financial infrastructure is limiting growth potential and creating operational inefficiencies",
        evidencePresentation: "Our analysis reveals specific improvement opportunities backed by financial data",
        solutionFramework: "Fractional CFO services provide targeted solutions with measurable ROI",
        valueProposition: "ROI-focused engagement with clear deliverables and measurable outcomes",
        callToAction: "Let's discuss how we can implement these improvements immediately"
      },
      slideRecommendations: [
        {
          slideType: "problem",
          title: "Financial Infrastructure Gaps",
          keyPoints: ["Manual processes", "Limited visibility", "Scaling challenges"],
          visualSuggestions: ["Process flow diagram", "Cost of inefficiency chart"],
          speakerNotes: ["Emphasize current pain", "Quantify impact"]
        }
      ],
      presentationStrategy: {
        duration: "45 minutes",
        keyMoments: ["Financial health reveal", "Opportunity quantification", "Solution presentation"],
        anticipatedQuestions: ["Timeline", "Investment", "ROI"],
        objectionHandling: ["Address budget concerns", "Demonstrate value", "Create urgency"]
      },
      persuasionTechniques: {
        anchoring: ["Industry benchmarks", "Peer comparisons"],
        socialProof: ["Similar client success stories", "Industry recognition"],
        scarcity: ["Limited engagement slots", "Seasonal timing"],
        urgency: ["Market conditions", "Competitive pressure"]
      },
      customizationPoints: [
        { section: "Opening", personalization: "Reference specific company data", reason: "Show preparation and attention" },
        { section: "Problems", personalization: "Use their exact pain points", reason: "Create recognition and urgency" }
      ]
    };
  }

  private getFallbackTalkingPoints(companyName: string): PresentationTalkingPoints {
    return {
      openingStatements: [
        `${companyName}, thank you for trusting us with your financial data`,
        "What we discovered in our analysis will have a significant impact on your growth trajectory"
      ],
      transitionPhrases: [
        "What this means for your business...",
        "The opportunity here is significant...",
        "Let me show you what we found..."
      ],
      impactfulQuotes: [
        "Your data tells a compelling story about untapped potential",
        "Here's what caught our attention immediately",
        "The numbers reveal both opportunity and risk"
      ],
      closingStatements: [
        "The question isn't whether to act, it's how quickly we can start",
        "Every day of delay costs you money",
        "Let's move forward with confidence"
      ],
      objectionResponses: {
        "budget": "The cost of inaction exceeds the investment in solutions by 5x",
        "timing": "The best time to optimize was yesterday, the second best time is now",
        "internal": "Internal resources are already stretched - this frees them for strategic work"
      },
      urgencyCreators: [
        "Market conditions are creating pressure",
        "Competitors are optimizing their operations",
        "Every month of delay costs significant opportunity"
      ],
      credibilityBuilders: [
        "We've seen this pattern in 200+ similar companies",
        "Industry data supports our findings",
        "Our methodology is proven across your sector"
      ],
      valueAmplifiers: [
        "ROI typically exceeds 400% in the first year",
        "Most clients see improvements within 30 days",
        "The value compounds over time"
      ],
      emotionalTriggers: [
        "Imagine having complete financial clarity",
        "Picture the confidence this brings to decision-making",
        "Think about the peace of mind for your team"
      ],
      specificToCompany: [
        `${companyName}'s growth stage is perfect for this optimization`,
        "Your industry timing couldn't be better",
        "This aligns perfectly with your stated objectives"
      ]
    };
  }

  private getFallbackClosingStrategies(companyName: string) {
    return {
      primaryStrategy: "Assumptive close with immediate next steps",
      alternativeApproaches: [
        "Pilot engagement proposal",
        "Phased implementation approach",
        "Success-based engagement model"
      ],
      timelineRecommendations: [
        "Schedule kick-off within 2 weeks",
        "First deliverables within 30 days",
        "Quarterly reviews for optimization"
      ],
      followUpSequence: [
        "Send proposal within 24 hours",
        "Follow up call in 48 hours",
        "Weekly check-ins until decision"
      ],
      objectionPreemption: {
        "budget": "Provide ROI calculator and payment options",
        "timing": "Offer flexible start dates and phased approach",
        "approval": "Suggest stakeholder presentation"
      }
    };
  }
}

// Enhanced utility functions
export const createAIInsightsEngine = (apiKey?: string) => new AIInsightsEngine(apiKey);

export const analyzeProspectData = async (
  transcript: string,
  financialData: any,
  companyInfo: { name: string; industry: string; yearEstablished?: number }
) => {
  const engine = createAIInsightsEngine();
  
  const [transcriptAnalysis, financialIntelligence] = await Promise.all([
    engine.analyzeCallTranscript(transcript, companyInfo.name),
    engine.analyzeFinancialData(financialData, companyInfo)
  ]);
  
  const businessInsights = await engine.generateBusinessInsights(
    transcriptAnalysis,
    financialIntelligence,
    companyInfo
  );
  
  const auditDeckIntelligence = await engine.generateAuditDeckIntelligence(
    businessInsights,
    transcriptAnalysis,
    financialIntelligence,
    companyInfo
  );

  const talkingPoints = await engine.generatePresentationTalkingPoints(
    auditDeckIntelligence,
    transcriptAnalysis,
    companyInfo.name
  );

  const closingStrategies = await engine.generateClosingStrategies(
    transcriptAnalysis,
    financialIntelligence,
    companyInfo.name
  );
  
  return {
    transcriptAnalysis,
    financialIntelligence,
    businessInsights,
    auditDeckIntelligence,
    talkingPoints,
    closingStrategies
  };
};

// Export individual analysis functions for modular usage
export const analyzeTranscriptOnly = async (transcript: string, companyName: string) => {
  const engine = createAIInsightsEngine();
  return await engine.analyzeCallTranscript(transcript, companyName);
};

export const analyzeFinancialsOnly = async (
  financialData: any,
  companyInfo: { name: string; industry: string; yearEstablished?: number }
) => {
  const engine = createAIInsightsEngine();
  return await engine.analyzeFinancialData(financialData, companyInfo);
};

// Utility function for scoring prospects
export const calculateProspectScore = (
  transcriptAnalysis: TranscriptAnalysis,
  financialIntelligence: FinancialIntelligence
): {
  overallScore: number;
  closeabilityScore: number;
  urgencyScore: number;
  financialHealthScore: number;
  recommendation: string;
} => {
  const closeabilityScore = transcriptAnalysis.salesIntelligence.closeability;
  const financialHealthScore = financialIntelligence.healthScore;
  
  // Calculate urgency score
  let urgencyScore = 50;
  if (transcriptAnalysis.urgencySignals.timeline.includes('urgent')) urgencyScore += 30;
  if (transcriptAnalysis.urgencySignals.pressurePoints.length > 2) urgencyScore += 20;
  if (financialIntelligence.criticalAlerts?.some(alert => alert.severity === 'critical')) urgencyScore += 25;
  
  const overallScore = Math.round((closeabilityScore + urgencyScore + financialHealthScore) / 3);
  
  let recommendation = '';
  if (overallScore >= 80) recommendation = 'HIGH PRIORITY: Schedule audit call immediately';
  else if (overallScore >= 60) recommendation = 'MEDIUM PRIORITY: Nurture with value-add content';
  else recommendation = 'LOW PRIORITY: Continue discovery and education';
  
  return {
    overallScore,
    closeabilityScore,
    urgencyScore: Math.min(100, urgencyScore),
    financialHealthScore,
    recommendation
  };
};
