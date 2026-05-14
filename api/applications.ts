import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

import { applicationSchema, stripForStorage } from "./lib/applicationSchema.js";

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
    let body: unknown;
    if (typeof raw === "string") {
      if (!raw.trim()) {
        res.status(400).json({ error: "Empty body" });
        return;
      }
      try {
        body = JSON.parse(raw) as unknown;
      } catch {
        res.status(400).json({ error: "Invalid JSON" });
        return;
      }
    } else {
      body = raw;
    }

    const parsed = applicationSchema.safeParse(body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Invalid form data",
        issues: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const url = process.env.SUPABASE_URL?.trim().replace(/\/$/, "");
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
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
      console.error("Supabase insert:", error.code, error.message, error.details);
      res.status(500).json({
        error: "Could not save application",
        detail: error.message,
        hint:
          error.code === "42501" || /row-level security|permission denied/i.test(error.message)
            ? "Use the legacy service_role key (not anon) as SUPABASE_SERVICE_ROLE_KEY."
            : error.code === "PGRST205" || /could not find the table/i.test(error.message)
              ? "Run the SQL migration so table shipyard_applications exists in this project."
              : undefined,
      });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    const detail = e instanceof Error ? e.message : undefined;
    res.status(500).json({ error: "Server error", detail });
  }
}
