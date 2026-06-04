interface StubPageProps {
  title: string;
  milestone: string;
  description: string;
}

export function StubPage({ title, milestone, description }: StubPageProps) {
  return (
    <>
      <header className="hb-header">
        <h2>{title}</h2>
        <p>{description}</p>
      </header>
      <div className="hb-content">
        <p className="hb-empty">
          {milestone} — not implemented in Phase 0 alpha.
        </p>
      </div>
    </>
  );
}
