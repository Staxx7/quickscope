import { NextRequest } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const accountId = params.id;
    
    // Simulate individual account sync
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return Response.json({ 
      success: true, 
      message: `Account ${accountId} synced successfully`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({ error: 'Individual sync failed' }, { status: 500 });
  }
}