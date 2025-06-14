import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const params = await context.params;
    const accountId = params.id;
    
    // Simulate individual account sync
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return NextResponse.json({ 
      success: true, 
      message: `Account ${accountId} synced successfully`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Individual sync error:', error);
    return NextResponse.json({ error: 'Individual sync failed' }, { status: 500 });
  }
}
