-- Elpis - Setup Completo do Banco de Dados
-- Execute este script em: https://vntukgoskrqmmoatxmbd.supabase.co/project/sql
-- Este script cria tabelas, políticas RLS e funções RPC

-- ============================================
-- 1. ENABLE UUID EXTENSION
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. DROP EXISTING TABLES (CUIDADO: Isso apaga todos os dados!)
-- ============================================
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS availability_rules CASCADE;
DROP TABLE IF EXISTS content_posts CASCADE;
DROP TABLE IF EXISTS professional_services CASCADE;
DROP TABLE IF EXISTS professional_profiles CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP FUNCTION IF EXISTS create_user_with_profile CASCADE;

-- ============================================
-- 3. CREATE TABLES
-- ============================================

-- Categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'PATIENT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Professional Profiles
CREATE TABLE professional_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL DEFAULT 'Especialista',
    specialty VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(50) NOT NULL,
    bio TEXT,
    approach TEXT,
    headline TEXT,
    profile_image_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    whatsapp VARCHAR(50),
    instagram VARCHAR(255),
    website VARCHAR(255),
    is_public BOOLEAN DEFAULT true,
    category_id UUID REFERENCES categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Professional Services
CREATE TABLE professional_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professional_profile_id UUID NOT NULL REFERENCES professional_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Posts
CREATE TABLE content_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professional_profile_id UUID NOT NULL REFERENCES professional_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image_url VARCHAR(500),
    video_url VARCHAR(500),
    type VARCHAR(50) NOT NULL DEFAULT 'ARTICLE',
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Availability Rules
CREATE TABLE availability_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professional_profile_id UUID NOT NULL REFERENCES professional_profiles(id) ON DELETE CASCADE,
    week_day INTEGER NOT NULL,
    start_time VARCHAR(10) NOT NULL,
    end_time VARCHAR(10) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professional_profile_id UUID NOT NULL REFERENCES professional_profiles(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES users(id) ON DELETE SET NULL,
    patient_name VARCHAR(255) NOT NULL,
    patient_email VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(50) NOT NULL,
    service_id UUID REFERENCES professional_services(id) ON DELETE SET NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time VARCHAR(10) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. CREATE INDEXES
-- ============================================
CREATE INDEX idx_professional_profiles_slug ON professional_profiles(slug);
CREATE INDEX idx_professional_profiles_specialty ON professional_profiles(specialty);
CREATE INDEX idx_professional_profiles_location ON professional_profiles(city, state);
CREATE INDEX idx_professional_profiles_is_public ON professional_profiles(is_public);
CREATE INDEX idx_content_posts_slug ON content_posts(slug);
CREATE INDEX idx_content_posts_professional ON content_posts(professional_profile_id);
CREATE INDEX idx_content_posts_status ON content_posts(status);
CREATE INDEX idx_appointments_professional ON appointments(professional_profile_id);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_date ON appointments(scheduled_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_services_professional ON professional_services(professional_profile_id);
CREATE INDEX idx_availability_professional ON availability_rules(professional_profile_id);
CREATE INDEX idx_categories_slug ON categories(slug);

-- ============================================
-- 5. SEED CATEGORIES
-- ============================================
INSERT INTO categories (name, slug, description, icon) VALUES
    ('Nutrição', 'nutricao', 'Nutricionistas especializados em saúde e bem-estar', 'apple'),
    ('Psicologia', 'psicologia', 'Psicólogos e terapeutas para saúde mental', 'brain'),
    ('Educação Física', 'educacao-fisica', 'Personal trainers e profissionais de atividade física', 'dumbbell'),
    ('Fisioterapia', 'fisioterapia', 'Fisioterapeutas para reabilitação e movimento', 'activity'),
    ('Medicina', 'medicina', 'Médicos de diversas especialidades', 'stethoscope'),
    ('Enfermagem', 'enfermagem', 'Enfermeiros e cuidados de saúde', 'heart')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 6. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7. CREATE RLS POLICIES
-- ============================================

-- Users policies
CREATE POLICY "Public view own user" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own user" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own user" ON users FOR UPDATE USING (auth.uid() = id);

-- Professional profiles policies
CREATE POLICY "Public view public profiles" ON professional_profiles FOR SELECT USING (is_public = true);
CREATE POLICY "Users view own profile" ON professional_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON professional_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON professional_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own profile" ON professional_profiles FOR DELETE USING (auth.uid() = user_id);

-- Professional services policies
CREATE POLICY "Public view services" ON professional_services FOR SELECT USING (true);
CREATE POLICY "Professionals manage own services" ON professional_services FOR ALL USING (
    professional_profile_id IN (SELECT id FROM professional_profiles WHERE user_id = auth.uid())
);

-- Content posts policies
CREATE POLICY "Public view published posts" ON content_posts FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Professionals manage own posts" ON content_posts FOR ALL USING (
    professional_profile_id IN (SELECT id FROM professional_profiles WHERE user_id = auth.uid())
);

-- Availability rules policies
CREATE POLICY "Public view availability" ON availability_rules FOR SELECT USING (true);
CREATE POLICY "Professionals manage own availability" ON availability_rules FOR ALL USING (
    professional_profile_id IN (SELECT id FROM professional_profiles WHERE user_id = auth.uid())
);

-- Appointments policies
CREATE POLICY "Users view own appointments" ON appointments FOR SELECT USING (
    patient_id = auth.uid() OR professional_profile_id IN (SELECT id FROM professional_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users create appointments" ON appointments FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Professionals update own appointments" ON appointments FOR UPDATE USING (
    professional_profile_id IN (SELECT id FROM professional_profiles WHERE user_id = auth.uid())
);

-- Categories policies
CREATE POLICY "Public view categories" ON categories FOR SELECT USING (true);

-- ============================================
-- 8. CREATE RPC FUNCTION: create_user_with_profile
-- ============================================
CREATE OR REPLACE FUNCTION create_user_with_profile(
    p_name VARCHAR(255),
    p_email VARCHAR(255),
    p_password_hash VARCHAR(255),
    p_slug VARCHAR(255),
    p_full_name VARCHAR(255),
    p_title VARCHAR(255),
    p_specialty VARCHAR(255),
    p_city VARCHAR(255),
    p_state VARCHAR(50)
) RETURNS JSON AS $$
DECLARE
    v_user_id UUID;
    v_result JSON;
BEGIN
    -- Insert user
    INSERT INTO users (name, email, password_hash, role)
    VALUES (p_name, p_email, p_password_hash, 'PROFESSIONAL')
    RETURNING id INTO v_user_id;
    
    -- Insert professional profile
    INSERT INTO professional_profiles (
        user_id, slug, full_name, title, specialty, city, state, is_public
    ) VALUES (
        v_user_id, p_slug, p_full_name, p_title, p_specialty, p_city, p_state, true
    );
    
    -- Return user data
    SELECT json_build_object(
        'id', id,
        'name', name,
        'email', email
    ) INTO v_result
    FROM users
    WHERE id = v_user_id;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 9. GRANT PERMISSIONS FOR RPC FUNCTION
-- ============================================
GRANT EXECUTE ON FUNCTION create_user_with_profile TO anon;
GRANT EXECUTE ON FUNCTION create_user_with_profile TO authenticated;

-- ============================================
-- 10. ALLOW RLS BYPASS FOR SERVICE ROLE (important for backend)
-- ============================================
-- This allows the Supabase service role key to bypass RLS policies
-- No additional setup needed - service role has full access by default
