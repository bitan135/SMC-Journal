# SOP: Database Schema

## 1. Purpose
Defines all PostgreSQL tables, relationships, RLS policies, triggers, and storage buckets powering the SMC Journal SaaS. This is the single source of truth for the data layer.

## 2. Owner
`supabase/migrations/` — 19 migration files, applied sequentially.

## 3. Dependencies
- **Supabase Postgres** (hosted)
- **Supabase Auth** (`auth.users` is the identity source)
- **Supabase Storage** (`trade-screenshots` bucket)

## 4. Tables

### `profiles`
| Column | Type | Default | Notes |
|---|---|---|---|
| `id` | UUID (PK) | FK → `auth.users` | Cascade delete |
| `username` | TEXT (UNIQUE) | null | Optional |
| `full_name` | TEXT | null | From OAuth metadata |
| `avatar_url` | TEXT | null | From OAuth metadata |
| `account_balance` | NUMERIC | 10000 | User-configurable |
| `risk_percentage` | NUMERIC | 1 | For risk calculations |
| `currency` | TEXT | 'USD' | Display currency |
| `referred_by` | UUID | null | FK → affiliates.id |
| `has_completed_onboarding` | BOOLEAN | false | Not currently used in UI |
| `plan_type` | TEXT | 'free' | Legacy field (use subscriptions table) |
| `created_at` | TIMESTAMPTZ | now() | Auto |
| `updated_at` | TIMESTAMPTZ | now() | Auto-trigger |

**RLS:** SELECT/UPDATE where `auth.uid() = id`

### `trades`
| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID (PK) | gen_random_uuid() | |
| `user_id` | UUID | FK → auth.users, CASCADE | |
| `instrument` | TEXT | NOT NULL | e.g. EURUSD, XAUUSD |
| `direction` | TEXT | CHECK (Buy/Sell) | |
| `entry_price` | NUMERIC | NOT NULL | |
| `stop_loss` | NUMERIC | | |
| `take_profit` | NUMERIC | | |
| `lot_size` | NUMERIC | | |
| `result` | TEXT | CHECK (Win/Loss/Break Even/Running) | |
| `rr` | NUMERIC | | Calculated client-side |
| `pips` | NUMERIC | | Calculated client-side |
| `session` | TEXT | | London/New York/Asia |
| `strategy` | TEXT | | FK-like to strategies.name |
| `notes` | TEXT | | Free-form journal |
| `screenshot_before` | TEXT | | Supabase Storage URL |
| `screenshot_after` | TEXT | | Supabase Storage URL |
| `smc_tags` | TEXT[] | | Array: BOS, CHoCH, FVG, etc. |
| `trade_date` | TIMESTAMPTZ | | User-specified execution date |
| `emotional_state` | TEXT | | Focused/Fear/Greed/FOMO/etc. |
| `discipline_score` | INT | | 1-5 scale |
| `rule_adherence` | BOOLEAN | | Protocol compliance flag |
| `liquidity_zones` | TEXT[] | | Array of swept zones |
| `bias_type` | TEXT | | Continuation/Reversal |
| `bias_timeframe` | TEXT | | 15M/30M/1H/4H/1D |
| `poi_type` | TEXT | | Continuous/Extreme |
| `setup_zone_type` | TEXT | | Supply/Demand |
| `created_at` | TIMESTAMPTZ | now() | |
| `updated_at` | TIMESTAMPTZ | now() | Auto-trigger |

**RLS:** ALL operations where `auth.uid() = user_id`

### `strategies`
| Column | Type | Constraints |
|---|---|---|
| `id` | UUID (PK) | gen_random_uuid() |
| `user_id` | UUID | FK → auth.users, CASCADE |
| `name` | TEXT | NOT NULL, UNIQUE(user_id, name) |
| `created_at` | TIMESTAMPTZ | now() |

**RLS:** ALL operations where `auth.uid() = user_id`

### `subscriptions`
| Column | Type | Default | Notes |
|---|---|---|---|
| `id` | UUID (PK) | gen_random_uuid() | |
| `user_id` | UUID (UNIQUE) | FK → auth.users, CASCADE | One subscription per user |
| `plan_id` | TEXT | 'free' | Valid: `free`, `pro`, `6_month`, `lifetime_legacy` |
| `status` | TEXT | 'active' | Valid: `active`, `expired`, `past_due` |
| `current_period_end` | TIMESTAMPTZ | null | null = infinite (lifetime_legacy) |
| `created_at` | TIMESTAMPTZ | now() | |
| `updated_at` | TIMESTAMPTZ | now() | |

**RLS:** SELECT where `auth.uid() = user_id`. No INSERT/UPDATE from client — only webhook/admin.

### `crypto_payments`
| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID (PK) | gen_random_uuid() | |
| `user_id` | UUID | FK → auth.users, CASCADE | |
| `payment_id` | TEXT (UNIQUE) | NOT NULL | NOWPayments ID |
| `order_id` | TEXT | | Format: `{userId}_{timestamp}` |
| `price_amount` | NUMERIC | NOT NULL | USD amount |
| `price_currency` | TEXT | NOT NULL | Always 'usd' |
| `pay_amount` | NUMERIC | | Crypto amount |
| `pay_currency` | TEXT | | e.g. 'usdtarb' |
| `payment_status` | TEXT | NOT NULL | waiting/confirming/finished/etc. |
| `pay_address` | TEXT | | Deposit wallet address |
| `plan_id` | TEXT | NOT NULL | pro / 6_month |
| `billing_details` | JSONB | | Name, email, address, city, country |
| `coupon_code` | TEXT | | Applied coupon code |
| `created_at` | TIMESTAMPTZ | now() | |
| `updated_at` | TIMESTAMPTZ | now() | |

**RLS:** SELECT where `auth.uid() = user_id`. INSERT from server-side API only.

## 5. Triggers

### `handle_new_user()`
- **Fires:** `AFTER INSERT ON auth.users`
- **Actions:**
  1. Creates `profiles` row (extracts `full_name`, `avatar_url` from metadata)
  2. Creates `subscriptions` row with `plan_id = 'free'`
  3. Seeds 4 default strategies (FVG Continuation, Liquidity Sweep Reversal, Breaker Block, Order Block Bounce)

### `handle_updated_at()`
- **Fires:** `BEFORE UPDATE` on tables with `updated_at`
- **Action:** Sets `NEW.updated_at = now()`

## 6. Storage

### Bucket: `trade-screenshots`
- **Public:** Yes (public URLs for screenshots)
- **Upload policy:** Authenticated users only, bucket_id = 'trade-screenshots'
- **View policy:** All authenticated users
- **Delete policy:** Only if `auth.uid()` matches the folder name (first path segment)

## 7. Failure Modes
| Failure | Cause | Impact |
|---|---|---|
| Trigger fails on signup | Missing migration or function | User created in auth but no profile/subscription |
| RLS blocks insert | Missing INSERT policy | Silent write failure on client |
| Screenshot URL broken | Storage bucket misconfigured or deleted | Images 404 across app |
| Subscription not found | Trigger didn't fire | User stuck on free plan permanently |

## 8. Debugging Guide
1. **User has no profile:** Check `auth.users` for the user. Run `SELECT * FROM profiles WHERE id = '<user_id>'`. If missing, the trigger failed — manually insert.
2. **User has no subscription:** `SELECT * FROM subscriptions WHERE user_id = '<user_id>'`. If missing, insert with `plan_id = 'free'`.
3. **RLS blocking writes:** Check policies with `SELECT * FROM pg_policies WHERE tablename = '<table>'`.
4. **Storage 404:** Verify bucket exists: Supabase Dashboard → Storage → `trade-screenshots`.

## 9. Logs & Observability
- **Supabase Dashboard → Database → Logs** for query errors
- **Supabase Dashboard → Auth → Users** for signup issues
- **Vercel Logs** for server-side Supabase client errors

## 10. Recovery Procedure
- **Missing profile for existing user:** `INSERT INTO profiles (id) VALUES ('<user_id>');`
- **Missing subscription:** `INSERT INTO subscriptions (user_id, plan_id) VALUES ('<user_id>', 'free');`
- **Bulk fix all users without subscriptions:**
```sql
INSERT INTO subscriptions (user_id)
SELECT id FROM auth.users
WHERE id NOT IN (SELECT user_id FROM subscriptions)
ON CONFLICT (user_id) DO NOTHING;
```

## 11. Edge Cases
- User deletes account → CASCADE deletes profile, trades, strategies, subscriptions
- Concurrent strategy creation with same name → UNIQUE constraint violation
- `trade_date` can be null (legacy trades before the column was added)

## 12. Security Considerations
- Service role key used in API routes bypasses RLS — never expose client-side
- Storage delete policy uses folder name matching — users cannot delete others' screenshots
- `profiles.plan_type` is a legacy field — the canonical plan source is `subscriptions.plan_id`

## 13. Version
Last Updated: 2026-03-26
