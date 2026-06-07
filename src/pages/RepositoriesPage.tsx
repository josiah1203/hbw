import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { useRepositories } from "@/hooks/useRepositories";

export function RepositoriesPage() {
  const { repositories, loading, error, source } = useRepositories();

  const totalCommits = repositories.reduce((sum, r) => sum + r.commitCount, 0);
  const publicCount = repositories.filter((r) => r.visibility === "public").length;

  return (
    <>
      <PageHeader
        title="Repositories"
        description="HOS-backed hardware repositories"
        meta={
          <>
            {source === "hos"
              ? "Live API"
              : "Mock data — set VITE_HBP_API_URL + VITE_HBP_ACCESS_TOKEN"}
            {loading && " · Loading…"}
            {error && ` · API error: ${error} — showing mock fallback.`}
          </>
        }
      />

      <div className="st-stat-grid">
        <article className="st-stat-card">
          <div className="st-stat-card-head">
            <span className="st-stat-card-label">Total repositories</span>
            <span className="material-symbols-outlined st-icon-sm" aria-hidden="true">
              inventory_2
            </span>
          </div>
          <div className="st-stat-card-value">{repositories.length}</div>
          <div className="st-form-row" style={{ margin: 0 }}>
            <span className="st-badge st-badge--primary">
              {publicCount} public
            </span>
            <span className="st-badge st-badge--muted">
              {repositories.length - publicCount} private
            </span>
          </div>
        </article>
        <article className="st-stat-card">
          <div className="st-stat-card-head">
            <span className="st-stat-card-label">Total commits</span>
            <span className="material-symbols-outlined st-icon-sm" aria-hidden="true">
              history
            </span>
          </div>
          <div className="st-stat-card-value">{totalCommits}</div>
          <p style={{ margin: 0, fontSize: 13, color: "var(--st-text-muted)" }}>
            Across all connected hardware repositories
          </p>
        </article>
      </div>

      <div className="st-panel">
        <div className="st-panel-toolbar">
          <div className="st-panel-toolbar-start">
            <span className="material-symbols-outlined st-icon-sm" aria-hidden="true">
              filter_list
            </span>
            <span className="st-panel-title">All repositories</span>
            <span className="st-toolbar-divider" />
            <span style={{ fontSize: 13, color: "var(--st-text-muted)" }}>
              {repositories.length} repos
            </span>
          </div>
        </div>
        <div className="st-table-wrap">
          <table className="st-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Visibility</th>
                <th>Default branch</th>
                <th>Commits</th>
              </tr>
            </thead>
            <tbody>
              {repositories.map((repo) => (
                <tr key={repo.id}>
                  <td>
                    <Link to={`/history/${repo.id}`} className="st-table-link">
                      {repo.name}
                    </Link>
                  </td>
                  <td style={{ color: "var(--st-text-muted)" }}>{repo.description}</td>
                  <td>
                    <span
                      className={`st-badge ${
                        repo.visibility === "public"
                          ? "st-badge--success"
                          : "st-badge--muted"
                      }`}
                    >
                      {repo.visibility}
                    </span>
                  </td>
                  <td>
                    <code className="st-mono">{repo.defaultBranch}</code>
                  </td>
                  <td className="st-mono" style={{ textAlign: "right" }}>
                    {repo.commitCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="st-table-footer">
          {repositories.length} repositories · {source === "hos" ? "live" : "mock"} data
        </div>
      </div>
    </>
  );
}
