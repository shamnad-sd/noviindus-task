import { frontendUrl } from "@/utils/urls";

export function generateMetadata(seoData, nofollow, path) {
  const sanitizedPath = path?.replace("/index", "");
  const canonicalUrl = `${frontendUrl}${sanitizedPath}`;

  const robotsDirective = nofollow
    ? { index: false, follow: false }
    : { index: true, follow: true };

  return {
    title: seoData?.title || 'NexLearn',
    description: seoData?.description || 'NexLearn',
    keywords: seoData?.keywords || '',
    metadataBase: new URL(frontendUrl),
    icons: {
      icon: [
        { url: '/logo.png', sizes: '16x16', type: 'image/png' },
        { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      other: [
        { rel: 'manifest', url: '/' },
      ],
    },
    themeColor: '#63af51',
    alternates: {
      canonical: canonicalUrl,
    },
    robots: robotsDirective,
    openGraph: {
      title: seoData?.ogTitle || seoData?.title || 'NexLearn',
      description: seoData?.ogDescription || seoData?.description || 'NexLearn',
      url: canonicalUrl,
      siteName: seoData?.siteName || 'NexLearn',
      locale: seoData?.locale || 'en_US',
      type: seoData?.type || 'website',
      modifiedTime: seoData?.modifiedTime || '',
      images: seoData?.images || [
        {
          url: '/logo.png',
          width: 479,
          height: 482,
          type: 'image/png',
          alt: 'NexLearn',
        },
      ],
    },
    twitter: {
      card: seoData?.twitterCard || 'summary_large_image',
      title: seoData?.twitterTitle || seoData?.title || 'NexLearn',
      description: seoData?.twitterDescription || seoData?.description || 'NexLearn',
      images: seoData?.twitterImages || ['/logo.png'],
    },
  };
}