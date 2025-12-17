/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static export for Azure Static App
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
