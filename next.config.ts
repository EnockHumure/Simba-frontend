import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  rewrites: async () => {
    const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/api$/, "");
    return [
      {
        source: "/api/products/:path*",
        destination: `${apiBaseUrl}/api/products/:path*`,
      },
      {
        source: "/api/categories/:path*",
        destination: `${apiBaseUrl}/api/categories/:path*`,
      },
      {
        source: "/api/orders/:path*",
        destination: `${apiBaseUrl}/api/orders/:path*`,
      },
      {
        source: "/api/reviews/:path*",
        destination: `${apiBaseUrl}/api/reviews/:path*`,
      },
      {
        source: "/api/banners/:path*",
        destination: `${apiBaseUrl}/api/banners/:path*`,
      },
      {
        source: "/api/branches/:path*",
        destination: `${apiBaseUrl}/api/branches/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${apiBaseUrl}/uploads/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
