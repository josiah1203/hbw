import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
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
      <PageHeader
        title="History"
        description="Commit DAG"
        meta={
          <>
            {source === "hos"
              ? "Live HOS"
              : "Mock — set VITE_HBP_API_URL + VITE_HBP_ACCESS_TOKEN"}
            {loading && " · Loading…"}
            {error && ` · ${error}`}
          </>
        }
      />

      <div className="st-panel">
        <div className="st-panel-toolbar">
          <div className="st-panel-toolbar-start">
            <label htmlFor="repo-select" className="st-label">
              Repository
            </label>
            <select
              id="repo-select"
              className="st-select"
              value={selectedId}
              onChange={(e) => navigate(`/history/${e.target.value}`)}
            >
              {repositories.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <span className="st-toolbar-divider" />
            <Link to="/repositories" className="st-table-link" style={{ fontSize: 13 }}>
              ← All repositories
            </Link>
          </div>
          {graph && (
            <div className="st-panel-toolbar-end">
              <span className="st-badge st-badge--primary">
                {orderedNodes.length} commits
              </span>
              <button type="button" className="st-btn">
                Export
              </button>
            </div>
          )}
        </div>

        <div className="st-panel-body">
          {!graph ? (
            <p className="st-empty">No commit graph for this repository.</p>
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
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <code>{node.shortHash}</code>
                        {isHead && (
                          <span className="st-badge st-badge--success">HEAD</span>
                        )}
                        {node.kind === "merge" && (
                          <span className="st-badge st-badge--tertiary">merge</span>
                        )}
                      </div>
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
                          className="st-table-link"
                          style={{ fontSize: 13, marginTop: "0.35rem", display: "inline-block" }}
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
      </div>
    </>
  );
}
