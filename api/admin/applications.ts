import type { VercelRequest, VercelResponse } from "@vercel/node";
import { jwtVerify } from "jose";

import { runSupabaseQuery } from "../lib/supabaseServer.js";

const COOKIE_NAME = "shipyard_admin";

function getCookie(req: VercelRequest, name: string): string | undefined {
  const raw = req.headers.cookie;
  if (!raw) return undefined;
  for (const part of raw.split(";")) {
    const p = part.trim();
    if (p.startsWith(`${name}=`)) return p.slice(name.length + 1);
  }
  return undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const token = getCookie(req, COOKIE_NAME);
  const secret = process.env.APPLY_ADMIN_SECRET;
  if (!token || !secret) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
  } catch {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const result = await runSupabaseQuery((client) =>
    client
      .from("shipyard_applications")
      .select("id, created_at, payload")
      .order("created_at", { ascending: false })
      .limit(500),
  );

  if (!result.ok) {
    res.status(result.status).json({
      error: result.status === 503 ? result.error : "Could not load applications",
      detail: result.detail,
      hint: result.hint,
    });
    return;
  }

  res.status(200).json({ rows: result.data ?? [] });
}
