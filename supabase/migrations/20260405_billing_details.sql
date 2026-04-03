-- Migration: 20260405_billing_details
-- Description: Adds a JSONB column to crypto_payments to store member billing information.

ALTER TABLE public.crypto_payments 
ADD COLUMN IF NOT EXISTS billing_details JSONB DEFAULT '{}'::jsonb;

-- Ensure RLS is still aligned (optional but good practice)
COMMENT ON COLUMN public.crypto_payments.billing_details IS 'Stores member name, email, and region from the founding member checkout form.';
