import type { NextConfig } from 'next';
import path from 'node:path';

const config: NextConfig = {
  poweredByHeader: false,
  ...(process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true' && { devIndicators: false as const }),
  // Keep the separately configured local staging preview out of the emulator cache.
  distDir: process.env.BARRELBOOK_WEB_LOCAL_STAGING === 'true' ? '.next-staging' : '.next',
  turbopack: { root: path.resolve(__dirname) },
  images: { unoptimized: true },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'no-referrer' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
    ] }];
  },
};
export default config;
