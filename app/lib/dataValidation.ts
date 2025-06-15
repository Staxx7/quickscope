/**
 * Data validation utilities for ensuring data integrity
 */

export function validateFinancialData(data: any): boolean {
  if (!data) return false
  
  // Check required financial fields
  const requiredFields = ['revenue', 'expenses']
  const hasRequiredFields = requiredFields.every(field => 
    field in data && typeof data[field] === 'number'
  )
  
  if (!hasRequiredFields) return false
  
  // Validate numeric values are non-negative
  const numericFields = ['revenue', 'expenses', 'net_income', 'assets', 'liabilities']
  const validNumbers = numericFields.every(field => {
    if (!(field in data)) return true // Optional fields
    return typeof data[field] === 'number' && data[field] >= 0
  })
  
  return validNumbers
}

export function validateCompanyData(data: any): boolean {
  if (!data) return false
  
  return !!(
    data.company_id &&
    data.company_name &&
    typeof data.company_id === 'string' &&
    typeof data.company_name === 'string'
  )
}

export function validateProspectData(data: any): boolean {
  if (!data) return false
  
  return !!(
    data.id &&
    data.email &&
    typeof data.email === 'string' &&
    data.email.includes('@')
  )
}

export function validateTranscriptData(data: any): boolean {
  if (!data) return false
  
  return !!(
    data.id &&
    data.transcript_text &&
    typeof data.transcript_text === 'string' &&
    data.transcript_text.length > 0
  )
}

export function validateAIAnalysisData(data: any): boolean {
  if (!data) return false
  
  return !!(
    data.analysis &&
    typeof data.closeability_score === 'number' &&
    data.closeability_score >= 0 &&
    data.closeability_score <= 100
  )
}

export function validateMetricsData(metrics: any): boolean {
  if (!metrics) return false
  
  // Check if it's an array of metrics
  if (Array.isArray(metrics)) {
    return metrics.every(metric => 
      metric.id &&
      metric.name &&
      typeof metric.value === 'number'
    )
  }
  
  // Check if it's a metrics object
  return typeof metrics === 'object' && Object.keys(metrics).length > 0
}

export function sanitizeFinancialData(data: any): any {
  if (!data) return null
  
  return {
    revenue: Number(data.revenue) || 0,
    expenses: Number(data.expenses) || 0,
    net_income: Number(data.net_income) || 0,
    gross_margin: Number(data.gross_margin) || 0,
    net_margin: Number(data.net_margin) || 0,
    assets: Number(data.assets) || 0,
    liabilities: Number(data.liabilities) || 0,
    cash_flow: Number(data.cash_flow) || 0,
    current_ratio: Number(data.current_ratio) || 0,
    quick_ratio: Number(data.quick_ratio) || 0
  }
}

export function getDataQualityScore(data: any): number {
  if (!data) return 0
  
  let score = 0
  const totalFields = 10
  
  // Check each field for completeness
  const fields = [
    'revenue', 'expenses', 'net_income', 'gross_margin', 
    'net_margin', 'assets', 'liabilities', 'cash_flow',
    'current_ratio', 'quick_ratio'
  ]
  
  fields.forEach(field => {
    if (data[field] && data[field] !== 0) {
      score++
    }
  })
  
  return Math.round((score / totalFields) * 100)
}