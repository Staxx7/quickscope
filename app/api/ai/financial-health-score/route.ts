// Add to app/api/ai/financial-health-score/route.ts
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
const industryBenchmarks = {
    'construction': { avg_profit_margin: 3.5, avg_current_ratio: 1.8 },
    'retail': { avg_profit_margin: 2.5, avg_current_ratio: 1.5 },
    'professional_services': { avg_profit_margin: 15.0, avg_current_ratio: 2.0 },
    'manufacturing': { avg_profit_margin: 8.0, avg_current_ratio: 1.4 }
  };
  
  const benchmarkAgainstIndustry = (financialData: EnhancedFinancialSnapshot, industry: string) => {
    const benchmark = industryBenchmarks[industry] || industryBenchmarks['professional_services'];
    
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
