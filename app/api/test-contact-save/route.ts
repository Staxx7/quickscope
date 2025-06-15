import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  console.log('=== Contact Save Test Endpoint ===')
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasSupabaseService: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    },
    tests: {
      clientCreation: { status: 'pending', error: null },
      databaseConnection: { status: 'pending', error: null },
      tableAccess: { status: 'pending', error: null },
      sampleQuery: { status: 'pending', data: null, error: null }
    }
  }

  try {
    // Test 1: Client creation
    console.log('Test 1: Creating Supabase client...')
    const supabase = getSupabaseServerClient()
    diagnostics.tests.clientCreation.status = 'success'
    
    // Test 2: Database connection
    console.log('Test 2: Testing database connection...')
    const { error: pingError } = await supabase
      .from('prospects')
      .select('count')
      .limit(1)
    
    if (pingError) {
      diagnostics.tests.databaseConnection.status = 'failed'
      diagnostics.tests.databaseConnection.error = {
        message: pingError.message,
        code: pingError.code,
        hint: pingError.hint
      }
    } else {
      diagnostics.tests.databaseConnection.status = 'success'
    }
    
    // Test 3: Table access
    console.log('Test 3: Checking table access...')
    const tables = ['prospects', 'qbo_tokens']
    const tableAccess = {}
    
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .select('id')
        .limit(1)
      
      tableAccess[table] = error ? `Error: ${error.message}` : 'OK'
    }
    
    diagnostics.tests.tableAccess = {
      status: Object.values(tableAccess).every(v => v === 'OK') ? 'success' : 'partial',
      tables: tableAccess
    }
    
    // Test 4: Sample query
    console.log('Test 4: Running sample query...')
    const { data: sampleData, error: sampleError } = await supabase
      .from('prospects')
      .select('id, email, workflow_stage')
      .limit(3)
    
    if (sampleError) {
      diagnostics.tests.sampleQuery.status = 'failed'
      diagnostics.tests.sampleQuery.error = sampleError.message
    } else {
      diagnostics.tests.sampleQuery.status = 'success'
      diagnostics.tests.sampleQuery.data = {
        count: sampleData?.length || 0,
        sample: sampleData?.map(p => ({ email: p.email, stage: p.workflow_stage }))
      }
    }
    
  } catch (error) {
    console.error('Diagnostic error:', error)
    diagnostics.tests.clientCreation.status = 'failed'
    diagnostics.tests.clientCreation.error = error instanceof Error ? error.message : 'Unknown error'
  }

  // Generate recommendations
  const recommendations = []
  
  if (!diagnostics.environment.hasSupabaseService) {
    recommendations.push('CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing from environment variables')
  }
  
  if (diagnostics.tests.databaseConnection.status === 'failed') {
    recommendations.push('Database connection failed - check your Supabase URL and keys')
  }
  
  if (diagnostics.tests.tableAccess.status === 'partial') {
    recommendations.push('Some tables are not accessible - check RLS policies')
  }

  console.log('Diagnostics complete:', diagnostics)

  return NextResponse.json({
    success: Object.values(diagnostics.tests).every(t => t.status === 'success'),
    diagnostics,
    recommendations,
    instructions: 'Check the browser console and Vercel logs for detailed output'
  })
}