export class QBOClient {
  async getProfitLoss(companyId: string, options: { period: string }) {
    const response = await fetch(`/api/qbo/profit-loss?companyId=${companyId}&period=${options.period}`);
    if (!response.ok) throw new Error('Failed to fetch profit & loss');
    return response.json();
  }

  async getBalanceSheet(companyId: string) {
    const response = await fetch(`/api/qbo/balance-sheet?companyId=${companyId}`);
    if (!response.ok) throw new Error('Failed to fetch balance sheet');
    return response.json();
  }

  async getCashFlow(companyId: string, options: { period: string }) {
    const response = await fetch(`/api/qbo/cash-flow?companyId=${companyId}&period=${options.period}`);
    if (!response.ok) throw new Error('Failed to fetch cash flow');
    return response.json();
  }
} 