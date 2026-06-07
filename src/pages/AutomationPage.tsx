import { PageHeader } from "@/components/layout/PageHeader";
import { useRepositories } from "@/hooks/useRepositories";
import { useWorkflow } from "@/hooks/useWorkflow";

function statusBadgeClass(status: string): string {
  if (status === "passed") return "st-badge--success";
  if (status === "failed") return "st-badge--error";
  return "st-badge--muted";
}

export function AutomationPage() {
  const { repositories, source: repoSource } = useRepositories();
  const projectId = repositories[0]?.id ?? "";
  const { builtins, runs, loading, runningCheckId, error, source, refresh, runCheck } =
    useWorkflow(projectId);

  return (
    <>
      <PageHeader
        title="Automation Studio"
        description="Phase 0 built-in workflow checks"
        meta={
          <>
            {source === "hos"
              ? "Live workflow API"
              : "Mock — set VITE_HBP_API_URL + VITE_HBP_ACCESS_TOKEN"}
            {repoSource === "mock" && " · Using mock repository"}
            {loading && " · Loading…"}
            {error && ` · ${error}`}
          </>
        }
      />

      <div className="st-panel">
        <div className="st-panel-toolbar">
          <div className="st-panel-toolbar-start">
            <label htmlFor="automation-project" className="st-label">
              Project
            </label>
            <select id="automation-project" className="st-select" value={projectId} disabled>
              {repositories.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <span className="st-toolbar-divider" />
            <span style={{ fontSize: 13, color: "var(--st-text-muted)" }}>
              {builtins.length} checks
            </span>
          </div>
          <div className="st-panel-toolbar-end">
            <button type="button" className="st-btn" onClick={refresh} disabled={loading}>
              <span className="material-symbols-outlined st-icon-sm" aria-hidden="true">
                refresh
              </span>
              Refresh
            </button>
            <button type="button" className="st-btn st-btn--primary">
              <span className="material-symbols-outlined st-icon-sm" aria-hidden="true">
                add
              </span>
              New check
            </button>
          </div>
        </div>
        <div className="st-table-wrap">
          <table className="st-table">
            <thead>
              <tr>
                <th>Check</th>
                <th>ID</th>
                <th>Domain</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {builtins.map((check) => (
                <tr key={check.check_id}>
                  <td style={{ fontWeight: 600 }}>{check.label}</td>
                  <td>
                    <code className="st-mono">{check.check_id}</code>
                  </td>
                  <td>
                    <span className="st-badge st-badge--tertiary">{check.domain}</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      className="st-btn st-btn--primary"
                      disabled={!projectId || runningCheckId === check.check_id}
                      onClick={() => void runCheck(check.check_id)}
                    >
                      {runningCheckId === check.check_id ? "Running…" : "Run check"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <section className="st-section">
        <h3 className="st-section-title">Recent runs</h3>
        <div className="st-panel">
          {runs.length === 0 ? (
            <p className="st-empty">No workflow runs yet.</p>
          ) : (
            <div className="st-table-wrap">
              <table className="st-table">
                <thead>
                  <tr>
                    <th>Check</th>
                    <th>Status</th>
                    <th>Started</th>
                    <th>HOS commit</th>
                    <th>Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map((run) => (
                    <tr key={run.run_id}>
                      <td>
                        <code className="st-mono">{run.check_id}</code>
                      </td>
                      <td>
                        <span className={`st-badge ${statusBadgeClass(run.status)}`}>
                          {run.status}
                        </span>
                      </td>
                      <td style={{ color: "var(--st-text-muted)", fontSize: 13 }}>
                        {run.started_at
                          ? new Date(run.started_at).toLocaleString()
                          : "—"}
                      </td>
                      <td>
                        {run.hos_commit_id ? (
                          <code className="st-mono">{run.hos_commit_id.slice(0, 8)}</code>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td style={{ color: "var(--st-text-muted)", fontSize: 13 }}>
                        {run.artifacts[0]?.summary ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
