import type { VercelRequest, VercelResponse } from "@vercel/node";

function cookieFlags(): string {
  return Boolean(process.env.VERCEL) ? "Secure; " : "";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  res.setHeader(
    "Set-Cookie",
    `shipyard_admin=; Path=/; HttpOnly; ${cookieFlags()}SameSite=Lax; Max-Age=0`,
  );
  res.status(200).json({ ok: true });
}
