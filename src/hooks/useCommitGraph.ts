import { useEffect, useState } from "react";
import {
  fetchCommitGraph,
  isHosConfigured,
} from "@/api/hosClient";
import { getCommitGraph, mockRepositories } from "@/data/mock";
import type { CommitGraph } from "@/types/commit";
import type { Repository } from "@/types/repository";
import { useRepositories } from "@/hooks/useRepositories";

export interface UseCommitGraphResult {
  graph: CommitGraph | null;
  loading: boolean;
  error: string | null;
  source: "hos" | "mock";
  repositories: Repository[];
}

export function useCommitGraph(repoId: string): UseCommitGraphResult {
  const { repositories, loading: reposLoading, error: reposError, source: repoSource } =
    useRepositories();
  const [graph, setGraph] = useState<CommitGraph | null>(null);
  const [loading, setLoading] = useState(isHosConfigured());
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"hos" | "mock">(
    isHosConfigured() ? "hos" : "mock",
  );

  const selectedId = repoId || repositories[0]?.id || mockRepositories[0]?.id || "";
  const repository =
    repositories.find((r) => r.id === selectedId) ?? repositories[0];

  useEffect(() => {
    if (reposLoading) return;

    if (!isHosConfigured()) {
      setGraph(getCommitGraph(selectedId) ?? null);
      setSource("mock");
      setLoading(false);
      setError(null);
      return;
    }

    if (!repository) {
      setGraph(null);
      setSource("mock");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchCommitGraph(repository)
      .then((liveGraph) => {
        if (cancelled) return;
        if (liveGraph && liveGraph.nodes.length > 0) {
          setGraph(liveGraph);
          setSource("hos");
          setError(null);
        } else {
          setGraph(getCommitGraph(selectedId) ?? null);
          setSource("mock");
          setError(
            liveGraph === null
              ? "No branches or commits in HOS — showing mock fallback."
              : null,
          );
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : String(err));
        setGraph(getCommitGraph(selectedId) ?? null);
        setSource("mock");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedId, repository, reposLoading]);

  return {
    graph,
    loading: loading || reposLoading,
    error: error ?? reposError,
    source: source === "hos" && repoSource === "hos" ? "hos" : source,
    repositories,
  };
}
