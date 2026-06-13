import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        // Whenever the frontend asks for anything starting with /api...
        source: "/api/:path*",
        // ...Vercel will secretly fetch it from your Railway backend instead!
        destination: "https://zyperr-production.up.railway.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;