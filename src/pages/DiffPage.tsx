import { Link, useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { useDiffSession } from "@/hooks/useDiffSession";
import type { DiffChangeKind } from "@/types/diff";

const kindLabels: Record<DiffChangeKind, string> = {
  add: "Add",
  remove: "Remove",
  modify: "Modify",
};

const kindBadge: Record<DiffChangeKind, string> = {
  add: "st-badge--success",
  remove: "st-badge--error",
  modify: "st-badge--warning",
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
      <PageHeader
        title="HNF Diff"
        description={`${session.repositoryName}: ${session.baseLabel} → ${session.headLabel}`}
        meta={
          <>
            {source === "hos"
              ? "Live HOS /v1/hos/diff"
              : "Mock or client-side fallback"}
            {loading && " · Loading…"}
            {error && ` · ${error}`}
          </>
        }
        actions={
          repoId ? (
            <Link to={`/history/${repoId}`} className="st-btn st-btn--ghost">
              <span className="material-symbols-outlined st-icon-sm" aria-hidden="true">
                arrow_back
              </span>
              Back to history
            </Link>
          ) : undefined
        }
      />

      <div className="st-panel">
        <div className="st-panel-toolbar">
          <div className="st-panel-toolbar-start">
            <span className="material-symbols-outlined st-icon-sm" aria-hidden="true">
              compare
            </span>
            <span className="st-panel-title">Structural changes</span>
            <span className="st-toolbar-divider" />
            <span style={{ fontSize: 13, color: "var(--st-text-muted)" }}>
              {session.hunks.length} hunks
            </span>
          </div>
        </div>

        {session.hunks.length === 0 ? (
          <p className="st-empty">No structural changes between commits.</p>
        ) : (
          <div className="st-table-wrap">
            <table className="st-table">
              <thead>
                <tr>
                  <th>Kind</th>
                  <th>Path</th>
                  <th>Summary</th>
                </tr>
              </thead>
              <tbody>
                {session.hunks.map((hunk) => (
                  <tr key={hunk.path}>
                    <td>
                      <span className={`st-badge ${kindBadge[hunk.kind]}`}>
                        {kindLabels[hunk.kind]}
                      </span>
                    </td>
                    <td>
                      <code className="st-mono">{hunk.path}</code>
                    </td>
                    <td style={{ color: "var(--st-text-muted)" }}>{hunk.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
