import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  rewrites: async () => [
    {
      source: "/api/products/:path*",
      destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products/:path*`,
    },
    {
      source: "/api/categories/:path*",
      destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/categories/:path*`,
    },
    {
      source: "/api/orders/:path*",
      destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders/:path*`,
    },
    {
      source: "/api/reviews/:path*",
      destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/reviews/:path*`,
    },
  ],
};

export default withNextIntl(nextConfig);
