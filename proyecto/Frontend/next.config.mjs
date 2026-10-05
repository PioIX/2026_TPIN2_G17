/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // ... conservá las otras configuraciones que ya tengas
};

export default nextConfig;