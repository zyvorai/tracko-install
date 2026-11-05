# Tracko world-class mid-market matrix

Positioning: best **private-install** TMS for mid-market carriers/3PLs/shippers — India-native + global table-stakes.

| Gartner / global need | Tracko API | Status |
|----------------------|------------|--------|
| Track & trace | GPS, AIS-140, visibility partner | Demo + `VISIBILITY_PROVIDER_URL` |
| Freight audit vs charges | `/api/v1/fap/*` 3-way match | Done |
| Embedded analytics / carbon | `/api/v1/carbon/*` GLEC_demo | Done |
| Carrier electronic tender | `/api/v1/carriers/tenders` EDI 204/990 | Done. Under RBAC a carrier uses its own `X-Carrier-Key` for list / accept / reject; every other `/carriers/*` route is staff-only |
| Dock / appointments | `/api/v1/dock/appointments` | Done |
| Continuous re-opt | `/api/v1/replan/now` | `/replan/now` re-orders a trip's stops on demand. One automatic trigger exists: a dock arrival that dwells over 60 minutes, controlled by `POST /replan/auto {enabled, on_dock_delay}` (stored; on by default). `on_new_order` / `on_gps_exception` are reported as not implemented. Distances come from an approximate city table, so check the new order before relying on it |
| Predictive ETA + playbooks | `/api/v1/eta/*` | Done |
| Multimodal rating | `/api/v1/rating/quote` road/ltl/ocean/parcel | Demo + partner env |
| Contract→spot cascade | `/api/v1/cascade/:id` | Done |
| Parcel shop + labels | `/api/v1/parcel/*` | Done |
| Load build / util | `/api/v1/load/build` | Done |
| Agentic ops | `/api/v1/agents/*` | Guardrailed |
| ELD/HOS pre-dispatch | `/api/v1/eld/*` | Done |
| Light EXIM checklist | `/api/v1/exim/*` | Done |
| OpenAPI / webhooks / hub identity | `/api/v1/platform/*` | OpenAPI served; webhooks are delivered (see below); `GET /platform/hub` says whose hub this is. There are no tenants: one hub serves one company |

## Phase D production checklist

1. Hub: `./scripts/deploy-hub.sh --prod` (Postgres, `DEMO_MODE=false`, random `JWT_SECRET`, `RBAC_PASSWORD`; the hub starts empty with one admin) — see `DEPLOYMENT.md` and OPS.md
2. Set NIC/ULIP/WhatsApp/FASTag/Tally/Razorpay per INTEGRATIONS.md when buyer credentials exist (`/health` → `integrations`)
3. Optional: `TRACKO_STORE_MODE=postgres` to force PG snapshot hydrate
4. Run GitHub Action **Desktop Windows**, then `./scripts/publish-windows-from-ci.sh --latest`
5. Phones: sideload IPA/APK or `EXPORT_METHOD=app-store` + TestFlight — MOBILE_RELEASE.md
6. Apple notarize secrets on **Desktop macOS** workflow
7. TLS via Caddy/ingress in front of API + install host

Version: API `0.3.0` · plan `world_class`

## Outbound webhooks
`POST /api/v1/platform/webhooks {url, events}` subscribes a public http(s) URL to `shipment.status`, `tender.offered`, `tender.accepted`, `tender.rejected`, `dock.arrived`, `fap.pay_released` (or `*`); unknown events and private or non-http(s) URLs are refused (422). Each event is POSTed as `{id, topic, created_at, data}` with `X-Tracko-Event`, `X-Tracko-Delivery`, `X-Tracko-Timestamp` and, when `TENDER_WEBHOOK_SECRET` is set, `X-Tracko-Signature: sha256=HMAC(secret, "<ts>.<body>")`. A non-2xx answer or timeout is retried twice (after 1 s and 4 s); the receiver should treat repeats of the same delivery id as one. `GET /platform/webhooks/deliveries` shows recent results (kept in memory), `POST /platform/webhooks/:id/test` sends a `webhook.test` event now, `POST /platform/webhooks/:id/remove` unsubscribes. Delivery is at-least-once on a best-effort basis: events raised while the hub is down are not replayed.

