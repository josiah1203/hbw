/** HNF diff shell — structural diff wired in M3+. */
export type DiffChangeKind = "add" | "remove" | "modify";

export interface HnfDiffHunk {
  path: string;
  kind: DiffChangeKind;
  summary: string;
}

export interface HnfDiffSession {
  id: string;
  baseLabel: string;
  headLabel: string;
  repositoryName: string;
  hunks: HnfDiffHunk[];
}
