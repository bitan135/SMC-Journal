-- Migration: Affiliate System
-- Date: 2026-03-19
-- Purpose: Enable user referral and commission tracking.

-- 1. Affiliates table: Stores affiliate profile for users
CREATE TABLE IF NOT EXISTS public.affiliates (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  referral_code TEXT UNIQUE NOT NULL,
  total_referrals INTEGER DEFAULT 0,
  total_earnings_usd DECIMAL(12, 2) DEFAULT 0.00,
  withdrawal_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Referrals table: Tracks individual referrals and their status
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  referred_user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending',
  commission_amount_usd DECIMAL(12, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Profile update: track who referred a user
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.affiliates(id);

-- 4. Enable RLS
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- 5. Policies for Affiliates
CREATE POLICY "Users can view their own affiliate profile"
  ON public.affiliates FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own affiliate profile"
  ON public.affiliates FOR UPDATE
  USING (auth.uid() = id);

-- 6. Policies for Referrals
CREATE POLICY "Affiliates can view their own referrals"
  ON public.referrals FOR SELECT
  USING (auth.uid() = affiliate_id);

-- 7. Grant access to service role for backend logic
GRANT ALL ON public.affiliates TO service_role;
GRANT ALL ON public.referrals TO service_role;

-- index for lookup speed
CREATE INDEX IF NOT EXISTS idx_affiliates_referral_code ON public.affiliates(referral_code);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON public.profiles(referred_by);
