import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('=== API: Create/Update Prospect ===')
    console.log('Request body:', body)

    const {
      company_id,
      company_name,
      contact_name,
      email,
      phone,
      industry,
      annual_revenue,
      employee_count
    } = body

    // Validate required fields
    if (!company_id || !company_name || !contact_name || !email) {
      return NextResponse.json({
        error: 'Missing required fields',
        details: 'company_id, company_name, contact_name, and email are required'
      }, { status: 400 })
    }

    // Use service role client to bypass RLS
    const supabase = getSupabaseServerClient()

    // Check if prospect already exists
    console.log('Checking for existing prospect with email:', email)
    const { data: existingProspect, error: checkError } = await supabase
      .from('prospects')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    if (checkError) {
      console.error('Error checking existing prospect:', checkError)
      throw checkError
    }

    let prospectId
    let prospectData

    if (existingProspect) {
      console.log('Updating existing prospect:', existingProspect.id)
      
      // Update existing prospect
      const { data: updatedProspect, error: updateError } = await supabase
        .from('prospects')
        .update({
          company_name,
          contact_name,
          phone: phone || null,
          industry: industry || null,
          annual_revenue: annual_revenue ? parseFloat(annual_revenue) : null,
          employee_count: employee_count ? parseInt(employee_count) : null,
          qb_company_id: company_id,
          workflow_stage: 'needs_transcript',
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProspect.id)
        .select()
        .single()

      if (updateError) {
        console.error('Update error:', updateError)
        throw updateError
      }

      prospectId = existingProspect.id
      prospectData = updatedProspect
    } else {
      console.log('Creating new prospect')
      
      // Create new prospect
      const { data: newProspect, error: insertError } = await supabase
        .from('prospects')
        .insert({
          company_name,
          contact_name,
          email,
          phone: phone || null,
          industry: industry || null,
          annual_revenue: annual_revenue ? parseFloat(annual_revenue) : null,
          employee_count: employee_count ? parseInt(employee_count) : null,
          workflow_stage: 'needs_transcript',
          user_type: 'prospect',
          qb_company_id: company_id
        })
        .select()
        .single()

      if (insertError) {
        console.error('Insert error:', insertError)
        throw insertError
      }

      prospectId = newProspect.id
      prospectData = newProspect
    }

    // Update the qbo_token to link to this prospect
    if (prospectId && company_id) {
      console.log('Linking prospect to QB token')
      
      const { data: tokenData, error: tokenError } = await supabase
        .from('qbo_tokens')
        .select('*')
        .eq('company_id', company_id)
        .maybeSingle()

      if (tokenData && !tokenError) {
        await supabase
          .from('qbo_tokens')
          .update({ 
            prospect_id: prospectId,
            updated_at: new Date().toISOString()
          })
          .eq('id', tokenData.id)
      }
    }

    console.log('Successfully created/updated prospect:', prospectId)

    return NextResponse.json({
      success: true,
      prospect_id: prospectId,
      prospect: prospectData,
      message: existingProspect ? 'Prospect updated successfully' : 'Prospect created successfully'
    })

  } catch (error) {
    console.error('API Error:', error)
    
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase()
      
      if (errorMessage.includes('duplicate') || errorMessage.includes('unique')) {
        return NextResponse.json({
          error: 'Duplicate email',
          details: 'A contact with this email already exists'
        }, { status: 409 })
      }
      
      if (errorMessage.includes('foreign key')) {
        return NextResponse.json({
          error: 'Invalid reference',
          details: 'Invalid company reference'
        }, { status: 400 })
      }
    }

    return NextResponse.json({
      error: 'Failed to create/update prospect',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}