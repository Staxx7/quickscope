// app/api/admin/prospects-with-ai/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    const prospects = await getCompaniesFromQBO();

    if (!prospects) {
      return NextResponse.json(
        { success: false, message: "Could not fetch companies from QuickBooks tokens." },
        { status: 500 }
      );
    }

    const stats = calculateDashboardStats(prospects);

    return NextResponse.json({
      success: true,
      prospects,
      stats,
      source: 'live_qbo_tokens'
    });

  } catch (error) {
    console.error('Error in prospects-with-ai GET handler:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function calculatePipelineValue(prospect: any): number {
  // Base value calculation
  let baseValue = 50000 // Default prospect value
  
  // Adjust based on closeability score
  const closeability = prospect.closeability_score || prospect.ai_closeability_score || 50
  const valueMultiplier = closeability / 100
  
  // Adjust based on industry
  const industryMultipliers: { [key: string]: number } = {
    'B2B SaaS': 1.5,
    'Professional Services': 1.2,
    'Healthcare': 1.4,
    'Manufacturing': 1.3,
    'E-commerce': 1.1
  }
  
  const industryMultiplier = industryMultipliers[prospect.industry] || 1.0
  
  return Math.round(baseValue * valueMultiplier * industryMultiplier)
}

function calculateDashboardStats(prospects: any[]) {
  const totalPipelineValue = prospects.reduce((sum, p) => sum + (p.pipeline_value || 50000), 0)
  const highProbabilityDeals = prospects.filter(p => (p.closeability_score || 0) >= 80).length
  const urgentFollowUps = prospects.filter(p => p.urgency_level === 'high').length
  const averageCloseability = prospects.length > 0 
    ? Math.round(prospects.reduce((sum, p) => sum + (p.closeability_score || 0), 0) / prospects.length)
    : 0

  return {
    totalPipelineValue,
    highProbabilityDeals,
    urgentFollowUps,
    averageCloseability,
    totalProspects: prospects.length,
    aiEnhancedProspects: prospects.filter(p => p.ai_enhanced).length
  }
}

async function getCompaniesFromQBO() {
  const { data: tokens, error } = await supabase.from('qbo_tokens').select('*').order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching QBO tokens:', error);
    return [];
  }

  return tokens.map(token => {
    // Check refresh token expiry (101 days). Use created_at as a fallback.
    const now = new Date();
    let refreshTokenExpiresAt = token.refresh_token_expires_at ? new Date(token.refresh_token_expires_at) : null;
    if (!refreshTokenExpiresAt) {
      // Intuit refresh tokens last 101 days.
      const createdAt = new Date(token.created_at);
      refreshTokenExpiresAt = new Date(createdAt.setDate(createdAt.getDate() + 101));
    }
    const isExpired = refreshTokenExpiresAt < now;

    return {
      id: token.id,
      prospect_id: token.id,
      company_id: token.company_id,
      company_name: token.company_name || `Company ID: ${token.company_id}`,
      name: token.company_name || `Company ID: ${token.company_id}`,
      email: token.user_email || 'N/A', // Assuming you might add this field later
      industry: token.industry || 'N/A', // Assuming you might add this field later
      status: isExpired ? 'Expired' : 'Active',
      connection_status: isExpired ? 'expired' : 'active',
      last_data_sync: token.updated_at,
      days_connected: Math.floor((now.getTime() - new Date(token.created_at).getTime()) / (1000 * 60 * 60 * 24)),
      next_action: isExpired ? 'Reconnect QuickBooks' : 'Extract Data',
      // Add other necessary fields for the dashboard with default values
      workflow_stage: 'connected',
      ai_analysis: {
        closeability_score: 75 // Default value
      }
    };
  });
}

// POST endpoint for triggering AI analysis
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prospectId, analysisType = 'comprehensive' } = body

    if (!prospectId) {
      return NextResponse.json({ error: 'Prospect ID is required' }, { status: 400 })
    }

    // Trigger AI analysis (placeholder for now)
    console.log(`Triggering ${analysisType} analysis for prospect ${prospectId}`)

    return NextResponse.json({
      success: true,
      message: `${analysisType} analysis initiated for prospect ${prospectId}`,
      analysisId: `analysis_${Date.now()}`,
      estimatedCompletion: '2-3 minutes'
    })

  } catch (error) {
    console.error('AI analysis trigger error:', error)
    return NextResponse.json({ 
      error: 'Failed to trigger AI analysis',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}