# SOP: Logging & Monitoring

## 1. Purpose
Documents where to find logs, what signals matter, and how to set up observability.

## 2. Log Locations

| System | Where | How to Access |
|---|---|---|
| Frontend errors | Browser DevTools Console | F12 → Console tab |
| API route logs | Vercel Dashboard → Logs | Filter by function name |
| Middleware logs | Vercel Dashboard → Logs | Search "middleware" |
| Auth events | Supabase → Auth → Logs | Filter by event type |
| Database errors | Supabase → Database → Logs | pgAudit logs |
| Payment webhooks | Vercel Logs + NOWPayments Dashboard | Search "NOWPayments" |
| Analytics events | PostHog Dashboard | Filter by event name |

## 3. Key Log Prefixes
| Prefix | Source | Meaning |
|---|---|---|
| `[AuthProvider]` | `AuthProvider.js` | Auth state changes |
| `[Auth Callback]` | `auth/callback/route.js` | OAuth code exchange |
| `[Referral]` | `referral.js` | Referral code capture |
| `Payment Error Details:` | `payments/create` | NOWPayments API error |
| `NOWPayments Webhook Error:` | `webhooks/nowpayments` | Webhook processing failure |
| `Affiliate apply error:` | `affiliate/apply` | Application submission error |
| `Affiliate login error:` | `affiliate/login` | Auth failure |
| `Affiliate me error:` | `affiliate/me` | Dashboard data fetch error |

## 4. Critical Signals
| Signal | Indicates | Action |
|---|---|---|
| Repeated 401 on webhook | IPN secret mismatch | Verify env var |
| Spike in 429 responses | Rate limit hit / abuse | Check for bot activity |
| `handle_new_user` trigger failure | Users without profiles | Run fix query |
| Session cookie missing | Auth configuration issue | Check cookie domain setting |
| PostHog `upgrade_clicked` with no payment | Checkout abandonment | UX investigation |

## 5. PostHog Events
| Event | Trigger | Data |
|---|---|---|
| `upgrade_clicked` | User clicks upgrade button | `{ plan_id }` |
| Page views | Automatic | URL, referrer |
| Feature usage | Custom events | Varies |

## 6. Version
Last Updated: 2026-03-26
