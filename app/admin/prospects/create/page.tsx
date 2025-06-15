'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

// Component that uses useSearchParams
function CreateProspectForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const company_id = searchParams.get('company_id')
  const company_name = searchParams.get('company_name') || 'Unknown Company'

  const [formData, setFormData] = useState({
    contact_name: '',
    email: '',
    phone: '',
    industry: '',
    annual_revenue: '',
    employee_count: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Check if a prospect already exists for this email
      const { data: existingProspects, error: checkError } = await supabase
        .from('prospects')
        .select('*')
        .eq('email', formData.email)
        .single()

      let prospectId

      if (existingProspects) {
        // Update existing prospect
        const { data: updatedProspect, error: updateError } = await supabase
          .from('prospects')
          .update({
            company_name: company_name,
            contact_name: formData.contact_name,
            phone: formData.phone || null,
            industry: formData.industry || null,
            annual_revenue: formData.annual_revenue ? parseFloat(formData.annual_revenue) : null,
            employee_count: formData.employee_count ? parseInt(formData.employee_count) : null,
            qb_company_id: company_id,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProspects.id)
          .select()
          .single()

        if (updateError) throw updateError
        prospectId = existingProspects.id
      } else {
        // Create new prospect
        const { data: prospect, error: prospectError } = await supabase
          .from('prospects')
          .insert({
            company_name: company_name,
            contact_name: formData.contact_name,
            email: formData.email,
            phone: formData.phone || null,
            industry: formData.industry || null,
            annual_revenue: formData.annual_revenue ? parseFloat(formData.annual_revenue) : null,
            employee_count: formData.employee_count ? parseInt(formData.employee_count) : null,
            workflow_stage: 'connected',
            user_type: 'prospect',
            qb_company_id: company_id
          })
          .select()
          .single()

        if (prospectError) throw prospectError
        prospectId = prospect.id
      }

      // Update the qbo_token to link to this prospect
      if (prospectId && company_id) {
        console.log('Attempting to link prospect:', prospectId, 'to company:', company_id)
        
        const { data: tokenData, error: fetchError } = await supabase
          .from('qbo_tokens')
          .select('*')
          .eq('company_id', company_id)
          .single()
          
        if (fetchError) {
          console.error('Error fetching QB token:', fetchError)
          // Don't throw - prospect was created successfully
        } else if (tokenData) {
          const { error: updateError } = await supabase
            .from('qbo_tokens')
            .update({ 
              prospect_id: prospectId,
              updated_at: new Date().toISOString()
            })
            .eq('id', tokenData.id)

          if (updateError) {
            console.error('Error linking prospect to QB token:', updateError)
            // Don't throw here, the prospect was created successfully
          } else {
            console.log('Successfully linked prospect to QB token')
          }
        }
      }

      // Update workflow stage based on what data is available
      try {
        await fetch('/api/prospects/update-workflow-stage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prospect_id: prospectId })
        })
      } catch (error) {
        console.error('Error updating workflow stage:', error)
        // Non-critical error, don't prevent redirect
      }

      // Redirect back to dashboard
      router.push('/dashboard')
    } catch (err) {
      console.error('Error creating/updating prospect:', err)
      
      // More detailed error handling
      if (err instanceof Error) {
        if (err.message.includes('duplicate key')) {
          setError('A contact with this email already exists')
        } else if (err.message.includes('violates foreign key constraint')) {
          setError('Invalid company reference. Please try again.')
        } else {
          setError(err.message)
        }
      } else {
        setError('Failed to save contact information. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Add Contact Information</h1>
          <p className="text-slate-400">Add contact details for {company_name}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Contact Name *
              </label>
              <input
                type="text"
                required
                value={formData.contact_name}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_name: e.target.value }))}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="john@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Industry
              </label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Industry</option>
                <option value="Technology">Technology</option>
                <option value="B2B SaaS">B2B SaaS</option>
                <option value="Professional Services">Professional Services</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Retail">Retail</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Finance">Finance</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Annual Revenue
              </label>
              <input
                type="number"
                value={formData.annual_revenue}
                onChange={(e) => setFormData(prev => ({ ...prev, annual_revenue: e.target.value }))}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="5000000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Employee Count
              </label>
              <input
                type="number"
                value={formData.employee_count}
                onChange={(e) => setFormData(prev => ({ ...prev, employee_count: e.target.value }))}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="50"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Contact'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Loading component for Suspense fallback
function LoadingForm() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white">Loading form...</p>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function CreateProspectPage() {
  return (
    <Suspense fallback={<LoadingForm />}>
      <CreateProspectForm />
    </Suspense>
  )
}