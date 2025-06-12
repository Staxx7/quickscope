import EnhancedAdminLayout from '@/components/AdminLayout'

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <EnhancedAdminLayout>
      {children}
    </EnhancedAdminLayout>
  )
}
