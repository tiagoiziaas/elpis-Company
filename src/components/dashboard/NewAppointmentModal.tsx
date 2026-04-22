'use client'

import { useState, useEffect } from 'react'
import { Save, Calendar, Clock, User, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

interface NewAppointmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const SESSION_TYPES = [
  'Consulta Inicial',
  'Consulta de Retorno',
  'Sessão de Acompanhamento',
  'Teleconsulta',
  'Avaliação Nutricional',
  'Acompanhamento Psicológico',
  'Outro',
]

export function NewAppointmentModal({ open, onOpenChange, onSuccess }: NewAppointmentModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [patients, setPatients] = useState<Array<{ id: string; firstName: string; lastName: string; email?: string; phone?: string; defaultConsultationType?: string; defaultConsultationValue?: string }>>([])
  const [form, setForm] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    date: '',
    startTime: '',
    endTime: '',
    type: '',
    value: '',
    notes: '',
    selectedPatientId: '',
  })

  // Fetch existing patients when modal opens
  useEffect(() => {
    if (open) {
      fetch('/api/professional/patients')
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data?.patients) setPatients(data.patients) })
        .catch(() => {})
    }
  }, [open])

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSelectPatient = (patientId: string) => {
    const p = patients.find(p => p.id === patientId)
    if (p) {
      setForm(prev => ({
        ...prev,
        selectedPatientId: patientId,
        patientName: `${p.firstName} ${p.lastName}`,
        patientEmail: p.email || '',
        patientPhone: p.phone || '',
        type: p.defaultConsultationType || '',
        value: p.defaultConsultationValue || '',
      }))
    }
  }

  const handleSave = async () => {
    if (!form.date || !form.startTime || !form.endTime) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Data, horário de início e horário de fim são obrigatórios.',
        variant: 'destructive',
      })
      return
    }

    if (!form.patientName && !form.selectedPatientId) {
      toast({
        title: 'Informe o paciente',
        description: 'Selecione um paciente existente ou informe o nome.',
        variant: 'destructive',
      })
      return
    }

    // Validate end time is after start time
    if (form.startTime >= form.endTime) {
      toast({
        title: 'Horário inválido',
        description: 'O horário de fim deve ser maior que o horário de início.',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/professional/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: form.patientName,
          patientEmail: form.patientEmail,
          patientPhone: form.patientPhone,
          scheduledDate: form.date,
          scheduledTime: form.startTime,
          scheduledEndTime: form.endTime,
          consultationValue: form.value ? parseFloat(form.value) : null,
          attendanceType: form.type === 'Teleconsulta' ? 'ONLINE' : 'IN_PERSON',
          notes: form.notes,
          status: 'PENDING',
        }),
      })

      if (response.ok) {
        toast({
          title: 'Agendamento criado!',
          description: `Consulta de ${form.patientName} agendada para ${new Date(form.date).toLocaleDateString('pt-BR')}.`,
        })
        onSuccess()
        onOpenChange(false)
        setForm({
          patientName: '', patientEmail: '', patientPhone: '',
          date: '', startTime: '', endTime: '', type: '', value: '', notes: '', selectedPatientId: '',
        })
      } else {
        throw new Error('Failed to create appointment')
      }
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro ao criar agendamento',
        description: 'Não foi possível criar o agendamento. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-display font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-elpis-orange" />
            Novo Agendamento
          </DialogTitle>
          <DialogDescription>
            Agende uma nova consulta para um paciente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Patient */}
          <div className="space-y-4">
            <h4 className="font-semibold text-elpis-black flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-elpis-orange/10 text-elpis-orange text-xs flex items-center justify-center font-bold">1</span>
              Paciente
            </h4>

            {patients.length > 0 && (
              <div className="space-y-2">
                <Label>Paciente Cadastrado</Label>
                <Select value={form.selectedPatientId} onValueChange={handleSelectPatient}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Selecionar paciente existente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.firstName} {p.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="patientName">Nome do Paciente *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="patientName"
                    value={form.patientName}
                    onChange={e => handleChange('patientName', e.target.value)}
                    placeholder="Nome completo"
                    className="pl-10 rounded-lg"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientEmail">Email</Label>
                <Input
                  id="patientEmail"
                  type="email"
                  value={form.patientEmail}
                  onChange={e => handleChange('patientEmail', e.target.value)}
                  placeholder="email@exemplo.com"
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientPhone">Telefone</Label>
                <Input
                  id="patientPhone"
                  value={form.patientPhone}
                  onChange={e => handleChange('patientPhone', e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-4">
            <h4 className="font-semibold text-elpis-black flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-elpis-orange/10 text-elpis-orange text-xs flex items-center justify-center font-bold">2</span>
              Data e Horário
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="aptDate">Data *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="aptDate"
                    type="date"
                    min={today}
                    value={form.date}
                    onChange={e => handleChange('date', e.target.value)}
                    className="pl-10 rounded-lg"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="aptStartTime">Hora Início *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="aptStartTime"
                    type="time"
                    value={form.startTime}
                    onChange={e => handleChange('startTime', e.target.value)}
                    className="pl-10 rounded-lg"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="aptEndTime">Hora Fim *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="aptEndTime"
                    type="time"
                    value={form.endTime}
                    onChange={e => handleChange('endTime', e.target.value)}
                    className="pl-10 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="aptNotes">Observações</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="aptNotes"
                value={form.notes}
                onChange={e => handleChange('notes', e.target.value)}
                placeholder="Observações sobre a consulta..."
                className="pl-10 rounded-lg min-h-[80px]"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="rounded-xl bg-elpis-orange hover:bg-elpis-orange-dark text-white shadow-lg shadow-elpis-orange/25"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Salvando...</>
            ) : (
              <><Save className="h-4 w-4 mr-2" />Criar Agendamento</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
