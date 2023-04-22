/** @type {import('next').NextConfig} */
const nextConfig = {
  // TODO: Needs to be enabled when useSWR is fixed
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
