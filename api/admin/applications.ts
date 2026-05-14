import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { jwtVerify } from "jose";

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

  const url = process.env.SUPABASE_URL?.trim().replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    res.status(503).json({
      error:
        "Database not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to this Vercel project (Settings → Environment Variables), then redeploy. Use your Supabase service role key, not the anon key.",
    });
    return;
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from("shipyard_applications")
    .select("id, created_at, payload")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error(error);
    res.status(500).json({ error: "Could not load applications" });
    return;
  }

  res.status(200).json({ rows: data ?? [] });
}
