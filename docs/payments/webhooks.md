# SOP: Webhook System

## 1. Purpose
Documents the webhook architecture for processing external payment notifications.

## 2. Active Webhooks

### NOWPayments IPN Webhook
- **Endpoint:** `POST /api/webhooks/nowpayments`
- **Source:** NOWPayments payment processor
- **Authentication:** HMAC-SHA512 signature verification
- **Trigger:** Payment status change (waiting → confirming → finished)

## 3. Webhook Security

### Signature Verification Flow
```
1. Read raw JSON body
2. Extract x-nowpayments-sig header
3. Sort all payload keys alphabetically
4. JSON.stringify(sorted payload)
5. HMAC-SHA512(stringified, NOWPAYMENTS_IPN_SECRET)
6. Compare calculated vs received signature
7. Reject if mismatch (401)
```

### Environment Variable
- `NOWPAYMENTS_IPN_SECRET` — Set in Vercel Dashboard AND NOWPayments Dashboard
- **CRITICAL:** These MUST match. If rotated, update both simultaneously.

## 4. Payload Processing
```json
{
  "payment_id": 12345,
  "payment_status": "finished",
  "order_id": "userId_1711234567890",
  "price_amount": 50,
  "pay_amount": 50.123,
  "pay_currency": "usdtarb"
}
```

### Status Actions
| Status | Action |
|---|---|
| `waiting` | Update crypto_payments.payment_status only |
| `confirming` | Update crypto_payments.payment_status only |
| `finished` | Update payment status + **upgrade subscription** |
| `partially_paid` | Update payment status + **upgrade subscription** (current policy) |
| `expired` | Update crypto_payments.payment_status only |
| `failed` | Update crypto_payments.payment_status only |

## 5. Idempotency
- Webhook can fire multiple times for the same event
- `upsert` with `onConflict: 'user_id'` prevents duplicate subscriptions
- Payment status update targets specific `payment_id` — safe for replays

## 6. Failure Modes
| Failure | Cause | Impact |
|---|---|---|
| 401 response | Signature mismatch | Webhook rejected, user not upgraded |
| 500 response | Supabase error on upsert | Payment recorded but sub not upgraded |
| Webhook never arrives | NOWPayments IPN misconfigured | Silent failure — user paid, no upgrade |
| Duplicate deliveries | NOWPayments retry logic | No impact (idempotent) |

## 7. Debugging
1. Check Vercel Logs → search for `NOWPayments Webhook`
2. Check `crypto_payments` table for the payment_id
3. Check NOWPayments Dashboard → Payments → IPN History
4. Verify `NOWPAYMENTS_IPN_SECRET` in Vercel matches NOWPayments

## 8. Manual Recovery
If webhook missed, manually upgrade:
```sql
UPDATE subscriptions
SET plan_id = '6_month', status = 'active',
    current_period_end = now() + interval '180 days',
    updated_at = now()
WHERE user_id = '<user_id>';
```

## 9. Version
Last Updated: 2026-03-26
