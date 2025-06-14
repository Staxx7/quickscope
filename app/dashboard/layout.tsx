'use client'

import AdminLayout from '@/app/components/AdminLayout'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}