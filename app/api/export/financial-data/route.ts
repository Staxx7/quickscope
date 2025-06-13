import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export async function POST(request: NextRequest) {
  try {
    const { data, format, companyName, dateRange } = await request.json();

    switch (format) {
      case 'excel':
        return await generateEnhancedExcel(data, companyName, dateRange);
      case 'csv':
        return await generateEnhancedCSV(data, companyName, dateRange);
      case 'pdf':
        return await generateEnhancedPDF(data, companyName, dateRange);
      default:
        return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}

async function generateEnhancedExcel(data: any, companyName: string, dateRange: any) {
  const workbook = XLSX.utils.book_new();

  // Executive Summary Sheet
  const summaryData = [
    ['QUICKSCOPE FINANCIAL ANALYSIS', '', '', ''],
    ['Company:', companyName, '', ''],
    ['Period:', `${dateRange.start} to ${dateRange.end}`, '', ''],
    ['Generated:', new Date().toLocaleDateString(), '', ''],
    ['', '', '', ''],
    ['EXECUTIVE SUMMARY', '', '', ''],
    ['Total Revenue', data.summary?.totalRevenue || 0, '', ''],
    ['Total Expenses', data.summary?.totalExpenses || 0, '', ''],
    ['Net Profit', data.summary?.netProfit || 0, '', ''],
    ['Total Assets', data.summary?.totalAssets || 0, '', ''],
    ['Cash Position', data.summary?.cashPosition || 0, '', ''],
    ['', '', '', ''],
    ['KEY METRICS', '', '', ''],
    ['Customer Count', data.summary?.customerCount || 0, '', ''],
    ['Vendor Count', data.summary?.vendorCount || 0, '', ''],
    ['Accounts Count', data.summary?.accountsCount || 0, '', ''],
    ['Transaction Count', data.summary?.transactionCount || 0, '', '']
  ];
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  
  // Style the summary sheet
  summarySheet['A1'] = { v: 'QUICKSCOPE FINANCIAL ANALYSIS', t: 's', s: { font: { bold: true, sz: 16 } } };
  
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Executive Summary');

  // Profit & Loss Sheet
  if (data.profitLoss) {
    const plSheet = formatProfitLossForExcel(data.profitLoss);
    XLSX.utils.book_append_sheet(workbook, plSheet, 'Profit & Loss');
  }

  // Balance Sheet
  if (data.balanceSheet) {
    const bsSheet = formatBalanceSheetForExcel(data.balanceSheet);
    XLSX.utils.book_append_sheet(workbook, bsSheet, 'Balance Sheet');
  }

  // Chart of Accounts
  if (data.chartOfAccounts) {
    const coaData = [
      ['Account Name', 'Account Type', 'Account Number', 'Balance'],
      ...data.chartOfAccounts.map((account: any) => [
        account.name,
        account.accountType,
        account.accountNumber || '',
        account.balance || 0
      ])
    ];
    const coaSheet = XLSX.utils.aoa_to_sheet(coaData);
    XLSX.utils.book_append_sheet(workbook, coaSheet, 'Chart of Accounts');
  }

  // Customers Sheet
  if (data.customers) {
    const customerData = [
      ['Customer Name', 'Email', 'Phone', 'Balance', 'Status'],
      ...data.customers.slice(0, 1000).map((customer: any) => [
        customer.name,
        customer.email || '',
        customer.phone || '',
        customer.balance || 0,
        customer.active ? 'Active' : 'Inactive'
      ])
    ];
    const customerSheet = XLSX.utils.aoa_to_sheet(customerData);
    XLSX.utils.book_append_sheet(workbook, customerSheet, 'Customers');
  }

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  
  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${companyName.replace(/\s+/g, '-')}-financial-analysis.xlsx"`
    }
  });
}

async function generateEnhancedCSV(data: any, companyName: string, dateRange: any) {
  const rows = [
    ['QUICKSCOPE FINANCIAL ANALYSIS'],
    ['Company', companyName],
    ['Period', `${dateRange.start} to ${dateRange.end}`],
    ['Generated', new Date().toLocaleDateString()],
    [],
    ['Metric', 'Value'],
    ['Total Revenue', formatCurrency(data.summary?.totalRevenue || 0)],
    ['Total Expenses', formatCurrency(data.summary?.totalExpenses || 0)],
    ['Net Profit', formatCurrency(data.summary?.netProfit || 0)],
    ['Total Assets', formatCurrency(data.summary?.totalAssets || 0)],
    ['Cash Position', formatCurrency(data.summary?.cashPosition || 0)],
    ['Customer Count', (data.summary?.customerCount || 0).toString()],
    ['Vendor Count', (data.summary?.vendorCount || 0).toString()]
  ];

  const csvContent = rows.map(row => row.join(',')).join('\n');
  
  return new Response(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${companyName.replace(/\s+/g, '-')}-financial-analysis.csv"`
    }
  });
}

async function generateEnhancedPDF(data: any, companyName: string, dateRange: any) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('QuickScope Financial Analysis', 20, 30);
  doc.setFontSize(12);
  doc.text(`Company: ${companyName}`, 20, 45);
  doc.text(`Period: ${dateRange.start} to ${dateRange.end}`, 20, 55);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 65);

  // Executive Summary
  doc.setFontSize(16);
  doc.text('Executive Summary', 20, 85);
  
  const summaryData = [
    ['Metric', 'Value'],
    ['Total Revenue', formatCurrency(data.summary?.totalRevenue || 0)],
    ['Total Expenses', formatCurrency(data.summary?.totalExpenses || 0)],
    ['Net Profit', formatCurrency(data.summary?.netProfit || 0)],
    ['Total Assets', formatCurrency(data.summary?.totalAssets || 0)],
    ['Cash Position', formatCurrency(data.summary?.cashPosition || 0)],
    ['Customer Count', (data.summary?.customerCount || 0).toString()],
    ['Vendor Count', (data.summary?.vendorCount || 0).toString()]
  ];

  (doc as any).autoTable({
    head: [summaryData[0]],
    body: summaryData.slice(1),
    startY: 95,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  return new Response(doc.output('arraybuffer'), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${companyName.replace(/\s+/g, '-')}-financial-analysis.pdf"`
    }
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function formatProfitLossForExcel(data: any) {
  const rows = [
    ['PROFIT & LOSS STATEMENT'],
    ['Category', 'Amount'],
    ['Revenue', formatCurrency(data.revenue || 0)],
    ['Cost of Goods Sold', formatCurrency(data.cogs || 0)],
    ['Gross Profit', formatCurrency(data.grossProfit || 0)],
    [],
    ['Operating Expenses'],
    ...(data.operatingExpenses || []).map((expense: any) => [
      expense.name,
      formatCurrency(expense.amount)
    ]),
    ['Total Operating Expenses', formatCurrency(data.totalOperatingExpenses || 0)],
    [],
    ['Operating Income', formatCurrency(data.operatingIncome || 0)],
    ['Other Income', formatCurrency(data.otherIncome || 0)],
    ['Other Expenses', formatCurrency(data.otherExpenses || 0)],
    ['Net Income', formatCurrency(data.netIncome || 0)]
  ];
  
  return XLSX.utils.aoa_to_sheet(rows);
}

function formatBalanceSheetForExcel(data: any) {
  const rows = [
    ['BALANCE SHEET'],
    ['Category', 'Amount'],
    ['ASSETS'],
    ['Current Assets'],
    ['Cash', formatCurrency(data.cash || 0)],
    ['Accounts Receivable', formatCurrency(data.accountsReceivable || 0)],
    ['Inventory', formatCurrency(data.inventory || 0)],
    ['Total Current Assets', formatCurrency(data.totalCurrentAssets || 0)],
    [],
    ['Fixed Assets'],
    ['Property & Equipment', formatCurrency(data.propertyAndEquipment || 0)],
    ['Accumulated Depreciation', formatCurrency(data.accumulatedDepreciation || 0)],
    ['Total Fixed Assets', formatCurrency(data.totalFixedAssets || 0)],
    [],
    ['Total Assets', formatCurrency(data.totalAssets || 0)],
    [],
    ['LIABILITIES & EQUITY'],
    ['Current Liabilities'],
    ['Accounts Payable', formatCurrency(data.accountsPayable || 0)],
    ['Short-term Debt', formatCurrency(data.shortTermDebt || 0)],
    ['Total Current Liabilities', formatCurrency(data.totalCurrentLiabilities || 0)],
    [],
    ['Long-term Liabilities'],
    ['Long-term Debt', formatCurrency(data.longTermDebt || 0)],
    ['Total Long-term Liabilities', formatCurrency(data.totalLongTermLiabilities || 0)],
    [],
    ['Total Liabilities', formatCurrency(data.totalLiabilities || 0)],
    ['Total Equity', formatCurrency(data.totalEquity || 0)],
    ['Total Liabilities & Equity', formatCurrency(data.totalLiabilitiesAndEquity || 0)]
  ];
  
  return XLSX.utils.aoa_to_sheet(rows);
}
