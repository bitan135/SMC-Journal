# SOP: System Monitoring

## 1. Purpose
Proactive monitoring strategy for catching issues before users report them.

## 2. Health Checks

### Daily Checks
1. **Vercel Dashboard → Deployments:** Verify latest deploy is live and healthy
2. **Supabase Dashboard → Database:** Check connection pool usage, no alerts
3. **NOWPayments Dashboard → Payments:** Verify no stuck `waiting` payments older than 24h

### Weekly Checks
1. **Supabase → Auth → Users:** Check signup trend, no anomalies
2. **PostHog → Insights:** Review key funnel metrics (signup → upgrade)
3. **Vercel → Logs:** Search for recurring 500 errors
4. **Database → subscriptions:** Check for expired subscriptions that should have expired plan access

### Subscription Expiry Check
```sql
-- Users with expired subscriptions still marked active
SELECT user_id, plan_id, status, current_period_end
FROM subscriptions
WHERE status = 'active'
  AND current_period_end < now()
  AND plan_id != 'lifetime_legacy';
```
If results found → update status to 'expired' or enforce in application logic.

## 3. Alerting
Currently no automated alerting configured. Recommended:
- **Vercel:** Enable Slack/email notifications for failed deployments
- **Supabase:** Enable alerts for database connection limits
- **NOWPayments:** Monitor IPN delivery failures

## 4. Performance Baseline
| Metric | Expected | Warning |
|---|---|---|
| Page load (dashboard) | < 2s | > 5s |
| API response (payments/create) | < 3s | > 10s |
| Build time | < 30s | > 60s |
| Database query (trades) | < 500ms | > 2s |

## 5. Version
Last Updated: 2026-03-26
