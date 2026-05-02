const path = require("path");
const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin");

// Monorepo: Next.js only auto-loads `.env*` from `apps/web`. Repo secrets live at root.
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@hotel-pricing/db", "@hotel-pricing/shared"],
  experimental: {
    serverComponentsExternalPackages: ["bcryptjs"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
};

module.exports = nextConfig;
