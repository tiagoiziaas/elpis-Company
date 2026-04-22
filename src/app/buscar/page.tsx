'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, MapPin, Star, ChevronDown, Loader2, X, SlidersHorizontal } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Professional {
  id: string
  slug: string
  name: string
  title: string
  specialty: string
  city: string
  state: string
  image: string | null
  rating?: number
  reviews?: number
}

const specialties = [
  { value: 'all', label: 'Todas as especialidades' },
  { value: 'Nutrição', label: 'Nutrição' },
  { value: 'Psicologia', label: 'Psicologia' },
  { value: 'Educação Física', label: 'Educação Física' },
  { value: 'Fisioterapia', label: 'Fisioterapia' },
  { value: 'Medicina', label: 'Medicina' },
  { value: 'Enfermagem', label: 'Enfermagem' },
]

const states = [
  { value: 'all', label: 'Todos os estados' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'PR', label: 'Paraná' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'BA', label: 'Bahia' },
  { value: 'DF', label: 'Distrito Federal' },
]

export default function SearchPage() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const [selectedState, setSelectedState] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const hasActiveFilters = selectedSpecialty !== 'all' || selectedState !== 'all'

  const clearFilters = () => {
    setSelectedSpecialty('all')
    setSelectedState('all')
  }

  useEffect(() => {
    const fetchProfessionals = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        if (selectedSpecialty !== 'all') params.set('specialty', selectedSpecialty)
        if (selectedState !== 'all') params.set('state', selectedState)
        if (searchTerm) params.set('search', searchTerm)

        const response = await fetch(`/api/professionals?${params.toString()}`)
        const data = await response.json()
        setProfessionals(data.professionals || [])
      } catch (error) {
        console.error('Error fetching professionals:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchProfessionals, 300)
    return () => clearTimeout(debounceTimer)
  }, [selectedSpecialty, selectedState, searchTerm])

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA]">
      <Header />

      <main className="flex-1 pt-20">

        {/* ── Hero / Search Banner ── */}
        <section
          className="relative overflow-hidden py-14 md:py-20"
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
          }}
        >
          {/* Decorative glow blobs */}
          <div
            className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, #F97316, transparent)' }}
          />
          <div
            className="absolute -bottom-10 right-0 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, #F97316, transparent)' }}
          />

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto text-center"
            >
              {/* Sub-badge */}
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-5 border border-orange-400/30 text-orange-400 bg-orange-400/10">
                <Search className="h-3.5 w-3.5" />
                Encontre seu profissional
              </span>

              <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4 leading-tight">
                Buscar{' '}
                <span className="text-gradient">Profissionais</span>
              </h1>
              <p className="text-slate-300 text-base md:text-lg mb-10 leading-relaxed">
                Encontre o profissional ideal para cuidar da sua saúde com qualidade e confiança
              </p>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Busque por nome, especialidade ou palavra-chave..."
                  className="w-full pl-14 pr-5 h-14 text-base rounded-2xl border-2 border-white/10 bg-white/10 text-white placeholder-slate-400 backdrop-blur-md shadow-2xl outline-none focus:border-orange-400/60 focus:bg-white/15 transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ caretColor: '#F97316' }}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Filter Toggle */}
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    showFilters || hasActiveFilters
                      ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/30'
                      : 'bg-white/10 text-slate-300 border-white/15 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtros
                  {hasActiveFilters && (
                    <span className="ml-1 bg-white/25 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {[selectedSpecialty !== 'all', selectedState !== 'all'].filter(Boolean).length}
                    </span>
                  )}
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                    Limpar
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Filters Panel ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.section
              key="filters"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden bg-white border-b border-slate-200 shadow-sm"
            >
              <div className="container mx-auto px-4 md:px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Especialidade
                    </label>
                    <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                      <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-800 font-medium focus:border-orange-400 focus:ring-orange-400/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Estado
                    </label>
                    <Select value={selectedState} onValueChange={setSelectedState}>
                      <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-800 font-medium focus:border-orange-400 focus:ring-orange-400/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── Results ── */}
        <section className="py-10 md:py-14">
          <div className="container mx-auto px-4 md:px-6">

            {/* Result count bar */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-orange-600 font-bold text-sm">
                  {isLoading ? '–' : professionals.length}
                </span>
                <p className="text-slate-600 text-sm font-medium">
                  {isLoading ? 'Buscando...' : professionals.length === 1 ? 'profissional encontrado' : 'profissionais encontrados'}
                </p>
              </div>
              {hasActiveFilters && !isLoading && (
                <span className="text-xs text-orange-600 font-medium bg-orange-50 border border-orange-100 px-3 py-1 rounded-full">
                  Filtros ativos
                </span>
              )}
            </div>

            {isLoading ? (
              /* Loading skeleton */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm animate-pulse">
                    <div className="aspect-[4/3] bg-slate-200" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 bg-slate-200 rounded-lg w-3/4" />
                      <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
                      <div className="h-3 bg-slate-100 rounded-lg w-full" />
                      <div className="h-3 bg-slate-100 rounded-lg w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : professionals.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 bg-orange-50 border-2 border-orange-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Search className="h-10 w-10 text-orange-400" />
                </div>
                <h3 className="font-display font-bold text-xl text-slate-800 mb-2">
                  Nenhum profissional encontrado
                </h3>
                <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                  Tente ajustar os filtros ou buscar por outros termos para encontrar o profissional ideal.
                </p>
                {(hasActiveFilters || searchTerm) && (
                  <button
                    onClick={() => { clearFilters(); setSearchTerm('') }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/25"
                  >
                    <X className="h-4 w-4" />
                    Limpar busca
                  </button>
                )}
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {professionals.map((professional, index) => (
                  <motion.div
                    key={professional.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link href={`/profissional/${professional.slug}`}>
                      <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-200 transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full flex flex-col">

                        {/* Card Image Area */}
                        <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-orange-50 flex items-center justify-center relative overflow-hidden">
                          {professional.image ? (
                            <img
                              src={professional.image}
                              alt={professional.name}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                                <span className="text-2xl font-bold text-white">
                                  {professional.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Rating Badge */}
                          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white shadow-md px-2.5 py-1 rounded-full">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold text-slate-700">5.0</span>
                          </div>

                          {/* Specialty ribbon */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-4 pt-6 pb-2">
                            <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                              {professional.specialty}
                            </span>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-display font-bold text-base text-slate-900 mb-0.5 group-hover:text-orange-600 transition-colors line-clamp-1">
                            {professional.name}
                          </h3>
                          <p className="text-sm font-semibold text-orange-600 mb-3">
                            {professional.title}
                          </p>

                          <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                              <MapPin className="h-3.5 w-3.5 text-orange-400 flex-shrink-0" />
                              <span className="truncate">{professional.city}, {professional.state}</span>
                            </div>
                            <span className="text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                              Novo
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
