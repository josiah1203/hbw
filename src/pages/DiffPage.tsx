import { mockDiffSession } from "@/data/mock";
import type { DiffChangeKind } from "@/types/diff";

const kindLabels: Record<DiffChangeKind, string> = {
  add: "Add",
  remove: "Remove",
  modify: "Modify",
};

export function DiffPage() {
  const session = mockDiffSession;

  return (
    <>
      <header className="hb-header">
        <h2>HNF Diff</h2>
        <p>
          {session.repositoryName}: {session.baseLabel} → {session.headLabel}
        </p>
      </header>
      <div className="hb-content">
        <p className="hb-empty" style={{ marginBottom: "1rem", fontStyle: "normal" }}>
          Structural diff viewer shell — hnf diff integration in M3.
        </p>
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
      </div>
    </>
  );
}
