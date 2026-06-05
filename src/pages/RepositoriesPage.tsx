import { Link } from "react-router-dom";
import { useRepositories } from "@/hooks/useRepositories";

export function RepositoriesPage() {
  const { repositories, loading, error, source } = useRepositories();

  return (
    <>
      <header className="hb-header">
        <h2>Repositories</h2>
        <p>
          HOS-backed hardware repositories
          {source === "hos" ? " (live API)" : " (mock data — set VITE_HBP_API_URL + VITE_HBP_ACCESS_TOKEN)"}.
        </p>
        {loading && <p className="hb-meta">Loading…</p>}
        {error && <p className="hb-meta">API error: {error} — showing mock fallback.</p>}
      </header>
      <div className="hb-content">
        <div className="hb-card-grid">
          {repositories.map((repo) => (
            <Link
              key={repo.id}
              to={`/history/${repo.id}`}
              className="hb-card"
            >
              <h3>{repo.name}</h3>
              <p>{repo.description}</p>
              <div className="hb-meta">
                <span className="hb-badge">{repo.visibility}</span>
                <span>{repo.defaultBranch}</span>
                <span>{repo.commitCount} commits</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
