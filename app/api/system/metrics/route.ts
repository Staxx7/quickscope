import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    // Fetch connected companies count
    const { count: companiesCount } = await supabase
      .from('qbo_tokens')
      .select('*', { count: 'exact', head: true })

    // Fetch total prospects
    const { count: prospectsCount } = await supabase
      .from('prospects')
      .select('*', { count: 'exact', head: true })

    // Fetch reports generated (audit decks)
    const { count: reportsCount } = await supabase
      .from('audit_decks')
      .select('*', { count: 'exact', head: true })

    // Fetch AI analyses count
    const { count: aiAnalysesCount } = await supabase
      .from('ai_analyses')
      .select('*', { count: 'exact', head: true })

    // Fetch call transcripts count
    const { count: transcriptsCount } = await supabase
      .from('call_transcripts')
      .select('*', { count: 'exact', head: true })

    // Get last sync time (most recent update from any table)
    const tables = ['qbo_tokens', 'financial_snapshots', 'ai_analyses', 'call_transcripts']
    let lastSync = new Date(0)
    
    for (const table of tables) {
      const { data } = await supabase
        .from(table)
        .select('updated_at')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()
      
      if (data?.updated_at) {
        const updateTime = new Date(data.updated_at)
        if (updateTime > lastSync) {
          lastSync = updateTime
        }
      }
    }

    // Calculate system health based on various factors
    let systemHealth = 100
    
    // Check database connectivity
    const dbCheck = await supabase.from('prospects').select('id').limit(1)
    const databaseStatus = dbCheck.error ? 'down' : 'operational'
    if (dbCheck.error) systemHealth -= 30

    // Check if we have recent activity (within last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    if (lastSync < oneHourAgo) {
      systemHealth -= 10
    }

    // Estimate data processed (simplified calculation)
    const dataProcessed = `${Math.round((companiesCount || 0) * 2.5 + (transcriptsCount || 0) * 0.5)} MB`

    // Active connections (companies with valid tokens)
    const { count: activeConnections } = await supabase
      .from('qbo_tokens')
      .select('*', { count: 'exact', head: true })
      .gt('expires_at', new Date().toISOString())

    // API status (simplified - in production, you'd check actual API endpoints)
    const apiStatus = 'operational'
    
    // AI service status (check if we have recent AI analyses)
    const { data: recentAI } = await supabase
      .from('ai_analyses')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    const aiServiceStatus = recentAI ? 'operational' : 'degraded'

    return NextResponse.json({
      connectedCompanies: companiesCount || 0,
      totalProspects: prospectsCount || 0,
      reportsGenerated: reportsCount || 0,
      aiAnalyses: aiAnalysesCount || 0,
      callTranscripts: transcriptsCount || 0,
      lastSync: lastSync.toISOString(),
      systemHealth,
      activeConnections: activeConnections || 0,
      dataProcessed,
      apiStatus,
      databaseStatus,
      aiServiceStatus
    })

  } catch (error) {
    console.error('Error fetching system metrics:', error)
    
    // Return default metrics on error
    return NextResponse.json({
      connectedCompanies: 0,
      totalProspects: 0,
      reportsGenerated: 0,
      aiAnalyses: 0,
      callTranscripts: 0,
      lastSync: new Date().toISOString(),
      systemHealth: 0,
      activeConnections: 0,
      dataProcessed: '0 MB',
      apiStatus: 'down',
      databaseStatus: 'down',
      aiServiceStatus: 'down'
    })
  }
}