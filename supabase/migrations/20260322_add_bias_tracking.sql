-- Migration: Add bias tracking to trades
ALTER TABLE public.trades 
ADD COLUMN IF NOT EXISTS timeframe_bias TEXT,
ADD COLUMN IF NOT EXISTS bias_type TEXT CHECK (bias_type IN ('Continuation', 'Reversal'));

COMMENT ON COLUMN public.trades.timeframe_bias IS 'The timeframe context for the trade bias (e.g. 15M, 1H, 4H)';
COMMENT ON COLUMN public.trades.bias_type IS 'The type of bias follow (Continuation vs Reversal)';
