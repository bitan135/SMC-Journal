-- 6-Month Pro Plan Migration
-- Replaces the Lifetime plan with a 6-Month Pro subscription ($50, 180-day access)

-- Step 1: Migrate existing lifetime users to lifetime_legacy (preserves perpetual access)
UPDATE public.subscriptions
SET plan_id = 'lifetime_legacy',
    updated_at = timezone('utc'::text, now())
WHERE plan_id = 'lifetime';

-- Step 2: Update any crypto_payments records that reference 'lifetime' for audit trail
-- (We do NOT change historical payment records — just add a comment for clarity)
COMMENT ON TABLE public.subscriptions IS 'Valid plan_id values: free, pro, 6_month, lifetime_legacy';

-- Step 3: Add billing_details column to crypto_payments if not present
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'crypto_payments'
        AND column_name = 'billing_details'
    ) THEN
        ALTER TABLE public.crypto_payments ADD COLUMN billing_details JSONB;
    END IF;
END $$;

-- Step 4: Add coupon_code column to crypto_payments if not present
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'crypto_payments'
        AND column_name = 'coupon_code'
    ) THEN
        ALTER TABLE public.crypto_payments ADD COLUMN coupon_code TEXT;
    END IF;
END $$;
