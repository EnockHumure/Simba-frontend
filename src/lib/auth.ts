import { betterAuth, type BetterAuthOptions } from "better-auth";
import { Pool } from "@neondatabase/serverless";

type AuthInstance = ReturnType<typeof betterAuth<BetterAuthOptions>>;

let _auth: AuthInstance | null = null;

export function getAuth(): AuthInstance {
  if (!_auth) {
    const dbUrl = process.env.DATABASE_URL;
    const secret = process.env.BETTER_AUTH_SECRET;

    if (!dbUrl) throw new Error("Missing env: DATABASE_URL");
    if (!secret) throw new Error("Missing env: BETTER_AUTH_SECRET");

    const pool = new Pool({ connectionString: dbUrl });

    _auth = betterAuth({
      database: pool,
      emailAndPassword: { enabled: true },
      secret,
      baseURL:
        process.env.NEXT_PUBLIC_APP_URL ||
        "https://simba-frontend-world.vercel.app",
      trustedOrigins: [
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "https://simba-frontend-world.vercel.app",
        "https://simba-frontend-world-pahagia18-enockhumures-projects.vercel.app",
      ],
    }) as unknown as AuthInstance;
  }
  return _auth;
}
