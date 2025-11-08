/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Enable Turbopack explicitly
  turbopack: {},

  // ✅ TypeScript and Images configs still valid
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  // ❌ Removed eslint + webpack (Turbopack doesn't use it)
  // If you still need the "ignored files" logic, move it to `.gitignore`
  // or configure it via your IDE watcher instead.
};

export default nextConfig;
