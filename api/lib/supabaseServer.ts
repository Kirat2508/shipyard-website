import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type SupabaseConfigResult =
  | { ok: true; client: SupabaseClient; url: string }
  | { ok: false; status: 503 | 500; error: string; detail?: string; hint?: string };

function normalizeSupabaseUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  let url = raw.trim().replace(/\/$/, "");
  if (!url) return null;

  if (/^postgres(ql)?:\/\//i.test(url)) {
    return null;
  }

  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("supabase")) {
      return null;
    }
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return null;
  }
}

export function getSupabaseServerClient(): SupabaseConfigResult {
  const url = normalizeSupabaseUrl(process.env.SUPABASE_URL);
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!key) {
    return {
      ok: false,
      status: 503,
      error: "Database not configured",
      detail: "SUPABASE_SERVICE_ROLE_KEY is missing on Vercel.",
      hint: "Add the service_role key from Supabase → Settings → API (not the anon key), then redeploy.",
    };
  }

  if (!url) {
    const raw = process.env.SUPABASE_URL?.trim() ?? "";
    const looksLikeDb = /^postgres(ql)?:\/\//i.test(raw);
    return {
      ok: false,
      status: 503,
      error: "Database not configured",
      detail: looksLikeDb
        ? "SUPABASE_URL looks like a Postgres connection string."
        : "SUPABASE_URL is missing or invalid.",
      hint: looksLikeDb
        ? "Use the Project URL instead: https://YOUR-PROJECT-REF.supabase.co from Supabase → Settings → API."
        : "Set SUPABASE_URL to https://YOUR-PROJECT-REF.supabase.co on Vercel, then redeploy.",
    };
  }

  return { ok: true, client: createClient(url, key), url };
}

export function supabaseFetchHint(message: string): string | undefined {
  if (/fetch failed|ENOTFOUND|ECONNREFUSED|ETIMEDOUT|network/i.test(message)) {
    return "Vercel cannot reach Supabase. Confirm SUPABASE_URL is https://YOUR-REF.supabase.co (not a postgres:// URL), the Supabase project is not paused, and redeploy after fixing env vars.";
  }
  if (/Invalid API key|JWT/i.test(message)) {
    return "Copy the service_role key from Supabase → Settings → API into SUPABASE_SERVICE_ROLE_KEY.";
  }
  if (/could not find the table|PGRST205/i.test(message)) {
    return "Run supabase/migrations/001_shipyard_applications.sql in the Supabase SQL editor.";
  }
  if (/row-level security|permission denied|42501/i.test(message)) {
    return "Use the service_role key (not anon) as SUPABASE_SERVICE_ROLE_KEY.";
  }
  return undefined;
}

export async function runSupabaseQuery<T>(
  run: (client: SupabaseClient) => Promise<{ data: T | null; error: { message: string; code?: string } | null }>,
): Promise<
  | { ok: true; data: T | null }
  | { ok: false; status: 503 | 500; error: string; detail?: string; hint?: string }
> {
  const config = getSupabaseServerClient();
  if (!config.ok) return config;

  try {
    const { data, error } = await run(config.client);
    if (error) {
      console.error("Supabase query:", error.code, error.message);
      return {
        ok: false,
        status: 500,
        error: "Database request failed",
        detail: error.message,
        hint: supabaseFetchHint(error.message),
      };
    }
    return { ok: true, data };
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    console.error("Supabase exception:", detail);
    return {
      ok: false,
      status: 500,
      error: "Database request failed",
      detail,
      hint: supabaseFetchHint(detail),
    };
  }
}
