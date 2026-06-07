import { useCallback, useEffect, useRef, useState } from "react";
import { isHosConfigured } from "@/api/hosClient";
import { PageHeader } from "@/components/layout/PageHeader";
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
      <PageHeader
        title="Collaboration"
        description="CRDT presence via /v1/collaboration/presence"
        meta={
          <>
            {live ? "Live" : "Mock — configure API env"}
            {repoSource === "mock" && " · Mock repository"}
            {loading && " · Syncing presence…"}
            {error && ` · ${error}`}
          </>
        }
        actions={
          <button
            type="button"
            className="st-btn st-btn--primary"
            onClick={() => void heartbeat()}
            disabled={!live || !projectId}
          >
            <span className="material-symbols-outlined st-icon-sm" aria-hidden="true">
              sync
            </span>
            Heartbeat now
          </button>
        }
      />

      <div className="st-panel">
        <div className="st-panel-toolbar">
          <div className="st-panel-toolbar-start">
            <span className="material-symbols-outlined st-icon-sm" aria-hidden="true">
              groups
            </span>
            <span className="st-panel-title">Active editors</span>
            <span className="st-toolbar-divider" />
            <span style={{ fontSize: 13, color: "var(--st-text-muted)" }}>
              {presence.length} online
            </span>
          </div>
        </div>

        {presence.length === 0 ? (
          <p className="st-empty">
            {live ? "No other editors online." : "Presence feed unavailable offline."}
          </p>
        ) : (
          <div className="st-table-wrap">
            <table className="st-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Resource</th>
                  <th>Domain</th>
                  <th>Last seen</th>
                </tr>
              </thead>
              <tbody>
                {presence.map((row) => (
                  <tr key={row.session_id}>
                    <td>
                      <code className="st-mono">{row.user_id.slice(0, 8)}</code>
                    </td>
                    <td>
                      <code className="st-mono">{row.resource_path}</code>
                    </td>
                    <td>
                      <span className="st-badge st-badge--tertiary">
                        {row.domain ?? "—"}
                      </span>
                    </td>
                    <td style={{ color: "var(--st-text-muted)", fontSize: 13 }}>
                      <time dateTime={row.last_seen_at}>
                        {new Date(row.last_seen_at).toLocaleTimeString()}
                      </time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
