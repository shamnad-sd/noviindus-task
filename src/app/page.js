'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export default function Home() {
  const router = useRouter();
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    const isAuthenticated = checkAuth();
    
    if (isAuthenticated) {
      router.push('/instructions');
    } else {
      router.push('/auth/login');
    }
  }, [checkAuth, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#0f1e33] to-[#1a2942]">
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg animate-pulse">
            <svg className="w-10 h-10 text-[#1B5A7E]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">NexLearn</h1>
        <p className="text-blue-200">Loading...</p>
      </div>
    </div>
  );
}