#!/usr/bin/env bash
# Tracko private installer — downloads binary only. Does not clone source.
set -euo pipefail

# Override: TRACKO_BASE_URL=https://your-private-cdn.example
BASE_URL="${TRACKO_BASE_URL:-https://zyvorai.github.io/tracko-install}"
BASE_URL="${BASE_URL%/}"

OS="$(uname -s)"
ARCH="$(uname -m)"

echo "Tracko installer"
echo "  os=$OS arch=$ARCH"
echo "  base=$BASE_URL"
echo

if [[ "$OS" != "Darwin" ]]; then
  echo "This script installs the macOS Apple Silicon DMG."
  echo "On Windows, open PowerShell and run:"
  echo "  irm ${BASE_URL}/install.ps1 | iex"
  echo "Optional hub API:"
  echo "  \$env:TRACKO_API_URL='http://YOUR_SERVER:8080'; irm ${BASE_URL}/install.ps1 | iex"
  exit 1
fi

if [[ "$ARCH" != "arm64" ]]; then
  echo "Expected Apple Silicon (arm64). Found: $ARCH"
  exit 1
fi

DMG_NAME="Tracko-TMS-0.1.0-aarch64.dmg"
TMP_DIR="$(mktemp -d)"
DMG_PATH="$TMP_DIR/$DMG_NAME"
URL="$BASE_URL/downloads/$DMG_NAME"

echo "Downloading $URL"
curl -fL --progress-bar "$URL" -o "$DMG_PATH"

echo "Mounting DMG…"
MOUNT_POINT="$(hdiutil attach "$DMG_PATH" -nobrowse | awk 'END {print $NF}')"
APP_SRC="$(find "$MOUNT_POINT" -maxdepth 1 -name '*.app' | head -1)"

if [[ -z "$APP_SRC" ]]; then
  echo "Could not find .app inside DMG"
  hdiutil detach "$MOUNT_POINT" >/dev/null || true
  exit 1
fi

APP_NAME="$(basename "$APP_SRC")"
echo "Installing $APP_NAME to /Applications…"
rm -rf "/Applications/$APP_NAME"
cp -R "$APP_SRC" "/Applications/$APP_NAME"
xattr -cr "/Applications/$APP_NAME" 2>/dev/null || true

hdiutil detach "$MOUNT_POINT" >/dev/null || true
rm -rf "$TMP_DIR"

echo
echo "Installed: /Applications/$APP_NAME"
echo "Launching…"
open -a "${APP_NAME%.app}"
echo "Done. Keep your Tracko API running if the desktop app needs localhost:8080."
