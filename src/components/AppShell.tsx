import { NavLink, Outlet } from "react-router-dom";

const primaryNav = [
  { to: "/repositories", label: "Repositories" },
  { to: "/history", label: "History" },
  { to: "/diff", label: "Diff" },
] as const;

const phase1Nav = [
  { to: "/automation", label: "Automation", phase: "M3" },
  { to: "/review", label: "Review", phase: "M3" },
  { to: "/collab", label: "Collaboration", phase: "M3" },
] as const;

export function AppShell() {
  return (
    <div className="hb-app">
      <aside className="hb-sidebar" aria-label="Command center navigation">
        <div className="hb-brand">
          <h1>HummingBird</h1>
          <span>Workbench · v8 alpha</span>
        </div>
        <nav className="hb-nav">
          {primaryNav.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              {label}
            </NavLink>
          ))}
          <div className="hb-nav-section">Phase 1 stubs</div>
          {phase1Nav.map(({ to, label, phase }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [isActive ? "active" : "", "disabled"].filter(Boolean).join(" ")
              }
              title={`${label} — ${phase} (not in alpha)`}
              onClick={(e) => e.preventDefault()}
              aria-disabled="true"
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="hb-alpha-tag">Phase 0 · no CAD authoring</div>
      </aside>
      <main className="hb-main">
        <Outlet />
      </main>
    </div>
  );
}
