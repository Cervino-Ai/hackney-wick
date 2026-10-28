import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/cafes",
        destination: "/cafes-and-coffee-shops",
        statusCode: 301,
      },
      {
        source: "/cafes/:slug",
        destination: "/cafes-and-coffee-shops/:slug",
        statusCode: 301,
      },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
