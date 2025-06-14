'use client';

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    // Check for authentication status
    const checkAuthAndRedirect = () => {
      // Check for various authentication indicators
      const hasQBToken = localStorage.getItem('qb_access_token');
      const hasSession = sessionStorage.getItem('authenticated');
      const hasCookie = document.cookie.includes('qb_session');
      const isAuthenticated = hasQBToken || hasSession || hasCookie;

      if (isAuthenticated) {
        // Redirect authenticated users to the dashboard
        window.location.href = '/dashboard';
      } else {
        // Redirect unauthenticated users to connect page
        window.location.href = '/connect';
      }
    };

    // Small delay to ensure DOM is ready
    setTimeout(checkAuthAndRedirect, 100);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <div className="text-white text-lg">Loading QuickScope...</div>
        <div className="text-slate-400 text-sm mt-2">Checking authentication status</div>
      </div>
    </div>
  );
}
