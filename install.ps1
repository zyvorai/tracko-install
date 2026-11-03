# Tracko Windows installer — downloads NSIS Setup only (no source).
# Usage (elevated PowerShell optional):
#   irm https://zyvorai.github.io/tracko-install/install.ps1 | iex
# Or:
#   powershell -ExecutionPolicy Bypass -File .\install.ps1
# Override CDN:  $env:TRACKO_BASE_URL = "https://your-cdn"
# Override API:  $env:TRACKO_API_URL  = "http://192.168.1.10:8080"

$ErrorActionPreference = "Stop"

$Base = if ($env:TRACKO_BASE_URL) { $env:TRACKO_BASE_URL.TrimEnd('/') } else { "https://zyvorai.github.io/tracko-install" }
$ApiUrl = if ($env:TRACKO_API_URL) { $env:TRACKO_API_URL.TrimEnd('/') } else { "http://localhost:8080" }
$SetupName = "Tracko-TMS-Setup-x64.exe"
$Url = "$Base/downloads/$SetupName"
$Temp = Join-Path $env:TEMP "tracko-install"
$SetupPath = Join-Path $Temp $SetupName

Write-Host ""
Write-Host "Tracko Windows installer" -ForegroundColor Cyan
Write-Host "  base = $Base"
Write-Host "  api  = $ApiUrl  (saved for desktop Control Tower)"
Write-Host ""

if (-not [Environment]::Is64BitOperatingSystem) {
  Write-Host "Tracko desktop requires 64-bit Windows 10/11." -ForegroundColor Red
  exit 1
}

New-Item -ItemType Directory -Force -Path $Temp | Out-Null

# WebView2 runtime (required by Tauri)
function Ensure-WebView2 {
  $marker = "HKLM:\SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}"
  $marker2 = "HKLM:\SOFTWARE\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}"
  if ((Test-Path $marker) -or (Test-Path $marker2)) {
    Write-Host "WebView2 runtime: present"
    return
  }
  Write-Host "Installing Microsoft Edge WebView2 runtime…"
  $wv = Join-Path $Temp "MicrosoftEdgeWebview2Setup.exe"
  Invoke-WebRequest -Uri "https://go.microsoft.com/fwlink/p/?LinkId=2124703" -OutFile $wv -UseBasicParsing
  Start-Process -FilePath $wv -ArgumentList "/silent /install" -Wait
}

Ensure-WebView2

Write-Host "Downloading $Url"
try {
  Invoke-WebRequest -Uri $Url -OutFile $SetupPath -UseBasicParsing
} catch {
  Write-Host ""
  Write-Host "Could not download $SetupName" -ForegroundColor Red
  Write-Host "Build it on Windows (or GitHub Actions desktop-windows), then place it at:"
  Write-Host "  site/downloads/$SetupName"
  Write-Host "  tracko-install/downloads/$SetupName"
  Write-Host "Script: apps/desktop/scripts/build-windows.ps1"
  throw
}

# Persist preferred API for first launch (desktop reads localStorage; also drop a hint file)
$CfgDir = Join-Path $env:LOCALAPPDATA "Tracko"
New-Item -ItemType Directory -Force -Path $CfgDir | Out-Null
@{
  api_base = $ApiUrl
  installed_at = (Get-Date).ToString("o")
  installer = "install.ps1"
} | ConvertTo-Json | Set-Content -Path (Join-Path $CfgDir "install-config.json") -Encoding UTF8

Write-Host "Running installer…"
# NSIS: silent-ish for current user when possible
$p = Start-Process -FilePath $SetupPath -ArgumentList "/S" -PassThru -Wait
if ($p.ExitCode -ne 0 -and $p.ExitCode -ne $null) {
  Write-Host "Silent install returned $($p.ExitCode) — launching interactive UI…"
  Start-Process -FilePath $SetupPath -Wait
}

Write-Host ""
Write-Host "Installed Tracko TMS." -ForegroundColor Green
Write-Host "Launch from Start Menu → Tracko → Tracko TMS"
Write-Host "In the app sidebar, set Server URL to: $ApiUrl"
Write-Host "Phone Scanner / Driver pair to the same API on your LAN."
Write-Host "Done."
