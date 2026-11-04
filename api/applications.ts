import type { VercelRequest, VercelResponse } from "@vercel/node";

import { applicationSchema, FIELD_LABELS, stripForStorage } from "./lib/applicationSchema.js";
import { getSupabaseServerClient, supabaseFetchHint } from "./lib/supabaseServer.js";

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
      const issues = parsed.error.flatten().fieldErrors as Record<string, string[] | undefined>;
      const fields = Object.keys(issues);
      const sent = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
      // Answers absent entirely mean the page predates a form update (it never asked for them).
      const missing = fields.filter((f) => sent[f] === undefined);
      const names = fields.map((f) => FIELD_LABELS[f] ?? f);
      res.status(400).json({
        error: "Some answers need another look.",
        detail: `Please check: ${names.join(", ")}.`,
        hint: missing.length
          ? "The application form was updated after you opened this page. Reload the page to see the new questions, then submit again."
          : undefined,
        issues,
      });
      return;
    }

    const config = getSupabaseServerClient();
    if (!config.ok) {
      res.status(config.status).json({
        error: "Applications storage is not configured.",
        detail: config.detail,
        hint: config.hint,
      });
      return;
    }

    const payload = stripForStorage(parsed.data);

    const { error } = await config.client.from("shipyard_applications").insert({
      payload,
    });

    if (error) {
      console.error("Supabase insert:", error.code, error.message, error.details);
      res.status(500).json({
        error: "Could not save application",
        detail: error.message,
        hint: supabaseFetchHint(error.message),
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
