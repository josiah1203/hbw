export type WorkflowStepKind = "trigger" | "condition" | "action";

export interface WorkflowStep {
  id: string;
  kind: WorkflowStepKind;
  label: string;
  config: Record<string, string>;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  steps: WorkflowStep[];
}

export const DEFAULT_WORKFLOW_TEMPLATE: WorkflowTemplate = {
  id: "tpl-commit-drc",
  name: "DRC on commit",
  steps: [
    {
      id: "step-1",
      kind: "trigger",
      label: "On commit",
      config: { trigger: "commit" },
    },
    {
      id: "step-2",
      kind: "condition",
      label: "Branch is main",
      config: { condition: "branch_match", pattern: "main" },
    },
    {
      id: "step-3",
      kind: "action",
      label: "Run DRC",
      config: { action: "run_check", check_id: "drc.kicad" },
    },
  ],
};

export const STEP_PALETTE: { kind: WorkflowStepKind; label: string; defaults: Record<string, string> }[] = [
  { kind: "trigger", label: "Trigger: commit", defaults: { trigger: "commit" } },
  { kind: "trigger", label: "Trigger: manual", defaults: { trigger: "manual" } },
  { kind: "condition", label: "Condition: branch", defaults: { condition: "branch_match", pattern: "main" } },
  { kind: "condition", label: "Condition: domain", defaults: { condition: "domain", domain: "layout" } },
  { kind: "action", label: "Action: run check", defaults: { action: "run_check", check_id: "drc.kicad" } },
  { kind: "action", label: "Action: webhook", defaults: { action: "webhook", channel: "slack" } },
  { kind: "action", label: "Action: gate", defaults: { action: "gate", gate_id: "branch_protection" } },
];
