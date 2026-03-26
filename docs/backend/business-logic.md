# SOP: Business Logic

## 1. Purpose
Documents the core business rules for trade management, subscription access control, analytics calculations, and data validation.

## 2. Owner
- `src/lib/storage.js` — Trade/strategy CRUD, analytics helpers, calculation functions
- `src/components/PlanGuard.jsx` — Feature access gating
- `src/app/api/webhooks/nowpayments/route.js` — Subscription lifecycle

## 3. Subscription Access Rules

| Plan ID | Access Level | Period | Source |
|---|---|---|---|
| `free` | Basic journaling, trade vault, equity curve | Unlimited | Default |
| `pro` | All free + advanced analytics + insights | 30 days | Monthly payment |
| `6_month` | Same as Pro | 180 days | One-time payment |
| `lifetime_legacy` | Same as Pro | Unlimited | Grandfathered |

### Access Check Locations
1. **PlanGuard.jsx:** Wraps analytics/insights pages — checks `subscription.plan_id`
2. **Insights page.js:** `isPaidUser = plan === 'pro' || '6_month' || 'lifetime_legacy'`
3. **AnalyticsContent.jsx:** `checkIsLocked = sub?.plan_id === 'free'`
4. **Sidebar.jsx:** Displays plan badge based on `plan_id`

### Subscription Extension Logic (6-Month Plan)
When user purchases again before expiry:
- If `current_period_end > now()` → extend: `current_period_end + 180 days`
- If expired or no subscription → `now() + 180 days`

## 4. Trade Calculations (Pure Functions)

### Risk/Reward Ratio (`calculateRR`)
```
RR = |takeProfit - entry| / |entry - stopLoss|
```
Returns 0 if `stopLoss === entry` (division by zero guard).

### Pip Calculation (`calculatePips`)
```
JPY pairs: diff × 100
Gold/Silver: diff × 10
Indices/Crypto: diff (raw)
Standard forex: diff × 10000
```

### Risk Amount
```
riskAmount = (accountBalance × riskPercentage / 100).toFixed(2)
```

## 5. Data Validation Rules
- `instrument` is required (NOT NULL)
- `direction` must be 'Buy' or 'Sell' (CHECK constraint)
- `result` must be 'Win', 'Loss', 'Break Even', or 'Running'
- `entry_price` is required (NOT NULL)
- `smc_tags` stored as TEXT[] array
- `rr`, `pips`, `lot_size` enforced as numeric by `storage.js`

## 6. Analytics Thresholds
- **Insights access:** Requires 30+ trades for basic, 100+ trades + Pro plan for advanced
- **Equity curve:** Available to all plans (free)
- **Drawdown analysis:** Pro only
- **Session/strategy breakdown:** Pro only

## 7. Version
Last Updated: 2026-03-26
