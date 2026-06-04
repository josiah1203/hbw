import { Link } from "react-router-dom";
import { mockRepositories } from "@/data/mock";

export function RepositoriesPage() {
  return (
    <>
      <header className="hb-header">
        <h2>Repositories</h2>
        <p>HOS-backed hardware repositories — mock data for M2 alpha.</p>
      </header>
      <div className="hb-content">
        <div className="hb-card-grid">
          {mockRepositories.map((repo) => (
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
