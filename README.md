# hbw — HummingBird Workbench

Apache 2.0 Tauri **command center** (not a CAD authoring tool).

## Phase 0 layout (v8 plan)

```
┌─────────────────────────────────────────────────────────────┐
│  Sidebar          │  Main panel                             │
│  ─ Repos          │  M2: commit DAG / branch list           │
│  ─ Branches       │  M2: HNF diff viewer shell              │
│  ─ Automation     │  M3: Automation Studio (built-in checks) │
│  ─ Review         │  M3: review comments shell              │
│  ─ Collaboration  │  M3: presence + activity feed           │
└─────────────────────────────────────────────────────────────┘
```

| Milestone | UI surface |
|-----------|------------|
| M2 alpha | Repo list, commit DAG, basic HNF diff |
| M3 | Research capture stub, Automation Studio v0.1, review shell, collab feed |

## Routes (frontend scaffold)

| Route | Purpose | Status |
|-------|---------|--------|
| `#/` | Home / repo list | stub |
| `#/repo/:id` | Commit DAG | stub |
| `#/diff` | HNF diff viewer | stub |
| `#/automation` | Workflow built-ins | stub |
| `#/review` | Review panel | stub |
| `#/collab` | Collaboration feed | stub |

## Dev

```bash
npm install
npm run tauri dev   # when Tauri toolchain installed
npm test            # scaffold smoke
```

Protocol: [`hbp-protocol`](../hbp-protocol). Cloud API: private [`hbp-cloud`](../hbp-cloud).
