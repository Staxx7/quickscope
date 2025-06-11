// app/api/qbo/connect/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // For now, return a test URL
  return NextResponse.json({
    authUrl: "https://sandbox-quickbooks.api.intuit.com/connect/oauth2",
    message: "OAuth integration coming soon"
  });
}
