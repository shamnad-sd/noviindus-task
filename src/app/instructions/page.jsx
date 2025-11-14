import Instructions from '@/components/Instructions'
import React from 'react'
import { generateMetadata as generateMetadataFromLib } from "@/lib/generateMetadata";
const InstructionsPage = () => {
  return (
    <div>
      <Instructions/>
    </div>
  )
}

export default InstructionsPage


export async function generateMetadata() {
  const aboutSEO = {
    title: 'Instructions - NexLearn',
    description: 'Learn more about NexLearn and our mission to provide excellent services.',
    keywords: 'about NexLearn, company info, mission',
    ogTitle: 'Instructions - NexLearn',
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
    twitterTitle: 'Instructions - NexLearn',
    twitterDescription: 'Learn more Instructions NexLearn.',
    twitterImages: ['/logo.png'],
  };

  return generateMetadataFromLib(aboutSEO, false, "/instructions");
}