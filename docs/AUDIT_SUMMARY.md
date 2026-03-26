# Audit Summary — SMC Journal SaaS

**Date:** 2026-03-26
**Scope:** Full codebase audit of Edge Ledger (SMC Journal)

---

## Detected Systems

| System | Technology | Key Files |
|---|---|---|
| **Frontend** | Next.js 16 (Turbopack) | 23 routes, 13 components |
| **Auth** | Supabase Auth (PKCE) | middleware.js, AuthProvider.js, callback/route.js |
| **Database** | Supabase Postgres | 6 core tables, 19 migrations |
| **Payments** | NOWPayments (USDT-ARB) | nowpayments.ts, create/route.js, webhooks/route.js |
| **Affiliate** | Custom JWT system | affiliate-auth.js, 5 API routes |
| **Storage** | Supabase Storage | trade-screenshots bucket |
| **Analytics** | PostHog | PostHogProvider.jsx, posthog.js |
| **Hosting** | Vercel | Auto-deploy from GitHub |

## Architecture Diagram
```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│  Landing     │────→│  Supabase   │←────│  NOWPayments │
│  (Next.js)   │     │  Auth       │     │  API         │
└──────┬───────┘     └──────┬──────┘     └──────┬───────┘
       │                    │                    │
       ▼                    ▼                    ▼
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│  Dashboard   │────→│  Supabase   │←────│  Webhook     │
│  (Protected) │     │  Postgres   │     │  Handler     │
└──────┬───────┘     └──────┬──────┘     └──────────────┘
       │                    │
       ▼                    ▼
┌─────────────┐     ┌─────────────┐
│  Affiliate   │────→│  Supabase   │
│  Portal      │     │  Storage    │
└─────────────┘     └─────────────┘
```

## Risk Assessment

### 🔴 High Risk
| Risk | Detail | Recommendation |
|---|---|---|
| In-memory rate limiting | `rateLimit.js` uses `Map()` — resets on cold start | Migrate to Upstash Redis |
| No subscription expiry enforcement | App checks `plan_id` but doesn't auto-expire subscriptions where `current_period_end < now()` | Add cron job or middleware check |
| `partially_paid` = full access | Underpayment currently grants full subscription | Review business policy |
| Hardcoded coupon code | `SMC2026` is hardcoded in `payments/create` | Move to env var or database |

### 🟡 Medium Risk
| Risk | Detail | Recommendation |
|---|---|---|
| No CSRF protection | API routes accept POST without CSRF tokens | Low risk with same-origin cookies |
| Affiliate click endpoint has no rate limit | `/api/affiliate/click` can be spammed | Add rate limiting |
| Dual plan fields | `profiles.plan_type` AND `subscriptions.plan_id` exist | Deprecate `profiles.plan_type` |
| No automated alerting | No Slack/email notifications for errors | Configure Vercel + Supabase alerts |

### 🟢 Low Risk
| Risk | Detail |
|---|---|
| Storage screenshots publicly accessible | By design — trade screenshots are public URLs |
| PostHog client-side only | No server-side analytics capture |
| No automated tests | Rely on build verification only |

## Unclear Areas (Verified)
1. **Commission payout process:** Tracked in DB but payout is manual. No automated payout mechanism exists.
2. **Subscription expiry UX:** No user-facing notification before subscription expires. No grace period.
3. **Referral commission on purchase:** The webhook handler does NOT currently attribute commission to the referrer on payment. The referral record is created at signup, but commission calculation on purchase is not automated.

## Generated Documentation
```
docs/
├── frontend/
│   ├── rendering.md
│   ├── state.md
│   ├── navigation.md
│   └── api-integration.md
├── backend/
│   ├── api.md
│   ├── auth.md
│   └── business-logic.md
├── database/
│   ├── schema.md
│   ├── queries.md
│   └── migrations.md
├── payments/
│   ├── nowpayments.md
│   └── webhooks.md
├── system/
│   ├── incident.md
│   ├── logging.md
│   └── monitoring.md
└── product/
    ├── landing-page.md
    ├── dashboard.md
    └── affiliate.md
```

**Total: 16 SOP documents + 1 Audit Summary = 17 files**
