import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET: Fetch all transcripts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const prospectId = searchParams.get('prospectId')

    let query = supabase
      .from('call_transcripts')
      .select('*')
      .order('created_at', { ascending: false })

    if (companyId) {
      query = query.eq('company_id', companyId)
    }

    if (prospectId) {
      query = query.eq('prospect_id', prospectId)
    }

    const { data: transcripts, error } = await query

    if (error) {
      console.error('Error fetching transcripts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ transcripts })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Create new transcript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      prospect_id,
      company_id,
      company_name,
      file_name,
      file_type,
      file_size,
      transcript_text,
      analysis_results,
      audio_url
    } = body

    if (!prospect_id || !company_id) {
      return NextResponse.json({ 
        error: 'prospect_id and company_id are required' 
      }, { status: 400 })
    }

    const { data: transcript, error } = await supabase
      .from('call_transcripts')
      .insert({
        prospect_id,
        company_id,
        company_name: company_name || 'Unknown Company',
        file_name: file_name || 'transcript.txt',
        file_type: file_type || 'text/plain',
        file_size: file_size || 0,
        transcript_text: transcript_text || '',
        analysis_results,
        audio_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating transcript:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ transcript })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT: Update existing transcript
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      id,
      transcript_text,
      analysis_results
    } = body

    if (!id) {
      return NextResponse.json({ 
        error: 'Transcript ID is required' 
      }, { status: 400 })
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (transcript_text !== undefined) {
      updateData.transcript_text = transcript_text
    }

    if (analysis_results !== undefined) {
      updateData.analysis_results = analysis_results
    }

    const { data: transcript, error } = await supabase
      .from('call_transcripts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating transcript:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ transcript })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: Remove transcript
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ 
        error: 'Transcript ID is required' 
      }, { status: 400 })
    }

    const { error } = await supabase
      .from('call_transcripts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting transcript:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
