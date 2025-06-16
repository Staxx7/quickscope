'use client'
import { usePathname } from 'next/navigation'
import AdminLayout from '@/app/components/AdminLayout'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Determine current page based on pathname
  const getCurrentPage = () => {
    if (pathname === '/dashboard') return 'Account Workflow'
    if (pathname === '/dashboard/contacts') return 'Contact Management'
    if (pathname === '/dashboard/call-transcripts') return 'Call Transcripts'
    if (pathname === '/dashboard/data-extraction') return 'Data Extraction'
    if (pathname === '/dashboard/advanced-analysis') return 'Financial Analysis'
    if (pathname === '/dashboard/report-generation') return 'Report Generation'
    return 'Dashboard'
  }
  
  return <AdminLayout currentPage={getCurrentPage()}>{children}</AdminLayout>
}