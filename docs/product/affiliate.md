# SOP: Affiliate System

## 1. Purpose
Documents the referral and affiliate tracking system for SMC Journal, including commission logic, fraud prevention, and partner management.

## 2. Owner
- `src/app/affiliate/` — Public-facing affiliate pages (apply, login, dashboard)
- `src/app/api/affiliate/` — API routes (apply, click, login, logout, me)
- `src/lib/affiliate-auth.js` — JWT authentication for affiliates
- `src/lib/referral.js` — Client-side referral code capture
- `src/app/auth/callback/route.js` — Referral attribution on signup

## 3. Architecture
The affiliate system is **completely separate from the main Supabase Auth system.** Affiliates authenticate via custom JWT (not Supabase sessions).

### Database Tables
- `affiliates` — Partner profiles (name, email, password_hash, coupon_code, commission_rate, status)
- `affiliate_clicks` — Click tracking (affiliate_id, coupon_code, timestamp)
- `affiliate_referrals` — Referral records (affiliate_id, referred_user_id, plan_purchased, commission_earned)
- `affiliate_applications` — Application submissions (pending review)

## 4. Flow: Affiliate Onboarding
```
1. Partner visits /affiliate → applies via form
2. POST /api/affiliate/apply → inserts into affiliate_applications
3. Admin reviews application (manual process)
4. Admin creates affiliate record in affiliates table with:
   - coupon_code
   - commission_rate (e.g., 0.20 = 20%)
   - discount_rate (e.g., 0.20 = 20% off for referred users)
   - password_hash (bcrypt)
   - status: 'active'
5. Affiliate receives credentials → logs in at /affiliate/login
```

## 5. Flow: Referral Tracking
```
1. Affiliate shares link: https://smcjournal.app/?ref=AFFILIATECODE
2. User visits link → ReferralTracker component fires
3. captureReferral() stores code in cookie: smc_referral_code (30-day TTL)
4. POST /api/affiliate/click → records click in affiliate_clicks
5. User signs up (email/password or OAuth)
6. Auth callback (/auth/callback) reads smc_referral_code cookie:
   a. Finds affiliate by referral_code
   b. Verifies affiliate.id !== user.id (no self-referral)
   c. Checks profile.referred_by is null (no double attribution)
   d. Updates profiles.referred_by = affiliate.id
   e. Creates referral record in affiliate_referrals
   f. Increments affiliates.total_referrals
```

## 6. Flow: Commission
```
When referred user purchases a plan:
  1. Payment webhook fires
  2. Check if user has referred_by in profiles
  3. Calculate commission: payment_amount × commission_rate
  4. Update affiliate_referrals with commission_earned, plan_purchased
  5. Update affiliates.total_earnings_usd

NOTE: Commission is currently tracked but NOT automatically paid out.
Manual payout process required.
```

## 7. Affiliate Dashboard
`GET /api/affiliate/me` returns:
- Affiliate profile (name, email, coupon_code, rates)
- Stats:
  - `totalClicks` — from affiliate_clicks count
  - `totalSignups` — from affiliate_referrals count
  - `conversions` — referrals where plan_purchased is truthy
  - `totalEarned` — sum of commission_earned
  - `pendingPayout` — unpaid commissions
  - `paidOut` — totalEarned - pendingPayout
- Full referral list with details

## 8. Authentication
- **Library:** `src/lib/affiliate-auth.js`
- **Method:** JWT signed with `AFFILIATE_JWT_SECRET`
- **Token expiry:** 24 hours
- **Storage:** `aff_token` HTTP-only cookie (httpOnly, Secure in prod, SameSite: Lax, maxAge: 86400)
- **Password hashing:** bcrypt via `bcryptjs`

## 9. Failure Modes
| Failure | Cause | Impact |
|---|---|---|
| Referral not attributed | Cookie expired (>30 days) | User signs up without referral link |
| Self-referral | Affiliate creates account via own link | Blocked: `affiliate.id !== user.id` check |
| Double attribution | User already has referred_by | Blocked: `!profile.referred_by` check |
| Click not recorded | API error in /api/affiliate/click | Click count underreported |
| JWT expired | Affiliate hasn't refreshed session in 24h | Must re-login |

## 10. Abuse Cases
| Case | Current Protection |
|---|---|
| Self-referral | ID mismatch check |
| Bot clicks | No rate limiting on click endpoint |
| Coupon sharing | No restriction (by design) |
| Fake signups | Only counts as conversion when plan purchased |
| Cookie stuffing | 30-day TTL, first-come attribution |

## 11. Security Considerations
- `AFFILIATE_JWT_SECRET` defaults to `'dev-secret-change-in-production'` — **MUST be set in production**
- Affiliate routes use service role key (bypasses RLS) — necessary for cross-user queries
- Password stored as bcrypt hash — never returned in API responses
- `aff_token` is HTTP-only — not accessible via JavaScript

## 12. Version
Last Updated: 2026-03-26
