'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import Image from 'next/image';

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
        <div className="inline-flex items-center justify-center mb-4">
          <div className="w-60 h-40 flex items-center justify-center">
            <Image
              src="/logo-white.png" 
              alt="App Logo"
              width={200}
              height={150}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}