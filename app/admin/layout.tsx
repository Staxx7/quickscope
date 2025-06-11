'use client'
import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900">
        {children}
      </div>
    </ErrorBoundary>
  );
}
