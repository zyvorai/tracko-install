# Live integrations (env)

Demo adapters work out of the box. Set credentials to leave demo — status on `/health` → `integrations`.

| Surface | Env | Notes |
|---------|-----|-------|
| NIC e-Way | `NIC_EWAY_BASE`, `NIC_EWAY_CLIENT_ID`, `NIC_EWAY_CLIENT_SECRET` | Live via `integrations::eway_*`; routes create/extend/cancel/part-b. Static egress IP whitelist on NIC |
| NIC e-Invoice | `NIC_EINV_BASE`, `NIC_EINV_USERNAME`, `NIC_EINV_PASSWORD` | Max 4 Indian IPs |
| ULIP Vahan | `ULIP_BASE`, `ULIP_API_KEY` | Buyer/ISV ULIP registration; compliance + india_pack vehicle check |
| WhatsApp | `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID` | Meta Cloud API; `POST /api/v1/whatsapp/send` persists outbound |
| FASTag | `FASTAG_PROVIDER_URL`, `FASTAG_API_KEY` | Aggregator / bank; india_pack merges live tolls |
| GSTIN | `GSTIN_LOOKUP_URL` | GSP search endpoint |
| Tally | `TALLY_HOST` | e.g. `http://127.0.0.1:9000` |
| Payouts | `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` (+ optional `RAZORPAY_ACCOUNT`) or Cashfree pair | Driver settlement pay |
| SSO | `OIDC_ISSUER`, `OIDC_CLIENT_ID` | Stub login until IdP wired |
| RBAC | `REQUIRE_RBAC=1` | Enforces Bearer role on payouts/restore |
| Postgres | `DATABASE_URL` | Full JSON SoT in `app_snapshots` + core tables; see below |
| JWT | `JWT_SECRET` | Change from default in production |
| LTL rating | `LTL_RATING_URL` | SMC³-class partner |
| Ocean booking | `OCEAN_BOOKING_URL` | INTTRA-class partner |
| Visibility | `VISIBILITY_PROVIDER_URL` | project44/FourKites/Shippeo-shaped |

Windows Setup.exe: run Actions **Desktop Windows**, copy artifact into `site/downloads/Tracko-TMS-Setup-x64.exe`.

## Postgres source of truth

With `DATABASE_URL` set:

1. Hub loads JSON file (if any), then hydrates from `app_snapshots` when PG version ≥ memory or `TRACKO_STORE_MODE=postgres`.
2. `sync_core` upserts relational tables (shipments, invoices, FASTag, exceptions, driver_settlements, …) every `TRACKO_PG_SYNC_SECS` (default 20).
3. `/health` reports `store: postgres+json-cache` when hydrated from PG.

Empty credentials = demo responses with `"mode":"demo"`. Live failures log a warning and fall back to demo so UAT stays usable.

See also: [WHATSAPP.md](./WHATSAPP.md), [MOBILE_RELEASE.md](./MOBILE_RELEASE.md), [PILOT.md](./PILOT.md).
