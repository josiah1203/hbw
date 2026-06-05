import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { AutomationPage } from "@/pages/AutomationPage";
import { CollabPage } from "@/pages/CollabPage";
import { DiffPage } from "@/pages/DiffPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { RepositoriesPage } from "@/pages/RepositoriesPage";
import { ResearchPage } from "@/pages/ResearchPage";
import { ReviewPage } from "@/pages/ReviewPage";

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/repositories" replace />} />
        <Route path="repositories" element={<RepositoriesPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="history/:repoId" element={<HistoryPage />} />
        <Route path="diff" element={<DiffPage />} />
        <Route path="automation" element={<AutomationPage />} />
        <Route path="review" element={<ReviewPage />} />
        <Route path="review/:commitId" element={<ReviewPage />} />
        <Route path="collab" element={<CollabPage />} />
        <Route path="research" element={<ResearchPage />} />
        <Route path="*" element={<Navigate to="/repositories" replace />} />
      </Route>
    </Routes>
  );
}
