import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCommitGraph } from "@/hooks/useCommitGraph";
import type { CommitNode } from "@/types/commit";

function sortByTopology(nodes: CommitNode[], headId: string): CommitNode[] {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const visited = new Set<string>();
  const ordered: CommitNode[] = [];

  function walk(id: string) {
    if (visited.has(id)) return;
    visited.add(id);
    const node = byId.get(id);
    if (!node) return;
    for (const parentId of node.parentIds) {
      walk(parentId);
    }
    ordered.push(node);
  }

  walk(headId);
  return ordered.reverse();
}

export function HistoryPage() {
  const navigate = useNavigate();
  const { repoId } = useParams<{ repoId?: string }>();
  const { graph, loading, error, source, repositories } = useCommitGraph(
    repoId ?? "",
  );
  const selectedId = repoId ?? repositories[0]?.id ?? "";
  const orderedNodes = useMemo(
    () => (graph ? sortByTopology(graph.nodes, graph.headId) : []),
    [graph],
  );

  return (
    <>
      <header className="hb-header">
        <h2>History</h2>
        <p>
          Commit DAG
          {source === "hos"
            ? " (live HOS)"
            : " (mock — set VITE_HBP_API_URL + VITE_HBP_ACCESS_TOKEN)"}
        </p>
        {loading && <p className="hb-meta">Loading…</p>}
        {error && <p className="hb-meta">{error}</p>}
      </header>
      <div className="hb-content">
        <div className="hb-select-row">
          <label htmlFor="repo-select">Repository</label>
          <select
            id="repo-select"
            value={selectedId}
            onChange={(e) => navigate(`/history/${e.target.value}`)}
          >
            {repositories.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <Link to="/repositories">← All repositories</Link>
        </div>
        {!graph ? (
          <p className="hb-empty">No commit graph for this repository.</p>
        ) : (
          <div className="hb-dag" role="list" aria-label="Commit history">
            {orderedNodes.map((node) => {
              const isHead = node.id === graph.headId;
              const parentForDiff = node.parentIds[0];
              const diffHref =
                parentForDiff != null
                  ? `/diff?repoId=${encodeURIComponent(node.repositoryId)}&from=${encodeURIComponent(parentForDiff)}&to=${encodeURIComponent(node.id)}`
                  : null;

              return (
                <article
                  key={node.id}
                  role="listitem"
                  className={[
                    "hb-commit",
                    node.kind === "merge" ? "merge" : "",
                    isHead ? "hb-commit-head" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div>
                    <code>{node.shortHash}</code>
                    <div className="hb-commit-msg">{node.message}</div>
                    <div className="hb-commit-meta">
                      {node.author} · {node.branch}
                      {node.parentIds.length > 1
                        ? ` · ${node.parentIds.length} parents`
                        : ""}
                    </div>
                    {diffHref && (
                      <Link
                        to={diffHref}
                        className="hb-diff-link"
                        style={{ fontSize: "0.85rem", marginTop: "0.35rem", display: "inline-block" }}
                      >
                        View diff →
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
