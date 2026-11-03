<p align="center">
  <img src="./assets/logo-mark-512.png" alt="Tracko" width="128" />
</p>

<h1 align="center">Tracko</h1>

<p align="center">
  <strong>Freight, finally clear.</strong><br />
  Logistics TMS for India · Public beta · Private source
</p>

<p align="center">
  <a href="https://zyvorai.github.io/tracko-install/"><img alt="Public beta" src="https://img.shields.io/badge/public%20beta-live-0071e3?style=flat-square" /></a>
  <img alt="macOS" src="https://img.shields.io/badge/macOS-Apple%20Silicon-black?style=flat-square" />
  <img alt="Windows" src="https://img.shields.io/badge/Windows-PowerShell-0078d4?style=flat-square" />
  <img alt="Source" src="https://img.shields.io/badge/source-private-6e6e73?style=flat-square" />
</p>

<p align="center">
  <a href="https://zyvorai.github.io/tracko-install/"><strong>Open the install site</strong></a>
  ·
  <a href="./PUBLIC_TEST.md">Public test guide</a>
</p>

---

## Install

Apple-clean landing. Muse-style install — **one command**, no public `.exe` / `.dmg` buttons.

**Mac**

```bash
curl -fsSL https://zyvorai.github.io/tracko-install/install.sh | bash
```

**Windows** (PowerShell)

```powershell
irm https://zyvorai.github.io/tracko-install/install.ps1 | iex
```

Optional hub API:

```powershell
$env:TRACKO_API_URL = "http://192.168.1.10:8080"
irm https://zyvorai.github.io/tracko-install/install.ps1 | iex
```

Then in the app: **Server / Settings** → your hub (`http://127.0.0.1:8080` or LAN).

---

## Public beta

| Surface | Status |
|---------|--------|
| Mac DMG via `install.sh` | Live |
| Windows Setup via `install.ps1` | Fetched when published under `downloads/` |
| Control tower + realtime map | Live against your hub |
| India rails (NIC / ULIP / WhatsApp) | Demo until credentials |
| Source code | Private |

See **[PUBLIC_TEST.md](./PUBLIC_TEST.md)** for the 15-minute checklist.

---

## What’s in this repo

| Path | Purpose |
|------|---------|
| Landing | Apple-style marketing + install |
| `install.sh` / `install.ps1` | Fetch + install (binaries stay off the page CTAs) |
| `downloads/` | Artifacts for installers only |
| `assets/` | OG / social imagery |

**No application source** is published here.
