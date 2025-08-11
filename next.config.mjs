import withPWA from 'next-pwa';
import baseRuntimeCaching from 'next-pwa/cache.js'; // ✅ الامتداد مهم

const isProd = process.env.NODE_ENV === 'production';

const withPWAFunc = withPWA({
  dest: 'public',
  disable: !isProd,
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    ...baseRuntimeCaching,
    {
      urlPattern: ({ url }) =>
        url.origin === self.location.origin && url.pathname.startsWith('/icons/'),
      handler: 'CacheFirst',
      options: {
        cacheName: 'icon-assets',
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 365 },
      },
    },
    {
      urlPattern: ({ url }) =>
        url.origin === self.location.origin &&
        (url.pathname.endsWith('.woff2') ||
          url.pathname.endsWith('.woff') ||
          url.pathname.endsWith('.ttf')),
      handler: 'CacheFirst',
      options: {
        cacheName: 'font-assets',
        expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
      },
    },
    {
      urlPattern: ({ request }) => request.destination === 'image',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'images',
        expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
  ],
  workboxOptions: {
    navigateFallback: '/offline',
    globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,txt,json}'],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  // لا تحط experimental.appDir
};

export default withPWAFunc(nextConfig);
