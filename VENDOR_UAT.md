# Tracko — Vendor UAT (end-to-end onboarding)

Public beta install site: https://zyvorai.github.io/tracko-install/

One hub serves the API **and** phone/web PWAs. Keep `DEMO_MODE=true` so portal OTP shows on-screen codes.

## Operator (hub host)

```bash
cd tracko
cp .env.example .env   # DEMO_MODE=true, REALTIME_SIM=true
./scripts/build-pilot-static.sh   # required before phones work
./scripts/deploy-hub.sh           # prefer PORT=8088 if :8080 is taken (e.g. Setura)
./scripts/smoke-onboard.sh http://127.0.0.1:8088
```

**Pre-flight:** `GET /health` must return Tracko JSON (`"service":"tracko"`). If you get HTML, the port is wrong — do not start UAT.

Note the machine’s **LAN IP**. Testers use `http://<LAN>:8088` (or `:8080` if that is Tracko).

| Surface | URL |
|---------|-----|
| Health | `http://<LAN>:8088/health` |
| Portal / carrier wizard | `http://<LAN>:8088/app/` |
| Carrier tenders | `http://<LAN>:8088/app/?mode=tenders` |
| Driver | `http://<LAN>:8088/driver/` |
| Scanner | `http://<LAN>:8088/scanner/?pair=SCAN-DEMO` |

**Carrier scope:** web = install + tenders + customer portal. Fleet / billing / EDI ops = **desktop Control Tower**.

## Tester (Mac desktop)

1. Install (Apple Silicon):
   ```bash
   curl -fsSL https://zyvorai.github.io/tracko-install/install.sh | bash
   ```
   Intel Mac: build from source or use hub PWAs in browser — `install.sh` is arm64-first.
2. First launch → **Connect to your hub** → paste `http://<LAN>:8088` → **Save & test**.
3. **Control Tower** — live map + **Carrier tenders** strip (after web accept).
4. Browser → `/app/` → **Save hub** on landing if needed → **Carrier install** → copy install code.
5. Phone apps (same Wi‑Fi as hub):
   - Driver `/driver/` · Scanner `/scanner/?pair=SCAN-DEMO` (set hub → **Pair to hub**; use **PKG chips** if camera blocked on LAN HTTP)
   - Native IPA/APK from homepage Downloads (UDID registered). See [MOBILE_RELEASE.md](./MOBILE_RELEASE.md).
6. Driver → hub URL → link `TRACKO-DEMO` → **At door** checklist.
7. Scanner → pair → prefer PKG chips → same `scan_id` retry is idempotent.
8. Portal OTP login → on-screen **demo OTP** (not the driver code).
9. `/app/?mode=tenders` → Accept `TND-DEMO` → desktop **Carrier EDI** / Tower strip shows accepted.
10. **Billing** finance script → Invoice TRK-1001 → Settlements → Freight audit → Tally.

## Demo cheat-sheet

| Item | Value |
|------|--------|
| Scanner pair | `SCAN-DEMO` |
| Driver install | `TRACKO-DEMO` |
| **Driver** delivery OTP | `391204` |
| **Portal** OTP | On-screen `demo_otp` after Send OTP (not 391204) |
| Role login (desktop Ops) | `U-01` · password `tracko` if `REQUIRE_RBAC=1` |
| Seed shipment | `TRK-1001` |
| Demo tender | `TND-DEMO` |
| Blacklist demo | carrier `Blocked Haulers` cannot receive tenders |

## First 15 minutes (desktop tour)

1. Connect hub → **UAT Tour** (Billing · Freight audit · Carrier EDI / connect included).
2. Control Tower → map + ETA playbooks + tender strip.
3. Shipments → **Compliance** drawer (Part-B / extend / cancel + NIC demo ack) · Print LR / CN.
4. Phone scanners → LAN share + create package + `scan_id` demos.
5. Delivery agent ↔ Driver At-door · NDR → Exceptions “pending verification”.
6. Web tenders accept → Carrier EDI (webhooks + go-live) · Blocked Haulers tender fails.
7. Billing → **Full settlement click-through** · FAP disputes · COD remittance CSV · FASTag out-of-route.
8. RFQ → **Simulate WhatsApp bid** (no Meta keys).

## Feedback

Include: OS, hub URL (redact secrets), steps, screenshot. Label `vendor-uat`.

Windows Setup.exe is not in this UAT pack. India NIC/ULIP/WhatsApp/FASTag stay demo until hub env keys are set — then routes go live ([INTEGRATIONS.md](./INTEGRATIONS.md)). Postgres with `DATABASE_URL` hydrates `app_snapshots` (`store: postgres+json-cache`). Phone sideload + TestFlight export: [MOBILE_RELEASE.md](./MOBILE_RELEASE.md).

Full gap analysis: `reports/Tracko UAT remaining gaps.md`.
