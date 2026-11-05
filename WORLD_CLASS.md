# Tracko world-class mid-market matrix

Positioning: best **private-install** TMS for mid-market carriers/3PLs/shippers — India-native + global table-stakes.

| Gartner / global need | Tracko API | Status |
|----------------------|------------|--------|
| Track & trace | GPS, AIS-140, visibility partner | Demo + `VISIBILITY_PROVIDER_URL` |
| Freight audit vs charges | `/api/v1/fap/*` 3-way match | Done |
| Embedded analytics / carbon | `/api/v1/carbon/*` GLEC_demo | Done |
| Carrier electronic tender | `/api/v1/carriers/tenders` EDI 204/990 | Done. Under RBAC a carrier uses its own `X-Carrier-Key` for list / accept / reject; every other `/carriers/*` route is staff-only |
| Dock / appointments | `/api/v1/dock/appointments` | Done |
| Continuous re-opt | `/api/v1/replan/now` | Manual re-plan only (`/replan/auto` is an in-memory demo toggle, nothing replans automatically) |
| Predictive ETA + playbooks | `/api/v1/eta/*` | Done |
| Multimodal rating | `/api/v1/rating/quote` road/ltl/ocean/parcel | Demo + partner env |
| Contract→spot cascade | `/api/v1/cascade/:id` | Done |
| Parcel shop + labels | `/api/v1/parcel/*` | Done |
| Load build / util | `/api/v1/load/build` | Done |
| Agentic ops | `/api/v1/agents/*` | Guardrailed |
| ELD/HOS pre-dispatch | `/api/v1/eld/*` | Done |
| Light EXIM checklist | `/api/v1/exim/*` | Done |
| OpenAPI / webhooks / tenants | `/api/v1/platform/*` | OpenAPI served; webhook subscriptions are stored but nothing delivers events yet; tenants are labels only (no data scoping) |

## Phase D production checklist

1. Hub: `./scripts/deploy-hub.sh --prod` (Postgres, `DEMO_MODE=false`, random `JWT_SECRET`, `RBAC_PASSWORD`; the hub starts empty with one admin) — see `DEPLOYMENT.md` and OPS.md
2. Set NIC/ULIP/WhatsApp/FASTag/Tally/Razorpay per INTEGRATIONS.md when buyer credentials exist (`/health` → `integrations`)
3. Optional: `TRACKO_STORE_MODE=postgres` to force PG snapshot hydrate
4. Run GitHub Action **Desktop Windows**, then `./scripts/publish-windows-from-ci.sh --latest`
5. Phones: sideload IPA/APK or `EXPORT_METHOD=app-store` + TestFlight — MOBILE_RELEASE.md
6. Apple notarize secrets on **Desktop macOS** workflow
7. TLS via Caddy/ingress in front of API + install host

Version: API `0.3.0` · plan `world_class`
