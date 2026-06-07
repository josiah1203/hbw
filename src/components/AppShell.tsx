import { NavLink, Outlet } from "react-router-dom";
import { AiLocalSidebar } from "@/components/AiLocalSidebar";

const primaryNav = [
  { to: "/repositories", label: "Repositories" },
  { to: "/history", label: "History" },
  { to: "/diff", label: "Diff" },
] as const;

const m3Nav = [
  { to: "/automation", label: "Automation" },
  { to: "/automation/composer", label: "Composer" },
  { to: "/automation/marketplace", label: "Marketplace" },
  { to: "/review", label: "Review" },
  { to: "/collab", label: "Collaboration" },
  { to: "/research", label: "Research" },
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
          <div className="hb-nav-section">M3 · Integration</div>
          {m3Nav.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <AiLocalSidebar />
        <div className="hb-alpha-tag">Phase 1 · workflow cloud</div>
      </aside>
      <main className="hb-main">
        <Outlet />
      </main>
    </div>
  );
}
