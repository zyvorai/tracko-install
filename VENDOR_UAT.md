# Tracko — Vendor UAT

Full guide: see repo `docs/VENDOR_UAT.md` (same content for install-site testers).

## Quick path

**Operator:** run hub with `./scripts/deploy-hub.sh` (after `./scripts/build-pilot-static.sh`) and share `http://<LAN>:8080`.

**Mac tester:**
```bash
curl -fsSL https://zyvorai.github.io/tracko-install/install.sh | bash
```
Connect screen → hub URL → Save & test → Control Tower.

**Phones (same Wi‑Fi):**
- Driver: `http://<LAN>:8080/driver/` + `TRACKO-DEMO`
- Scanner: `http://<LAN>:8080/scanner/?pair=SCAN-DEMO`
- Portal / carrier: `http://<LAN>:8080/app/`
- Native (no store): homepage [Downloads](./#downloads) — `Tracko-Driver.ipa` / `.apk`, `Tracko-Scanner.ipa` / `.apk` (Xcode Devices / Configurator; UDID registered).

**Codes:** `SCAN-DEMO` · `TRACKO-DEMO` · delivery OTP `391204`
