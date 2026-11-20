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
  echo "This script installs the macOS Apple Silicon DMG. Tracko desktop is Mac only."
  echo "On Windows or Linux, open Tracko in your browser against your hub; the same 30-day trial key works (sales@zyvor.dev)."
  exit 1
fi

if [[ "$ARCH" != "arm64" ]]; then
  echo "Expected Apple Silicon (arm64). Found: $ARCH"
  exit 1
fi

DMG_NAME="Tracko-TMS-0.2.0-aarch64.dmg"
TMP_DIR="$(mktemp -d)"
DMG_PATH="$TMP_DIR/$DMG_NAME"
URL="${TRACKO_DMG_URL:-https://github.com/zyvorai/tracko-install/releases/download/v0.2.0/$DMG_NAME}"

echo "Downloading $URL"
HTTP_CODE="$(curl -sL -o /dev/null -w '%{http_code}' --head "$URL" 2>/dev/null || true)"
if [[ "$HTTP_CODE" == "404" ]]; then
  echo "The Tracko DMG is not published yet (HTTP 404): $URL"
  echo "Email sales@zyvor.dev for the build, or set TRACKO_DMG_URL to a DMG you already have."
  rm -rf "$TMP_DIR"
  exit 1
fi
if ! curl -fL --progress-bar "$URL" -o "$DMG_PATH"; then
  echo "Download failed: $URL"
  echo "Check your network, or email sales@zyvor.dev for the build."
  rm -rf "$TMP_DIR"
  exit 1
fi

echo "Mounting DMG…"
# Fixed mountpoint avoids awk breaking on volume names with spaces (e.g. "Tracko TMS").
MOUNT_POINT="$TMP_DIR/mnt"
mkdir -p "$MOUNT_POINT"
hdiutil attach "$DMG_PATH" -nobrowse -mountpoint "$MOUNT_POINT" >/dev/null
APP_SRC="$(find "$MOUNT_POINT" -maxdepth 1 -name '*.app' -print -quit)"

if [[ -z "$APP_SRC" || ! -d "$APP_SRC" ]]; then
  echo "Could not find .app inside DMG"
  hdiutil detach "$MOUNT_POINT" >/dev/null 2>&1 || true
  exit 1
fi

APP_NAME="$(basename "$APP_SRC")"
echo "Installing $APP_NAME to /Applications…"
rm -rf "/Applications/$APP_NAME"
cp -R "$APP_SRC" "/Applications/$APP_NAME"
xattr -cr "/Applications/$APP_NAME" 2>/dev/null || true

hdiutil detach "$MOUNT_POINT" >/dev/null 2>&1 || true
rm -rf "$TMP_DIR"

echo
echo "Installed: /Applications/$APP_NAME"
echo "Launching…"
open -a "${APP_NAME%.app}"
echo "Done. Keep your Tracko API running if the desktop app needs localhost:8080."
