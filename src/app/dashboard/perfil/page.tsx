'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Save, Upload, Image as ImageIcon, Loader2, User, MapPin,
  Globe, Instagram, Phone, FileText, Link as LinkIcon, ShieldCheck,
} from 'lucide-react'
import { DashboardHeader } from '../Header'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

interface ProfessionalProfile {
  id: string; userId: string; slug: string; fullName: string; title: string
  specialty: string; city: string; state: string; bio?: string | null
  approach?: string | null; headline?: string | null; profileImageUrl?: string | null
  coverImageUrl?: string | null; whatsapp?: string | null; instagram?: string | null
  website?: string | null; isPublic: boolean; councilType?: string | null
  councilNumber?: string | null; user: { name: string; email: string }
}

const COUNCIL_TYPES = [
  { value: 'CRM',     label: 'CRM – Conselho Regional de Medicina' },
  { value: 'CRN',     label: 'CRN – Conselho Regional de Nutrição' },
  { value: 'CREFITO', label: 'CREFITO – Fisioterapia e Terapia Ocupacional' },
  { value: 'CRP',     label: 'CRP – Conselho Regional de Psicologia' },
  { value: 'CRO',     label: 'CRO – Conselho Regional de Odontologia' },
  { value: 'COREN',   label: 'COREN – Conselho Regional de Enfermagem' },
  { value: 'CFF',     label: 'CFF – Conselho Federal de Farmácia' },
  { value: 'COFFITO', label: 'COFFITO – Fisioterapia' },
  { value: 'CFM',     label: 'CFM – Conselho Federal de Medicina' },
  { value: 'CFN',     label: 'CFN – Conselho Federal de Nutrição' },
  { value: 'CFP',     label: 'CFP – Conselho Federal de Psicologia' },
  { value: 'OUTRO',   label: 'Outro' },
]

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: i * 0.08, ease: [0.22,1,0.36,1] },
})

function SectionCard({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="dash-card p-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="h-4.5 w-4.5 text-primary" />
        </div>
        <h3 className="font-display font-bold text-lg text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function FormField({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-semibold text-foreground/80">{label}</Label>
      {children}
    </div>
  )
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    fullName: '', title: '', specialty: '', city: '', state: '',
    bio: '', approach: '', headline: '', whatsapp: '', instagram: '', website: '',
    councilType: '', councilNumber: '',
  })

  useEffect(() => { if (status === 'authenticated') fetchProfile() }, [status])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/professional/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setFormData({
          fullName: data.fullName || '', title: data.title || '',
          specialty: data.specialty || '', city: data.city || '',
          state: data.state || '', bio: data.bio || '',
          approach: data.approach || '', headline: data.headline || '',
          whatsapp: data.whatsapp || '', instagram: data.instagram || '',
          website: data.website || '',
          councilType: data.councilType || '',
          councilNumber: data.councilNumber || '',
        })
      }
    } catch {
      toast({ title: 'Erro ao carregar perfil', variant: 'destructive' })
    } finally { setIsLoading(false) }
  }

  const handlePhotoClick = () => fileInputRef.current?.click()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowed = ['image/jpeg','image/jpg','image/png','image/gif','image/webp']
    if (!allowed.includes(file.type)) { toast({ title: 'Formato inválido. Use JPG, PNG, GIF ou WebP.', variant: 'destructive' }); return }
    if (file.size > 2 * 1024 * 1024) { toast({ title: 'Arquivo muito grande. Máx 2MB.', variant: 'destructive' }); return }
    setPreviewImage(URL.createObjectURL(file))
    setIsUploadingPhoto(true)
    try {
      const fd = new FormData(); fd.append('photo', file)
      const res = await fetch('/api/professional/upload-photo', { method: 'POST', body: fd })
      if (res.ok) {
        const data = await res.json()
        setProfile(prev => prev ? { ...prev, profileImageUrl: data.url } : prev)
        toast({ title: '✅ Foto atualizada!' })
      } else { throw new Error((await res.json()).error) }
    } catch (err: any) {
      setPreviewImage(null)
      toast({ title: 'Erro no upload', description: err.message, variant: 'destructive' })
    } finally {
      setIsUploadingPhoto(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const res = await fetch('/api/professional/profile', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData),
      })
      if (res.ok) { setProfile(await res.json()); toast({ title: 'Perfil atualizado!' }) }
      else throw new Error()
    } catch {
      toast({ title: 'Erro ao salvar', variant: 'destructive', action: <ToastAction altText="Tentar novamente">Tentar novamente</ToastAction> })
    } finally { setIsSaving(false) }
  }

  const hc = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }))

  if (status === 'unauthenticated') redirect('/login')

  if (isLoading) {
    return (
      <>
        <DashboardHeader />
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Carregando perfil...</p>
          </div>
        </div>
      </>
    )
  }

  const currentPhoto = previewImage || profile?.profileImageUrl || undefined

  return (
    <>
      <DashboardHeader />
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      <DashboardLayout>
        {/* Header */}
        <motion.div {...stagger(0)} className="mb-8">
          <h1 className="font-display font-bold text-3xl text-foreground mb-1">Meu Perfil</h1>
          <p className="text-muted-foreground text-sm">Gerencie suas informações públicas e perfil profissional</p>
        </motion.div>

        <div className="space-y-5">

          {/* Photo */}
          <motion.div {...stagger(1)}>
            <div className="dash-card p-6">
              <div
                className={cn(
                  'flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl border-2 border-dashed transition-all duration-200',
                  isDragging ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/40 hover:bg-muted/40'
                )}
                onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) { const dt = new DataTransfer(); dt.items.add(f); if (fileInputRef.current) { fileInputRef.current.files = dt.files; handleFileChange({ target: fileInputRef.current } as any) } } }}
              >
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                    <AvatarImage src={currentPhoto} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-3xl">
                      {profile?.fullName?.charAt(0) || session?.user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={handlePhotoClick}
                    disabled={isUploadingPhoto}
                    className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    {isUploadingPhoto ? <Loader2 className="h-6 w-6 text-white animate-spin" /> : <Upload className="h-6 w-6 text-white" />}
                  </button>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-display font-bold text-xl text-foreground mb-1">Foto de Perfil</h3>
                  <p className="text-sm text-muted-foreground mb-4">Arraste uma imagem ou clique para selecionar (JPG, PNG, GIF · máx 2MB)</p>
                  <Button size="sm" variant="outline" onClick={handlePhotoClick} disabled={isUploadingPhoto} className="rounded-xl border-border/60">
                    {isUploadingPhoto ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Enviando...</> : <><ImageIcon className="h-4 w-4 mr-2" />Alterar Foto</>}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Basic Info */}
          <motion.div {...stagger(2)}>
            <SectionCard title="Informações Básicas" icon={User}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Nome Completo" id="fullName">
                  <Input id="fullName" value={formData.fullName} onChange={e => hc('fullName', e.target.value)} className="rounded-xl" />
                </FormField>
                <FormField label="Título Profissional" id="title">
                  <Input id="title" value={formData.title} onChange={e => hc('title', e.target.value)} placeholder="Ex: Nutricionista" className="rounded-xl" />
                </FormField>
                <FormField label="Especialidade" id="specialty">
                  <Input id="specialty" value={formData.specialty} onChange={e => hc('specialty', e.target.value)} placeholder="Ex: Nutrição Clínica" className="rounded-xl col-span-2" />
                </FormField>
                {/* Conselho Regional */}
                <FormField label="Conselho Regional" id="councilType">
                  <select
                    id="councilType"
                    value={formData.councilType}
                    onChange={e => hc('councilType', e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground"
                  >
                    <option value="">Selecione o conselho...</option>
                    {COUNCIL_TYPES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Número do Registro" id="councilNumber">
                  <Input
                    id="councilNumber"
                    value={formData.councilNumber}
                    onChange={e => hc('councilNumber', e.target.value)}
                    placeholder="Ex: 12345-SP"
                    className="rounded-xl"
                  />
                </FormField>
                <FormField label="Cidade" id="city">
                  <Input id="city" value={formData.city} onChange={e => hc('city', e.target.value)} className="rounded-xl" />
                </FormField>
                <FormField label="Estado" id="state">
                  <Input id="state" value={formData.state} onChange={e => hc('state', e.target.value)} className="rounded-xl" />
                </FormField>
              </div>
            </SectionCard>
          </motion.div>

          {/* Bio */}
          <motion.div {...stagger(3)}>
            <SectionCard title="Sobre" icon={FileText}>
              <div className="space-y-4">
                <FormField label="Frase de Destaque" id="headline">
                  <Input id="headline" value={formData.headline} onChange={e => hc('headline', e.target.value)} placeholder="Ex: Transforme sua saúde através da alimentação" className="rounded-xl" />
                </FormField>
                <FormField label="Biografia" id="bio">
                  <Textarea id="bio" value={formData.bio} onChange={e => hc('bio', e.target.value)} placeholder="Conte sobre sua experiência..." className="rounded-xl min-h-[140px] resize-none" />
                </FormField>
                <FormField label="Abordagem" id="approach">
                  <Textarea id="approach" value={formData.approach} onChange={e => hc('approach', e.target.value)} placeholder="Descreva sua abordagem de trabalho..." className="rounded-xl min-h-[100px] resize-none" />
                </FormField>
              </div>
            </SectionCard>
          </motion.div>

          {/* Contact */}
          <motion.div {...stagger(4)}>
            <SectionCard title="Contato e Redes Sociais" icon={Globe}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="WhatsApp" id="whatsapp">
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="whatsapp" value={formData.whatsapp} onChange={e => hc('whatsapp', e.target.value)} placeholder="(00) 00000-0000" className="rounded-xl pl-10" />
                  </div>
                </FormField>
                <FormField label="Instagram" id="instagram">
                  <div className="relative">
                    <Instagram className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="instagram" value={formData.instagram} onChange={e => hc('instagram', e.target.value)} placeholder="@seuinstagram" className="rounded-xl pl-10" />
                  </div>
                </FormField>
                <div className="md:col-span-2">
                  <FormField label="Website" id="website">
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="website" value={formData.website} onChange={e => hc('website', e.target.value)} placeholder="www.seusite.com.br" className="rounded-xl pl-10" />
                    </div>
                  </FormField>
                </div>
              </div>
            </SectionCard>
          </motion.div>

          {/* Actions */}
          <motion.div {...stagger(5)} className="flex justify-end gap-3 pb-4">
            <Button variant="outline" onClick={fetchProfile} disabled={isSaving} className="rounded-xl border-border/60">
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-xl bg-gradient-to-r from-primary to-orange-600 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
            >
              {isSaving
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Salvando...</>
                : <><Save className="h-4 w-4 mr-2" />Salvar Alterações</>}
            </Button>
          </motion.div>
        </div>
      </DashboardLayout>
    </>
  )
}
