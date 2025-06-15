import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  console.log('=== API Route Hit: /api/prospects/create-or-update ===')
  
  try {
    // Log environment check
    console.log('Environment check:', {
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      environment: process.env.NODE_ENV
    })

    const body = await request.json()
    console.log('Request body:', JSON.stringify(body, null, 2))

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
      console.error('Validation failed - missing required fields:', {
        company_id: !!company_id,
        company_name: !!company_name,
        contact_name: !!contact_name,
        email: !!email
      })
      
      return NextResponse.json({
        error: 'Missing required fields',
        details: 'company_id, company_name, contact_name, and email are required',
        received: {
          company_id: company_id || 'missing',
          company_name: company_name || 'missing',
          contact_name: contact_name || 'missing',
          email: email || 'missing'
        }
      }, { status: 400 })
    }

    // Test Supabase connection
    console.log('Creating Supabase client...')
    const supabase = getSupabaseServerClient()
    
    // Test the connection with a simple query
    console.log('Testing Supabase connection...')
    const { error: testError } = await supabase
      .from('prospects')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('Supabase connection test failed:', testError)
      return NextResponse.json({
        error: 'Database connection failed',
        details: testError.message,
        hint: 'Check SUPABASE_SERVICE_ROLE_KEY environment variable'
      }, { status: 500 })
    }
    
    console.log('Supabase connection successful')

    // Check if prospect already exists
    console.log('Checking for existing prospect with email:', email)
    const { data: existingProspect, error: checkError } = await supabase
      .from('prospects')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    if (checkError) {
      console.error('Error checking existing prospect:', checkError)
      return NextResponse.json({
        error: 'Database query failed',
        details: checkError.message,
        code: checkError.code,
        hint: checkError.hint || 'Check database permissions'
      }, { status: 500 })
    }

    let prospectId
    let prospectData

    if (existingProspect) {
      console.log('Updating existing prospect:', existingProspect.id)
      
      // Build update object with only essential fields first
      const updateData: any = {
        company_name,
        contact_name,
        phone: phone || null,
        industry: industry || null,
        qb_company_id: company_id,
        workflow_stage: 'needs_transcript',
        updated_at: new Date().toISOString()
      }
      
      // Try to include annual_revenue and employee_count if provided
      // But don't fail if these columns aren't recognized
      try {
        if (annual_revenue) {
          updateData.annual_revenue = parseFloat(annual_revenue)
        }
        if (employee_count) {
          updateData.employee_count = parseInt(employee_count)
        }
      } catch (e) {
        console.warn('Could not parse numeric fields:', e)
      }
      
      // Update existing prospect
      const { data: updatedProspect, error: updateError } = await supabase
        .from('prospects')
        .update(updateData)
        .eq('id', existingProspect.id)
        .select()
        .single()

      if (updateError) {
        console.error('Update error:', updateError)
        
        // If the error is about columns, try again without the problematic fields
        if (updateError.code === 'PGRST204' || updateError.message.includes('column')) {
          console.log('Retrying without numeric fields...')
          delete updateData.annual_revenue
          delete updateData.employee_count
          
          const { data: retryUpdate, error: retryError } = await supabase
            .from('prospects')
            .update(updateData)
            .eq('id', existingProspect.id)
            .select()
            .single()
          
          if (retryError) {
            return NextResponse.json({
              error: 'Failed to update prospect',
              details: retryError.message,
              code: retryError.code,
              hint: 'Database schema may be out of sync'
            }, { status: 500 })
          }
          
          prospectData = retryUpdate
        } else {
          return NextResponse.json({
            error: 'Failed to update prospect',
            details: updateError.message,
            code: updateError.code,
            hint: updateError.hint
          }, { status: 500 })
        }
      } else {
        prospectData = updatedProspect
      }

      prospectId = existingProspect.id
      console.log('Prospect updated successfully:', prospectId)
    } else {
      console.log('Creating new prospect')
      
      // Build insert object with essential fields
      const insertData: any = {
        company_name,
        contact_name,
        email,
        phone: phone || null,
        industry: industry || null,
        workflow_stage: 'needs_transcript',
        user_type: 'prospect',
        qb_company_id: company_id
      }
      
      // Try to include annual_revenue and employee_count if provided
      try {
        if (annual_revenue) {
          insertData.annual_revenue = parseFloat(annual_revenue)
        }
        if (employee_count) {
          insertData.employee_count = parseInt(employee_count)
        }
      } catch (e) {
        console.warn('Could not parse numeric fields:', e)
      }
      
      // Create new prospect
      const { data: newProspect, error: insertError } = await supabase
        .from('prospects')
        .insert(insertData)
        .select()
        .single()

      if (insertError) {
        console.error('Insert error:', insertError)
        
        // If the error is about columns, try again without the problematic fields
        if (insertError.code === 'PGRST204' || insertError.message.includes('column')) {
          console.log('Retrying without numeric fields...')
          delete insertData.annual_revenue
          delete insertData.employee_count
          
          const { data: retryInsert, error: retryError } = await supabase
            .from('prospects')
            .insert(insertData)
            .select()
            .single()
          
          if (retryError) {
            return NextResponse.json({
              error: 'Failed to create prospect',
              details: retryError.message,
              code: retryError.code,
              hint: 'Database schema may be out of sync'
            }, { status: 500 })
          }
          
          prospectData = retryInsert
        } else {
          return NextResponse.json({
            error: 'Failed to create prospect',
            details: insertError.message,
            code: insertError.code,
            hint: insertError.hint
          }, { status: 500 })
        }
      } else {
        prospectData = newProspect
      }

      prospectId = prospectData.id
      console.log('Prospect created successfully:', prospectId)
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
        const { error: linkError } = await supabase
          .from('qbo_tokens')
          .update({ 
            prospect_id: prospectId,
            updated_at: new Date().toISOString()
          })
          .eq('id', tokenData.id)
        
        if (linkError) {
          console.error('Failed to link prospect to token:', linkError)
          // Don't fail the whole operation for this
        } else {
          console.log('Successfully linked prospect to QB token')
        }
      } else {
        console.log('No QB token found for company:', company_id)
      }
    }

    console.log('=== Operation completed successfully ===')

    return NextResponse.json({
      success: true,
      prospect_id: prospectId,
      prospect: prospectData,
      message: existingProspect ? 'Prospect updated successfully' : 'Prospect created successfully'
    })

  } catch (error) {
    console.error('=== Unexpected API Error ===')
    console.error('Error type:', error?.constructor?.name)
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Full error:', error)
    
    // Check for JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json({
        error: 'Invalid request format',
        details: 'Request body must be valid JSON',
        hint: 'Check that all form fields are properly formatted'
      }, { status: 400 })
    }
    
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'An unexpected error occurred',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}