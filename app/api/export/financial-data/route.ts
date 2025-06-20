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
  let currentY = 20;

  // Cover Page
  doc.setFillColor(41, 128, 185);
  doc.rect(0, 0, 210, 297, 'F'); // Full page background
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.text('ELITE FINANCIAL ANALYSIS', 105, 100, { align: 'center' });
  
  doc.setFontSize(20);
  doc.text(companyName, 105, 120, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text(`AI-Enhanced Strategic Report`, 105, 140, { align: 'center' });
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 160, { align: 'center' });
  
  // Health Score Circle
  if (data.executive_summary?.health_score) {
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(3);
    doc.circle(105, 200, 25, 'S');
    doc.setFontSize(36);
    doc.text(`${data.executive_summary.health_score}`, 105, 205, { align: 'center' });
    doc.setFontSize(12);
    doc.text('FINANCIAL HEALTH SCORE', 105, 220, { align: 'center' });
  }

  // Page 2: Executive Summary
  doc.addPage();
  doc.setTextColor(0, 0, 0);
  currentY = 30;

  doc.setFontSize(24);
  doc.setTextColor(41, 128, 185);
  doc.text('Executive Summary', 20, currentY);
  currentY += 20;

  // Key Findings
  if (data.executive_summary?.key_findings) {
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Key Financial Findings', 20, currentY);
    currentY += 10;

    doc.setFontSize(11);
    data.executive_summary.key_findings.forEach((finding: string, index: number) => {
      const lines = doc.splitTextToSize(`• ${finding}`, 170);
      doc.text(lines, 25, currentY);
      currentY += lines.length * 5 + 3;
    });
    currentY += 10;
  }

  // Financial Metrics Table
  if (data.financial_metrics) {
    const metrics = data.financial_metrics;
    const metricsData = [
      ['Financial Metric', 'Value', 'Industry Benchmark'],
      ['Annual Revenue', formatCurrency(metrics.revenue), formatCurrency(2200000)],
      ['Net Income', formatCurrency(metrics.net_income), formatCurrency(450000)],
      ['Gross Margin', `${metrics.gross_margin.toFixed(1)}%`, '75.2%'],
      ['Operating Margin', `${metrics.operating_margin.toFixed(1)}%`, '22.1%'],
      ['Current Ratio', metrics.current_ratio.toFixed(1), '1.8'],
      ['Return on Assets', `${metrics.return_on_assets.toFixed(1)}%`, '8.9%'],
      ['Free Cash Flow', formatCurrency(metrics.free_cash_flow), formatCurrency(380000)]
    ];

    (doc as any).autoTable({
      head: [metricsData[0]],
      body: metricsData.slice(1),
      startY: currentY,
      theme: 'striped',
      headStyles: { 
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 4
      },
      alternateRowStyles: { fillColor: [248, 248, 248] },
      margin: { left: 20, right: 20 }
    });

    currentY = (doc as any).lastAutoTable.finalY + 15;
  }

  // Page 3: AI Strategic Insights
  doc.addPage();
  currentY = 30;

  doc.setFontSize(24);
  doc.setTextColor(41, 128, 185);
  doc.text('AI-Powered Strategic Insights', 20, currentY);
  currentY += 20;

  if (data.ai_insights && data.ai_insights.length > 0) {
    data.ai_insights.slice(0, 3).forEach((insight: any, index: number) => {
      // Insight Header
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`${index + 1}. ${insight.title}`, 20, currentY);
      currentY += 8;

      // Confidence Badge
      doc.setFillColor(76, 175, 80);
      doc.rect(20, currentY - 2, 30, 6, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text(`${insight.confidence}% Confidence`, 21, currentY + 2);
      doc.setTextColor(0, 0, 0);
      currentY += 10;

      // Description
      doc.setFontSize(10);
      const descLines = doc.splitTextToSize(insight.description, 170);
      doc.text(descLines, 25, currentY);
      currentY += descLines.length * 4 + 5;

      // Investment & ROI
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Investment: ${formatCurrency(insight.investment_required)} | ROI: ${insight.expected_roi.toFixed(1)}x | Timeline: ${insight.timeline}`, 25, currentY);
      currentY += 15;
    });
  }

  // Page 4: Strategic Recommendations
  doc.addPage();
  currentY = 30;

  doc.setFontSize(24);
  doc.setTextColor(41, 128, 185);
  doc.text('Strategic Action Plan', 20, currentY);
  currentY += 20;

  if (data.strategic_recommendations) {
    // Immediate Actions
    doc.setFontSize(16);
    doc.setTextColor(220, 53, 69);
    doc.text('🚨 Immediate Actions (0-30 days)', 20, currentY);
    currentY += 12;

    if (data.strategic_recommendations.immediate) {
      data.strategic_recommendations.immediate.forEach((action: any) => {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`• ${action.action}`, 25, currentY);
        currentY += 6;
        
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`Investment: ${action.investment} | Timeline: ${action.timeline}`, 30, currentY);
        currentY += 5;
        
        const outcomeLines = doc.splitTextToSize(`Expected: ${action.expected_outcome}`, 160);
        doc.text(outcomeLines, 30, currentY);
        currentY += outcomeLines.length * 4 + 8;
      });
    }

    currentY += 5;

    // Short-term Actions
    doc.setFontSize(16);
    doc.setTextColor(255, 193, 7);
    doc.text('⚡ Short-term Initiatives (1-6 months)', 20, currentY);
    currentY += 12;

    if (data.strategic_recommendations.short_term) {
      data.strategic_recommendations.short_term.forEach((action: any) => {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`• ${action.action}`, 25, currentY);
        currentY += 6;
        
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`Investment: ${action.investment} | Timeline: ${action.timeline}`, 30, currentY);
        currentY += 5;
        
        const outcomeLines = doc.splitTextToSize(`Expected: ${action.expected_outcome}`, 160);
        doc.text(outcomeLines, 30, currentY);
        currentY += outcomeLines.length * 4 + 8;
      });
    }

    currentY += 5;

    // Long-term Actions
    doc.setFontSize(16);
    doc.setTextColor(40, 167, 69);
    doc.text('🚀 Long-term Strategic Initiatives (6+ months)', 20, currentY);
    currentY += 12;

    if (data.strategic_recommendations.long_term) {
      data.strategic_recommendations.long_term.forEach((action: any) => {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`• ${action.action}`, 25, currentY);
        currentY += 6;
        
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`Investment: ${action.investment} | Timeline: ${action.timeline}`, 30, currentY);
        currentY += 5;
        
        const outcomeLines = doc.splitTextToSize(`Expected: ${action.expected_outcome}`, 160);
        doc.text(outcomeLines, 30, currentY);
        currentY += outcomeLines.length * 4 + 8;
      });
    }
  }

  // Page 5: Engagement Proposal
  doc.addPage();
  currentY = 30;

  doc.setFontSize(24);
  doc.setTextColor(41, 128, 185);
  doc.text('Engagement Proposal', 20, currentY);
  currentY += 20;

  if (data.engagement_proposal) {
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Recommended Services', 20, currentY);
    currentY += 15;

    if (data.engagement_proposal.services) {
      data.engagement_proposal.services.forEach((service: any) => {
        // Service box
        doc.setFillColor(240, 248, 255);
        doc.rect(20, currentY - 5, 170, 35, 'F');
        doc.setDrawColor(41, 128, 185);
        doc.rect(20, currentY - 5, 170, 35);

        doc.setFontSize(14);
        doc.setTextColor(41, 128, 185);
        doc.text(service.name, 25, currentY + 2);
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const descLines = doc.splitTextToSize(service.description, 160);
        doc.text(descLines, 25, currentY + 8);
        
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`Investment: ${service.monthly_investment}/month | Setup: ${service.setup_fee}`, 25, currentY + 18);
        doc.text(`Expected ROI: ${service.expected_roi} | Timeline: ${service.timeline}`, 25, currentY + 23);
        
        currentY += 45;
      });
    }

    // Investment Summary
    if (data.engagement_proposal.total_investment) {
      doc.setFontSize(16);
      doc.setTextColor(40, 167, 69);
      doc.text('Investment Summary', 20, currentY);
      currentY += 12;

      const investment = data.engagement_proposal.total_investment;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`• Setup Fee: ${investment.setup}`, 25, currentY);
      currentY += 8;
      doc.text(`• Monthly Investment: ${investment.monthly}`, 25, currentY);
      currentY += 8;
      doc.text(`• Year One Total: ${investment.year_one}`, 25, currentY);
      currentY += 8;
    }
  }

  // Footer on all pages
  const pageCount = (doc as any).getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`QuickScope Enhanced AI Platform | Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    doc.text(`Generated: ${new Date().toLocaleDateString()} | Confidential & Proprietary`, 105, 285, { align: 'center' });
  }

  return new Response(doc.output('arraybuffer'), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Elite_Financial_Analysis_${companyName.replace(/\s+/g, '-')}_${new Date().toISOString().split('T')[0]}.pdf"`
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
