import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId, templateType, includeCharts } = body;

    // For now, return a mock audit deck generation response
    // This will be replaced with actual audit deck generation logic
    const mockAuditDeck = {
      id: `audit_${Date.now()}`,
      companyId,
      templateType: templateType || 'comprehensive',
      status: 'generated',
      sections: [
        {
          title: 'Executive Summary',
          content: 'Financial analysis summary for the company...',
          charts: includeCharts ? ['revenue_trend', 'expense_breakdown'] : []
        },
        {
          title: 'Financial Health Assessment',
          content: 'Detailed financial health metrics and insights...',
          charts: includeCharts ? ['health_score', 'ratio_analysis'] : []
        },
        {
          title: 'Recommendations',
          content: 'Strategic recommendations based on analysis...',
          charts: includeCharts ? ['improvement_areas'] : []
        }
      ],
      generatedAt: new Date().toISOString(),
      downloadUrl: `/api/audit-deck/download/${companyId}`,
      pageCount: 35
    };

    return NextResponse.json({
      success: true,
      auditDeck: mockAuditDeck
    });

  } catch (error) {
    console.error('Audit deck generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate audit deck',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return available audit deck templates
    const templates = [
      {
        id: 'comprehensive',
        name: 'Comprehensive Analysis',
        description: 'Full financial analysis with all insights',
        pageCount: 35,
        sections: ['Executive Summary', 'Financial Health', 'Cash Flow Analysis', 'Recommendations']
      },
      {
        id: 'executive',
        name: 'Executive Summary',
        description: 'High-level overview for executives',
        pageCount: 12,
        sections: ['Key Metrics', 'Executive Summary', 'Strategic Recommendations']
      },
      {
        id: 'investor',
        name: 'Investor Report',
        description: 'Investment-focused analysis',
        pageCount: 20,
        sections: ['Investment Overview', 'Financial Performance', 'Growth Opportunities', 'Risk Assessment']
      }
    ];

    return NextResponse.json({
      success: true,
      templates
    });

  } catch (error) {
    console.error('Template fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch templates'
      },
      { status: 500 }
    );
  }
}
