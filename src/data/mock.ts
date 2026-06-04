import type { CommitGraph } from "@/types/commit";
import type { HnfDiffSession } from "@/types/diff";
import type { Repository } from "@/types/repository";

export const mockRepositories: Repository[] = [
  {
    id: "repo-rf-front-end",
    name: "RF Front-End",
    slug: "rf-front-end",
    description: "Ku-band LNA chain — schematic, layout, and simulation HNF bundles.",
    defaultBranch: "main",
    visibility: "org",
    updatedAt: "2026-06-02T14:22:00Z",
    commitCount: 128,
  },
  {
    id: "repo-power-distribution",
    name: "Power Distribution",
    slug: "power-distribution",
    description: "PDN and PMIC integration for carrier board rev C.",
    defaultBranch: "main",
    visibility: "private",
    updatedAt: "2026-06-01T09:05:00Z",
    commitCount: 54,
  },
  {
    id: "repo-antenna-array",
    name: "Antenna Array",
    slug: "antenna-array",
    description: "Phased array mechanical + EM co-design workspace.",
    defaultBranch: "develop",
    visibility: "org",
    updatedAt: "2026-05-28T18:40:00Z",
    commitCount: 89,
  },
];

const rfGraphNodes: CommitGraph["nodes"] = [
  {
    id: "c1",
    repositoryId: "repo-rf-front-end",
    hash: "a1b2c3d4e5f6789012345678abcdef0123456789",
    shortHash: "a1b2c3d",
    message: "Import KiCad schematic v3 into HNF",
    author: "alex@hummingbird.dev",
    authoredAt: "2026-05-20T10:00:00Z",
    parentIds: [],
    branch: "main",
    kind: "normal",
  },
  {
    id: "c2",
    repositoryId: "repo-rf-front-end",
    hash: "b2c3d4e5f6789012345678abcdef0123456789ab",
    shortHash: "b2c3d4e",
    message: "Run ERC + BOM check workflow",
    author: "sam@hummingbird.dev",
    authoredAt: "2026-05-24T16:30:00Z",
    parentIds: ["c1"],
    branch: "main",
    kind: "normal",
  },
  {
    id: "c3",
    repositoryId: "repo-rf-front-end",
    hash: "c3d4e5f6789012345678abcdef0123456789abcd",
    shortHash: "c3d4e5f",
    message: "Merge feature/lna-tuning into main",
    author: "alex@hummingbird.dev",
    authoredAt: "2026-06-02T14:22:00Z",
    parentIds: ["c2", "c4"],
    branch: "main",
    kind: "merge",
  },
  {
    id: "c4",
    repositoryId: "repo-rf-front-end",
    hash: "d4e5f6789012345678abcdef0123456789abcdef",
    shortHash: "d4e5f67",
    message: "Tune LNA bias network",
    author: "sam@hummingbird.dev",
    authoredAt: "2026-06-01T11:15:00Z",
    parentIds: ["c1"],
    branch: "feature/lna-tuning",
    kind: "normal",
  },
];

export const mockCommitGraphs: Record<string, CommitGraph> = {
  "repo-rf-front-end": {
    repositoryId: "repo-rf-front-end",
    repositoryName: "RF Front-End",
    headId: "c3",
    nodes: rfGraphNodes,
  },
  "repo-power-distribution": {
    repositoryId: "repo-power-distribution",
    repositoryName: "Power Distribution",
    headId: "p2",
    nodes: [
      {
        id: "p1",
        repositoryId: "repo-power-distribution",
        hash: "1111111111111111111111111111111111111111",
        shortHash: "1111111",
        message: "Initial HNF import",
        author: "dev@hummingbird.dev",
        authoredAt: "2026-05-10T08:00:00Z",
        parentIds: [],
        branch: "main",
        kind: "normal",
      },
      {
        id: "p2",
        repositoryId: "repo-power-distribution",
        hash: "2222222222222222222222222222222222222222",
        shortHash: "2222222",
        message: "PMIC rail rename + ERC",
        author: "dev@hummingbird.dev",
        authoredAt: "2026-06-01T09:05:00Z",
        parentIds: ["p1"],
        branch: "main",
        kind: "normal",
      },
    ],
  },
};

export const mockDiffSession: HnfDiffSession = {
  id: "diff-alpha-1",
  baseLabel: "main @ b2c3d4e",
  headLabel: "working tree",
  repositoryName: "RF Front-End",
  hunks: [
    { path: "schematic/U1.LNA", kind: "modify", summary: "Bias resistor R12: 4.7k → 5.1k" },
    { path: "bom/line-items", kind: "add", summary: "+1 line: C8051 decoupling 100nF" },
    { path: "layout/GND.pour", kind: "remove", summary: "Removed obsolete pour on layer In2.Cu" },
  ],
};

export function getRepository(id: string): Repository | undefined {
  return mockRepositories.find((r) => r.id === id);
}

export function getCommitGraph(repositoryId: string): CommitGraph | undefined {
  return mockCommitGraphs[repositoryId];
}
