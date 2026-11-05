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

## Native capabilities (Driver / Scanner)
- **Driver background GPS:** `@capacitor-community/background-geolocation` (Android foreground service, iOS `UIBackgroundModes: location`). The plugin's Android Gradle file predates AGP 9, so `apps/driver/patches/*.patch` (applied by `patch-package` on `npm install`) fixes it; re-check the patch when bumping the plugin. Users must allow location "Always"; the app opens Settings if it is denied. Browsers/PWAs keep the foreground-only fallback.
- **POD photos:** still the file input, now downscaled in the page to 1280 px JPEG (~100 KB) before upload.
- **Scanner:** native ML Kit scanner (`@capacitor-mlkit/barcode-scanning`) plus haptic feedback (`@capacitor/haptics`); iOS minimum is now 15.5. On Android the first scan may download Google's scanner component. The web build keeps getUserMedia + BarcodeDetector and the manual PKG chips.
- **Offline queue:** scans are queued with their `scan_id` and flushed in order on reconnect or every 20 s; the hub replays duplicates.
- Not done: push notifications (needs Firebase `google-services.json` and an APNs key, both operator-side; registering without them can crash Android).
- Verify on a device: location with the screen locked for several minutes, and that an `http://<LAN-IP>` hub is reachable from the app (`server.androidScheme: 'https'` can block cleartext/mixed content; if so use `androidScheme: 'http'` or a cleartext network-security config).

## iOS 27: UIScene lifecycle is mandatory
Builds against the iOS 27 SDK that have not adopted the UIScene lifecycle are **terminated at launch** on iOS 27 (`UIApplicationEvaluateRuntimeIssueForNoSceneLifecycleAdoption`). Both apps now adopt it: `ios/App/App/SceneDelegate.swift` forwards to Capacitor's `SceneDelegateProxy`, `AppDelegate` provides the scene configuration, and `Info.plist` has `UIApplicationSceneManifest` (storyboard `Main`). Re-check this after any `npx cap migrate` or Capacitor upgrade, which may overwrite these files. IPAs built before this change crash on iOS 27 devices.

## Simulator caveat for the Scanner
Google's ML Kit iOS frameworks have no arm64-simulator slice, so the Scanner iOS app only runs on a physical iPhone (a generic simulator build compiles but cannot be launched on Apple Silicon). The Driver runs in the simulator: `xcodebuild -destination 'id=<sim>' ...`, `xcrun simctl install/launch`.

## Look and feel
- Theme: auto / light / dark (`apps/shared/theme.ts`, tokens in each `brand.css`; the corner toggle cycles them). Light is the high-contrast mode for sunlight.
- Splash: branded dark splash generated with `@capacitor/assets` from `apps/*/assets/splash*.png`; it is held until the first React frame (`hideSplash` in `src/chrome.ts`).
- Android back minimises the app instead of exiting; the screen stays awake while GPS sharing (Driver) or when paired (Scanner).
- Hub-served PWAs live under `/driver/`, `/scanner/`, `/app/`: never use absolute asset URLs (`scripts/check-base-paths.sh` runs in CI).

## Driver app structure (Phase 2)
`apps/driver/src/App.tsx` owns the hub connection, route data, GPS and the shared `run()` helper; the screens are components:
- `NextStopCard` (hero: Mark arrived / Navigate / Call, package + COD + delivery-slot chips, "Running late" when the hub's delay risk is medium/high), `StopList` (remaining + collapsed completed), progress bar.
- `DoorFlow`: guided one-step-at-a-time delivery (OFD → arrive → scan → OTP if required → COD if due → proof of delivery) with a sticky bottom action bar. It stays pinned to the stop it was opened for, so the "Done" screen survives the stop closing.
- `SosButton`: press-and-hold (1.5 s, haptic) so a pocket tap cannot raise an alarm; keyboard hold also works.
- `SettingsSheet`: hub, vendor code, GPS sharing, theme, language. Theme/language stay in the header only before the hub is connected.
- `stops.ts`: pure helpers (`splitStops`, `progress`, `slotTimes`, `etaInfo`, `doorSteps`), unit tested.
- Android back handling uses a priority stack in `chrome.ts` (`onBackButton(handler, priority)`: sheet 30, door step 20, tab 10; nothing consumed = minimise).
The hub's `/api/v1/eta/predict/:id` is corridor-level (its `predicted_arrival` is often relative, e.g. "+10h"), so the Driver only shows an ETA clock time if it is a real timestamp.

## Driver offline-first actions (Phase 3)
Every driver action (arrive, OFD, scan, COD, deliver, NDR, partial, safe drop, reschedule, cash close, SOS) goes through `performAction` (`apps/driver/src/actions.ts`):
- It sends `Idempotency-Key: <uuid>`. If the hub cannot be reached (network error, timeout, 5xx, 409 in-progress) the action is saved to the outbox (`actionQueue.ts`, IndexedDB with a localStorage fallback) **under that same key** and the driver carries on; the route advances optimistically and the stop shows "Waiting to sync".
- It flushes oldest-first on reconnect (`online`), when the app returns to the foreground, every 20 s while anything waits, and from the "Sync now" button. A hub answer of `success:false` (business "no") moves that action to a "Needs your attention" list instead of blocking the rest; network/5xx stops the flush and keeps order.
- **Hub side:** `delivery_agent::idempotency` middleware replays the stored response (`"idempotent": true`) for a repeated (path, key), so a retry after a lost reply never double-counts COD or raises a second SOS. Keys are per endpoint (at most 128 characters of `A-Za-z0-9_-`, else 400 `invalid_idempotency_key`), entries are persisted in `agent_idempotency` (latest 5000) with a hash of the request body, so reusing a key with different content is refused (422 `idempotency_key_reused`) instead of replaying the first answer. Only successful (2xx) responses are stored. A concurrent twin gets `409 in_progress`, and requests without the header behave as before.
- Not queued (need a live connection): OTP send/verify, and a delivery for a stop that requires an OTP unless the OTP was already verified online.
- Shared outbox logic: `apps/shared/queue.ts` (`flushQueue`), also used by the Scanner.
- Verified: a COD delivery completed with the hub switched off, then the hub restarted; exactly one ₹ transaction was recorded and replaying the saved key returned the same receipt. Not yet verified on a real phone with real airplane mode.

## Scanner pro mode (Phase 4)
- **Continuous native scan** (`startContinuousScan` in `apps/scanner/src/native.ts`): the ML Kit camera preview runs behind the WebView and every barcode is reported to the app, which draws its own overlay (`ScanOverlay`): reticle, last code with ok/duplicate/error colour, ✓/⚠/✕ counters, progress "received of expected", torch, zoom slider, sound toggle, big Stop. While live, `<html>` carries `scan-live` so the page is transparent (the plugin makes the WebView itself transparent on both platforms). The old single-shot scan stays as "Scan one"; the web build keeps getUserMedia/BarcodeDetector and the manual PKG chips.
- **Batch sessions** (`session.ts`, pure and unit tested): name a pallet/trip, scan, then `SessionSummary` reports **Missing / Extra / Scanned twice** against the expected list **snapshotted at session start** (the hub's list shrinks as packages arrive). Direction is locked during a session. Sessions persist across app restarts; "Finish & sync" flushes the offline queue and closes it.
- **Sound**: synthesized tones per result (`sound.ts`), mute persisted; haptics unchanged.
- **Pairing fix**: after pairing, the app used to adopt the hub's advertised address, which defaults to `http://localhost:8080` (the phone itself), breaking every later request. It now keeps the address that just worked unless the advertised one is routable (`hubUrl.ts`).
- Verified: the whole session flow driven against a real hub (counters, duplicate, extra, missing, finish & sync, persistence across reload); component and reducer tests; Android release build; iOS compile. **Not verified (needs a real iPhone/Android phone):** the camera preview itself, torch, zoom, autofocus on small labels, sound loudness, and the transparent-WebView overlay look. The iOS Scanner cannot run in an Apple Silicon simulator (ML Kit).

## Push notifications (hub side only so far)
The hub can register phone tokens and send to FCM/APNs once configured ([INTEGRATIONS.md](./INTEGRATIONS.md)): `POST /api/v1/agent/push/register {platform: android|ios, token, app: driver|scanner, driver_id?}` and `/unregister` (phone routes, no staff token), `GET /api/v1/push/devices` (tokens masked), `POST /api/v1/push/send {title, body, driver_id? | app? | all:true, data?}` (dispatcher or admin; a send with no target is refused). A token the provider reports as dead is removed. **The apps do not register yet.** That needs, per app: the Capacitor push plugin, a Firebase project with `google-services.json` for Android, and the Push Notifications capability and an APNs key for iOS (plus a rebuild and a device test). Nothing in the hub triggers a push by itself yet; alerts still go out by WhatsApp.

