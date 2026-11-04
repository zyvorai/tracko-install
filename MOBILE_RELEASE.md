# Capacitor APK / IPA release

Phone apps are **Capacitor** shells around the Driver and Scanner PWAs.

| App | Bundle / applicationId | Web (hub) | Native artifact |
|-----|------------------------|-----------|-----------------|
| Driver | `com.tracko.driver` | `http://<hub>:8080/driver/` | `Tracko-Driver.ipa` / `.apk` |
| Scanner | `com.tracko.scanner` | `http://<hub>:8080/scanner/` | `Tracko-Scanner.ipa` / `.apk` |

## iOS IPA — development / ad-hoc (vendor UAT)

Requires Xcode, CocoaPods, Apple team **NX667LTDQ2**, and **registered device UDIDs** for ad-hoc.

```bash
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

## iOS — App Store / TestFlight

Apps include Privacy Manifest (`PrivacyInfo.xcprivacy`), `ITSAppUsesNonExemptEncryption=false`, and `NSAllowsLocalNetworking` for private-hub HTTP.

1. Create App Store Connect records for `com.tracko.driver` and `com.tracko.scanner`.
2. Build App Store export:
   ```bash
   EXPORT_METHOD=app-store ./scripts/build-ios-ipa.sh
   ```
3. Upload to TestFlight:
   ```bash
   # App Store Connect API key (preferred)
   export ASC_API_KEY=... ASC_API_ISSUER=... ASC_API_KEY_PATH=/path/to/AuthKey_XXX.p8
   ./scripts/upload-testflight.sh
   # or: APPLE_ID=... APPLE_APP_SPECIFIC_PASSWORD=... ./scripts/upload-testflight.sh
   ```
4. Complete ASC listing (screenshots, privacy nutrition labels matching the Privacy Manifest, review notes: private-hub URL entry on first launch).
5. Prefer **HTTPS reverse-proxy** for production hubs; local HTTP is allowed for LAN UAT via ATS local networking.

Export options: `scripts/ios-exportOptions-app-store.plist`.

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

Copy IPAs/APKs into `site/downloads/` (and `tracko-install/downloads/`). Update `manifest.json` phone fields. Homepage **Downloads** on https://zyvorai.github.io/tracko-install/#downloads links these files for vendor UAT.
