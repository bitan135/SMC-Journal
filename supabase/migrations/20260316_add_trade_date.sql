-- Migration: Add trade_date column to trades table
-- Date: 2026-03-16
-- Purpose: Supports backdating trades with specific execution timestamps instead of relying on created_at.

-- 1. Add the column with a default value of the current timestamp
ALTER TABLE trades 
ADD COLUMN IF NOT EXISTS trade_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

-- 2. Backfill existing records (if any) with their created_at value
UPDATE trades 
SET trade_date = created_at 
WHERE trade_date IS NULL;

-- 3. Add an index for performance on date-based queries
CREATE INDEX IF NOT EXISTS idx_trades_trade_date ON trades(trade_date DESC);
