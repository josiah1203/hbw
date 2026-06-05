/** Local-only heuristics for ai-local sidebar (no cloud AI). */

export type HeuristicSeverity = "warning" | "info" | "error";

export interface AiLocalInsight {
  id: string;
  severity: HeuristicSeverity;
  title: string;
  detail: string;
}

export interface ProjectHeuristicContext {
  bomRowCount?: number;
  schematicRefCount?: number;
  layoutRefCount?: number;
  domainsPresent?: string[];
  eolFlaggedParts?: string[];
}

export function evaluateAiLocalHeuristics(
  ctx: ProjectHeuristicContext,
): AiLocalInsight[] {
  const insights: AiLocalInsight[] = [];

  const bomRows = ctx.bomRowCount ?? 0;
  const schematicRefs = ctx.schematicRefCount ?? 0;
  if (bomRows > 0 && schematicRefs > 0 && bomRows !== schematicRefs) {
    insights.push({
      id: "bom-sync",
      severity: "warning",
      title: "BOM sync mismatch",
      detail: `BOM has ${bomRows} rows but schematic lists ${schematicRefs} refs — review before commit.`,
    });
  } else if (bomRows === 0 && schematicRefs > 0) {
    insights.push({
      id: "bom-sync-empty",
      severity: "warning",
      title: "BOM sync warning",
      detail: "Schematic has components but BOM is empty.",
    });
  }

  const eolParts = ctx.eolFlaggedParts ?? [];
  if (eolParts.length > 0) {
    insights.push({
      id: "eol-flag",
      severity: "error",
      title: "EOL parts flagged",
      detail: `${eolParts.length} part(s) marked end-of-life (placeholder): ${eolParts.slice(0, 3).join(", ")}${eolParts.length > 3 ? "…" : ""}`,
    });
  } else {
    insights.push({
      id: "eol-placeholder",
      severity: "info",
      title: "EOL check (placeholder)",
      detail: "No EOL flags in local cache — connect Octopart enrichment in Phase 0.5.",
    });
  }

  const domains = new Set(ctx.domainsPresent ?? []);
  if (domains.has("schematic") && domains.has("layout")) {
    const layoutRefs = ctx.layoutRefCount ?? schematicRefs;
    if (layoutRefs !== schematicRefs && schematicRefs > 0) {
      insights.push({
        id: "cross-domain",
        severity: "warning",
        title: "Cross-domain consistency",
        detail: `Schematic (${schematicRefs}) and layout (${layoutRefs}) ref counts differ.`,
      });
    }
  }

  if (domains.size >= 3) {
    insights.push({
      id: "multi-domain",
      severity: "info",
      title: "Multi-domain project",
      detail: `Active domains: ${[...domains].sort().join(", ")} — run cross_domain.consistency workflow.`,
    });
  }

  return insights;
}
