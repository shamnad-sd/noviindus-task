import OTP from '@/components/Otp'
import React from 'react'
import { generateMetadata as generateMetadataFromLib } from "@/lib/generateMetadata";

const VerifyOTPPage = () => {
  return (
    <div>
      <OTP/>
    </div>
  )
}

export default VerifyOTPPage

export async function generateMetadata() {
  const aboutSEO = {
    title: 'OTP - NexLearn',
    description: 'Learn more about NexLearn and our mission to provide excellent services.',
    keywords: 'about NexLearn, company info, mission',
    ogTitle: 'OTP - NexLearn',
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
    twitterTitle: 'OTP - NexLearn',
    twitterDescription: 'Learn more OTP NexLearn.',
    twitterImages: ['/logo.png'],
  };

  return generateMetadataFromLib(aboutSEO, false, "/auth/verify-otp");
}

