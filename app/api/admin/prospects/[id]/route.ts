import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Delete the prospect
    const { error } = await supabase
      .from('prospects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting prospect:', error)
      return NextResponse.json(
        { error: 'Failed to delete prospect' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete prospect error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}