# SOP: Database Migrations

## 1. Purpose
Documents all database migrations applied to the SMC Journal Supabase project, in chronological order.

## 2. Migration History

| # | File | Date | Purpose |
|---|---|---|---|
| 1 | `20260314000000_initial_schema.sql` | 2026-03-14 | Core tables: profiles, strategies, trades. RLS policies, triggers, storage bucket. |
| 2 | `20260315110824_add_rls_insert_policies.sql` | 2026-03-15 | Added INSERT RLS policies for profiles. |
| 3 | `20260315_payments.sql` | 2026-03-15 | Created subscriptions + crypto_payments tables. Updated handle_new_user trigger. |
| 4 | `20260316000000_normalize_plans.sql` | 2026-03-16 | Normalized plan_id values across existing records. |
| 5 | `20260316_add_trade_date.sql` | 2026-03-16 | Added `trade_date` column to trades. |
| 6 | `2026031703_add_liquidity_sweep_array.sql` | 2026-03-17 | Added `liquidity_zones` TEXT[] column to trades. |
| 7 | `2026031704_add_billing_columns.sql` | 2026-03-17 | Added billing_details and coupon_code to crypto_payments. |
| 8 | `2026031705_fix_rls_insert_policies.sql` | 2026-03-17 | Fixed RLS INSERT policies for all tables. |
| 9 | `20260317_add_delete_user_rpc.sql` | 2026-03-17 | Added RPC for user account deletion. |
| 10 | `20260317_add_psychology_columns.sql` | 2026-03-17 | Added emotional_state, discipline_score, rule_adherence to trades. |
| 11 | `20260317_add_setup_zone_column.sql` | 2026-03-17 | Added setup_zone_type to trades. |
| 12 | `20260317_database_security_patch.sql` | 2026-03-17 | Security hardening for RLS and storage policies. |
| 13 | `20260319_affiliate_system.sql` | 2026-03-19 | Initial affiliate tables: affiliates, affiliate_clicks, affiliate_referrals, affiliate_applications. |
| 14 | `20260319_affiliate_system_v2.sql` | 2026-03-19 | Affiliate schema refinements. |
| 15 | `20260322_add_bias_tracking.sql` | 2026-03-22 | Added bias_type, bias_timeframe to trades. |
| 16 | `20260322_monetization_and_poi.sql` | 2026-03-22 | Added poi_type column. Monetization schema updates. |
| 17 | `20260324100000_deep_logic_audit.sql` | 2026-03-24 | Comprehensive data integrity fixes. |
| 18 | `20260326_6month_plan.sql` | 2026-03-26 | Migrated lifetime→lifetime_legacy. Added billing_details/coupon_code columns. |

## 3. How to Apply
1. Open **Supabase Dashboard → SQL Editor**
2. Paste migration SQL content
3. Click **Run**
4. Verify success in output panel

## 4. Rollback Strategy
- Migrations are NOT reversible via automated tooling
- **Manual rollback:** Write inverse SQL (DROP COLUMN, revert UPDATE, etc.)
- **Always backup** before applying new migrations in production

## 5. Version
Last Updated: 2026-03-26
