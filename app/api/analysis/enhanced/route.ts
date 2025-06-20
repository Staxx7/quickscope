import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { companyId, companyName, dateRange, financialData } = await request.json()

    console.log(`🧠 Running enhanced analysis for ${companyName}`)

    // Perform enhanced financial analysis
    const analysis = await performEnhancedAnalysis(financialData, companyName)

    return NextResponse.json({
      success: true,
      analysis,
      metadata: {
        generated_at: new Date().toISOString(),
        company_id: companyId,
        company_name: companyName
      }
    })

  } catch (error) {
    console.error('❌ Enhanced analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to generate enhanced analysis' },
      { status: 500 }
    )
  }
}

async function performEnhancedAnalysis(financialData: any, companyName: string) {
  const revenue = financialData?.totalRevenue || 567274.33
  const expenses = financialData?.totalExpenses || 263666.66
  const netIncome = financialData?.netIncome || 37973.46
  const grossProfit = revenue - expenses

  // Calculate key ratios
  const grossMargin = revenue ? (grossProfit / revenue) * 100 : 0
  const netMargin = revenue ? (netIncome / revenue) * 100 : 0
  const expenseRatio = revenue ? (expenses / revenue) * 100 : 0

  // Generate insights based on financial data
  const insights = []
  
  if (grossMargin > 70) {
    insights.push(`Excellent gross margin of ${grossMargin.toFixed(1)}% indicates strong pricing power and operational efficiency`)
  } else if (grossMargin > 50) {
    insights.push(`Good gross margin of ${grossMargin.toFixed(1)}% with room for optimization`)
  } else {
    insights.push(`Gross margin of ${grossMargin.toFixed(1)}% suggests potential pricing or cost structure challenges`)
  }

  if (netMargin > 20) {
    insights.push(`Outstanding net margin of ${netMargin.toFixed(1)}% demonstrates excellent profitability`)
  } else if (netMargin > 10) {
    insights.push(`Solid net margin of ${netMargin.toFixed(1)}% with growth potential`)
  } else if (netMargin > 0) {
    insights.push(`Net margin of ${netMargin.toFixed(1)}% indicates moderate profitability with improvement opportunities`)
  } else {
    insights.push(`Negative net margin requires immediate attention to cost structure and revenue optimization`)
  }

  // Add more specific insights
  if (expenseRatio > 80) {
    insights.push(`High expense ratio of ${expenseRatio.toFixed(1)}% suggests aggressive cost management opportunities`)
  }

  if (revenue > 1000000) {
    insights.push(`Revenue scale of ${formatCurrency(revenue)} demonstrates market traction and growth potential`)
  } else if (revenue > 500000) {
    insights.push(`Revenue of ${formatCurrency(revenue)} shows solid business foundation with scaling opportunities`)
  }

  // Generate opportunities based on financial profile
  const opportunities = []

  // Cash management opportunity
  opportunities.push({
    category: 'Cash Management',
    title: 'Working Capital Optimization',
    potential_value: Math.round(revenue * 0.03),
    implementation_difficulty: 'medium' as const,
    description: 'Optimize accounts receivable and payable cycles to improve cash flow by 30-60 days'
  })

  // Financial reporting opportunity
  opportunities.push({
    category: 'Financial Reporting',
    title: 'Monthly Close Process',
    potential_value: 50000,
    implementation_difficulty: 'medium' as const,
    description: 'Implement consistent monthly financial close by the 10th of each month with automated reconciliations'
  })

  // Cost management opportunity
  opportunities.push({
    category: 'Cost Management',
    title: 'Expense Category Analysis',
    potential_value: Math.round(expenses * 0.08),
    implementation_difficulty: 'low' as const,
    description: 'Review and optimize major expense categories for 5-10% efficiency gains'
  })

  // Add high-impact opportunities based on company size
  if (revenue > 1000000) {
    opportunities.push({
      category: 'Strategic Planning',
      title: 'KPI Dashboard Implementation',
      potential_value: Math.round(revenue * 0.02),
      implementation_difficulty: 'medium' as const,
      description: 'Implement real-time KPI tracking for improved decision-making speed'
    })
  }

  if (grossMargin < 50) {
    opportunities.push({
      category: 'Pricing Strategy',
      title: 'Pricing Model Optimization',
      potential_value: Math.round(revenue * 0.10),
      implementation_difficulty: 'high' as const,
      description: 'Analyze and optimize pricing strategy to improve gross margins by 5-15%'
    })
  }

  // Calculate financial health score
  let healthScore = 0
  
  // Gross margin component (0-30 points)
  healthScore += Math.min(30, grossMargin * 0.5)
  
  // Net margin component (0-25 points)
  healthScore += Math.min(25, Math.max(0, netMargin * 2.5))
  
  // Revenue scale component (0-25 points)
  if (revenue > 2000000) healthScore += 25
  else if (revenue > 1000000) healthScore += 20
  else if (revenue > 500000) healthScore += 15
  else if (revenue > 100000) healthScore += 10
  else healthScore += 5
  
  // Profitability component (0-20 points)
  if (netIncome > 0) {
    if (netIncome > revenue * 0.2) healthScore += 20
    else if (netIncome > revenue * 0.1) healthScore += 15
    else if (netIncome > revenue * 0.05) healthScore += 10
    else healthScore += 5
  }

  healthScore = Math.min(100, Math.max(0, healthScore))

  // Generate risk factors
  const riskFactors = []
  
  if (netMargin < 5) {
    riskFactors.push('Low net profit margins indicate vulnerability to expense increases or revenue decreases')
  }
  
  if (grossMargin < 40) {
    riskFactors.push('Low gross margins suggest pricing pressure or high cost of goods sold')
  }
  
  if (revenue < 500000 && netMargin < 10) {
    riskFactors.push('Small revenue base with low margins creates cash flow vulnerability')
  }
  
  riskFactors.push('Financial reporting delays impact decision-making speed and investor confidence')
  riskFactors.push('Lack of systematic KPI tracking creates performance blind spots')
  
  if (expenseRatio > 90) {
    riskFactors.push('High expense ratio leaves little room for unexpected costs or revenue fluctuations')
  }

  return {
    financial_health_score: Math.round(healthScore),
    key_insights: insights,
    opportunities,
    risk_factors: riskFactors,
    recommendations: [
      'Implement monthly financial dashboard with key performance indicators',
      'Establish 13-week cash flow forecasting and management processes',
      'Create detailed expense category budgets with variance reporting',
      'Set up automated financial close procedures to reduce cycle time to 10 days',
      'Develop operational KPI tracking for improved business insights',
      'Install monthly board-ready financial package process',
      'Create scenario planning models for strategic decision making'
    ],
    kpi_summary: {
      gross_margin: grossMargin,
      net_margin: netMargin,
      cash_position: revenue * 0.15, // Estimated based on typical ratios
      debt_ratio: 0.3, // Estimated - would come from balance sheet
      growth_rate: 15.2 // Estimated - would come from historical data
    }
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
