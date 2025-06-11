// app/api/connect/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, companyName, phone, industry } = body;

    // Validate required fields
    if (!fullName || !email || !companyName) {
      return NextResponse.json(
        { error: 'Missing required fields: Full Name, Email, and Company Name' },
        { status: 400 }
      );
    }

    console.log('Form submitted:', { fullName, email, companyName, phone, industry });

    // Get QuickBooks credentials
    const clientId = process.env.QB_CLIENT_ID || process.env.QUICKBOOKS_CLIENT_ID;
    
    if (!clientId) {
      return NextResponse.json(
        { error: 'QuickBooks configuration missing' },
        { status: 500 }
      );
    }

    // Generate a random state parameter for security
    const state = randomBytes(32).toString('hex');
    
    // Set up OAuth parameters
    const scope = 'com.intuit.quickbooks.accounting';
    
    const redirectUri = process.env.NODE_ENV === 'production' 
  ? 'https://quickscope.info/api/qbo/callback'
  : 'http://localhost:3005/api/qbo/callback';

    // Use the CORRECT OAuth base URL for QuickBooks
    const baseUrl = 'https://appcenter.intuit.com/connect/oauth2';
    
    // Replace the authUrl generation section with this cleaner version:
const authUrl = new URL(baseUrl);
authUrl.searchParams.set('client_id', clientId);
authUrl.searchParams.set('scope', scope);
authUrl.searchParams.set('redirect_uri', redirectUri);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('state', state);

// Remove these problematic parameters:
// authUrl.searchParams.set('access_type', 'offline');
// authUrl.searchParams.set('approval_prompt', 'force');
// authUrl.searchParams.set('select_company', 'true');

console.log('=== DETAILED OAUTH DEBUG ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Client ID:', clientId);
console.log('Redirect URI being used:', redirectUri);
console.log('Generated OAuth URL:', authUrl.toString());
console.log('=== END DEBUG ===');

    console.log('Environment:', process.env.NODE_ENV);
    console.log('Client ID:', clientId ? 'Present' : 'Missing');
    console.log('Redirect URI:', redirectUri);
    console.log('Generated OAuth URL:', authUrl.toString());

    // Return success with the OAuth URL
    return NextResponse.json({
      success: true,
      message: 'Lead information received. Redirecting to QuickBooks...',
      authUrl: authUrl.toString(),
      leadInfo: { fullName, email, companyName, phone, industry }
    });

  } catch (error) {
    console.error('Error in connect API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
