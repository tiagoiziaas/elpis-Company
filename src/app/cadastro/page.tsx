"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { User, Stethoscope, ArrowRight, CheckCircle2, Sparkles, ArrowLeft } from "lucide-react"

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function RegisterSelectPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">

      {/* ─── Background ───────────────────────────────── */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1920&h=1080&fit=crop&q=85"
          alt="Psicóloga em sessão de atendimento"
          className="w-full h-full object-cover"
        />
        {/* Layered gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/88 via-elpis-black/82 to-elpis-orange-dark/25" />
        {/* Orange overlay at bottom for warmth */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-elpis-orange/10 to-transparent" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.04)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Animated orbs */}
      <div className="absolute top-1/5 left-1/5 w-96 h-96 bg-elpis-orange/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/5 right-1/5 w-80 h-80 bg-blue-500/08 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2.5s' }} />

      {/* ─── Header ───────────────────────────────────── */}
      <header className="relative z-10 py-6 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">Voltar</span>
          </Link>

          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-0">
            <img
              src="/logo.png"
              alt="Elpis logo"
              className="w-12 h-12 object-contain drop-shadow-lg self-center"
            />
            <span className="font-display font-bold text-2xl text-white leading-none">Elpis</span>
          </Link>

          <Link href="/login" className="text-white/60 hover:text-white text-sm font-medium transition-colors">
            Já tenho conta →
          </Link>
        </div>
      </header>

      {/* ─── Main Content ─────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center relative z-10 px-4 py-8">
        <div className="w-full max-w-5xl">

          {/* Heading */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-elpis-orange/30 bg-elpis-orange/10 text-elpis-orange text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Cadastro Gratuito
            </span>
            <h1 className="font-display font-bold text-4xl md:text-5xl xl:text-6xl text-white mb-5 leading-tight">
              Como você deseja
              <br />
              usar a <span className="text-gradient">Elpis</span>?
            </h1>
            <p className="text-white/65 text-lg max-w-xl mx-auto leading-relaxed">
              Escolha o tipo de conta que melhor se encaixa no que você precisa
            </p>
          </motion.div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">

            {/* ── Paciente Card ── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href="/cadastro/paciente" className="block h-full group">
                <div className="relative h-full glass-card rounded-3xl p-8 border border-white/15 hover:border-elpis-orange/50 hover:bg-white/15 transition-all duration-400 overflow-hidden cursor-pointer">
                  {/* Glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-elpis-orange/0 to-elpis-orange/0 group-hover:from-elpis-orange/8 group-hover:to-transparent transition-all duration-500 rounded-3xl" />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6 group-hover:scale-110 transition-transform duration-400">
                      <User className="h-8 w-8 text-white" />
                    </div>

                    <h2 className="font-display font-bold text-3xl text-white mb-2">Paciente</h2>
                    <p className="text-white/60 text-base mb-7 leading-relaxed">
                      Encontre os melhores profissionais de saúde e cuide do seu bem-estar de forma prática.
                    </p>

                    <ul className="space-y-3 mb-8">
                      {[
                        'Busque profissionais por especialidade e cidade',
                        'Agende consultas online de forma simples',
                        'Acompanhe seu histórico de atendimentos',
                        '100% gratuito para pacientes',
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-white/80 text-sm">
                          <CheckCircle2 className="h-5 w-5 text-sky-400 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-full h-12 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-blue-600 hover:to-sky-500 text-white font-semibold shadow-lg shadow-blue-500/30 group/btn"
                      size="lg"
                    >
                      Criar conta de Paciente
                      <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* ── Profissional Card ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href="/cadastro/profissional" className="block h-full group">
                <div className="relative h-full glass-card rounded-3xl p-8 border border-white/15 hover:border-elpis-orange/60 hover:bg-white/15 transition-all duration-400 overflow-hidden cursor-pointer">
                  {/* Glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-elpis-orange/0 to-elpis-orange/0 group-hover:from-elpis-orange/10 group-hover:to-transparent transition-all duration-500 rounded-3xl" />

                  {/* Popular badge */}
                  <div className="absolute top-6 right-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-elpis-orange text-white text-xs font-bold shadow-lg shadow-elpis-orange/40">
                      <Sparkles className="h-3 w-3" />
                      Popular
                    </span>
                  </div>

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-gradient-to-br from-elpis-orange to-elpis-orange-dark rounded-2xl flex items-center justify-center shadow-lg shadow-elpis-orange/40 mb-6 group-hover:scale-110 transition-transform duration-400">
                      <Stethoscope className="h-8 w-8 text-white" />
                    </div>

                    <h2 className="font-display font-bold text-3xl text-white mb-2">Profissional</h2>
                    <p className="text-white/60 text-base mb-7 leading-relaxed">
                      Tenha sua própria plataforma de atendimento digital e gerencie sua carreira com elegância.
                    </p>

                    <ul className="space-y-3 mb-8">
                      {[
                        'Mini site profissional personalizado',
                        'Gestão completa de agenda e horários',
                        'Base de pacientes integrada',
                        'Publique conteúdos e expanda sua autoridade',
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-white/80 text-sm">
                          <CheckCircle2 className="h-5 w-5 text-elpis-orange mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-full h-12 rounded-2xl bg-gradient-to-r from-elpis-orange to-elpis-orange-dark hover:from-elpis-orange-dark hover:to-elpis-orange text-white font-semibold shadow-lg shadow-elpis-orange/40 group/btn"
                      size="lg"
                    >
                      Criar conta de Profissional
                      <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Login link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="text-white/55 text-sm">
              Já tem uma conta?{' '}
              <Link
                href="/login"
                className="text-elpis-orange hover:text-elpis-orange-light font-semibold transition-colors inline-flex items-center gap-1 group"
              >
                Fazer login
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
