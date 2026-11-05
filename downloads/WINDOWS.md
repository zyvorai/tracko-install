# Windows Setup (private artifact)

Public page never links a `.exe`. When ready:

1. Run GitHub Action **Desktop Windows** (or `apps/desktop/scripts/build-windows.ps1`)
2. Copy `Tracko-TMS-Setup-x64.exe` into `downloads/`
3. Set `platforms.windows-x64.published: true` in `manifest.json`
4. Redeploy Pages

Users install with:

```powershell
irm https://zyvorai.github.io/tracko-install/install.ps1 | iex
```
