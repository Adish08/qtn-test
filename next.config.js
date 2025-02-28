// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'export',  // Enable static exports
    images: {
      unoptimized: true  // Required for static export
    },
    // Update these when deploying to GitHub Pages
    basePath: process.env.NODE_ENV === 'production' ? '/legrand-quotation' : '',
    assetPrefix: process.env.NODE_ENV === 'production' ? '/legrand-quotation/' : '',
  };
  
  module.exports = nextConfig;