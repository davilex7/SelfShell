// SelfShell/apps/dashboard/next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@mi-dashboard/ui', '@mi-dashboard/series-tracker-widget'],
  typescript: { ignoreBuildErrors: true }, // Si lo necesitas
  eslint: { ignoreDuringBuilds: true },   // Si lo necesitas
  async rewrites() {
    return [
      {
        source: '/api/series-tracker/:path*',
        destination: 'http://localhost:3001/api/:path*', // Puerto de series-tracker-app
      },
      {
        source: '/api/mangas-tracker/:path*',
        destination: 'http://localhost:3000/api/:path*', // Puerto de mangas-tracker-app (ejemplo)
      },
    ];
  },
};
export default nextConfig;
