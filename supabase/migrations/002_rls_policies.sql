-- ============================================================
-- Migration 002: Row Level Security Policies
-- Run AFTER migration 001
-- ============================================================

-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES POLICIES
-- ============================================================

-- Users can read their own profile
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Service role can do everything (for admin operations)
CREATE POLICY "profiles_service_role_all"
  ON public.profiles
  FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- GENERATIONS POLICIES
-- ============================================================

-- Users can select their own generations
CREATE POLICY "generations_select_own"
  ON public.generations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own generations
CREATE POLICY "generations_insert_own"
  ON public.generations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update (e.g., toggle is_saved) their own generations
CREATE POLICY "generations_update_own"
  ON public.generations
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own generations
CREATE POLICY "generations_delete_own"
  ON public.generations
  FOR DELETE
  USING (auth.uid() = user_id);

-- Service role can do everything
CREATE POLICY "generations_service_role_all"
  ON public.generations
  FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- USAGE EVENTS POLICIES
-- ============================================================

-- Users can read their own events
CREATE POLICY "usage_events_select_own"
  ON public.usage_events
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own events
CREATE POLICY "usage_events_insert_own"
  ON public.usage_events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Service role can do everything (for admin analytics)
CREATE POLICY "usage_events_service_role_all"
  ON public.usage_events
  FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- GRANT PERMISSIONS
-- ============================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.generations TO authenticated;
GRANT ALL ON public.usage_events TO authenticated;
GRANT SELECT ON public.profiles TO anon;
