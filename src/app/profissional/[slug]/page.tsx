'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  MapPin,
  Instagram,
  Globe,
  MessageCircle,
  Clock,
  CheckCircle,
  FileText,
  Video,
  Star,
  ChevronDown,
  ArrowLeft,
  Shield,
  Sparkles,
  X,
  Phone,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ProfessionalService {
  id: string
  title: string
  description: string
  price: number
  duration: number
}

interface ProfessionalContent {
  id: string
  title: string
  excerpt: string
  content: string
  type: 'ARTICLE' | 'VIDEO'
  videoUrl?: string | null
  attachmentUrl?: string | null
  date: string
}

interface ProfessionalData {
  name: string
  title: string
  specialty: string
  city: string
  state: string
  bio: string
  approach: string
  headline: string
  whatsapp?: string | null
  instagram?: string | null
  website?: string | null
  image: string | null
  rating: number
  reviews: number
  gradient: string
  services: ProfessionalService[]
  availability: { day: string; hours: string }[]
  content: ProfessionalContent[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
})

// ─── Component ───────────────────────────────────────────────────────────────
export default function ProfessionalProfilePage() {
  const params = useParams()
  const slug = typeof params.slug === 'string' ? params.slug : ''
  
  const [professional, setProfessional] = useState<ProfessionalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [showAppointmentForm, setShowAppointmentForm] = useState(false)
  const [activeSection, setActiveSection] = useState<'about' | 'services' | 'content' | 'schedule'>('about')

  useEffect(() => {
    if (!slug) return

    async function fetchProfessional() {
      try {
        const response = await fetch(`/api/professionals/${slug}`)
        if (response.ok) {
          const data = await response.json()
          setProfessional(data.professional)
        }
      } catch (error) {
        console.error('Error fetching professional:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfessional()
  }, [slug])

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-6 pt-20">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
          <p className="text-white text-lg font-semibold">Carregando perfil...</p>
        </main>
      </div>
    )
  }

  // ── Not found ──────────────────────────────────────────────────────────────
  if (!professional) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-6 pt-20">
          <p className="text-white text-2xl font-bold">Profissional não encontrado</p>
          <Link href="/profissionais">
            <Button className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Ver todos os profissionais
            </Button>
          </Link>
        </main>
      </div>
    )
  }

  const initials = professional.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const handleWhatsApp = () => {
    if (professional.whatsapp) {
      window.open(`https://wa.me/55${professional.whatsapp}`, '_blank')
    }
  }

  const tabs = [
    { id: 'about',    label: 'Sobre',      icon: FileText },
    { id: 'services', label: 'Serviços',   icon: Sparkles },
    { id: 'content',  label: 'Conteúdos',  icon: Video },
    { id: 'schedule', label: 'Agenda',     icon: Calendar },
  ] as const

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Header />

      <main className="flex-1 pt-20">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-12 pb-10">
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br ${professional.gradient} opacity-[0.07] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2`} />
            <div className={`absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-br ${professional.gradient} opacity-[0.05] rounded-full blur-3xl`} />
          </div>

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            {/* Back link */}
            <motion.div {...fadeUp(0)} className="mb-8">
              <Link
                href="/profissionais"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Voltar aos profissionais
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Profile Info */}
              <motion.div {...fadeUp(0.1)} className="lg:col-span-2">
                <div className="flex items-start gap-6">
                  <div className="relative flex-shrink-0">
                    <div className={`absolute inset-0 bg-gradient-to-br ${professional.gradient} rounded-2xl blur-xl opacity-50`} />
                    <Avatar className="relative h-28 w-28 md:h-36 md:w-36 rounded-2xl border-2 border-white/10 shadow-2xl">
                      <AvatarImage src={professional.image || undefined} />
                      <AvatarFallback className={`bg-gradient-to-br ${professional.gradient} text-white text-3xl font-bold rounded-2xl`}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full w-7 h-7 flex items-center justify-center border-2 border-[#0a0a0a] shadow-lg">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                      <Shield className="h-3 w-3" />
                      Profissional Verificado
                    </div>
                    <h1 className="font-bold text-3xl md:text-4xl text-white mb-1 tracking-tight">
                      {professional.name}
                    </h1>
                    <p className={`font-semibold text-lg mb-1 bg-gradient-to-r ${professional.gradient} bg-clip-text text-transparent`}>
                      {professional.title}
                    </p>
                    <p className="text-slate-400 mb-4">{professional.specialty}</p>

                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-white">{professional.rating.toFixed(1)}</span>
                        <span className="text-slate-500 text-sm">({professional.reviews} avaliações)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{professional.city}, {professional.state}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={() => setShowAppointmentForm(true)}
                        className={`rounded-xl bg-gradient-to-r ${professional.gradient} text-white font-semibold shadow-lg border-0 hover:opacity-90 transition-opacity`}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Agendar Consulta
                      </Button>
                      {professional.whatsapp && (
                        <Button
                          variant="outline"
                          onClick={handleWhatsApp}
                          className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                        >
                          <MessageCircle className="h-4 w-4 mr-2 text-emerald-400" />
                          WhatsApp
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Info Card */}
              <motion.div {...fadeUp(0.2)}>
                <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-6 space-y-5">
                  <h3 className="font-semibold text-white text-sm uppercase tracking-wider opacity-60">
                    Informações de Contato
                  </h3>

                  {professional.instagram && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center flex-shrink-0">
                        <Instagram className="h-4 w-4 text-pink-400" />
                      </div>
                      <a href={`https://instagram.com/${professional.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-pink-400 transition-colors">
                        {professional.instagram}
                      </a>
                    </div>
                  )}

                  {professional.website && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Globe className="h-4 w-4 text-blue-400" />
                      </div>
                      <a href={`https://${professional.website}`} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-blue-400 transition-colors truncate">
                        {professional.website}
                      </a>
                    </div>
                  )}

                  {professional.whatsapp && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-4 w-4 text-emerald-400" />
                      </div>
                      <span className="text-slate-300">(disponível via WhatsApp)</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/10">
                    <h3 className="font-semibold text-white text-sm uppercase tracking-wider opacity-60 mb-3">Atende</h3>
                    <div className="space-y-1.5">
                      {professional.availability.slice(0, 3).map((slot, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Clock className="h-3 w-3" />
                            <span>{slot.day}</span>
                          </div>
                          <span className="text-slate-300 font-medium">{slot.hours}</span>
                        </div>
                      ))}
                      {professional.availability.length > 3 && (
                        <p className="text-xs text-slate-500 mt-1">+ {professional.availability.length - 3} outros dias</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Navigation Tabs ───────────────────────────────────── */}
        <div className="sticky top-20 z-40 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                    activeSection === tab.id
                      ? `bg-gradient-to-r ${professional.gradient} text-white shadow-lg`
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Content Sections ─────────────────────────────────── */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                {/* About */}
                {activeSection === 'about' && (
                  <motion.div key="about" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} className="space-y-6">
                    <div className={`rounded-2xl bg-gradient-to-br ${professional.gradient} p-6 md:p-8`}>
                      <Sparkles className="h-6 w-6 text-white/70 mb-3" />
                      <p className="text-white font-bold text-xl md:text-2xl leading-relaxed">"{professional.headline}"</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 md:p-8">
                      <h2 className="font-bold text-xl text-white mb-4">Sobre</h2>
                      <p className="text-slate-400 leading-relaxed whitespace-pre-line mb-6">{professional.bio}</p>
                      <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                        <h3 className="font-semibold text-white mb-2">Abordagem</h3>
                        <p className="text-slate-400 leading-relaxed">{professional.approach}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Services */}
                {activeSection === 'services' && (
                  <motion.div key="services" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {professional.services.map((service, i) => (
                      <motion.div key={service.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-2xl bg-white/5 border border-white/10 p-6 hover:border-white/20 transition-colors">
                        <h3 className="font-bold text-lg text-white mb-2">{service.title}</h3>
                        <p className="text-slate-400 text-sm mb-4">{service.description}</p>
                        <div className="flex items-center gap-3 mb-5 text-xs text-slate-500">
                          <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{service.duration} min</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className={`text-2xl font-bold bg-gradient-to-r ${professional.gradient} bg-clip-text text-transparent`}>
                            R$ {service.price.toFixed(2).replace('.', ',')}
                          </p>
                          <Button size="sm" className={`rounded-xl bg-gradient-to-r ${professional.gradient} text-white border-0 hover:opacity-90 transition-opacity`}
                            onClick={() => { setSelectedService(service.id); setShowAppointmentForm(true) }}>
                            Agendar
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Content */}
                {activeSection === 'content' && (
                  <motion.div key="content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 md:p-8">
                      <h2 className="font-bold text-xl text-white mb-6">Conteúdos Publicados</h2>
                      <div className="space-y-6">
                        {professional.content.length === 0 ? (
                          <div className="text-center py-12">
                            <FileText className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                            <p className="text-slate-400 text-sm">Nenhum conteúdo publicado ainda</p>
                          </div>
                        ) : (
                          professional.content.map((item, i) => (
                            <motion.div key={item.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="border-b border-white/5 last:border-0 pb-6 last:pb-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.type === 'VIDEO' ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                                  {item.type === 'VIDEO' ? '▶ Vídeo' : '📝 Artigo'}
                                </span>
                                <span className="text-xs text-slate-500">{new Date(item.date).toLocaleDateString('pt-BR')}</span>
                              </div>
                              <h3 className="font-semibold text-lg text-white mb-2">{item.title}</h3>
                              {item.excerpt && (
                                <p className="text-slate-400 text-sm mb-3">{item.excerpt}</p>
                              )}
                              
                              {/* Video */}
                              {item.videoUrl && item.type === 'VIDEO' && (
                                <div className="mb-3 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                                  {item.videoUrl.includes('youtube') || item.videoUrl.includes('youtu.be') ? (
                                    <iframe
                                      src={item.videoUrl.replace('watch?v=', 'embed/')}
                                      className="w-full aspect-video"
                                      title={item.title}
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                    />
                                  ) : (
                                    <video
                                      controls
                                      className="w-full aspect-video"
                                      poster=""
                                    >
                                      <source src={item.videoUrl} type="video/mp4" />
                                      Seu navegador não suporta a reprodução de vídeos.
                                    </video>
                                  )}
                                </div>
                              )}
                              
                              {/* Attachment */}
                              {item.attachmentUrl && (
                                <a
                                  href={item.attachmentUrl}
                                  download
                                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium hover:bg-orange-500/20 transition-colors mb-3"
                                >
                                  <FileText className="h-4 w-4" />
                                  Baixar arquivo anexo
                                </a>
                              )}
                              
                              {/* Content preview */}
                              {item.content && (
                                <div className="text-slate-400 text-sm mb-3 line-clamp-3 whitespace-pre-line">{item.content}</div>
                              )}
                              
                              <button className="text-sm text-slate-500 hover:text-white transition-colors flex items-center gap-1">
                                {item.content || item.videoUrl ? 'Ver completo' : 'Saiba mais'} <ChevronDown className="h-3 w-3" />
                              </button>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Schedule */}
                {activeSection === 'schedule' && (
                  <motion.div key="schedule" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 md:p-8">
                      <h2 className="font-bold text-xl text-white mb-6">Disponibilidade</h2>
                      <div className="space-y-3">
                        {professional.availability.map((slot, i) => (
                          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                            className="flex items-center justify-between py-3.5 px-5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                              <Clock className="h-4 w-4 text-slate-500" />
                              <span className="font-medium text-white">{slot.day}</span>
                            </div>
                            <span className="text-slate-400 text-sm">{slot.hours}</span>
                          </motion.div>
                        ))}
                      </div>
                      <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400">
                        💡 Os horários podem variar. Entre em contato para confirmar a disponibilidade.
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* ── Appointment Modal ────────────────────────────────── */}
      <AnimatePresence>
        {showAppointmentForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAppointmentForm(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} transition={{ duration: 0.3 }}
              className="bg-[#141414] border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-bold text-xl text-white">Agendar Consulta</h2>
                  <p className="text-sm text-slate-400 mt-0.5">com {professional.name}</p>
                </div>
                <button onClick={() => setShowAppointmentForm(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-slate-300 text-sm mb-1.5 block">Seu Nome</Label>
                  <Input id="name" placeholder="Digite seu nome completo" className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-orange-500 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-slate-300 text-sm mb-1.5 block">Seu Email</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-orange-500 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-slate-300 text-sm mb-1.5 block">Seu Telefone</Label>
                  <Input id="phone" placeholder="(00) 00000-0000" className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-orange-500 rounded-xl" />
                </div>
                {selectedService && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Serviço selecionado</p>
                    <p className="text-sm font-semibold text-white">{professional.services.find((s) => s.id === selectedService)?.title}</p>
                  </div>
                )}
                <div>
                  <Label htmlFor="date" className="text-slate-300 text-sm mb-1.5 block">Data Preferida</Label>
                  <Input id="date" type="date" className="bg-white/5 border-white/10 text-white focus-visible:ring-orange-500 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="time" className="text-slate-300 text-sm mb-1.5 block">Horário Preferido</Label>
                  <Input id="time" type="time" className="bg-white/5 border-white/10 text-white focus-visible:ring-orange-500 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="notes" className="text-slate-300 text-sm mb-1.5 block">Observações (opcional)</Label>
                  <Input id="notes" placeholder="Alguma observação especial?" className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-orange-500 rounded-xl" />
                </div>
                <Button type="submit" className={`w-full rounded-xl bg-gradient-to-r ${professional.gradient} text-white font-semibold border-0 hover:opacity-90 transition-opacity mt-2 h-12`}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Confirmar Agendamento
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
