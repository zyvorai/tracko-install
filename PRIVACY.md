# Privacy note (public beta)

Tracko’s **public site** (this GitHub Pages repo) only distributes install scripts and marketing assets. It does **not** collect freight data, GPS, or account information.

## Your hub

When you run the Tracko API hub:

- Shipment, GPS, and ops data stay on **your** machine or VPS (JSON snapshot and optional Postgres).
- OTP / JWT secrets are yours (`JWT_SECRET`); the hub generates nothing that is sent anywhere else.
- India / WhatsApp / payout credentials you configure never leave your hub except to the providers you choose.

## Install telemetry

`install.sh` / `install.ps1` download binaries from this site (or your `TRACKO_BASE_URL`). They do not phone home analytics beyond normal HTTPS CDN/GitHub request logs.

## Feedback

If you file a GitHub issue, avoid pasting API keys, JWT secrets, or customer PII.
