import { useCallback, useEffect, useState } from "react";

import { COMMITMENT_LABELS, STAGE_LABELS } from "../shared/applicationSchema";

type Row = {
  id: string;
  created_at: string;
  payload: Record<string, string>;
};

const PAYLOAD_KEYS = [
  "fullName",
  "linkedIn",
  "stage",
  "recentBuildLink",
  "wantToBuild",
  "unfinishedStory",
  "commitment",
  "soloOrTeam",
  "teammateName",
  "teammateLinkedIn",
  "quitReason",
] as const;

function rowToCsv(rows: Row[]): string {
  const header = ["id", "created_at", ...PAYLOAD_KEYS];
  const lines = [header.join(",")];
  for (const r of rows) {
    const cells = [
      r.id,
      r.created_at,
      ...PAYLOAD_KEYS.map((k) => {
        const v = (r.payload?.[k] ?? "").replace(/"/g, '""');
        return `"${v}"`;
      }),
    ];
    lines.push(cells.join(","));
  }
  return lines.join("\n");
}

export function AdminApp() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRows = useCallback(async (opts?: { quiet401?: boolean; skipLoading?: boolean }) => {
    if (!opts?.skipLoading) setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/applications", { credentials: "include" });
      if (res.status === 401) {
        setLoggedIn(false);
        setRows([]);
        if (!opts?.quiet401) setError("Session expired. Sign in again.");
        return;
      }
      const data = (await res.json()) as { rows?: Row[]; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not load data");
        return;
      }
      setRows(data.rows ?? []);
      setLoggedIn(true);
    } catch {
      setError("Network error");
    } finally {
      if (!opts?.skipLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRows({ quiet401: true, skipLoading: true });
  }, [loadRows]);

  function downloadCsv() {
    const blob = new Blob([rowToCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shipyard-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setError(j.error ?? "Login failed");
        return;
      }
      setPassword("");
      await loadRows();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    setLoggedIn(false);
    setRows([]);
  }

  if (!loggedIn) {
    return (
      <div className="admin-login">
        <div className="admin-login__card">
          <p className="admin-login__label">Shipyard admin</p>
          <h1 className="heading-section" style={{ marginBottom: "1.5rem" }}>
            Applications
          </h1>
          <form onSubmit={onLogin}>
            <label className="apply__field">
              <span className="apply__question">Password</span>
              <input
                type="password"
                autoComplete="current-password"
                className="apply__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {error && <p className="apply__err apply__err--banner">{error}</p>}
            <button type="submit" className="btn-primary admin-login__submit" disabled={loading}>
              <span className="btn__label">{loading ? "Signing in…" : "Sign in"}</span>
            </button>
          </form>
          <p className="body-md admin-login__hint">
            This page is not linked from the public site. Use the password set in{" "}
            <code>APPLY_ADMIN_PASSWORD</code> (Vercel env).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__header px-page">
        <h1 className="heading-section">Application responses</h1>
        <div className="admin-dashboard__actions">
          {rows.length > 0 && (
            <button type="button" className="btn-primary" onClick={downloadCsv}>
              <span className="btn__label">Download CSV</span>
            </button>
          )}
          <button type="button" className="apply__btn-secondary body-md" onClick={() => loadRows()}>
            Refresh
          </button>
          <button type="button" className="apply__btn-secondary body-md" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </header>
      {error && <p className="apply__err apply__err--banner px-page">{error}</p>}
      {loading && <p className="body-md px-page">Loading…</p>}
      <div className="admin-table-wrap px-page">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>LinkedIn</th>
              <th>Stage</th>
              <th>Commitment</th>
              <th>Solo / team</th>
              <th>Recent build</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{new Date(r.created_at).toLocaleString()}</td>
                <td>{r.payload?.fullName}</td>
                <td>
                  {r.payload?.linkedIn ? (
                    <a href={r.payload.linkedIn} target="_blank" rel="noreferrer">
                      Link
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  {r.payload?.stage && r.payload.stage in STAGE_LABELS
                    ? STAGE_LABELS[r.payload.stage as keyof typeof STAGE_LABELS]
                    : r.payload?.stage}
                </td>
                <td>
                  {r.payload?.commitment && r.payload.commitment in COMMITMENT_LABELS
                    ? COMMITMENT_LABELS[r.payload.commitment as keyof typeof COMMITMENT_LABELS]
                    : r.payload?.commitment}
                </td>
                <td>{r.payload?.soloOrTeam === "team" ? "In a team" : r.payload?.soloOrTeam === "solo" ? "Solo" : r.payload?.soloOrTeam}</td>
                <td>
                  {r.payload?.recentBuildLink ? (
                    <a href={r.payload.recentBuildLink} target="_blank" rel="noreferrer">
                      Link
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.map((r) => (
        <article key={r.id} className="admin-detail px-page">
          <h2 className="apply__title" style={{ fontSize: "1.35rem" }}>
            {r.payload?.fullName}{" "}
            <span className="body-md" style={{ opacity: 0.7 }}>
              — {new Date(r.created_at).toLocaleString()}
            </span>
          </h2>
          <dl className="admin-dl">
            {PAYLOAD_KEYS.map((k) => (
              <div key={k} className="admin-dl__row">
                <dt className="label-caps">{k}</dt>
                <dd className="body-md">{r.payload?.[k] || "—"}</dd>
              </div>
            ))}
          </dl>
        </article>
      ))}
    </div>
  );
}
