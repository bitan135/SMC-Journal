---
description: Add a new field to the trades table in SMC Journal — handles migration, schema, TradeForm, modal display, and optional analytics.
---

# /smc-add-field

Add a new field to the trades table end-to-end across all 7 places it needs to appear.

## What Gets Created/Updated

1. `supabase/migrations/YYYYMMDD_add_{field}.sql` — the migration
2. `supabase/schema.sql` — updated to reflect new column
3. `SUPABASE_MANUAL_STEPS.md` — updated with SQL for Bitan to run
4. `src/components/TradeForm.jsx` — initial state + submission payload
5. `src/app/add-trade/page.js` — submission payload updated
6. `src/app/trades/page.js` — update payload + detail modal display
7. Optional: `src/lib/storage.js` — analytics function if metric is useful

## Usage

```
/smc-add-field "market_bias: Bullish | Bearish | Neutral — TEXT enum"
/smc-add-field "trade_duration_minutes — INTEGER, how long trade was open"
/smc-add-field "news_event: boolean — was there a news event during this trade"
```

## Agents: `supabase-specialist` → `smc-journal-planner` → `smc-journal-reviewer`
