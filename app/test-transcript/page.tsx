'use client'

import { useState } from 'react'
import CallTranscriptsIntegration from '@/app/components/CallTranscriptsIntegration'

export default function TestTranscriptPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Test Transcript Processing</h1>
        <CallTranscriptsIntegration 
          defaultCompanyId="test-company-123" 
          defaultCompanyName="Test Company"
        />
      </div>
    </div>
  )
}