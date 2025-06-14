import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import PptxGenJS from 'pptxgenjs';

export async function POST(request: NextRequest) {
  try {
    const { deck, format } = await request.json();

    if (!deck || !format) {
      return NextResponse.json(
        { error: 'Deck data and format are required' },
        { status: 400 }
      );
    }

    let exportBuffer: ArrayBuffer;
    let mimeType: string;
    let filename: string;

    switch (format) {
      case 'pdf':
        exportBuffer = await generatePDFExport(deck);
        mimeType = 'application/pdf';
        filename = `audit-deck-${deck.metadata?.companyName?.replace(/\s+/g, '-') || 'export'}.pdf`;
        break;
      case 'pptx':
        exportBuffer = await generatePowerPointExport(deck);
        mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        filename = `audit-deck-${deck.metadata?.companyName?.replace(/\s+/g, '-') || 'export'}.pptx`;
        break;
      case 'google-slides':
        // For Google Slides, we'll return a formatted HTML that can be imported
        const slidesHtml = await generateGoogleSlidesHTML(deck);
        return NextResponse.json({
          success: true,
          format: 'google-slides',
          content: slidesHtml,
          instructions: 'Copy this HTML and paste into Google Slides using File > Import slides'
        });
      default:
        return NextResponse.json(
          { error: 'Unsupported export format' },
          { status: 400 }
        );
    }

    return new NextResponse(exportBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export audit deck' },
      { status: 500 }
    );
  }
}

async function generatePDFExport(deck: any): Promise<ArrayBuffer> {
  const doc = new jsPDF('landscape', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Brand colors
  const primaryColor = [59, 130, 246] as const; // Blue
  const secondaryColor = [147, 51, 234] as const; // Purple
  const textColor = [31, 41, 55] as const; // Dark gray
  
  let currentPage = 0;

  // Title Slide
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Company logo placeholder
  doc.setFillColor(255, 255, 255);
  doc.circle(pageWidth / 2, 50, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.text(deck.metadata?.companyName || 'Company Name', pageWidth / 2, 90, { align: 'center' });
  
  doc.setFontSize(24);
  doc.text('Financial Audit Report', pageWidth / 2, 110, { align: 'center' });
  
  doc.setFontSize(16);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 130, { align: 'center' });
  
  if (deck.metadata?.closeabilityScore) {
    doc.setFontSize(20);
    doc.text(`AI Score: ${deck.metadata.closeabilityScore}/100`, pageWidth / 2, 150, { align: 'center' });
  }

  // Executive Summary
  doc.addPage();
  doc.setFillColor(245, 247, 250);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(24);
  doc.text('Executive Summary', 20, 25);
  
  doc.setFontSize(12);
  let yPos = 55;
  
  // Key findings
  if (deck.executiveSummary?.keyFindings) {
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Key Findings:', 20, yPos);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    yPos += 10;
    
    deck.executiveSummary.keyFindings.forEach((finding: string) => {
      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = 30;
      }
      doc.text(`• ${finding}`, 25, yPos);
      yPos += 8;
    });
  }

  // Financial Snapshot
  if (deck.financialSnapshot) {
    doc.addPage();
    doc.setFillColor(245, 247, 250);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(24);
    doc.text('Financial Snapshot', 20, 25);
    
    // Create financial metrics table
    const metricsData = deck.financialSnapshot.keyMetrics?.map((metric: any) => [
      metric.name,
      metric.value,
      metric.change || 'N/A',
      metric.trend || 'stable'
    ]) || [];
    
    if (metricsData.length > 0) {
      (doc as any).autoTable({
        head: [['Metric', 'Value', 'Change', 'Trend']],
        body: metricsData,
        startY: 50,
        theme: 'grid',
        headStyles: { 
          fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]],
          fontSize: 12
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 50, halign: 'right' },
          2: { cellWidth: 40, halign: 'center' },
          3: { cellWidth: 40, halign: 'center' }
        }
      });
    }
    
    // Industry comparison chart
    if (deck.financialSnapshot.industryComparison) {
      yPos = (doc as any).lastAutoTable.finalY + 20;
      doc.setFontSize(16);
      doc.text('Industry Comparison', 20, yPos);
      
      const comparisonData = deck.financialSnapshot.industryComparison.map((item: any) => [
        item.metric,
        item.company,
        item.industry,
        item.ranking
      ]);
      
      (doc as any).autoTable({
        head: [['Metric', 'Company', 'Industry Avg', 'Ranking']],
        body: comparisonData,
        startY: yPos + 10,
        theme: 'striped',
        headStyles: { fillColor: [secondaryColor[0], secondaryColor[1], secondaryColor[2]] }
      });
    }
  }

  // Pain Points Analysis
  if (deck.painPoints) {
    doc.addPage();
    doc.setFillColor(245, 247, 250);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(24);
    doc.text('Pain Points Analysis', 20, 25);
    
    yPos = 55;
    deck.painPoints.identifiedPains?.forEach((pain: any, index: number) => {
      if (yPos > pageHeight - 50) {
        doc.addPage();
        yPos = 30;
      }
      
      // Priority indicator
      const priorityColors = {
        high: [239, 68, 68] as const,
        medium: [251, 191, 36] as const,
        low: [34, 197, 94] as const
      };
      
      const colors = priorityColors[pain.priority as keyof typeof priorityColors] || priorityColors.low;
      doc.setFillColor(colors[0], colors[1], colors[2]);
      doc.rect(20, yPos - 5, 5, 20, 'F');
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(pain.painPoint, 30, yPos);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(11);
      
      yPos += 8;
      doc.text(`Impact: ${pain.impact}`, 30, yPos);
      yPos += 6;
      doc.text(`Solution: ${pain.solution}`, 30, yPos);
      yPos += 6;
      doc.text(`Estimated Value: ${pain.estimatedValue ? `$${pain.estimatedValue.toLocaleString()}` : 'TBD'}`, 30, yPos);
      yPos += 15;
    });
  }

  // Recommendations
  if (deck.recommendations) {
    doc.addPage();
    doc.setFillColor(245, 247, 250);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(24);
    doc.text('Strategic Recommendations', 20, 25);
    
    const sections = [
      { title: 'Immediate Actions (0-30 days)', items: deck.recommendations.immediate },
      { title: 'Short-term (2-6 months)', items: deck.recommendations.shortTerm },
      { title: 'Long-term (6+ months)', items: deck.recommendations.longTerm }
    ];
    
    yPos = 55;
    sections.forEach(section => {
      if (section.items && section.items.length > 0) {
        if (yPos > pageHeight - 50) {
          doc.addPage();
          yPos = 30;
        }
        
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text(section.title, 20, yPos);
        doc.setFont(undefined, 'normal');
        yPos += 10;
        
        section.items.forEach((item: any) => {
          if (yPos > pageHeight - 30) {
            doc.addPage();
            yPos = 30;
          }
          
          doc.setFontSize(12);
          doc.text(`• ${item.action}`, 25, yPos);
          yPos += 6;
          doc.setFontSize(10);
          doc.text(`  ${item.rationale}`, 30, yPos);
          yPos += 10;
        });
        
        yPos += 10;
      }
    });
  }

  // ROI & Investment
  if (deck.engagement) {
    doc.addPage();
    doc.setFillColor(245, 247, 250);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(24);
    doc.text('Proposed Engagement & ROI', 20, 25);
    
    // Investment summary box
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(20, 50, pageWidth - 40, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('Investment Summary', pageWidth / 2, 65, { align: 'center' });
    doc.setFontSize(14);
    doc.text(`Monthly: ${deck.engagement.investment?.monthly || 'TBD'} | Setup: ${deck.engagement.investment?.setup || 'TBD'} | 6-Month Total: ${deck.engagement.investment?.total || 'TBD'}`, pageWidth / 2, 80, { align: 'center' });
    
    // ROI metrics
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    yPos = 110;
    if (deck.engagement.roi) {
      const roiData = [
        ['Time to Value', deck.engagement.roi.timeToValue],
        ['Year 1 ROI', deck.engagement.roi.yearOneROI],
        ['3-Year ROI', deck.engagement.roi.threeYearROI]
      ];
      
      (doc as any).autoTable({
        body: roiData,
        startY: yPos,
        theme: 'plain',
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 60 },
          1: { halign: 'right', cellWidth: 60 }
        }
      });
    }
  }

  return doc.output('arraybuffer');
}

async function generatePowerPointExport(deck: any): Promise<ArrayBuffer> {
  const pptx = new PptxGenJS();
  pptx.author = 'QuickScope AI';
  pptx.company = 'QuickScope';
  pptx.title = `${deck.metadata?.companyName || 'Company'} - Financial Audit Deck`;

  // Define brand colors
  const brandBlue = '3B82F6';
  const brandPurple = '9333EA';
  const darkGray = '1F2937';
  const lightGray = 'F3F4F6';

  // Title Slide
  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: brandBlue };
  
  titleSlide.addText(deck.metadata?.companyName || 'Company Name', {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 1,
    fontSize: 36,
    color: 'FFFFFF',
    align: 'center',
    bold: true
  });
  
  titleSlide.addText('Financial Audit Report', {
    x: 0.5,
    y: 2.8,
    w: 9,
    h: 0.8,
    fontSize: 24,
    color: 'FFFFFF',
    align: 'center'
  });
  
  titleSlide.addText(`Generated: ${new Date().toLocaleDateString()}`, {
    x: 0.5,
    y: 4,
    w: 9,
    h: 0.5,
    fontSize: 16,
    color: 'FFFFFF',
    align: 'center'
  });

  if (deck.metadata?.closeabilityScore) {
    titleSlide.addText(`AI Confidence Score: ${deck.metadata.closeabilityScore}/100`, {
      x: 0.5,
      y: 5,
      w: 9,
      h: 0.5,
      fontSize: 18,
      color: 'FFFFFF',
      align: 'center',
      bold: true
    });
  }

  // Executive Summary Slide
  if (deck.executiveSummary) {
    const execSlide = pptx.addSlide();
    execSlide.addText('Executive Summary', {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.8,
      fontSize: 28,
      color: darkGray,
      bold: true
    });

    // Overall Score
    if (deck.executiveSummary.overallScore) {
      execSlide.addShape(pptx.ShapeType.rect, {
        x: 7.5,
        y: 0.3,
        w: 2,
        h: 0.8,
        fill: { color: brandPurple },
        line: { color: brandPurple }
      });
      
      execSlide.addText(`Score: ${deck.executiveSummary.overallScore}/100`, {
        x: 7.5,
        y: 0.3,
        w: 2,
        h: 0.8,
        fontSize: 14,
        color: 'FFFFFF',
        align: 'center',
        valign: 'middle',
        bold: true
      });
    }

    // Key Findings
    let yPos = 1.5;
    if (deck.executiveSummary.keyFindings) {
      execSlide.addText('Key Findings:', {
        x: 0.5,
        y: yPos,
        w: 9,
        h: 0.4,
        fontSize: 16,
        color: darkGray,
        bold: true
      });
      yPos += 0.5;

      deck.executiveSummary.keyFindings.forEach((finding: string) => {
        execSlide.addText(`• ${finding}`, {
          x: 0.8,
          y: yPos,
          w: 8.7,
          h: 0.4,
          fontSize: 14,
          color: darkGray
        });
        yPos += 0.4;
      });
    }
  }

  // Financial Snapshot Slide
  if (deck.financialSnapshot) {
    const finSlide = pptx.addSlide();
    finSlide.addText('Financial Snapshot', {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.8,
      fontSize: 28,
      color: darkGray,
      bold: true
    });

    // Health Score indicator
    if (deck.financialSnapshot.healthScore) {
      const healthColor = deck.financialSnapshot.healthScore >= 80 ? '22C55E' : 
                         deck.financialSnapshot.healthScore >= 60 ? 'FCD34D' : 'EF4444';
      
      finSlide.addShape(pptx.ShapeType.rect, {
        x: 7.5,
        y: 0.3,
        w: 2,
        h: 0.8,
        fill: { color: healthColor },
        line: { color: healthColor }
      });
      
      finSlide.addText(`Health: ${deck.financialSnapshot.healthScore}/100`, {
        x: 7.5,
        y: 0.3,
        w: 2,
        h: 0.8,
        fontSize: 14,
        color: 'FFFFFF',
        align: 'center',
        valign: 'middle',
        bold: true
      });
    }

    // Key Metrics Table
    if (deck.financialSnapshot.keyMetrics) {
      const metricsRows: any[] = [
        [
          { text: 'Metric', options: { bold: true, fill: { color: lightGray } } },
          { text: 'Value', options: { bold: true, fill: { color: lightGray } } },
          { text: 'Change', options: { bold: true, fill: { color: lightGray } } },
          { text: 'Trend', options: { bold: true, fill: { color: lightGray } } }
        ]
      ];

      deck.financialSnapshot.keyMetrics.forEach((metric: any) => {
        metricsRows.push([
          metric.name,
          metric.value,
          metric.change || 'N/A',
          metric.trend || 'stable'
        ]);
      });

      finSlide.addTable(metricsRows, {
        x: 0.5,
        y: 1.5,
        w: 9,
        fontSize: 12,
        border: { pt: 0.5, color: 'CCCCCC' },
        autoPage: false
      });
    }
  }

  // Pain Points Slide
  if (deck.painPoints?.identifiedPains) {
    const painSlide = pptx.addSlide();
    painSlide.addText('Critical Pain Points', {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.8,
      fontSize: 28,
      color: darkGray,
      bold: true
    });

    let yPos = 1.3;
    deck.painPoints.identifiedPains.forEach((pain: any, index: number) => {
      if (index < 3) { // Show top 3 pain points
        const priorityColor = pain.priority === 'high' ? 'EF4444' :
                            pain.priority === 'medium' ? 'FCD34D' : '22C55E';
        
        // Priority badge
        painSlide.addShape(pptx.ShapeType.rect, {
          x: 0.5,
          y: yPos,
          w: 0.8,
          h: 0.4,
          fill: { color: priorityColor },
          line: { color: priorityColor }
        });
        
        painSlide.addText(pain.priority.toUpperCase(), {
          x: 0.5,
          y: yPos,
          w: 0.8,
          h: 0.4,
          fontSize: 10,
          color: 'FFFFFF',
          align: 'center',
          valign: 'middle',
          bold: true
        });
        
        // Pain point details
        painSlide.addText(pain.painPoint, {
          x: 1.5,
          y: yPos,
          w: 8,
          h: 0.4,
          fontSize: 16,
          color: darkGray,
          bold: true
        });
        
        painSlide.addText(`Impact: ${pain.impact}`, {
          x: 1.5,
          y: yPos + 0.4,
          w: 8,
          h: 0.3,
          fontSize: 12,
          color: '6B7280'
        });
        
        painSlide.addText(`Solution: ${pain.solution}`, {
          x: 1.5,
          y: yPos + 0.7,
          w: 8,
          h: 0.3,
          fontSize: 12,
          color: '6B7280'
        });
        
        yPos += 1.3;
      }
    });
  }

  // Opportunities Slide
  if (deck.opportunities?.opportunities) {
    const oppSlide = pptx.addSlide();
    oppSlide.addText('Strategic Opportunities', {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.8,
      fontSize: 28,
      color: darkGray,
      bold: true
    });

    const oppRows: any[] = [
      [
        { text: 'Opportunity', options: { bold: true, fill: { color: lightGray } } },
        { text: 'Value', options: { bold: true, fill: { color: lightGray } } },
        { text: 'Timeline', options: { bold: true, fill: { color: lightGray } } },
        { text: 'Difficulty', options: { bold: true, fill: { color: lightGray } } }
      ]
    ];

    deck.opportunities.opportunities.forEach((opp: any) => {
      oppRows.push([
        opp.opportunity,
        opp.potentialValue,
        opp.timeline,
        opp.difficulty
      ]);
    });

    oppSlide.addTable(oppRows, {
      x: 0.5,
      y: 1.5,
      w: 9,
      fontSize: 12,
      border: { pt: 0.5, color: 'CCCCCC' }
    });
  }

  // ROI & Next Steps Slide
  if (deck.engagement) {
    const roiSlide = pptx.addSlide();
    roiSlide.addText('Investment & ROI', {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.8,
      fontSize: 28,
      color: darkGray,
      bold: true
    });

    // Investment box
    roiSlide.addShape(pptx.ShapeType.rect, {
      x: 1,
      y: 1.5,
      w: 8,
      h: 1.5,
      fill: { color: brandBlue },
      line: { color: brandBlue }
    });

    roiSlide.addText('Investment Summary', {
      x: 1,
      y: 1.5,
      w: 8,
      h: 0.5,
      fontSize: 18,
      color: 'FFFFFF',
      align: 'center',
      bold: true
    });

    if (deck.engagement.investment) {
      roiSlide.addText(
        `Monthly: ${deck.engagement.investment.monthly} | Setup: ${deck.engagement.investment.setup} | 6-Month Total: ${deck.engagement.investment.total}`,
        {
          x: 1,
          y: 2.2,
          w: 8,
          h: 0.5,
          fontSize: 14,
          color: 'FFFFFF',
          align: 'center'
        }
      );
    }

    // ROI metrics
    if (deck.engagement.roi) {
      let yPos = 3.5;
      const roiMetrics = [
        { label: 'Time to Value', value: deck.engagement.roi.timeToValue },
        { label: 'Year 1 ROI', value: deck.engagement.roi.yearOneROI },
        { label: '3-Year ROI', value: deck.engagement.roi.threeYearROI }
      ];

      roiMetrics.forEach(metric => {
        roiSlide.addText(metric.label + ':', {
          x: 2,
          y: yPos,
          w: 3,
          h: 0.5,
          fontSize: 14,
          color: darkGray,
          bold: true
        });

        roiSlide.addText(metric.value, {
          x: 5,
          y: yPos,
          w: 3,
          h: 0.5,
          fontSize: 14,
          color: brandPurple,
          bold: true
        });

        yPos += 0.6;
      });
    }
  }

  // Thank You Slide
  const thankYouSlide = pptx.addSlide();
  thankYouSlide.background = { color: brandPurple };
  
  thankYouSlide.addText('Thank You', {
    x: 0.5,
    y: 2,
    w: 9,
    h: 1,
    fontSize: 48,
    color: 'FFFFFF',
    align: 'center',
    bold: true
  });
  
  thankYouSlide.addText('Ready to Transform Your Financial Operations?', {
    x: 0.5,
    y: 3.5,
    w: 9,
    h: 0.5,
    fontSize: 20,
    color: 'FFFFFF',
    align: 'center'
  });
  
  thankYouSlide.addText('Contact us to get started', {
    x: 0.5,
    y: 4.5,
    w: 9,
    h: 0.5,
    fontSize: 16,
    color: 'FFFFFF',
    align: 'center'
  });

  // Generate the presentation
  const pptxBuffer = await pptx.write({ outputType: 'arraybuffer' });
  return pptxBuffer as ArrayBuffer;
}

async function generateGoogleSlidesHTML(deck: any): Promise<string> {
  // Generate structured HTML that can be easily imported into Google Slides
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${deck.metadata?.companyName || 'Company'} - Financial Audit</title>
  <style>
    body { font-family: Arial, sans-serif; }
    .slide { page-break-after: always; padding: 40px; min-height: 700px; }
    .slide-title { background: #3B82F6; color: white; padding: 60px; text-align: center; }
    h1 { font-size: 48px; margin: 0 0 20px 0; }
    h2 { font-size: 32px; color: #1F2937; margin: 0 0 20px 0; }
    h3 { font-size: 24px; color: #374151; margin: 20px 0 10px 0; }
    .metric { background: #F3F4F6; padding: 20px; margin: 10px 0; border-radius: 8px; }
    .priority-high { border-left: 5px solid #EF4444; }
    .priority-medium { border-left: 5px solid #FCD34D; }
    .priority-low { border-left: 5px solid #22C55E; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #3B82F6; color: white; padding: 12px; text-align: left; }
    td { border: 1px solid #E5E7EB; padding: 12px; }
    .score-badge { background: #9333EA; color: white; padding: 10px 20px; border-radius: 20px; display: inline-block; }
  </style>
</head>
<body>
  <!-- Title Slide -->
  <div class="slide slide-title">
    <h1>${deck.metadata?.companyName || 'Company Name'}</h1>
    <h2 style="color: white;">Financial Audit Report</h2>
    <p style="font-size: 20px; color: white;">Generated: ${new Date().toLocaleDateString()}</p>
    ${deck.metadata?.closeabilityScore ? `<p class="score-badge">AI Score: ${deck.metadata.closeabilityScore}/100</p>` : ''}
  </div>

  <!-- Executive Summary -->
  <div class="slide">
    <h2>Executive Summary</h2>
    ${deck.executiveSummary?.overallScore ? `<p class="score-badge">Overall Score: ${deck.executiveSummary.overallScore}/100</p>` : ''}
    
    <h3>Key Findings</h3>
    <ul>
      ${(deck.executiveSummary?.keyFindings || []).map((finding: string) => `<li>${finding}</li>`).join('')}
    </ul>
    
    ${deck.executiveSummary?.urgentIssues?.length > 0 ? `
    <h3>Urgent Issues</h3>
    <ul>
      ${deck.executiveSummary.urgentIssues.map((issue: string) => `<li style="color: #DC2626;">${issue}</li>`).join('')}
    </ul>
    ` : ''}
  </div>

  <!-- Financial Snapshot -->
  ${deck.financialSnapshot ? `
  <div class="slide">
    <h2>Financial Snapshot</h2>
    ${deck.financialSnapshot.healthScore ? `<p class="score-badge">Health Score: ${deck.financialSnapshot.healthScore}/100</p>` : ''}
    
    <table>
      <thead>
        <tr>
          <th>Metric</th>
          <th>Value</th>
          <th>Change</th>
          <th>Trend</th>
        </tr>
      </thead>
      <tbody>
        ${(deck.financialSnapshot.keyMetrics || []).map((metric: any) => `
        <tr>
          <td>${metric.name}</td>
          <td>${metric.value}</td>
          <td>${metric.change || 'N/A'}</td>
          <td>${metric.trend || 'stable'}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}

  <!-- Pain Points -->
  ${deck.painPoints?.identifiedPains?.length > 0 ? `
  <div class="slide">
    <h2>Critical Pain Points</h2>
    ${deck.painPoints.identifiedPains.map((pain: any) => `
    <div class="metric priority-${pain.priority}">
      <h3>${pain.painPoint}</h3>
      <p><strong>Impact:</strong> ${pain.impact}</p>
      <p><strong>Solution:</strong> ${pain.solution}</p>
      <p><strong>Estimated Value:</strong> ${pain.estimatedValue ? `$${pain.estimatedValue.toLocaleString()}` : 'TBD'}</p>
    </div>
    `).join('')}
  </div>
  ` : ''}

  <!-- Recommendations -->
  ${deck.recommendations ? `
  <div class="slide">
    <h2>Strategic Recommendations</h2>
    
    ${deck.recommendations.immediate?.length > 0 ? `
    <h3>Immediate Actions (0-30 days)</h3>
    ${deck.recommendations.immediate.map((action: any) => `
    <div class="metric">
      <h4>${action.action}</h4>
      <p>${action.rationale}</p>
      <p><strong>Expected Outcome:</strong> ${action.expectedOutcome}</p>
    </div>
    `).join('')}
    ` : ''}
    
    ${deck.recommendations.shortTerm?.length > 0 ? `
    <h3>Short-term (2-6 months)</h3>
    ${deck.recommendations.shortTerm.map((action: any) => `
    <div class="metric">
      <h4>${action.action}</h4>
      <p>${action.rationale}</p>
    </div>
    `).join('')}
    ` : ''}
  </div>
  ` : ''}

  <!-- ROI & Investment -->
  ${deck.engagement ? `
  <div class="slide">
    <h2>Investment & ROI</h2>
    
    ${deck.engagement.investment ? `
    <div class="metric" style="background: #3B82F6; color: white;">
      <h3 style="color: white;">Investment Summary</h3>
      <p>Monthly: ${deck.engagement.investment.monthly} | Setup: ${deck.engagement.investment.setup} | 6-Month Total: ${deck.engagement.investment.total}</p>
    </div>
    ` : ''}
    
    ${deck.engagement.roi ? `
    <h3>Expected Returns</h3>
    <table>
      <tr>
        <td><strong>Time to Value:</strong></td>
        <td>${deck.engagement.roi.timeToValue}</td>
      </tr>
      <tr>
        <td><strong>Year 1 ROI:</strong></td>
        <td>${deck.engagement.roi.yearOneROI}</td>
      </tr>
      <tr>
        <td><strong>3-Year ROI:</strong></td>
        <td>${deck.engagement.roi.threeYearROI}</td>
      </tr>
    </table>
    ` : ''}
  </div>
  ` : ''}
</body>
</html>
  `;
  
  return html;
} 