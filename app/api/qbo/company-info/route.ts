import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const accessToken = searchParams.get('accessToken')
    
    if (!companyId || !accessToken) {
      return NextResponse.json({ 
        error: 'Company ID and access token required' 
      }, { status: 400 })
    }

    const baseUrl = process.env.QB_SANDBOX_BASE_URL || 'https://sandbox-quickbooks.api.intuit.com'
    
    // Fetch company information from QuickBooks API
    const response = await fetch(
      `${baseUrl}/v3/company/${companyId}/companyinfo/${companyId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`QB API Error: ${response.status}`)
    }

    const data = await response.json()
    const companyInfo = data.QueryResponse?.CompanyInfo?.[0]

    if (!companyInfo) {
      throw new Error('No company information found')
    }

    // Transform to our format
    const transformedData = {
      companyName: companyInfo.CompanyName || 'Unknown Company',
      legalName: companyInfo.LegalName || companyInfo.CompanyName,
      address: {
        line1: companyInfo.CompanyAddr?.Line1 || '',
        city: companyInfo.CompanyAddr?.City || '',
        state: companyInfo.CompanyAddr?.CountrySubDivisionCode || '',
        postalCode: companyInfo.CompanyAddr?.PostalCode || '',
        country: companyInfo.CompanyAddr?.Country || 'US'
      },
      phone: companyInfo.PrimaryPhone?.FreeFormNumber || '',
      email: companyInfo.Email?.Address || '',
      website: companyInfo.WebAddr?.URI || '',
      fiscalYearStart: companyInfo.FiscalYearStartMonth || 1,
      industry: companyInfo.NameValue?.find((nv: { Name: string; Value: string }) => nv.Name === 'QBOIndustryType')?.Value || 'Other',
      employeeCount: companyInfo.EmployeeCount || 0,
      taxId: companyInfo.EIN || '',
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(transformedData)
    
  } catch (error) {
    console.error('Error fetching company info:', error)
    return NextResponse.json(
      { error: 'Failed to fetch company information' }, 
      { status: 500 }
    )
  }
}