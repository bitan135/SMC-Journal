-- Add billing and coupon columns to crypto_payments
ALTER TABLE public.crypto_payments 
ADD COLUMN IF NOT EXISTS billing_details JSONB,
ADD COLUMN IF NOT EXISTS coupon_code TEXT;
