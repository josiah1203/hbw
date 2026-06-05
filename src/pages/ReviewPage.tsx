import { useMemo } from "react";
import { useParams } from "react-router-dom";
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
      <header className="hb-header">
        <h2>Review</h2>
        <p>
          Comment thread on a commit
          {source === "hos" ? " (live HOS commit)" : " (mock)"}
        </p>
        {loading && <p className="hb-meta">Loading…</p>}
        {error && <p className="hb-meta">{error}</p>}
      </header>
      <div className="hb-content">
        {selectedCommit ? (
          <article className="hb-review-commit">
            <code>{selectedCommit.shortHash}</code>
            <h3>{selectedCommit.message}</h3>
            <p className="hb-commit-meta">
              {selectedCommit.author} · {selectedCommit.branch}
            </p>
          </article>
        ) : (
          <p className="hb-empty">Select a commit from History to review.</p>
        )}

        <h3 className="hb-section-title">Comments</h3>
        <ul className="hb-comment-list">
          {MOCK_COMMENTS.map((comment) => (
            <li key={comment.id} className="hb-comment">
              <div className="hb-comment-head">
                <strong>{comment.author}</strong>
                <time dateTime={comment.createdAt}>
                  {new Date(comment.createdAt).toLocaleString()}
                </time>
              </div>
              <p>{comment.body}</p>
            </li>
          ))}
        </ul>
        <p className="hb-meta">
          Read-only shell — HOS comments API wiring planned for Phase 0.5.
        </p>
      </div>
    </>
  );
}
