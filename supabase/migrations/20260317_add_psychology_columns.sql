-- Migration: Add psychology tracking columns to trades table
-- Date: 2026-03-17
-- Purpose: Track trader psychology per trade for pattern analysis.

ALTER TABLE public.trades
ADD COLUMN IF NOT EXISTS emotional_state TEXT 
  CHECK (emotional_state IN ('Focused', 'Fear', 'Greed', 'FOMO', 'Neutral', 'Revenge'));

ALTER TABLE public.trades
ADD COLUMN IF NOT EXISTS discipline_score INTEGER 
  CHECK (discipline_score >= 1 AND discipline_score <= 5);

ALTER TABLE public.trades
ADD COLUMN IF NOT EXISTS rule_adherence BOOLEAN DEFAULT TRUE;

-- Index for psychology analytics queries
CREATE INDEX IF NOT EXISTS idx_trades_emotional_state ON public.trades(emotional_state);
CREATE INDEX IF NOT EXISTS idx_trades_rule_adherence ON public.trades(rule_adherence);
