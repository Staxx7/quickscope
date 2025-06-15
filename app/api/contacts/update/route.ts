import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, company_name, contact_name, email, phone, industry } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!company_name || !email) {
      return NextResponse.json(
        { error: 'Company name and email are required' },
        { status: 400 }
      )
    }

    // Update the prospect/contact
    const { data, error } = await supabase
      .from('prospects')
      .update({
        company_name,
        contact_name: contact_name || company_name,
        email,
        phone: phone || null,
        industry: industry || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating contact:', error)
      return NextResponse.json(
        { error: 'Failed to update contact', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      contact: data
    })

  } catch (error) {
    console.error('Contact update error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}