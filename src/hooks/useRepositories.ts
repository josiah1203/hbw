import { useEffect, useState } from "react";
import { fetchRepositories, isHosConfigured } from "@/api/hosClient";
import { mockRepositories } from "@/data/mock";
import type { Repository } from "@/types/repository";

export interface UseRepositoriesResult {
  repositories: Repository[];
  loading: boolean;
  error: string | null;
  source: "hos" | "mock";
}

export function useRepositories(): UseRepositoriesResult {
  const [repositories, setRepositories] = useState<Repository[]>(mockRepositories);
  const [loading, setLoading] = useState(isHosConfigured());
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"hos" | "mock">(
    isHosConfigured() ? "hos" : "mock",
  );

  useEffect(() => {
    if (!isHosConfigured()) return;

    let cancelled = false;
    setLoading(true);
    fetchRepositories()
      .then((repos) => {
        if (cancelled) return;
        if (repos && repos.length > 0) {
          setRepositories(repos);
          setSource("hos");
        } else {
          setRepositories(mockRepositories);
          setSource("mock");
        }
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : String(err));
        setRepositories(mockRepositories);
        setSource("mock");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { repositories, loading, error, source };
}
