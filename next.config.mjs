/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && supabaseUrl !== 'https://example.supabase.co') {
      return [
        {
          source: '/api/proxy/supabase/:path*',
          destination: `${supabaseUrl}/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
