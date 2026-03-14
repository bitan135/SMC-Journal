-- EdgeLedger Database Schema
-- Run this in your Supabase SQL Editor

-- 1. Profiles Table (Extends Auth.Users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    account_balance NUMERIC DEFAULT 10000,
    risk_percentage NUMERIC DEFAULT 1,
    currency TEXT DEFAULT 'USD',
    has_completed_onboarding BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Strategies Table
CREATE TABLE public.strategies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, name)
);

-- 3. Trades Table
CREATE TABLE public.trades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    instrument TEXT NOT NULL,
    direction TEXT CHECK (direction IN ('Buy', 'Sell')),
    entry_price NUMERIC NOT NULL,
    stop_loss NUMERIC,
    take_profit NUMERIC,
    lot_size NUMERIC,
    result TEXT CHECK (result IN ('Win', 'Loss', 'Break Even', 'Running')),
    rr NUMERIC,
    pips NUMERIC,
    session TEXT,
    strategy TEXT,
    notes TEXT,
    screenshot_before TEXT,
    screenshot_after TEXT,
    smc_tags TEXT[], -- Array of strings for BOS, CHoCH, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS POLICIES (Security)

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own strategies" ON public.strategies FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own trades" ON public.trades FOR ALL USING (auth.uid() = user_id);

-- TRIGGERS (Automated Actions)

-- Handle new user signup: create profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
    
    -- Seed default strategies for the new user
    INSERT INTO public.strategies (user_id, name)
    VALUES 
        (new.id, 'FVG Continuation'),
        (new.id, 'Liquidity Sweep Reversal'),
        (new.id, 'Breaker Block'),
        (new.id, 'Order Block Bounce');
        
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated At maintenance
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Storage (Buckets)
-- Run this to create the bucket for screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('trade-screenshots', 'trade-screenshots', true) ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Authenticated users can upload screenshots"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'trade-screenshots');

CREATE POLICY "Users can view all screenshots"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'trade-screenshots');

CREATE POLICY "Users can delete their own screenshots"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'trade-screenshots' AND (auth.uid())::text = (storage.foldername(name))[1]);
