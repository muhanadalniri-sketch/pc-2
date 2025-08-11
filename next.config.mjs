import withPWA from 'next-pwa';
import runtimeCaching from 'next-pwa/cache.js';

const isProd = process.env.NODE_ENV === 'production';

const pwa = withPWA({
  dest: 'public',
  disable: !isProd,
  register: true,
  skipWaiting: true,
  sw: 'service-worker.js',
  runtimeCaching: [
    ...runtimeCaching,
    {
      urlPattern: ({url}) => url.origin === self.location.origin && url.pathname.startsWith('/icons/'),
      handler: 'CacheFirst',
      options: { cacheName: 'icon-assets', expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 365 } }
    },
    {
      urlPattern: ({url}) => url.origin === self.location.origin && (url.pathname.endsWith('.woff2') || url.pathname.endsWith('.woff') || url.pathname.endsWith('.ttf')),
      handler: 'CacheFirst',
      options: { cacheName: 'font-assets', expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 } }
    },
    {
      urlPattern: ({request}) => request.destination === 'image',
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'images', expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 } }
    },
  ],
  workboxOptions: {
    navigateFallback: '/offline',
    globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,txt,json}']
  }
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { appDir: true },
  images: { unoptimized: true }, // keep it simple for offline
};

export default pwa(nextConfig);
