import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const { transcript, companyId } = await request.json();

  try {
    const analysis = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a financial analyst reviewing a discovery call transcript. Extract:
          1. Key business pain points
          2. Current financial challenges
          3. Growth objectives
          4. Decision maker information
          5. Timeline and urgency
          6. Budget considerations
          7. Specific accounting/CFO needs
          
          Return structured JSON with these categories.`
        },
        {
          role: "user",
          content: transcript
        }
      ],
      response_format: { type: "json_object" }
    });

    const extractedData = JSON.parse(analysis.choices[0].message.content || '{}');

    // Store analysis in database
    await storeTranscriptAnalysis(companyId, extractedData);

    return NextResponse.json(extractedData);
  } catch (error) {
    console.error('Transcript analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze transcript' }, { status: 500 });
  }
}

async function storeTranscriptAnalysis(companyId: string, analysisData: any) {
  const { data, error } = await supabase
    .from('transcript_analysis')
    .insert({
      company_id: companyId,
      analysis_data: analysisData,
      created_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error storing transcript analysis:', error);
    throw new Error('Failed to store analysis');
  }

  return data;
}
