# tracko-install — agent handoff

Public beta install site for Tracko. **Not** the application source (that lives in `zyvorai/tracko`).

## Status

Vendor UAT + Amazing iOS sideload plans are **done**. This site hosts:

- Homepage **Downloads**: Mac DMG, Driver/Scanner IPA + APK
- Muse-style Mac one-liner still available: `install.sh` / `install.ps1`
- Docs: `VENDOR_UAT.md`, `MOBILE_RELEASE.md`, etc.

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
