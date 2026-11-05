# tracko-install — agent handoff

Public beta install site for Tracko. **Not** the application source (that lives in `zyvorai/tracko`).

## Status

Docs were refreshed against the hub on 2026-11-05 (hardening, production mode, restore, Hindi/Gujarati portal): `CHANGELOG.md` 0.4.0 and the six synced guides below are current. IPA/APK/DMG binaries were rebuilt from the same code (DMG signed, not notarized; IPAs development export). This site hosts:

- Homepage **Downloads**: Mac DMG, Driver/Scanner IPA + APK
- Muse-style Mac one-liner: `install.sh` / `install.ps1`
- Docs: `VENDOR_UAT.md`, `MOBILE_RELEASE.md`, `INTEGRATIONS.md`, `WHATSAPP.md`, `PILOT.md`, `WORLD_CLASS.md` are **copies of `docs/` in the tracko repo** — edit them there, then run `./scripts/sync-guides.sh` (copies them and turns links to unpublished docs into plain text) so the two never drift.

Live: https://zyvorai.github.io/tracko-install/

## Deploy Pages (prefer local)

```bash
./scripts/deploy-pages-local.sh
```

Force-pushes orphan `gh-pages`. Repo Pages setting must stay **legacy / branch `gh-pages` / path `/`**.

Pushing `main` also deploys via `.github/workflows/pages.yml` → `gh-pages`.

## Rules

- Keep the `#downloads` section with working IPA/APK/DMG links — vendors need them.
- Point agents doing product work at the **tracko** repo `AGENTS.md`.
