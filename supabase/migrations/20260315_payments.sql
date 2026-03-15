-- NOWPayments Integration Migration
-- Add this in your Supabase SQL Editor

-- 5. Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
    plan_id TEXT NOT NULL DEFAULT 'free', -- 'free', 'pro_monthly', 'lifetime'
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'expired', 'past_due'
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Crypto Payments Table
CREATE TABLE IF NOT EXISTS public.crypto_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    payment_id TEXT UNIQUE NOT NULL, -- NOWPayments payment_id
    order_id TEXT,
    price_amount NUMERIC NOT NULL,
    price_currency TEXT NOT NULL,
    pay_amount NUMERIC,
    pay_currency TEXT,
    payment_status TEXT NOT NULL,
    pay_address TEXT,
    plan_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for new tables
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscriptions;
CREATE POLICY "Users can view their own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE public.crypto_payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own payments" ON public.crypto_payments;
CREATE POLICY "Users can view their own payments" ON public.crypto_payments FOR SELECT USING (auth.uid() = user_id);

-- Update handle_new_user to include subscription creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
    
    -- Initialize Free subscription
    INSERT INTO public.subscriptions (user_id, plan_id)
    VALUES (new.id, 'free');
    
    -- Seed default strategies
    INSERT INTO public.strategies (user_id, name)
    VALUES 
        (new.id, 'FVG Continuation'),
        (new.id, 'Liquidity Sweep Reversal'),
        (new.id, 'Breaker Block'),
        (new.id, 'Order Block Bounce');
        
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Initialize free subscription for existing users
INSERT INTO public.subscriptions (user_id) 
SELECT id FROM auth.users 
ON CONFLICT (user_id) DO NOTHING;
