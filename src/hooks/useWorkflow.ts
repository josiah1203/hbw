import { useCallback, useEffect, useState } from "react";
import {
  fetchWorkflowBuiltins,
  fetchWorkflowRuns,
  isWorkflowConfigured,
  triggerWorkflowRun,
  type WorkflowBuiltin,
  type WorkflowRun,
} from "@/api/workflowClient";

export interface UseWorkflowResult {
  builtins: WorkflowBuiltin[];
  runs: WorkflowRun[];
  loading: boolean;
  runningCheckId: string | null;
  error: string | null;
  source: "hos" | "mock";
  refresh: () => void;
  runCheck: (checkId: string) => Promise<void>;
}

const MOCK_BUILTINS: WorkflowBuiltin[] = [
  { check_id: "drc.kicad", domain: "layout", label: "KiCad DRC" },
  { check_id: "erc.kicad", domain: "schematic", label: "KiCad ERC" },
  { check_id: "bom.validate", domain: "bom", label: "BOM validation" },
  { check_id: "bom.sync", domain: "bom", label: "BOM sync" },
  { check_id: "lvs.kicad", domain: "schematic+layout", label: "LVS" },
  { check_id: "ic_drc.klayout", domain: "ic_layout", label: "IC DRC" },
  { check_id: "firmware.build", domain: "firmware", label: "Firmware build" },
  {
    check_id: "cross_domain.consistency",
    domain: "multi",
    label: "Cross-domain consistency",
  },
  { check_id: "constraint.check", domain: "mechanical", label: "Constraint check" },
  {
    check_id: "component.annotation",
    domain: "schematic",
    label: "Component annotation",
  },
];

export function useWorkflow(projectId: string): UseWorkflowResult {
  const [builtins, setBuiltins] = useState<WorkflowBuiltin[]>(MOCK_BUILTINS);
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [loading, setLoading] = useState(isWorkflowConfigured());
  const [runningCheckId, setRunningCheckId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"hos" | "mock">(
    isWorkflowConfigured() ? "hos" : "mock",
  );

  const refresh = useCallback(() => {
    if (!isWorkflowConfigured() || !projectId) {
      setBuiltins(MOCK_BUILTINS);
      setRuns([]);
      setSource("mock");
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      fetchWorkflowBuiltins(),
      fetchWorkflowRuns(projectId),
    ])
      .then(([builtinRows, runRows]) => {
        setBuiltins(builtinRows.length > 0 ? builtinRows : MOCK_BUILTINS);
        setRuns(runRows);
        setSource("hos");
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : String(err));
        setBuiltins(MOCK_BUILTINS);
        setRuns([]);
        setSource("mock");
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const runCheck = useCallback(
    async (checkId: string) => {
      if (!isWorkflowConfigured() || !projectId) {
        setError("Configure VITE_HBP_API_URL + token to run checks");
        return;
      }
      setRunningCheckId(checkId);
      setError(null);
      try {
        const domainContext: Record<string, unknown> = {};
        const meta = builtins.find((b) => b.check_id === checkId);
        if (meta?.domain && meta.domain !== "multi") {
          domainContext.domains = meta.domain.split("+");
        }
        if (checkId === "bom.sync") {
          domainContext.bom_rows = [{ ref: "R1", mpn: "ABC", qty: 1 }];
        }
        const run = await triggerWorkflowRun(projectId, checkId, domainContext);
        setRuns((prev) => [run, ...prev.filter((r) => r.run_id !== run.run_id)]);
        setSource("hos");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setRunningCheckId(null);
      }
    },
    [projectId, builtins],
  );

  return {
    builtins,
    runs,
    loading,
    runningCheckId,
    error,
    source,
    refresh,
    runCheck,
  };
}
