'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import {
  Save, Bell, Lock, Eye, Globe, Trash2, Loader2, Sun, Moon, Monitor,
  ShieldCheck, ToggleLeft,
} from 'lucide-react'
import { DashboardHeader } from '../Header'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

interface SettingsData { isPublic: boolean; email: string }

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: i * 0.08, ease: [0.22,1,0.36,1] },
})

function SettingsCard({ title, icon: Icon, iconColor, iconBg, children }: {
  title: string; icon: any; iconColor: string; iconBg: string; children: React.ReactNode
}) {
  return (
    <div className="dash-card p-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <h3 className="font-display font-bold text-lg text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState<SettingsData>({ isPublic: true, email: '' })
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [notifications, setNotifications] = useState({ newAppointments: true, reminders: true, messages: true })

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { if (status === 'authenticated') fetchSettings() }, [status])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/professional/settings')
      if (res.ok) {
        const d = await res.json()
        setSettings({ isPublic: d.settings?.isPublic ?? true, email: d.settings?.email || '' })
      }
    } catch {} finally { setLoading(false) }
  }

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true)
      const res = await fetch('/api/professional/settings', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: { isPublic: settings.isPublic } }),
      })
      if (res.ok) toast({ title: 'Configurações salvas!', description: 'Suas preferências foram atualizadas.' })
      else throw new Error()
    } catch { toast({ title: 'Erro ao salvar', variant: 'destructive' }) }
    finally { setIsSaving(false) }
  }

  const handleSavePassword = async () => {
    if (passwords.new !== passwords.confirm) { toast({ title: 'Senhas não conferem', variant: 'destructive' }); return }
    if (passwords.new.length < 6) { toast({ title: 'Senha muito curta. Mínimo 6 caracteres.', variant: 'destructive' }); return }
    try {
      setIsSaving(true)
      const res = await fetch('/api/professional/settings', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: { current: passwords.current, new: passwords.new } }),
      })
      if (res.ok) { toast({ title: 'Senha alterada!' }); setPasswords({ current: '', new: '', confirm: '' }) }
      else { const e = await res.json(); throw new Error(e.error) }
    } catch (e: any) { toast({ title: 'Erro ao alterar senha', description: e.message, variant: 'destructive' }) }
    finally { setIsSaving(false) }
  }

  if (status === 'unauthenticated') redirect('/login')

  if (loading) {
    return (
      <>
        <DashboardHeader />
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Carregando configurações...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <DashboardHeader />
      <DashboardLayout>

        {/* Header */}
        <motion.div {...stagger(0)} className="mb-8">
          <h1 className="font-display font-bold text-3xl text-foreground mb-1">Configurações</h1>
          <p className="text-muted-foreground text-sm">Gerencie suas preferências e configurações da conta</p>
        </motion.div>

        <div className="space-y-5">

          {/* ── Aparência ── */}
          {mounted && (
            <motion.div {...stagger(1)}>
              <SettingsCard title="Aparência" icon={Sun} iconColor="text-amber-600 dark:text-amber-400" iconBg="bg-amber-50 dark:bg-amber-900/20">
                <p className="text-sm text-muted-foreground mb-4">Escolha como o Elpis deve aparecer para você. A opção Automático segue o tema do sistema.</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light',  icon: Sun,     label: 'Claro',   desc: 'Tema claro' },
                    { value: 'dark',   icon: Moon,    label: 'Escuro',  desc: 'Tema escuro' },
                    { value: 'system', icon: Monitor, label: 'Automático', desc: 'Seguir sistema' },
                  ].map(({ value, icon: Icon, label, desc }) => (
                    <button
                      key={value}
                      onClick={() => setTheme(value)}
                      className={cn(
                        'relative flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all duration-200',
                        theme === value
                          ? 'border-primary bg-primary/8 dark:bg-primary/15 shadow-md shadow-primary/15'
                          : 'border-border/60 hover:border-primary/30 hover:bg-muted/40'
                      )}
                    >
                      {theme === value && (
                        <motion.div
                          layoutId="theme-indicator"
                          className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary"
                        />
                      )}
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center',
                        theme === value ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-center">
                        <p className={cn('text-sm font-semibold', theme === value ? 'text-primary' : 'text-foreground')}>{label}</p>
                        <p className="text-[10px] text-muted-foreground">{desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </SettingsCard>
            </motion.div>
          )}

          {/* ── Notificações ── */}
          <motion.div {...stagger(2)}>
            <SettingsCard title="Notificações" icon={Bell} iconColor="text-primary" iconBg="bg-primary/10">
              <div className="space-y-4">
                {[
                  { key: 'newAppointments', label: 'Novos Agendamentos', desc: 'Receba alertas quando novos agendamentos forem criados' },
                  { key: 'reminders',       label: 'Lembretes de Consulta', desc: 'Lembretes automáticos antes das consultas' },
                  { key: 'messages',        label: 'Mensagens de Pacientes', desc: 'Notificações quando receber mensagens' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/40 transition-colors">
                    <div>
                      <p className="font-medium text-foreground text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={v => setNotifications(prev => ({ ...prev, [item.key]: v }))}
                    />
                  </div>
                ))}
              </div>
            </SettingsCard>
          </motion.div>

          {/* ── Privacidade ── */}
          <motion.div {...stagger(3)}>
            <SettingsCard title="Privacidade" icon={Eye} iconColor="text-blue-600 dark:text-blue-400" iconBg="bg-blue-50 dark:bg-blue-900/20">
              <div className="space-y-3">
                {[
                  { key: 'isPublic', label: 'Perfil Público', desc: 'Seu perfil estará visível para pacientes na plataforma' },
                  { key: 'showAvailability', label: 'Mostrar Disponibilidade', desc: 'Exibir seus horários disponíveis publicamente' },
                ].map((item, i) => (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/40 transition-colors">
                    <div>
                      <p className="font-medium text-foreground text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <Switch
                      checked={i === 0 ? settings.isPublic : true}
                      onCheckedChange={v => { if (i === 0) setSettings(prev => ({ ...prev, isPublic: v })) }}
                    />
                  </div>
                ))}
              </div>
            </SettingsCard>
          </motion.div>

          {/* ── Segurança ── */}
          <motion.div {...stagger(4)}>
            <SettingsCard title="Segurança" icon={ShieldCheck} iconColor="text-emerald-600 dark:text-emerald-400" iconBg="bg-emerald-50 dark:bg-emerald-900/20">
              <div className="space-y-4">
                {[
                  { id: 'currentPassword', label: 'Senha Atual',          key: 'current' },
                  { id: 'newPassword',     label: 'Nova Senha',           key: 'new' },
                  { id: 'confirmPassword', label: 'Confirmar Nova Senha', key: 'confirm' },
                ].map(field => (
                  <div key={field.id} className="space-y-1.5">
                    <Label htmlFor={field.id} className="text-sm font-semibold text-foreground/80">{field.label}</Label>
                    <Input
                      id={field.id}
                      type="password"
                      value={passwords[field.key as keyof typeof passwords]}
                      onChange={e => setPasswords(prev => ({ ...prev, [field.key]: e.target.value }))}
                      className="rounded-xl"
                    />
                  </div>
                ))}
                <Button
                  onClick={handleSavePassword}
                  disabled={isSaving || !passwords.current || !passwords.new || !passwords.confirm}
                  variant="outline"
                  className="rounded-xl border-border/60 mt-2"
                >
                  {isSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Alterando...</> : <><Lock className="h-4 w-4 mr-2" />Alterar Senha</>}
                </Button>
              </div>
            </SettingsCard>
          </motion.div>

          {/* ── Zona de Perigo ── */}
          <motion.div {...stagger(5)}>
            <div className="dash-card overflow-hidden border-red-200/60 dark:border-red-900/40">
              <div className="flex items-center gap-3 px-6 py-5 border-b border-red-200/60 dark:border-red-900/40 bg-red-50/50 dark:bg-red-900/10">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-display font-bold text-lg text-foreground">Zona de Perigo</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/40 rounded-xl">
                  <p className="text-sm text-red-700 dark:text-red-400">⚠️ Cuidado: Estas ações são permanentes e não podem ser desfeitas.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="flex-1 rounded-xl border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10">
                    Desativar Conta Temporariamente
                  </Button>
                  <Button variant="destructive" className="flex-1 rounded-xl">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir Conta Permanentemente
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Save */}
          <motion.div {...stagger(6)} className="flex justify-end pb-4">
            <Button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="rounded-xl bg-gradient-to-r from-primary to-orange-600 text-white shadow-lg shadow-primary/25"
            >
              {isSaving
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Salvando...</>
                : <><Save className="h-4 w-4 mr-2" />Salvar Configurações</>}
            </Button>
          </motion.div>
        </div>
      </DashboardLayout>
    </>
  )
}
