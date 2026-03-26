# SOP: API Endpoints

## 1. Purpose
Documents every server-side API route, its inputs, outputs, authentication requirements, rate limiting, and failure modes.

## 2. Owner
`src/app/api/` — 9 route handlers across 3 domains: auth, payments, affiliate.

## 3. Endpoint Map

### Auth
| Method | Route | Auth | Purpose |
|---|---|---|---|
| GET | `/auth/callback` | None (public) | OAuth code→session exchange + referral attribution |
| GET | `/api/auth/logout` | Session | Clears session cookies, redirects to `/login` |

### Payments
| Method | Route | Auth | Rate Limit | Purpose |
|---|---|---|---|---|
| POST | `/api/payments/create` | Supabase session | 3/min/user | Creates NOWPayments invoice, saves to `crypto_payments` |
| GET | `/api/payments/[id]` | Supabase session | None | Fetches payment record by `payment_id` |

### Webhooks
| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/webhooks/nowpayments` | IPN signature (HMAC-SHA512) | Processes payment completion, upgrades subscription |

### Affiliate
| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/affiliate/apply` | None (public) | Submits affiliate application |
| POST | `/api/affiliate/click` | None (public) | Records affiliate link click |
| POST | `/api/affiliate/login` | None (public) | Authenticates affiliate, sets JWT cookie |
| GET | `/api/affiliate/logout` | `aff_token` cookie | Clears affiliate JWT |
| GET | `/api/affiliate/me` | `aff_token` cookie (JWT) | Returns affiliate profile + stats |

## 4. Detailed Flows

### POST `/api/payments/create`
**Input:**
```json
{ "planId": "pro|6_month", "billingDetails": {...}, "coupon": "SMC2026"|null }
```
**Flow:**
1. Validate Supabase session (`supabase.auth.getUser()`)
2. Rate limit check: 3 requests per minute per `payment_{userId}`
3. Lookup price: `pro` → $20, `6_month` → $50
4. Apply coupon: `SMC2026` → 20% discount
5. Call NOWPayments API (`POST /v1/payment`) with USDT on Arbitrum
6. Save record to `crypto_payments` table
7. Return NOWPayments response (includes `payment_id`, `pay_address`)

**Failure Modes:**
- Invalid `planId` → 400
- No session → 401
- Rate limited → 429
- NOWPayments API down → 400 with error message
- Supabase insert fails → 500

### POST `/api/webhooks/nowpayments`
**Input:** NOWPayments IPN payload + `x-nowpayments-sig` header
**Flow:**
1. Extract IPN signature from header
2. Verify HMAC-SHA512 signature using `NOWPAYMENTS_IPN_SECRET`
3. Validate `payment_id`, `order_id` format (`userId_timestamp`)
4. Update `crypto_payments.payment_status`
5. If status is `finished` or `partially_paid`:
   a. Lookup `plan_id` from `crypto_payments`
   b. For `pro` → set `current_period_end = now + 30 days`
   c. For `6_month` → check existing subscription, extend from `current_period_end` if active, else from now + 180 days
   d. For `lifetime_legacy` → set `current_period_end = null`
   e. Upsert `subscriptions` table

**Failure Modes:**
- Missing/invalid signature → 401/403
- Malformed `order_id` → 400
- Payment record not found → 500
- Supabase upsert fails → 500

### GET `/api/affiliate/me`
**Input:** `aff_token` HTTP-only cookie
**Flow:**
1. Read `aff_token` from cookies
2. Verify JWT (24h expiry)
3. Fetch affiliate profile from `affiliates` table
4. Fetch referrals from `affiliate_referrals` (with commission data)
5. Count clicks from `affiliate_clicks`
6. Calculate: totalEarned, pendingPayout, paidOut
7. Return aggregated stats

## 5. Rate Limiting
- **Implementation:** In-memory `Map` in `src/lib/rateLimit.js`
- **Scope:** Per-user, per-action identifier
- **Payment creation:** 3 requests / 60 seconds / user
- **Cleanup:** Every 1000 entries, stale timestamps are pruned
- **WARNING:** In-memory rate limiting resets on server restart / cold start. Not persistent across Vercel serverless instances.

## 6. Security Considerations
- Payment webhook uses HMAC-SHA512 verification — never trust unverified payloads
- Affiliate API routes use service role key (bypasses RLS) — validates auth via JWT
- `GET /api/payments/[id]` uses user-scoped Supabase client (RLS enforced) — users can only see their own payments
- No CSRF protection on API routes — Next.js Fetch requests include origin headers

## 7. Version
Last Updated: 2026-03-26
