import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabaseClient';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const prospectId = formData.get('prospectId') as string;
    const companyName = formData.get('companyName') as string;
    const file = formData.get('file') as File;
    const transcriptText = formData.get('transcriptText') as string;

    if (!prospectId || !companyName) {
      return NextResponse.json(
        { error: 'prospectId and companyName are required' }, 
        { status: 400 }
      );
    }

    let finalTranscript = transcriptText;

    // If file is provided, transcribe it using Whisper
    if (file && !transcriptText) {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      
      // Validate file type and size
      const allowedTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/m4a', 'video/mp4'];
      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a|mp4)$/i)) {
        return NextResponse.json(
          { error: 'Unsupported file type. Please upload MP3, WAV, M4A, or MP4 files.' }, 
          { status: 400 }
        );
      }

      if (file.size > 25 * 1024 * 1024) { // 25MB limit for Whisper
        return NextResponse.json(
          { error: 'File too large. Maximum size is 25MB.' }, 
          { status: 400 }
        );
      }

      try {
        // Use OpenAI Whisper for transcription
        const transcription = await openai.audio.transcriptions.create({
          file: new File([fileBuffer], file.name, { type: file.type }),
          model: "whisper-1",
          language: "en",
          response_format: "verbose_json",
          timestamp_granularities: ["segment"]
        });

        finalTranscript = transcription.text;

        // Store the raw transcription data
        await supabase
          .from('call_transcripts')
          .insert({
            prospect_id: prospectId,
            company_name: companyName,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            transcript_raw: transcription.text,
            transcript_segments: transcription.segments || [],
            created_at: new Date().toISOString()
          });

      } catch (transcriptionError) {
        console.error('Transcription error:', transcriptionError);
        return NextResponse.json(
          { error: 'Failed to transcribe audio file. Please try again or provide text directly.' }, 
          { status: 500 }
        );
      }
    } else if (!transcriptText) {
      return NextResponse.json(
        { error: 'Either upload an audio file or provide transcript text' }, 
        { status: 400 }
      );
    }

    // Analyze the transcript using AI
    const analysisPrompt = `Analyze this discovery call transcript for ${companyName} and extract key business intelligence:

TRANSCRIPT:
${finalTranscript}

Extract and structure the following information:
1. PAIN POINTS (categorized by: operational, financial, strategic, technology)
2. BUSINESS OBJECTIVES (short-term goals, long-term vision, growth targets, efficiency goals)
3. DECISION MAKERS (names, roles, influence level, concerns, priorities)
4. URGENCY SIGNALS (timeline, pressure points, catalysts, budget mentions)
5. COMPETITIVE CONTEXT (alternatives considered, differentiators needed, threats)
6. SALES INTELLIGENCE (buying signals, objections, next steps, closeability score 0-100)

Focus on actionable insights that would help a fractional CFO service provider close the deal.
Be specific and quote relevant parts of the transcript to support your analysis.

Return as structured JSON with clear categories and actionable insights.`;

    try {
      const analysis = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a senior business development analyst specializing in B2B sales for fractional CFO services. Extract actionable business intelligence from discovery call transcripts."
          },
          {
            role: "user",
            content: analysisPrompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const transcriptAnalysis = JSON.parse(analysis.choices[0].message.content || '{}');

      // Generate specific talking points for this prospect
      const talkingPointsPrompt = `Based on the transcript analysis for ${companyName}, generate specific talking points for the audit call presentation:

ANALYSIS CONTEXT:
${JSON.stringify(transcriptAnalysis, null, 2)}

Generate:
1. OPENING STATEMENTS (3-5 powerful openers that show you listened and understand their situation)
2. PROBLEM AMPLIFICATION (phrases that make their pain points feel urgent and costly)
3. SOLUTION TRANSITIONS (smooth ways to move from problem to solution)
4. VALUE PROPOSITIONS (specific benefits that address their stated needs)
5. OBJECTION RESPONSES (pre-emptive responses to likely concerns)
6. CLOSING STATEMENTS (compelling calls to action)

Make each talking point specific to ${companyName} and reference specific points from their call.
Focus on creating urgency and demonstrating expertise.`;

      const talkingPointsResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a master sales presenter and fractional CFO with extensive experience in closing high-value professional services engagements."
          },
          {
            role: "user",
            content: talkingPointsPrompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.4
      });

      const talkingPoints = JSON.parse(talkingPointsResponse.choices[0].message.content || '{}');

      // Calculate engagement scores
      const closeabilityScore = Math.min(100, Math.max(0, 
        transcriptAnalysis.salesIntelligence?.closeability || 
        calculateCloseabilityScore(transcriptAnalysis)
      ));

      const urgencyLevel = determineUrgencyLevel(transcriptAnalysis);
      const readinessLevel = calculateReadinessLevel(transcriptAnalysis);

      // Store the complete analysis
      const { data: savedAnalysis, error: saveError } = await supabase
        .from('transcript_analyses')
        .insert({
          prospect_id: prospectId,
          company_name: companyName,
          transcript_text: finalTranscript,
          analysis_data: transcriptAnalysis,
          talking_points: talkingPoints,
          closeability_score: closeabilityScore,
          urgency_level: urgencyLevel,
          readiness_level: readinessLevel,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (saveError) {
        console.error('Failed to save transcript analysis:', saveError);
      }

      // Return comprehensive results
      return NextResponse.json({
        success: true,
        prospectId,
        companyName,
        analysisId: savedAnalysis?.id || null,
        transcriptLength: finalTranscript.length,
        results: {
          transcript: finalTranscript,
          analysis: transcriptAnalysis,
          talkingPoints,
          scores: {
            closeability: closeabilityScore,
            urgency: urgencyLevel,
            readiness: readinessLevel
          },
          recommendations: generateRecommendations(transcriptAnalysis, closeabilityScore, urgencyLevel),
          nextSteps: generateNextSteps(transcriptAnalysis, closeabilityScore)
        },
        timestamp: new Date().toISOString()
      });

    } catch (aiError) {
      console.error('AI analysis error:', aiError);
      return NextResponse.json(
        { error: 'AI analysis failed. Please try again.' }, 
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Transcript processing error:', error);
    return NextResponse.json(
      { 
        error: 'Transcript processing failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}

// Helper functions
function calculateCloseabilityScore(analysis: any): number {
  let score = 50; // Base score

  // Positive indicators
  if (analysis.salesIntelligence?.buyingSignals?.length > 0) {
    score += analysis.salesIntelligence.buyingSignals.length * 8;
  }

  if (analysis.urgencySignals?.timeline?.includes('urgent') || 
      analysis.urgencySignals?.timeline?.includes('soon')) {
    score += 15;
  }

  if (analysis.decisionMakers?.some((dm: any) => dm.influence === 'high')) {
    score += 20;
  }

  if (analysis.urgencySignals?.budget && !analysis.urgencySignals.budget.includes('tight')) {
    score += 10;
  }

  // Negative indicators
  if (analysis.salesIntelligence?.objections?.length > 0) {
    score -= analysis.salesIntelligence.objections.length * 5;
  }

  if (analysis.competitiveContext?.alternatives?.length > 2) {
    score -= 10;
  }

  return Math.max(0, Math.min(100, score));
}

function determineUrgencyLevel(analysis: any): 'low' | 'medium' | 'high' {
  const urgentKeywords = ['urgent', 'immediate', 'asap', 'crisis', 'critical'];
  const mediumKeywords = ['soon', 'quickly', 'priority', 'important'];

  const timeline = analysis.urgencySignals?.timeline?.toLowerCase() || '';
  const pressurePoints = analysis.urgencySignals?.pressurePoints || [];

  if (urgentKeywords.some(keyword => timeline.includes(keyword)) || 
      pressurePoints.length > 2) {
    return 'high';
  }

  if (mediumKeywords.some(keyword => timeline.includes(keyword)) || 
      pressurePoints.length > 0) {
    return 'medium';
  }

  return 'low';
}

function calculateReadinessLevel(analysis: any): 'not-ready' | 'exploring' | 'evaluating' | 'ready' {
  const buyingSignals = analysis.salesIntelligence?.buyingSignals?.length || 0;
  const objections = analysis.salesIntelligence?.objections?.length || 0;
  const decisionMakers = analysis.decisionMakers?.filter((dm: any) => dm.influence === 'high').length || 0;

  if (buyingSignals >= 3 && objections <= 1 && decisionMakers >= 1) {
    return 'ready';
  }

  if (buyingSignals >= 2 && decisionMakers >= 1) {
    return 'evaluating';
  }

  if (buyingSignals >= 1 || analysis.businessObjectives?.shortTerm?.length > 0) {
    return 'exploring';
  }

  return 'not-ready';
}

function generateRecommendations(analysis: any, closeabilityScore: number, urgencyLevel: string): string[] {
  const recommendations: string[] = [];

  if (closeabilityScore >= 80) {
    recommendations.push('🎯 HIGH PRIORITY: Schedule audit call within 2-3 business days');
    recommendations.push('📋 Prepare detailed audit deck with specific findings and ROI projections');
  } else if (closeabilityScore >= 60) {
    recommendations.push('⚡ MEDIUM PRIORITY: Address identified objections in follow-up email');
    recommendations.push('📞 Schedule audit call within one week with additional discovery');
  } else {
    recommendations.push('🔍 DISCOVERY NEEDED: Schedule additional discovery call to understand concerns');
    recommendations.push('📚 Send educational content to build trust and credibility');
  }

  if (urgencyLevel === 'high') {
    recommendations.push('🚨 URGENT: Emphasize immediate financial risks in all communications');
  }

  if (analysis.competitiveContext?.alternatives?.length > 0) {
    recommendations.push('🏆 Prepare competitive differentiation materials');
  }

  if (analysis.decisionMakers?.length > 1) {
    recommendations.push('👥 Plan multi-stakeholder presentation strategy');
  }

  return recommendations;
}

function generateNextSteps(analysis: any, closeabilityScore: number): string[] {
  const nextSteps: string[] = [];

  if (closeabilityScore >= 70) {
    nextSteps.push('Send audit call calendar link with 3-5 time options');
    nextSteps.push('Begin preparing customized audit deck with their data');
    nextSteps.push('Research their industry benchmarks and competitors');
  } else {
    nextSteps.push('Send follow-up email addressing key concerns raised');
    nextSteps.push('Provide relevant case studies or testimonials');
    nextSteps.push('Schedule brief follow-up call to answer questions');
  }

  if (analysis.urgencySignals?.timeline) {
    nextSteps.push(`Follow up according to their timeline: ${analysis.urgencySignals.timeline}`);
  }

  nextSteps.push('Update CRM with analysis findings and recommended approach');

  return nextSteps;
}

// GET endpoint to retrieve transcript analyses
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const prospectId = searchParams.get('prospectId');

  if (!prospectId) {
    return NextResponse.json(
      { error: 'prospectId is required' }, 
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from('transcript_analyses')
      .select('*')
      .eq('prospect_id', prospectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to retrieve transcript analyses' }, 
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      prospectId,
      analyses: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Get transcript analyses error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve analyses' }, 
      { status: 500 }
    );
  }
}
