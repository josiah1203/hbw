import { NavLink, useLocation } from "react-router-dom";

const topTabs = [
  { to: "/repositories", label: "Projects", icon: "folder" },
  { to: "/history", label: "History", icon: "history" },
  { to: "/diff", label: "Diff", icon: "compare" },
  { to: "/automation", label: "Workflow", icon: "account_tree", matchPrefix: "/automation" },
  { to: "/review", label: "Review", icon: "rate_review" },
  { to: "/collab", label: "Collab", icon: "groups" },
] as const;

function isTabActive(pathname: string, to: string, matchPrefix?: string): boolean {
  if (matchPrefix) {
    return pathname === to || pathname.startsWith(`${matchPrefix}/`) || pathname === matchPrefix;
  }
  if (to === "/history") {
    return pathname === "/history" || pathname.startsWith("/history/");
  }
  if (to === "/review") {
    return pathname === "/review" || pathname.startsWith("/review/");
  }
  return pathname === to || pathname.startsWith(`${to}?`);
}

export function TopBar() {
  const { pathname } = useLocation();

  return (
    <header className="st-topbar" aria-label="Global navigation">
      <div className="st-topbar-start">
        <span className="material-symbols-outlined st-topbar-logo" aria-hidden="true">
          account_tree
        </span>
        <div className="st-breadcrumb">
          <span className="st-breadcrumb-org">HummingBird</span>
          <span className="st-breadcrumb-sep">/</span>
          <span className="st-breadcrumb-repo">Workbench</span>
        </div>
        <nav className="st-top-tabs" aria-label="Primary views">
          {topTabs.map(({ to, label, icon, ...rest }) => {
            const matchPrefix = "matchPrefix" in rest ? rest.matchPrefix : undefined;
            const active = isTabActive(pathname, to, matchPrefix);
            return (
              <NavLink
                key={to}
                to={to}
                className={`st-top-tab${active ? " st-top-tab--active" : ""}`}
              >
                <span className="material-symbols-outlined st-icon-sm" aria-hidden="true">
                  {icon}
                </span>
                {label}
              </NavLink>
            );
          })}
        </nav>
      </div>
      <div className="st-topbar-end">
        <div className="st-search">
          <span className="material-symbols-outlined st-icon-sm st-search-icon" aria-hidden="true">
            search
          </span>
          <input
            type="search"
            className="st-search-input"
            placeholder="Search project…"
            aria-label="Search project"
          />
          <kbd className="st-search-kbd">/</kbd>
        </div>
        <button type="button" className="st-icon-btn" aria-label="Notifications">
          <span className="material-symbols-outlined" aria-hidden="true">
            notifications
          </span>
        </button>
        <button type="button" className="st-icon-btn" aria-label="Settings">
          <span className="material-symbols-outlined" aria-hidden="true">
            settings
          </span>
        </button>
        <div className="st-avatar" aria-hidden="true">
          <span>HB</span>
        </div>
      </div>
    </header>
  );
}
