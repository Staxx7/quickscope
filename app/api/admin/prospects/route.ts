import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Mock prospect data for testing
    const mockProspects = [
      {
        id: '1',
        company_name: 'Acme Corp',
        company_id: '9130357468892206',
        email: 'john@acmecorp.com',
        created_at: '2024-12-15T10:30:00Z',
        qbo_connected: true,
        access_token: 'mock_token_123',
        refresh_token: 'mock_refresh_123'
      },
      {
        id: '2',
        company_name: 'TechStart LLC',
        company_id: '8765432109876543',
        email: 'sarah@techstart.com',
        created_at: '2024-12-10T14:20:00Z',
        qbo_connected: true,
        access_token: 'mock_token_456',
        refresh_token: 'mock_refresh_456'
      },
      {
        id: '3',
        company_name: 'Growth Ventures',
        company_id: '5432167890123456',
        email: 'mike@growthventures.com',
        created_at: '2024-12-05T09:15:00Z',
        qbo_connected: false
      },
      {
        id: '4',
        company_name: 'Innovate Solutions',
        company_id: '1234567890987654',
        email: 'lisa@innovatesolutions.com',
        created_at: '2024-11-28T16:45:00Z',
        qbo_connected: true,
        access_token: 'mock_token_789',
        refresh_token: 'mock_refresh_789'
      }
    ]

    return NextResponse.json({
      success: true,
      prospects: mockProspects,
      count: mockProspects.length
    })

  } catch (error) {
    console.error('Error in prospects API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch prospects',
        prospects: []
      },
      { status: 500 }
    )
  }
}
