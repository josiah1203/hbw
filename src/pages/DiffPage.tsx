import { Link, useSearchParams } from "react-router-dom";
import { useDiffSession } from "@/hooks/useDiffSession";
import type { DiffChangeKind } from "@/types/diff";

const kindLabels: Record<DiffChangeKind, string> = {
  add: "Add",
  remove: "Remove",
  modify: "Modify",
};

export function DiffPage() {
  const [searchParams] = useSearchParams();
  const repoId = searchParams.get("repoId") ?? "";
  const fromCommitId = searchParams.get("from") ?? "";
  const toCommitId = searchParams.get("to") ?? "";

  const { session, loading, error, source } = useDiffSession({
    repoId,
    fromCommitId,
    toCommitId,
  });

  return (
    <>
      <header className="hb-header">
        <h2>HNF Diff</h2>
        <p>
          {session.repositoryName}: {session.baseLabel} → {session.headLabel}
          {source === "hos"
            ? " (live HOS /v1/hos/diff)"
            : " (mock or client-side fallback)"}
        </p>
        {loading && <p className="hb-meta">Loading…</p>}
        {error && <p className="hb-meta">{error}</p>}
      </header>
      <div className="hb-content">
        {repoId && (
          <p className="hb-meta" style={{ marginBottom: "1rem" }}>
            <Link to={`/history/${repoId}`}>← Back to history</Link>
          </p>
        )}
        {session.hunks.length === 0 ? (
          <p className="hb-empty">No structural changes between commits.</p>
        ) : (
          <ul className="hb-diff-list">
            {session.hunks.map((hunk) => (
              <li key={hunk.path} className="hb-diff-item">
                <span className={`hb-diff-kind ${hunk.kind}`}>
                  {kindLabels[hunk.kind]}
                </span>
                <div>
                  <strong>{hunk.path}</strong>
                  <div className="hb-commit-meta">{hunk.summary}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
