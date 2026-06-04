import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { DiffPage } from "@/pages/DiffPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { RepositoriesPage } from "@/pages/RepositoriesPage";
import { StubPage } from "@/pages/StubPage";

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/repositories" replace />} />
        <Route path="repositories" element={<RepositoriesPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="history/:repoId" element={<HistoryPage />} />
        <Route path="diff" element={<DiffPage />} />
        <Route
          path="automation"
          element={
            <StubPage
              title="Automation Studio"
              milestone="M3"
              description="Built-in workflow checks and composer."
            />
          }
        />
        <Route
          path="review"
          element={
            <StubPage
              title="Review"
              milestone="M3"
              description="Review comments and approval shell."
            />
          }
        />
        <Route
          path="collab"
          element={
            <StubPage
              title="Collaboration"
              milestone="M3"
              description="Presence and activity feed."
            />
          }
        />
        <Route path="*" element={<Navigate to="/repositories" replace />} />
      </Route>
    </Routes>
  );
}
