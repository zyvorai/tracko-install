# Live integrations (env)

Demo adapters work out of the box. Set credentials to leave demo — status on `/health` → `integrations`.

| Surface | Env | Notes |
|---------|-----|-------|
| NIC e-Way | `NIC_EWAY_BASE`, `NIC_EWAY_CLIENT_ID`, `NIC_EWAY_CLIENT_SECRET` | Static egress IP whitelist on NIC |
| NIC e-Invoice | `NIC_EINV_BASE`, `NIC_EINV_USERNAME`, `NIC_EINV_PASSWORD` | Max 4 Indian IPs |
| ULIP Vahan | `ULIP_BASE`, `ULIP_API_KEY` | Buyer/ISV ULIP registration |
| WhatsApp | `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID` | Meta Cloud API |
| FASTag | `FASTAG_PROVIDER_URL`, `FASTAG_API_KEY` | Aggregator / bank |
| GSTIN | `GSTIN_LOOKUP_URL` | GSP search endpoint |
| Tally | `TALLY_HOST` | e.g. `http://127.0.0.1:9000` |
| Payouts | `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` (+ optional `RAZORPAY_ACCOUNT`) or Cashfree pair | Driver settlement pay |
| SSO | `OIDC_ISSUER`, `OIDC_CLIENT_ID` | Stub login until IdP wired |
| RBAC | `REQUIRE_RBAC=1` | Enforces Bearer role on payouts/restore |
| Postgres | `DATABASE_URL` | Full JSON SoT in `app_snapshots` + core tables |
| JWT | `JWT_SECRET` | Change from default in production |
| LTL rating | `LTL_RATING_URL` | SMC³-class partner |
| Ocean booking | `OCEAN_BOOKING_URL` | INTTRA-class partner |
| Visibility | `VISIBILITY_PROVIDER_URL` | project44/FourKites/Shippeo-shaped |

Windows Setup.exe: run Actions **Desktop Windows**, copy artifact into `site/downloads/Tracko-TMS-Setup-x64.exe`.

Postgres: set `DATABASE_URL` — API hydrates `app_snapshots` as SoT (`store: postgres+json-cache`).
