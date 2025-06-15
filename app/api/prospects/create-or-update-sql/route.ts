import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  console.log('=== SQL API Route Hit: /api/prospects/create-or-update-sql ===')
  
  try {
    const body = await request.json()
    console.log('Request body:', JSON.stringify(body, null, 2))

    const {
      company_id,
      company_name,
      contact_name,
      email,
      phone,
      industry
    } = body

    // Validate required fields
    if (!company_id || !company_name || !contact_name || !email) {
      return NextResponse.json({
        error: 'Missing required fields',
        details: 'company_id, company_name, contact_name, and email are required'
      }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    
    // First, check if prospect exists using raw SQL
    const { data: existingCheck, error: checkError } = await supabase.rpc('execute_sql', {
      query: `SELECT id FROM prospects WHERE email = $1`,
      params: [email]
    }).single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows
      console.error('Error checking existing prospect:', checkError)
      
      // If RPC doesn't exist, try direct query
      const { data: directCheck, error: directError } = await supabase
        .from('prospects')
        .select('id')
        .eq('email', email)
        .maybeSingle()
      
      if (directError) {
        return NextResponse.json({
          error: 'Database query failed',
          details: directError.message
        }, { status: 500 })
      }
      
      if (directCheck) {
        // Update existing prospect
        const { data: updated, error: updateError } = await supabase
          .from('prospects')
          .update({
            company_name,
            workflow_stage: 'needs_transcript',
            updated_at: new Date().toISOString()
          })
          .eq('id', directCheck.id)
          .select()
          .single()
        
        if (updateError) {
          console.error('Update error:', updateError)
          return NextResponse.json({
            error: 'Failed to update prospect',
            details: updateError.message
          }, { status: 500 })
        }
        
        return NextResponse.json({
          success: true,
          prospect_id: directCheck.id,
          prospect: updated,
          message: 'Prospect updated successfully'
        })
      }
    }

    // Create new prospect using minimal fields
    const newProspectData = {
      company_name,
      email,
      workflow_stage: 'needs_transcript',
      user_type: 'prospect',
      created_at: new Date().toISOString()
    }

    // Add optional fields only if the insert supports them
    const optionalFields: any = {}
    if (contact_name) optionalFields.contact_name = contact_name
    if (phone) optionalFields.phone = phone
    if (industry) optionalFields.industry = industry
    if (company_id) optionalFields.qb_company_id = company_id

    // Try insert with all fields first
    let insertResult = await supabase
      .from('prospects')
      .insert({ ...newProspectData, ...optionalFields })
      .select()
      .single()

    if (insertResult.error) {
      console.log('Full insert failed, trying minimal insert...')
      
      // If that fails, try with minimal fields only
      insertResult = await supabase
        .from('prospects')
        .insert(newProspectData)
        .select()
        .single()
      
      if (insertResult.error) {
        console.error('Minimal insert also failed:', insertResult.error)
        return NextResponse.json({
          error: 'Failed to create prospect',
          details: insertResult.error.message,
          hint: 'Schema cache issue - please contact support'
        }, { status: 500 })
      }
      
      // Update with additional fields using raw SQL if available
      if (insertResult.data && (contact_name || phone || industry || company_id)) {
        console.log('Updating with additional fields...')
        
        const updateFields = []
        const updateValues = []
        let paramIndex = 2 // $1 is already the ID
        
        if (contact_name) {
          updateFields.push(`contact_name = $${paramIndex++}`)
          updateValues.push(contact_name)
        }
        if (phone) {
          updateFields.push(`phone = $${paramIndex++}`)
          updateValues.push(phone)
        }
        if (industry) {
          updateFields.push(`industry = $${paramIndex++}`)
          updateValues.push(industry)
        }
        if (company_id) {
          updateFields.push(`qb_company_id = $${paramIndex++}`)
          updateValues.push(company_id)
        }
        
        const updateQuery = `UPDATE prospects SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = $1 RETURNING *`
        
        try {
          await supabase.rpc('execute_sql', {
            query: updateQuery,
            params: [insertResult.data.id, ...updateValues]
          })
        } catch (e) {
          console.log('Raw SQL update not available, fields may be incomplete')
        }
      }
    }

    const prospectData = insertResult.data
    
    // Link to QB token if possible
    if (prospectData && company_id) {
      console.log('Attempting to link QB token...')
      
      const { error: linkError } = await supabase
        .from('qbo_tokens')
        .update({ 
          prospect_id: prospectData.id,
          updated_at: new Date().toISOString()
        })
        .eq('company_id', company_id)
      
      if (linkError) {
        console.error('Failed to link QB token:', linkError)
      } else {
        console.log('Successfully linked QB token')
      }
    }

    return NextResponse.json({
      success: true,
      prospect_id: prospectData?.id,
      prospect: prospectData,
      message: 'Prospect created successfully',
      note: 'Using fallback method due to schema cache'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}