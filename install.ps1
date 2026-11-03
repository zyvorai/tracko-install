# Tracko private Windows installer stub (no source publish).
# Host an MSI/NSIS build at /downloads and update $artifact when ready.
$ErrorActionPreference = "Stop"
$Base = if ($env:TRACKO_BASE_URL) { $env:TRACKO_BASE_URL.TrimEnd('/') } else { "https://zyvorai.github.io/tracko-install" }
Write-Host "Tracko Windows installer stub"
Write-Host "Base: $Base"
Write-Host "Place Tracko-TMS-Setup.exe under site/downloads and update this script when Windows builds ship."
exit 1
