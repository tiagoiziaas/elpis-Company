-- Fix RLS policies for public registration
-- Execute este script no SQL Editor do Supabase

-- ============================================
-- 1. Disable RLS temporarily for registration
-- ============================================

-- Allow public to view categories (already done)
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. Add policy to allow user registration
-- ============================================

-- Drop existing policies for users
DROP POLICY IF EXISTS "Public view own user" ON users;
DROP POLICY IF EXISTS "Users can insert own user" ON users;
DROP POLICY IF EXISTS "Users can update own user" ON users;

-- Create new policies that allow public registration
CREATE POLICY "Enable read access for all users" ON users
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authentication" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for users based on id" ON users
    FOR UPDATE USING (true);

-- ============================================
-- 3. Fix professional_profiles policies
-- ============================================

DROP POLICY IF EXISTS "Public view public profiles" ON professional_profiles;
DROP POLICY IF EXISTS "Users view own profile" ON professional_profiles;
DROP POLICY IF EXISTS "Users insert own profile" ON professional_profiles;
DROP POLICY IF EXISTS "Users update own profile" ON professional_profiles;
DROP POLICY IF EXISTS "Users delete own profile" ON professional_profiles;

CREATE POLICY "Enable read access for all users" ON professional_profiles
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON professional_profiles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for users based on user_id" ON professional_profiles
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for users based on user_id" ON professional_profiles
    FOR DELETE USING (true);

-- ============================================
-- 4. Fix other tables policies
-- ============================================

-- professional_services
DROP POLICY IF EXISTS "Public view services" ON professional_services;
DROP POLICY IF EXISTS "Professionals manage own services" ON professional_services;

CREATE POLICY "Enable read access for all users" ON professional_services
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for users" ON professional_services
    FOR ALL USING (true);

-- content_posts
DROP POLICY IF EXISTS "Public view published posts" ON content_posts;
DROP POLICY IF EXISTS "Professionals manage own posts" ON content_posts;

CREATE POLICY "Enable read access for all users" ON content_posts
    FOR SELECT USING (true);

CREATE POLICY "Enable all access for users" ON content_posts
    FOR ALL USING (true);

-- availability_rules
DROP POLICY IF EXISTS "Public view availability" ON availability_rules;
DROP POLICY IF EXISTS "Professionals manage own availability" ON availability_rules;

CREATE POLICY "Enable read access for all users" ON availability_rules
    FOR SELECT USING (true);

CREATE POLICY "Enable all access for users" ON availability_rules
    FOR ALL USING (true);

-- appointments
DROP POLICY IF EXISTS "Users view own appointments" ON appointments;
DROP POLICY IF EXISTS "Users create appointments" ON appointments;
DROP POLICY IF EXISTS "Professionals update own appointments" ON appointments;

CREATE POLICY "Enable read access for all users" ON appointments
    FOR SELECT USING (true);

CREATE POLICY "Enable all access for users" ON appointments
    FOR ALL USING (true);

-- ============================================
-- 5. Grant permissions on schema
-- ============================================

-- Grant all permissions on public schema to postgres and service_role
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO anon;
GRANT ALL ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO service_role;

-- Grant all permissions on all tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- Grant all permissions on sequences
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
