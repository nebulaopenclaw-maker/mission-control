/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.externals = [...config.externals, { ws: 'ws' }];
    return config;
  },
};

module.exports = nextConfig;
