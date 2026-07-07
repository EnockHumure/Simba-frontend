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
    const proxyRoutes = [
      "products", "categories", "orders", "reviews", "banners",
      "branches", "cart", "wishlist", "users", "blogs", "contact",
      "settings", "upload", "search", "admin",
    ];
    return [
      ...proxyRoutes.map((route) => ({
        source: `/api/${route}/:path*`,
        destination: `${apiBaseUrl}/api/${route}/:path*`,
      })),
      { source: "/uploads/:path*", destination: `${apiBaseUrl}/uploads/:path*` },
    ];
  },
};

export default withNextIntl(nextConfig);
