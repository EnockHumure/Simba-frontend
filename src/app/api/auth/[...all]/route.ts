import { getAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

let handler: { GET: (req: NextRequest) => Promise<NextResponse>; POST: (req: NextRequest) => Promise<NextResponse> } | null = null;

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

export async function GET(req: NextRequest) {
  try {
    const h = getHandler();
    if (!h) return NextResponse.json({ session: null, user: null }, { status: 200 });
    return h.GET(req);
  } catch (err) {
    console.error("[auth] GET error:", err);
    return NextResponse.json({ session: null, user: null }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const h = getHandler();
    if (!h) return NextResponse.json({ session: null, user: null }, { status: 200 });
    return h.POST(req);
  } catch (err) {
    console.error("[auth] POST error:", err);
    return NextResponse.json({ session: null, user: null }, { status: 200 });
  }
}
