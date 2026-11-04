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

## Pilot caveats

- India rails (NIC/ULIP/WhatsApp/FASTag/payouts) = **demo** until env credentials ([INTEGRATIONS.md](INTEGRATIONS.md))
- Windows Setup.exe is fetched by `install.ps1` when present under `site/downloads/` — not linked as a public CTA
- Store with Docker = Postgres SoT + JSON cache (`postgres+json-cache` after first sync)
- Public install: https://zyvorai.github.io/tracko-install/
