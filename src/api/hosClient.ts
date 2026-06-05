import type { Repository } from "@/types/repository";

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

/** Read-only repo list from HOS /v1/projects. Returns null when env is unset. */
export async function fetchRepositories(): Promise<Repository[] | null> {
  const cfg = resolveConfig();
  if (!cfg) return null;

  const resp = await fetch(`${cfg.apiUrl}/v1/projects`, {
    headers: { Authorization: `Bearer ${cfg.accessToken}` },
  });
  if (!resp.ok) {
    throw new Error(`HOS list failed: ${resp.status} ${resp.statusText}`);
  }
  const body = (await resp.json()) as { data?: HosProject[] };
  const rows = body.data ?? [];
  return rows.map(mapProject);
}

export function isHosConfigured(): boolean {
  return resolveConfig() !== null;
}
