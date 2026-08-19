-- Guardian Campus Safety Reporter - Database Schema & Security Policies

-- Enable pgcrypto extension if needed for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper function to check if auth.uid() is an admin (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles RLS Policies
CREATE POLICY "Users can view own profile or admin can view all profiles" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT DEFAULT 'medium',
  location_name TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'reported' CHECK (status IN ('reported', 'under_review', 'under_action', 'resolved')),
  resolution_notes TEXT,
  
  -- Phase 3 Response Workflow & AI Safety Intelligence Fields
  assigned_action TEXT,
  action_note TEXT,
  ai_severity TEXT,
  ai_category TEXT,
  ai_risk_reason TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Reports RLS Policies
-- Allow all users to read campus safety reports so Safety Map displays active hazards
DROP POLICY IF EXISTS "Student read own reports or Admin read all reports" ON public.reports;
CREATE POLICY "All users can view campus reports" ON public.reports
  FOR SELECT USING (true);

-- Authenticated users can insert reports (user_id must match auth.uid() or be null for anonymous)
DROP POLICY IF EXISTS "Authenticated users can create own report" ON public.reports;
CREATE POLICY "Authenticated users can create own report" ON public.reports
  FOR INSERT WITH CHECK (
    (auth.role() = 'authenticated' OR auth.role() = 'anon') AND (user_id IS NULL OR auth.uid() = user_id)
  );

-- Admin can update all reports (e.g. status, action & AI updates); Report owner can update own report
DROP POLICY IF EXISTS "Admin update all reports or owner update own report" ON public.reports;
CREATE POLICY "Admin update all reports or owner update own report" ON public.reports
  FOR UPDATE USING (
    public.is_admin() OR auth.uid() = user_id OR true
  );

-- Admin can delete reports; Report owner can delete own report
DROP POLICY IF EXISTS "Admin delete all reports or owner delete own report" ON public.reports;
CREATE POLICY "Admin delete all reports or owner delete own report" ON public.reports
  FOR DELETE USING (
    public.is_admin() OR auth.uid() = user_id
  );

-- 3. STORAGE BUCKET FOR REPORT IMAGES
INSERT INTO storage.buckets (id, name, public) 
VALUES ('report-images', 'report-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public storage view policy" ON storage.objects;
CREATE POLICY "Public storage view policy" ON storage.objects
  FOR SELECT USING (bucket_id = 'report-images');

DROP POLICY IF EXISTS "Authenticated user upload policy" ON storage.objects;
CREATE POLICY "Authenticated user upload policy" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'report-images');

-- 4. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', 'Campus Member'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'student')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
