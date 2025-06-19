// Utility functions for consistent company data handling

export interface Company {
  id: string
  company_id: string
  company_name: string
  connection_status: string
  workflow_stage: string
  has_financial_data: boolean
  has_ai_analysis: boolean
  transcript_count: number
  [key: string]: any // Allow additional properties but with proper typing
}

/**
 * Safely get company name from various possible property names
 * This handles cases where the property might be 'company_name', 'companyName', 'name', etc.
 */
export function getCompanyName(company: any): string {
  if (!company) return 'Unknown Company'
  
  // Try common property names
  return company.company_name || 
         company.companyName || 
         company.name || 
         company.Name ||
         company['company name'] || // Handle space in property name
         company['company_name'] ||
         'Unknown Company'
}

/**
 * Safely get company ID from various possible property names
 */
export function getCompanyId(company: any): string {
  if (!company) return ''
  
  return company.company_id || 
         company.companyId || 
         company.id || 
         company.realm_id ||
         company.realmId ||
         company['company id'] || // Handle space in property name
         company['company_id'] ||
         ''
}

/**
 * Normalize company object to ensure consistent property names
 */
export function normalizeCompany(company: any): Company {
  return {
    id: company.id || getCompanyId(company),
    company_id: getCompanyId(company),
    company_name: getCompanyName(company),
    connection_status: company.connection_status || company.connectionStatus || 'unknown',
    workflow_stage: company.workflow_stage || company.workflowStage || 'unknown',
    has_financial_data: company.has_financial_data || company.hasFinancialData || false,
    has_ai_analysis: company.has_ai_analysis || company.hasAiAnalysis || false,
    transcript_count: company.transcript_count || company.transcriptCount || 0,
    ...company // Preserve any additional properties
  }
}

/**
 * Build consistent URL parameters for company navigation
 */
export function buildCompanyUrlParams(company: any): URLSearchParams {
  const normalizedCompany = normalizeCompany(company)
  return new URLSearchParams({
    company_id: normalizedCompany.company_id,
    company_name: normalizedCompany.company_name
  })
}

/**
 * Extract company parameters from URL search params
 * Handles multiple parameter name formats
 */
export function extractCompanyFromUrlParams(searchParams: URLSearchParams): { companyId: string, companyName: string } | null {
  const companyId = searchParams.get('company_id') || 
                    searchParams.get('companyId') || 
                    searchParams.get('account') ||
                    searchParams.get('id') || ''
  
  const companyName = searchParams.get('company_name') || 
                      searchParams.get('companyName') || 
                      searchParams.get('company') ||
                      searchParams.get('name') || ''
  
  if (!companyId || !companyName) {
    return null
  }
  
  return {
    companyId,
    companyName: decodeURIComponent(companyName)
  }
}