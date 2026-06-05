import type { CommitGraph, CommitNode } from "@/types/commit";
import type { HnfDiffHunk } from "@/types/diff";
import type { Repository } from "@/types/repository";
import {
  type HosDiffEntry,
  mapHosDiffEntries,
} from "@/utils/hnfDiff";

/** Raw project row from GET /v1/projects */
interface HosProject {
  id: string;
  name: string;
  description?: string | null;
  visibility?: string;
  default_branch?: string;
  updated_at?: string;
  commit_count?: number;
}

export interface HosBranch {
  id: string;
  org_id: string;
  project_id: string;
  name: string;
  head_commit_id: string | null;
  created_at: string;
}

export interface HosCommit {
  id: string;
  org_id: string;
  project_id: string;
  branch_id: string | null;
  message: string;
  tree: Record<string, unknown>;
  tree_root_ref: string | null;
  created_by: string;
  created_at: string;
  parent_commit_ids: string[];
}

export interface HosClientConfig {
  apiUrl: string;
  accessToken: string;
}

function resolveConfig(): HosClientConfig | null {
  const apiUrl = import.meta.env.VITE_HBP_API_URL?.replace(/\/$/, "");
  const accessToken =
    import.meta.env.VITE_HBP_ACCESS_TOKEN ?? import.meta.env.VITE_HBP_API_KEY;
  if (!apiUrl || !accessToken) return null;
  return { apiUrl, accessToken };
}

async function hosFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const cfg = resolveConfig();
  if (!cfg) {
    throw new Error("HOS not configured");
  }

  const resp = await fetch(`${cfg.apiUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${cfg.accessToken}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!resp.ok) {
    throw new Error(`HOS request failed: ${resp.status} ${resp.statusText}`);
  }

  return (await resp.json()) as T;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mapProject(row: HosProject): Repository {
  const visibility =
    row.visibility === "private" || row.visibility === "public"
      ? row.visibility
      : "org";
  return {
    id: row.id,
    name: row.name,
    slug: slugify(row.name),
    description: row.description ?? "",
    defaultBranch: row.default_branch ?? "main",
    visibility,
    updatedAt: row.updated_at ?? new Date().toISOString(),
    commitCount: row.commit_count ?? 0,
  };
}

function shortId(id: string): string {
  return id.replace(/-/g, "").slice(0, 7);
}

function mapCommitToNode(
  commit: HosCommit,
  repositoryId: string,
  branchName: string,
): CommitNode {
  const parentIds = commit.parent_commit_ids ?? [];
  return {
    id: commit.id,
    repositoryId,
    hash: commit.id,
    shortHash: shortId(commit.id),
    message: commit.message,
    author: commit.created_by.slice(0, 8),
    authoredAt: commit.created_at,
    parentIds,
    branch: branchName,
    kind: parentIds.length > 1 ? "merge" : "normal",
  };
}

/** Read-only repo list from HOS /v1/projects. Returns null when env is unset. */
export async function fetchRepositories(): Promise<Repository[] | null> {
  const cfg = resolveConfig();
  if (!cfg) return null;

  const body = await hosFetch<{ data?: HosProject[] }>("/v1/projects");
  const rows = body.data ?? [];
  return rows.map(mapProject);
}

/** List branches for a project. */
export async function fetchBranches(projectId: string): Promise<HosBranch[]> {
  const body = await hosFetch<{ data?: HosBranch[] }>(
    `/v1/hos/branches?project_id=${encodeURIComponent(projectId)}`,
  );
  return body.data ?? [];
}

/** Commit log for a branch (newest first). */
export async function fetchCommitLog(
  projectId: string,
  branchId: string,
  limit = 50,
): Promise<HosCommit[]> {
  const qs = new URLSearchParams({
    project_id: projectId,
    branch_id: branchId,
    limit: String(limit),
  });
  const body = await hosFetch<{ data?: HosCommit[] }>(`/v1/hos/log?${qs}`);
  return body.data ?? [];
}

/** Build a commit DAG from HOS log rows. */
export function buildCommitGraph(
  repositoryId: string,
  repositoryName: string,
  commits: HosCommit[],
  branchName: string,
  headCommitId?: string | null,
): CommitGraph | null {
  if (commits.length === 0) return null;

  const nodes = commits.map((c) =>
    mapCommitToNode(c, repositoryId, branchName),
  );
  const newest = nodes[0];
  if (!newest) return null;

  const headId =
    headCommitId && nodes.some((n) => n.id === headCommitId)
      ? headCommitId
      : newest.id;

  return {
    repositoryId,
    repositoryName,
    headId,
    nodes,
  };
}

/** Resolve default branch for a repository. */
export async function resolveDefaultBranch(
  projectId: string,
  defaultBranchName: string,
): Promise<HosBranch | null> {
  const branches = await fetchBranches(projectId);
  if (branches.length === 0) return null;
  return (
    branches.find((b) => b.name === defaultBranchName) ?? branches[0] ?? null
  );
}

/** Fetch commit graph for a repository (branches + log). */
export async function fetchCommitGraph(
  repository: Repository,
): Promise<CommitGraph | null> {
  const branch = await resolveDefaultBranch(
    repository.id,
    repository.defaultBranch,
  );
  if (!branch) return null;

  const commits = await fetchCommitLog(repository.id, branch.id);
  return buildCommitGraph(
    repository.id,
    repository.name,
    commits,
    branch.name,
    branch.head_commit_id,
  );
}

/** Structural diff between two commits via POST /v1/hos/diff. */
export async function fetchHosDiff(
  projectId: string,
  fromCommitId: string,
  toCommitId: string,
): Promise<HnfDiffHunk[]> {
  const body = await hosFetch<{ data?: HosDiffEntry[] }>("/v1/hos/diff", {
    method: "POST",
    body: JSON.stringify({
      project_id: projectId,
      from_commit_id: fromCommitId,
      to_commit_id: toCommitId,
    }),
  });
  return mapHosDiffEntries(body.data ?? []);
}

export function isHosConfigured(): boolean {
  return resolveConfig() !== null;
}
