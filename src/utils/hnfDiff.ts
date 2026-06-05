import type { DiffChangeKind, HnfDiffHunk } from "@/types/diff";

/** Map HOS change_type to HBW diff kind. */
export function mapHosChangeType(changeType: string): DiffChangeKind {
  switch (changeType) {
    case "added":
      return "add";
    case "removed":
      return "remove";
    default:
      return "modify";
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Collect leaf-level path changes between two JSON values. */
export function collectJsonDiffPaths(
  from: unknown,
  to: unknown,
  prefix = "",
): string[] {
  if (from === to) return [];

  if (Array.isArray(from) && Array.isArray(to)) {
    if (from.length !== to.length) {
      return prefix ? [`${prefix} (array length ${from.length} → ${to.length})`] : [];
    }
    const changes: string[] = [];
    const len = Math.max(from.length, to.length);
    for (let i = 0; i < len; i += 1) {
      changes.push(...collectJsonDiffPaths(from[i], to[i], `${prefix}[${i}]`));
    }
    return changes;
  }

  if (isPlainObject(from) && isPlainObject(to)) {
    const keys = new Set([...Object.keys(from), ...Object.keys(to)]);
    const changes: string[] = [];
    for (const key of keys) {
      const next = prefix ? `${prefix}.${key}` : key;
      if (!(key in from)) {
        changes.push(`${next} (added)`);
      } else if (!(key in to)) {
        changes.push(`${next} (removed)`);
      } else {
        changes.push(...collectJsonDiffPaths(from[key], to[key], next));
      }
    }
    return changes;
  }

  const fromLabel =
    typeof from === "string" ? JSON.stringify(from) : String(from);
  const toLabel = typeof to === "string" ? JSON.stringify(to) : String(to);
  const path = prefix || "(root)";
  return [`${path}: ${fromLabel} → ${toLabel}`];
}

/** One-line summary for an HNF object diff. */
export function summarizeJsonDiff(from: unknown, to: unknown): string {
  const paths = collectJsonDiffPaths(from, to);
  if (paths.length === 0) return "No field changes detected";
  if (paths.length === 1) return paths[0] ?? "1 change";
  const preview = paths.slice(0, 3).join("; ");
  const extra = paths.length > 3 ? ` (+${paths.length - 3} more)` : "";
  return `${paths.length} changes: ${preview}${extra}`;
}

export interface HosDiffEntry {
  path: string;
  change_type: string;
  from_value?: unknown;
  to_value?: unknown;
  model?: string | null;
}

/** Convert HOS diff entries to HBW hunks with client-side JSON summaries. */
export function mapHosDiffEntries(entries: HosDiffEntry[]): HnfDiffHunk[] {
  return entries.map((entry) => {
    const kind = mapHosChangeType(entry.change_type);
    let summary: string;
    switch (kind) {
      case "add":
        summary = entry.to_value !== undefined
          ? summarizeJsonDiff(undefined, entry.to_value)
          : "Object added";
        break;
      case "remove":
        summary = entry.from_value !== undefined
          ? summarizeJsonDiff(entry.from_value, undefined)
          : "Object removed";
        break;
      default:
        summary = summarizeJsonDiff(entry.from_value, entry.to_value);
    }
    if (entry.model) {
      summary = `[${entry.model}] ${summary}`;
    }
    return { path: entry.path, kind, summary };
  });
}

/** Client-side structural diff between two HNF tree maps (path → value). */
export function diffHnfTrees(
  base: Record<string, unknown>,
  head: Record<string, unknown>,
): HnfDiffHunk[] {
  const paths = new Set([...Object.keys(base), ...Object.keys(head)]);
  const hunks: HnfDiffHunk[] = [];

  for (const path of [...paths].sort()) {
    const fromValue = base[path];
    const toValue = head[path];
    if (fromValue === undefined && toValue !== undefined) {
      hunks.push({
        path,
        kind: "add",
        summary: summarizeJsonDiff(undefined, toValue),
      });
    } else if (fromValue !== undefined && toValue === undefined) {
      hunks.push({
        path,
        kind: "remove",
        summary: summarizeJsonDiff(fromValue, undefined),
      });
    } else if (
      fromValue !== undefined &&
      toValue !== undefined &&
      JSON.stringify(fromValue) !== JSON.stringify(toValue)
    ) {
      hunks.push({
        path,
        kind: "modify",
        summary: summarizeJsonDiff(fromValue, toValue),
      });
    }
  }

  return hunks;
}
