# SOP: Common Database Queries

## 1. Purpose
Reference for frequently needed database queries during debugging and operations.

## 2. User Debugging

### Find user by email
```sql
SELECT id, email, created_at FROM auth.users WHERE email = 'user@example.com';
```

### Check user's profile and subscription
```sql
SELECT p.*, s.plan_id, s.status, s.current_period_end
FROM profiles p
LEFT JOIN subscriptions s ON s.user_id = p.id
WHERE p.id = '<user_id>';
```

### List users without subscriptions (broken trigger)
```sql
SELECT u.id, u.email
FROM auth.users u
LEFT JOIN subscriptions s ON s.user_id = u.id
WHERE s.id IS NULL;
```

### Fix missing subscriptions
```sql
INSERT INTO subscriptions (user_id, plan_id, status)
SELECT id, 'free', 'active' FROM auth.users
WHERE id NOT IN (SELECT user_id FROM subscriptions)
ON CONFLICT (user_id) DO NOTHING;
```

## 3. Payment Debugging

### Find payment by user
```sql
SELECT * FROM crypto_payments
WHERE user_id = '<user_id>'
ORDER BY created_at DESC;
```

### Find unfinished payments
```sql
SELECT * FROM crypto_payments
WHERE payment_status NOT IN ('finished', 'expired', 'failed')
ORDER BY created_at DESC
LIMIT 20;
```

### Manually upgrade subscription
```sql
UPDATE subscriptions
SET plan_id = '6_month',
    status = 'active',
    current_period_end = now() + interval '180 days',
    updated_at = now()
WHERE user_id = '<user_id>';
```

## 4. Affiliate Queries

### List all active affiliates
```sql
SELECT id, name, email, coupon_code, commission_rate, total_referrals
FROM affiliates WHERE status = 'active';
```

### Affiliate performance
```sql
SELECT a.name, a.coupon_code,
  COUNT(DISTINCT ac.id) as clicks,
  COUNT(DISTINCT ar.id) as referrals,
  SUM(ar.commission_earned) as total_commission
FROM affiliates a
LEFT JOIN affiliate_clicks ac ON ac.affiliate_id = a.id
LEFT JOIN affiliate_referrals ar ON ar.affiliate_id = a.id
WHERE a.status = 'active'
GROUP BY a.id;
```

## 5. Analytics Queries

### Trade count by user
```sql
SELECT user_id, COUNT(*) as trade_count
FROM trades GROUP BY user_id ORDER BY trade_count DESC;
```

### Win rate by strategy
```sql
SELECT strategy,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE result = 'Win') as wins,
  ROUND(COUNT(*) FILTER (WHERE result = 'Win')::numeric / COUNT(*)::numeric * 100, 1) as win_rate
FROM trades
WHERE user_id = '<user_id>' AND strategy IS NOT NULL
GROUP BY strategy ORDER BY total DESC;
```

## 6. Version
Last Updated: 2026-03-26
