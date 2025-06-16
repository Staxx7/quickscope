import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Update the prospect to remove QuickBooks connection
    const { error } = await supabase
      .from('prospects')
      .update({ 
        company_id: null,
        workflow_stage: 'not_connected' 
      })
      .eq('id', id)

    if (error) {
      console.error('Error disconnecting QuickBooks:', error)
      return NextResponse.json(
        { error: 'Failed to disconnect QuickBooks' },
        { status: 500 }
      )
    }

    // Also remove any related QuickBooks tokens
    await supabase
      .from('quickbooks_tokens')
      .delete()
      .eq('prospect_id', id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Disconnect QuickBooks error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}