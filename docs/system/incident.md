# SOP: Incident Response

## 1. Purpose
Master SOP for when something breaks in production. Optimized for speed: diagnose → isolate → fix → verify.

## 2. Severity Levels

| Level | Definition | Response Time | Examples |
|---|---|---|---|
| **P0** | System down, no login/payments | Immediate | Auth broken, Supabase outage |
| **P1** | Major feature broken | < 1 hour | Payments failing, trades not saving |
| **P2** | Minor feature degraded | < 4 hours | Analytics chart broken, styling issue |
| **P3** | Cosmetic / non-blocking | Next session | Typo, minor alignment |

## 3. Incident Response Flow

### Step 1: Identify Scope
- What is broken? (Login, dashboard, payments, affiliate)
- Who is affected? (All users, specific plan, specific browser)
- When did it start? (After deploy, random, time-based)

### Step 2: Check Logs
```
Frontend errors  → Browser DevTools → Console
API errors       → Vercel Dashboard → Logs → filter by route
Auth errors      → Supabase Dashboard → Auth → Logs
Database errors  → Supabase Dashboard → Database → Logs
Payment errors   → NOWPayments Dashboard → Payments
Webhook errors   → Vercel Logs → search "NOWPayments Webhook Error"
```

### Step 3: Reproduce
1. Open the affected route in an incognito browser
2. Check if it's auth-dependent (logged in vs logged out)
3. Check if it's plan-dependent (free vs pro)
4. Check mobile vs desktop

### Step 4: Isolate System
| Symptom | Likely System | First Check |
|---|---|---|
| White screen / infinite spinner | Auth / AuthProvider | Vercel logs for middleware errors |
| "Unauthorized" errors | Session / cookies | Browser cookies for `sb-smc-auth-v5` |
| Trades not saving | Supabase / RLS | Database logs + RLS policies |
| Payment not upgrading account | Webhook / subscription | `crypto_payments` table status |
| Analytics empty | Data fetch / storage.js | Console for Supabase errors |
| Affiliate dashboard empty | JWT / affiliate-auth | Check `aff_token` cookie |

### Step 5: Apply Fix
- **Code fix:** Edit → `npm run build` → verify → `git push` (triggers Vercel deploy)
- **Database fix:** Supabase SQL Editor → run corrective query
- **Environment fix:** Vercel Dashboard → Settings → Environment Variables
- **Emergency rollback:** Vercel Dashboard → Deployments → promote previous deployment

### Step 6: Validate
1. Clear browser cache/cookies
2. Verify the fix in production
3. Check Vercel logs for new errors
4. Monitor for 30 minutes

### Step 7: Monitor
- Watch Vercel logs for recurring errors
- Check Supabase Dashboard for unusual patterns
- Review PostHog for user behavior anomalies

## 4. Common Incidents & Runbooks

### Auth Redirect Loop
1. Check `src/lib/routes.js` — is the route in PUBLIC or PROTECTED?
2. Check middleware `isPublicRoute()` function
3. Check for domain mismatch (www vs apex vs custom)
4. Fix: Ensure `smcjournal.app` is primary domain in Vercel

### Payment Completed But No Upgrade
1. `SELECT * FROM crypto_payments WHERE payment_id = '...'` → check status
2. If status = `finished` but subscription not updated → webhook failed
3. Check Vercel logs for webhook errors
4. Fix: Manually update subscription (see `docs/database/queries.md`)

### User Stuck on Free Plan
1. `SELECT * FROM subscriptions WHERE user_id = '...'`
2. If missing → trigger didn't fire on signup → insert manually
3. If `plan_id = 'free'` but user paid → check crypto_payments status

### Supabase Down
1. Check https://status.supabase.com
2. App will show loading spinners (AuthProvider can't fetch session)
3. No fix — wait for Supabase recovery
4. Consider showing a maintenance banner

## 5. Emergency Contacts
- **Supabase Support:** Dashboard → Support
- **NOWPayments Support:** support@nowpayments.io
- **Vercel Support:** Dashboard → Support
- **Developer:** hello.bitanbiswas@gmail.com

## 6. Version
Last Updated: 2026-03-26
