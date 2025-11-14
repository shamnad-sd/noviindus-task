
import Login from '@/components/Login'
import React from 'react'
import { generateMetadata as generateMetadataFromLib } from "@/lib/generateMetadata";

const LoginPage = () => {
  return (
    <div>
      <Login/>
    </div>
  )
}

export default LoginPage


export async function generateMetadata() {
  const aboutSEO = {
    title: 'NexLearn - Login',
    description: 'Learn more about NexLearn and our mission to provide excellent services.',
    keywords: 'about NexLearn, company info, mission',
    ogTitle: 'Login - NexLearn',
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
    twitterTitle: 'Login - NexLearn',
    twitterDescription: 'Learn more Login NexLearn.',
    twitterImages: ['/logo.png'],
  };

  return generateMetadataFromLib(aboutSEO, false, "/auth/login");
}

