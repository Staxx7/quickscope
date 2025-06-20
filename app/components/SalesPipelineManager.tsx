'use client'
import React, { useState } from 'react'
import { Users, TrendingUp, Calendar, FileText } from 'lucide-react'

interface Prospect {
  id: string
  name: string
  company: string
  stage: 'connected' | 'analyzed' | 'audit_scheduled' | 'audit_completed'
  connectedAt: string
}

export default function SalesPipelineManager() {
  const [prospects] = useState<Prospect[]>([
    {
      id: '1',
      name: 'John Smith',
      company: 'ABC Corp',
      stage: 'connected',
      connectedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      company: 'TechStart Inc',
      stage: 'analyzed',
      connectedAt: '2024-01-10'
    },
    {
      id: '3',
      name: 'Mike Chen',
      company: 'Global Solutions',
      stage: 'audit_scheduled',
      connectedAt: '2024-01-05'
    }
  ])

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'connected': return 'bg-blue-100 text-blue-800'
      case 'analyzed': return 'bg-yellow-100 text-yellow-800'
      case 'audit_scheduled': return 'bg-orange-100 text-orange-800'
      case 'audit_completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quickscope Workflow</h2>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-600">{prospects.length} prospects</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Connected</p>
              <p className="text-2xl font-bold text-blue-900">
                {prospects.filter(p => p.stage === 'connected').length}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Analyzed</p>
              <p className="text-2xl font-bold text-yellow-900">
                {prospects.filter(p => p.stage === 'analyzed').length}
              </p>
            </div>
            <FileText className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Audit Scheduled</p>
              <p className="text-2xl font-bold text-orange-900">
                {prospects.filter(p => p.stage === 'audit_scheduled').length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Audit Complete</p>
              <p className="text-2xl font-bold text-green-900">
                {prospects.filter(p => p.stage === 'audit_completed').length}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prospect
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Connected
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {prospects.map((prospect) => (
              <tr key={prospect.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{prospect.name}</div>
                    <div className="text-sm text-gray-500">{prospect.company}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(prospect.stage)}`}>
                    {prospect.stage.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {prospect.connectedAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
