import { useEffect, useMemo, useState } from "react";
import { fetchHosDiff, isHosConfigured } from "@/api/hosClient";
import { mockDiffSession } from "@/data/mock";
import { useCommitGraph } from "@/hooks/useCommitGraph";
import type { HnfDiffSession } from "@/types/diff";

export interface UseDiffSessionParams {
  repoId: string;
  fromCommitId: string;
  toCommitId: string;
}

export interface UseDiffSessionResult {
  session: HnfDiffSession;
  loading: boolean;
  error: string | null;
  source: "hos" | "mock";
}

function pickDefaultCommits(
  graph: ReturnType<typeof useCommitGraph>["graph"],
): { from: string; to: string } | null {
  if (!graph || graph.nodes.length < 2) return null;
  const head = graph.nodes.find((n) => n.id === graph.headId);
  if (!head || head.parentIds.length === 0) return null;
  const parentId = head.parentIds[0];
  if (!parentId) return null;
  return { from: parentId, to: head.id };
}

export function useDiffSession(params: UseDiffSessionParams): UseDiffSessionResult {
  const { repoId, fromCommitId, toCommitId } = params;
  const { graph, repositories, loading: graphLoading, error: graphError } =
    useCommitGraph(repoId);

  const defaults = useMemo(() => pickDefaultCommits(graph), [graph]);

  const resolvedFrom = fromCommitId || defaults?.from || "";
  const resolvedTo = toCommitId || defaults?.to || "";

  const repository =
    repositories.find((r) => r.id === repoId) ?? repositories[0];

  const [session, setSession] = useState<HnfDiffSession>(mockDiffSession);
  const [loading, setLoading] = useState(isHosConfigured());
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"hos" | "mock">(
    isHosConfigured() ? "hos" : "mock",
  );

  useEffect(() => {
    if (graphLoading) return;

    const baseLabel = resolvedFrom
      ? `@ ${resolvedFrom.slice(0, 7)}`
      : mockDiffSession.baseLabel;
    const headLabel = resolvedTo
      ? `@ ${resolvedTo.slice(0, 7)}`
      : mockDiffSession.headLabel;
    const repositoryName = repository?.name ?? mockDiffSession.repositoryName;

    if (!isHosConfigured() || !repoId || !resolvedFrom || !resolvedTo) {
      setSession({
        ...mockDiffSession,
        baseLabel,
        headLabel,
        repositoryName,
      });
      setSource("mock");
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchHosDiff(repoId, resolvedFrom, resolvedTo)
      .then((hunks) => {
        if (cancelled) return;
        setSession({
          id: `diff-${resolvedFrom}-${resolvedTo}`,
          baseLabel,
          headLabel,
          repositoryName,
          hunks: hunks.length > 0 ? hunks : mockDiffSession.hunks,
        });
        setSource("hos");
        setError(hunks.length === 0 ? "No diff entries — showing sample hunks." : null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : String(err));
        setSession({
          ...mockDiffSession,
          baseLabel,
          headLabel,
          repositoryName,
        });
        setSource("mock");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    graphLoading,
    repoId,
    resolvedFrom,
    resolvedTo,
    repository?.name,
  ]);

  return {
    session,
    loading: loading || graphLoading,
    error: error ?? graphError,
    source,
  };
}
