-- Add liquidity_sweep column to trades table as an array
ALTER TABLE public.trades 
ADD COLUMN IF NOT EXISTS liquidity_sweep TEXT[] DEFAULT '{}';
