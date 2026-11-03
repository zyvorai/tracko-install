<p align="center">
  <img src="./assets/og.png" alt="Tracko" width="800" />
</p>

<h1 align="center">Tracko</h1>

<p align="center">
  <strong>Logistics TMS for India.</strong> One-command install. Private source.
</p>

<p align="center">
  <a href="http://175.110.122.71:8787/"><img alt="Install" src="https://img.shields.io/badge/install-one%20command-0071e3?style=flat-square" /></a>
  <img alt="macOS" src="https://img.shields.io/badge/macOS-Apple%20Silicon-black?style=flat-square" />
  <img alt="Windows" src="https://img.shields.io/badge/Windows-PowerShell-0078d4?style=flat-square" />
  <img alt="Source" src="https://img.shields.io/badge/source-private-6e6e73?style=flat-square" />
</p>

## Install

Same pattern as Muse Code — **copy a command**. No public `.exe` / `.dmg` buttons.

**Mac**

```bash
curl -fsSL http://175.110.122.71:8787/install.sh | bash
```

**Windows** (PowerShell)

```powershell
irm http://175.110.122.71:8787/install.ps1 | iex
```

Optional hub API on Windows:

```powershell
$env:TRACKO_API_URL = "http://192.168.1.10:8080"
irm http://175.110.122.71:8787/install.ps1 | iex
```

Landing: **[http://175.110.122.71:8787/](http://175.110.122.71:8787/)** — tabs auto-detect OS.

## What’s here

| Path | Purpose |
|------|---------|
| Landing + OG | Install page & social preview |
| `install.sh` / `install.ps1` | Fetch + install (binaries stay off the page) |
| `downloads/` | Artifacts for the installers only — not linked as CTAs |

**No application source** is published in this repository.
