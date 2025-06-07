import React, { useState, useEffect } from 'react'

interface FinancialControlsProps {
  onDateRangeChange: (startDate: string, endDate: string) => void
  onReportsChange: (reports: string[]) => void
  onOpenModal: () => void
  prospects: Array<{ id: string; name: string; company_name: string; company_id: string | null }>
  selectedCompanyId: string | null
  onCompanyChange: (companyId: string) => void
}

export default function FinancialControls({
  onDateRangeChange,
  onReportsChange,
  onOpenModal,
  prospects,
  selectedCompanyId,
  onCompanyChange
}: FinancialControlsProps) {
  // Initialize current date variables FIRST
  const now = new Date()
  const currentYear = now.getFullYear()
  
  // Initialize state with current year dates
  const [startDate, setStartDate] = useState(`${currentYear}-01-01`)
  const [endDate, setEndDate] = useState(now.toISOString().split('T')[0])
  const [selectedReports, setSelectedReports] = useState<string[]>(['profit-loss'])

  // Date range options
  const getLastQuarter = () => {
    // Q1 2025 (current year's last completed quarter)
    return {
      start: `${currentYear}-01-01`, // January 1st 
      end: `${currentYear}-03-31`    // March 31st
    }
  }

  const getYearToDate = () => {
    return {
      start: `${currentYear}-01-01`,
      end: now.toISOString().split('T')[0]
    }
  }

  const getLastYear = () => {
    const lastYear = currentYear - 1
    return {
      start: `${lastYear}-01-01`,
      end: `${lastYear}-12-31`
    }
  }

  // Handle date range preset buttons
  const handlePresetDateRange = (preset: 'last-quarter' | 'year-to-date' | 'last-year') => {
    let newDates
    
    switch (preset) {
      case 'last-quarter':
        newDates = getLastQuarter()
        break
      case 'year-to-date':
        newDates = getYearToDate()
        break
      case 'last-year':
        newDates = getLastYear()
        break
      default:
        return
    }
    
    setStartDate(newDates.start)
    setEndDate(newDates.end)
    onDateRangeChange(newDates.start, newDates.end)
  }

  // Handle manual date changes
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value
    setStartDate(newStartDate)
    onDateRangeChange(newStartDate, endDate)
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value
    setEndDate(newEndDate)
    onDateRangeChange(startDate, newEndDate)
  }

  // Handle report type changes
  const handleReportToggle = (reportType: string) => {
    const newSelectedReports = selectedReports.includes(reportType)
      ? selectedReports.filter(r => r !== reportType)
      : [...selectedReports, reportType]
    
    setSelectedReports(newSelectedReports)
    onReportsChange(newSelectedReports)
  }

  // Initialize on component mount
  useEffect(() => {
    onDateRangeChange(startDate, endDate)
    onReportsChange(selectedReports)
  }, []) // Empty dependency array - only run once on mount

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex flex-col space-y-4">
        
        {/* Company Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
          <label className="text-sm font-medium text-gray-700 min-w-fit">
            Select Company:
          </label>
          <select
            value={selectedCompanyId || ''}
            onChange={(e) => onCompanyChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-64"
          >
            <option value="">Choose a company...</option>
            {prospects.filter(p => p.company_id).map((prospect) => (
              <option key={prospect.id} value={prospect.company_id!}>
                {prospect.company_name} - {prospect.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
          <div className="flex space-x-2">
            <button
              onClick={() => handlePresetDateRange('last-quarter')}
              className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              Last Quarter (Q1)
            </button>
            <button
              onClick={() => handlePresetDateRange('year-to-date')}
              className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
            >
              Year to Date
            </button>
            <button
              onClick={() => handlePresetDateRange('last-year')}
              className="px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
            >
              Last Year (2024)
            </button>
          </div>
          
          <div className="flex space-x-2">
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="flex items-center text-gray-500">to</span>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Report Type Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedReports.includes('profit-loss')}
                onChange={() => handleReportToggle('profit-loss')}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm font-medium text-gray-700">Profit & Loss</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedReports.includes('balance-sheet')}
                onChange={() => handleReportToggle('balance-sheet')}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm font-medium text-gray-700">Balance Sheet</span>
            </label>
          </div>
          
          <button
            onClick={onOpenModal}
            disabled={selectedReports.length === 0 || !selectedCompanyId}
            className="mt-2 sm:mt-0 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Generate Financial Report
          </button>
        </div>
        
        {/* Company Selection Status */}
        {selectedCompanyId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              📊 Report will be generated for: <strong>
                {prospects.find(p => p.company_id === selectedCompanyId)?.company_name}
              </strong>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
