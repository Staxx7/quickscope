import { NextRequest, NextResponse } from 'next/server';
import { BLSService, getIndustryContext } from 'app/lib/blsService';
import { CensusService } from 'app/lib/censusService';
import { getFREDEconomicData } from 'app/lib/fredService';
import { getMarketIntelligence } from 'app/lib/marketDataService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const industry = searchParams.get('industry') || 'technology';
    const companySize = searchParams.get('companySize') || 'medium';

    // Initialize services
    const blsService = new BLSService();
    const censusService = new CensusService();

    // Fetch data from all sources in parallel
    const [
      industryMetrics,
      industryDemographics,
      economicIndicators,
      industryContext,
      fredData,
      marketData
    ] = await Promise.all([
      blsService.getIndustryBenchmarks(industry),
      censusService.getIndustryDemographics(industry),
      censusService.getEconomicIndicators(),
      getIndustryContext(industry),
      getFREDEconomicData(industry),
      getMarketIntelligence(industry)
    ]);

    // Calculate competitive positioning with enhanced data
    const competitiveAnalysis = analyzeCompetitivePosition(
      industryMetrics,
      industryDemographics,
      companySize,
      marketData
    );

    // Generate comprehensive market intelligence report
    const marketIntelligence = {
      industry,
      generatedAt: new Date().toISOString(),
      dataSources: {
        bls: industryMetrics ? 'Bureau of Labor Statistics' : null,
        census: industryDemographics ? 'U.S. Census Bureau' : null,
        fred: fredData ? 'Federal Reserve Economic Data' : null,
        marketData: marketData ? 'Alpha Vantage & Finnhub' : null,
        confidence: calculateDataConfidence(industryMetrics, industryDemographics, fredData, marketData)
      },
      marketOverview: {
        totalMarketSize: industryDemographics?.totalEstablishments || 0,
        totalEmployment: industryDemographics?.totalEmployees || 0,
        averageBusinessSize: industryDemographics?.averageEstablishmentSize || 0,
        industryGrowthRate: calculateGrowthRate(industryMetrics),
        economicContext: economicIndicators,
        marketSentiment: marketData?.marketSentiment || 'neutral',
        sectorPerformance: marketData?.sectorPerformance || null
      },
      laborMarket: {
        averageWage: industryMetrics?.averageWage || 0,
        employmentLevel: industryMetrics?.employmentLevel || 0,
        productivityIndex: industryMetrics?.productivityIndex || 100,
        wageGrowthTrend: 'moderate',
        talentAvailability: assessTalentAvailability(industryMetrics),
        unemploymentRate: fredData?.general?.unemploymentRate || null
      },
      economicIndicators: {
        gdpGrowth: fredData?.general?.gdpGrowth || null,
        inflationRate: fredData?.general?.inflationRate || null,
        interestRate: fredData?.general?.interestRate || null,
        consumerSentiment: fredData?.general?.consumerSentiment || null,
        economicOutlook: fredData?.economicOutlook || 'stable'
      },
      marketTrends: {
        industryIndex: marketData?.industryIndex || null,
        volatility: marketData?.volatility || 'medium',
        trendingCompanies: marketData?.trendingCompanies || [],
        upcomingEvents: marketData?.economicEvents || []
      },
      competitiveAnalysis,
      benchmarks: {
        wageCompetitiveness: industryContext?.benchmarkScores?.wageCompetitiveness || 0,
        employmentTrend: industryContext?.benchmarkScores?.employmentTrend || 0,
        productivityRating: industryContext?.benchmarkScores?.productivityRating || 0,
        industryHealthScore: industryContext?.benchmarkScores?.industryHealthScore || 0
      },
      recommendations: generateEnhancedRecommendations(
        industryMetrics,
        industryDemographics,
        competitiveAnalysis,
        fredData,
        marketData
      ),
      geographicInsights: industryDemographics?.geographicDistribution || [],
      sizeDistribution: industryDemographics?.employeeSizeDistribution || []
    };

    return NextResponse.json({
      success: true,
      data: marketIntelligence
    });

  } catch (error) {
    console.error('Market intelligence error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market intelligence data' },
      { status: 500 }
    );
  }
}

function calculateDataConfidence(
  bls: any,
  census: any,
  fred: any,
  market: any
): string {
  const sources = [bls, census, fred, market].filter(Boolean).length;
  if (sources >= 4) return 'very high';
  if (sources >= 3) return 'high';
  if (sources >= 2) return 'medium';
  return 'low';
}

function analyzeCompetitivePosition(
  metrics: any,
  demographics: any,
  companySize: string,
  marketData: any
): any {
  const sizeMultiplier = {
    small: 0.8,
    medium: 1.0,
    large: 1.2
  }[companySize] || 1.0;

  const marketPosition = calculateMarketPosition(demographics, companySize);
  
  return {
    marketPosition,
    competitivePressure: assessCompetitivePressure(demographics),
    barrierToEntry: calculateBarrierToEntry(metrics, demographics),
    growthPotential: assessGrowthPotential(metrics, demographics, sizeMultiplier),
    riskFactors: identifyRiskFactors(metrics, demographics, marketData),
    marketSentiment: marketData?.marketSentiment || 'neutral',
    industryMomentum: assessIndustryMomentum(marketData)
  };
}

function assessIndustryMomentum(marketData: any): string {
  if (!marketData) return 'stable';
  
  const sentiment = marketData.marketSentiment;
  const performance = marketData.sectorPerformance;
  
  if (sentiment === 'bullish' && performance > 2) return 'strong positive';
  if (sentiment === 'bullish' || performance > 0) return 'positive';
  if (sentiment === 'bearish' && performance < -2) return 'negative';
  return 'stable';
}

function calculateGrowthRate(metrics: any): number {
  // Simplified growth calculation based on employment trends
  if (!metrics) return 0;
  return metrics.employmentLevel > 100000 ? 5.2 : 3.8;
}

function assessTalentAvailability(metrics: any): string {
  if (!metrics) return 'unknown';
  if (metrics.employmentLevel > 500000) return 'abundant';
  if (metrics.employmentLevel > 100000) return 'adequate';
  return 'limited';
}

function calculateMarketPosition(demographics: any, companySize: string): string {
  if (!demographics) return 'unknown';
  
  const avgSize = demographics.averageEstablishmentSize;
  if (companySize === 'large' && avgSize < 50) return 'market leader';
  if (companySize === 'medium' && avgSize < 20) return 'above average';
  if (companySize === 'small' && avgSize > 50) return 'niche player';
  return 'competitive';
}

function assessCompetitivePressure(demographics: any): string {
  if (!demographics) return 'unknown';
  
  const establishments = demographics.totalEstablishments;
  if (establishments > 100000) return 'very high';
  if (establishments > 50000) return 'high';
  if (establishments > 10000) return 'moderate';
  return 'low';
}

function calculateBarrierToEntry(metrics: any, demographics: any): string {
  if (!metrics || !demographics) return 'unknown';
  
  const avgWage = metrics.averageWage;
  const avgSize = demographics.averageEstablishmentSize;
  
  if (avgWage > 40 && avgSize > 50) return 'high';
  if (avgWage > 30 || avgSize > 20) return 'moderate';
  return 'low';
}

function assessGrowthPotential(metrics: any, demographics: any, sizeMultiplier: number): number {
  let potential = 50; // Base score
  
  if (metrics) {
    if (metrics.productivityIndex > 105) potential += 20;
    if (metrics.employmentLevel > 100000) potential += 15;
  }
  
  if (demographics) {
    if (demographics.averageEstablishmentSize < 20) potential += 15;
  }
  
  return Math.min(100, potential * sizeMultiplier);
}

function identifyRiskFactors(metrics: any, demographics: any, marketData: any): string[] {
  const risks = [];
  
  if (metrics) {
    if (metrics.productivityIndex < 95) {
      risks.push('Below average industry productivity');
    }
    if (metrics.averageWage > 45) {
      risks.push('High labor costs compared to other industries');
    }
  }
  
  if (demographics) {
    if (demographics.totalEstablishments > 100000) {
      risks.push('Highly saturated market');
    }
    if (demographics.averageEstablishmentSize > 100) {
      risks.push('Dominated by large competitors');
    }
  }

  if (marketData) {
    if (marketData.volatility === 'high') {
      risks.push('High market volatility in sector');
    }
    if (marketData.marketSentiment === 'bearish') {
      risks.push('Negative market sentiment');
    }
  }
  
  if (risks.length === 0) {
    risks.push('Standard market risks apply');
  }
  
  return risks;
}

function generateEnhancedRecommendations(
  metrics: any,
  demographics: any,
  competitive: any,
  fredData: any,
  marketData: any
): string[] {
  const recommendations = [];
  
  // Wage strategy recommendations
  if (metrics?.averageWage) {
    if (metrics.averageWage > 40) {
      recommendations.push('Consider automation to offset high labor costs');
    } else if (metrics.averageWage < 25) {
      recommendations.push('Opportunity to attract talent with competitive wages');
    }
  }
  
  // Market positioning recommendations
  if (competitive.marketPosition === 'niche player') {
    recommendations.push('Focus on specialized services to differentiate');
  } else if (competitive.marketPosition === 'market leader') {
    recommendations.push('Leverage market position for strategic partnerships');
  }
  
  // Growth strategy recommendations
  if (competitive.growthPotential > 70) {
    recommendations.push('Aggressive growth strategy recommended');
  } else if (competitive.growthPotential < 40) {
    recommendations.push('Focus on operational efficiency and margin improvement');
  }

  // Economic condition recommendations
  if (fredData?.general?.inflationRate > 3) {
    recommendations.push('Implement pricing strategies to offset inflation impact');
  }
  
  if (fredData?.general?.interestRate > 4) {
    recommendations.push('Optimize capital structure given high interest rates');
  }

  // Market trend recommendations
  if (marketData?.marketSentiment === 'bullish') {
    recommendations.push('Capitalize on positive market sentiment for expansion');
  } else if (marketData?.marketSentiment === 'bearish') {
    recommendations.push('Focus on defensive strategies and cash preservation');
  }
  
  // Geographic expansion
  if (demographics?.geographicDistribution?.length > 0) {
    recommendations.push('Consider geographic expansion to underserved regions');
  }
  
  return recommendations;
}