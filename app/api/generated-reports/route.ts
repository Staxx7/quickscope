import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/app/lib/serviceFactory'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('company_id')
    const reportType = searchParams.get('type')
    const limit = searchParams.get('limit') || '20'

    const supabase = getSupabase()
    let query = supabase
      .from('generated_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(parseInt(limit))

    if (companyId) {
      query = query.eq('company_id', companyId)
    }

    if (reportType) {
      query = query.eq('report_type', reportType)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching reports:', error)
      return NextResponse.json(
        { error: 'Failed to fetch reports', details: error.message },
        { status: 500 }
      )
    }

    // Transform database records to match expected format
    const reports = data?.map(record => ({
      id: record.id,
      title: record.title,
      type: record.report_type,
      status: record.status || 'completed',
      generatedAt: record.created_at,
      company_id: record.company_id,
      data: record.report_data || {}
    })) || []

    return NextResponse.json({ reports })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      title,
      type,
      company_id,
      data,
      status = 'completed'
    } = body

    if (!title || !type || !company_id) {
      return NextResponse.json(
        { error: 'Missing required fields: title, type, company_id' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()
    
    const { data: report, error } = await supabase
      .from('generated_reports')
      .insert({
        title,
        report_type: type,
        company_id,
        report_data: data,
        status,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating report:', error)
      return NextResponse.json(
        { error: 'Failed to create report', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      report: {
        id: report.id,
        title: report.title,
        type: report.report_type,
        status: report.status,
        generatedAt: report.created_at,
        company_id: report.company_id,
        data: report.report_data
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reportId = searchParams.get('id')

    if (!reportId) {
      return NextResponse.json(
        { error: 'Report ID is required' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()
    
    const { error } = await supabase
      .from('generated_reports')
      .delete()
      .eq('id', reportId)

    if (error) {
      console.error('Error deleting report:', error)
      return NextResponse.json(
        { error: 'Failed to delete report', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Report deleted successfully'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}