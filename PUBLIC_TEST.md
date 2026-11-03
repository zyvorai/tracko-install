# Tracko public test

Welcome. This is a **public beta** of the Tracko desktop install. Source stays private; you get a binary via one command.

**Site:** https://zyvorai.github.io/tracko-install/  
**Changelog:** [CHANGELOG.md](./CHANGELOG.md) · **Privacy:** [PRIVACY.md](./PRIVACY.md)

## 15-minute pass

1. **Install (Mac)**  
   ```bash
   curl -fsSL https://zyvorai.github.io/tracko-install/install.sh | bash
   ```
2. **Open Tracko** from `/Applications`.
3. **Server / Settings** → `http://127.0.0.1:8080` (or your pilot hub LAN IP) → Save & test.
4. **Control Tower** — confirm fleet map updates (live SSE when the hub has `REALTIME_SIM=true`).
5. **Shipments** — create or assign one; check **Alerts** / **Dispatch**.

### Windows

```powershell
irm https://zyvorai.github.io/tracko-install/install.ps1 | iex
```

`install.ps1` downloads Setup when `downloads/Tracko-TMS-Setup-x64.exe` is published. Until then Mac is the primary public path.

## What to expect

- India compliance connectors may return **demo** data until NIC/ULIP/WhatsApp keys are configured on the hub.
- Realtime needs a reachable hub API (`:8080`).
- No public `.exe` / `.dmg` download buttons — installers only.

## Feedback

Open an issue on this repo with: OS, hub URL (redact secrets), steps, screenshot. Label it `public-beta`.
