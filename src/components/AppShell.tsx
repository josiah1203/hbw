import { Outlet } from "react-router-dom";
import { AppFooter } from "@/components/layout/AppFooter";
import { SideNav } from "@/components/layout/SideNav";
import { TopBar } from "@/components/layout/TopBar";

export function AppShell() {
  return (
    <div className="st-app">
      <TopBar />
      <div className="st-body">
        <SideNav />
        <main className="st-main">
          <div className="st-main-inner">
            <Outlet />
          </div>
        </main>
      </div>
      <AppFooter />
    </div>
  );
}
