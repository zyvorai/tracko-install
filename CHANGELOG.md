# Changelog

## 0.4.0 — Hardened hub · customer portal in हिन्दी / ગુજરાતી · production mode

Hub (private; see [INTEGRATIONS.md](./INTEGRATIONS.md) and the hub's ops guide)
- **Security:** with `REQUIRE_RBAC=1` every staff read needs a signed-in role; carrier and shop-network routes are staff-only except a carrier's own tender list/accept/reject (per-carrier `X-Carrier-Key`); live events carry data only for staff tokens; sign-out and admin revoke void tokens; role login is rate-limited; OTP, delivery and e-POD codes lock after repeated wrong guesses; tender webhooks can be HMAC-signed; webhook URLs cannot point inside your network.
- **Production mode (`DEMO_MODE=false`):** refuses placeholder or short `JWT_SECRET`, mistyped settings and malformed alert settings; starts empty with one admin (`BOOTSTRAP_ADMIN_EMAIL`); no GPS simulator or demo data.
- **Data safety:** local edits no longer lost to an older Postgres snapshot on restart; `scripts/restore-hub.sh` restores with a safety backup; backups never overwrite each other and can be pruned (`KEEP=N`); a corrupt snapshot is kept aside; the Postgres reporting tables no longer contain demo rows or deleted records.
- **Money & KPIs:** bank reconciliation fixes (undo, status gates, amount parsing), KPI months and days follow India time, draft driver settlements are not counted as cost, no invented e-invoice IRN, FAP release is admin-only.
- **Second review fixes:** `DEMO_MODE` typos stop the boot; a Postgres snapshot the hub cannot read is never overwritten; SIGTERM saves; big restores work; per-role passwords (`RBAC_PASSWORD_ADMIN` etc.); failed logins are limited per source address; webhook and push endpoints are rate- and size-limited; duplicate LR numbers are refused; tokens are void from the second a sign-out happens.
- Users & Roles screen: add users, change role, deactivate (signs the user out).
- One hub serves one company: the placeholder tenant endpoints were removed (`/platform/tenants` answers 410); run one hub per company and use branches / multi-shop networks for several sites. `GET /platform/hub` reports whose hub it is. Platform webhooks now actually deliver events (signed, retried).

Customer web portal
- Hindi and Gujarati across the portal, sign-in, tracking page, delivery slots, carrier install, tutorials, carrier tenders, phone-app and multi-shop pages (first-draft wording; reviewers welcome).
- The public tracking link keeps itself current.

Apps
- Accessibility lint (jsx-a11y) in all four apps; keyboard-operable lists and labelled form fields.
- Mac DMG, Driver/Scanner APKs and IPAs on this site were rebuilt from the same code (DMG Developer ID signed, not notarized; IPAs are development exports for registered devices only). Not yet tried on a physical device.

## 0.3.2 — Live rails · Postgres SoT · App Store readiness

- NIC e-Way / ULIP / WhatsApp / FASTag flip live from hub env ([INTEGRATIONS.md](./INTEGRATIONS.md))
- Postgres hydrate + `TRACKO_STORE_MODE` / `TRACKO_PG_SYNC_SECS` (`store: postgres+json-cache`)
- Driver/Scanner Privacy Manifest + App Store / TestFlight export path ([MOBILE_RELEASE.md](./MOBILE_RELEASE.md))
- Homepage Downloads: Mac DMG + phone IPA/APK; Vendor UAT docs refreshed for `:8088`

## 0.3.1 — Public beta polish

- EN/हि language toggle, manifest-driven versions
- Tab a11y, focus rings, Linux honesty
- Desktop/web/driver/scanner favicons + sidebar logo
- CI builds scanner; mobile release docs

## 0.3.0 — Public beta

- Apple-style marketing site on GitHub Pages
- Muse-style one-command install (Mac live; Windows script ready)
- Crisp Tracko route logo (nav, hero, icons, brand kit)
- Product gallery + feature showcases
- Tech specs, FAQ, privacy, security, status
- Hub realtime SSE + GPS simulator (when API is running)
- World-class plan surfaces on private hub (FAP, carbon, dock, carriers, …)

## 0.1.0

- Initial Mac DMG install path
- Private source · public install only
