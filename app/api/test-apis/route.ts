import { NextRequest, NextResponse } from 'next/server'
import { BLSService } from 'app/lib/blsService'
import { CensusService } from 'app/lib/censusService'

export async function GET(request: NextRequest) {
  const results = {
    bls: {
      hasApiKey: !!process.env.BLS_API_KEY,
      apiKeyLength: process.env.BLS_API_KEY?.length || 0,
      testResult: null as any,
      error: null as any
    },
    census: {
      hasApiKey: !!process.env.CENSUS_API_KEY,
      apiKeyLength: process.env.CENSUS_API_KEY?.length || 0,
      testResult: null as any,
      error: null as any
    }
  }

  // Test BLS API
  try {
    const blsService = new BLSService()
    const testData = await blsService.getIndustryBenchmarks('technology')
    results.bls.testResult = testData
  } catch (error) {
    results.bls.error = error instanceof Error ? error.message : 'Unknown error'
  }

  // Test Census API
  try {
    const censusService = new CensusService()
    const testData = await censusService.getIndustryDemographics('technology')
    results.census.testResult = testData
  } catch (error) {
    results.census.error = error instanceof Error ? error.message : 'Unknown error'
  }

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    results
  })
}