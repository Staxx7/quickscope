import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(
  request: NextRequest, 
  context: { params: { id: string } }
) {
  const { params } = context
  try {
    const prospectId = params.id

    // Fetch saved audit decks for this prospect
    const { data: auditDecks, error } = await supabase
      .from('audit_decks')
      .select('*')
      .eq('prospect_id', prospectId)
      .order('generated_at', { ascending: false })

    if (error) {
      console.error('Error fetching audit decks:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ auditDecks })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context
  try {
    const prospectId = params.id
    const { searchParams } = new URL(request.url)
    const deckId = searchParams.get('deckId')

    if (!deckId) {
      return NextResponse.json({ error: 'deckId is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('audit_decks')
      .delete()
      .eq('id', deckId)
      .eq('prospect_id', prospectId)

    if (error) {
      console.error('Error deleting audit deck:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
