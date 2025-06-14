#!/usr/bin/env ts-node

/**
 * Ledgr Platform Integration Test Suite
 * This script tests all major components and integrations
 */

import { config, validateConfig } from '../app/lib/config'
import { quickbooksService, getSupabase } from '../app/lib/serviceFactory'

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
}

// Test result tracking
let passedTests = 0
let failedTests = 0
const testResults: Array<{ name: string; status: 'pass' | 'fail'; error?: string }> = []

// Helper functions
function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function logTest(name: string, passed: boolean, error?: string) {
  const status = passed ? 'pass' : 'fail'
  const color = passed ? colors.green : colors.red
  const symbol = passed ? '✓' : '✗'
  
  log(`${symbol} ${name}`, color)
  
  if (error) {
    log(`  Error: ${error}`, colors.red)
  }
  
  if (passed) {
    passedTests++
  } else {
    failedTests++
  }
  
  testResults.push({ name, status, error })
}

async function testEnvironmentConfig() {
  log('\n📋 Testing Environment Configuration...', colors.blue)
  
  try {
    const validation = validateConfig()
    
    if (validation.isValid) {
      logTest('Environment variables configured', true)
    } else {
      logTest('Environment variables configured', false, 
        `Missing: ${validation.missingVars.join(', ')}`)
    }
    
    // Test individual configs
    logTest('Database URL exists', !!config.database.url)
    logTest('Supabase configured', !!config.database.supabase.url)
    logTest('QuickBooks configured', !!config.quickbooks.clientId)
    logTest('OpenAI configured', !!config.openai.apiKey)
    
  } catch (error) {
    logTest('Environment configuration', false, error instanceof Error ? error.message : 'Unknown error')
  }
}

async function testDatabaseConnection() {
  log('\n🗄️  Testing Database Connection...', colors.blue)
  
  try {
    const supabase = getSupabase()
    
    // Test basic query
    const { data, error } = await supabase
      .from('prospects')
      .select('count')
      .limit(1)
    
    if (error) {
      logTest('Database connection', false, error.message)
    } else {
      logTest('Database connection', true)
      
      // Test each table
      const tables = [
        'prospects',
        'qbo_tokens', 
        'ai_analyses',
        'call_transcripts',
        'financial_snapshots',
        'audit_decks',
        'sales_activities',
        'industry_benchmarks',
        'generated_reports'
      ]
      
      for (const table of tables) {
        const { error: tableError } = await supabase
          .from(table)
          .select('count')
          .limit(1)
        
        logTest(`Table '${table}' accessible`, !tableError, tableError?.message)
      }
    }
    
  } catch (error) {
    logTest('Database connection', false, error instanceof Error ? error.message : 'Unknown error')
  }
}

async function testAPIEndpoints() {
  log('\n🌐 Testing API Endpoints...', colors.blue)
  
  const baseUrl = config.app.url || 'http://localhost:3000'
  const endpoints = [
    { name: 'Companies API', path: '/api/companies', method: 'GET' },
    { name: 'Prospects API', path: '/api/admin/prospects', method: 'GET' },
    { name: 'Financial Snapshots API', path: '/api/financial-snapshots', method: 'GET' },
    { name: 'Call Transcripts API', path: '/api/call-transcripts?prospectId=test', method: 'GET' },
    { name: 'Generated Reports API', path: '/api/generated-reports', method: 'GET' },
    { name: 'Test Credentials API', path: '/api/test-credentials', method: 'GET' }
  ]
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint.path}`, {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' }
      })
      
      logTest(`${endpoint.name} (${response.status})`, response.ok, 
        !response.ok ? `HTTP ${response.status}` : undefined)
      
    } catch (error) {
      logTest(endpoint.name, false, 'Network error - is the server running?')
    }
  }
}

async function testQuickBooksIntegration() {
  log('\n💼 Testing QuickBooks Integration...', colors.blue)
  
  try {
    // Check if we have any QB tokens
    const supabase = getSupabase()
    const { data: tokens, error } = await supabase
      .from('qbo_tokens')
      .select('company_id')
      .limit(1)
    
    if (error || !tokens || tokens.length === 0) {
      logTest('QuickBooks tokens exist', false, 'No QuickBooks connections found')
      log('  ℹ️  Connect a QuickBooks account to enable full testing', colors.yellow)
      return
    }
    
    logTest('QuickBooks tokens exist', true)
    
    // Test QB service methods
    const companyId = tokens[0].company_id
    
    try {
      const companyInfo = await quickbooksService.getCompanyInfo(companyId)
      logTest('Fetch company info', companyInfo.success, companyInfo.error)
    } catch (error) {
      logTest('Fetch company info', false, error instanceof Error ? error.message : 'Unknown error')
    }
    
    try {
      const profitLoss = await quickbooksService.getProfitLoss(companyId)
      logTest('Fetch P&L report', profitLoss.success, profitLoss.error)
    } catch (error) {
      logTest('Fetch P&L report', false, error instanceof Error ? error.message : 'Unknown error')
    }
    
    try {
      const balanceSheet = await quickbooksService.getBalanceSheet(companyId)
      logTest('Fetch balance sheet', balanceSheet.success, balanceSheet.error)
    } catch (error) {
      logTest('Fetch balance sheet', false, error instanceof Error ? error.message : 'Unknown error')
    }
    
  } catch (error) {
    logTest('QuickBooks integration', false, error instanceof Error ? error.message : 'Unknown error')
  }
}

async function testAIEngine() {
  log('\n🤖 Testing AI Engine...', colors.blue)
  
  const hasOpenAI = !!config.openai.apiKey
  
  if (!hasOpenAI) {
    logTest('OpenAI API key configured', false, 'OPENAI_API_KEY not set')
    log('  ℹ️  Add OpenAI API key to enable AI features', colors.yellow)
    return
  }
  
  logTest('OpenAI API key configured', true)
  
  try {
    // Test AI analysis endpoint
    const baseUrl = config.app.url || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/analyze-prospect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prospectId: 'test-prospect',
        companyInfo: { name: 'Test Company' },
        analysisType: 'transcript-only',
        transcriptText: 'This is a test transcript for AI analysis.'
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      logTest('AI analysis endpoint', data.success)
    } else {
      logTest('AI analysis endpoint', false, `HTTP ${response.status}`)
    }
    
  } catch (error) {
    logTest('AI analysis endpoint', false, 'Network error or endpoint not available')
  }
}

async function testExternalAPIs() {
  log('\n🌍 Testing External API Integrations...', colors.blue)
  
  // Census API
  const hasCensusKey = !!config.externalApis.census.apiKey
  logTest('Census API key configured', hasCensusKey, 
    !hasCensusKey ? 'CENSUS_API_KEY not set' : undefined)
  
  // BLS API
  const hasBLSKey = !!config.externalApis.bls.apiKey
  logTest('BLS API key configured', hasBLSKey,
    !hasBLSKey ? 'BLS_API_KEY not set' : undefined)
  
  if (!hasCensusKey && !hasBLSKey) {
    log('  ℹ️  External data APIs enhance industry benchmarking', colors.yellow)
  }
}

async function generateSummaryReport() {
  log('\n📊 Test Summary', colors.blue)
  log('═══════════════════════════════════════', colors.blue)
  
  const totalTests = passedTests + failedTests
  const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : '0'
  
  log(`Total Tests: ${totalTests}`)
  log(`Passed: ${passedTests}`, colors.green)
  log(`Failed: ${failedTests}`, colors.red)
  log(`Pass Rate: ${passRate}%`)
  
  if (failedTests > 0) {
    log('\n❌ Failed Tests:', colors.red)
    testResults
      .filter(r => r.status === 'fail')
      .forEach(r => {
        log(`  - ${r.name}`, colors.red)
        if (r.error) {
          log(`    ${r.error}`, colors.yellow)
        }
      })
  }
  
  if (passedTests === totalTests) {
    log('\n✅ All tests passed! Platform is fully operational.', colors.green)
  } else if (passedTests >= totalTests * 0.8) {
    log('\n⚠️  Most tests passed. Platform is mostly operational.', colors.yellow)
  } else {
    log('\n❌ Many tests failed. Please check configuration.', colors.red)
  }
  
  // Recommendations
  log('\n💡 Recommendations:', colors.blue)
  
  if (!config.quickbooks.clientId) {
    log('  1. Set up QuickBooks OAuth credentials for financial data integration')
  }
  
  if (!config.openai.apiKey) {
    log('  2. Add OpenAI API key to enable AI-powered features')
  }
  
  if (!config.externalApis.census.apiKey) {
    log('  3. Add Census and BLS API keys for industry benchmarking')
  }
  
  if (failedTests === 0) {
    log('  ✨ Platform is ready for production use!')
  }
}

// Main test runner
async function runTests() {
  log('🚀 Ledgr Platform Integration Test Suite', colors.blue)
  log('═══════════════════════════════════════', colors.blue)
  log(`Starting at ${new Date().toLocaleString()}`)
  
  try {
    await testEnvironmentConfig()
    await testDatabaseConnection()
    await testAPIEndpoints()
    await testQuickBooksIntegration()
    await testAIEngine()
    await testExternalAPIs()
  } catch (error) {
    log('\n❌ Test suite encountered an error:', colors.red)
    log(error instanceof Error ? error.message : 'Unknown error', colors.red)
  }
  
  await generateSummaryReport()
  
  // Exit with appropriate code
  process.exit(failedTests > 0 ? 1 : 0)
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(error => {
    log('Fatal error running tests:', colors.red)
    console.error(error)
    process.exit(1)
  })
}

export { runTests }