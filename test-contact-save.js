// Manual test script for contact save functionality
// Run with: node test-contact-save.js

const testContactSave = async () => {
  const testData = {
    company_id: 'test-company-123',
    company_name: 'Test Company Inc',
    contact_name: 'John Test',
    email: 'john@testcompany.com',
    phone: '(555) 123-4567',
    industry: 'Technology',
    annual_revenue: '5000000',
    employee_count: '50'
  };

  console.log('Testing contact save endpoint...');
  console.log('Test data:', testData);

  try {
    const response = await fetch('https://www.quickscope.info/api/prospects/create-or-update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    console.log('\nResponse status:', response.status);
    console.log('Response data:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('\n✅ Contact save successful!');
      console.log('Prospect ID:', result.prospect?.id);
    } else {
      console.log('\n❌ Contact save failed!');
      console.log('Error:', result.error);
      console.log('Details:', result.details);
    }
  } catch (error) {
    console.error('\n❌ Request failed:', error.message);
  }
};

// Test the diagnostic endpoint first
const testDiagnostics = async () => {
  console.log('\n=== Testing diagnostics endpoint ===');
  
  try {
    const response = await fetch('https://www.quickscope.info/api/test-contact-save');
    const result = await response.json();
    
    console.log('Diagnostics:', JSON.stringify(result, null, 2));
    
    if (result.recommendations && result.recommendations.length > 0) {
      console.log('\n⚠️  Recommendations:');
      result.recommendations.forEach(rec => console.log('- ' + rec));
    }
  } catch (error) {
    console.error('Diagnostics failed:', error.message);
  }
};

// Run tests
(async () => {
  await testDiagnostics();
  console.log('\n' + '='.repeat(50) + '\n');
  await testContactSave();
})();