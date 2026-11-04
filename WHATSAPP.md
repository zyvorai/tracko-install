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

Response includes `mode` (`demo` | `live`) and `provider` (`demo` | `meta_cloud`). Successful sends are persisted on the notification log.

## Live (Meta Cloud API)

Set both:

```bash
WHATSAPP_TOKEN=...          # permanent system user token
WHATSAPP_PHONE_ID=...       # WhatsApp Business phone number id
```

Hub calls `integrations::send_whatsapp` → Graph API template messages. Empty env keeps demo acks (`WA-…` message ids). Check `/health` → `integrations.whatsapp`.

## Templates (typical)

- Shipment booked
- In transit update
- Delivered + POD
- e-Way Bill generated
- Exception alerts
- Carrier RFQ (UAT sim)

Approve templates in Meta Business Manager before production send.
