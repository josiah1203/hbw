/** Phase 0 alpha — local mock; replace with hbp-protocol / HOS client. */
export type RepositoryVisibility = "private" | "org" | "public";

export interface Repository {
  id: string;
  name: string;
  slug: string;
  description: string;
  defaultBranch: string;
  visibility: RepositoryVisibility;
  updatedAt: string;
  commitCount: number;
}
