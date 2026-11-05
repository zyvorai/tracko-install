# Tracko public test

Welcome. This is a **public beta** of the Tracko desktop + phone install. Source stays private.

**Site:** https://zyvorai.github.io/tracko-install/  
**Vendor UAT:** [VENDOR_UAT.md](./VENDOR_UAT.md) · **Mobile:** [MOBILE_RELEASE.md](./MOBILE_RELEASE.md) · **Integrations:** [INTEGRATIONS.md](./INTEGRATIONS.md)  
**Changelog:** [CHANGELOG.md](./CHANGELOG.md) · **Privacy:** [PRIVACY.md](./PRIVACY.md)

## 15-minute pass

1. **Install (Mac)**  
   ```bash
   curl -fsSL https://zyvorai.github.io/tracko-install/install.sh | bash
   ```
   Or grab the DMG / phone IPA+APK from homepage [Downloads](./#downloads).
2. **Open Tracko** from `/Applications`.
3. **Connect to your hub** → `http://<hub-lan-ip>:8088` (or `:8080` if Tracko owns it) → **Save & test**.
4. **Control Tower** — fleet map. A demo hub (`DEMO_MODE=true`) animates a GPS simulator; a production hub shows only real pings. On a hub with `REQUIRE_RBAC=1`, sign in on the desktop first (live positions are sent to signed-in staff only).
5. **Shipments** — Compliance drawer · Print LR/CN · assign.
6. **Phones** (same Wi‑Fi):  
   - Driver `/driver/` + `TRACKO-DEMO`  
   - Scanner `/scanner/?pair=SCAN-DEMO`  
   - Carrier / portal `/app/` · tenders `TND-DEMO`

### Windows

```powershell
irm https://zyvorai.github.io/tracko-install/install.ps1 | iex
```

`install.ps1` downloads Setup when `downloads/Tracko-TMS-Setup-x64.exe` is published. Until then Mac + hub PWAs are the public path.

## What to expect

- India connectors return **demo** until NIC/ULIP/WhatsApp/FASTag keys are on the hub ([INTEGRATIONS.md](./INTEGRATIONS.md)).
- With `DATABASE_URL`, hub SoT is Postgres (`store: postgres+json-cache`).
- Realtime needs a reachable hub API. The demo codes (`TRACKO-DEMO`, `SCAN-DEMO`, `TND-DEMO`, OTP `391204`) exist on demo hubs only; a production hub starts empty.
- The customer portal, sign-in, tracking page and carrier pages speak English, हिन्दी and ગુજરાતી (picker in the page header).
- Operator smoke: `./scripts/smoke-onboard.sh http://<hub>:8088`

## Feedback

Open an issue with: OS, hub URL (redact secrets), steps, screenshot. Label `public-beta` or `vendor-uat`.
