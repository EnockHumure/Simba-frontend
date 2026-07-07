import { getAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let handler: any = null;

function getHandler() {
  if (!handler) {
    try {
      handler = toNextJsHandler(getAuth());
    } catch (err) {
      console.error("[auth] Failed to initialize auth handler:", err);
      return null;
    }
  }
  return handler;
}

const fallback = () =>
  NextResponse.json({ session: null, user: null }, { status: 200 });

export async function GET(req: NextRequest) {
  try {
    return (await getHandler()?.GET(req)) ?? fallback();
  } catch {
    return fallback();
  }
}

export async function POST(req: NextRequest) {
  try {
    return (await getHandler()?.POST(req)) ?? fallback();
  } catch {
    return fallback();
  }
}
