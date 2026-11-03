# Security policy

## Supported

Public beta installers and the private hub you deploy.

## Report a vulnerability

Email or open a **private** GitHub security advisory on this org if available. Do not post exploits in public issues.

Include: affected version / OS, steps, impact. We aim to acknowledge within a few business days.

## Hardening tips for hubs

- `DEMO_MODE=false` and a strong `JWT_SECRET` (≥24 chars)
- Postgres with a non-default password
- TLS via Caddy/nginx in front of `:8080`
- Do not expose Postgres to the public internet
