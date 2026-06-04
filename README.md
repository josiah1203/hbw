# hbw — HummingBird Workbench

Apache 2.0 Tauri **command center** (not a CAD authoring tool).

## Phase 0 alpha (M2)

| Route | View | Status |
|-------|------|--------|
| `#/repositories` | Repository list (mock HOS data) | alpha |
| `#/history` · `#/history/:repoId` | Commit DAG placeholder | alpha |
| `#/diff` | HNF diff shell (mock hunks) | alpha |
| `#/automation` · `#/review` · `#/collab` | M3 stubs (sidebar disabled) | stub |

Layout: sidebar + main panel (“command center”). Types live in `src/types/`; mock data in `src/data/mock.ts`.

## Prerequisites

- **Node.js** 20+ and npm
- **Tauri desktop** (optional for native shell): Rust toolchain, platform deps per [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/)

## Development

```bash
npm install

# Frontend only (Vite + React)
npm run dev          # http://localhost:5173

# Full Tauri app (requires Rust + system libs)
npm run tauri:dev
```

## Verify / build

```bash
# Typecheck + production frontend bundle (CI and hb-platform verify)
npm run build
# or
npm test             # same as build for alpha

# From hb-platform meta repo:
make -C ../hb-platform hb-verify-hbw
```

`hb-verify-hbw` runs `npm test` when `../hbw` exists. It does not require Tauri/Rust.

Native release build (local only, needs Tauri deps):

```bash
npm run tauri:build
```

## Stack

- React 18 + TypeScript (strict) + Vite 5
- React Router (hash routes for Tauri `file://` compatibility)
- Tauri 2 shell in `src-tauri/`

## Related repos

- Protocol: [`hbp-protocol`](../hbp-protocol)
- Cloud API: private [`hbp-cloud`](../hbp-cloud)
- Coordination: [`hb-platform`](../hb-platform) — `make hb-verify-hbw`, worktrees via `./scripts/hb-worktree.sh create hbw`

## Worktree (optional)

```bash
cd /path/to/hb-platform
./scripts/hb-worktree.sh create hbw
cd ../hb-v8-hbw
git checkout -b feat/hb-v8-hbw-alpha-shell
```
