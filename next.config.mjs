/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://nexlearn.noviindusdemosites.in/:path*',
      },
    ]
  },
};

export default nextConfig;
