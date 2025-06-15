/**
 * API wrapper for consistent error handling without mock data fallbacks
 */

export class APIError extends Error {
  status: number
  code: string
  
  constructor(message: string, status: number, code: string = 'API_ERROR') {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.code = code
  }
}

export interface FetchOptions extends RequestInit {
  timeout?: number
}

/**
 * Fetch wrapper that throws errors instead of returning mock data
 */
export async function fetchWithErrorHandling(
  url: string, 
  options?: FetchOptions
): Promise<any> {
  const { timeout = 30000, ...fetchOptions } = options || {}
  
  // Create abort controller for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    // Check if response is ok
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new APIError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.code || 'HTTP_ERROR'
      )
    }
    
    // Parse JSON response
    const data = await response.json()
    return data
    
  } catch (error: any) {
    clearTimeout(timeoutId)
    
    // Handle different error types
    if (error instanceof APIError) {
      throw error
    }
    
    if (error.name === 'AbortError') {
      throw new APIError('Request timeout', 408, 'TIMEOUT')
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError('Network error - please check your connection', 0, 'NETWORK_ERROR')
    }
    
    // Generic error
    throw new APIError(
      error.message || 'An unexpected error occurred',
      500,
      'UNKNOWN_ERROR'
    )
  }
}

/**
 * GET request wrapper
 */
export async function apiGet(url: string, options?: FetchOptions) {
  return fetchWithErrorHandling(url, {
    ...options,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  })
}

/**
 * POST request wrapper
 */
export async function apiPost(url: string, data?: any, options?: FetchOptions) {
  return fetchWithErrorHandling(url, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    },
    body: data ? JSON.stringify(data) : undefined
  })
}

/**
 * PUT request wrapper
 */
export async function apiPut(url: string, data?: any, options?: FetchOptions) {
  return fetchWithErrorHandling(url, {
    ...options,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    },
    body: data ? JSON.stringify(data) : undefined
  })
}

/**
 * DELETE request wrapper
 */
export async function apiDelete(url: string, options?: FetchOptions) {
  return fetchWithErrorHandling(url, {
    ...options,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  })
}

/**
 * Handle API errors consistently
 */
export function handleAPIError(error: any): string {
  if (error instanceof APIError) {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Unable to connect to the server. Please check your internet connection.'
      case 'TIMEOUT':
        return 'The request took too long. Please try again.'
      case 'UNAUTHORIZED':
        return 'You are not authorized to access this resource. Please log in again.'
      case 'NOT_FOUND':
        return 'The requested resource was not found.'
      case 'QUICKBOOKS_NOT_CONNECTED':
        return 'Please connect your QuickBooks account to access this feature.'
      default:
        return error.message || 'An error occurred while processing your request.'
    }
  }
  
  return 'An unexpected error occurred. Please try again.'
}