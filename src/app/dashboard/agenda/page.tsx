'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar as CalendarIcon, Clock, Plus, Check, X, Loader2,
  CheckCircle2, XCircle, AlertCircle, ChevronLeft, ChevronRight,
  User, Phone, Mail, Stethoscope,
} from 'lucide-react'
import { DashboardHeader } from '../Header'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { NewAppointmentModal } from '@/components/dashboard/NewAppointmentModal'
import { cn } from '@/lib/utils'

interface Appointment {
  id: string; patient: string; patientEmail: string; patientPhone: string
  date: string; time: string; type: string; status: string; value: number
  notes?: string | null; serviceId?: string | null
}
interface AvailabilityRule {
  id: string; weekDay: number; startTime: string; endTime: string; active: boolean
}

const weekDays = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado']
const weekLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const monthNames = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
]

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: i * 0.08, ease: [0.22,1,0.36,1] },
})

const statusConfig: Record<string, { label: string; icon: any; cls: string; dot: string }> = {
  confirmed: { label: 'Confirmado', icon: CheckCircle2, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800', dot: 'bg-emerald-500' },
  pending:   { label: 'Pendente',   icon: AlertCircle,  cls: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800', dot: 'bg-amber-400' },
  cancelled: { label: 'Cancelado',  icon: XCircle,      cls: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800', dot: 'bg-red-500' },
  completed: { label: 'Concluído',  icon: CheckCircle2, cls: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800', dot: 'bg-blue-500' },
  no_show:   { label: 'Faltou',     icon: XCircle,      cls: 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800', dot: 'bg-gray-400' },
}

function toLocalDateKey(isoDate: string): string {
  // scheduledDate is stored as ISO; extract YYYY-MM-DD in local timezone
  const d = new Date(isoDate)
  const year = d.getUTCFullYear()
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function AgendaPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [availability, setAvailability] = useState<AvailabilityRule[]>([])
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false)

  // Calendar state
  const today = new Date()
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [dayPanelOpen, setDayPanelOpen] = useState(false)

  useEffect(() => { if (status === 'authenticated') fetchAgenda() }, [status])

  const fetchAgenda = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/professional/appointments')
      if (res.ok) {
        const data = await res.json()
        setAppointments(data.appointments)
        const availRes = await fetch('/api/professional/availability')
        if (availRes.ok) setAvailability((await availRes.json()).availability)
      }
    } catch {
      toast({ title: 'Erro ao carregar agenda', variant: 'destructive' })
    } finally { setLoading(false) }
  }

  const handleConfirm = async (id: string) => {
    const res = await fetch('/api/professional/appointments', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'CONFIRMED' }) })
    if (res.ok) { setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'confirmed' } : a)); toast({ title: 'Consulta confirmada!' }) }
  }

  const handleCancel = async (id: string) => {
    if (!confirm('Cancelar este agendamento?')) return
    const res = await fetch('/api/professional/appointments', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'CANCELLED' }) })
    if (res.ok) { setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a)); toast({ title: 'Consulta cancelada' }) }
  }

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1).getDay()
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
    const days: Array<{ key: string; day: number | null }> = []
    for (let i = 0; i < firstDay; i++) days.push({ key: `empty-${i}`, day: null })
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      days.push({ key, day: d })
    }
    return days
  }, [calMonth, calYear])

  // Map appointments by date key
  const appointmentsByDay = useMemo(() => {
    const map: Record<string, Appointment[]> = {}
    for (const appt of appointments) {
      const dk = toLocalDateKey(appt.date)
      if (!map[dk]) map[dk] = []
      map[dk].push(appt)
    }
    return map
  }, [appointments])

  const selectedDayAppointments = selectedDay ? (appointmentsByDay[selectedDay] ?? []) : []

  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) }
    else setCalMonth(m => m - 1)
    setSelectedDay(null); setDayPanelOpen(false)
  }
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) }
    else setCalMonth(m => m + 1)
    setSelectedDay(null); setDayPanelOpen(false)
  }

  const handleDayClick = (key: string) => {
    if (selectedDay === key && dayPanelOpen) { setDayPanelOpen(false); setSelectedDay(null) }
    else { setSelectedDay(key); setDayPanelOpen(true) }
  }

  if (status === 'unauthenticated') redirect('/login')

  if (loading) {
    return (
      <>
        <DashboardHeader />
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Carregando agenda...</p>
          </div>
        </div>
      </>
    )
  }

  const upcomingAppointments = appointments
    .filter(a => a.status !== 'cancelled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const availabilityData = weekDays.map((day, idx) => {
    const rule = availability.find(r => r.weekDay === idx)
    return { day, start: rule?.active ? rule.startTime : '-', end: rule?.active ? rule.endTime : '-', active: rule?.active || false }
  })

  const confirmed = appointments.filter(a => a.status === 'confirmed').length
  const pending   = appointments.filter(a => a.status === 'pending').length
  const cancelled = appointments.filter(a => a.status === 'cancelled').length

  return (
    <>
      <DashboardHeader />
      <DashboardLayout>

        {/* Header */}
        <motion.div {...stagger(0)} className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display font-bold text-3xl text-foreground mb-1">Agenda</h1>
            <p className="text-muted-foreground text-sm">Gerencie seus horários e agendamentos</p>
          </div>
          <Button
            onClick={() => setIsNewAppointmentOpen(true)}
            className="rounded-xl bg-gradient-to-r from-primary to-orange-600 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Agendamento
          </Button>
        </motion.div>

        {/* Quick stats */}
        <motion.div {...stagger(1)} className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: CheckCircle2, label: 'Confirmados',  value: confirmed, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
            { icon: AlertCircle,  label: 'Pendentes',    value: pending,   color: 'text-amber-600 dark:text-amber-400',    bg: 'bg-amber-50 dark:bg-amber-900/20' },
            { icon: XCircle,      label: 'Cancelados',   value: cancelled, color: 'text-red-600 dark:text-red-400',        bg: 'bg-red-50 dark:bg-red-900/20' },
          ].map((s, i) => (
            <div key={i} className="dash-card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="font-bold text-xl text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ───── MONTHLY CALENDAR ───── */}
        <motion.div {...stagger(2)} className="dash-card overflow-hidden mb-6">
          {/* Calendar header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <CalendarIcon className="h-4 w-4 text-primary" />
              </div>
              <h2 className="font-display font-bold text-lg text-foreground">
                {monthNames[calMonth]} {calYear}
              </h2>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-lg text-xs px-3 h-8"
                onClick={() => { setCalMonth(today.getMonth()); setCalYear(today.getFullYear()); setSelectedDay(null); setDayPanelOpen(false) }}
              >
                Hoje
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 px-6 py-3 border-b border-border/30 flex-wrap">
            {[
              { dot: 'bg-emerald-500', label: 'Confirmado' },
              { dot: 'bg-amber-400',   label: 'Pendente' },
              { dot: 'bg-red-500',     label: 'Cancelado' },
              { dot: 'bg-blue-500',    label: 'Concluído' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Week header */}
          <div className="grid grid-cols-7 border-b border-border/30">
            {weekLabels.map(d => (
              <div key={d} className="py-2.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {calendarDays.map(({ key, day }, idx) => {
              if (!day) return <div key={key} className="min-h-[88px] border-b border-r border-border/20 bg-muted/10" />

              const dayAppts = appointmentsByDay[key] ?? []
              const isToday = key === todayKey
              const isSelected = selectedDay === key
              const hasConfirmed = dayAppts.some(a => a.status === 'confirmed')
              const hasPending   = dayAppts.some(a => a.status === 'pending')
              const hasCancelled = dayAppts.some(a => a.status === 'cancelled')
              const hasCompleted = dayAppts.some(a => a.status === 'completed')

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.005, duration: 0.2 }}
                  onClick={() => dayAppts.length > 0 && handleDayClick(key)}
                  className={cn(
                    'min-h-[88px] border-b border-r border-border/20 p-2 transition-all duration-150 relative',
                    dayAppts.length > 0 ? 'cursor-pointer' : 'cursor-default',
                    isSelected
                      ? 'bg-primary/8 ring-2 ring-inset ring-primary/30'
                      : dayAppts.length > 0 ? 'hover:bg-muted/40' : '',
                  )}
                >
                  {/* Day number */}
                  <div className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold mb-1.5 transition-colors',
                    isToday
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground',
                  )}>
                    {day}
                  </div>

                  {/* Status dots */}
                  {dayAppts.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {hasConfirmed && <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" title="Confirmado" />}
                      {hasPending   && <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" title="Pendente" />}
                      {hasCancelled && <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" title="Cancelado" />}
                      {hasCompleted && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" title="Concluído" />}
                    </div>
                  )}

                  {/* Appointment pills (up to 2 visible) */}
                  <div className="space-y-0.5">
                    {dayAppts.slice(0, 2).map(appt => {
                      const sc = statusConfig[appt.status] ?? statusConfig['pending']
                      return (
                        <div
                          key={appt.id}
                          className={cn(
                            'text-[10px] leading-tight px-1.5 py-0.5 rounded-md font-medium truncate border',
                            sc.cls
                          )}
                          title={appt.patient}
                        >
                          {appt.time} {appt.patient.split(' ')[0]}
                        </div>
                      )
                    })}
                    {dayAppts.length > 2 && (
                      <div className="text-[10px] text-muted-foreground font-medium px-1">
                        +{dayAppts.length - 2} mais
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Day detail panel */}
          <AnimatePresence>
            {dayPanelOpen && selectedDay && (
              <motion.div
                key="day-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden border-t border-border/50"
              >
                <div className="px-6 py-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-bold text-base text-foreground">
                      {(() => {
                        const [y, m, d] = selectedDay.split('-').map(Number)
                        return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
                      })()}
                    </h3>
                    <button
                      onClick={() => { setDayPanelOpen(false); setSelectedDay(null) }}
                      className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-muted/60 text-muted-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {selectedDayAppointments
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((appt, i) => {
                        const sc = statusConfig[appt.status] ?? statusConfig['pending']
                        const Icon = sc.icon
                        return (
                          <motion.div
                            key={appt.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group border border-border/40"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <Avatar className="h-10 w-10 border-2 border-primary/20 flex-shrink-0">
                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                                  {appt.patient.charAt(0)}{appt.patient.split(' ').pop()?.charAt(0) ?? ''}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-semibold text-foreground truncate">{appt.patient}</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />{appt.time}
                                  </span>
                                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Stethoscope className="h-3 w-3" />{appt.type}
                                  </span>
                                  {appt.patientPhone && (
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Phone className="h-3 w-3" />{appt.patientPhone}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                              <Badge className={cn('text-xs px-2.5 py-1 rounded-full font-semibold border whitespace-nowrap', sc.cls)} variant="outline">
                                <Icon className="h-3 w-3 mr-1 inline-block" />
                                {sc.label}
                              </Badge>
                              {appt.status === 'pending' && (
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg" onClick={() => handleConfirm(appt.id)}>
                                    <Check className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" onClick={() => handleCancel(appt.id)}>
                                    <X className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )
                      })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ───── BOTTOM SECTION ───── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Upcoming Appointments */}
          <motion.div {...stagger(3)} className="lg:col-span-2">
            <div className="dash-card overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="font-display font-bold text-lg text-foreground">Próximos Atendimentos</h2>
                </div>
                <Badge variant="outline" className="rounded-xl border-border/60 text-muted-foreground">
                  {upcomingAppointments.length} agendamentos
                </Badge>
              </div>

              {upcomingAppointments.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
                    <CalendarIcon className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Agenda vazia</h3>
                  <p className="text-sm text-muted-foreground">Você não tem agendamentos próximos</p>
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  <AnimatePresence>
                    {upcomingAppointments.map((appt, i) => {
                      const sc = statusConfig[appt.status] ?? statusConfig['pending']
                      return (
                        <motion.div
                          key={appt.id}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 12 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors group"
                        >
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 border-2 border-primary/20">
                              <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                                {appt.patient.charAt(0)}{appt.patient.split(' ').pop()?.charAt(0) ?? ''}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-foreground">{appt.patient}</p>
                              <p className="text-sm text-muted-foreground">{appt.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                              <div className="flex items-center gap-1.5 justify-end mb-0.5">
                                <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground">
                                  {new Date(appt.date).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 justify-end">
                                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{appt.time}</span>
                              </div>
                            </div>
                            <Badge className={cn('text-xs px-2.5 py-1 rounded-full font-semibold border', sc.cls)} variant="outline">
                              {sc.label}
                            </Badge>
                            {appt.status === 'pending' && (
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg" onClick={() => handleConfirm(appt.id)}>
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" onClick={() => handleCancel(appt.id)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>

          {/* Availability */}
          <motion.div {...stagger(4)}>
            <div className="dash-card overflow-hidden h-full">
              <div className="flex items-center gap-2.5 px-6 py-5 border-b border-border/50">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <h2 className="font-display font-bold text-lg text-foreground">Disponibilidade</h2>
              </div>
              <div className="p-4 space-y-2">
                {availabilityData.map((slot, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.04 }}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-xl transition-colors',
                      slot.active ? 'bg-muted/50 hover:bg-muted/80' : 'bg-muted/20 opacity-50'
                    )}
                  >
                    <div>
                      <p className={cn('text-sm font-semibold', slot.active ? 'text-foreground' : 'text-muted-foreground')}>{slot.day}</p>
                      <p className="text-xs text-muted-foreground">{slot.active ? `${slot.start} — ${slot.end}` : 'Indisponível'}</p>
                    </div>
                    <div className={cn('w-2.5 h-2.5 rounded-full', slot.active ? 'bg-emerald-500' : 'bg-muted-foreground/30')} />
                  </motion.div>
                ))}
              </div>
              <div className="px-4 pb-4">
                <Button variant="outline" className="w-full rounded-xl border-border/60 hover:border-primary/40">
                  Editar Disponibilidade
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        <NewAppointmentModal open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen} onSuccess={fetchAgenda} />
      </DashboardLayout>
    </>
  )
}
