import { useRepositories } from "@/hooks/useRepositories";
import { useWorkflow } from "@/hooks/useWorkflow";

export function AutomationPage() {
  const { repositories, source: repoSource } = useRepositories();
  const projectId = repositories[0]?.id ?? "";
  const { builtins, runs, loading, runningCheckId, error, source, refresh, runCheck } =
    useWorkflow(projectId);

  return (
    <>
      <header className="hb-header">
        <h2>Automation Studio</h2>
        <p>
          Phase 0 built-in workflow checks
          {source === "hos"
            ? " (live workflow API)"
            : " (mock — set VITE_HBP_API_URL + VITE_HBP_ACCESS_TOKEN)"}
        </p>
        {repoSource === "mock" && (
          <p className="hb-meta">Using mock repository — select a live project when configured.</p>
        )}
        {loading && <p className="hb-meta">Loading…</p>}
        {error && <p className="hb-meta">{error}</p>}
      </header>
      <div className="hb-content">
        <div className="hb-select-row">
          <label htmlFor="automation-project">Project</label>
          <select id="automation-project" value={projectId} disabled>
            {repositories.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <button type="button" onClick={refresh} disabled={loading}>
            Refresh
          </button>
        </div>

        <h3 className="hb-section-title">Built-in checks</h3>
        <div className="hb-card-grid">
          {builtins.map((check) => (
            <article key={check.check_id} className="hb-card hb-card-static">
              <h3>{check.label}</h3>
              <p>
                <code>{check.check_id}</code> · {check.domain}
              </p>
              <button
                type="button"
                className="hb-btn"
                disabled={!projectId || runningCheckId === check.check_id}
                onClick={() => void runCheck(check.check_id)}
              >
                {runningCheckId === check.check_id ? "Running…" : "Run check"}
              </button>
            </article>
          ))}
        </div>

        <h3 className="hb-section-title">Recent runs</h3>
        {runs.length === 0 ? (
          <p className="hb-empty">No workflow runs yet.</p>
        ) : (
          <ul className="hb-run-list">
            {runs.map((run) => (
              <li key={run.run_id} className={`hb-run hb-run-${run.status}`}>
                <div>
                  <strong>{run.check_id}</strong>
                  <span className="hb-badge">{run.status}</span>
                </div>
                <div className="hb-run-meta">
                  {run.started_at && <span>{new Date(run.started_at).toLocaleString()}</span>}
                  {run.hos_commit_id && (
                    <span title="HOS commit">HOS {run.hos_commit_id.slice(0, 8)}</span>
                  )}
                </div>
                {run.artifacts[0]?.summary && (
                  <p className="hb-run-summary">{run.artifacts[0].summary}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
