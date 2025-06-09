import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { companyId: string } }
) {
  try {
    const { companyId } = params;

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // For now, return a mock PDF download response
    // In production, this would generate and return the actual PDF
    const mockPdfContent = Buffer.from(`
      QuickScope Financial Analysis Report
      Company ID: ${companyId}
      Generated: ${new Date().toLocaleString()}
      
      This is a mock PDF report.
      In production, this would be a comprehensive financial analysis document.
    `);

    return new NextResponse(mockPdfContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="audit-deck-${companyId}.pdf"`,
        'Content-Length': mockPdfContent.length.toString(),
      },
    });

  } catch (error) {
    console.error('PDF download error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to download audit deck',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
