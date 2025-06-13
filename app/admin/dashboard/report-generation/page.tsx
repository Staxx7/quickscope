'use client'

import React from 'react'
import IntelligentAuditDeckGenerator from 'app/components/IntelligentAuditDeckGenerator'

export default function ReportGenerationPage() {
  return (
    <div className="space-y-8">
      <IntelligentAuditDeckGenerator 
        prospectId="demo-123"
        companyName="Demo Company"
      />
    </div>
  )
}