import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseClient';

const supabase = getSupabaseServerClient();

// Enhanced financial data extraction with date ranges and comprehensive metrics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const realm_id = searchParams.get('realm_id');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const periodType = searchParams.get('periodType') || 'quarter';
    const includeDetails = searchParams.get('details') !== 'false';

    if (!realm_id) {
      return NextResponse.json({ error: 'realm_id is required' }, { status: 400 });
    }

    // Calculate date range
    const dateRange = calculateDateRange(periodType, startDate, endDate);
    
    console.log(`📊 Fetching comprehensive financial data for period: ${dateRange.label}`);
    console.log(`   Date range: ${dateRange.startDate} to ${dateRange.endDate}`);

    // Get QuickBooks connection
    const { data: tokens, error: tokenError } = await supabase
      .from('qbo_tokens')
      .select('access_token, refresh_token, expires_at, company_name')
      .eq('company_id', realm_id)
      .single();

    if (tokenError || !tokens) {
      return NextResponse.json({ error: 'No valid QuickBooks connection found' }, { status: 404 });
    }

    // Check and refresh token if needed
    let accessToken = tokens.access_token;
    const tokenNeedsRefresh = new Date() >= new Date(tokens.expires_at);
    
    if (tokenNeedsRefresh) {
      console.log('🔄 Refreshing expired QuickBooks token...');
      const refreshResult = await refreshQBOToken(tokens.refresh_token, realm_id);
      if (!refreshResult.success) {
        return NextResponse.json({ 
          error: 'QuickBooks connection expired. Please reconnect.',
          code: 'TOKEN_EXPIRED'
        }, { status: 401 });
      }
      accessToken = refreshResult.access_token!;
    }

    // Fetch comprehensive financial data
    const financialData = await fetchEnhancedFinancialData(
      realm_id, 
      accessToken, 
      dateRange,
      includeDetails
    );

    // Calculate period-over-period comparison
    const previousPeriod = getPreviousPeriodDates(dateRange);
    const previousData = await fetchEnhancedFinancialData(
      realm_id,
      accessToken,
      previousPeriod,
      false // Don't need full details for comparison
    );

    // Calculate growth metrics
    const comparison = calculatePeriodComparison(financialData, previousData);

    // Store snapshot in database
    await storeEnhancedSnapshot(realm_id, financialData, dateRange);

    // Return comprehensive response
    return NextResponse.json({
      success: true,
      metadata: {
        companyName: tokens.company_name,
        extractedAt: new Date().toISOString(),
        dataSource: 'quickbooks_live',
        dateRange: {
          ...dateRange,
          daysIncluded: Math.ceil((new Date(dateRange.endDate).getTime() - new Date(dateRange.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
        }
      },
      financialData: {
        ...financialData,
        comparison,
        dataQuality: assessDataQuality(financialData)
      },
      insights: generateFinancialInsights(financialData, comparison)
    });

  } catch (error) {
    console.error('❌ Enhanced financial data error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch enhanced financial data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Main function to fetch all financial data
async function fetchEnhancedFinancialData(
  companyId: string, 
  accessToken: string,
  dateRange: DateRange,
  includeDetails: boolean = true
) {
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://quickbooks.api.intuit.com'
    : 'https://sandbox-quickbooks.api.intuit.com';

  console.log(`🔍 Fetching QuickBooks reports for ${dateRange.label}...`);

  // Fetch all reports in parallel
  const reportPromises = [
    // Core financial statements
    fetchQBReport(baseUrl, companyId, accessToken, 'ProfitAndLoss', {
      start_date: dateRange.startDate,
      end_date: dateRange.endDate,
      summarize_column_by: 'Total'
    }),
    fetchQBReport(baseUrl, companyId, accessToken, 'BalanceSheet', {
      date: dateRange.endDate,
      summarize_column_by: 'Total'
    }),
    fetchQBReport(baseUrl, companyId, accessToken, 'CashFlow', {
      start_date: dateRange.startDate,
      end_date: dateRange.endDate,
      summarize_column_by: 'Total'
    })
  ];

  // Add detailed reports if requested
  if (includeDetails) {
    reportPromises.push(
      fetchQBReport(baseUrl, companyId, accessToken, 'ProfitAndLossDetail', {
        start_date: dateRange.startDate,
        end_date: dateRange.endDate
      }),
      fetchQBReport(baseUrl, companyId, accessToken, 'GeneralLedger', {
        start_date: dateRange.startDate,
        end_date: dateRange.endDate
      }),
      fetchQBReport(baseUrl, companyId, accessToken, 'TrialBalance', {
        start_date: dateRange.startDate,
        end_date: dateRange.endDate
      })
    );
  }

  const reports = await Promise.all(reportPromises);
  const [plReport, bsReport, cfReport, plDetail, glReport, tbReport] = reports;

  // Extract comprehensive data from reports
  const revenue = extractRevenueData(plReport, plDetail);
  const expenses = extractExpenseData(plReport, plDetail);
  const profitability = calculateProfitability(revenue, expenses);
  const assets = extractAssetData(bsReport);
  const liabilities = extractLiabilityData(bsReport);
  const equity = extractEquityData(bsReport);
  const cashFlow = extractCashFlowData(cfReport);
  const ratios = calculateFinancialRatios(revenue, expenses, assets, liabilities, equity, cashFlow);

  return {
    revenue,
    expenses,
    profitability,
    assets,
    liabilities,
    equity,
    cashFlow,
    ratios,
    workingCapital: assets.current.total - liabilities.current.total,
    netWorth: assets.total - liabilities.total,
    details: includeDetails ? {
      generalLedger: glReport,
      trialBalance: tbReport
    } : null
  };
}

// Fetch a QuickBooks report with error handling
async function fetchQBReport(
  baseUrl: string, 
  companyId: string, 
  accessToken: string, 
  reportType: string, 
  params: Record<string, string>
) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${baseUrl}/v3/company/${companyId}/reports/${reportType}?${queryString}`;
    
    console.log(`  📄 Fetching ${reportType}...`);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`  ❌ Failed to fetch ${reportType}: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    console.log(`  ✅ ${reportType} fetched successfully`);
    return data;

  } catch (error) {
    console.error(`  ❌ Error fetching ${reportType}:`, error);
    return null;
  }
}

// Extract revenue data with detailed breakdown
function extractRevenueData(plReport: any, plDetail: any) {
  let total = 0;
  const categories: Record<string, number> = {};
  const monthly: number[] = [];

  if (!plReport?.Rows) {
    console.warn('⚠️ No P&L data found');
    return { total, categories, monthly, growth: { amount: 0, percentage: 0 } };
  }

  // Find income/revenue section
  const incomeSection = findReportSection(plReport.Rows, [
    'Income', 'Revenue', 'Sales', 'Total Income'
  ]);

  if (incomeSection) {
    // Extract total
    if (incomeSection.Summary?.ColData?.[1]?.value) {
      total = Math.abs(parseFloat(incomeSection.Summary.ColData[1].value) || 0);
    }

    // Extract categories
    if (incomeSection.Rows) {
      incomeSection.Rows.forEach((row: any) => {
        if (row.ColData?.[0]?.value && row.ColData?.[1]?.value) {
          const category = row.ColData[0].value;
          const amount = Math.abs(parseFloat(row.ColData[1].value) || 0);
          if (amount > 0) {
            categories[category] = amount;
          }
        }
      });
    }
  }

  console.log(`  💰 Revenue extracted: $${total.toLocaleString()}`);
  
  return {
    total,
    categories,
    monthly,
    growth: { amount: 0, percentage: 0 } // Will be calculated with comparison
  };
}

// Extract expense data with categorization
function extractExpenseData(plReport: any, plDetail: any) {
  let total = 0;
  let cogs = 0;
  let operating = 0;
  let administrative = 0;
  const categories: Record<string, number> = {};

  if (!plReport?.Rows) {
    return { total, cogs, operating, administrative, categories };
  }

  // Extract COGS
  const cogsSection = findReportSection(plReport.Rows, [
    'Cost of Goods Sold', 'COGS', 'Cost of Sales'
  ]);
  
  if (cogsSection?.Summary?.ColData?.[1]?.value) {
    cogs = Math.abs(parseFloat(cogsSection.Summary.ColData[1].value) || 0);
    categories['Cost of Goods Sold'] = cogs;
  }

  // Extract Operating Expenses
  const expenseSection = findReportSection(plReport.Rows, [
    'Expenses', 'Operating Expenses', 'Total Expenses'
  ]);

  if (expenseSection) {
    if (expenseSection.Summary?.ColData?.[1]?.value) {
      const expenseTotal = Math.abs(parseFloat(expenseSection.Summary.ColData[1].value) || 0);
      operating = expenseTotal;
    }

    // Categorize expenses
    if (expenseSection.Rows) {
      expenseSection.Rows.forEach((row: any) => {
        if (row.ColData?.[0]?.value && row.ColData?.[1]?.value) {
          const category = row.ColData[0].value;
          const amount = Math.abs(parseFloat(row.ColData[1].value) || 0);
          if (amount > 0) {
            categories[category] = amount;
            
            // Simple categorization
            const lowerCategory = category.toLowerCase();
            if (lowerCategory.includes('admin') || lowerCategory.includes('office')) {
              administrative += amount;
              operating -= amount; // Remove from operating to avoid double counting
            }
          }
        }
      });
    }
  }

  total = cogs + operating + administrative;
  console.log(`  💸 Expenses extracted: $${total.toLocaleString()} (COGS: $${cogs.toLocaleString()})`);

  return {
    total,
    cogs,
    operating,
    administrative,
    categories
  };
}

// Extract asset data from balance sheet
function extractAssetData(bsReport: any) {
  const assets = {
    current: { total: 0, cash: 0, receivables: 0, inventory: 0 },
    fixed: { total: 0, property: 0, equipment: 0 },
    total: 0
  };

  if (!bsReport?.Rows) {
    console.warn('⚠️ No Balance Sheet data found');
    return assets;
  }

  // Find assets section
  const assetSection = findReportSection(bsReport.Rows, ['ASSETS', 'Assets']);
  
  if (assetSection) {
    // Current assets
    const currentAssets = findReportSection(assetSection.Rows || [], ['Current Assets']);
    if (currentAssets) {
      if (currentAssets.Summary?.ColData?.[1]?.value) {
        assets.current.total = parseFloat(currentAssets.Summary.ColData[1].value) || 0;
      }

      // Extract specific current assets
      if (currentAssets.Rows) {
        currentAssets.Rows.forEach((row: any) => {
          const label = (row.ColData?.[0]?.value || '').toLowerCase();
          const value = parseFloat(row.ColData?.[1]?.value || 0);
          
          if (label.includes('cash') || label.includes('bank')) {
            assets.current.cash += value;
          } else if (label.includes('receivable')) {
            assets.current.receivables += value;
          } else if (label.includes('inventory')) {
            assets.current.inventory += value;
          }
        });
      }
    }

    // Fixed assets
    const fixedAssets = findReportSection(assetSection.Rows || [], [
      'Fixed Assets', 'Property', 'Equipment'
    ]);
    if (fixedAssets?.Summary?.ColData?.[1]?.value) {
      assets.fixed.total = parseFloat(fixedAssets.Summary.ColData[1].value) || 0;
    }
  }

  // Total assets
  const totalAssets = findReportSection(bsReport.Rows, ['Total Assets']);
  if (totalAssets?.Summary?.ColData?.[1]?.value) {
    assets.total = parseFloat(totalAssets.Summary.ColData[1].value) || 0;
  }

  console.log(`  🏦 Assets extracted: $${assets.total.toLocaleString()}`);
  return assets;
}

// Extract liability data from balance sheet
function extractLiabilityData(bsReport: any) {
  const liabilities = {
    current: { total: 0, payables: 0, shortTermDebt: 0 },
    longTerm: { total: 0, loans: 0 },
    total: 0
  };

  if (!bsReport?.Rows) return liabilities;

  // Find liabilities section
  const liabSection = findReportSection(bsReport.Rows, [
    'LIABILITIES', 'Liabilities', 'LIABILITIES AND EQUITY'
  ]);

  if (liabSection) {
    // Current liabilities
    const currentLiab = findReportSection(liabSection.Rows || [], ['Current Liabilities']);
    if (currentLiab?.Summary?.ColData?.[1]?.value) {
      liabilities.current.total = parseFloat(currentLiab.Summary.ColData[1].value) || 0;
    }

    // Long-term liabilities
    const longTermLiab = findReportSection(liabSection.Rows || [], [
      'Long Term Liabilities', 'Non-Current Liabilities'
    ]);
    if (longTermLiab?.Summary?.ColData?.[1]?.value) {
      liabilities.longTerm.total = parseFloat(longTermLiab.Summary.ColData[1].value) || 0;
    }
  }

  // Total liabilities
  const totalLiab = findReportSection(bsReport.Rows, ['Total Liabilities']);
  if (totalLiab?.Summary?.ColData?.[1]?.value) {
    liabilities.total = parseFloat(totalLiab.Summary.ColData[1].value) || 0;
  }

  console.log(`  💳 Liabilities extracted: $${liabilities.total.toLocaleString()}`);
  return liabilities;
}

// Extract equity data
function extractEquityData(bsReport: any) {
  const equity = {
    total: 0,
    retainedEarnings: 0
  };

  if (!bsReport?.Rows) return equity;

  // Find equity section
  const equitySection = findReportSection(bsReport.Rows, [
    'Equity', 'Total Equity', 'Shareholders Equity'
  ]);

  if (equitySection?.Summary?.ColData?.[1]?.value) {
    equity.total = parseFloat(equitySection.Summary.ColData[1].value) || 0;
  }

  // Find retained earnings
  const retainedEarnings = findReportSection(bsReport.Rows, ['Retained Earnings']);
  if (retainedEarnings?.ColData?.[1]?.value) {
    equity.retainedEarnings = parseFloat(retainedEarnings.ColData[1].value) || 0;
  }

  console.log(`  💎 Equity extracted: $${equity.total.toLocaleString()}`);
  return equity;
}

// Extract cash flow data
function extractCashFlowData(cfReport: any) {
  const cashFlow = {
    operating: 0,
    investing: 0,
    financing: 0,
    net: 0,
    beginning: 0,
    ending: 0,
    free: 0
  };

  if (!cfReport?.Rows) {
    console.warn('⚠️ No Cash Flow data found');
    return cashFlow;
  }

  // Operating activities
  const operating = findReportSection(cfReport.Rows, ['Operating Activities']);
  if (operating?.Summary?.ColData?.[1]?.value) {
    cashFlow.operating = parseFloat(operating.Summary.ColData[1].value) || 0;
  }

  // Investing activities
  const investing = findReportSection(cfReport.Rows, ['Investing Activities']);
  if (investing?.Summary?.ColData?.[1]?.value) {
    cashFlow.investing = parseFloat(investing.Summary.ColData[1].value) || 0;
  }

  // Financing activities
  const financing = findReportSection(cfReport.Rows, ['Financing Activities']);
  if (financing?.Summary?.ColData?.[1]?.value) {
    cashFlow.financing = parseFloat(financing.Summary.ColData[1].value) || 0;
  }

  // Calculate net and free cash flow
  cashFlow.net = cashFlow.operating + cashFlow.investing + cashFlow.financing;
  cashFlow.free = cashFlow.operating - Math.abs(cashFlow.investing);

  console.log(`  💵 Cash Flow extracted: Operating: $${cashFlow.operating.toLocaleString()}`);
  return cashFlow;
}

// Helper to find report sections
function findReportSection(rows: any[], labels: string[]): any {
  if (!rows || !Array.isArray(rows)) return null;
  
  for (const row of rows) {
    // Check various row properties
    const rowText = row.Header?.ColData?.[0]?.value || 
                   row.Summary?.ColData?.[0]?.value || 
                   row.ColData?.[0]?.value || '';
    
    if (labels.some(label => rowText.includes(label))) {
      return row;
    }
    
    // Recurse into nested rows
    if (row.Rows) {
      const found = findReportSection(row.Rows, labels);
      if (found) return found;
    }
  }
  
  return null;
}

// Continue in next part...

// Utility types
interface DateRange {
  startDate: string;
  endDate: string;
  periodType: string;
  label: string;
}

// Helper function stubs (to be implemented in next part)
function calculateProfitability(revenue: any, expenses: any) {
  const grossProfit = revenue.total - expenses.cogs;
  const operatingProfit = grossProfit - expenses.operating - expenses.administrative;
  const netIncome = operatingProfit;
  
  return {
    grossProfit,
    grossMargin: revenue.total > 0 ? (grossProfit / revenue.total) * 100 : 0,
    operatingProfit,
    operatingMargin: revenue.total > 0 ? (operatingProfit / revenue.total) * 100 : 0,
    netIncome,
    netMargin: revenue.total > 0 ? (netIncome / revenue.total) * 100 : 0,
    ebitda: operatingProfit + (expenses.total * 0.05) // Estimate
  };
}

function calculateFinancialRatios(revenue: any, expenses: any, assets: any, liabilities: any, equity: any, cashFlow: any) {
  return {
    liquidity: {
      current: liabilities.current.total > 0 ? assets.current.total / liabilities.current.total : 0,
      quick: liabilities.current.total > 0 ? (assets.current.total - assets.current.inventory) / liabilities.current.total : 0
    },
    leverage: {
      debtToEquity: equity.total > 0 ? liabilities.total / equity.total : 0,
      debtToAssets: assets.total > 0 ? liabilities.total / assets.total : 0
    },
    profitability: {
      roa: assets.total > 0 ? ((revenue.total - expenses.total) / assets.total) * 100 : 0,
      roe: equity.total > 0 ? ((revenue.total - expenses.total) / equity.total) * 100 : 0
    },
    efficiency: {
      assetTurnover: assets.total > 0 ? revenue.total / assets.total : 0,
      inventoryTurnover: assets.current.inventory > 0 ? expenses.cogs / assets.current.inventory : 0
    }
  };
}

function calculateDateRange(periodType: string, startDate?: string | null, endDate?: string | null): DateRange {
  const today = new Date();
  
  if (startDate && endDate) {
    return {
      startDate,
      endDate,
      periodType: 'custom',
      label: `Custom: ${startDate} to ${endDate}`
    };
  }

  let start: Date, end: Date, label: string;

  switch (periodType) {
    case 'month':
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      label = start.toLocaleString('default', { month: 'long', year: 'numeric' });
      break;
      
    case 'quarter':
      const quarter = Math.floor(today.getMonth() / 3);
      start = new Date(today.getFullYear(), quarter * 3, 1);
      end = new Date(today.getFullYear(), (quarter + 1) * 3, 0);
      label = `Q${quarter + 1} ${today.getFullYear()}`;
      break;
      
    case 'year':
      start = new Date(today.getFullYear(), 0, 1);
      end = new Date(today.getFullYear(), 11, 31);
      label = today.getFullYear().toString();
      break;
      
    case 'ytd':
      start = new Date(today.getFullYear(), 0, 1);
      end = today;
      label = `YTD ${today.getFullYear()}`;
      break;
      
    default:
      // Default to current month
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      label = 'Current Month';
  }

  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
    periodType,
    label
  };
}

function getPreviousPeriodDates(current: DateRange): DateRange {
  const start = new Date(current.startDate);
  const end = new Date(current.endDate);
  const duration = end.getTime() - start.getTime();
  
  const prevEnd = new Date(start.getTime() - 24 * 60 * 60 * 1000);
  const prevStart = new Date(prevEnd.getTime() - duration);
  
  return {
    startDate: prevStart.toISOString().split('T')[0],
    endDate: prevEnd.toISOString().split('T')[0],
    periodType: current.periodType,
    label: `Previous ${current.periodType}`
  };
}

function calculatePeriodComparison(current: any, previous: any) {
  if (!previous) return null;
  
  const calculateChange = (curr: number, prev: number) => {
    const change = curr - prev;
    const percentage = prev !== 0 ? (change / Math.abs(prev)) * 100 : 0;
    return { amount: change, percentage };
  };
  
  return {
    revenue: calculateChange(current.revenue.total, previous.revenue.total),
    expenses: calculateChange(current.expenses.total, previous.expenses.total),
    netIncome: calculateChange(current.profitability.netIncome, previous.profitability.netIncome),
    cashFlow: calculateChange(current.cashFlow.operating, previous.cashFlow.operating)
  };
}

function assessDataQuality(data: any) {
  let score = 100;
  const issues: string[] = [];
  
  if (data.revenue.total === 0) {
    score -= 30;
    issues.push('No revenue data');
  }
  if (data.expenses.total === 0) {
    score -= 30;
    issues.push('No expense data');
  }
  if (data.assets.total === 0) {
    score -= 20;
    issues.push('No asset data');
  }
  if (data.cashFlow.operating === 0) {
    score -= 20;
    issues.push('No cash flow data');
  }
  
  return {
    score,
    completeness: score,
    issues,
    rating: score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'poor'
  };
}

function generateFinancialInsights(data: any, comparison: any) {
  const insights: string[] = [];
  
  // Revenue insights
  if (comparison?.revenue?.percentage > 10) {
    insights.push(`Strong revenue growth of ${comparison.revenue.percentage.toFixed(1)}% compared to previous period`);
  } else if (comparison?.revenue?.percentage < -10) {
    insights.push(`Revenue declined by ${Math.abs(comparison.revenue.percentage).toFixed(1)}% - investigate causes`);
  }
  
  // Profitability insights
  if (data.profitability.netMargin < 5) {
    insights.push('Low profit margins detected - consider cost optimization strategies');
  }
  
  // Liquidity insights
  if (data.ratios.liquidity.current < 1.5) {
    insights.push('Current ratio below 1.5 - potential liquidity concerns');
  }
  
  // Cash flow insights
  if (data.cashFlow.free < 0) {
    insights.push('Negative free cash flow - monitor cash burn rate closely');
  }
  
  return insights;
}

async function storeEnhancedSnapshot(companyId: string, data: any, dateRange: DateRange) {
  try {
    await supabase
      .from('financial_snapshots')
      .insert({
        company_id: companyId,
        revenue: data.revenue.total,
        profit: data.profitability.netIncome,
        expenses: data.expenses.total,
        total_assets: data.assets.total,
        total_liabilities: data.liabilities.total,
        profit_margin: data.profitability.netMargin,
        cash_flow: data.cashFlow.operating,
        current_ratio: data.ratios.liquidity.current,
        debt_to_equity: data.ratios.leverage.debtToEquity,
        gross_margin: data.profitability.grossMargin,
        operating_margin: data.profitability.operatingMargin,
        revenue_growth_rate: data.revenue.growth?.percentage || 0,
        snapshot_type: dateRange.periodType,
        snapshot_data: JSON.stringify({
          source: 'quickbooks_enhanced',
          period: dateRange,
          comprehensive_data: data,
          extracted_at: new Date().toISOString()
        }),
        created_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Failed to store snapshot:', error);
  }
}

async function refreshQBOToken(refreshToken: string, companyId: string) {
  const tokenEndpoint = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
  
  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.QB_CLIENT_ID || process.env.QUICKBOOKS_CLIENT_ID}:${process.env.QB_CLIENT_SECRET || process.env.QUICKBOOKS_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'grant_type': 'refresh_token',
        'refresh_token': refreshToken
      })
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    const tokenData = await response.json();
    const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000));
    
    await supabase
      .from('qbo_tokens')
      .update({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('company_id', companyId);

    return {
      success: true,
      access_token: tokenData.access_token
    };

  } catch (error) {
    console.error('Error refreshing QBO token:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 