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
    const newProspectData: any = {
      email,
      workflow_stage: 'needs_transcript',
      user_type: 'prospect',
      created_at: new Date().toISOString()
    }
    
    // Try different field combinations based on what the database expects
    const fieldVariations = [
      // Variation 1: Use field names from our schema
      { ...newProspectData, company_name, contact_name },
      // Variation 2: Use 'name' field (error message suggested this)
      { ...newProspectData, name: company_name },
      // Variation 3: Just email and minimal fields
      { ...newProspectData }
    ]

    // Add optional fields to first variation
    const optionalFields: any = {}
    if (phone) optionalFields.phone = phone
    if (industry) optionalFields.industry = industry
    if (company_id) optionalFields.qb_company_id = company_id
    
    fieldVariations[0] = { ...fieldVariations[0], ...optionalFields }

    // Try each variation until one works
    let insertResult: any = null
    let successfulVariation = -1
    
    for (let i = 0; i < fieldVariations.length; i++) {
      console.log(`Trying variation ${i + 1}:`, Object.keys(fieldVariations[i]))
      
      const result = await supabase
        .from('prospects')
        .insert(fieldVariations[i])
        .select()
        .single()
      
      if (!result.error) {
        insertResult = result
        successfulVariation = i
        console.log(`Variation ${i + 1} succeeded!`)
        break
      } else {
        console.log(`Variation ${i + 1} failed:`, result.error.message)
      }
    }
    
    if (!insertResult || insertResult.error) {
      console.error('All insert variations failed')
      return NextResponse.json({
        error: 'Failed to create prospect',
        details: insertResult?.error?.message || 'All field variations failed',
        hint: 'Database schema incompatible - manual intervention required'
      }, { status: 500 })
    }

    let prospectData = insertResult.data
    
    // If we used a minimal variation, try to update with missing fields
    if (successfulVariation > 0 && prospectData) {
      console.log('Updating with additional fields after minimal insert...')
      
      const updateData: any = {}
      
      // Add fields that might have been missing
      if (successfulVariation === 1) {
        // Used 'name' field, might need to add contact_name
        if (contact_name) updateData.contact_name = contact_name
      }
      if (successfulVariation === 2) {
        // Used minimal fields, add everything else
        updateData.company_name = company_name
        if (contact_name) updateData.contact_name = contact_name
      }
      
      // Always try to add optional fields if not in minimal insert
      if (phone && !prospectData.phone) updateData.phone = phone
      if (industry && !prospectData.industry) updateData.industry = industry
      if (company_id && !prospectData.qb_company_id) updateData.qb_company_id = company_id
      
      if (Object.keys(updateData).length > 0) {
        const { data: updatedData, error: updateError } = await supabase
          .from('prospects')
          .update(updateData)
          .eq('id', prospectData.id)
          .select()
          .single()
        
        if (!updateError && updatedData) {
          prospectData = updatedData
          console.log('Successfully updated with additional fields')
        } else {
          console.log('Could not update additional fields:', updateError?.message)
        }
      }
    }
    
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