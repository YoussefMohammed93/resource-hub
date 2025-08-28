import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "creativeresources.net",
      },
      {
        protocol: "https",
        hostname: "cdn.worldvectorlogo.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "stockaty.virs.tech",
      },
      {
        protocol: "https",
        hostname: "shutterstock.com",
      },
      {
        protocol: "https",
        hostname: "www.shutterstock.com",
      },
      {
        protocol: "https",
        hostname: "freepik.com",
      },
      {
        protocol: "https",
        hostname: "www.freepik.com",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.freepik.com",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "pexels.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "www.flaticon.com",
      },
      {
        protocol: "https",
        hostname: "flaticon.com",
      },
      {
        protocol: "https",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
