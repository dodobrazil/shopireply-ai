-- ============================================================
-- ShopiReply AI — Full Database Setup (Run Once)
-- Paste this entire file into Supabase Dashboard → SQL Editor → Run
-- Project: jnqyniqltjzjlhhgweqi
-- ============================================================

-- UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro')),
  monthly_generation_limit INTEGER NOT NULL DEFAULT 10,
  monthly_generation_count INTEGER NOT NULL DEFAULT 0,
  billing_customer_id TEXT,
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'past_due', 'canceled', 'trialing')),
  subscription_period_end TIMESTAMPTZ,
  brand_voice TEXT,
  default_language TEXT NOT NULL DEFAULT 'en' CHECK (default_language IN ('en', 'tr', 'bilingual')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN (
    'customer_reply', 'product_description', 'seo_title',
    'review_response', 'refund_response', 'late_shipping', 'faq_answer'
  )),
  platform TEXT NOT NULL DEFAULT 'other' CHECK (platform IN (
    'etsy', 'shopify', 'trendyol', 'amazon', 'instagram', 'woocommerce', 'other'
  )),
  input_text TEXT NOT NULL,
  tone TEXT NOT NULL DEFAULT 'professional' CHECK (tone IN (
    'friendly', 'professional', 'apologetic', 'persuasive', 'concise'
  )),
  output_language TEXT NOT NULL DEFAULT 'en' CHECK (output_language IN ('en', 'tr', 'bilingual')),
  brand_voice TEXT,
  outputs JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_saved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.usage_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'signup', 'generation_created', 'checkout_started',
    'subscription_updated', 'copy_clicked', 'login', 'plan_changed'
  )),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_generations_user_id ON public.generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_mode ON public.generations(mode);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON public.generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_events_user_id ON public.usage_events(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_events_event_type ON public.usage_events(event_type);
CREATE INDEX IF NOT EXISTS idx_usage_events_created_at ON public.usage_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON public.profiles(plan);
CREATE INDEX IF NOT EXISTS idx_profiles_billing_customer_id ON public.profiles(billing_customer_id);

-- ============================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.usage_events (user_id, event_type, metadata)
  VALUES (NEW.id, 'signup', jsonb_build_object('email', NEW.email));

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.reset_monthly_generation_counts()
RETURNS void AS $$
BEGIN
  UPDATE public.profiles SET monthly_generation_count = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;

-- Profiles
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_service_role_all" ON public.profiles;
CREATE POLICY "profiles_service_role_all" ON public.profiles FOR ALL USING (auth.role() = 'service_role');

-- Generations
DROP POLICY IF EXISTS "generations_select_own" ON public.generations;
CREATE POLICY "generations_select_own" ON public.generations FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "generations_insert_own" ON public.generations;
CREATE POLICY "generations_insert_own" ON public.generations FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "generations_update_own" ON public.generations;
CREATE POLICY "generations_update_own" ON public.generations FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "generations_delete_own" ON public.generations;
CREATE POLICY "generations_delete_own" ON public.generations FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "generations_service_role_all" ON public.generations;
CREATE POLICY "generations_service_role_all" ON public.generations FOR ALL USING (auth.role() = 'service_role');

-- Usage Events
DROP POLICY IF EXISTS "usage_events_select_own" ON public.usage_events;
CREATE POLICY "usage_events_select_own" ON public.usage_events FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "usage_events_insert_own" ON public.usage_events;
CREATE POLICY "usage_events_insert_own" ON public.usage_events FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "usage_events_service_role_all" ON public.usage_events;
CREATE POLICY "usage_events_service_role_all" ON public.usage_events FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- PERMISSIONS
-- ============================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.generations TO authenticated;
GRANT ALL ON public.usage_events TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- ============================================================
-- ADMIN UTILITY FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION public.admin_set_user_plan(
  target_email TEXT,
  new_plan TEXT,
  new_limit INTEGER DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  gen_limit INTEGER;
BEGIN
  IF new_limit IS NOT NULL THEN
    gen_limit := new_limit;
  ELSIF new_plan = 'free' THEN gen_limit := 10;
  ELSIF new_plan = 'starter' THEN gen_limit := 500;
  ELSIF new_plan = 'pro' THEN gen_limit := 2000;
  ELSE gen_limit := 10;
  END IF;

  UPDATE public.profiles
  SET plan = new_plan, monthly_generation_limit = gen_limit, updated_at = NOW()
  WHERE email = target_email;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', target_email;
  END IF;

  INSERT INTO public.usage_events (user_id, event_type, metadata)
  SELECT id, 'plan_changed', jsonb_build_object('new_plan', new_plan, 'changed_by', 'admin')
  FROM public.profiles WHERE email = target_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
