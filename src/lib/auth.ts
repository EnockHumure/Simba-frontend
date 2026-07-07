import { betterAuth, type BetterAuthOptions } from "better-auth";

type AuthInstance = ReturnType<typeof betterAuth<BetterAuthOptions>>;

let _auth: AuthInstance | null = null;

export function getAuth(): AuthInstance {
  if (!_auth) {
    _auth = betterAuth({
      database: {
        url: process.env.DATABASE_URL!,
        type: "postgres",
      },
      emailAndPassword: { enabled: true },
      secret: process.env.BETTER_AUTH_SECRET!,
      trustedOrigins: [
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "https://simba-frontend-world.vercel.app",
        "https://simba-frontend-world-pahagia18-enockhumures-projects.vercel.app",
      ],
    }) as unknown as AuthInstance;
  }
  return _auth;
}
