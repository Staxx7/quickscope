// app/api/companies/route.ts - SIMPLE TEST VERSION
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Companies API called - returning mock data');
  
  return NextResponse.json({ 
    companies: [
      {
        id: 'test123',
        company_name: 'Test Company 1',
        realm_id: 'test123',
        connected_at: new Date().toISOString(),
        status: 'active'
      },
      {
        id: 'test456',
        company_name: 'Test Company 2', 
        realm_id: 'test456',
        connected_at: new Date().toISOString(),
        status: 'active'
      }
    ],
    total: 2,
    message: 'Mock data - API routing is working!'
  });
}
