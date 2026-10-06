import { NextResponse } from "next/server";

/**
 * Early-access list.
 *
 * This is an in-memory store so the homepage is honest about what it does:
 * it validates, de-duplicates and confirms, but it does not pretend to have a
 * database behind it. Swapping this Map for Postgres/KV is a one-file change.
 */

type Entry = { email: string; joinedAt: string; source: string };

const subscribers = new Map<string, Entry>();
const EMAIL_PATTERN = /^[^@\s]+@[^@\s.]+\.[^@\s]{2,}$/;

function badRequest(message: string) {
  return NextResponse.json({ ok: false, message }, { status: 400 });
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return badRequest("That request didn’t arrive in one piece. Please try again.");
  }

  const body = (payload ?? {}) as { email?: unknown; source?: unknown; company?: unknown };

  // Honeypot: real people never fill this in.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true, status: "added", message: "You’re on the list." });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email) return badRequest("Enter your email so we know where to send the invite.");
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return badRequest("That email doesn’t look right — mind checking for a typo?");
  }

  if (subscribers.has(email)) {
    return NextResponse.json({
      ok: true,
      status: "already",
      message: "You’re already on the list. We haven’t forgotten you.",
    });
  }

  const source = typeof body.source === "string" ? body.source.slice(0, 40) : "homepage";
  subscribers.set(email, { email, joinedAt: new Date().toISOString(), source });

  return NextResponse.json({
    ok: true,
    status: "added",
    message: "You’re on the list.",
    total: subscribers.size,
  });
}

export async function GET() {
  return NextResponse.json({ ok: true, total: subscribers.size });
}
