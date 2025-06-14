// Test script to check connected companies in the database
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnectedCompanies() {
  console.log('Testing connected companies retrieval...\n')

  try {
    // 1. Check qbo_tokens table
    console.log('1. Checking qbo_tokens table:')
    const { data: tokens, error: tokensError } = await supabase
      .from('qbo_tokens')
      .select('*')
      .order('created_at', { ascending: false })

    if (tokensError) {
      console.error('Error fetching tokens:', tokensError)
    } else {
      console.log(`Found ${tokens?.length || 0} connected companies:`)
      tokens?.forEach((token, index) => {
        console.log(`\n  Company ${index + 1}:`)
        console.log(`    - Company ID: ${token.company_id}`)
        console.log(`    - Company Name: ${token.company_name || 'Not set'}`)
        console.log(`    - Prospect ID: ${token.prospect_id || 'Not linked'}`)
        console.log(`    - Created: ${new Date(token.created_at).toLocaleString()}`)
        console.log(`    - Expires: ${new Date(token.expires_at).toLocaleString()}`)
        console.log(`    - Status: ${new Date(token.expires_at) > new Date() ? 'Active' : 'Expired'}`)
      })
    }

    // 2. Check prospects table
    console.log('\n\n2. Checking prospects table:')
    const { data: prospects, error: prospectsError } = await supabase
      .from('prospects')
      .select('*')
      .order('created_at', { ascending: false })

    if (prospectsError) {
      console.error('Error fetching prospects:', prospectsError)
    } else {
      console.log(`Found ${prospects?.length || 0} prospects`)
    }

    // 3. Check financial_snapshots
    console.log('\n\n3. Checking financial_snapshots table:')
    const { data: snapshots, error: snapshotsError } = await supabase
      .from('financial_snapshots')
      .select('company_id, snapshot_date, revenue, expenses, net_income')
      .order('snapshot_date', { ascending: false })
      .limit(5)

    if (snapshotsError) {
      console.error('Error fetching snapshots:', snapshotsError)
    } else {
      console.log(`Found ${snapshots?.length || 0} financial snapshots`)
    }

    // 4. Test the API endpoint
    console.log('\n\n4. Testing API endpoint (http://localhost:3000/api/admin/connected-companies):')
    console.log('Please run "npm run dev" and check this endpoint in your browser')

  } catch (error) {
    console.error('Test failed:', error)
  }
}

testConnectedCompanies()