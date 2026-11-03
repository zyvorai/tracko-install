# Capacitor APK / IPA release (no stores)

Phone apps are **Capacitor** shells around the Driver and Scanner PWAs. For vendor UAT we ship **sideload binaries** — not App Store / Play Store.

| App | Bundle / applicationId | Web (hub) | Native artifact |
|-----|------------------------|-----------|-----------------|
| Driver | `com.tracko.driver` | `http://<hub>:8080/driver/` | `Tracko-Driver.ipa` / `.apk` |
| Scanner | `com.tracko.scanner` | `http://<hub>:8080/scanner/` | `Tracko-Scanner.ipa` / `.apk` |

## iOS IPA (development / ad-hoc)

Requires Xcode, CocoaPods, Apple team **NX667LTDQ2**, and **registered device UDIDs** (iOS cannot install like an unrestricted APK).

```bash
# Once: brew install cocoapods
./scripts/build-ios-ipa.sh
# → site/downloads/Tracko-Driver.ipa
# → site/downloads/Tracko-Scanner.ipa
```

Optional: `EXPORT_METHOD=ad-hoc ./scripts/build-ios-ipa.sh` after devices are on an Ad Hoc profile.

### Install on a test iPhone

1. Register the device UDID on the Apple Developer team.
2. Rebuild IPA if using ad-hoc.
3. On a Mac: **Xcode → Window → Devices and Simulators** → select phone → **+** under Installed Apps → pick the IPA.  
   Or use **Apple Configurator**.
4. Trust the developer certificate on the phone if prompted (**Settings → General → VPN & Device Management**).
5. Open the app → enter hub URL (`http://<LAN>:8080`) → Driver: `TRACKO-DEMO` · Scanner: `SCAN-DEMO`.

## Android debug APK

Requires Android SDK (`ANDROID_HOME` / `local.properties` `sdk.dir`).

```bash
./scripts/build-android-apk.sh
# → site/downloads/Tracko-Driver.apk
# → site/downloads/Tracko-Scanner.apk
```

Sideload via `adb install -r site/downloads/Tracko-Driver.apk` (USB debugging) or file share + “Install unknown apps”.

## Rebuild web assets into hub

```bash
./scripts/build-pilot-static.sh
```

## Distribution policy

Copy IPAs/APKs into `site/downloads/` (and `tracko-install/downloads/`). Update `manifest.json` phone fields. **Do not** add public homepage download buttons (same Muse rule as the Mac DMG).
