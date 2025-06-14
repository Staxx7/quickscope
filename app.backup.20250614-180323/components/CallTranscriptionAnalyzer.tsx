'use client'
import React from 'react'

interface CallTranscriptAnalyzerProps {
  prospectId: string
  companyName: string
  onInsightsGenerated?: (insights: any) => void
}

const CallTranscriptAnalyzer: React.FC<CallTranscriptAnalyzerProps> = ({ prospectId, companyName, onInsightsGenerated }) => {
  return (
    <div className="p-6">
      <h2>Call Transcript Analyzer - {companyName}</h2>
      <p>Component under development...</p>
    </div>
  )
}

export default CallTranscriptAnalyzer
