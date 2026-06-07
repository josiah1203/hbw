import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { useRepositories } from "@/hooks/useRepositories";

export function RepositoriesPage() {
  const { repositories, loading, error, source } = useRepositories();

  const totalCommits = repositories.reduce((sum, r) => sum + r.commitCount, 0);
  const publicCount = repositories.filter((r) => r.visibility === "public").length;
  const privateCount = repositories.length - publicCount;

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
            <span className="st-badge st-badge--primary">{publicCount} public</span>
            <span className="st-badge st-badge--success">{privateCount} private</span>
          </div>
        </article>
        <article className="st-stat-card">
          <div className="st-stat-card-head">
            <span className="st-stat-card-label">Total commits</span>
            <div className="st-status">
              <span className="st-status-dot" aria-hidden="true" />
              <span style={{ fontSize: 12, color: "var(--st-text-muted)" }}>Active</span>
            </div>
          </div>
          <div className="st-stat-card-value">{totalCommits.toLocaleString()}</div>
          <p style={{ margin: 0, fontSize: 14, color: "var(--st-text-muted)" }}>
            Across all connected hardware repositories
          </p>
          <div className="st-stat-card-actions">
            <Link to="/history" className="st-btn st-btn--primary">
              <span className="material-symbols-outlined st-icon-sm" aria-hidden="true">
                history
              </span>
              View commit history
            </Link>
          </div>
        </article>
      </div>

      <div className="st-panel">
        <div className="st-panel-toolbar">
          <div className="st-panel-toolbar-start">
            <button type="button" className="st-toolbar-filter">
              <span className="material-symbols-outlined st-icon-sm" aria-hidden="true">
                filter_list
              </span>
              Filters
            </button>
            <span className="st-toolbar-divider" />
            <div className="st-toolbar-meta">
              <span>{repositories.length} repos</span>
              {error && (
                <span className="st-toolbar-alert">
                  <span className="material-symbols-outlined st-icon-sm" aria-hidden="true">
                    error
                  </span>
                  API fallback
                </span>
              )}
            </div>
          </div>
          <div className="st-panel-toolbar-end">
            <button type="button" className="st-btn">
              Sort
            </button>
            <button type="button" className="st-btn">
              Export
            </button>
            <button type="button" className="st-btn st-btn--primary">
              <span className="material-symbols-outlined st-icon-sm" aria-hidden="true">
                add
              </span>
              New repository
            </button>
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
                <th style={{ textAlign: "right" }}>Commits</th>
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
                  <td className="st-table-desc">{repo.description}</td>
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
          <nav className="st-pagination" aria-label="Repository pagination">
            <button type="button" className="st-pagination-btn" disabled>
              Previous
            </button>
            <button type="button" className="st-pagination-btn st-pagination-btn--active">
              1
            </button>
            <span className="st-pagination-ellipsis">…</span>
            <button type="button" className="st-pagination-btn" disabled>
              Next
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}
