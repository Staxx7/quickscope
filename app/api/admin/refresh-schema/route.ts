import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    
    // Run a simple query to each table to ensure schema is loaded
    const tables = ['prospects', 'qbo_tokens', 'ai_analyses', 'call_transcripts', 'financial_snapshots']
    const results: Record<string, any> = {}
    
    for (const table of tables) {
      try {
        // Select just the structure, not the data
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(0)
        
        if (error) {
          results[table] = { status: 'error', message: error.message }
        } else {
          // Get column information if possible
          const { data: sampleRow } = await supabase
            .from(table)
            .select('*')
            .limit(1)
            .maybeSingle()
          
          results[table] = {
            status: 'success',
            columns: sampleRow ? Object.keys(sampleRow) : 'No data available'
          }
        }
      } catch (e) {
        results[table] = {
          status: 'error',
          message: e instanceof Error ? e.message : 'Unknown error'
        }
      }
    }
    
    // Special check for prospects table columns
    const { data: prospectSample } = await supabase
      .from('prospects')
      .select('*')
      .limit(1)
      .maybeSingle()
    
    return NextResponse.json({
      success: true,
      message: 'Schema refresh attempted',
      timestamp: new Date().toISOString(),
      tables: results,
      prospects_columns: prospectSample ? Object.keys(prospectSample) : 'No prospects found',
      note: 'If columns are missing, you may need to refresh the Supabase dashboard schema or check RLS policies'
    })
    
  } catch (error) {
    console.error('Schema refresh error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}