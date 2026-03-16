---
paths:
  - "supabase/migrations/*.sql"
  - "supabase/schema.sql"
---

# SMC Journal — Database Rules

## Migrations
- ALWAYS use `IF NOT EXISTS` / `IF EXISTS` guards — migrations must be re-runnable
- NEVER add `NOT NULL` column to existing table without a `DEFAULT` value
- ALWAYS index foreign keys and frequently-queried columns
- ALWAYS update `supabase/schema.sql` after every migration
- ALWAYS add the SQL to `SUPABASE_MANUAL_STEPS.md`

## RLS
- EVERY new table: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` immediately
- EVERY policy: `auth.uid() = user_id` pattern
- NEVER `GRANT ALL` to anon role
- NEVER disable RLS on user data tables

## Naming
- Tables: `lowercase_snake_case` (plural where natural)
- Columns: `lowercase_snake_case`
- Indexes: `idx_{table}_{column}`
- Policies: English description in quotes

## Safety
- NEVER string-concatenate user input into SQL
- ALWAYS use Supabase's `.eq()`, `.filter()` parameterised methods
- ALWAYS add `.limit()` to queries that could return unbounded rows
