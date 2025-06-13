// app/api/admin/prospects-with-ai/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    console.log('Loading prospects with AI data...')

    // Try to get prospects from the prospect_intelligence view
    const { data: prospects, error: prospectsError } = await supabase
      .from('prospect_intelligence')
      .select('*')
      .limit(20)

    if (prospectsError) {
      console.warn('Prospect intelligence view failed:', prospectsError.message)
      
      // Fallback: Try basic prospects table
      const { data: basicProspects, error: basicError } = await supabase
        .from('prospects')
        .select('*')
        .limit(20)

      if (basicError) {
        console.warn('Basic prospects failed:', basicError.message)
        
        // Ultimate fallback: Return demo data
        return NextResponse.json({
          success: true,
          prospects: getDemoProspects(),
          source: 'demo_fallback',
          message: 'Using demo data due to database connectivity issues'
        })
      }

      // Return basic prospects data
      return NextResponse.json({
        success: true,
        prospects: basicProspects || [],
        source: 'basic_prospects',
        message: 'Loaded from basic prospects table'
      })
    }

    // Calculate additional stats
    const enhancedProspects = (prospects || []).map(prospect => ({
      ...prospect,
      // Ensure required fields exist
      closeability_score: prospect.closeability_score || prospect.ai_closeability_score || 50,
      urgency_level: prospect.urgency_level || prospect.ai_urgency_level || 'medium',
      workflow_stage: prospect.workflow_stage || 'connected',
      next_action: prospect.next_action || 'Review',
      // Add calculated fields
      pipeline_value: calculatePipelineValue(prospect),
      ai_enhanced: !!(prospect.ai_analysis_data || prospect.financial_health_score)
    }))

    // Calculate summary stats
    const stats = calculateDashboardStats(enhancedProspects)

    return NextResponse.json({
      success: true,
      prospects: enhancedProspects,
      stats,
      source: 'database',
      count: enhancedProspects.length,
      message: 'Successfully loaded prospects with AI intelligence'
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