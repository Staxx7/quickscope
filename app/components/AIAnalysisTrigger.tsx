'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface AIAnalysisTriggerProps {
  prospectId: string
  prospectName: string
  hasTranscript: boolean
  hasFinancialData: boolean
  onAnalysisComplete?: (analysisId: string) => void
}

export default function AIAnalysisTrigger({
  prospectId,
  prospectName,
  hasTranscript,
  hasFinancialData,
  onAnalysisComplete
}: AIAnalysisTriggerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  const canAnalyze = hasTranscript || hasFinancialData
  const analysisType = hasTranscript && hasFinancialData 
    ? 'comprehensive' 
    : hasTranscript 
    ? 'transcript-only' 
    : 'financial-only'

  const runAIAnalysis = async () => {
    setIsAnalyzing(true)
    setError(null)
    setAnalysisProgress(0)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) return prev
          return prev + Math.random() * 20
        })
      }, 500)

      // Prepare analysis request
      const requestBody: any = {
        prospectId,
        companyInfo: { name: prospectName },
        analysisType
      }

      // Fetch transcript if available
      if (hasTranscript) {
        const transcriptResponse = await fetch(`/api/call-transcripts?prospectId=${prospectId}`)
        const transcriptData = await transcriptResponse.json()
        requestBody.transcriptText = transcriptData.transcripts?.[0]?.transcript_text || ''
      }

      // Fetch financial data if available
      if (hasFinancialData) {
        const financialResponse = await fetch(`/api/qbo/financial-snapshot?prospectId=${prospectId}`)
        const financialData = await financialResponse.json()
        requestBody.financialData = financialData.data || {}
      }

      // Run AI analysis
      const response = await fetch('/api/analyze-prospect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      clearInterval(progressInterval)
      setAnalysisProgress(100)

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const results = await response.json()
      setAnalysisResults(results.results)
      
      if (results.analysisId && onAnalysisComplete) {
        onAnalysisComplete(results.analysisId)
      }

      // Store results in database
      await fetch('/api/ai-analyses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prospect_id: prospectId,
          ...results.results
        })
      })

    } catch (err) {
      console.error('AI analysis error:', err)
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
      setAnalysisProgress(0)
    }
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            AI Business Intelligence
          </h3>
          <p className="text-sm text-blue-100 mt-1">
            {canAnalyze 
              ? `Ready for ${analysisType.replace('-', ' ')} analysis`
              : 'Upload transcript or connect QuickBooks first'
            }
          </p>
        </div>
        
        <button
          onClick={runAIAnalysis}
          disabled={!canAnalyze || isAnalyzing}
          className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 
            ${canAnalyze && !isAnalyzing
              ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg'
              : 'bg-blue-400 text-blue-200 cursor-not-allowed'
            }`}
        >
          {isAnalyzing ? 'Analyzing...' : 'Run AI Analysis'}
        </button>
      </div>

      {/* Progress Bar */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <div className="bg-blue-800 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-white h-full"
              animate={{ width: `${analysisProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-sm text-blue-100 mt-2">
            {analysisProgress < 30 && 'Gathering data...'}
            {analysisProgress >= 30 && analysisProgress < 60 && 'Analyzing patterns...'}
            {analysisProgress >= 60 && analysisProgress < 90 && 'Generating insights...'}
            {analysisProgress >= 90 && 'Finalizing recommendations...'}
          </p>
        </motion.div>
      )}

      {/* Results Preview */}
      {analysisResults && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4"
        >
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Analysis Complete
          </h4>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {analysisResults.transcriptAnalysis && (
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {analysisResults.transcriptAnalysis.salesIntelligence?.closeability || 0}%
                </div>
                <div className="text-xs text-blue-200">Closeability</div>
              </div>
            )}
            {analysisResults.financialIntelligence && (
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {analysisResults.financialIntelligence.healthScore || 0}
                </div>
                <div className="text-xs text-blue-200">Financial Health</div>
              </div>
            )}
            {analysisResults.businessInsights && (
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {analysisResults.businessInsights.urgentActions?.length || 0}
                </div>
                <div className="text-xs text-blue-200">Urgent Actions</div>
              </div>
            )}
          </div>

          {/* Key Insights */}
          {analysisResults.businessInsights?.keyFindings && (
            <div className="border-t border-white/20 pt-3">
              <p className="text-sm font-medium mb-2">Key Findings:</p>
              <ul className="text-sm text-blue-100 space-y-1">
                {analysisResults.businessInsights.keyFindings.slice(0, 3).map((finding: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-300">•</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button className="mt-4 text-sm underline hover:no-underline">
            View Full Analysis →
          </button>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 bg-red-500/20 border border-red-400 rounded-lg p-3 text-sm"
        >
          <p className="font-medium">Analysis Error</p>
          <p className="text-red-200">{error}</p>
        </motion.div>
      )}
    </div>
  )
}