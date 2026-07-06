import { betterAuth } from "better-auth";

// Frontend auth uses the SAME database as backend
// Better-auth will create its own tables (session, account, verification)
// alongside your existing Product, User, Order tables
export const auth = betterAuth({
  database: {
    url: process.env.DATABASE_URL!,
    type: "postgres",
  },
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "https://simba-frontend-world.vercel.app",
    "https://simba-frontend-world-pahagia18-enockhumures-projects.vercel.app",
  ],
});
