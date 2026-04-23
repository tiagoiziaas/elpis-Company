'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Save, Phone, Mail, Globe, Instagram, Facebook, Linkedin,
  Youtube, Video, MapPin, Home, Building, Tag, Plus, X,
  Loader2, ExternalLink, Eye
} from 'lucide-react'
import { DashboardHeader } from '../Header'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface BusinessCard {
  id?: string
  phone?: string | null
  email?: string | null
  website?: string | null
  instagram?: string | null
  facebook?: string | null
  linkedin?: string | null
  youtube?: string | null
  tiktok?: string | null
  address?: string | null
  addressNumber?: string | null
  addressComplement?: string | null
  neighborhood?: string | null
  city?: string | null
  state?: string | null
  zipCode?: string | null
  description?: string | null
  services: string[]
}

interface ProfessionalProfile {
  slug?: string
  fullName: string
  title: string
  specialty: string
  profileImageUrl?: string | null
  whatsapp?: string | null
  instagram?: string | null
}

export default function BusinessCardPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [businessCard, setBusinessCard] = useState<BusinessCard>({
    phone: '', email: '', website: '',
    instagram: '', facebook: '', linkedin: '', youtube: '', tiktok: '',
    address: '', addressNumber: '', addressComplement: '',
    neighborhood: '', city: '', state: '', zipCode: '',
    description: '', services: [],
  })
  const [newService, setNewService] = useState('')
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null)

  useEffect(() => {
    if (status === 'authenticated') fetchData()
  }, [status])

  const fetchData = async () => {
    try {
      setLoading(true)
      const profileResponse = await fetch('/api/professional/profile')
      if (profileResponse.ok) setProfile(await profileResponse.json())

      const settingsResponse = await fetch('/api/professional/settings')
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json()
        if (settingsData.businessCard) {
          setBusinessCard({ ...settingsData.businessCard, services: settingsData.businessCard.services || [] })
        }
      }
    } catch {
      toast({ title: 'Erro ao carregar dados', description: 'Não foi possível carregar os dados do seu cartão de visitas.', variant: 'destructive' })
    } finally { setLoading(false) }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const response = await fetch('/api/professional/settings', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ businessCard }),
      })
      if (response.ok) toast({ title: 'Cartão de visitas salvo!', description: 'Seu cartão de visitas foi atualizado com sucesso.' })
      else throw new Error('Failed to save business card')
    } catch {
      toast({ title: 'Erro ao salvar', variant: 'destructive', action: <ToastAction altText="Try again">Tentar novamente</ToastAction> })
    } finally { setIsSaving(false) }
  }

  const handleViewCard = () => {
    if (profile?.slug) window.open(`/cartao-visita/profissional/${profile.slug}`, '_blank')
  }

  const hc = (field: keyof BusinessCard, value: string) => setBusinessCard(prev => ({ ...prev, [field]: value }))

  const handleAddService = () => {
    if (newService.trim() && !businessCard.services.includes(newService.trim())) {
      setBusinessCard(prev => ({ ...prev, services: [...prev.services, newService.trim()] }))
      setNewService('')
    }
  }
  const handleRemoveService = (s: string) => setBusinessCard(prev => ({ ...prev, services: prev.services.filter(x => x !== s) }))
  const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleAddService() }

  if (status === 'unauthenticated') redirect('/login')

  if (loading) {
    return (
      <>
        <DashboardHeader />
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Carregando cartão de visitas...</p>
          </div>
        </div>
      </>
    )
  }

  const socialLinks = [
    { key: 'instagram' as const, icon: Instagram, label: 'Instagram', placeholder: '@seuinstagram' },
    { key: 'facebook' as const, icon: Facebook, label: 'Facebook', placeholder: 'facebook.com/seupagina' },
    { key: 'linkedin' as const, icon: Linkedin, label: 'LinkedIn', placeholder: 'linkedin.com/in/seu-perfil' },
    { key: 'youtube' as const, icon: Youtube, label: 'YouTube', placeholder: 'youtube.com/@seucanal' },
    { key: 'tiktok' as const, icon: Video, label: 'TikTok', placeholder: '@seutiktok' },
  ]

  return (
    <>
      <DashboardHeader />
      <DashboardLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Page Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-1">Cartão de Visitas Digital</h1>
            <p className="text-muted-foreground text-sm">
              Personalize seu cartão de visitas digital com suas informações de contato e redes sociais
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-2 space-y-5">

              {/* Contact Info */}
              <div className="dash-card p-6">
                <SectionHeader icon={Phone} title="Informações de Contato" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Telefone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="phone" value={businessCard.phone || ''} onChange={e => hc('phone', e.target.value)} placeholder="(00) 00000-0000" className="pl-10 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" value={businessCard.email || ''} onChange={e => hc('email', e.target.value)} placeholder="seu@email.com" className="pl-10 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="website" value={businessCard.website || ''} onChange={e => hc('website', e.target.value)} placeholder="www.seusite.com.br" className="pl-10 rounded-xl" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="dash-card p-6">
                <SectionHeader icon={Instagram} title="Redes Sociais" />
                <div className="space-y-4">
                  {socialLinks.map(social => (
                    <div key={social.key} className="space-y-1.5">
                      <Label htmlFor={social.key}>{social.label}</Label>
                      <div className="relative">
                        <social.icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id={social.key} value={businessCard[social.key] || ''} onChange={e => hc(social.key, e.target.value)} placeholder={social.placeholder} className="pl-10 rounded-xl" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div className="dash-card p-6">
                <SectionHeader icon={MapPin} title="Endereço" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="address">Logradouro</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="address" value={businessCard.address || ''} onChange={e => hc('address', e.target.value)} placeholder="Rua, Avenida, etc." className="pl-10 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="addressNumber">Número</Label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="addressNumber" value={businessCard.addressNumber || ''} onChange={e => hc('addressNumber', e.target.value)} placeholder="123" className="pl-10 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="addressComplement">Complemento</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="addressComplement" value={businessCard.addressComplement || ''} onChange={e => hc('addressComplement', e.target.value)} placeholder="Apto, Sala, etc." className="pl-10 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input id="neighborhood" value={businessCard.neighborhood || ''} onChange={e => hc('neighborhood', e.target.value)} placeholder="Seu bairro" className="rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input id="zipCode" value={businessCard.zipCode || ''} onChange={e => hc('zipCode', e.target.value)} placeholder="00000-000" className="rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" value={businessCard.city || ''} onChange={e => hc('city', e.target.value)} placeholder="Sua cidade" className="rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="state">Estado</Label>
                    <Input id="state" value={businessCard.state || ''} onChange={e => hc('state', e.target.value)} placeholder="SP" maxLength={2} className="rounded-xl uppercase" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="dash-card p-6">
                <SectionHeader icon={Globe} title="Descrição" />
                <div className="space-y-1.5">
                  <Label htmlFor="description">Sobre o cartão</Label>
                  <Textarea id="description" value={businessCard.description || ''} onChange={e => hc('description', e.target.value)} placeholder="Uma breve descrição sobre seus serviços..." className="rounded-xl min-h-[100px] resize-none" />
                </div>
              </div>

              {/* Services */}
              <div className="dash-card p-6">
                <SectionHeader icon={Tag} title="Serviços" />
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input value={newService} onChange={e => setNewService(e.target.value)} onKeyPress={handleKeyPress} placeholder="Adicionar serviço" className="pl-10 rounded-xl" />
                    </div>
                    <Button onClick={handleAddService} variant="outline" size="icon" className="rounded-xl border-border/60">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {businessCard.services.map(service => (
                      <Badge key={service} variant="secondary" className="px-3 py-1.5 text-sm flex items-center gap-2 bg-primary/10 text-primary border-primary/20">
                        {service}
                        <button onClick={() => handleRemoveService(service)} className="hover:text-primary/70 transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {businessCard.services.length === 0 && (
                      <p className="text-sm text-muted-foreground">Nenhum serviço adicionado ainda</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pb-4">
                <Button
                  onClick={handleViewCard}
                  disabled={!profile?.slug}
                  variant="outline"
                  className="rounded-xl border-border/60 h-11 sm:h-10"
                >
                  <Eye className="h-4 w-4 mr-2 flex-shrink-0" />
                  Visualizar Cartão
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-xl bg-gradient-to-r from-primary to-orange-600 text-white shadow-lg shadow-primary/25 h-11 sm:h-10"
                >
                  {isSaving
                    ? <><Loader2 className="h-4 w-4 mr-2 animate-spin flex-shrink-0" />Salvando...</>
                    : <><Save className="h-4 w-4 mr-2 flex-shrink-0" />Salvar Cartão de Visitas</>}
                </Button>
              </div>
            </div>

            {/* Preview */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="dash-card overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-br from-primary to-orange-600 p-6 text-white">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-16 w-16 border-2 border-white/30">
                        <AvatarImage src={profile?.profileImageUrl || undefined} />
                        <AvatarFallback className="bg-white/20 text-white font-bold text-xl">
                          {profile?.fullName?.charAt(0) || session?.user?.name?.charAt(0) || 'P'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-display font-bold text-xl">{profile?.fullName || session?.user?.name || 'Profissional'}</h3>
                        <p className="text-white/80 text-sm">{profile?.title || 'Especialista'}</p>
                        <p className="text-white/60 text-xs">{profile?.specialty || ''}</p>
                      </div>
                    </div>
                    {businessCard.description && (
                      <p className="text-white/90 text-sm">{businessCard.description}</p>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-4">
                    {/* Contact */}
                    {(businessCard.phone || businessCard.email || businessCard.website) && (
                      <div className="space-y-2.5">
                        <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Contato</h4>
                        {businessCard.phone && (
                          <a href={`tel:${businessCard.phone}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                            <Phone className="h-4 w-4" />{businessCard.phone}
                          </a>
                        )}
                        {businessCard.email && (
                          <a href={`mailto:${businessCard.email}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                            <Mail className="h-4 w-4" />{businessCard.email}
                          </a>
                        )}
                        {businessCard.website && (
                          <a href={businessCard.website.startsWith('http') ? businessCard.website : `https://${businessCard.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                            <Globe className="h-4 w-4" /><span className="truncate">{businessCard.website}</span><ExternalLink className="h-3 w-3 ml-auto" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Social */}
                    {(businessCard.instagram || businessCard.facebook || businessCard.linkedin || businessCard.youtube || businessCard.tiktok) && (
                      <div className="space-y-2.5">
                        <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Redes Sociais</h4>
                        <div className="flex flex-wrap gap-2">
                          {businessCard.instagram && <a href={`https://instagram.com/${businessCard.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white hover:scale-110 transition-transform"><Instagram className="h-4 w-4" /></a>}
                          {businessCard.facebook && <a href={businessCard.facebook.startsWith('http') ? businessCard.facebook : `https://facebook.com/${businessCard.facebook}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white hover:scale-110 transition-transform"><Facebook className="h-4 w-4" /></a>}
                          {businessCard.linkedin && <a href={businessCard.linkedin.startsWith('http') ? businessCard.linkedin : `https://linkedin.com/in/${businessCard.linkedin}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center text-white hover:scale-110 transition-transform"><Linkedin className="h-4 w-4" /></a>}
                          {businessCard.youtube && <a href={businessCard.youtube.startsWith('http') ? businessCard.youtube : `https://youtube.com/${businessCard.youtube}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white hover:scale-110 transition-transform"><Youtube className="h-4 w-4" /></a>}
                          {businessCard.tiktok && <a href={`https://tiktok.com/@${businessCard.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white hover:scale-110 transition-transform"><Video className="h-4 w-4" /></a>}
                        </div>
                      </div>
                    )}

                    {/* Address */}
                    {(businessCard.address || businessCard.city) && (
                      <div className="space-y-2.5">
                        <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Endereço</h4>
                        <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <div>
                            {businessCard.address && <p>{businessCard.address}{businessCard.addressNumber ? `, ${businessCard.addressNumber}` : ''}</p>}
                            {businessCard.addressComplement && <p className="text-xs">{businessCard.addressComplement}</p>}
                            {(businessCard.neighborhood || businessCard.city || businessCard.state) && (
                              <p>{[businessCard.neighborhood, businessCard.city, businessCard.state].filter(Boolean).join(' - ')}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Services */}
                    {businessCard.services.length > 0 && (
                      <div className="space-y-2.5">
                        <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Serviços</h4>
                        <div className="flex flex-wrap gap-2">
                          {businessCard.services.map(service => (
                            <Badge key={service} variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </DashboardLayout>
    </>
  )
}

function SectionHeader({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <h3 className="font-display font-bold text-lg text-foreground">{title}</h3>
    </div>
  )
}
