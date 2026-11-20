# WhatsApp Notifications

## Endpoint

`POST /api/v1/whatsapp/send`

```json
{
  "to": "+919876543210",
  "template": "shipment_update",
  "params": ["AJB-1001", "In Transit", "Vadodara"]
}
```

Response includes `mode` (`demo` | `live`) and `provider` (`demo` | `meta_cloud`). If live credentials are set but the call fails, the response is `mode: demo` with `live_configured: true` and a `live_error` (a broken credential is visible, not silent). Sends are persisted on the notification log with status `sent_live` or `sent`.

## Live (Meta Cloud API)

Set both:

```bash
WHATSAPP_TOKEN=...          # permanent system user token
WHATSAPP_PHONE_ID=...       # WhatsApp Business phone number id
```

Optional `WHATSAPP_API_BASE` overrides the Graph URL (default `https://graph.facebook.com/v19.0`; used by tests). Hub calls `integrations::send_whatsapp` → Graph API template messages. Empty env keeps demo acks (`WA-…` message ids). Check `/health` → `integrations.whatsapp`.

## Templates (typical)

- Shipment booked
- In transit update
- Delivered + POD
- e-Way Bill generated
- Exception alerts
- Carrier RFQ (UAT sim)

Approve templates in Meta Business Manager before production send.

## Inbound webhook (STOP / START)
`GET|POST /api/v1/webhooks/whatsapp`. Configure the callback URL in the Meta app and subscribe to `messages`.
- `GET` answers Meta's handshake when `hub.verify_token` equals `WHATSAPP_VERIFY_TOKEN`.
- `POST` needs `WHATSAPP_APP_SECRET` (503 `webhook_not_configured` without it) and a valid `X-Hub-Signature-256` (401 otherwise). A text or button reply of stop / unsubscribe / opt out records an opt-out and removes the number from every shipment's contacts; start / unstop / subscribe lifts it.

## Proactive consignee alerts
With `PROACTIVE_ALERTS=1` the hub messages the consignee when a shipment is **delayed**, its vehicle has **stalled**, or it is **arriving soon**, using only real GPS and promised dates. Recipients are set per shipment with `POST /api/v1/shipments/:id/contact` (up to 3, optional kinds); nothing is sent between 21:00 and 08:00 IST by default. Approve the templates `shipment_delay`, `arriving_soon` and `shipment_stalled` in Meta first. Settings and behaviour: OPS.md and the "Proactive consignee alerts" section of the repo's `AGENTS.md`.

