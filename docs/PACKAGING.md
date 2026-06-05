# HBW packaging (Phase 0 M3)

## CI

| Platform | Phase 0 | CI job | Notes |
|----------|---------|--------|-------|
| **macOS** | ✅ | `tauri-macos` in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) | Uploads `.dmg` / `.app` as workflow artifact |
| **Linux** | Deferred | — | AppImage/deb requires GTK/WebKit deps; target Phase 0.5 |
| **Windows** | Deferred | — | NSIS/MSI + code-signing; target Phase 0.5 |

Internal alpha distributes macOS CI artifacts only. Code signing is not required for Phase 0 exit.

## Local build

```bash
npm ci
npm run tauri:build
```

Artifacts: `src-tauri/target/release/bundle/`.
