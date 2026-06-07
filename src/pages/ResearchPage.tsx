import { useState, type FormEvent } from "react";
import { PageHeader } from "@/components/layout/PageHeader";

export function ResearchPage() {
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState<string | null>(null);

  function handleCapture(e: FormEvent) {
    e.preventDefault();
    const payload = {
      url: url.trim(),
      note: note.trim(),
      captured_at: new Date().toISOString(),
    };
    setSaved(JSON.stringify(payload, null, 2));
  }

  return (
    <>
      <PageHeader
        title="Research capture"
        description="URL + note stub — persists to HOS object in Phase 0.5."
      />

      <div className="st-panel">
        <div className="st-panel-toolbar">
          <div className="st-panel-toolbar-start">
            <span className="material-symbols-outlined st-icon-sm" aria-hidden="true">
              science
            </span>
            <span className="st-panel-title">Capture reference</span>
          </div>
        </div>
        <div className="st-panel-body">
          <form className="hb-research-form" onSubmit={handleCapture}>
            <label htmlFor="research-url" className="st-label">
              URL
            </label>
            <input
              id="research-url"
              className="st-input"
              type="url"
              placeholder="https://…"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <label htmlFor="research-note" className="st-label">
              Note
            </label>
            <textarea
              id="research-note"
              className="st-input"
              rows={4}
              placeholder="Why this link matters…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button type="submit" className="st-btn st-btn--primary">
              <span className="material-symbols-outlined st-icon-sm" aria-hidden="true">
                bookmark_add
              </span>
              Capture locally
            </button>
          </form>
          {saved && (
            <pre className="hb-research-preview st-mono" aria-label="Captured payload">
              {saved}
            </pre>
          )}
        </div>
      </div>
    </>
  );
}
