import { NavLink } from "react-router-dom";
import { AiLocalSidebar } from "@/components/AiLocalSidebar";

interface NavItem {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
}

const viewsNav: NavItem[] = [
  { to: "/repositories", label: "Repos", icon: "inventory_2", end: true },
  { to: "/history", label: "History", icon: "history" },
  { to: "/diff", label: "Diff", icon: "compare" },
];

const workflowNav: NavItem[] = [
  { to: "/automation", label: "Automation", icon: "smart_toy", end: true },
  { to: "/automation/composer", label: "Composer", icon: "hub" },
  { to: "/automation/marketplace", label: "Marketplace", icon: "storefront" },
];

const collabNav: NavItem[] = [
  { to: "/review", label: "Review", icon: "rate_review" },
  { to: "/collab", label: "Collab", icon: "groups", end: true },
  { to: "/research", label: "Research", icon: "science" },
];

function NavSection({
  title,
  items,
  showAdd,
}: {
  title: string;
  items: NavItem[];
  showAdd?: boolean;
}) {
  return (
    <div className="st-sidenav-section">
      <div className="st-sidenav-section-head">
        <span className="st-sidenav-section-label">{title}</span>
        {showAdd && (
          <button type="button" className="st-sidenav-section-action" aria-label={`Add ${title} view`}>
            <span className="material-symbols-outlined" aria-hidden="true">
              add
            </span>
          </button>
        )}
      </div>
      {items.map(({ to, label, icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `st-sidenav-link${isActive ? " st-sidenav-link--active" : ""}`
          }
        >
          <span className="material-symbols-outlined st-sidenav-icon" aria-hidden="true">
            {icon}
          </span>
          {label}
        </NavLink>
      ))}
    </div>
  );
}

export function SideNav() {
  return (
    <aside className="st-sidenav" aria-label="Section navigation">
      <nav className="st-sidenav-nav">
        <NavSection title="Views" items={viewsNav} showAdd />
        <NavSection title="Workflow" items={workflowNav} />
        <NavSection title="Collaboration" items={collabNav} />
      </nav>
      <div className="st-sidenav-insights">
        <AiLocalSidebar />
      </div>
      <div className="st-sidenav-footer">
        <span className="st-badge st-badge--muted">Phase 1 · workflow cloud</span>
      </div>
    </aside>
  );
}
