-- ============================================================
-- Migration 003: Sample / Seed Data for Local Demo
-- Run AFTER migrations 001 and 002
-- NOTE: This seed data is for demo purposes only.
--       DO NOT run in production with real user data.
-- ============================================================

-- Insert a demo user profile (requires a matching auth.users entry)
-- In local dev, create a user first via Supabase Auth, then update their profile:
-- UPDATE public.profiles SET plan = 'pro', monthly_generation_limit = 2000 WHERE email = 'demo@example.com';

-- You can also use this function to manually upgrade any user:
CREATE OR REPLACE FUNCTION public.admin_set_user_plan(
  target_email TEXT,
  new_plan TEXT,
  new_limit INTEGER DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  gen_limit INTEGER;
BEGIN
  -- Determine limit based on plan
  IF new_limit IS NOT NULL THEN
    gen_limit := new_limit;
  ELSIF new_plan = 'free' THEN
    gen_limit := 10;
  ELSIF new_plan = 'starter' THEN
    gen_limit := 500;
  ELSIF new_plan = 'pro' THEN
    gen_limit := 2000;
  ELSE
    gen_limit := 10;
  END IF;
  
  UPDATE public.profiles
  SET 
    plan = new_plan,
    monthly_generation_limit = gen_limit,
    updated_at = NOW()
  WHERE email = target_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', target_email;
  END IF;
  
  -- Log the plan change
  INSERT INTO public.usage_events (user_id, event_type, metadata)
  SELECT id, 'plan_changed', jsonb_build_object('new_plan', new_plan, 'changed_by', 'admin')
  FROM public.profiles WHERE email = target_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Example usage (uncomment and modify):
-- SELECT public.admin_set_user_plan('user@example.com', 'starter');
-- SELECT public.admin_set_user_plan('poweruser@example.com', 'pro');
