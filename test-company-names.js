// Test script to check company names in QuickBooks connections
// Run with: node test-company-names.js

const testCompanyNames = async () => {
  console.log('=== Testing Company Names in QuickBooks Connections ===\n');

  // Test 1: Check connected companies
  console.log('1. Fetching connected companies...');
  try {
    const response = await fetch('https://www.quickscope.info/api/admin/connected-companies');
    const data = await response.json();
    
    if (data.success && data.companies) {
      console.log(`   ✓ Found ${data.companies.length} connected companies\n`);
      
      console.log('   Company Names Status:');
      data.companies.forEach((company, index) => {
        const hasProperName = company.company_name && !company.company_name.startsWith('Company ');
        const status = hasProperName ? '✓' : '✗';
        console.log(`   ${status} ${company.company_name} (ID: ${company.company_id})`);
      });
      
      // Count companies with/without proper names
      const withNames = data.companies.filter(c => 
        c.company_name && !c.company_name.startsWith('Company ')
      ).length;
      const withoutNames = data.companies.length - withNames;
      
      console.log(`\n   Summary:`);
      console.log(`   - With proper names: ${withNames}`);
      console.log(`   - Without proper names: ${withoutNames}`);
      
      if (withoutNames > 0) {
        console.log(`\n   ⚠️  ${withoutNames} companies need name refresh`);
      }
    } else {
      console.error('   ✗ Failed to fetch companies:', data.error);
    }
  } catch (error) {
    console.error('   ✗ Error:', error.message);
  }

  // Test 2: Check if refresh endpoint exists
  console.log('\n2. Testing refresh company names endpoint...');
  try {
    const response = await fetch('https://www.quickscope.info/api/admin/refresh-company-names', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✓ Refresh endpoint is available');
      console.log(`   Results: ${JSON.stringify(data.summary || {}, null, 2)}`);
    } else {
      console.log(`   ⚠️  Refresh endpoint returned status: ${response.status}`);
    }
  } catch (error) {
    console.error('   ✗ Error testing refresh endpoint:', error.message);
  }

  console.log('\n=== Test Complete ===');
  console.log('\nTo refresh company names:');
  console.log('1. Click "Refresh Company Names" button in the dashboard');
  console.log('2. Or call POST /api/admin/refresh-company-names');
};

// Run the test
testCompanyNames();