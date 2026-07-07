import { betterAuth } from "better-auth";

function createAuth() {
  return betterAuth({
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
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const auth: any = new Proxy({} as ReturnType<typeof createAuth>, {
  get(_target, prop) {
    return (createAuth() as any)[prop];
  },
});
