'use client'

import React, { useState } from 'react'
import { FileText, Download, Eye, Printer } from 'lucide-react'

interface AuditDeckProps {
  companyId: string
  companyName: string
  financialData?: any
  transcriptAnalysis?: any
}

export default function AuditDeckGenerator({ companyId, companyName, financialData, transcriptAnalysis }: AuditDeckProps) {
  const [generating, setGenerating] = useState(false)
  const [deckUrl, setDeckUrl] = useState<string | null>(null)

  const generateAuditDeck = async () => {
    setGenerating(true)
    try {
      const response = await fetch('/api/generate-audit-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          companyName,
          financialData,
          transcriptAnalysis
        })
      })

      if (!response.ok) throw new Error('Generation failed')
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setDeckUrl(url)
    } catch (error) {
      console.error('Deck generation failed:', error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <FileText className="text-blue-500 mr-2" size={24} />
          Audit Deck Generator
        </h3>
      </div>

      <p className="text-gray-600 mb-4">
        Generate a comprehensive audit deck for your discovery call with {companyName}
      </p>

      <div className="space-y-4">
        <button
          onClick={generateAuditDeck}
          disabled={generating}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {generating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Generating Deck...
            </>
          ) : (
            <>
              <FileText className="mr-2" size={20} />
              Generate Audit Deck
            </>
          )}
        </button>

        {deckUrl && (
          <div className="flex space-x-2">
            <a
              href={deckUrl}
              download={`${companyName}_Audit_Deck.pdf`}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
            >
              <Download className="mr-2" size={16} />
              Download PDF
            </a>
            
            <button
              onClick={() => window.open(deckUrl, '_blank')}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center"
            >
              <Eye className="mr-2" size={16} />
              Preview
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <h4 className="font-medium mb-2">Audit Deck Includes:</h4>
        <ul className="space-y-1">
          <li>• Executive Summary</li>
          <li>• Financial Health Score</li>
          <li>• Key Performance Metrics</li>
          <li>• Industry Benchmarks</li>
          <li>• Identified Opportunities</li>
          <li>• Recommended Action Plan</li>
          <li>• QUICKSCOPE Service Overview</li>
        </ul>
      </div>
    </div>
  )
}
