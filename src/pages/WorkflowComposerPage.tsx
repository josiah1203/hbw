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
      <header className="hb-header">
        <h2>Workflow Composer</h2>
        <p>Visual step builder — trigger → condition → action chains (Phase 1 M5)</p>
        {savedMessage && <p className="hb-meta">{savedMessage}</p>}
      </header>
      <div className="hb-content hb-composer-layout">
        <aside className="hb-composer-palette" aria-label="Step palette">
          <h3 className="hb-section-title">Add step</h3>
          <ul className="hb-palette-list">
            {palette.map((item, index) => (
              <li key={`${item.kind}-${item.label}`}>
                <button type="button" className="hb-btn hb-btn-secondary" onClick={() => addStep(index)}>
                  + {item.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="hb-composer-canvas" aria-label="Workflow canvas">
          <div className="hb-select-row">
            <label htmlFor="wf-name">Workflow name</label>
            <input
              id="wf-name"
              value={template.name}
              onChange={(e) => setTemplate({ ...template, name: e.target.value })}
            />
            <button type="button" onClick={saveTemplate}>
              Save draft
            </button>
            <button type="button" onClick={resetTemplate}>
              Reset
            </button>
          </div>

          <ol className="hb-step-chain">
            {template.steps.map((step, index) => (
              <li key={step.id} className={`hb-step hb-step-${step.kind}`}>
                <div className="hb-step-header">
                  <span className="hb-badge">{step.kind}</span>
                  <strong>{step.label}</strong>
                  <span className="hb-step-index">#{index + 1}</span>
                </div>
                <dl className="hb-step-config">
                  {Object.entries(step.config).map(([key, value]) => (
                    <div key={key}>
                      <dt>{key}</dt>
                      <dd>
                        <code>{value}</code>
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="hb-step-actions">
                  <button type="button" disabled={index === 0} onClick={() => moveStep(step.id, -1)}>
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={index === template.steps.length - 1}
                    onClick={() => moveStep(step.id, 1)}
                  >
                    ↓
                  </button>
                  <button type="button" onClick={() => removeStep(step.id)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ol>
          {template.steps.length === 0 && (
            <p className="hb-empty">Add steps from the palette to build a workflow.</p>
          )}
        </section>
      </div>
    </>
  );
}
