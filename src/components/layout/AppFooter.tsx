const LEGAL_BASE = "https://hummingbird.dev";

export function AppFooter() {
  return (
    <footer className="st-footer" aria-label="Application footer">
      <div className="st-footer-start">
        <span className="st-footer-brand">
          <span className="material-symbols-outlined st-icon-sm" aria-hidden="true">
            terminal
          </span>
          HummingBird Workbench © {new Date().getFullYear()}
        </span>
        <a className="st-footer-link" href={`${LEGAL_BASE}/terms`} target="_blank" rel="noreferrer">
          Terms
        </a>
        <a className="st-footer-link" href={`${LEGAL_BASE}/privacy`} target="_blank" rel="noreferrer">
          Privacy
        </a>
        <a className="st-footer-link" href={`${LEGAL_BASE}/docs`} target="_blank" rel="noreferrer">
          Docs
        </a>
      </div>
      <div className="st-footer-end">
        <span className="st-status">
          <span className="st-status-dot" aria-hidden="true" />
          System Status: Nominal
        </span>
        <a className="st-footer-link" href={`${LEGAL_BASE}/api`} target="_blank" rel="noreferrer">
          API Docs
        </a>
        <a className="st-footer-link" href={`${LEGAL_BASE}/support`} target="_blank" rel="noreferrer">
          Contact Support
        </a>
      </div>
    </footer>
  );
}
