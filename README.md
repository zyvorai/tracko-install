<p align="center">
  <img src="./assets/logo-mark-512.png" alt="Tracko" width="128" />
</p>

<h1 align="center">Tracko</h1>

<p align="center">
  <strong>Freight, finally clear.</strong><br />
  Logistics TMS for India · Public beta · Private source
</p>

<p align="center">
  <a href="https://zyvorai.github.io/tracko-install/"><img alt="Public beta" src="https://img.shields.io/badge/public%20beta-0.3.0-0071e3?style=flat-square" /></a>
  <img alt="macOS" src="https://img.shields.io/badge/macOS-Apple%20Silicon-black?style=flat-square" />
  <img alt="Windows" src="https://img.shields.io/badge/Windows-PowerShell-0078d4?style=flat-square" />
  <img alt="Source" src="https://img.shields.io/badge/source-private-6e6e73?style=flat-square" />
</p>

<p align="center">
  <a href="https://zyvorai.github.io/tracko-install/"><strong>Install site</strong></a>
  ·
  <a href="./PUBLIC_TEST.md">Test guide</a>
  ·
  <a href="./CHANGELOG.md">Changelog</a>
  ·
  <a href="./PRIVACY.md">Privacy</a>
  ·
  <a href="./SECURITY.md">Security</a>
</p>

---

## Install

Apple-clean landing. Muse-style — **one command**, no public `.exe` / `.dmg` buttons.

**Mac**

```bash
curl -fsSL https://zyvorai.github.io/tracko-install/install.sh | bash
```

**Windows** (PowerShell)

```powershell
irm https://zyvorai.github.io/tracko-install/install.ps1 | iex
```

Then: **Server / Settings** → your hub (`http://127.0.0.1:8080` or LAN).

---

## On the public site

| Section | What |
|---------|------|
| [Downloads](./#downloads) | Mac DMG · Driver/Scanner IPA + APK |
| Install | OS tabs + one-line command |
| Gallery / features | Control tower, India pack |
| Docs | [VENDOR_UAT](./VENDOR_UAT.md) · [MOBILE_RELEASE](./MOBILE_RELEASE.md) · [INTEGRATIONS](./INTEGRATIONS.md) · [WHATSAPP](./WHATSAPP.md) |
| Privacy / security | Hub-owned data model |
| Brand kit | SVG + PNG logos, OG |

---

## Public beta status

| Surface | Status |
|---------|--------|
| Mac DMG via `install.sh` + Downloads | Live |
| Phone IPA/APK sideload | Live (UDID); TestFlight export ready |
| Windows Setup via `install.ps1` | Script ready · artifact when published |
| Realtime map (hub) | Live |
| India live rails | Env-gated — demo until credentials |
| Postgres SoT | `DATABASE_URL` → `postgres+json-cache` |
| Source | Private |

---

## Brand

| Asset | Path |
|-------|------|
| Mark SVG | [`assets/logo-mark.svg`](./assets/logo-mark.svg) |
| PNG 512 | [`assets/logo-mark-512.png`](./assets/logo-mark-512.png) |
| PNG 1024 | [`assets/logo-mark-1024.png`](./assets/logo-mark-1024.png) |

**No application source** is published in this repository.
