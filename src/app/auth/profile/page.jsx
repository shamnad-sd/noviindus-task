import Profile from '@/components/Profile'
import React from 'react'
import { generateMetadata as generateMetadataFromLib } from "@/lib/generateMetadata";

const ProfilePage = () => {
  return (
    <div>
      <Profile/>
    </div>
  )
}

export default ProfilePage


export async function generateMetadata() {
  const aboutSEO = {
    title: 'Profile - NexLearn',
    description: 'Learn more about NexLearn and our mission to provide excellent services.',
    keywords: 'about NexLearn, company info, mission',
    ogTitle: 'Profile - NexLearn',
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
    twitterTitle: 'Profile - NexLearn',
    twitterDescription: 'Learn more Profile NexLearn.',
    twitterImages: ['/logo.png'],
  };

  return generateMetadataFromLib(aboutSEO, false, "/auth/profile");
}