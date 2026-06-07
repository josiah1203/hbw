import { PageHeader } from "@/components/layout/PageHeader";
import { useWorkflowComposer } from "@/hooks/useWorkflowComposer";

export function WorkflowComposerPage() {
  const {
    template,
    setTemplate,
    addStep,
    removeStep,
    moveStep,
    saveTemplate,
    resetTemplate,
    savedMessage,
    palette,
  } = useWorkflowComposer();

  return (
    <>
      <PageHeader
        title="Workflow Composer"
        description="Visual step builder — trigger → condition → action chains (Phase 1 M5)"
        meta={savedMessage ?? undefined}
      />

      <div className="hb-composer-layout">
        <aside className="hb-composer-palette" aria-label="Step palette">
          <h3 className="st-section-title">Add step</h3>
          <ul className="hb-palette-list">
            {palette.map((item, index) => (
              <li key={`${item.kind}-${item.label}`}>
                <button
                  type="button"
                  className="st-btn"
                  onClick={() => addStep(index)}
                >
                  <span className="material-symbols-outlined st-icon-sm" aria-hidden="true">
                    add
                  </span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="st-panel" aria-label="Workflow canvas">
          <div className="st-panel-toolbar">
            <div className="st-panel-toolbar-start">
              <label htmlFor="wf-name" className="st-label">
                Workflow name
              </label>
              <input
                id="wf-name"
                className="st-input"
                value={template.name}
                onChange={(e) => setTemplate({ ...template, name: e.target.value })}
              />
            </div>
            <div className="st-panel-toolbar-end">
              <button type="button" className="st-btn st-btn--primary" onClick={saveTemplate}>
                Save draft
              </button>
              <button type="button" className="st-btn" onClick={resetTemplate}>
                Reset
              </button>
            </div>
          </div>

          <div className="st-panel-body">
            <ol className="hb-step-chain">
              {template.steps.map((step, index) => (
                <li key={step.id} className={`hb-step hb-step-${step.kind}`}>
                  <div className="hb-step-header">
                    <span className="st-badge st-badge--tertiary">{step.kind}</span>
                    <strong>{step.label}</strong>
                    <span className="st-badge st-badge--muted">#{index + 1}</span>
                  </div>
                  <dl className="hb-step-config">
                    {Object.entries(step.config).map(([key, value]) => (
                      <div key={key}>
                        <dt>{key}</dt>
                        <dd>
                          <code className="st-mono">{value}</code>
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <div className="hb-step-actions">
                    <button
                      type="button"
                      className="st-btn"
                      disabled={index === 0}
                      onClick={() => moveStep(step.id, -1)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="st-btn"
                      disabled={index === template.steps.length - 1}
                      onClick={() => moveStep(step.id, 1)}
                    >
                      ↓
                    </button>
                    <button type="button" className="st-btn" onClick={() => removeStep(step.id)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ol>
            {template.steps.length === 0 && (
              <p className="st-empty">Add steps from the palette to build a workflow.</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
