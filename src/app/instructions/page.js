// app/instructions/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function InstructionsPage() {
  const router = useRouter();
  const { isAuthenticated, checkAuth, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const authenticated = checkAuth();
    if (!authenticated) {
      router.push('/auth/login');
    }
  }, [checkAuth, router]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      logout();
      toast.success('Logged out successfully');
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      logout();
      router.push('/auth/login');
    }
  };

  const handleStartTest = () => {
    toast.success('Starting exam...');
    router.push('/exam');
  };

  if (!mounted || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#1B5A7E] rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">NexLearn</h1>
                <p className="text-xs text-[#1B5A7E]">futuristic learning</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-[#1B5A7E] text-white rounded-lg font-semibold hover:bg-[#13465F] transition-colors shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 text-center">
              Ancient Indian History MCQ
            </h1>
          </div>

          {/* Stats Card */}
          <div className="px-8 py-6">
            <div className="bg-gradient-to-br from-[#1e2d3d] to-[#2a3f54] rounded-2xl p-6 grid grid-cols-3 gap-4 text-white shadow-xl">
              <div className="text-center border-r border-white/20">
                <p className="text-sm text-blue-200 mb-2">Total MCQ's:</p>
                <p className="text-4xl font-bold">100</p>
              </div>
              <div className="text-center border-r border-white/20">
                <p className="text-sm text-blue-200 mb-2">Total marks:</p>
                <p className="text-4xl font-bold">100</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-blue-200 mb-2">Total time:</p>
                <p className="text-4xl font-bold">90:00</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="px-8 py-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Instructions:</h2>
            <ol className="space-y-4 text-gray-700">
              <li className="flex gap-3">
                <span className="font-semibold text-gray-900 min-w-[1.5rem]">1.</span>
                <span>You have 100 minutes to complete the test.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-gray-900 min-w-[1.5rem]">2.</span>
                <span>Test consists of 100 multiple-choice q's.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-gray-900 min-w-[1.5rem]">3.</span>
                <span>You are allowed 2 retest attempts if you do not pass on the first try.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-gray-900 min-w-[1.5rem]">4.</span>
                <span>Each incorrect answer will incur a negative mark of -1/4.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-gray-900 min-w-[1.5rem]">5.</span>
                <span>Ensure you are in a quiet environment and have a stable internet connection.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-gray-900 min-w-[1.5rem]">6.</span>
                <span>Keep an eye on the timer, and try to answer all questions within the given time.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-gray-900 min-w-[1.5rem]">7.</span>
                <span>Do not use any external resources such as dictionaries, websites, or assistance.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-gray-900 min-w-[1.5rem]">8.</span>
                <span>Complete the test honestly to accurately assess your proficiency level.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-gray-900 min-w-[1.5rem]">9.</span>
                <span>Check answers before submitting.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-gray-900 min-w-[1.5rem]">10.</span>
                <span>Your test results will be displayed immediately after submission, indicating whether you have passed or need to retake the test.</span>
              </li>
            </ol>
          </div>

          {/* Start Test Button */}
          <div className="px-8 py-8 flex justify-center">
            <button
              onClick={handleStartTest}
              className="px-12 py-4 bg-[#1B5A7E] text-white rounded-xl font-semibold text-lg hover:bg-[#13465F] transition-all hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Start Test
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}