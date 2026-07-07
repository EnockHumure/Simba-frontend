import { NextRequest, NextResponse } from "next/server";

const fallback = () =>
  NextResponse.json({ session: null, user: null }, { status: 200 });

async function getHandler() {
  try {
    const { getAuth } = await import("@/lib/auth");
    const { toNextJsHandler } = await import("better-auth/next-js");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return toNextJsHandler(getAuth()) as any;
  } catch (err) {
    console.error("[auth] init error:", err);
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    return (await (await getHandler())?.GET(req)) ?? fallback();
  } catch (err) {
    console.error("[auth] GET error:", err);
    return fallback();
  }
}

export async function POST(req: NextRequest) {
  try {
    return (await (await getHandler())?.POST(req)) ?? fallback();
  } catch (err) {
    console.error("[auth] POST error:", err);
    return fallback();
  }
}
