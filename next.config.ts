import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/openai-approval/:path*",
        headers: [
          {
            // Plan Task 4: direct-link approval assets should not be indexed.
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "toolbox.marketingtools.apple.com",
      },
    ],
  },
};

export default nextConfig;
