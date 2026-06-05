import { useMemo } from "react";
import {
  evaluateAiLocalHeuristics,
  type AiLocalInsight,
} from "@/utils/aiLocalHeuristics";

interface AiLocalSidebarProps {
  bomRowCount?: number;
  schematicRefCount?: number;
  layoutRefCount?: number;
  domainsPresent?: string[];
}

function InsightRow({ insight }: { insight: AiLocalInsight }) {
  return (
    <li className={`hb-ai-insight hb-ai-${insight.severity}`}>
      <strong>{insight.title}</strong>
      <span>{insight.detail}</span>
    </li>
  );
}

export function AiLocalSidebar({
  bomRowCount = 12,
  schematicRefCount = 10,
  layoutRefCount = 10,
  domainsPresent = ["schematic", "bom", "layout"],
}: AiLocalSidebarProps) {
  const insights = useMemo(
    () =>
      evaluateAiLocalHeuristics({
        bomRowCount,
        schematicRefCount,
        layoutRefCount,
        domainsPresent,
        eolFlaggedParts: [],
      }),
    [bomRowCount, schematicRefCount, layoutRefCount, domainsPresent],
  );

  return (
    <aside className="hb-ai-local" aria-label="Local design insights">
      <div className="hb-ai-local-header">
        <h3>ai-local</h3>
        <span>Heuristics only</span>
      </div>
      <ul className="hb-ai-insight-list">
        {insights.map((insight) => (
          <InsightRow key={insight.id} insight={insight} />
        ))}
      </ul>
    </aside>
  );
}
