// app/api/admin/prospects-with-ai/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    console.log('Loading connected QuickBooks companies...')

    // Get all connected companies from qbo_tokens
    const { data: qboTokens, error: tokensError } = await supabase
      .from('qbo_tokens')
      .select(`
        *,
        prospects (
          id,
          company_name,
          contact_name,
          email,
          phone,
          industry,
          workflow_stage,
          user_type,
          created_at
        )
      `)
      .order('created_at', { ascending: false })

    if (tokensError) {
      console.error('Error fetching QB tokens:', tokensError)
      
      // Fallback: Return demo data with warning
      return NextResponse.json({
        success: true,
        prospects: getDemoProspects(),
        source: 'demo_fallback',
        message: 'Using demo data due to database error',
        error: tokensError.message
      })
    }

    // Transform the data to match the expected format
    const enhancedProspects = (qboTokens || []).map(token => {
      const prospect = token.prospects?.[0] || {}
      const isExpired = new Date(token.expires_at) < new Date()
      
      return {
        id: prospect.id || token.company_id,
        prospect_id: prospect.id || token.company_id,
        company_id: token.company_id,
        company_name: token.company_name || prospect.company_name || 'Unknown Company',
        name: token.company_name || prospect.company_name || 'Unknown Company',
        email: prospect.email || `contact@${token.company_id}.com`,
        phone: prospect.phone || '',
        industry: prospect.industry || 'Not specified',
        status: isExpired ? 'token_expired' : 'connected',
        connection_status: isExpired ? 'expired' : 'active',
        urgency_level: 'medium',
        closeability_score: 75,
        workflow_stage: prospect.workflow_stage || 'connected',
        next_action: 'Run Analysis',
        pipeline_value: 50000,
        ai_enhanced: false,
        days_connected: Math.floor((Date.now() - new Date(token.created_at).getTime()) / (1000 * 60 * 60 * 24)),
        token_expires_at: token.expires_at,
        created_at: token.created_at,
        updated_at: token.updated_at,
        ai_analysis: null,
        financial_summary: null
      }
    })

    // Calculate summary stats
    const stats = calculateDashboardStats(enhancedProspects)

    console.log(`Found ${enhancedProspects.length} connected companies`)

    return NextResponse.json({
      success: true,
      prospects: enhancedProspects,
      stats,
      source: 'database',
      count: enhancedProspects.length,
      message: 'Successfully loaded connected QuickBooks companies'
    })

  } catch (error) {
    console.error('Prospects API error:', error)
    
    // Return demo data on any error
    return NextResponse.json({
      success: true,
      prospects: getDemoProspects(),
      stats: getDemoStats(),
      source: 'error_fallback',
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Using demo data due to API error'
    })
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

function getDemoProspects() {
  return [
    {
      id: '1',
      prospect_id: '1',
      company_name: 'TechFlow Solutions',
      name: 'TechFlow Solutions',
      email: 'contact@techflowsolutions.com',
      industry: 'B2B SaaS',
      status: 'analysis_complete',
      urgency_level: 'high',
      closeability_score: 87,
      ai_closeability_score: 87,
      company_id: 'test123',
      workflow_stage: 'ready_for_audit',
      next_action: 'Generate Report',
      financial_health_score: 82,
      pipeline_value: 78000,
      ai_enhanced: true,
      revenue: 4200000,
      profit_margin: 22.0,
      current_ratio: 2.5
    },
    {
      id: '2',
      prospect_id: '2', 
      company_name: 'Growth Dynamics LLC',
      name: 'Growth Dynamics LLC',
      email: 'info@growthdynamics.com',
      industry: 'Professional Services',
      status: 'transcript_uploaded',
      urgency_level: 'medium',
      closeability_score: 72,
      ai_closeability_score: 72,
      company_id: 'test456',
      workflow_stage: 'analysis_pending',
      next_action: 'Generate Analysis',
      financial_health_score: 68,
      pipeline_value: 51600,
      ai_enhanced: true,
      revenue: 2800000,
      profit_margin: 10.0,
      current_ratio: 1.8
    }
  ]
}

function getDemoStats() {
  return {
    totalPipelineValue: 129600,
    highProbabilityDeals: 1,
    urgentFollowUps: 1,
    averageCloseability: 78,
    totalProspects: 2,
    aiEnhancedProspects: 2
  }
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