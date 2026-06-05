import { isHosConfigured } from "@/api/hosClient";

export interface WorkflowBuiltin {
  check_id: string;
  domain: string;
  label: string;
}

export interface WorkflowRun {
  id: string;
  run_id: string;
  check_id: string;
  status: string;
  trigger_kind: string;
  artifacts: Array<{
    check_id: string;
    status: string;
    summary: string;
    findings: Array<{ severity: string; code: string; message: string }>;
  }>;
  hos_commit_id?: string | null;
  started_at?: string | null;
  finished_at?: string | null;
}

async function workflowFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const apiUrl = import.meta.env.VITE_HBP_API_URL?.replace(/\/$/, "");
  const accessToken =
    import.meta.env.VITE_HBP_ACCESS_TOKEN ?? import.meta.env.VITE_HBP_API_KEY;
  if (!apiUrl || !accessToken) {
    throw new Error("HOS not configured");
  }

  const resp = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!resp.ok) {
    throw new Error(`Workflow request failed: ${resp.status} ${resp.statusText}`);
  }

  return (await resp.json()) as T;
}

export async function fetchWorkflowBuiltins(): Promise<WorkflowBuiltin[]> {
  const body = await workflowFetch<{ data?: WorkflowBuiltin[] }>(
    "/v1/workflow/checks",
  );
  return body.data ?? [];
}

export async function fetchWorkflowRuns(
  projectId: string,
): Promise<WorkflowRun[]> {
  const body = await workflowFetch<{ data?: WorkflowRun[] }>(
    `/v1/projects/${encodeURIComponent(projectId)}/workflow/runs`,
  );
  return body.data ?? [];
}

export async function triggerWorkflowRun(
  projectId: string,
  checkId: string,
  context?: Record<string, unknown>,
): Promise<WorkflowRun> {
  const body = await workflowFetch<{ run: WorkflowRun }>(
    `/v1/projects/${encodeURIComponent(projectId)}/workflow/run`,
    {
      method: "POST",
      body: JSON.stringify({
        check_id: checkId,
        trigger: "manual",
        context: context ?? {},
      }),
    },
  );
  return body.run;
}

export function isWorkflowConfigured(): boolean {
  return isHosConfigured();
}
