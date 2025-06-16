'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ContactEditModal from '@/app/components/ContactEditModal'
import { LoadingState, NoDataError } from '@/app/components/ErrorStates'
import { 
  Users, 
  Search, 
  Filter, 
  Edit2, 
  Mail, 
  Phone, 
  Building2,
  Plus,
  RefreshCw,
  Trash2,
  Power
} from 'lucide-react'

interface Contact {
  id: string
  company_name: string
  contact_name?: string
  email: string
  phone?: string
  industry?: string
  company_id?: string
  workflow_stage?: string
  created_at: string
  updated_at: string
}

export default function ContactsPage() {
  const router = useRouter()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterIndustry, setFilterIndustry] = useState('all')
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [deletingContactId, setDeletingContactId] = useState<string | null>(null)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/admin/prospects')
      if (!response.ok) throw new Error('Failed to fetch contacts')
      
      const data = await response.json()
      setContacts(data.prospects || [])
    } catch (err) {
      console.error('Error fetching contacts:', err)
      setError(err instanceof Error ? err.message : 'Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateContact = async (updatedContact: Contact) => {
    try {
      const response = await fetch('/api/contacts/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContact)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update contact')
      }

      // Refresh the contacts list
      await fetchContacts()
    } catch (err) {
      console.error('Error updating contact:', err)
      throw err
    }
  }

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return
    
    setDeletingContactId(contactId)
    try {
      const response = await fetch(`/api/admin/prospects/${contactId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete contact')
      }

      // Refresh the contacts list
      await fetchContacts()
    } catch (err) {
      console.error('Error deleting contact:', err)
      alert('Failed to delete contact: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setDeletingContactId(null)
    }
  }

  const handleDisconnectQuickBooks = async (contactId: string) => {
    if (!confirm('Are you sure you want to disconnect QuickBooks for this contact?')) return
    
    try {
      const response = await fetch(`/api/admin/prospects/${contactId}/disconnect`, {
        method: 'POST'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to disconnect QuickBooks')
      }

      // Refresh the contacts list
      await fetchContacts()
    } catch (err) {
      console.error('Error disconnecting QuickBooks:', err)
      alert('Failed to disconnect QuickBooks: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.contact_name && contact.contact_name.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesIndustry = filterIndustry === 'all' || contact.industry === filterIndustry
    
    return matchesSearch && matchesIndustry
  })

  const industries = ['all', ...Array.from(new Set(contacts.map(c => c.industry).filter(Boolean)))]

  if (loading) {
    return <LoadingState message="Loading contacts..." />
  }

  if (error) {
    return <NoDataError message={error} onRetry={fetchContacts} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Contact Management</h1>
          <p className="text-slate-400 mt-1">Manage your connected company contacts</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchContacts}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => router.push('/admin/prospects/create')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="text-slate-400 w-5 h-5" />
            <select
              value={filterIndustry}
              onChange={(e) => setFilterIndustry(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {industries.map(industry => (
                <option key={industry} value={industry}>
                  {industry === 'all' ? 'All Industries' : industry}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{contact.company_name}</h3>
                  {contact.industry && (
                    <span className="text-xs text-slate-400">{contact.industry}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setEditingContact(contact)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  title="Edit contact"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {contact.company_id && (
                  <button
                    onClick={() => handleDisconnectQuickBooks(contact.id)}
                    className="p-2 text-orange-400 hover:text-orange-300 hover:bg-orange-900/20 rounded-lg transition-colors"
                    title="Disconnect QuickBooks"
                  >
                    <Power className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteContact(contact.id)}
                  disabled={deletingContactId === contact.id}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete contact"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {contact.contact_name && (
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-300">{contact.contact_name}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-slate-500" />
                <a href={`mailto:${contact.email}`} className="text-blue-400 hover:text-blue-300">
                  {contact.email}
                </a>
              </div>
              {contact.phone && (
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <a href={`tel:${contact.phone}`} className="text-slate-300 hover:text-white">
                    {contact.phone}
                  </a>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Added {new Date(contact.created_at).toLocaleDateString()}
                </span>
                {contact.company_id && (
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                    QB Connected
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No contacts found matching your criteria</p>
        </div>
      )}

      {/* Edit Modal */}
      {editingContact && (
        <ContactEditModal
          contact={editingContact}
          isOpen={!!editingContact}
          onClose={() => setEditingContact(null)}
          onSave={handleUpdateContact}
        />
      )}
    </div>
  )
}