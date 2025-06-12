import React from 'react';
import AdminLayout from '../components/AdminLayout';
import AccountWorkflowDashboard from '../components/AccountWorkflowDashboard';

export default function AdminPage() {
  return (
    <AdminLayout currentPage="Account Workflow Dashboard">
      <AccountWorkflowDashboard />
    </AdminLayout>
  );
}
