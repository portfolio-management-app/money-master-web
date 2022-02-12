/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}
const withOptimizedImages = require('next-optimized-images');

module.exports = nextConfig

module.exports = withOptimizedImages({
  /* config for next-optimized-images */

  // your config for other plugins or the general next.js here...
});