import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // This route is deprecated - redirect to the proper QuickBooks callback
  const url = new URL('/api/auth/quickbooks/callback', request.url)
  
  // Copy all search params
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value)
  })
  
  console.log('Redirecting from old callback to:', url.pathname)
  
  return NextResponse.redirect(url)
}
