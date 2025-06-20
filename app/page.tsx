'use client';

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    // Redirect to connect page
    window.location.href = '/connect';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-white">Redirecting...</div>
    </div>
  );
}
