/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
  
    // Разрешаем загрузку внешних изображений (если backend будет давать URL)
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
      ],
    },
  
    // Прокси /api → твой backend (чтобы DEV работал как Vite)
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.API_BASE}/:path*`,
        },
      ];
    },
  };
  
  module.exports = nextConfig;