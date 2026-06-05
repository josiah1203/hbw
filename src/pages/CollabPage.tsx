import { useCallback, useEffect, useRef, useState } from "react";
import { isHosConfigured } from "@/api/hosClient";
import { useRepositories } from "@/hooks/useRepositories";

interface PresenceRow {
  session_id: string;
  user_id: string;
  resource_path: string;
  domain: string | null;
  last_seen_at: string;
}

const SESSION_ID =
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : "hbw-local-session";

export function CollabPage() {
  const { repositories, source: repoSource } = useRepositories();
  const projectId = repositories[0]?.id ?? "";
  const [presence, setPresence] = useState<PresenceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState(isHosConfigured());
  const intervalRef = useRef<number | null>(null);

  const apiFetch = useCallback(
    async (path: string, init?: RequestInit) => {
      const apiUrl = import.meta.env.VITE_HBP_API_URL?.replace(/\/$/, "");
      const token =
        import.meta.env.VITE_HBP_ACCESS_TOKEN ?? import.meta.env.VITE_HBP_API_KEY;
      if (!apiUrl || !token) throw new Error("HOS not configured");
      const resp = await fetch(`${apiUrl}${path}`, {
        ...init,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          ...init?.headers,
        },
      });
      if (!resp.ok) {
        throw new Error(`Collaboration API ${resp.status}`);
      }
      return resp.json() as Promise<unknown>;
    },
    [],
  );

  const heartbeat = useCallback(async () => {
    if (!live || !projectId) return;
    setLoading(true);
    try {
      await apiFetch("/v1/collaboration/presence/heartbeat", {
        method: "POST",
        body: JSON.stringify({
          project_id: projectId,
          session_id: SESSION_ID,
          resource_path: "schematic/main.kicad_sch",
          domain: "schematic",
          client_meta: { client: "hbw", version: "0.1.0" },
        }),
      });
      const listBody = (await apiFetch(
        `/v1/collaboration/presence?project_id=${encodeURIComponent(projectId)}`,
      )) as { data?: PresenceRow[] };
      setPresence(listBody.data ?? []);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      setLive(false);
    } finally {
      setLoading(false);
    }
  }, [apiFetch, live, projectId]);

  useEffect(() => {
    if (!live || !projectId) return;
    void heartbeat();
    intervalRef.current = window.setInterval(() => void heartbeat(), 30_000);
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
      if (live && projectId) {
        void apiFetch("/v1/collaboration/presence/leave", {
          method: "POST",
          body: JSON.stringify({ project_id: projectId, session_id: SESSION_ID }),
        }).catch(() => undefined);
      }
    };
  }, [apiFetch, heartbeat, live, projectId]);

  return (
    <>
      <header className="hb-header">
        <h2>Collaboration</h2>
        <p>
          CRDT presence via <code>/v1/collaboration/presence</code>
          {live ? " (live)" : " (mock — configure API env)"}
        </p>
        {repoSource === "mock" && (
          <p className="hb-meta">Mock repository — presence requires a live project.</p>
        )}
        {loading && <p className="hb-meta">Syncing presence…</p>}
        {error && <p className="hb-meta">{error}</p>}
      </header>
      <div className="hb-content">
        <div className="hb-select-row">
          <button type="button" onClick={() => void heartbeat()} disabled={!live || !projectId}>
            Heartbeat now
          </button>
        </div>

        {presence.length === 0 ? (
          <p className="hb-empty">
            {live ? "No other editors online." : "Presence feed unavailable offline."}
          </p>
        ) : (
          <ul className="hb-presence-list">
            {presence.map((row) => (
              <li key={row.session_id} className="hb-presence-row">
                <strong>{row.user_id.slice(0, 8)}</strong>
                <span>{row.resource_path}</span>
                <span className="hb-badge">{row.domain ?? "—"}</span>
                <time dateTime={row.last_seen_at}>
                  {new Date(row.last_seen_at).toLocaleTimeString()}
                </time>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
