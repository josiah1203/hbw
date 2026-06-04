/** Commit graph node for History (DAG placeholder). */
export type CommitKind = "merge" | "normal" | "tag";

export interface CommitNode {
  id: string;
  repositoryId: string;
  hash: string;
  shortHash: string;
  message: string;
  author: string;
  authoredAt: string;
  parentIds: string[];
  branch: string;
  kind: CommitKind;
}

export interface CommitGraph {
  repositoryId: string;
  repositoryName: string;
  headId: string;
  nodes: CommitNode[];
}
