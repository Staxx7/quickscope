import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const accountId = params.id;
    
    // Mock data for now - replace with real QB API call
    const mockDetails = {
      legalName: `Legal Name for ${accountId}`,
      industry: 'Professional Services',
      foundedDate: '2020-01-01',
      employeeCount: '10-50',
      revenue: 2850000,
      netIncome: 285000,
      cashFlow: 125000,
      lastSync: new Date().toLocaleDateString(),
      connectionStatus: 'connected',
      connectedDate: '2024-01-15',
      recentActivity: [
        { description: 'P&L report generated', date: '2 days ago' },
        { description: 'Account reconciliation completed', date: '1 week ago' },
        { description: 'Tax documents updated', date: '2 weeks ago' }
      ]
    };

    return Response.json(mockDetails);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch details' }, { status: 500 });
  }
}
