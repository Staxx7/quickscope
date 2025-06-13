// Add to app/api/ai/financial-health-score/route.ts
interface EnhancedFinancialSnapshot {
  profit_margin: number;
  ratios: {
    current_ratio: number;
    debt_to_equity: number;
    operating_margin: number;
  };
  trends: {
    revenue_growth_rate: number;
  };
}

interface FinancialHealthScore {
    overall_score: number; // 0-100
    component_scores: {
      profitability: number;
      liquidity: number;
      solvency: number;
      efficiency: number;
      growth: number;
    };
    red_flags: string[];
    strengths: string[];
    recommendations: string[];
  }
  
  const calculateFinancialHealth = (financialData: EnhancedFinancialSnapshot): FinancialHealthScore => {
    const profitability = Math.min(100, Math.max(0, (financialData.profit_margin + 20) * 2.5));
    const liquidity = Math.min(100, Math.max(0, financialData.ratios.current_ratio * 50));
    const solvency = Math.min(100, Math.max(0, (1 - financialData.ratios.debt_to_equity) * 100));
    const efficiency = Math.min(100, Math.max(0, financialData.ratios.operating_margin * 5));
    const growth = Math.min(100, Math.max(0, (financialData.trends.revenue_growth_rate + 10) * 5));
  
    const overall_score = Math.round(
      (profitability * 0.3) + 
      (liquidity * 0.2) + 
      (solvency * 0.2) + 
      (efficiency * 0.15) + 
      (growth * 0.15)
    );

    // Add industry-specific benchmarking
type IndustryType = 'construction' | 'retail' | 'professional_services' | 'manufacturing';

interface IndustryBenchmark {
  avg_profit_margin: number;
  avg_current_ratio: number;
}

const industryBenchmarks: Record<IndustryType, IndustryBenchmark> = {
  construction: { avg_profit_margin: 3.5, avg_current_ratio: 1.8 },
  retail: { avg_profit_margin: 2.5, avg_current_ratio: 1.5 },
  professional_services: { avg_profit_margin: 15.0, avg_current_ratio: 2.0 },
  manufacturing: { avg_profit_margin: 8.0, avg_current_ratio: 1.4 }
};

const calculatePercentile = (financialData: EnhancedFinancialSnapshot, industry: IndustryType): number => {
  const benchmark = industryBenchmarks[industry];
  const profitMarginScore = (financialData.profit_margin / benchmark.avg_profit_margin) * 50;
  const currentRatioScore = (financialData.ratios.current_ratio / benchmark.avg_current_ratio) * 50;
  return Math.min(100, Math.max(0, (profitMarginScore + currentRatioScore) / 2));
};

const identifyRedFlags = (financialData: EnhancedFinancialSnapshot): string[] => {
  const flags: string[] = [];
  if (financialData.profit_margin < 0) flags.push('Negative profit margin');
  if (financialData.ratios.current_ratio < 1) flags.push('Low liquidity (current ratio < 1)');
  if (financialData.ratios.debt_to_equity > 2) flags.push('High debt-to-equity ratio');
  if (financialData.trends.revenue_growth_rate < -10) flags.push('Significant revenue decline');
  return flags;
};

const identifyStrengths = (financialData: EnhancedFinancialSnapshot): string[] => {
  const strengths: string[] = [];
  if (financialData.profit_margin > 15) strengths.push('Strong profit margin');
  if (financialData.ratios.current_ratio > 2) strengths.push('Excellent liquidity position');
  if (financialData.ratios.debt_to_equity < 1) strengths.push('Conservative debt levels');
  if (financialData.trends.revenue_growth_rate > 20) strengths.push('Strong revenue growth');
  return strengths;
};

const generateRecommendations = (financialData: EnhancedFinancialSnapshot): string[] => {
  const recommendations: string[] = [];
  if (financialData.profit_margin < 5) recommendations.push('Focus on improving profit margins through cost optimization');
  if (financialData.ratios.current_ratio < 1.5) recommendations.push('Strengthen working capital management');
  if (financialData.ratios.debt_to_equity > 1.5) recommendations.push('Consider debt restructuring or equity financing');
  if (financialData.trends.revenue_growth_rate < 0) recommendations.push('Develop growth strategy to reverse revenue decline');
  return recommendations;
};

const benchmarkAgainstIndustry = (financialData: EnhancedFinancialSnapshot, industry: IndustryType) => {
  const benchmark = industryBenchmarks[industry];
  return {
    profit_margin_vs_industry: financialData.profit_margin - benchmark.avg_profit_margin,
    current_ratio_vs_industry: financialData.ratios.current_ratio - benchmark.avg_current_ratio,
    performance_percentile: calculatePercentile(financialData, industry)
  };
};
  
    return {
      overall_score,
      component_scores: { profitability, liquidity, solvency, efficiency, growth },
      red_flags: identifyRedFlags(financialData),
      strengths: identifyStrengths(financialData),
      recommendations: generateRecommendations(financialData)
    };
  };
