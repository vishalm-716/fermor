import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  // Turbopack is only meaningful for `next dev`; keep it off in build to
  // avoid any Windows symlinking quirks in the Vercel build output.
  turbopack: {},
};

export default nextConfig;
