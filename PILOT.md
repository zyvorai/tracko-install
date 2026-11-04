# Tracko private-hub pilot

**Status:** deployment-ready for pilot (API `0.3.0` · plan `world_class`)

## Deploy the hub

```bash
cp .env.example .env
./scripts/deploy-hub.sh                 # Docker: Postgres + API
./scripts/deploy-hub.sh --with-install  # + Muse install site :8787
./scripts/smoke-deploy.sh
```

Hard pilot (no demo OTP, strong JWT, Postgres SoT):

```bash
cp .env.example .env.prod
# set POSTGRES_PASSWORD, JWT_SECRET (≥24), DEMO_MODE=false
./scripts/deploy-hub.sh --prod
STRICT=1 ./scripts/smoke-deploy.sh
```

Full notes: [DEPLOYMENT.md](../DEPLOYMENT.md)

## Local URLs (this machine)

| Service | URL |
|---------|-----|
| API hub | http://127.0.0.1:8080/health |
| Install site | http://127.0.0.1:8787/ |
| Desktop UI (vite) | http://127.0.0.1:5173/ |
| Web portal | http://127.0.0.1:5174/ |
| Driver | http://127.0.0.1:5175/ |
| Scanner | http://127.0.0.1:5176/?pair=SCAN-DEMO |

Install (Muse-style — command only):

```bash
curl -fsSL http://127.0.0.1:8787/install.sh | bash
```

Point desktop **Server / Settings** at `http://127.0.0.1:8080` (or LAN IP of this hub).

## Intel Mac / Windows testers

- **Apple Silicon** Mac: `curl -fsSL https://zyvorai.github.io/tracko-install/install.sh | bash` (arm64 DMG).
- **Intel Mac:** install.sh / DMG is arm64-first. Use hub PWAs in Chrome:
  - `http://<hub>:8088/app/` · `/driver/` · `/scanner/?pair=SCAN-DEMO`
  - Or build desktop from source: `cd apps/desktop && npm i && npm run tauri build` (native arch).
- **Windows:** Setup.exe is not in the UAT pack — same hub PWAs in Edge/Chrome.

## Pilot caveats

- India rails (NIC/ULIP/WhatsApp/FASTag/payouts) = **demo** until env credentials ([INTEGRATIONS.md](INTEGRATIONS.md)); `/health` → `integrations` shows live|demo
- Windows Setup.exe is fetched by `install.ps1` when present under `site/downloads/`
- Store with Docker / `DATABASE_URL` = Postgres SoT + JSON cache (`postgres+json-cache`). Optional: `TRACKO_STORE_MODE=postgres`, `TRACKO_PG_SYNC_SECS=20`
- Prefer hub on `:8088` if `:8080` is taken (e.g. Setura); smoke: `./scripts/smoke-onboard.sh http://127.0.0.1:8088`
- Public install: https://zyvorai.github.io/tracko-install/ · phones: [MOBILE_RELEASE.md](MOBILE_RELEASE.md)
- Full remaining-gap report (implemented demo wiring): [Tracko UAT remaining gaps.md](../reports/Tracko%20UAT%20remaining%20gaps.md)
