'use client'

import { CompanyProvider } from '@/app/contexts/CompanyContext';
import AdminLayout from '@/app/components/AdminLayout';

export default function RootAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CompanyProvider>
      <AdminLayout>
        {children}
      </AdminLayout>
    </CompanyProvider>
  )
}