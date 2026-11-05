# Security policy

## Supported

Public beta installers and the private hub you deploy.

## Report a vulnerability

Email or open a **private** GitHub security advisory on this org if available. Do not post exploits in public issues.

Include: affected version / OS, steps, impact. We aim to acknowledge within a few business days.

## Hardening tips for hubs

- `DEMO_MODE=false` and a random `JWT_SECRET` of at least 24 characters (`openssl rand -hex 32`). The hub refuses to start in production mode on a short secret or one that looks like a placeholder ("change-me", the value in `.env.example`, …).
- `REQUIRE_RBAC=1` and a real `RBAC_PASSWORD`; set `BOOTSTRAP_ADMIN_EMAIL` so the first admin is yours. A production hub starts empty with that one admin.
- Set `METRICS_TOKEN` so `/metrics` is not open, and `TENDER_WEBHOOK_SECRET` if carriers receive webhooks.
- Postgres with a non-default password, never exposed to the public internet; TLS via Caddy/nginx in front of the hub port.
- Back up hourly (`scripts/backup-hub.sh`, `KEEP=48`) and rehearse a restore (`scripts/restore-hub.sh`) before you need it.
- Staff tokens last 30 days by default (`JWT_TTL_SECS`); sign-out and an admin's revoke void them early. Revocation is held in memory, so rotating `JWT_SECRET` is the way to void everything.
