import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { useCommitGraph } from "@/hooks/useCommitGraph";

interface ReviewComment {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

const MOCK_COMMENTS: ReviewComment[] = [
  {
    id: "c1",
    author: "reviewer@alpha",
    body: "DRC clearance looks good on power rails — please confirm BOM MPN for U3.",
    createdAt: "2026-06-01T14:22:00Z",
  },
  {
    id: "c2",
    author: "lead@alpha",
    body: "Approved for merge after BOM sync check passes.",
    createdAt: "2026-06-02T09:10:00Z",
  },
];

export function ReviewPage() {
  const { commitId } = useParams<{ commitId?: string }>();
  const { graph, loading, error, source } = useCommitGraph("");
  const headCommit = graph?.nodes.find((n) => n.id === graph.headId);

  const selectedCommit = useMemo(() => {
    if (!graph) return null;
    if (commitId) {
      return graph.nodes.find((n) => n.id === commitId) ?? null;
    }
    return headCommit ?? graph.nodes[0] ?? null;
  }, [graph, commitId, headCommit]);

  return (
    <>
      <PageHeader
        title="Review"
        description="Comment thread on a commit"
        meta={
          <>
            {source === "hos" ? "Live HOS commit" : "Mock"}
            {loading && " · Loading…"}
            {error && ` · ${error}`}
          </>
        }
      />

      <div className="st-panel" style={{ marginBottom: "1.5rem" }}>
        <div className="st-panel-toolbar">
          <div className="st-panel-toolbar-start">
            <span className="material-symbols-outlined st-icon-sm" aria-hidden="true">
              rate_review
            </span>
            <span className="st-panel-title">Commit under review</span>
          </div>
        </div>
        <div className="st-panel-body">
          {selectedCommit ? (
            <article className="hb-review-commit" style={{ margin: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <code>{selectedCommit.shortHash}</code>
                <span className="st-badge st-badge--primary">{selectedCommit.branch}</span>
              </div>
              <h3 style={{ margin: "0 0 0.35rem", fontSize: 16 }}>{selectedCommit.message}</h3>
              <p className="hb-commit-meta">{selectedCommit.author}</p>
            </article>
          ) : (
            <p className="st-empty">Select a commit from History to review.</p>
          )}
        </div>
      </div>

      <div className="st-panel">
        <div className="st-panel-toolbar">
          <div className="st-panel-toolbar-start">
            <span className="st-panel-title">Comments</span>
            <span className="st-toolbar-divider" />
            <span className="st-badge st-badge--muted">{MOCK_COMMENTS.length} threads</span>
          </div>
        </div>
        <div className="st-panel-body">
          <ul className="hb-comment-list">
            {MOCK_COMMENTS.map((comment) => (
              <li key={comment.id} className="hb-comment">
                <div className="hb-comment-head">
                  <strong>{comment.author}</strong>
                  <time dateTime={comment.createdAt}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </time>
                </div>
                <p style={{ margin: 0 }}>{comment.body}</p>
              </li>
            ))}
          </ul>
          <p className="hb-commit-meta" style={{ marginTop: "1rem" }}>
            Read-only shell — HOS comments API wiring planned for Phase 0.5.
          </p>
        </div>
      </div>
    </>
  );
}
