-- Elpis Database Schema for Supabase PostgreSQL
-- Execute this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'PATIENT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create professional_profiles table
CREATE TABLE IF NOT EXISTS professional_profiles (
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

-- Create professional_services table
CREATE TABLE IF NOT EXISTS professional_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professional_profile_id UUID NOT NULL REFERENCES professional_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content_posts table
CREATE TABLE IF NOT EXISTS content_posts (
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

-- Create availability_rules table
CREATE TABLE IF NOT EXISTS availability_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professional_profile_id UUID NOT NULL REFERENCES professional_profiles(id) ON DELETE CASCADE,
    week_day INTEGER NOT NULL,
    start_time VARCHAR(10) NOT NULL,
    end_time VARCHAR(10) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_professional_profiles_slug ON professional_profiles(slug);
CREATE INDEX IF NOT EXISTS idx_professional_profiles_specialty ON professional_profiles(specialty);
CREATE INDEX IF NOT EXISTS idx_professional_profiles_location ON professional_profiles(city, state);
CREATE INDEX IF NOT EXISTS idx_professional_profiles_is_public ON professional_profiles(is_public);
CREATE INDEX IF NOT EXISTS idx_content_posts_slug ON content_posts(slug);
CREATE INDEX IF NOT EXISTS idx_content_posts_professional ON content_posts(professional_profile_id);
CREATE INDEX IF NOT EXISTS idx_content_posts_status ON content_posts(status);
CREATE INDEX IF NOT EXISTS idx_appointments_professional ON appointments(professional_profile_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_services_professional ON professional_services(professional_profile_id);
CREATE INDEX IF NOT EXISTS idx_availability_professional ON availability_rules(professional_profile_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own data" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- RLS Policies for professional_profiles
CREATE POLICY "Public profiles are viewable by everyone" ON professional_profiles
    FOR SELECT USING (is_public = true);

CREATE POLICY "Professionals can view own profile" ON professional_profiles
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Professionals can insert own profile" ON professional_profiles
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Professionals can update own profile" ON professional_profiles
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- RLS Policies for categories
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

-- RLS Policies for content_posts
CREATE POLICY "Published posts are viewable by everyone" ON content_posts
    FOR SELECT USING (status = 'PUBLISHED');

CREATE POLICY "Professionals can view own posts" ON content_posts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM professional_profiles 
            WHERE professional_profiles.id = content_posts.professional_profile_id 
            AND professional_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Professionals can insert own posts" ON content_posts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM professional_profiles 
            WHERE professional_profiles.id = content_posts.professional_profile_id 
            AND professional_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Professionals can update own posts" ON content_posts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM professional_profiles 
            WHERE professional_profiles.id = content_posts.professional_profile_id 
            AND professional_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Professionals can delete own posts" ON content_posts
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM professional_profiles 
            WHERE professional_profiles.id = content_posts.professional_profile_id 
            AND professional_profiles.user_id = auth.uid()
        )
    );

-- RLS Policies for appointments
CREATE POLICY "Professionals can view appointments for their profile" ON appointments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM professional_profiles 
            WHERE professional_profiles.id = appointments.professional_profile_id 
            AND professional_profiles.user_id = auth.uid()
        )
        OR auth.uid()::text = patient_id::text
    );

CREATE POLICY "Patients can insert own appointments" ON appointments
    FOR INSERT WITH CHECK (auth.uid()::text = patient_id::text);

CREATE POLICY "Professionals can update appointments" ON appointments
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM professional_profiles 
            WHERE professional_profiles.id = appointments.professional_profile_id 
            AND professional_profiles.user_id = auth.uid()
        )
    );

-- Insert initial categories
INSERT INTO categories (name, slug, description, icon) VALUES
    ('Nutrição', 'nutricao', 'Nutricionistas especializados em saúde e bem-estar', 'apple'),
    ('Psicologia', 'psicologia', 'Psicólogos e terapeutas para saúde mental', 'brain'),
    ('Educação Física', 'educacao-fisica', 'Personal trainers e profissionais de atividade física', 'dumbbell'),
    ('Fisioterapia', 'fisioterapia', 'Fisioterapeutas para reabilitação e movimento', 'activity'),
    ('Medicina', 'medicina', 'Médicos de diversas especialidades', 'stethoscope'),
    ('Enfermagem', 'enfermagem', 'Enfermeiros e cuidados de saúde', 'heart')
ON CONFLICT (slug) DO NOTHING;
