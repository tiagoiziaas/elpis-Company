-- Elpis Database Schema for Supabase PostgreSQL
-- Copy and paste this ENTIRE script into Supabase SQL Editor
-- Go to: https://gjurkteiuwbdswumuloh.supabase.co -> SQL Editor -> New Query

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (in wrong schema)
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS availability_rules CASCADE;
DROP TABLE IF EXISTS content_posts CASCADE;
DROP TABLE IF EXISTS professional_services CASCADE;
DROP TABLE IF EXISTS professional_profiles CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'PATIENT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create professional_profiles table
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

-- Create professional_services table
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

-- Create content_posts table
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

-- Create availability_rules table
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

-- Create appointments table
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

-- Create indexes
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

-- Insert categories
INSERT INTO categories (name, slug, description, icon) VALUES
    ('Nutrição', 'nutricao', 'Nutricionistas especializados em saúde e bem-estar', 'apple'),
    ('Psicologia', 'psicologia', 'Psicólogos e terapeutas para saúde mental', 'brain'),
    ('Educação Física', 'educacao-fisica', 'Personal trainers e profissionais de atividade física', 'dumbbell'),
    ('Fisioterapia', 'fisioterapia', 'Fisioterapeutas para reabilitação e movimento', 'activity'),
    ('Medicina', 'medicina', 'Médicos de diversas especialidades', 'stethoscope'),
    ('Enfermagem', 'enfermagem', 'Enfermeiros e cuidados de saúde', 'heart')
ON CONFLICT (slug) DO NOTHING;
