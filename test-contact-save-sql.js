// Test for SQL-based contact save endpoint
// Run with: node test-contact-save-sql.js

const testSQLContactSave = async () => {
  const testData = {
    company_id: 'test-company-123',
    company_name: 'Test Company Inc',
    contact_name: 'John Test',
    email: 'john@testcompany' + Date.now() + '.com', // Unique email
    phone: '(555) 123-4567',
    industry: 'Technology'
  };

  console.log('Testing SQL-based contact save endpoint...');
  console.log('Test data:', testData);

  try {
    const response = await fetch('https://www.quickscope.info/api/prospects/create-or-update-sql', {
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
      console.log('Email:', result.prospect?.email);
      console.log('Workflow Stage:', result.prospect?.workflow_stage);
      console.log('Note:', result.note);
    } else {
      console.log('\n❌ Contact save failed!');
      console.log('Error:', result.error);
      console.log('Details:', result.details);
    }
  } catch (error) {
    console.error('\n❌ Request failed:', error.message);
  }
};

// Run test
testSQLContactSave();