-- ============================================================
-- Migration 001: Initial Schema
-- ShopiReply AI - Supabase PostgreSQL Migration
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- Automatically created on user signup via trigger
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

-- ============================================================
-- GENERATIONS TABLE
-- Stores all AI-generated outputs
-- ============================================================
CREATE TABLE IF NOT EXISTS public.generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN (
    'customer_reply',
    'product_description',
    'seo_title',
    'review_response',
    'refund_response',
    'late_shipping',
    'faq_answer'
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

-- ============================================================
-- USAGE EVENTS TABLE
-- Simple event tracking for analytics
-- ============================================================
CREATE TABLE IF NOT EXISTS public.usage_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'signup',
    'generation_created',
    'checkout_started',
    'subscription_updated',
    'copy_clicked',
    'login',
    'plan_changed'
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
-- UPDATED_AT TRIGGER
-- Automatically update updated_at on profiles
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP TRIGGER
-- ============================================================
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
  
  -- Track signup event
  INSERT INTO public.usage_events (user_id, event_type, metadata)
  VALUES (NEW.id, 'signup', jsonb_build_object('email', NEW.email));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- MONTHLY RESET FUNCTION
-- Run this monthly via Supabase cron or pg_cron
-- ============================================================
CREATE OR REPLACE FUNCTION public.reset_monthly_generation_counts()
RETURNS void AS $$
BEGIN
  UPDATE public.profiles SET monthly_generation_count = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
