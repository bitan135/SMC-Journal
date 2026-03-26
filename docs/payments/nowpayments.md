# SOP: NOWPayments Integration

## 1. Purpose
Documents the end-to-end crypto payment flow for SMC Journal subscriptions using NOWPayments as the payment gateway with USDT on Arbitrum.

## 2. Owner
- `src/lib/payments/nowpayments.ts` — API client
- `src/app/api/payments/create/route.js` — Payment initiation
- `src/app/api/payments/[id]/route.js` — Payment status lookup
- `src/app/api/webhooks/nowpayments/route.js` — IPN webhook handler
- `src/app/billing/checkout/page.js` — Checkout UI

## 3. Dependencies
- **NOWPayments API:** `https://api.nowpayments.io/v1`
- **Environment Variables:**
  - `NOWPAYMENTS_API_KEY` — API authentication
  - `NOWPAYMENTS_IPN_SECRET` — Webhook signature verification
- **Crypto Network:** USDT on Arbitrum (`usdtarb`)
- **Supabase:** `crypto_payments` + `subscriptions` tables

## 4. Payment Creation Flow
```
User clicks "Upgrade" → /billing/checkout?plan=6_month
    ↓
User fills billing form → clicks "Proceed to Crypto Settlement"
    ↓
Frontend POST /api/payments/create
  { planId: "6_month", billingDetails: {...}, coupon: "SMC2026" }
    ↓
Server validates session + rate limit (3/min)
    ↓
Server looks up price: pro=$20, 6_month=$50
    ↓
If coupon "SMC2026" → apply 20% discount
    ↓
Server calls NOWPayments API:
  POST https://api.nowpayments.io/v1/payment
  {
    price_amount: 50,
    price_currency: "usd",
    pay_currency: "usdtarb",
    ipn_callback_url: "https://smcjournal.app/api/webhooks/nowpayments",
    order_id: "{userId}_{timestamp}",
    order_description: "SMC Journal 6_MONTH Plan"
  }
    ↓
NOWPayments returns: payment_id, pay_address, pay_amount
    ↓
Server saves to crypto_payments table
    ↓
Frontend receives payment_id → shows deposit instructions
```

## 5. Crypto Transaction Lifecycle
```
waiting → confirming → confirmed → sending → finished
                                 ↘ partially_paid
         → expired (if no payment received in time window)
         → failed
```

| Status | Meaning | Action |
|---|---|---|
| `waiting` | Invoice created, awaiting deposit | Show pay_address + pay_amount to user |
| `confirming` | Transaction detected, waiting for block confirmations | Show "Confirming..." |
| `confirmed` | Sufficient confirmations received | Processing... |
| `sending` | NOWPayments converting/forwarding funds | Almost done |
| `finished` | Payment complete | **UPGRADE SUBSCRIPTION** |
| `partially_paid` | User sent less than required | **STILL UPGRADES** (current policy) |
| `expired` | No payment received in time window | No action |
| `failed` | Transaction failed | No action |

## 6. Webhook (IPN) Handler

### Signature Verification
```
1. Extract x-nowpayments-sig header
2. Sort payload keys alphabetically
3. HMAC-SHA512(sorted JSON, NOWPAYMENTS_IPN_SECRET)
4. Compare calculated signature with header signature
5. If mismatch → reject with 401
```

### Subscription Upgrade Logic
On `finished` or `partially_paid`:
1. Lookup `plan_id` from `crypto_payments` by `payment_id`
2. Extract `userId` from `order_id` (format: `userId_timestamp`)
3. Calculate `current_period_end`:
   - `pro` → now + 30 days
   - `6_month` → check existing subscription:
     - If active (end > now) → extend: existing_end + 180 days
     - If expired or none → now + 180 days
   - `lifetime_legacy` → null (perpetual)
4. Upsert `subscriptions` table with new plan, status='active', period end

### Idempotency
- Webhook may fire multiple times for the same payment
- `upsert` with `onConflict: 'user_id'` prevents duplicate subscriptions
- Payment status update uses `eq('payment_id', ...)` — safe for replays

## 7. Failure Modes

| Failure | Cause | Impact | Resolution |
|---|---|---|---|
| Webhook never fires | NOWPayments IPN misconfigured | User paid but not upgraded | Manual: check NOWPayments dashboard, manually update subscription |
| Signature verification fails | IPN secret mismatch or payload tampered | Webhook returns 401 | Verify `NOWPAYMENTS_IPN_SECRET` matches dashboard |
| Underpayment | User sends less USDT than required | Currently: subscription is upgraded (`partially_paid` treated as success) | Review policy — consider rejecting or partial access |
| Overpayment | User sends more USDT than required | NOWPayments handles internally | No action needed |
| Wrong network | User sends USDT on wrong chain (e.g., Ethereum instead of Arbitrum) | Payment may not be detected | User must contact NOWPayments support |
| Delayed confirmation | Network congestion on Arbitrum | Payment stuck in `confirming` for extended time | Wait — Arbitrum is fast, usually <5 min |
| Expired invoice | User didn't pay within time window | `expired` status, no upgrade | User must create a new payment |
| Duplicate webhook | NOWPayments retries IPN | No impact — upsert is idempotent | No action needed |

## 8. Debugging Guide
1. **User paid but not upgraded:**
   - Check `crypto_payments` table: `SELECT * FROM crypto_payments WHERE user_id = '...' ORDER BY created_at DESC;`
   - Check `payment_status` — if not `finished`, payment hasn't completed
   - Check Vercel logs for `NOWPayments Webhook Error` entries
   - Check NOWPayments dashboard → Payments for the payment_id
   - If confirmed on NOWPayments but webhook didn't fire → manually update subscription
2. **Webhook returning 403/401:**
   - Verify `NOWPAYMENTS_IPN_SECRET` environment variable in Vercel matches NOWPayments dashboard
   - Check if the signature header `x-nowpayments-sig` is present
3. **Payment creation returning 400:**
   - Check NOWPayments API status: `GET https://api.nowpayments.io/v1/status`
   - Verify `NOWPAYMENTS_API_KEY` is valid
   - Check Vercel logs for the detailed error response

## 9. Logs & Observability
- **Vercel Logs:** Search for `Payment Error Details:`, `NOWPayments Webhook Error:`, `Payment creation error:`
- **NOWPayments Dashboard:** Real-time payment status and IPN delivery logs
- **Supabase Database:** `crypto_payments` table has full audit trail with timestamps

## 10. Recovery Procedure
- **Manual subscription upgrade:**
```sql
UPDATE subscriptions
SET plan_id = '6_month',
    status = 'active',
    current_period_end = now() + interval '180 days',
    updated_at = now()
WHERE user_id = '<user_id>';
```
- **Re-verify a payment:** Use NOWPayments API: `GET /v1/payment/{payment_id}` with API key

## 11. Edge Cases
- User buys 6-month plan twice before first expires → +180 days extends from existing expiry
- User on `pro` (monthly) buys `6_month` → upsert overrides to `6_month`
- `partially_paid` is treated as success — this is a business decision, not a technical one
- Rate limit (3/min) prevents payment spam but resets on serverless cold start

## 12. Security Considerations
- HMAC-SHA512 signature verification prevents forged webhooks
- Service role key used in webhook handler (bypasses RLS) — webhook endpoint has no Supabase user session
- Rate limiting on payment creation prevents invoice farming
- `pay_address` is unique per payment — no address reuse concerns
- Coupon code `SMC2026` is hardcoded — not configurable via env vars

## 13. Version
Last Updated: 2026-03-26
