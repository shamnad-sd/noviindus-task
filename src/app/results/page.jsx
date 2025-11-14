import ResultsContent from '@/components/Results'
import { generateMetadata as generateMetadataFromLib } from "@/lib/generateMetadata";
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


export async function generateMetadata() {
  const aboutSEO = {
    title: 'Results - NexLearn',
    description: 'Learn more about NexLearn and our mission to provide excellent services.',
    keywords: 'about NexLearn, company info, mission',
    ogTitle: 'Results - NexLearn',
    ogDescription: 'Learn more about NexLearn and our mission.',
    siteName: 'NexLearn',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 479,
        height: 482,
        type: 'image/png',
        alt: 'NexLearn About',
      },
    ],
    twitterCard: 'summary_large_image',
    twitterTitle: 'Results - NexLearn',
    twitterDescription: 'Learn more Results NexLearn.',
    twitterImages: ['/logo.png'],
  };

  return generateMetadataFromLib(aboutSEO, false, "/results");
}