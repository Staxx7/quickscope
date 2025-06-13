import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { companyId, dataTypes, dateRange } = await request.json();
    
    // Get QB credentials for this company
    const credentials = await getQBCredentials(companyId);
    if (!credentials) {
      return NextResponse.json({ error: 'Company not connected' }, { status: 400 });
    }

    const results: any = {};
    
    // Extract different data types based on selection
    for (const dataType of dataTypes) {
      switch (dataType) {
        case 'profit_loss':
          results.profitLoss = await extractProfitLoss(credentials, dateRange);
          break;
        case 'balance_sheet':
          results.balanceSheet = await extractBalanceSheet(credentials, dateRange);
          break;
        case 'cash_flow':
          results.cashFlow = await extractCashFlow(credentials, dateRange);
          break;
        case 'chart_of_accounts':
          results.chartOfAccounts = await extractChartOfAccounts(credentials);
          break;
        case 'customers':
          results.customers = await extractCustomers(credentials);
          break;
        case 'vendors':
          results.vendors = await extractVendors(credentials);
          break;
        case 'items':
          results.items = await extractItems(credentials);
          break;
        case 'transactions':
          results.transactions = await extractTransactions(credentials, dateRange);
          break;
      }
    }

    // Calculate summary metrics
    results.summary = calculateComprehensiveSummary(results);
    
    // Save extraction record
    await saveExtractionRecord(companyId, results);

    return NextResponse.json({
      success: true,
      data: results,
      extractedAt: new Date().toISOString(),
      dataTypes: dataTypes
    });

  } catch (error) {
    console.error('Comprehensive extraction error:', error);
    return NextResponse.json({ error: 'Extraction failed' }, { status: 500 });
  }
}

// Helper functions for real QB API calls
async function getQBCredentials(companyId: string) {
  // Get access token from your database
  // This should fetch the stored QB OAuth tokens
  return {
    accessToken: 'your_access_token',
    realmId: companyId,
    refreshToken: 'your_refresh_token'
  };
}

async function extractProfitLoss(credentials: any, dateRange: any) {
  // Real QB API call for P&L
  const qbApiUrl = `https://sandbox-quickbooks.api.intuit.com/v3/company/${credentials.realmId}/reports/ProfitAndLoss`;
  
  const response = await fetch(`${qbApiUrl}?start_date=${dateRange.start}&end_date=${dateRange.end}`, {
    headers: {
      'Authorization': `Bearer ${credentials.accessToken}`,
      'Accept': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch P&L data');
  }
  
  return await response.json();
}

async function extractBalanceSheet(credentials: any, dateRange: any) {
  const qbApiUrl = `https://sandbox-quickbooks.api.intuit.com/v3/company/${credentials.realmId}/reports/BalanceSheet`;
  
  const response = await fetch(`${qbApiUrl}?end_date=${dateRange.end}`, {
    headers: {
      'Authorization': `Bearer ${credentials.accessToken}`,
      'Accept': 'application/json'
    }
  });
  
  return await response.json();
}

async function extractCashFlow(credentials: any, dateRange: any) {
  const qbApiUrl = `https://sandbox-quickbooks.api.intuit.com/v3/company/${credentials.realmId}/reports/CashFlow`;
  const response = await fetch(`${qbApiUrl}?start_date=${dateRange.start}&end_date=${dateRange.end}`, {
    headers: {
      'Authorization': `Bearer ${credentials.accessToken}`,
      'Accept': 'application/json'
    }
  });
  return await response.json();
}

async function extractChartOfAccounts(credentials: any) {
  const qbApiUrl = `https://sandbox-quickbooks.api.intuit.com/v3/company/${credentials.realmId}/query`;
  const response = await fetch(`${qbApiUrl}?query=SELECT * FROM Account`, {
    headers: {
      'Authorization': `Bearer ${credentials.accessToken}`,
      'Accept': 'application/json'
    }
  });
  return await response.json();
}

async function extractCustomers(credentials: any) {
  const qbApiUrl = `https://sandbox-quickbooks.api.intuit.com/v3/company/${credentials.realmId}/query`;
  const response = await fetch(`${qbApiUrl}?query=SELECT * FROM Customer`, {
    headers: {
      'Authorization': `Bearer ${credentials.accessToken}`,
      'Accept': 'application/json'
    }
  });
  return await response.json();
}

async function extractVendors(credentials: any) {
  const qbApiUrl = `https://sandbox-quickbooks.api.intuit.com/v3/company/${credentials.realmId}/query`;
  const response = await fetch(`${qbApiUrl}?query=SELECT * FROM Vendor`, {
    headers: {
      'Authorization': `Bearer ${credentials.accessToken}`,
      'Accept': 'application/json'
    }
  });
  return await response.json();
}

async function extractItems(credentials: any) {
  const qbApiUrl = `https://sandbox-quickbooks.api.intuit.com/v3/company/${credentials.realmId}/query`;
  const response = await fetch(`${qbApiUrl}?query=SELECT * FROM Item`, {
    headers: {
      'Authorization': `Bearer ${credentials.accessToken}`,
      'Accept': 'application/json'
    }
  });
  return await response.json();
}

async function extractTransactions(credentials: any, dateRange: any) {
  const qbApiUrl = `https://sandbox-quickbooks.api.intuit.com/v3/company/${credentials.realmId}/query`;
  const response = await fetch(`${qbApiUrl}?query=SELECT * FROM Transaction WHERE TxnDate >= '${dateRange.start}' AND TxnDate <= '${dateRange.end}'`, {
    headers: {
      'Authorization': `Bearer ${credentials.accessToken}`,
      'Accept': 'application/json'
    }
  });
  return await response.json();
}

async function saveExtractionRecord(companyId: string, data: any) {
  // Implementation for saving extraction record to database
  return true;
}

// Helper functions for summary calculations
function extractRevenueFromPL(plData: any) { return plData?.QueryResponse?.Report?.[0]?.Rows?.[0]?.ColData?.[1]?.value || 0; }
function extractExpensesFromPL(plData: any) { return plData?.QueryResponse?.Report?.[0]?.Rows?.[1]?.ColData?.[1]?.value || 0; }
function extractNetProfitFromPL(plData: any) { return plData?.QueryResponse?.Report?.[0]?.Rows?.[2]?.ColData?.[1]?.value || 0; }
function extractAssetsFromBS(bsData: any) { return bsData?.QueryResponse?.Report?.[0]?.Rows?.[0]?.ColData?.[1]?.value || 0; }
function extractLiabilitiesFromBS(bsData: any) { return bsData?.QueryResponse?.Report?.[0]?.Rows?.[1]?.ColData?.[1]?.value || 0; }
function extractCashFromBS(bsData: any) { return bsData?.QueryResponse?.Report?.[0]?.Rows?.[0]?.ColData?.[1]?.value || 0; }

async function calculateComprehensiveSummary(data: any) {
  return {
    totalRevenue: extractRevenueFromPL(data.profitLoss),
    totalExpenses: extractExpensesFromPL(data.profitLoss),
    netProfit: extractNetProfitFromPL(data.profitLoss),
    totalAssets: extractAssetsFromBS(data.balanceSheet),
    totalLiabilities: extractLiabilitiesFromBS(data.balanceSheet),
    cashPosition: extractCashFromBS(data.balanceSheet),
    customerCount: data.customers?.length || 0,
    vendorCount: data.vendors?.length || 0,
    transactionCount: data.transactions?.length || 0,
    accountsCount: data.chartOfAccounts?.length || 0
  };
}
