import type { VercelRequest, VercelResponse } from "@vercel/node";
import { SignJWT } from "jose";

const COOKIE_NAME = "shipyard_admin";

function cookieFlags(): string {
  return Boolean(process.env.VERCEL) ? "Secure; " : "";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const expected = process.env.APPLY_ADMIN_PASSWORD;
  const secret = process.env.APPLY_ADMIN_SECRET;
  if (!expected || !secret) {
    res.status(503).json({ error: "Admin auth is not configured on the server." });
    return;
  }

  const body = req.body as { password?: string } | undefined;
  const password = typeof body?.password === "string" ? body.password : "";

  if (password !== expected) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  const key = new TextEncoder().encode(secret);
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("8h")
    .sign(key);

  const maxAge = 8 * 3600;
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${token}; Path=/; HttpOnly; ${cookieFlags()}SameSite=Lax; Max-Age=${maxAge}`,
  );

  res.status(200).json({ ok: true });
}
