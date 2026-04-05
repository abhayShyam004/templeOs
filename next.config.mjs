/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    webpackBuildWorker: false,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Avoid stale PackFile cache corruption in dev after forced .next cleanup.
      config.cache = false;
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  }
};

export default nextConfig;
