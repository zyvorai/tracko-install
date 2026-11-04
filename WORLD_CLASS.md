# Tracko world-class mid-market matrix

Positioning: best **private-install** TMS for mid-market carriers/3PLs/shippers — India-native + global table-stakes.

| Gartner / global need | Tracko API | Status |
|----------------------|------------|--------|
| Track & trace | GPS, AIS-140, visibility partner | Demo + `VISIBILITY_PROVIDER_URL` |
| Freight audit vs charges | `/api/v1/fap/*` 3-way match | Done |
| Embedded analytics / carbon | `/api/v1/carbon/*` GLEC_demo | Done |
| Carrier electronic tender | `/api/v1/carriers/tenders` EDI 204/990 | Done |
| Dock / appointments | `/api/v1/dock/appointments` | Done |
| Continuous re-opt | `/api/v1/replan/now` | Done |
| Predictive ETA + playbooks | `/api/v1/eta/*` | Done |
| Multimodal rating | `/api/v1/rating/quote` road/ltl/ocean/parcel | Demo + partner env |
| Contract→spot cascade | `/api/v1/cascade/:id` | Done |
| Parcel shop + labels | `/api/v1/parcel/*` | Done |
| Load build / util | `/api/v1/load/build` | Done |
| Agentic ops | `/api/v1/agents/*` | Guardrailed |
| ELD/HOS pre-dispatch | `/api/v1/eld/*` | Done |
| Light EXIM checklist | `/api/v1/exim/*` | Done |
| OpenAPI / webhooks / tenants | `/api/v1/platform/*` | Done |

## Phase D production checklist

1. Hub: `./scripts/deploy-hub.sh --prod` (Postgres SoT, `DEMO_MODE=false`, strong `JWT_SECRET`) — see private repo `DEPLOYMENT.md`
2. Set NIC/ULIP/WhatsApp/FASTag/Tally/Razorpay per [INTEGRATIONS.md](INTEGRATIONS.md) when buyer credentials exist (`/health` → `integrations`)
3. Optional: `TRACKO_STORE_MODE=postgres` to force PG snapshot hydrate
4. Run GitHub Action **Desktop Windows** → copy `Tracko-TMS-Setup-x64.exe` into downloads
5. Phones: sideload IPA/APK or `EXPORT_METHOD=app-store` + TestFlight — [MOBILE_RELEASE.md](MOBILE_RELEASE.md)
6. Apple notarize secrets on **Desktop macOS** workflow
7. TLS via Caddy/ingress in front of API + install host

Version: API `0.3.0` · plan `world_class`
