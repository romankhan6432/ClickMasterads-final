import type { NextConfig } from "next";
import { SiBitcoin, SiTether, SiBinance } from 'react-icons/si';

const nextConfig: NextConfig = {
  // Remove i18n config as it's not needed with App Router
  trailingSlash: true,
  images: {
    domains: [
      'flagcdn.com',
      'upload.wikimedia.org', 
      'images.remotePatterns',
      'play-lh.googleusercontent.com',
      's2.coinmarketcap.com',
      'images.remotePatterns',
      'cryptologos.cc',
      'assets.coingecko.com',
      'api.coingecko.com',
      "images.remotePatterns",
      "static.thenounproject.com"
    ],
  },
  reactStrictMode: false,
  swcMinify: true,
  // Disable x-powered-by header for security
  poweredByHeader: false,
};

export default nextConfig;
