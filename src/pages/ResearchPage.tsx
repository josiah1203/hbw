import { useState, type FormEvent } from "react";

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
      <header className="hb-header">
        <h2>Research capture</h2>
        <p>URL + note stub — persists to HOS object in Phase 0.5.</p>
      </header>
      <div className="hb-content">
        <form className="hb-research-form" onSubmit={handleCapture}>
          <label htmlFor="research-url">URL</label>
          <input
            id="research-url"
            type="url"
            placeholder="https://…"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <label htmlFor="research-note">Note</label>
          <textarea
            id="research-note"
            rows={4}
            placeholder="Why this link matters…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button type="submit" className="hb-btn">
            Capture locally
          </button>
        </form>
        {saved && (
          <pre className="hb-research-preview" aria-label="Captured payload">
            {saved}
          </pre>
        )}
      </div>
    </>
  );
}
