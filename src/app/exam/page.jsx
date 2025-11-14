import Exam from '@/components/Exam'
import React from 'react'
import { generateMetadata as generateMetadataFromLib } from "@/lib/generateMetadata";
const ExamPage = () => {
  return (
    <div>
      <Exam/>
    </div>
  )
}

export default ExamPage


export async function generateMetadata() {
  const aboutSEO = {
    title: 'Exam - NexLearn',
    description: 'Learn more about NexLearn and our mission to provide excellent services.',
    keywords: 'about NexLearn, company info, mission',
    ogTitle: 'Exam - NexLearn',
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
    twitterTitle: 'Exam - NexLearn',
    twitterDescription: 'Learn more Exam NexLearn.',
    twitterImages: ['/logo.png'],
  };

  return generateMetadataFromLib(aboutSEO, false, "/exam");
}