import ResultsContent from '@/components/Results'
import React, { Suspense } from 'react'

const ResultsPage = () => {
  return (
    <div>
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
    </div>
  )
}

export default ResultsPage
