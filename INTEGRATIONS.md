# Live integrations (env)

Demo adapters work out of the box. Set credentials to leave demo — status on `/health` → `integrations`.

| Surface | Env | Notes |
|---------|-----|-------|
| NIC e-Way | `NIC_EWAY_BASE`, `NIC_EWAY_CLIENT_ID`, `NIC_EWAY_CLIENT_SECRET` | Live via `integrations::eway_*`; routes create/extend/cancel/part-b. Static egress IP whitelist on NIC |
| NIC e-Invoice | `NIC_EINV_BASE`, `NIC_EINV_USERNAME`, `NIC_EINV_PASSWORD` | Whitelist your static egress IP with the provider. A live answer without an IRN is a 502; cancelling while live is refused (no cancel adapter) |
| ULIP Vahan | `ULIP_BASE`, `ULIP_API_KEY` | Buyer/ISV ULIP registration; compliance + india_pack vehicle check |
| WhatsApp | `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID` | Meta Cloud API; `POST /api/v1/whatsapp/send` persists outbound |
| FASTag | `FASTAG_PROVIDER_URL`, `FASTAG_API_KEY` | Aggregator / bank; india_pack merges live tolls |
| GSTIN | `GSTIN_LOOKUP_URL` | GSP search endpoint |
| Tally | `TALLY_HOST` | e.g. `http://127.0.0.1:9000` |
| Payouts | `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` (+ optional `RAZORPAY_ACCOUNT`). A Cashfree pair alone is refused (no Cashfree adapter), though `/ops/integrations` still reports payouts as live then | Driver settlement pay sends `X-Payout-Idempotency` so a retry cannot double-pay; manual payouts have none, so check the dashboard after a timeout |
| SSO | `OIDC_ISSUER`, `OIDC_CLIENT_ID` | Verifies a real OIDC ID token (issuer JWKS, issuer, audience); needs an IdP |
| RBAC | `REQUIRE_RBAC=1` | Enforces a Bearer role on every `/api/v1` route except the public, phone and device-key ones; reads need a signed-in role too |
| Postgres | `DATABASE_URL` | Full JSON SoT in `app_snapshots` + core tables; see below |
| JWT | `JWT_SECRET` | At least 24 random characters; with `DEMO_MODE=false` or RBAC on, a short or placeholder value ("change-me", `.env.example`, `docker-compose` default, …) stops the hub from starting. See AUTH.md |
| Staff passwords | `RBAC_PASSWORD` (shared), `RBAC_PASSWORD_ADMIN` / `_DISPATCHER` / `_BILLING` / `_VIEWER` (per role; the role's own wins) | Set the admin one so the shared password cannot sign in as the admin |
| Hub settings | `HUB_NAME` (company shown by `GET /platform/hub`), `JWT_TTL_SECS`, `RBAC_PASSWORD`, `CORS_ORIGINS`, `METRICS_TOKEN`, `PUBLIC_BASE_URL`, `BOOTSTRAP_ADMIN_EMAIL` / `BOOTSTRAP_ADMIN_NAME` | See the production checklist in OPS.md |
| SMS / WhatsApp secrets | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM`; `WHATSAPP_APP_SECRET`, `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_OTP_TEMPLATE`; `TENDER_WEBHOOK_SECRET` | OTP SMS; inbound WhatsApp webhook signature and handshake; HMAC signing of tender webhooks |
| Optional jobs | `PROACTIVE_ALERTS=1`, `TELEMATICS_SCAN=1`, `RFQ_BLOCK_OUTLIERS=1`, `REALTIME_SIM` | Consignee alerts scan, scheduled telematics scan, refuse outlier RFQ awards, GPS simulator (defaults on only in demo mode) |
| LTL rating | `LTL_RATING_URL` | SMC³-class partner |
| Ocean booking | `OCEAN_BOOKING_URL` | INTTRA-class partner |
| Visibility | `VISIBILITY_PROVIDER_URL` | project44/FourKites/Shippeo-shaped |
| Push (Android) | `FCM_PROJECT_ID`, `FCM_SERVICE_ACCOUNT_FILE` (service-account JSON path) | FCM HTTP v1; the hub signs the OAuth assertion itself. Unverified against Google: tested only against a local stub |
| Push (iOS) | `APNS_KEY_FILE` (.p8), `APNS_KEY_ID`, `APNS_TEAM_ID`, `APNS_TOPIC` (bundle id), optional `APNS_SANDBOX=1` | APNs token auth over HTTP/2. Unverified against Apple: tested only against a local stub |

Windows Setup.exe: see DESKTOP_RELEASE.md (`./scripts/publish-windows-from-ci.sh --latest`).

## Postgres source of truth

With `DATABASE_URL` set:

1. Hub loads the JSON file (if any), then compares `conflict.version` (it rises with every saved change): a newer JSON file is kept and synced up, otherwise it hydrates from `app_snapshots`; `TRACKO_STORE_MODE=postgres` always takes Postgres.
2. `sync_core` writes the snapshot and mirrors the relational tables parents-first (customers … driver_settlements), pruning removed rows, every `TRACKO_PG_SYNC_SECS` (default 20, minimum 5). Only `app_snapshots` is read back; see MIGRATIONS.md.
3. `/health` reports `store: postgres+json-cache` when hydrated from PG.

Empty credentials = demo responses with `"mode":"demo"`. If credentials are set and the call fails: NIC e-Way, e-Invoice and payouts return `{ok:false, mode:"live_error"}` and a 502 without changing anything; ULIP, FASTag and WhatsApp fall back to demo but the response is tagged `live_configured:true` + `live_error`. `GET /api/v1/ops/integrations/probe` makes read-only ULIP, FASTag and WhatsApp-number calls.

See also: [WHATSAPP.md](./WHATSAPP.md), [MOBILE_RELEASE.md](./MOBILE_RELEASE.md), [PILOT.md](./PILOT.md), `.env.example`.

## Verifying live credentials
`./scripts/verify-integrations.sh http://hub:8088` prints live/demo per adapter and makes read-only calls for GSTIN, ULIP/Vahan, FASTag and the WhatsApp number (it fails with the provider's `live_error` if a live adapter fell back). e-Way, e-Invoice, payouts and Tally are reported as configured only, because verifying them needs a side-effecting call: use the provider sandbox.
