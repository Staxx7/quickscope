import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/app/lib/serviceFactory'

// GET: Fetch all transcripts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const prospectId = searchParams.get('prospectId')
    const transcriptId = searchParams.get('transcriptId')

    const supabase = getSupabase()
    
    if (transcriptId) {
      const { data, error } = await supabase
        .from('call_transcripts')
        .select('*')
        .eq('id', transcriptId)
        .single()

      if (error) {
        console.error('Error fetching transcript:', error)
        return NextResponse.json(
          { error: 'Failed to fetch transcript', details: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        transcripts: [data],
        count: 1
      })
    } else if (prospectId) {
      const { data, error } = await supabase
        .from('call_transcripts')
        .select('*')
        .eq('prospect_id', prospectId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching transcripts:', error)
        return NextResponse.json(
          { error: 'Failed to fetch transcripts', details: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        transcripts: data || [],
        count: data?.length || 0
      })
    } else {
      return NextResponse.json(
        { error: 'Either prospectId or transcriptId is required' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST: Create new transcript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      prospect_id, 
      file_name, 
      transcript_text, 
      file_url,
      duration_seconds 
    } = body

    if (!prospect_id || !file_name || !transcript_text) {
      return NextResponse.json(
        { error: 'Missing required fields: prospect_id, file_name, transcript_text' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()
    
    // Create transcript record
    const { data, error } = await supabase
      .from('call_transcripts')
      .insert({
        prospect_id,
        file_name,
        transcript_text,
        file_url,
        duration_seconds,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating transcript:', error)
      return NextResponse.json(
        { error: 'Failed to create transcript', details: error.message },
        { status: 500 }
      )
    }

    // Update prospect workflow stage if this is their first transcript
    const { data: existingTranscripts } = await supabase
      .from('call_transcripts')
      .select('id')
      .eq('prospect_id', prospect_id)

    if (existingTranscripts && existingTranscripts.length === 1) {
      await supabase
        .from('prospects')
        .update({ 
          workflow_stage: 'transcript_uploaded',
          updated_at: new Date().toISOString()
        })
        .eq('id', prospect_id)
    }

    return NextResponse.json({
      success: true,
      transcript: data,
      message: 'Transcript uploaded successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE: Remove transcript
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const transcriptId = searchParams.get('transcriptId')

    if (!transcriptId) {
      return NextResponse.json(
        { error: 'transcriptId is required' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()
    
    const { error } = await supabase
      .from('call_transcripts')
      .delete()
      .eq('id', transcriptId)

    if (error) {
      console.error('Error deleting transcript:', error)
      return NextResponse.json(
        { error: 'Failed to delete transcript', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Transcript deleted successfully'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
