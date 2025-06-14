import { NextRequest, NextResponse } from 'next/server';
import { AIInsightsEngine } from '@/lib/aiInsightsEngine';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { 
      prospectId, 
      transcriptText, 
      financialData, 
      companyInfo,
      analysisType = 'comprehensive' // 'comprehensive' | 'transcript-only' | 'financial-only'
    } = await request.json();

    if (!prospectId || !companyInfo?.name) {
      return NextResponse.json(
        { error: 'Missing required fields: prospectId and companyInfo.name' }, 
        { status: 400 }
      );
    }

    const aiEngine = new AIInsightsEngine();
    let analysisResults: any = {};

    // Perform different types of analysis based on request
    switch (analysisType) {
      case 'comprehensive':
        if (!transcriptText || !financialData) {
          return NextResponse.json(
            { error: 'Comprehensive analysis requires both transcript and financial data' }, 
            { status: 400 }
          );
        }

        // Run full AI analysis pipeline
        const [transcriptAnalysis, financialIntelligence] = await Promise.all([
          aiEngine.analyzeCallTranscript(transcriptText, companyInfo.name),
          aiEngine.analyzeFinancialData(financialData, companyInfo)
        ]);

        const businessInsights = await aiEngine.generateBusinessInsights(
          transcriptAnalysis,
          financialIntelligence,
          companyInfo
        );

        const auditDeckIntelligence = await aiEngine.generateAuditDeckIntelligence(
          businessInsights,
          transcriptAnalysis,
          financialIntelligence,
          companyInfo
        );

        const talkingPoints = await aiEngine.generatePresentationTalkingPoints(
          auditDeckIntelligence,
          transcriptAnalysis,
          companyInfo.name
        );

        analysisResults = {
          transcriptAnalysis,
          financialIntelligence,
          businessInsights,
          auditDeckIntelligence,
          talkingPoints,
          analysisType: 'comprehensive'
        };
        break;

      case 'transcript-only':
        if (!transcriptText) {
          return NextResponse.json(
            { error: 'Transcript analysis requires transcript text' }, 
            { status: 400 }
          );
        }

        analysisResults.transcriptAnalysis = await aiEngine.analyzeCallTranscript(
          transcriptText, 
          companyInfo.name
        );
        analysisResults.analysisType = 'transcript-only';
        break;

      case 'financial-only':
        if (!financialData) {
          return NextResponse.json(
            { error: 'Financial analysis requires financial data' }, 
            { status: 400 }
          );
        }

        analysisResults.financialIntelligence = await aiEngine.analyzeFinancialData(
          financialData, 
          companyInfo
        );
        analysisResults.analysisType = 'financial-only';
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid analysis type' }, 
          { status: 400 }
        );
    }

    // Store analysis results in database
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('ai_analyses')
      .upsert({
        prospect_id: prospectId,
        analysis_type: analysisType,
        analysis_data: analysisResults,
        company_name: companyInfo.name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (saveError) {
      console.error('Failed to save AI analysis:', saveError);
      // Continue - don't fail the API if DB save fails
    }

    // Return analysis results with metadata
    return NextResponse.json({
      success: true,
      prospectId,
      analysisId: savedAnalysis?.id || null,
      companyName: companyInfo.name,
      analysisType,
      timestamp: new Date().toISOString(),
      results: analysisResults,
      recommendations: {
        nextSteps: generateNextSteps(analysisResults, analysisType),
        urgencyLevel: calculateUrgencyLevel(analysisResults),
        readinessScore: calculateReadinessScore(analysisResults)
      }
    });

  } catch (error) {
    console.error('AI analysis error:', error);
    
    return NextResponse.json(
      { 
        error: 'AI analysis failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}

// Helper function to generate next steps based on analysis
function generateNextSteps(analysisResults: any, analysisType: string): string[] {
  const nextSteps: string[] = [];

  if (analysisType === 'comprehensive' || analysisType === 'transcript-only') {
    const transcriptAnalysis = analysisResults.transcriptAnalysis;
    
    if (transcriptAnalysis?.salesIntelligence?.closeability > 70) {
      nextSteps.push('Schedule audit call presentation within 3-5 business days');
      nextSteps.push('Prepare customized audit deck with specific findings');
    } else if (transcriptAnalysis?.salesIntelligence?.closeability > 50) {
      nextSteps.push('Address identified objections in follow-up communication');
      nextSteps.push('Provide additional case studies or references');
    } else {
      nextSteps.push('Schedule additional discovery to understand concerns');
      nextSteps.push('Provide educational content to build trust');
    }

    if (transcriptAnalysis?.urgencySignals?.timeline) {
      nextSteps.push(`Align follow-up with stated timeline: ${transcriptAnalysis.urgencySignals.timeline}`);
    }
  }

  if (analysisType === 'comprehensive' || analysisType === 'financial-only') {
    const financialIntelligence = analysisResults.financialIntelligence;
    
    if (financialIntelligence?.healthScore < 60) {
      nextSteps.push('Emphasize urgent financial risks in presentation');
      nextSteps.push('Prepare immediate action plan for critical issues');
    }

    if (financialIntelligence?.opportunities?.length > 0) {
      nextSteps.push('Quantify top 3 opportunities in audit presentation');
      nextSteps.push('Prepare ROI calculations for proposed solutions');
    }
  }

  if (nextSteps.length === 0) {
    nextSteps.push('Review analysis results and prepare follow-up strategy');
    nextSteps.push('Schedule team review of findings');
  }

  return nextSteps;
}

// Calculate urgency level based on analysis
function calculateUrgencyLevel(analysisResults: any): 'low' | 'medium' | 'high' {
  let urgencyScore = 0;

  // Check transcript signals
  if (analysisResults.transcriptAnalysis) {
    const ta = analysisResults.transcriptAnalysis;
    
    if (ta.urgencySignals?.timeline?.includes('urgent') || ta.urgencySignals?.timeline?.includes('immediate')) {
      urgencyScore += 30;
    } else if (ta.urgencySignals?.timeline?.includes('soon') || ta.urgencySignals?.timeline?.includes('quickly')) {
      urgencyScore += 20;
    }

    if (ta.urgencySignals?.pressurePoints?.length > 2) urgencyScore += 15;
    if (ta.salesIntelligence?.closeability > 70) urgencyScore += 20;
  }

  // Check financial health
  if (analysisResults.financialIntelligence) {
    const fi = analysisResults.financialIntelligence;
    
    if (fi.healthScore < 50) urgencyScore += 25;
    else if (fi.healthScore < 70) urgencyScore += 15;

    if (fi.riskFactors?.some((r: any) => r.severity === 'high')) urgencyScore += 20;
  }

  if (urgencyScore >= 60) return 'high';
  if (urgencyScore >= 30) return 'medium';
  return 'low';
}

// Calculate readiness to close score
function calculateReadinessScore(analysisResults: any): number {
  let readinessScore = 50; // Base score

  if (analysisResults.transcriptAnalysis) {
    const ta = analysisResults.transcriptAnalysis;
    
    // Positive indicators
    readinessScore += ta.salesIntelligence?.closeability || 0;
    readinessScore += (ta.salesIntelligence?.buyingSignals?.length || 0) * 5;
    readinessScore += ta.decisionMakers?.filter((dm: any) => dm.influence === 'high').length * 10;
    
    // Negative indicators
    readinessScore -= (ta.salesIntelligence?.objections?.length || 0) * 8;
    readinessScore -= (ta.competitiveContext?.alternatives?.length || 0) * 5;
  }

  if (analysisResults.financialIntelligence) {
    const fi = analysisResults.financialIntelligence;
    
    // Financial urgency creates readiness
    if (fi.healthScore < 60) readinessScore += 15;
    readinessScore += (fi.opportunities?.length || 0) * 3;
  }

  return Math.max(0, Math.min(100, Math.round(readinessScore)));
}

// GET endpoint to retrieve saved analyses
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const prospectId = searchParams.get('prospectId');
  const analysisId = searchParams.get('analysisId');

  try {
    let query = supabase.from('ai_analyses').select('*');

    if (analysisId) {
      query = query.eq('id', analysisId);
    } else if (prospectId) {
      query = query.eq('prospect_id', prospectId).order('created_at', { ascending: false });
    } else {
      return NextResponse.json(
        { error: 'Either prospectId or analysisId is required' }, 
        { status: 400 }
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to retrieve analyses' }, 
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      analyses: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Get analyses error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve analyses' }, 
      { status: 500 }
    );
  }
}
