import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// ---- optional email delivery (safe if key missing) ----
const resendKey = process.env.RESEND_API_KEY ?? "";
const resend = resendKey ? new Resend(resendKey) : null;

// ---- naive in-memory rate limit (per server instance) ----
const BUCKET = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000; // 1 minute
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const rec = BUCKET.get(ip);
  if (!rec || now - rec.ts > WINDOW_MS) {
    BUCKET.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count++;
  if (rec.count > MAX_PER_WINDOW) return true;
  return false;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.ip ||
    "unknown";

  if (rateLimited(ip)) {
    return new NextResponse("Too many requests. Try again later.", {
      status: 429,
    });
  }

  const form = await req.formData();
  // honeypot
  if ((form.get("company") as string)?.trim()) {
    // bot
    return NextResponse.json({ ok: true }); // pretend success
  }

  const elapsed = Number(form.get("elapsed") || 0);
  if (elapsed < 5000) {
    // likely bot (submitted too fast)
    return NextResponse.json({ ok: true });
  }

  const name = (form.get("name") as string)?.slice(0, 120) ?? "";
  const email = (form.get("email") as string)?.slice(0, 200) ?? "";
  const message = (form.get("message") as string)?.slice(0, 5000) ?? "";

  if (!name || !email || !message) {
    return new NextResponse("Missing fields.", { status: 400 });
  }

  // send
  if (resend) {
    try {
      await resend.emails.send({
        from: "Portfolio <contact@yourdomain.dev>",
        to: ["you@yourdomain.dev"],
        reply_to: email,
        subject: `New message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      });
      return NextResponse.json({ ok: true });
    } catch (e: any) {
      // fall through to console log + 200 so users aren’t blocked
      console.error("Resend error:", e?.message || e);
    }
  }

  // fallback (no key): just log and succeed
  console.log("[contact]", { ip, name, email, message });
  return NextResponse.json({ ok: true });
}
