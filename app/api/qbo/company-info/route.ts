import { NextRequest, NextResponse } from 'next/server'
// Temporarily remove supabase import until we fix the auth flow
// import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accessToken = searchParams.get('access_token')
    const realmId = searchParams.get('realm_id')

    if (!accessToken || !realmId) {
      return NextResponse.json(
        { error: 'Missing access token or realm ID' },
        { status: 400 }
      )
    }

    // Call QuickBooks API to get company information
    const qboResponse = await fetch(
      `${process.env.QB_BASE_URL}/v3/company/${realmId}/companyinfo/${realmId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      }
    )

    if (!qboResponse.ok) {
      const errorData = await qboResponse.json()
      console.error('QuickBooks API error:', errorData)
      return NextResponse.json(
        { 
          error: 'Failed to fetch company info from QuickBooks',
          details: errorData
        },
        { status: qboResponse.status }
      )
    }

    const data = await qboResponse.json()
    
    // Extract company information
    const companyInfo = data.QueryResponse?.CompanyInfo?.[0]
    
    if (!companyInfo) {
      return NextResponse.json(
        { error: 'No company information found' },
        { status: 404 }
      )
    }

    const result = {
      id: companyInfo.Id,
      name: companyInfo.CompanyName,
      address: {
        line1: companyInfo.CompanyAddr?.Line1 || '',
        city: companyInfo.CompanyAddr?.City || '',
        state: companyInfo.CompanyAddr?.CountrySubDivisionCode || '',
        postalCode: companyInfo.CompanyAddr?.PostalCode || '',
        country: companyInfo.CompanyAddr?.Country || ''
      },
      phone: companyInfo.PrimaryPhone?.FreeFormNumber || '',
      email: companyInfo.Email?.Address || '',
      website: companyInfo.WebAddr?.URI || '',
      fiscalYearStart: companyInfo.FiscalYearStartMonth || '1',
      currency: companyInfo.Currency?.value || 'USD',
      timeZone: companyInfo.QBVersion || '',
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error fetching company info:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
