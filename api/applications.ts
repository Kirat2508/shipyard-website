import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

import { applicationSchema, stripForStorage } from "../src/shared/applicationSchema";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const raw = req.body;
    const body: unknown =
      typeof raw === "string" ? (JSON.parse(raw) as unknown) : raw;

    const parsed = applicationSchema.safeParse(body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Invalid form data",
        issues: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      res.status(503).json({
        error:
          "Applications storage is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.",
      });
      return;
    }

    const supabase = createClient(url, key);
    const payload = stripForStorage(parsed.data);

    const { error } = await supabase.from("shipyard_applications").insert({
      payload,
    });

    if (error) {
      console.error("Supabase insert:", error);
      res.status(500).json({ error: "Could not save application" });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
}
