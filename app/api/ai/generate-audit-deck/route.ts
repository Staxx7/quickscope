// Create new file: app/api/ai/generate-audit-deck/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

interface AuditDeckData {
  prospect_info: {
    company_name: string;
    industry: string;
    revenue: number;
    employee_count?: number;
  };
  financial_analysis: {
    overall_score: number;
    component_scores: any;
    red_flags: string[];
    strengths: string[];
    recommendations: string[];
  };
  transcript_insights?: {
    segments?: any;
    sentiment_analysis?: any;
    sales_intelligence?: any;
    call_outcome_prediction?: any;
  };
  custom_recommendations: string[];
  pricing_proposal: {
    monthly_retainer: number;
    cleanup_cost: number;
    implementation_timeline: string;
  };
}

const generateExecutiveSummary = (deckData: AuditDeckData) => {
  const roi = Math.round((deckData.pricing_proposal.monthly_retainer * 12 / deckData.prospect_info.revenue) * 100 * 10);
  
  return {
    title: `${deckData.prospect_info.company_name} Financial Analysis & Recommendations`,
    summary: `
Financial Health Score: ${deckData.financial_analysis.overall_score}/100

Key Findings:
${deckData.financial_analysis.red_flags.length > 0 ? 
  `• ${deckData.financial_analysis.red_flags.length} critical issues identified requiring immediate attention` : 
  '• No critical financial issues identified'}
${deckData.financial_analysis.strengths.length > 0 ? 
  `• ${deckData.financial_analysis.strengths.length} competitive advantages to leverage` : ''}
- Estimated ROI: ${roi}% improvement in financial efficiency in first year

Recommended Investment: $${deckData.pricing_proposal.monthly_retainer.toLocaleString()}/month
Implementation Timeline: ${deckData.pricing_proposal.implementation_timeline}
    `.trim()
  };
};

const generateFinancialSection = (financialAnalysis: AuditDeckData['financial_analysis']) => {
  return {
    title: 'Financial Health Analysis',
    overall_score: financialAnalysis.overall_score,
    components: financialAnalysis.component_scores,
    red_flags: financialAnalysis.red_flags,
    strengths: financialAnalysis.strengths,
    key_metrics: [
      { label: 'Profitability Score', value: financialAnalysis.component_scores?.profitability || 0 },
      { label: 'Liquidity Score', value: financialAnalysis.component_scores?.liquidity || 0 },
      { label: 'Solvency Score', value: financialAnalysis.component_scores?.solvency || 0 }
    ]
  };
};

const generateRecommendationsSection = (recommendations: string[], redFlags: string[]) => {
  const prioritized = [
    ...redFlags.map(flag => ({ priority: 'High', recommendation: `Address: ${flag}`, timeline: 'Immediate' })),
    ...recommendations.map(rec => ({ priority: 'Medium', recommendation: rec, timeline: '30-60 days' }))
  ];

  return {
    title: 'Strategic Recommendations',
    recommendations: prioritized.slice(0, 6), // Limit to top 6
    implementation_order: prioritized.map(r => r.recommendation)
  };
};

const generateROISection = (deckData: AuditDeckData) => {
  const monthlyRetainer = deckData.pricing_proposal.monthly_retainer;
  const annualCost = monthlyRetainer * 12;
  const revenue = deckData.prospect_info.revenue;
  
  return {
    title: 'Return on Investment Projections',
    annual_investment: annualCost,
    projected_savings: {
      year_1: Math.round(revenue * 0.025), // 2.5% efficiency improvement
      year_2: Math.round(revenue * 0.04),  // 4% efficiency improvement
      year_3: Math.round(revenue * 0.06)   // 6% efficiency improvement
    },
    payback_period: '4-6 months',
    roi_percentage: Math.round((revenue * 0.025 - annualCost) / annualCost * 100)
  };
};

const generateProposalSection = (pricingProposal: AuditDeckData['pricing_proposal']) => {
  return {
    title: 'Service Proposal & Investment',
    monthly_retainer: pricingProposal.monthly_retainer,
    cleanup_cost: pricingProposal.cleanup_cost,
    implementation_timeline: pricingProposal.implementation_timeline,
    services_included: [
      'Monthly bookkeeping and reconciliation',
      'Financial statements and reporting',
      'Cash flow forecasting',
      'Strategic CFO advisory',
      'Tax planning and preparation',
      'Monthly business review calls'
    ],
    next_steps: [
      'Execute engagement letter',
      'Begin financial cleanup process',
      'Implement monthly reporting cadence',
      'Schedule first strategic review'
    ]
  };
};

export async function POST(request: NextRequest) {
  try {
    const { prospect_id } = await request.json();

    if (!prospect_id) {
      return NextResponse.json({ error: 'prospect_id is required' }, { status: 400 });
    }

    // Get prospect info
    const { data: prospect, error: prospectError } = await supabase
      .from('prospects')
      .select('*')
      .eq('id', prospect_id)
      .single();

    if (prospectError) {
      return NextResponse.json({ error: 'Prospect not found' }, { status: 404 });
    }

    // Get financial analysis
    const { data: financialIntelligence } = await supabase
      .from('financial_intelligence')
      .select('*')
      .eq('prospect_id', prospect_id)
      .order('created_at', { ascending: false })
      .limit(1);

    // Get latest financial snapshot
    const { data: financialSnapshot } = await supabase
      .from('financial_snapshots')
      .select('*')
      .eq('company_id', prospect.company_id)
      .order('created_at', { ascending: false })
      .limit(1);

    // Get transcript analysis
    const { data: transcriptAnalysis } = await supabase
      .from('transcript_analyses')
      .select('*')
      .eq('prospect_id', prospect_id)
      .order('created_at', { ascending: false })
      .limit(1);

    // Prepare audit deck data
    const revenue = financialSnapshot?.[0]?.revenue || 500000; // Default estimate
    const deckData: AuditDeckData = {
      prospect_info: {
        company_name: prospect.company_name,
        industry: prospect.industry || 'Business Services',
        revenue: revenue
      },
      financial_analysis: financialIntelligence?.[0] || {
        overall_score: 65,
        component_scores: { profitability: 60, liquidity: 70, solvency: 65 },
        red_flags: ['Irregular cash flow patterns', 'Missing financial controls'],
        strengths: ['Strong revenue growth', 'Solid client retention'],
        recommendations: ['Implement monthly close process', 'Establish cash flow forecasting']
      },
      transcript_insights: transcriptAnalysis?.[0]?.analysis_data || null,
      custom_recommendations: [
        'Implement quarterly business reviews',
        'Establish KPI dashboard',
        'Create annual budget and forecasting process'
      ],
      pricing_proposal: {
        monthly_retainer: Math.max(3000, Math.min(8000, Math.round(revenue * 0.015 / 12))),
        cleanup_cost: Math.max(2000, Math.min(6000, Math.round(revenue * 0.01))),
        implementation_timeline: '30-45 days'
      }
    };

    // Generate all sections
    const auditDeck = {
      id: `audit_deck_${prospect_id}_${Date.now()}`,
      prospect_id,
      created_at: new Date().toISOString(),
      sections: {
        executive_summary: generateExecutiveSummary(deckData),
        financial_analysis: generateFinancialSection(deckData.financial_analysis),
        recommendations: generateRecommendationsSection(deckData.custom_recommendations, deckData.financial_analysis.red_flags),
        roi_projections: generateROISection(deckData),
        service_proposal: generateProposalSection(deckData.pricing_proposal)
      },
      metadata: {
        generated_at: new Date().toISOString(),
        data_sources: {
          financial_data: !!financialSnapshot?.[0],
          transcript_data: !!transcriptAnalysis?.[0],
          ai_analysis: !!financialIntelligence?.[0]
        }
      }
    };

    // Store generated deck
    const { data: savedDeck, error: saveError } = await supabase
      .from('audit_decks')
      .insert({
        prospect_id,
        deck_data: auditDeck,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving audit deck:', saveError);
    }

    return NextResponse.json({
      success: true,
      audit_deck: auditDeck,
      saved_deck_id: savedDeck?.id
    });

  } catch (error) {
    console.error('Error generating audit deck:', error);
    return NextResponse.json(
      { error: 'Failed to generate audit deck' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const prospect_id = searchParams.get('prospect_id');

    if (!prospect_id) {
      return NextResponse.json({ error: 'prospect_id is required' }, { status: 400 });
    }

    // Get latest audit deck for prospect
    const { data: auditDeck, error } = await supabase
      .from('audit_decks')
      .select('*')
      .eq('prospect_id', prospect_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      return NextResponse.json({ error: 'No audit deck found' }, { status: 404 });
    }

    return NextResponse.json({ audit_deck: auditDeck });

  } catch (error) {
    console.error('Error fetching audit deck:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit deck' },
      { status: 500 }
    );
  }
}
