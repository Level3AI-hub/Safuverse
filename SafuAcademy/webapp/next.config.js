/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
      },
    ],
  },
  // Turbopack configuration - set root to silence warning
  turbopack: {
    root: '..',
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  // Transpile @reown packages
  transpilePackages: ['@reown/appkit', '@reown/appkit-controllers', '@reown/appkit-utils'],
};

module.exports = nextConfig;
