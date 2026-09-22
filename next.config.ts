import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tduigjbrpkibnysdewhj.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/resources', destination: '/dashboard/resources', permanent: false },
      { source: '/requests', destination: '/dashboard/requests', permanent: false },
      { source: '/rides', destination: '/dashboard/rides', permanent: false },
      { source: '/skills', destination: '/dashboard/skills', permanent: false },
      { source: '/profile', destination: '/dashboard/profile', permanent: false },
      { source: '/chat', destination: '/dashboard/chat', permanent: false },
    ];
  },
};

export default nextConfig;
