import { useCallback, useState } from "react";
import {
  DEFAULT_WORKFLOW_TEMPLATE,
  STEP_PALETTE,
  type WorkflowStep,
  type WorkflowTemplate,
} from "@/types/workflowComposer";

let stepCounter = 100;

function newStep(kind: WorkflowStep["kind"], label: string, config: Record<string, string>): WorkflowStep {
  stepCounter += 1;
  return { id: `step-${stepCounter}`, kind, label, config };
}

export function useWorkflowComposer() {
  const [template, setTemplate] = useState<WorkflowTemplate>(DEFAULT_WORKFLOW_TEMPLATE);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const addStep = useCallback((paletteIndex: number) => {
    const item = STEP_PALETTE[paletteIndex];
    if (!item) return;
    setTemplate((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep(item.kind, item.label, { ...item.defaults })],
    }));
  }, []);

  const removeStep = useCallback((stepId: string) => {
    setTemplate((prev) => ({
      ...prev,
      steps: prev.steps.filter((s) => s.id !== stepId),
    }));
  }, []);

  const moveStep = useCallback((stepId: string, direction: -1 | 1) => {
    setTemplate((prev) => {
      const idx = prev.steps.findIndex((s) => s.id === stepId);
      if (idx < 0) return prev;
      const next = idx + direction;
      if (next < 0 || next >= prev.steps.length) return prev;
      const steps = [...prev.steps];
      const a = steps[idx];
      const b = steps[next];
      if (!a || !b) return prev;
      steps[idx] = b;
      steps[next] = a;
      return { ...prev, steps };
    });
  }, []);

  const saveTemplate = useCallback(() => {
    setSavedMessage(`Saved "${template.name}" (${template.steps.length} steps) — local draft`);
    window.setTimeout(() => setSavedMessage(null), 3000);
  }, [template]);

  const resetTemplate = useCallback(() => {
    setTemplate(DEFAULT_WORKFLOW_TEMPLATE);
  }, []);

  return {
    template,
    setTemplate,
    addStep,
    removeStep,
    moveStep,
    saveTemplate,
    resetTemplate,
    savedMessage,
    palette: STEP_PALETTE,
  };
}
