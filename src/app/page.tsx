'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Search, ArrowRight, CheckCircle2, Calendar, User, Video, Shield,
  Star, Heart, Activity, Brain, Apple, MapPin, Clock, TrendingUp,
  Award, Zap, Users, Stethoscope, ChevronRight, Play, Sparkles
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// ─── Data ────────────────────────────────────────────────────────────────────

const categories = [
  { name: 'Nutrição',       slug: 'nutricao',        icon: Apple,       color: 'from-emerald-500 to-green-600',  bg: 'bg-emerald-50' },
  { name: 'Psicologia',     slug: 'psicologia',      icon: Brain,       color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50' },
  { name: 'Educação Física',slug: 'educacao-fisica', icon: Activity,    color: 'from-sky-500 to-blue-600',      bg: 'bg-sky-50' },
  { name: 'Fisioterapia',   slug: 'fisioterapia',    icon: Heart,       color: 'from-rose-500 to-red-600',      bg: 'bg-rose-50' },
  { name: 'Medicina',       slug: 'medicina',        icon: Stethoscope, color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50' },
  { name: 'Enfermagem',     slug: 'enfermagem',      icon: Shield,      color: 'from-pink-500 to-pink-600',     bg: 'bg-pink-50' },
]

// No static professionals - only show from database
const professionals: any[] = []

const stats = [
  { label: 'Profissionais', value: '500+', icon: Users,         gradient: 'from-blue-500 to-blue-600' },
  { label: 'Consultas Realizadas', value: '10k+', icon: CheckCircle2, gradient: 'from-emerald-500 to-green-600' },
  { label: 'Satisfação', value: '98%', icon: Star,          gradient: 'from-elpis-orange to-elpis-orange-dark' },
]

const howItWorks = [
  { step: '01', icon: User,       title: 'Crie sua Conta',        desc: 'Cadastro gratuito em menos de 2 minutos para pacientes e profissionais.' },
  { step: '02', icon: Search,     title: 'Busque Profissionais',  desc: 'Filtre por especialidade, cidade e disponibilidade de horários.' },
  { step: '03', icon: Calendar,   title: 'Agende a Consulta',     desc: 'Escolha o horário ideal e confirme o agendamento instantaneamente.' },
  { step: '04', icon: Heart,      title: 'Cuide da sua Saúde',    desc: 'Atendimento presencial ou online com suporte completo na plataforma.' },
]

const benefits = [
  { icon: Calendar,      title: 'Agendamento em Minutos',   description: 'Sem filas, sem espera. Agende consultas de forma rápida e prática.' },
  { icon: Shield,        title: 'Profissionais Verificados', description: 'Todos os profissionais passam por rigoroso processo de verificação.' },
  { icon: Video,         title: 'Atendimento Online',       description: 'Consultas por videochamada para seu conforto e segurança.' },
  { icon: Star,          title: 'Avaliações Reais',         description: 'Feedback autêntico de pacientes para você escolher com confiança.' },
]

const marqueeItems = [
  '✦ Nutrição', '✦ Psicologia', '✦ Fisioterapia', '✦ Medicina', '✦ Personal Trainer',
  '✦ Educação Física', '✦ Enfermagem', '✦ Dermatologia', '✦ Cardiologia', '✦ Ortopedia',
]

// ─── Component ────────────────────────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] } },
})

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [featuredProfessionals, setFeaturedProfessionals] = useState<typeof professionals>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('/api/professionals?limit=4')
        const data = await response.json()
        // Transform database data to match frontend format
        const transformed = (data.professionals || []).map((p: any) => ({
          ...p,
          name: p.full_name || p.name,
          title: p.title || p.full_name?.split(' ')[0],
          image: p.profile_image_url || p.image,
          rating: p.rating || 4.9,
          reviews: p.reviews || 0,
        }))
        setFeaturedProfessionals(transformed)
      } catch (error) {
        console.error('Failed to fetch professionals:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  // Only show professionals from database (no fallback to static data)
  const displayProfessionals = featuredProfessionals

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">

        {/* ══════════════════════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════════════════════ */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=1920&h=1080&fit=crop&q=85"
              alt="Nutricionista em atendimento"
              className="w-full h-full object-cover"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/85 to-elpis-black/80" />
            {/* Subtle orange tint at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-elpis-orange/10 to-transparent" />
          </div>

          {/* Animated grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />

          {/* Animated orbs */}
          <div className="absolute top-1/4 left-1/6 w-80 h-80 bg-elpis-orange/15 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

          <div className="container mx-auto px-4 md:px-6 py-32 relative z-10">
            <div className="max-w-5xl mx-auto text-center">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-elpis-orange/40 bg-elpis-orange/10 text-elpis-orange text-sm font-medium backdrop-blur-sm">
                  <Sparkles className="h-4 w-4" />
                  Plataforma Premium de Saúde
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-bold text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[1.08] tracking-tight"
              >
                Cuide da sua
                <br />
                <span className="text-gradient">saúde</span> com quem
                <br />
                entende de você
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-white/75 mb-10 max-w-2xl mx-auto leading-relaxed"
              >
                Conectamos você aos melhores profissionais de saúde do Brasil.
                Agende consultas online em minutos, sem filas e sem burocracia.
              </motion.p>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="max-w-3xl mx-auto mb-8"
              >
                <div className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-2xl shadow-black/30">
                  <Search className="absolute left-5 h-5 w-5 text-white/50" />
                  <Input
                    type="text"
                    placeholder="Busque por especialidade, profissional ou cidade..."
                    className="pl-12 pr-4 h-12 text-base border-0 bg-transparent text-white placeholder:text-white/45 focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Link href={`/buscar${searchTerm ? `?q=${searchTerm}` : ''}`} className="ml-2 flex-shrink-0">
                    <Button size="lg" className="rounded-xl bg-elpis-orange hover:bg-elpis-orange-dark text-white px-6 shadow-lg shadow-elpis-orange/40 animate-glow-pulse">
                      Buscar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
              >
                <Link href="/buscar">
                  <Button size="lg" className="w-full sm:w-auto rounded-xl bg-elpis-orange hover:bg-elpis-orange-dark text-white shadow-xl shadow-elpis-orange/30 h-13 px-8">
                    Encontrar Profissional
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/cadastro/profissional">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm h-13 px-8">
                    Sou Profissional
                  </Button>
                </Link>
              </motion.div>

              {/* Floating Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  >
                    <div className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:bg-white/15 transition-all duration-300 group">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-2xl font-bold text-white font-display">{stat.value}</p>
                        <p className="text-xs text-white/60">{stat.label}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-white/40 text-xs tracking-widest uppercase">Rolar</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center pt-2"
            >
              <div className="w-1 h-2 bg-elpis-orange rounded-full" />
            </motion.div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════
            MARQUEE TICKER
        ══════════════════════════════════════════════════════ */}
        <section className="bg-elpis-black py-4 overflow-hidden border-y border-white/5">
          <div className="marquee-container">
            <div className="marquee-track animate-marquee">
              {[...marqueeItems, ...marqueeItems].map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-8 text-sm font-semibold text-elpis-orange whitespace-nowrap tracking-wider uppercase"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            ABOUT / STATS SECTION
        ══════════════════════════════════════════════════════ */}
        <section className="py-24 md:py-32 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* Image Collage */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="grid grid-cols-2 gap-3 max-w-xl">
                  <div className="space-y-3">
                    <div className="rounded-2xl overflow-hidden aspect-[4/5]">
                      <img
                        src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=500&fit=crop&q=80"
                        alt="Nutricionista com paciente"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="rounded-2xl overflow-hidden aspect-[4/3]">
                      <img
                        src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=400&h=300&fit=crop&q=80"
                        alt="Psicóloga consultando paciente"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-3 pt-8">
                    <div className="rounded-2xl overflow-hidden aspect-[4/3]">
                      <img
                        src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop&q=80"
                        alt="Alimentos saudáveis nutricionista"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="rounded-2xl overflow-hidden aspect-[4/5]">
                      <img
                        src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=500&fit=crop&q=80"
                        alt="Psicóloga em sessão de terapia"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Badge overlay */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-card-light rounded-2xl px-5 py-4 shadow-xl flex items-center gap-3 whitespace-nowrap"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-elpis-orange to-elpis-orange-dark rounded-xl flex items-center justify-center shadow-lg">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-elpis-black text-sm">Plataforma Certificada</p>
                    <p className="text-xs text-elpis-gray-medium">Profissionais verificados</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="section-badge">Sobre a Elpis</p>
                <h2 className="font-display font-bold text-4xl md:text-5xl text-elpis-black mb-6 leading-tight">
                  Transformando o cuidado
                  <br />
                  com saúde no <span className="text-gradient">Brasil</span>
                </h2>
                <p className="text-elpis-gray-medium text-lg mb-8 leading-relaxed">
                  A Elpis conecta pacientes aos melhores profissionais de saúde com tecnologia premium.
                  Nossa plataforma garante uma experiência elegante, ágil e segura para quem busca
                  cuidado de qualidade.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mb-10">
                  {[
                    { value: '150+', label: 'Profissionais' },
                    { value: '2000+', label: 'Consultas' },
                    { value: '99%', label: 'Satisfação' },
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                    >
                      <p className="font-display font-bold text-3xl text-elpis-orange mb-1">{s.value}</p>
                      <p className="text-sm text-elpis-gray-medium">{s.label}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <Link href="/buscar">
                    <Button size="lg" className="rounded-xl bg-elpis-orange hover:bg-elpis-orange-dark text-white shadow-lg shadow-elpis-orange/30">
                      Conhecer Profissionais
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/cadastro/profissional" className="flex items-center gap-2 text-elpis-black hover:text-elpis-orange transition-colors font-medium text-sm">
                    <span>Para Profissionais</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            MARQUEE #2 — White Background
        ══════════════════════════════════════════════════════ */}
        <section className="bg-elpis-offWhite py-5 overflow-hidden border-y border-elpis-gray-light">
          <div className="marquee-container">
            <div className="marquee-track animate-marquee-reverse">
              {[...marqueeItems, ...marqueeItems].map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-8 text-sm font-semibold text-elpis-gray-medium whitespace-nowrap tracking-wider uppercase"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            CATEGORIES SECTION
        ══════════════════════════════════════════════════════ */}
        <section className="py-24 md:py-32 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <p className="section-badge">Especialidades</p>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-elpis-black mb-4">
                Serviços para Elevar<br />
                <span className="text-gradient">sua Saúde</span>
              </h2>
              <p className="text-elpis-gray-medium max-w-2xl mx-auto text-lg">
                Encontre o profissional ideal para cada necessidade da sua vida
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
              {categories.map((category, index) => (
                <motion.div
                  key={category.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                >
                  <Link
                    href={`/buscar?category=${category.slug}`}
                    className="group flex flex-col items-center gap-4 p-6 rounded-2xl bg-white border border-elpis-gray-light hover:border-elpis-orange/30 hover:shadow-xl hover:shadow-elpis-orange/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                      <category.icon className="h-8 w-8 text-white" />
                    </div>
                    <span className="font-semibold text-elpis-black text-center text-sm group-hover:text-elpis-orange transition-colors">
                      {category.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            FEATURED PROFESSIONALS
        ══════════════════════════════════════════════════════ */}
        <section className="py-24 md:py-32 bg-elpis-offWhite">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14"
            >
              <div>
                <p className="section-badge">Profissionais em Destaque</p>
                <h2 className="font-display font-bold text-4xl md:text-5xl text-elpis-black mb-3">
                  Conheça os <span className="text-gradient">Melhores</span>
                </h2>
                <p className="text-elpis-gray-medium max-w-xl text-lg">
                  Profissionais verificados, avaliados e prontos para atender você
                </p>
              </div>
              <Link href="/buscar">
                <Button variant="outline" className="border-elpis-orange text-elpis-orange hover:bg-elpis-orange hover:text-white rounded-xl">
                  Ver todos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="card-premium overflow-hidden">
                    <div className="aspect-[4/3] bg-muted animate-pulse" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                      <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                    </div>
                  </div>
                ))
              ) : displayProfessionals.length > 0 ? (
                displayProfessionals.map((professional, index) => (
                  <motion.div
                    key={professional.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Link
                      href={`/profissional/${professional.slug}`}
                      className="card-premium overflow-hidden group block"
                    >
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        {professional.image ? (
                          <img
                            src={professional.image}
                            alt={professional.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                            <User className="h-16 w-16 text-primary/30" />
                          </div>
                        )}
                        {/* Specialty badge */}
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold shadow-lg">
                            {professional.specialty || professional.title || 'Profissional'}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 bg-card">
                        <h3 className="font-display font-semibold text-lg text-card-foreground mb-1 group-hover:text-primary transition-colors truncate">
                          {professional.name || professional.fullName}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                          {professional.title || professional.specialty || '—'}
                        </p>

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground min-w-0">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">
                              {[professional.city, professional.state].filter(Boolean).join(', ') || 'Brasil'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                            <span className="text-xs font-semibold text-card-foreground">
                              {(professional as any).rating || '4.9'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-border">
                          <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                            Ver Perfil <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                // Empty state - no professionals registered
                <div className="col-span-full text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="font-display font-bold text-2xl text-foreground mb-2">
                      Nenhum profissional cadastrado
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Ainda não há profissionais na plataforma. Seja o primeiro a se cadastrar!
                    </p>
                    <Link href="/cadastro/profissional">
                      <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl">
                        Cadastrar Profissional
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════════════════════ */}
        <section className="py-24 md:py-32 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="section-badge">Processo Simples</p>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-elpis-black mb-4">
                Nosso Processo
                <br />
                <span className="text-gradient">Comprovado</span>
              </h2>
              <p className="text-elpis-gray-medium max-w-2xl mx-auto text-lg">
                Em 4 passos simples, você começa a cuidar da sua saúde com os melhores profissionais
              </p>
            </motion.div>

            <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
              {/* Connector line (desktop) */}
              <div className="hidden md:block absolute top-12 left-[calc(12.5%+1.5rem)] right-[calc(12.5%+1.5rem)] h-px bg-gradient-to-r from-elpis-orange/40 via-elpis-orange/60 to-elpis-orange/40 z-0" />

              {howItWorks.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  className="flex flex-col items-center text-center relative z-10"
                >
                  {/* Step circle */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-elpis-orange to-elpis-orange-dark flex items-center justify-center shadow-xl shadow-elpis-orange/30 group-hover:scale-110 transition-transform">
                      <step.icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-elpis-black flex items-center justify-center shadow-lg">
                      <span className="text-elpis-orange text-xs font-bold font-display">{step.step}</span>
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-xl text-elpis-black mb-3">{step.title}</h3>
                  <p className="text-elpis-gray-medium text-sm leading-relaxed max-w-xs">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            BENEFITS SECTION
        ══════════════════════════════════════════════════════ */}
        <section className="py-24 md:py-32 bg-muted/40">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <p className="section-badge">Vantagens</p>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4">
                Por que escolher
                <br />
                <span className="text-gradient">a Elpis?</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Uma experiência completa e premium para cuidar da sua saúde
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="card-premium p-7 h-full flex flex-col items-start group">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/15 to-primary/8 rounded-2xl flex items-center justify-center mb-5 group-hover:from-primary group-hover:to-orange-600 transition-all duration-300">
                      <benefit.icon className="h-7 w-7 text-primary group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-foreground mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            DARK FEATURES SECTION
        ══════════════════════════════════════════════════════ */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          {/* Background image with dark overlay */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1920&h=600&fit=crop&q=80"
              alt="Psicólogo em atendimento"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/92 to-elpis-orange-dark/30" />
          </div>

          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-elpis-orange/30 bg-elpis-orange/10 text-elpis-orange text-sm font-medium mb-6">
                <Zap className="h-4 w-4" />
                Recursos da Plataforma
              </span>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
                Saúde Inteligente,
                <br />
                <span className="text-gradient">Vida Plena</span>
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto text-lg">
                Tecnologia de ponta para conectar você ao cuidado perfeito
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: TrendingUp, title: 'Smart Matching', desc: 'Algoritmo inteligente que analisa suas necessidades para recomendar o profissional ideal.', color: 'from-blue-500 to-blue-600' },
                { icon: Clock,      title: 'Tempo Real',     desc: 'Disponibilidade instantânea. Agende no horário certo, sem enrolação.', color: 'from-violet-500 to-purple-600' },
                { icon: Award,     title: 'Premium',         desc: 'Apenas os melhores profissionais, verificados e avaliados pela comunidade.', color: 'from-elpis-orange to-elpis-orange-dark' },
                { icon: Zap,       title: 'Resposta Rápida', desc: 'Consultas agendadas em minutos, sem filas de espera ou burocracia.', color: 'from-emerald-500 to-green-600' },
                { icon: Users,     title: 'Comunidade',      desc: 'Milhares de pacientes satisfeitos e profissionais dedicados à sua saúde.', color: 'from-pink-500 to-rose-600' },
                { icon: Shield,    title: 'Segurança',       desc: 'Dados protegidos com a mais alta tecnologia de segurança e privacidade.', color: 'from-indigo-500 to-indigo-600' },
                { icon: Star,      title: 'Avaliações Reais', desc: 'Feedbacks autênticos para você escolher com total segurança e confiança.', color: 'from-amber-500 to-yellow-600' },
                { icon: Heart,     title: 'Cuidado Total',   desc: 'Atendimento humanizado focado nas suas necessidades únicas de saúde.', color: 'from-rose-500 to-red-600' },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.07 }}
                >
                  <div className="glass-card rounded-2xl p-6 h-full group hover:bg-white/15 transition-all duration-300 hover:-translate-y-1">
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-white mb-2">{feature.title}</h3>
                    <p className="text-white/55 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            CTA SECTION
        ══════════════════════════════════════════════════════ */}
        <section className="py-24 md:py-32 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative rounded-3xl overflow-hidden"
            >
              {/* Background */}
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=1920&h=600&fit=crop&q=80"
                alt="Atendimento de saúde premium"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-elpis-orange via-elpis-orange/95 to-elpis-orange-dark" />
              </div>

              {/* Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

              {/* Orbs */}
              <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-elpis-orange-dark/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10 text-center max-w-3xl mx-auto py-16 md:py-24 px-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 bg-white/15 text-white text-sm font-medium mb-6">
                  <Sparkles className="h-4 w-4" />
                  Comece hoje mesmo
                </span>
                <h2 className="font-display font-bold text-4xl md:text-6xl text-white mb-6 leading-tight">
                  Pronto para começar
                  <br />a cuidar da sua saúde?
                </h2>
                <p className="text-white/85 text-lg mb-10 max-w-xl mx-auto">
                  Encontre o profissional ideal ou cadastre-se para oferecer seus serviços.
                  Rápido, simples e gratuito.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/buscar">
                    <Button size="lg" className="rounded-xl bg-white text-elpis-orange hover:bg-white/90 shadow-xl font-semibold px-8 h-14">
                      Buscar Profissional
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/cadastro/profissional">
                    <Button size="lg" variant="outline" className="rounded-xl border-white/60 text-white hover:bg-white/15 hover:border-white px-8 h-14 font-semibold">
                      Cadastrar como Profissional
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
