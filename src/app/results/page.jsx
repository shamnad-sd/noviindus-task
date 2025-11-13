'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { authAPI } from '@/lib/api';

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logout } = useAuthStore();
  
  // Mock result data - In real app, fetch from API using exam_history_id
  const [results, setResults] = useState(null);
  
  useEffect(() => {
    const examHistoryId = searchParams.get('id');
    
    // Mock data - Replace with actual API call
    const mockResults = {
      exam_history_id: examHistoryId,
      score: 100,
      total_marks: 100,
      correct: 3,
      wrong: 1,
      not_attended: 96,
      submitted_at: new Date().toISOString(),
    };
    
    setResults(mockResults);
  }, [searchParams]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      logout();
      router.push('/auth/login');
    }
  };

  const handleDone = () => {
    router.push('/instructions');
  };

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1B5A7E] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
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
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-[#1B5A7E] text-white rounded-lg font-semibold hover:bg-[#13465F] transition-colors shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Results Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Score Display */}
          <div className="bg-gradient-to-br from-[#1B5A7E] to-[#2a7ca8] p-8 text-center">
            <p className="text-blue-100 text-lg mb-2">Marks Obtained:</p>
            <h1 className="text-6xl font-bold text-white mb-2">
              {results.score} / {results.total_marks}
            </h1>
          </div>

          {/* Statistics */}
          <div className="p-8 space-y-4">
            {/* Total Questions */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg font-medium text-gray-700">Total Questions:</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {results.correct + results.wrong + results.not_attended}
              </span>
            </div>

            {/* Correct Answers */}
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg font-medium text-gray-700">Correct Answers:</span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {String(results.correct).padStart(3, '0')}
              </span>
            </div>

            {/* Incorrect Answers */}
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg font-medium text-gray-700">Incorrect Answers:</span>
              </div>
              <span className="text-2xl font-bold text-red-600">
                {String(results.wrong).padStart(3, '0')}
              </span>
            </div>

            {/* Not Attended */}
            <div className="flex items-center justify-between p-4 bg-gray-100 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg font-medium text-gray-700">Not Attended Questions:</span>
              </div>
              <span className="text-2xl font-bold text-gray-600">
                {String(results.not_attended).padStart(3, '0')}
              </span>
            </div>

            {/* Done Button */}
            <button
              onClick={handleDone}
              className="w-full mt-6 py-4 bg-[#1B5A7E] text-white rounded-xl font-semibold text-lg hover:bg-[#13465F] transition-all hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Done
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1B5A7E] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}